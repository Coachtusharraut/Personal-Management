/**
 * db.js - Local Database Persistence Engine
 * 
 * This file sets up and manages a local browser database called IndexedDB.
 * IndexedDB acts like a miniature database inside the smartphone or browser,
 * allowing us to save task checklists and client profiles offline without needing internet.
 */

// Define our core database controller class.
class LocalDB {
    // The constructor is the initial setups function that runs once when we create the class object.
    constructor() {
        // Define the name of the database file stored locally on the user's device.
        this.dbName = 'PersonalMgmtDB';
        // Specify the version number of the database. If we change the structure later, we increment this.
        this.dbVersion = 1;
        // Keep a reference to the active database connection, which starts as empty (null).
        this.db = null;
    }

    // This function initializes the connection to IndexedDB and returns a Promise (a promise to complete the task).
    init() {
        // Return a Promise so that other scripts can wait until the database connection is fully open.
        return new Promise((resolve, reject) => {
            // Open or request to open the local IndexedDB database on the phone.
            const request = indexedDB.open(this.dbName, this.dbVersion);

            // This handler runs automatically if opening the database encounters an error.
            request.onerror = (event) => {
                // Log the exact database error details inside the debugger console.
                console.error("IndexedDB error:", event.target.error);
                // Reject the Promise to notify other scripts that initialization has failed.
                reject(event.target.error);
            };

            // This handler runs automatically when the database is successfully opened.
            request.onsuccess = (event) => {
                // Save the active connection reference inside our class property 'db'.
                this.db = event.target.result;
                // Log a success message to the development console.
                console.log("IndexedDB initialized successfully.");
                // Resolve the Promise, notifying the rest of the application that database is ready.
                resolve(this.db);
            };

            // This handler runs automatically the very first time the app boots up, or if the version changes.
            // It creates the tables (object stores) where the different records will be stored.
            request.onupgradeneeded = (event) => {
                // Grab the raw database connection instance.
                const db = event.target.result;

                // Check if the 'tasks' table does not exist inside our database.
                if (!db.objectStoreNames.contains('tasks')) {
                    // Create the 'tasks' table, designating the 'id' field as the unique identifier key.
                    db.createObjectStore('tasks', { keyPath: 'id' });
                }

                // Check if the 'clients' table does not exist inside our database.
                if (!db.objectStoreNames.contains('clients')) {
                    // Create the 'clients' table, designating the 'id' field as the unique identifier key.
                    db.createObjectStore('clients', { keyPath: 'id' });
                }

                // Check if the 'progress' table does not exist inside our database.
                if (!db.objectStoreNames.contains('progress')) {
                    // Create the 'progress' table, designating the 'id' field as the unique identifier key.
                    const progressStore = db.createObjectStore('progress', { keyPath: 'id' });
                    // Create a searchable index on 'clientId' inside the progress table to search logs by client.
                    progressStore.createIndex('clientId', 'clientId', { unique: false });
                }
            };
        });
    }

    // Internal helper function to set up database transactions (commands like read or write).
    _getTransaction(storeName, mode) {
        // Start a new database transaction on the specified table name with the chosen access mode.
        const transaction = this.db.transaction(storeName, mode);
        // Grab the object store (table) interface.
        const store = transaction.objectStore(storeName);
        // Return both the transaction and the store handles back to the calling function.
        return { transaction, store };
    }

    // --- TASKS API FUNCTIONS ---
    
    // Retrieve all saved checklist tasks from the database.
    getAllTasks() {
        // Return a Promise so the application can wait until the retrieval is complete.
        return new Promise((resolve, reject) => {
            // Open a read-only transaction on the 'tasks' table.
            const { store } = this._getTransaction('tasks', 'readonly');
            // Execute the query to get all records inside the table.
            const request = store.getAll();
            // On success, resolve the Promise and return the array of tasks (or empty array if none).
            request.onsuccess = () => resolve(request.result || []);
            // On error, reject the Promise and return the failure reason.
            request.onerror = () => reject(request.error);
        });
    }

    // Save or update a checklist task inside the database.
    saveTask(task) {
        // Return a Promise so other scripts can wait for the write operation to finish.
        return new Promise((resolve, reject) => {
            // Open an write-enabled transaction on the 'tasks' table.
            const { store } = this._getTransaction('tasks', 'readwrite');
            // Store or overwrite the task record inside the table.
            const request = store.put(task);
            // On success, resolve the Promise and return the saved task's unique ID.
            request.onsuccess = () => resolve(task.id);
            // On error, reject the Promise with the failure details.
            request.onerror = () => reject(request.error);
        });
    }

    // Delete a checklist task permanently from the database.
    deleteTask(id) {
        // Return a Promise so other scripts can wait for the deletion to complete.
        return new Promise((resolve, reject) => {
            // Open an write-enabled transaction on the 'tasks' table.
            const { store } = this._getTransaction('tasks', 'readwrite');
            // Delete the specific task record matching the unique ID.
            const request = store.delete(id);
            // On success, resolve the Promise and return true.
            request.onsuccess = () => resolve(true);
            // On error, reject the Promise with the failure reason.
            request.onerror = () => reject(request.error);
        });
    }

