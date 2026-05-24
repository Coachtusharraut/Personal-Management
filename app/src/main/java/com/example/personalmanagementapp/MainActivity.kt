package com.example.personalmanagementapp

// Import standard Android OS and windowing features.
import android.annotation.SuppressLint
import android.content.Intent
import android.net.Uri
import android.os.Bundle
// Import standard WebView client engines.
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
// Import Activity Result launchers to pick files from system picker safely.
import androidx.activity.ComponentActivity
import androidx.activity.result.contract.ActivityResultContracts
import androidx.webkit.WebViewAssetLoader
import android.util.Base64
import java.io.File
import java.io.FileOutputStream
import androidx.core.content.FileProvider
// Import MediaStore content values to handle system downloads.
import android.content.ContentValues
import android.provider.MediaStore
import android.os.Environment
import android.widget.Toast

// Define the main Activity class which launches the Android app screen on boot.
class MainActivity : ComponentActivity() {

    // Variable holding the edge-to-edge interactive WebView window instance.
    private lateinit var webView: WebView
    // ValueCallback reference to receive selected files back from the system picked intent contract.
    private var fileUploadCallback: ValueCallback<Array<Uri>>? = null

    // Register a native file picking activity contract that launches upon file upload request.
    private val selectFileLauncher = registerForActivityResult(
        ActivityResultContracts.GetContent()
    ) { uri: Uri? ->
        // When the user picks a file or cancels the picker dialog
        if (fileUploadCallback != null) {
            // Build the results array containing the selected file's address URI (or null if cancelled).
            val results = if (uri != null) arrayOf(uri) else null
            // Fire the callback method to pass the file URI back to the WebView JavaScript engine.
            fileUploadCallback?.onReceiveValue(results)
            // Reset the callback to null to prevent interface memory leaks.
            fileUploadCallback = null
        }
    }

    // OnCreate is the main bootloader function that executes when the app is launched.
    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        // Call the parent Android class constructor to complete the default system setup.
        super.onCreate(savedInstanceState)

        // Enable Chrome DevTools WebView remote debugging
        WebView.setWebContentsDebuggingEnabled(true)

        // Set up the local asset loader mapping asset files under an virtual https://localhost/ domain.
        // This is crucial because Google OAuth redirect APIs require a secure https redirect address (not file://).
        val assetLoader = WebViewAssetLoader.Builder()
            .setDomain("localhost")
            // Map asset subfolders to localhost path handlers.
            .addPathHandler("/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()

        // Create the WebView layout object programmatically to occupy the full edge-to-edge layout.
        webView = WebView(this).apply {
            // Register our custom native Javascript interface class globally as "AndroidBridge".
            // This exposes native phone download methods directly to the clientside JavaScript engine.
            addJavascriptInterface(WebAppInterface(this@MainActivity), "AndroidBridge")
            
            // Set up all WebView configuration options.
            settings.apply {
                // Enable JavaScript execution (required for database and user interface logic).
                javaScriptEnabled = true
                // Enable local HTML DOM Storage APIs (required to preserve layout and state preferences).
                domStorageEnabled = true
                // Disable direct system file path access to maintain robust Android security rules.
                allowFileAccess = false
                // Enable standard content directory address access paths.
                allowContentAccess = true
                // Disable browser caching completely to guarantee the newly compiled JS/CSS updates are loaded immediately on boot.
                cacheMode = WebSettings.LOAD_NO_CACHE
                // Allow mixed HTTP content modes to load external secure assets seamlessly.
                mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
                // Configure viewport parameters to display pages correctly on mobile screen borders.
                useWideViewPort = true
                // Load page fits inside mobile screen dimensions.
                loadWithOverviewMode = true
                // Hardcode standard scale percentage to prevent system accessibility font size options from breaking the UI.
                textZoom = 100
                // Spoof standard Chrome browser useragent to bypass Google OAuth's disallowed useragentWebView security block.
                userAgentString = "Mozilla/5.0 (Linux; Android 13; SM-S901B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
            }

            // Bind the custom navigation client to manage links inside the WebView.
            webViewClient = object : WebViewClient() {
                // Intercept all page request paths and serve local file assets using WebViewAssetLoader.
                override fun shouldInterceptRequest(
                    view: WebView,
                    request: WebResourceRequest
                ): WebResourceResponse? {
                    return assetLoader.shouldInterceptRequest(request.url)
                }

                // Manage redirection behavior when hyperlinks are clicked.
                override fun shouldOverrideUrlLoading(
                    view: WebView,
                    request: WebResourceRequest
                ): Boolean {
                    val url = request.url.toString()

                    // If navigating back to localhost (e.g. from Google OAuth), intercept and load it programmatically
                    // to bypass Android WebView's cross-origin Private Network Access blocks.
                    if (url.startsWith("http://localhost/") || url.startsWith("https://localhost/")) {
                        if (url.contains("access_token=") || url.contains("error=")) {
                            view.loadUrl(url)
                            return true
                        }
                        return false
                    }

                    // Keep Google OAuth login consent flow windows inside our app WebView.
                    if (url.contains("accounts.google.com")) {
                        return false
                    }

                    // Force calendar links to launch in the phone's native external browser instead of inside.
                    if (url.startsWith("https://calendar.google.com") || url.contains("google.com/calendar")) {
                        try {
                            val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url)).apply {
                                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                            }
                            context.startActivity(intent)
                            return true
                        } catch (e: Exception) {
                            e.printStackTrace()
                        }
                    }

                    // Open other secure HTTPS internet hyperlinks inside the system browser app.
                    if (url.startsWith("https://") || url.startsWith("http://")) {
                        try {
                            val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url)).apply {
                                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                            }
                            context.startActivity(intent)
                            return true
                        } catch (e: Exception) {
                            e.printStackTrace()
                        }
                    }

