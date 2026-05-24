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

    // --- TASKS API FUNCTIONS (THESE MANAGE YOUR TO-DO LISTS) ---
    
    // Gets all your saved tasks (like workouts or schedules) from your phone's memory to show them on the screen.
    getAllTasks() {
        // Prepare a promise to wait until your phone fetches the tasks
        return new Promise((resolve, reject) => {
            // Open the tasks list in read-only mode (we are only reading, not editing)
            const { store } = this._getTransaction('tasks', 'readonly');
            // Ask the phone memory to give us all task records
            const request = store.getAll();
            // If successful, send the list of tasks back to the screen
            request.onsuccess = () => resolve(request.result || []);
            // If it fails, report the error
            request.onerror = () => reject(request.error);
        });
    }

    // Saves a brand new task or updates an old task (like marking it finished) inside your phone's memory.
    saveTask(task) {
        // Prepare a promise to wait until the task is successfully saved
        return new Promise((resolve, reject) => {
            // Open the tasks list in edit mode (since we are writing/saving new data)
            const { store } = this._getTransaction('tasks', 'readwrite');
            // Put the task inside the phone's local memory
            const request = store.put(task);
            // If successful, return the ID of the saved task
            request.onsuccess = () => resolve(task.id);
            // If it fails, report the error
            request.onerror = () => reject(request.error);
        });
    }

    // Permanently deletes a task from your phone's memory when you click delete.
    deleteTask(id) {
        // Prepare a promise to wait until the task is deleted
        return new Promise((resolve, reject) => {
            // Open the tasks list in edit mode (since we are removing data)
            const { store } = this._getTransaction('tasks', 'readwrite');
            // Delete the specific task using its unique ID
            const request = store.delete(id);
            // If successful, return true (success confirmation)
            request.onsuccess = () => resolve(true);
            // If it fails, report the error
            request.onerror = () => reject(request.error);
        });
    }

    // --- CLIENTS API FUNCTIONS (THESE MANAGE YOUR TRAINEE PROFILES) ---
    
    // Gets the list of all your clients from your phone's memory to show them in the CRM directory.
    getAllClients() {
        // Prepare a promise to wait until all client profiles are fetched
        return new Promise((resolve, reject) => {
            // Open the clients list in read-only mode
            const { store } = this._getTransaction('clients', 'readonly');
            // Ask the phone memory for all client profiles
            const request = store.getAll();
            // If successful, send the list of clients back to the directory list
            request.onsuccess = () => resolve(request.result || []);
            // If it fails, report the error
            request.onerror = () => reject(request.error);
        });
    }

    // Fetches one specific client's profile details (like weight, diet, or name) using their special ID.
    getClient(id) {
        // Prepare a promise to wait until the specific client is loaded
        return new Promise((resolve, reject) => {
            // Open the clients list in read-only mode
            const { store } = this._getTransaction('clients', 'readonly');
            // Fetch the profile matching the exact ID
            const request = store.get(id);
            // If successful, return the client details (or return nothing if not found)
            request.onsuccess = () => resolve(request.result || null);
            // If it fails, report the error
            request.onerror = () => reject(request.error);
        });
    }

    // Saves a new client's profile or updates an existing client's info (like weight or photo) in your phone's memory.
    saveClient(client) {
        // Prepare a promise to wait until the client profile is saved
        return new Promise((resolve, reject) => {
            // Open the clients list in edit mode
            const { store } = this._getTransaction('clients', 'readwrite');
            // Save the client profile details inside the local memory
            const request = store.put(client);
            // If successful, return the ID of the saved client
            request.onsuccess = () => resolve(client.id);
            // If it fails, report the error
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