    // --- CLIENTS API FUNCTIONS ---
    
    // Retrieve the entire database directory list of clients.
    getAllClients() {
        // Return a Promise so the application can wait for the retrieval.
        return new Promise((resolve, reject) => {
            // Open a read-only transaction on the 'clients' table.
            const { store } = this._getTransaction('clients', 'readonly');
            // Execute the query to get all records in the table.
            const request = store.getAll();
            // On success, resolve the Promise and return the list of clients (or empty array).
            request.onsuccess = () => resolve(request.result || []);
            // On error, reject the Promise with the failure reason.
            request.onerror = () => reject(request.error);
        });
    }

    // Fetch a single client's profile details matching their unique ID.
    getClient(id) {
        // Return a Promise so other scripts can wait for the result.
        return new Promise((resolve, reject) => {
            // Open a read-only transaction on the 'clients' table.
            const { store } = this._getTransaction('clients', 'readonly');
            // Get the specific client profile record matching the ID.
            const request = store.get(id);
            // On success, resolve the Promise and return the client object (or null if not found).
            request.onsuccess = () => resolve(request.result || null);
            // On error, reject the Promise.
            request.onerror = () => reject(request.error);
        });
    }

    // Save or update a client's profile information in the database.
    saveClient(client) {
        // Return a Promise so other scripts can wait for the write to finish.
        return new Promise((resolve, reject) => {
            // Open a write-enabled transaction on the 'clients' table.
            const { store } = this._getTransaction('clients', 'readwrite');
            // Put the client profile record inside the table.
            const request = store.put(client);
            // On success, resolve the Promise and return the client's ID.
            request.onsuccess = () => resolve(client.id);
            // On error, reject the Promise.
            request.onerror = () => reject(request.error);
        });
    }

    // Delete a client's profile and all their associated weekly logs from the database.
    deleteClient(id) {
        // Return a Promise so other scripts can wait for the deletion.
        return new Promise((resolve, reject) => {
            // Open a write-enabled transaction on the 'clients' table.
            const { store: clientStore } = this._getTransaction('clients', 'readwrite');
            // Attempt to delete the client profile matching the ID.
            clientStore.delete(id).onsuccess = async () => {
                try {
                    // Fetch all progress logs saved for this client ID.
                    const logs = await this.getProgressLogsForClient(id);
                    // Open a write-enabled transaction on the 'progress' table.
                    const { store: progressStore } = this._getTransaction('progress', 'readwrite');
                    // Loop through and delete every single weekly progress log row matching this client.
                    for (const log of logs) {
                        progressStore.delete(log.id);
                    }
                    // Resolve the Promise, indicating successful deletion.
                    resolve(true);
                } catch (e) {
                    // Reject the Promise if any step fails.
                    reject(e);
                }
            };
        });
    }

    // --- PROGRESS LOGS API FUNCTIONS ---
    
    // Retrieve all weekly progress logs saved for a specific client.
    getProgressLogsForClient(clientId) {
        // Return a Promise so the application can wait for the result.
        return new Promise((resolve, reject) => {
            // Open a read-only transaction on the 'progress' table.
            const { store } = this._getTransaction('progress', 'readonly');
            // Access the 'clientId' index inside the progress table.
            const index = store.index('clientId');
            // Get all logs matching the client ID.
            const request = index.getAll(clientId);
            // On success handler
            request.onsuccess = () => {
                const results = request.result || [];
                // Sort the array of logs by calendar date ascending (oldest first).
                results.sort((a, b) => new Date(a.date) - new Date(b.date));
                // Resolve the Promise and return the sorted logs list.
                resolve(results);
            };
            // On error, reject the Promise.
            request.onerror = () => reject(request.error);
        });
    }

    // Save or update a weekly progress log row in the database.
    saveProgressLog(log) {
        // Return a Promise so other scripts can wait for the write to complete.
        return new Promise((resolve, reject) => {
            // Open a write-enabled transaction on the 'progress' table.
            const { store } = this._getTransaction('progress', 'readwrite');
            // Put the weekly log record inside the progress table.
            const request = store.put(log);
            // On success, resolve the Promise and return the log's ID.
            request.onsuccess = () => resolve(log.id);
            // On error, reject the Promise.
            request.onerror = () => reject(request.error);
        });
    }

    // Delete a weekly progress log row permanently from the database.
    deleteProgressLog(id) {
        // Return a Promise so other scripts can wait for the deletion.
        return new Promise((resolve, reject) => {
            // Open a write-enabled transaction on the 'progress' table.
            const { store } = this._getTransaction('progress', 'readwrite');
            // Delete the progress log matching the unique ID.
            const request = store.delete(id);
            // On success, resolve the Promise and return true.
            request.onsuccess = () => resolve(true);
            // On error, reject the Promise.
            request.onerror = () => reject(request.error);
        });
    }
}

// Instantiate a single global instance of our database class.
// This allows any script on the page (like app.js) to access database operations via 'window.dbInstance'.
window.dbInstance = new LocalDB();