                    return false
                }
            }

            // Bind the chrome client to manage system pickers, alerts, and loaders.
            webChromeClient = object : WebChromeClient() {
                // Intercept file picker triggers (from <input type="file"> click events).
                override fun onShowFileChooser(
                    webView: WebView?,
                    filePathCallback: ValueCallback<Array<Uri>>?,
                    fileChooserParams: FileChooserParams?
                ): Boolean {
                    // Cancel any previous outstanding file pickers to avoid interface leaks.
                    fileUploadCallback?.onReceiveValue(null)
                    // Set the current callback pointer.
                    fileUploadCallback = filePathCallback

                    // Extract the required file extension filter array passed from HTML input tags.
                    val acceptTypes = fileChooserParams?.acceptTypes
                    // Extract the first filter, defaulting to general wildcard if empty.
                    var mimeType = if (!acceptTypes.isNullOrEmpty() && acceptTypes[0].isNotEmpty()) {
                        acceptTypes[0]
                    } else {
                        "*/*"
                    }

                    // Convert file extension formats to robust MIME categories.
                    if (mimeType.startsWith(".")) {
                        mimeType = when (mimeType.lowercase()) {
                            // Map CSV and Excel formats to general wildcard (*/*) to bypass ColorOS custom picker gray-out bugs.
                            ".csv", ".xlsx", ".xls" -> "*/*"
                            ".png" -> "image/png"
                            ".jpg", ".jpeg" -> "image/jpeg"
                            ".pdf" -> "application/pdf"
                            else -> "*/*"
                        }
                    } else if (mimeType.lowercase() == "text/csv" || mimeType.lowercase() == "application/csv") {
                        // Force standard CSV text categories to wildcard to keep documents selectable on custom brand pickers.
                        mimeType = "*/*"
                    } else if (!mimeType.contains("/")) {
                        mimeType = "*/*"
                    }

                    try {
                        // Fire the native document picker activity launcher with the mapped MIME category filter.
                        selectFileLauncher.launch(mimeType)
                    } catch (e: Exception) {
                        // Cancel the picker callback in case of failure.
                        fileUploadCallback?.onReceiveValue(null)
                        fileUploadCallback = null
                        return false
                    }
                    return true
                }
            }
        }

        // Mount the WebView layout container as the root view of our Activity.
        setContentView(webView)

        // Load our starting local asset HTML page through the secure virtual domain.
        webView.loadUrl("https://localhost/www/index.html")
    }

    // Intercept native physical back button presses.
    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        // If the user is navigating web views and can go back, route the event to WebView history navigation.
        if (::webView.isInitialized && webView.canGoBack()) {
            webView.goBack()
        } else {
            // Otherwise, exit the application or go to background normally.
            @Suppress("DEPRECATION")
            super.onBackPressed()
        }
    }

    // Native Bridge class containing methods exposed to JS script callers in index.html/app.js.
    class WebAppInterface(private val activity: MainActivity) {
        // Expose a native direct download function marked with JavascriptInterface.
        @android.webkit.JavascriptInterface
        fun downloadFile(base64Data: String, fileName: String, mimeType: String) {
            // Force the operation to run on the main Android application thread.
            activity.runOnUiThread {
                try {
                    // Step A: Convert the Base64 data string back into a standard raw binary byte array.
                    val bytes = Base64.decode(base64Data, Base64.DEFAULT)
                    // Step B: Grab the system content resolver handle.
                    val contentResolver = activity.contentResolver
                    // Step C: Build the target file properties inside system ContentValues.
                    val contentValues = ContentValues().apply {
                        // Set the saved file display name.
                        put(MediaStore.MediaColumns.DISPLAY_NAME, fileName)
                        // Map the category MIME type.
                        put(MediaStore.MediaColumns.MIME_TYPE, mimeType)
                        // Specify the relative directory path pointing directly to the public /Downloads folder.
                        put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS)
                    }

                    // Step D: Write the file properties database entry and fetch the storage content address URI.
                    val uri = contentResolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, contentValues)
                    if (uri != null) {
                        // Step E: Open a write stream directly into the resolved storage content URI.
                        contentResolver.openOutputStream(uri).use { outputStream ->
                            // Write the raw binary bytes to the phone storage.
                            outputStream?.write(bytes)
                        }
                        // Alert the trainer with a toast confirmation displaying the saved filename.
                        Toast.makeText(activity, "Saved to Downloads: $fileName", Toast.LENGTH_LONG).show()
                    } else {
                        // Alert the trainer if the storage entry insertion failed.
                        Toast.makeText(activity, "Failed to download file.", Toast.LENGTH_SHORT).show()
                    }
                } catch (e: Exception) {
                    // Log the detailed system error stack trace in the debugger.
                    e.printStackTrace()
                    // Alert the trainer with the detailed exception message toast.
                    Toast.makeText(activity, "Download failed: ${e.message}", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }
}
