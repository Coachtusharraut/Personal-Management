package com.example.personalmanagementapp

import android.annotation.SuppressLint
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.OnBackPressedCallback
import androidx.webkit.WebViewAssetLoader
import android.util.Base64
import android.content.ContentValues
import android.provider.MediaStore
import android.os.Build
import android.os.Environment
import android.widget.Toast

class MainActivity : ComponentActivity() {

    private lateinit var webView: WebView
    private var fileUploadCallback: ValueCallback<Array<Uri>>? = null

    private val selectFileLauncher = registerForActivityResult(
        ActivityResultContracts.GetContent()
    ) { uri: Uri? ->
        if (fileUploadCallback != null) {
            val results = if (uri != null) arrayOf(uri) else null
            fileUploadCallback?.onReceiveValue(results)
            fileUploadCallback = null
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        WebView.setWebContentsDebuggingEnabled(true)

        val assetLoader = WebViewAssetLoader.Builder()
            .setDomain("localhost")
            .addPathHandler("/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()

        webView = WebView(this).apply {

            addJavascriptInterface(WebAppInterface(this@MainActivity), "AndroidBridge")

            settings.apply {
                javaScriptEnabled = true
                domStorageEnabled = true
                allowFileAccess = false
                allowContentAccess = true
                cacheMode = WebSettings.LOAD_NO_CACHE
                mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
                useWideViewPort = true
                loadWithOverviewMode = true
                textZoom = 100
                userAgentString =
                    "Mozilla/5.0 (Linux; Android 13; SM-S901B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
            }

            webViewClient = object : WebViewClient() {

                override fun shouldInterceptRequest(
                    view: WebView,
                    request: WebResourceRequest
                ): WebResourceResponse? {
                    return assetLoader.shouldInterceptRequest(request.url)
                }

                override fun shouldOverrideUrlLoading(
                    view: WebView,
                    request: WebResourceRequest
                ): Boolean {

                    val url = request.url.toString()

                    if (url.startsWith("http://localhost/") || url.startsWith("https://localhost/")) {
                        if (url.contains("access_token=") || url.contains("error=")) {
                            view.loadUrl(url)
                            return true
                        }
                        return false
                    }

                    if (url.contains("accounts.google.com")) {
                        return false
                    }

                    if (url.startsWith("https://calendar.google.com") ||
                        url.contains("google.com/calendar")
                    ) {
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

            webChromeClient = object : WebChromeClient() {

                override fun onShowFileChooser(
                    webView: WebView?,
                    filePathCallback: ValueCallback<Array<Uri>>?,
                    fileChooserParams: FileChooserParams?
                ): Boolean {

                    fileUploadCallback?.onReceiveValue(null)
                    fileUploadCallback = filePathCallback

                    val acceptTypes = fileChooserParams?.acceptTypes
                    var mimeType =
                        if (!acceptTypes.isNullOrEmpty() && acceptTypes[0].isNotEmpty())
                            acceptTypes[0]
                        else "*/*"

                    if (mimeType.startsWith(".")) {
                        mimeType = when (mimeType.lowercase()) {
                            ".csv", ".xlsx", ".xls" -> "*/*"
                            ".png" -> "image/png"
                            ".jpg", ".jpeg" -> "image/jpeg"
                            ".pdf" -> "application/pdf"
                            else -> "*/*"
                        }
                    } else if (mimeType.lowercase() == "text/csv"
                        || mimeType.lowercase() == "application/csv"
                    ) {
                        mimeType = "*/*"
                    } else if (!mimeType.contains("/")) {
                        mimeType = "*/*"
                    }

                    try {
                        selectFileLauncher.launch(mimeType)
                    } catch (e: Exception) {
                        fileUploadCallback?.onReceiveValue(null)
                        fileUploadCallback = null
                        return false
                    }

                    return true
                }
            }
        }

        setContentView(webView)

        webView.loadUrl("https://localhost/www/index.html")

        // Back navigation fix
        onBackPressedDispatcher.addCallback(
            this,
            object : OnBackPressedCallback(true) {
                override fun handleOnBackPressed() {
                    if (webView.canGoBack()) {
                        webView.goBack()
                    } else {
                        finish()
                    }
                }
            }
        )
    }

    class WebAppInterface(private val activity: MainActivity) {

        @android.webkit.JavascriptInterface
        fun downloadFile(base64Data: String, fileName: String, mimeType: String) {
            activity.runOnUiThread {
                try {
                    val bytes = Base64.decode(base64Data, Base64.DEFAULT)
                    val contentResolver = activity.contentResolver

                    val contentValues = ContentValues().apply {
                        put(MediaStore.MediaColumns.DISPLAY_NAME, fileName)
                        put(MediaStore.MediaColumns.MIME_TYPE, mimeType)
                        put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS)
                    }

                    val uri = if (Build.VERSION.SDK_INT >= 29) {
                        contentResolver.insert(
                            MediaStore.Downloads.EXTERNAL_CONTENT_URI,
                            contentValues
                        )
                    } else {
                        contentResolver.insert(
                            MediaStore.Files.getContentUri("external"),
                            contentValues
                        )
                    }

                    if (uri != null) {
                        contentResolver.openOutputStream(uri).use { it?.write(bytes) }
                        Toast.makeText(
                            activity,
                            "Saved to Downloads: $fileName",
                            Toast.LENGTH_LONG
                        ).show()
                    } else {
                        Toast.makeText(activity, "Failed to download file.", Toast.LENGTH_SHORT).show()
                    }

                } catch (e: Exception) {
                    e.printStackTrace()
                    Toast.makeText(
                        activity,
                        "Download failed: ${e.message}",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
        }
    }
}