// Global error handlers to display any runtime exceptions in the Sync Console in Settings
window.addEventListener('error', (event) => {
    const termBody = document.getElementById('terminal-body');
    if (termBody) {
        const line = document.createElement('div');
        line.className = 'terminal-line error';
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        line.textContent = `[${timeStr}] [RUNTIME ERROR] ${event.message} (${event.filename.split('/').pop()}:${event.lineno})`;
        termBody.appendChild(line);
        termBody.scrollTop = termBody.scrollHeight;
    }
});

window.addEventListener('unhandledrejection', (event) => {
    const termBody = document.getElementById('terminal-body');
    if (termBody) {
        const line = document.createElement('div');
        line.className = 'terminal-line error';
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        line.textContent = `[${timeStr}] [PROMISE REJECTION] ${event.reason}`;
        termBody.appendChild(line);
        termBody.scrollTop = termBody.scrollHeight;
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    // Robust, timezone-safe helper function to get YYYY-MM-DD in local time
    function getLocalDateString(dateObj) {
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // --- STATE MANAGEMENT ---
    let currentView = 'dashboard'; // 'dashboard', 'tasks', 'clients', 'settings'
    let currentTaskSubView = 'list'; // 'list' or 'calendar'
    let currentProfileTab = 'profile-overview';
    let currentCalendarDate = new Date();
    let selectedCalendarDate = new Date();
    
    let activeClient = null; // Stored client object currently viewed
    let activeClientLogs = []; // Stored progress logs of the active client
    let activeChartMetric = 'weight'; // 'weight' or 'waist'
    let activePhotoType = 'front'; // 'front' or 'side'
    
    // Auto-save debouncers
    let autoSaveHealthTimeout = null;
    let autoSaveObstaclesTimeout = null;

    // --- DOM ELEMENT CACHE ---
    const navTabDashboard = document.getElementById('nav-tab-dashboard');
    const navTabTasks = document.getElementById('nav-tab-tasks');
    const navTabClients = document.getElementById('nav-tab-clients');
    const navTabSettings = document.getElementById('nav-tab-settings');
    const navIndicator = document.getElementById('nav-indicator');
    
    const viewDashboard = document.getElementById('view-dashboard');
    const viewTasks = document.getElementById('view-tasks');
    const viewClients = document.getElementById('view-clients');
    const viewSettings = document.getElementById('view-settings');
    
    const segmentTasksList = document.getElementById('segment-tasks-list');
    const segmentTasksCalendar = document.getElementById('segment-tasks-calendar');
    const tasksListContainer = document.getElementById('tasks-list-container');
    const tasksCalendarContainer = document.getElementById('tasks-calendar-container');

    const statusTime = document.getElementById('status-time');

    // --- AUTOMATIC BI-DIRECTIONAL GOOGLE CALENDAR SYNC ENGINE ---
    const btnConnectGoogle = document.getElementById('btn-connect-google');
    const btnDisconnectGoogle = document.getElementById('btn-disconnect-google');
    const btnSyncNow = document.getElementById('btn-sync-now');
    const statusDot = document.getElementById('status-dot');
    const statusText = document.getElementById('status-text');
    const clientIdConfigDrawer = document.getElementById('client-id-config-drawer');
    const inputGoogleClientId = document.getElementById('input-google-client-id');
    const btnSaveClientId = document.getElementById('btn-save-client-id');
    const btnSetupHelp = document.getElementById('btn-setup-help');
    
    const modalSetupHelp = document.getElementById('modal-setup-help');
    const btnCloseSetupModal = document.getElementById('btn-close-setup-modal');
    const btnSetupOk = document.getElementById('btn-setup-ok');
    const modalSyncBadge = document.getElementById('modal-sync-badge');

    const terminalSyncConsole = null; // Terminal moved to Settings view
    const btnToggleTerminal = null; // No longer floating
    const btnClearTerminal = document.getElementById('btn-clear-terminal');
    const terminalBody = document.getElementById('terminal-body');

    let googleAccessToken = null;
    let googleClientId = null;
    let isLiveSyncMode = false;
    let terminalCollapseTimeout = null;

    // --- INITIALIZATION ---
    updateStatusTime();
    setInterval(updateStatusTime, 30000); // Update clock every 30s
    
    // 1. Initial Google OAuth & Client ID Configs setup (Run instantly, independent of DB!)
    initGoogleSyncEngine();

    // 2. Load Saved Theme
    const savedTheme = localStorage.getItem('app_theme');
    const themeKnob = document.getElementById('theme-switch-knob');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        if (themeKnob) {
            themeKnob.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="12" height="12"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
        }
    } else {
        document.body.classList.remove('dark-theme');
        if (themeKnob) {
            themeKnob.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="12" height="12"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
        }
    }

    const btnToggleTheme = document.getElementById('btn-toggle-theme');
    if (btnToggleTheme) {
        btnToggleTheme.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark-theme');
            localStorage.setItem('app_theme', isDark ? 'dark' : 'light');
            if (themeKnob) {
                if (isDark) {
                    themeKnob.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="12" height="12"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
                } else {
                    themeKnob.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="12" height="12"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
                }
            }
            showToast(isDark ? "Obsidian Dark Theme activated!" : "Champagne Light Theme activated!");
        });
    }

    try {
        await window.dbInstance.init();
        
        // Check if database is empty to auto-load premium demo data
        const existingClients = await window.dbInstance.getAllClients();
        if (existingClients.length === 0) {
            console.log("Database is empty. Populating demo active and inactive clients...");
            await populateDemoData();
        }
        
        // 3. Load Core Data
        await loadDashboardData();
        await loadAllTasks();
        await loadAllClients();
        await renderCalendar();
    } catch (e) {
        console.error("Initialization failed:", e);
    }

    // Initialize Nav Indicator location
    positionNavIndicator();
    window.addEventListener('resize', positionNavIndicator);

    // --- GENERAL SYSTEM UTILITIES ---
    // This utility updates the simulated system clock value dynamically every 30 seconds.
    function updateStatusTime() {
        // If the status time text element does not exist in the DOM (e.g. running in full native mode), skip execution.
        if (!statusTime) return;
        // Instantiates a new Date object representing the current local system date and time.
        const now = new Date();
        // Fetches the hour integer from the Date instance.
        let hours = now.getHours();
        // Fetches the minutes integer from the Date instance.
        let minutes = now.getMinutes();
        // Pad the hours value with a leading zero if it falls below 10 for standard formatting.
        hours = hours < 10 ? '0' + hours : hours;
        // Pad the minutes value with a leading zero if it falls below 10 for standard formatting.
        minutes = minutes < 10 ? '0' + minutes : minutes;
        // Update the display text of the status bar elements with standard formatted time.
        statusTime.textContent = `${hours}:${minutes}`;
    }

    function positionNavIndicator() {
        let activeTab = navTabDashboard;
        if (currentView === 'dashboard') activeTab = navTabDashboard;
        else if (currentView === 'tasks') activeTab = navTabTasks;
        else if (currentView === 'clients') activeTab = navTabClients;
        else if (currentView === 'settings') activeTab = navTabSettings;

        if (!activeTab) return;
        const rect = activeTab.getBoundingClientRect();
        const parentRect = activeTab.parentElement.getBoundingClientRect();
        navIndicator.style.width = `${rect.width}px`;
        navIndicator.style.transform = `translateX(${rect.left - parentRect.left}px)`;
    }

    function generateUUID() {
        return 'uuid-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    // Toast Notification Maker
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast-indicator ${type}`;
        toast.textContent = message;
        
        // Dynamic styling for toast
        Object.assign(toast.style, {
            position: 'absolute',
            bottom: '80px',
            left: '50%',
            transform: 'translateX(-50%) translateY(20px)',
            background: type === 'success' ? 'rgba(16, 185, 129, 0.9)' : type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(245, 158, 11, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#FFFFFF',
            padding: '10px 20px',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: '600',
            fontFamily: 'Outfit',
            zIndex: 1000,
            opacity: 0,
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            whiteSpace: 'nowrap'
        });

        document.getElementById('app-container').appendChild(toast);
        
        // Fade in
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        }, 50);

        // Remove
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(20px)';
            setTimeout(() => toast.remove(), 300);
        }, 2200);
    }

    // --- NAVIGATION CONTROLLER ---
    function switchView(targetView) {
        if (currentView === targetView) return;
        currentView = targetView;

        // Toggle nav tabs active class
        navTabDashboard.classList.toggle('active', targetView === 'dashboard');
        navTabTasks.classList.toggle('active', targetView === 'tasks');
        navTabClients.classList.toggle('active', targetView === 'clients');
        navTabSettings.classList.toggle('active', targetView === 'settings');

        // Toggle views active class
        viewDashboard.classList.toggle('active', targetView === 'dashboard');
        viewTasks.classList.toggle('active', targetView === 'tasks');
        viewClients.classList.toggle('active', targetView === 'clients');
        viewSettings.classList.toggle('active', targetView === 'settings');

        positionNavIndicator();

        // Load view-specific data
        if (targetView === 'dashboard') {
            loadDashboardData();
        } else if (targetView === 'tasks') {
            loadAllTasks();
            renderCalendar();
        } else if (targetView === 'clients') {
            closeClientProfile();
            loadAllClients();
        }
    }

    navTabDashboard.addEventListener('click', () => switchView('dashboard'));
    navTabTasks.addEventListener('click', () => switchView('tasks'));
    navTabClients.addEventListener('click', () => switchView('clients'));
    navTabSettings.addEventListener('click', () => switchView('settings'));

    // Dashboard Quick Actions & Links
    document.getElementById('dashboard-new-task-btn').addEventListener('click', () => {
        switchView('tasks');
        btnAddTaskTrigger.click();
    });
    
    document.getElementById('dashboard-add-client-btn').addEventListener('click', () => {
        switchView('clients');
        btnAddClientTrigger.click();
    });

    document.getElementById('dashboard-view-all-tasks-link').addEventListener('click', () => {
        switchView('tasks');
    });

    // --- DASHBOARD DATA ENGINE ---
    async function loadDashboardData() {
        try {
            // Set Namaste Greeting Header date
            const datePill = document.getElementById('dashboard-date-pill');
            if (datePill) {
                const options = { month: 'short', day: 'numeric', year: 'numeric' };
                datePill.textContent = new Date().toLocaleDateString('en-US', options);
            }

            // 1. Fetch Today's Tasks
            const todayStr = getLocalDateString(new Date());
            const tasks = await window.dbInstance.getAllTasks();
            const todayTasks = tasks.filter(t => t.date === todayStr);
            
            // Sort by time
            todayTasks.sort((a, b) => (a.time || '').localeCompare(b.time || ''));

            const glanceList = document.getElementById('dashboard-glance-list');
            if (glanceList) {
                glanceList.innerHTML = "";
                if (todayTasks.length === 0) {
                    glanceList.innerHTML = `
                        <div style="text-align:center; font-size:12.5px; color:var(--text-muted); padding:18px 0; font-weight:600;">
                            No checklist events scheduled for today.
                        </div>
                    `;
                } else {
                    const topTasks = todayTasks.slice(0, 3);
                    topTasks.forEach(task => {
                        const item = document.createElement('div');
                        item.className = `task-card ${task.completed ? 'completed' : ''}`;
                        item.style.padding = '10px 12px';
                        item.style.marginBottom = '8px';
                        item.innerHTML = `
                            <div class="task-checkbox-wrapper">
                                <input type="checkbox" class="task-checkbox-input" ${task.completed ? 'checked' : ''}>
                                <span class="task-checkbox-custom"></span>
                            </div>
                            <div class="task-card-content" style="flex:1; margin-left: 8px;">
                                <span class="task-title" style="font-size:13px; font-weight:700;">${task.title}</span>
                                <div class="task-time-row" style="margin-top:2px;">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="10" height="10"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                    <span style="font-size:10px;">${task.time}</span>
                                    <span class="priority-badge priority-${task.priority}" style="font-size:8px; padding:1px 4px;">${task.priority}</span>
                                </div>
                            </div>
                        `;
                        
                        // Checkbox listener
                        const checkbox = item.querySelector('.task-checkbox-input');
                        checkbox.addEventListener('change', async () => {
                            task.completed = checkbox.checked;
                            await window.dbInstance.saveTask(task);
                            item.classList.toggle('completed', task.completed);
                            showToast(task.completed ? "Task completed!" : "Task marked incomplete.");
                            await handleAutoUpdateGoogleEvent(task);
                            setTimeout(loadDashboardData, 600);
                        });
                        
                        // Click content to edit
                        item.querySelector('.task-card-content').addEventListener('click', () => {
                            openEditTaskModal(task);
                        });
                        
                        glanceList.appendChild(item);
                    });
                }
            }

            // 2. Fetch Recent Activities (Chronological logs from all clients)
            const clients = await window.dbInstance.getAllClients();
            let allActivities = [];
            for (const client of clients) {
                const logs = await window.dbInstance.getProgressLogsForClient(client.id);
                logs.forEach(log => {
                    allActivities.push({
                        clientName: client.name,
                        date: new Date(log.date),
                        weight: log.weight,
                        weightUnit: log.weightUnit,
                        waist: log.waist,
                        measureUnit: log.measureUnit
                    });
                });
            }

            // Sort descending by date
            allActivities.sort((a, b) => b.date - a.date);

            const feedList = document.getElementById('dashboard-activity-feed');
            if (feedList) {
                feedList.innerHTML = "";
                if (allActivities.length === 0) {
                    feedList.innerHTML = `
                        <div style="text-align:center; font-size:12.5px; color:var(--text-muted); padding:18px 0; font-weight:600;">
                            No recent client logs recorded.
                        </div>
                    `;
                } else {
                    const topActivities = allActivities.slice(0, 3);
                    topActivities.forEach(act => {
                        const formattedDate = act.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                        const initials = act.clientName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
                        
                        const card = document.createElement('div');
                        card.className = "activity-item-card";
                        
                        let detailsText = `Logged a weekly weight of <strong>${act.weight} ${act.weightUnit}</strong>.`;
                        if (act.waist) {
                            detailsText += ` Waist: <strong>${act.waist} ${act.measureUnit}</strong>.`;
                        }
                        
                        card.innerHTML = `
                            <div class="activity-avatar">${initials}</div>
                            <div class="activity-details-block">
                                <div class="activity-name-row">
                                    <span class="activity-client-name">${act.clientName}</span>
                                    <span class="activity-time-tag">${formattedDate}</span>
                                </div>
                                <div class="activity-log-text">${detailsText}</div>
                                <div class="activity-tags-row">
                                    <span class="activity-tag-pill tag-primary">Weekly Log</span>
                                    ${act.waist ? `<span class="activity-tag-pill tag-accent">Metrics</span>` : ''}
                                </div>
                            </div>
                        `;
                        feedList.appendChild(card);
                    });
                }
            }

            // 3. Calculate and display Weekly Progress Banner
            const now = new Date();
            // Get Sunday of the current week
            const sunday = new Date(now.setDate(now.getDate() - now.getDay()));
            sunday.setHours(0,0,0,0);
            
            const allTasks = await window.dbInstance.getAllTasks();
            const thisWeekTasks = allTasks.filter(t => {
                const tDate = new Date(t.date);
                return tDate >= sunday;
            });
            
            let completionRate = 0;
            const totalCount = thisWeekTasks.length;
            const completedCount = thisWeekTasks.filter(t => t.completed).length;
            if (totalCount > 0) {
                completionRate = Math.round((completedCount / totalCount) * 100);
            } else {
                completionRate = 100; // If no tasks scheduled this week, default to 100
            }
            
            const streakVal = document.getElementById('dashboard-streak-value');
            if (streakVal) streakVal.textContent = `${completionRate}%`;

            const streakDesc = document.getElementById('dashboard-streak-desc');
            if (streakDesc) {
                if (totalCount === 0) {
                    streakDesc.textContent = "No training sessions scheduled for this week. Plan some checklist events to start tracking completion!";
                } else if (completionRate === 100) {
                    streakDesc.textContent = "Spectacular! You have completed 100% of your tasks this week. Keep up the flawless execution!";
                } else if (completionRate >= 75) {
                    streakDesc.textContent = `Excellent job! You are at ${completionRate}% completion this week. Keep the momentum going!`;
                } else {
                    streakDesc.textContent = `You have completed ${completedCount} out of ${totalCount} scheduled training tasks this week. Stay focused!`;
                }
            }

        } catch (e) {
            console.error("Load dashboard data failed:", e);
        }
    }

    async function populateDemoData() {
        try {
            // Demo Clients
            const demoClients = [
                {
                    id: 'client-arjun',
                    name: 'Arjun Mehta',
                    email: 'arjun@mehta.in',
                    phone: '+91 98200 12345',
                    healthInfo: 'High blood pressure controlled by diet, left knee meniscus tear (avoid deep squats).',
                    obstacles: 'Frequent business travel, sweet tooth for Jalebis.',
                    initialWeightUnit: 'kg',
                    initialMeasureUnit: 'cm',
                    active: true,
                    avatar: null
                },
                {
                    id: 'client-priya',
                    name: 'Priya Sharma',
                    email: 'priya@sharma.net',
                    phone: '+91 98199 54321',
                    healthInfo: 'Hypothyroidism, mild lower back stiffness.',
                    obstacles: 'Sedentary software engineer job, late night tea sessions.',
                    initialWeightUnit: 'kg',
                    initialMeasureUnit: 'cm',
                    active: true,
                    avatar: null
                },
                {
                    id: 'client-vikram',
                    name: 'Vikram Singh',
                    email: 'vikram@singh.co.in',
                    phone: '+91 97690 99999',
                    healthInfo: 'No major concerns, shoulder impingement on bench press.',
                    obstacles: 'Prefers heavy weights over high-rep conditioning.',
                    initialWeightUnit: 'kg',
                    initialMeasureUnit: 'cm',
                    active: true,
                    avatar: null
                },
                {
                    id: 'client-rohan',
                    name: 'Rohan Gupta',
                    email: 'rohan.g@gmail.com',
                    phone: '+91 90040 88888',
                    healthInfo: 'Mild seasonal asthma.',
                    obstacles: 'Lacks consistency in summers.',
                    initialWeightUnit: 'lbs',
                    initialMeasureUnit: 'inches',
                    active: false,
                    avatar: null
                }
            ];

            for (const client of demoClients) {
                await window.dbInstance.saveClient(client);
            }

            // Simple 1x1 base64 PNG images (orange and cyan) for demo photos
            const orangeImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
            const cyanImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/HwAEhQGA06N54QAAAABJRU5ErkJggg==';

            const today = new Date();
            const dateStr = (daysAgo) => {
                const d = new Date();
                d.setDate(today.getDate() - daysAgo);
                return getLocalDateString(d);
            };

            // Demo Weekly Progress Logs
            const demoLogs = [
                // Arjun Mehta Weekly Logs
                {
                    id: 'log-arjun-w1',
                    clientId: 'client-arjun',
                    date: dateStr(14),
                    weight: 85.0,
                    waist: 92.0,
                    hip: 104.0,
                    chest: 108.0,
                    calf: 38.0,
                    thighs: 60.0,
                    weightUnit: 'kg',
                    measureUnit: 'cm',
                    photoFront: orangeImg,
                    photoSide: cyanImg
                },
                {
                    id: 'log-arjun-w2',
                    clientId: 'client-arjun',
                    date: dateStr(7),
                    weight: 84.2,
                    waist: 91.0,
                    hip: 103.0,
                    chest: 107.5,
                    calf: 38.0,
                    thighs: 59.5,
                    weightUnit: 'kg',
                    measureUnit: 'cm',
                    photoFront: orangeImg,
                    photoSide: cyanImg
                },
                {
                    id: 'log-arjun-w3',
                    clientId: 'client-arjun',
                    date: dateStr(0),
                    weight: 83.5,
                    waist: 90.0,
                    hip: 102.0,
                    chest: 107.0,
                    calf: 38.0,
                    thighs: 59.0,
                    weightUnit: 'kg',
                    measureUnit: 'cm',
                    photoFront: orangeImg,
                    photoSide: cyanImg
                },
                // Priya Sharma Weekly Logs
                {
                    id: 'log-priya-w1',
                    clientId: 'client-priya',
                    date: dateStr(14),
                    weight: 68.0,
                    waist: 78.0,
                    hip: 98.0,
                    chest: 90.0,
                    calf: 34.0,
                    thighs: 54.0,
                    weightUnit: 'kg',
                    measureUnit: 'cm',
                    photoFront: orangeImg,
                    photoSide: cyanImg
                },
                {
                    id: 'log-priya-w2',
                    clientId: 'client-priya',
                    date: dateStr(7),
                    weight: 67.3,
                    waist: 77.0,
                    hip: 97.0,
                    chest: 89.5,
                    calf: 34.0,
                    thighs: 53.5,
                    weightUnit: 'kg',
                    measureUnit: 'cm',
                    photoFront: orangeImg,
                    photoSide: cyanImg
                },
                {
                    id: 'log-priya-w3',
                    clientId: 'client-priya',
                    date: dateStr(0),
                    weight: 66.5,
                    waist: 76.0,
                    hip: 96.0,
                    chest: 89.0,
                    calf: 34.0,
                    thighs: 53.0,
                    weightUnit: 'kg',
                    measureUnit: 'cm',
                    photoFront: orangeImg,
                    photoSide: cyanImg
                },
                // Vikram Singh Weekly Logs
                {
                    id: 'log-vikram-w1',
                    clientId: 'client-vikram',
                    date: dateStr(7),
                    weight: 78.5,
                    waist: 84.0,
                    hip: 96.0,
                    chest: 102.0,
                    calf: 36.0,
                    thighs: 56.0,
                    weightUnit: 'kg',
                    measureUnit: 'cm',
                    photoFront: orangeImg,
                    photoSide: cyanImg
                },
                {
                    id: 'log-vikram-w2',
                    clientId: 'client-vikram',
                    date: dateStr(0),
                    weight: 77.9,
                    waist: 83.5,
                    hip: 95.0,
                    chest: 101.5,
                    calf: 36.0,
                    thighs: 55.5,
                    weightUnit: 'kg',
                    measureUnit: 'cm',
                    photoFront: orangeImg,
                    photoSide: cyanImg
                }
            ];

            for (const log of demoLogs) {
                await window.dbInstance.saveProgressLog(log);
            }

            // Demo Tasks
            const demoTasks = [
                {
                    id: 'task-demo-1',
                    title: 'Yoga & Mobility Flow with Arjun Mehta',
                    date: dateStr(0),
                    time: '08:00',
                    priority: 'medium',
                    notes: 'Focus on deep nasal breathing, hip openers, and light knee mobility exercises.',
                    completed: true,
                    googleEventId: null
                },
                {
                    id: 'task-demo-2',
                    title: 'Leg Strength Session with Vikram Singh',
                    date: dateStr(0),
                    time: '10:30',
                    priority: 'high',
                    notes: 'Leg extensions, leg curls, Bulgarian split squats (shoulder impingement precautions).',
                    completed: false,
                    googleEventId: null
                },
                {
                    id: 'task-demo-3',
                    title: 'Diet & Macros Review with Priya Sharma',
                    date: dateStr(0),
                    time: '17:00',
                    priority: 'low',
                    notes: 'Go over thyroid diet recommendations, protein intake, and evening snacking strategies.',
                    completed: false,
                    googleEventId: null
                },
                {
                    id: 'task-demo-4',
                    title: 'HIIT Fat Loss Cardio (Priya Sharma)',
                    date: dateStr(-1),
                    time: '09:00',
                    priority: 'high',
                    notes: '20 minutes of intervals. Check lower back stiffness post-workout.',
                    completed: false,
                    googleEventId: null
                }
            ];

            for (const task of demoTasks) {
                await window.dbInstance.saveTask(task);
            }

            console.log('Demo data populated successfully!');
        } catch (e) {
            console.error('Error populating demo data:', e);
        }
    }


    segmentTasksList.addEventListener('click', () => {
        if (currentTaskSubView === 'list') return;
        currentTaskSubView = 'list';
        segmentTasksList.classList.add('active');
        segmentTasksCalendar.classList.remove('active');
        tasksListContainer.classList.add('active');
        tasksCalendarContainer.classList.remove('active');
        loadAllTasks();
    });

    segmentTasksCalendar.addEventListener('click', () => {
        if (currentTaskSubView === 'calendar') return;
        currentTaskSubView = 'calendar';
        segmentTasksCalendar.classList.add('active');
        segmentTasksList.classList.remove('active');
        tasksCalendarContainer.classList.add('active');
        tasksListContainer.classList.remove('active');
        renderCalendar();
    });



    function initGoogleSyncEngine() {
        appendTerminalLine("[SYSTEM] Sync Engine v1.0.1 initialized.", "system");
        // Load Client ID
        googleClientId = localStorage.getItem('google_client_id');
        if (googleClientId) {
            inputGoogleClientId.value = googleClientId;
            clientIdConfigDrawer.classList.remove('active');
        } else {
            clientIdConfigDrawer.classList.add('active');
        }

        // Dynamic Redirect URI display and copy handler
        const displayRedirectUri = document.getElementById('display-redirect-uri');
        const btnCopyRedirectUri = document.getElementById('btn-copy-redirect-uri');

        // Fixed redirect URI: app is served at https://localhost/ via Android WebViewAssetLoader
        // This matches what must be whitelisted in Google Cloud Console
        const OAUTH_REDIRECT_URI = 'https://localhost/www/index.html';
        
        if (displayRedirectUri && btnCopyRedirectUri) {
            displayRedirectUri.textContent = OAUTH_REDIRECT_URI;
            btnCopyRedirectUri.addEventListener('click', (e) => {
                e.preventDefault();
                navigator.clipboard.writeText(OAUTH_REDIRECT_URI).then(() => {
                    showToast("Redirect URI copied!");
                    appendTerminalLine(`[SYSTEM] Copied OAuth Redirect URI: ${OAUTH_REDIRECT_URI}`, "info");
                }).catch(() => {
                    // Fallback for WebView clipboard
                    showToast("Redirect URI: " + OAUTH_REDIRECT_URI);
                });
            });
        }

        // Check URL hash for OAuth redirect token response
        const hash = window.location.hash;
        if (hash) {
            const params = new URLSearchParams(hash.substring(1));
            const token = params.get('access_token');
            if (token) {
                googleAccessToken = token;
                localStorage.setItem('google_access_token', token);
                window.location.hash = ""; // Clean URL
                appendTerminalLine("[SYSTEM] OAuth Access Token successfully parsed from redirect uri hash. Real sync activated!", "success");
                
                // BULLETPROOF: Activate live sync immediately!
                isLiveSyncMode = true;
                updateSyncStatusDisplay("Google Account");
                
                fetchGoogleUserProfile(token);
                syncUnsyncedTasksToGoogleCalendar();
            }
        } else {
            // Load saved access token
            googleAccessToken = localStorage.getItem('google_access_token');
            if (googleAccessToken) {
                appendTerminalLine("[SYSTEM] Found active OAuth Session. Accessing real Google account...", "system");
                
                // BULLETPROOF: Activate live sync immediately!
                isLiveSyncMode = true;
                const savedName = localStorage.getItem('google_user_name') || "Google Account";
                updateSyncStatusDisplay(savedName);
                
                fetchGoogleUserProfile(googleAccessToken);
            }
        }

        updateSyncStatusDisplay();
    }

    // FEATURE: Google Session Validity Checker
    // WHAT IT DOES IN APP: On startup, the app loads your saved Google connection token. 
    // This function checks if that token is still valid. If it is valid, your calendar remains in "Live Sync" mode.
    // If it has expired (which happens every 1 hour for safety), the app automatically logs you out, 
    // reverts to safe "Simulator Mode", and turns the indicator dot gray/red so you know to connect again.
    async function fetchGoogleUserProfile(token) {
        try {
            // Send request to Google's profile server with our token
            const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                // If token is green-lit, extract profile details
                const profile = await response.json();
                localStorage.setItem('google_user_name', profile.name); // Save user name locally
                isLiveSyncMode = true; // Turn on live sync engine
                updateSyncStatusDisplay(profile.name); // Show your profile name in settings
                appendTerminalLine(`[SUCCESS] Connected to Google. Authenticated as: ${profile.name}`, "success");
                syncUnsyncedTasksToGoogleCalendar(); // Automatically upload any offline tasks you created
            } else {
                if (response.status === 401) {
                    // Status 401 means "Unauthorized" (expired session). Cleanly log out.
                    handleLogoutGoogle();
                    appendTerminalLine(`[ERROR] Google Session Expired on startup. Logged out.`, "error");
                } else {
                    // Fallback to active sync mode in case profile fetch fails for other reasons (e.g. scope missing)
                    isLiveSyncMode = true;
                    updateSyncStatusDisplay("Google Account");
                    appendTerminalLine(`[INFO] Google Profile fetch returned status ${response.status}. Session active in Google Account mode.`, "info");
                }
            }
        } catch (e) {
            console.error(e);
            // BULLETPROOF: Keep sync active even if user info API fetch fails (CORS, Ad-blocker, etc.)
            isLiveSyncMode = true;
            updateSyncStatusDisplay("Google Account");
            appendTerminalLine(`[INFO] Google Profile fetch offline, but calendar sync engine is fully active.`, "info");
        }
    }

    function handleLogoutGoogle() {
        googleAccessToken = null;
        isLiveSyncMode = false;
        localStorage.removeItem('google_access_token');
        localStorage.removeItem('google_user_name');
        updateSyncStatusDisplay();
        appendTerminalLine("[SYSTEM] Disconnected from Google Calendar. Shifted to Simulator Mode.", "system");
    }

    function updateSyncStatusDisplay(userName = null) {
        if (isLiveSyncMode && googleAccessToken) {
            statusDot.className = "status-indicator-dot connected";
            statusText.textContent = userName ? `Live Sync: ${userName}` : "Live Sync Active";
            btnConnectGoogle.style.display = "none";
            btnDisconnectGoogle.style.display = "inline-block";
            if (btnSyncNow) btnSyncNow.style.display = "inline-block";
            
            modalSyncBadge.className = "inline-indicator success";
            modalSyncBadge.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Real-Time Cloud Sync
            `;
        } else {
            statusDot.className = "status-indicator-dot simulator";
            statusText.textContent = "Simulator Mode (Logs Only)";
            btnConnectGoogle.style.display = "inline-block";
            btnDisconnectGoogle.style.display = "none";
            if (btnSyncNow) btnSyncNow.style.display = "none";

            modalSyncBadge.className = "inline-indicator";
            modalSyncBadge.style.color = "var(--accent-amber)";
            modalSyncBadge.style.borderColor = "rgba(245, 158, 11, 0.2)";
            modalSyncBadge.style.background = "rgba(245, 158, 11, 0.05)";
            modalSyncBadge.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                Simulator active
            `;
        }
    }

    // Connect Click: Triggers Google OAuth 2.0 Implicit flow
    btnConnectGoogle.addEventListener('click', () => {
        if (!googleClientId) {
            clientIdConfigDrawer.classList.add('active');
            showToast("Please enter a Google Client ID first.", "warning");
            return;
        }

        appendTerminalLine(`[SYSTEM] Starting authorization request...`, "system");
        
        // Fixed redirect URI: matches what is served by Android WebViewAssetLoader
        // Must be whitelisted in Google Cloud Console exactly as: https://localhost/www/index.html
        const OAUTH_REDIRECT_URI = 'https://localhost/www/index.html';
        const scope = encodeURIComponent('https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/userinfo.profile');
        
        const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(OAUTH_REDIRECT_URI)}&response_type=token&scope=${scope}&state=antigravity&prompt=select_account`;
        
        appendTerminalLine(`[REQUEST] GET oauth2/auth redirect_uri=${OAUTH_REDIRECT_URI}`, "request");
        
        // Navigate within WebView — AssetLoader handles the localhost redirect back
        window.location.href = oauthUrl;
    });

    btnDisconnectGoogle.addEventListener('click', () => {
        handleLogoutGoogle();
        showToast("Disconnected from Google.");
    });

    if (btnSyncNow) {
        btnSyncNow.addEventListener('click', async () => {
            showToast("Syncing with Google Calendar...");
            await syncUnsyncedTasksToGoogleCalendar();
        });
    }

    // Save Client ID click
    btnSaveClientId.addEventListener('click', () => {
        const idVal = inputGoogleClientId.value.trim();
        if (!idVal) {
            showToast("Client ID cannot be empty.", "error");
            return;
        }
        googleClientId = idVal;
        localStorage.setItem('google_client_id', idVal);
        clientIdConfigDrawer.classList.remove('active');
        showToast("OAuth Settings saved!");
        appendTerminalLine(`[SYSTEM] Client ID configured: ${idVal.substring(0, 20)}...`, "system");
    });

    // Help Guides modals
    btnSetupHelp.addEventListener('click', (e) => {
        e.preventDefault();
        modalSetupHelp.classList.add('active');
    });

    btnCloseSetupModal.addEventListener('click', () => {
        modalSetupHelp.classList.remove('active');
    });

    btnSetupOk.addEventListener('click', () => {
        modalSetupHelp.classList.remove('active');
    });

    // --- TERMINAL LOG CONTROLLERS (now in Settings) ---
    // btnToggleTerminal removed (no longer floating panel)

    btnClearTerminal.addEventListener('click', () => {
        terminalBody.innerHTML = `
            <div class="terminal-line system">[SYSTEM] Console logs cleared. Sync engines active.</div>
        `;
    });

    function appendTerminalLine(text, type = 'info') {
        if (!terminalBody) return;
        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;
        
        // Add timestamp prefix
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;
        line.textContent = `[${timeStr}] ${text}`;
        
        terminalBody.appendChild(line);
        terminalBody.scrollTop = terminalBody.scrollHeight; // Auto scroll down
    }

    // Google Date Formatter helper: safely add 1 hour
    function calculateEndTime(dateStr, timeStr) {
        try {
            const start = new Date(`${dateStr}T${timeStr}:00`);
            const end = new Date(start.getTime() + 60 * 60 * 1000); // add 1 hour
            const y = end.getFullYear();
            const m = String(end.getMonth() + 1).padStart(2, '0');
            const d = String(end.getDate()).padStart(2, '0');
            const h = String(end.getHours()).padStart(2, '0');
            const min = String(end.getMinutes()).padStart(2, '0');
            return `${y}-${m}-${d}T${h}:${min}:00`;
        } catch(e) {
            // Fallback for weird formats
            const parts = timeStr.split(':');
            let hours = parseInt(parts[0] || '10') + 1;
            let mins = parts[1] || '00';
            if (hours >= 24) hours = 0;
            const hoursStr = hours < 10 ? '0' + hours : hours;
            return `${dateStr}T${hoursStr}:${mins}:00`;
        }
    }

    // --- AUTOMATIC DUAL-MODE API HANDLERS ---

    // 1. CREATE EVENT
    async function handleAutoCreateGoogleEvent(task) {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const end = calculateEndTime(task.date, task.time);

        const payload = {
            summary: task.title,
            description: task.notes || 'Scheduled via Antigravity CRM',
            start: { dateTime: `${task.date}T${task.time}:00`, timeZone },
            end: { dateTime: end, timeZone }
        };

        if (isLiveSyncMode && googleAccessToken) {
            appendTerminalLine(`[SYNC] POST /calendar/v3/calendars/primary/events (Adding: ${task.title})...`, "request");
            try {
                const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${googleAccessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
                
                if (response.ok) {
                    const resJson = await response.json();
                    task.googleEventId = resJson.id; // SAVE EVENT ID!
                    await window.dbInstance.saveTask(task);
                    appendTerminalLine(`[SUCCESS] Event created live! Google Event ID: ${resJson.id}`, "success");
                    return resJson.id;
                } else {
                    const errText = await response.text();
                    if (response.status === 401) {
                        handleLogoutGoogle();
                        appendTerminalLine(`[ERROR] Google Session Expired. Logged out.`, "error");
                    }
                    appendTerminalLine(`[ERROR] Google API failed: ${response.status} - ${errText}`, "error");
                }
            } catch (err) {
                appendTerminalLine(`[ERROR] Network Exception: ${err.message}`, "error");
            }
        } else {
            // SIMULATOR MODE
            appendTerminalLine(`[SIMULATOR] POST primary/events - Auto creating Google Calendar Event...`, "request");
            appendTerminalLine(`[SIMULATOR] Request Body: ${JSON.stringify(payload, null, 2)}`, "info");
            
            // Mock dynamic ID
            const mockId = 'mock-event-' + Math.random().toString(36).substring(2, 9);
            task.googleEventId = mockId;
            await window.dbInstance.saveTask(task);
            
            appendTerminalLine(`[SIMULATOR SUCCESS] Event created. Generated Local Mock ID: ${mockId}`, "success");
            return mockId;
        }
        return null;
    }

    // 2. UPDATE EVENT
    async function handleAutoUpdateGoogleEvent(task) {
        if (!task.googleEventId || task.googleEventId.startsWith('mock-event-')) {
            // If task doesn't have a real ID, create it instead!
            return await handleAutoCreateGoogleEvent(task);
        }

        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const end = calculateEndTime(task.date, task.time);

        const payload = {
            summary: task.title,
            description: task.notes || 'Scheduled via Antigravity CRM',
            start: { dateTime: `${task.date}T${task.time}:00`, timeZone },
            end: { dateTime: end, timeZone }
        };

        // If completed checklist, append "[DONE]" prefix to calendar title
        if (task.completed) {
            payload.summary = `✅ [DONE] ${task.title}`;
        }

        if (isLiveSyncMode && googleAccessToken) {
            appendTerminalLine(`[SYNC] PUT /primary/events/${task.googleEventId} (Updating: ${task.title})...`, "request");
            try {
                const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${task.googleEventId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${googleAccessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
                
                if (response.ok) {
                    appendTerminalLine(`[SUCCESS] Event modified live on Google Calendar!`, "success");
                } else {
                    const errText = await response.text();
                    if (response.status === 401) {
                        handleLogoutGoogle();
                        appendTerminalLine(`[ERROR] Google Session Expired. Logged out.`, "error");
                    }
                    appendTerminalLine(`[ERROR] Google API failed: ${response.status} - ${errText}`, "error");
                }
            } catch (err) {
                appendTerminalLine(`[ERROR] Network Exception: ${err.message}`, "error");
            }
        } else {
            // SIMULATOR MODE
            appendTerminalLine(`[SIMULATOR] PUT events/${task.googleEventId} - Syncing updates to Google Calendar...`, "request");
            appendTerminalLine(`[SIMULATOR] Updated Payload: ${JSON.stringify(payload, null, 2)}`, "info");
            appendTerminalLine(`[SIMULATOR SUCCESS] Event updated on Google Calendar Mock.`, "success");
        }
    }

    // 3. DELETE EVENT
    async function handleAutoDeleteGoogleEvent(eventId) {
        if (!eventId) return;

        if (eventId.startsWith('mock-event-')) {
            appendTerminalLine(`[SIMULATOR] DELETE primary/events/${eventId} (Deleting mock event)`, "request");
            return;
        }

        if (isLiveSyncMode && googleAccessToken) {
            appendTerminalLine(`[SYNC] DELETE /primary/events/${eventId} (Removing event)...`, "request");
            try {
                const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${googleAccessToken}` }
                });
                
                if (response.ok || response.status === 404) {
                    appendTerminalLine(`[SUCCESS] Event deleted successfully from your Google Calendar!`, "success");
                } else {
                    const errText = await response.text();
                    if (response.status === 401) {
                        handleLogoutGoogle();
                        appendTerminalLine(`[ERROR] Google Session Expired. Logged out.`, "error");
                    }
                    appendTerminalLine(`[ERROR] Google API failed: ${response.status} - ${errText}`, "error");
                }
            } catch (err) {
                appendTerminalLine(`[ERROR] Network Exception: ${err.message}`, "error");
            }
        } else {
            // SIMULATOR MODE
            appendTerminalLine(`[SIMULATOR] DELETE events/${eventId} - Removing event from Google Calendar...`, "request");
            appendTerminalLine(`[SIMULATOR SUCCESS] Event removed from Google Calendar Mock.`, "success");
        }
    }

    // FEATURE: Offline Task Auto-Sync Engine
    // WHAT IT DOES IN APP: When you are offline or your session is expired, you can still schedule tasks.
    // However, those tasks only exist on your phone (they have placeholder "mock-event-" IDs).
    // As soon as you log in and connect your Google account, this function scans your local database,
    // finds all tasks that haven't been pushed to Google yet, and uploads them automatically!
    async function syncUnsyncedTasksToGoogleCalendar() {
        if (!isLiveSyncMode || !googleAccessToken) {
            appendTerminalLine("[SYNC] Auto-sync skipped: Sync engine is in Simulator Mode.", "info");
            return;
        }
        
        appendTerminalLine("[SYNC] Scanning for unsynced local tasks...", "system");
        try {
            // Load all tasks stored on the phone's memory database (IndexedDB)
            const tasks = await window.dbInstance.getAllTasks();
            let syncCount = 0;
            for (const task of tasks) {
                // Check if the task has NO Google ID, or has a simulated mock ID
                if (!task.googleEventId || task.googleEventId.startsWith('mock-event-')) {
                    appendTerminalLine(`[SYNC] Syncing local task '${task.title}' to Google Calendar...`, "info");
                    // Call the API creator to post the task as a live Google Calendar event
                    await handleAutoCreateGoogleEvent(task);
                    syncCount++; // Increment the counter of successfully synced events
                }
            }
            if (syncCount > 0) {
                appendTerminalLine(`[SUCCESS] Automatically synced ${syncCount} local tasks to Google Calendar!`, "success");
                loadAllTasks(); // Refresh the visible task cards list
                renderCalendar(); // Refresh the calendar grid view to show the new event dots
            } else {
                appendTerminalLine("[SYNC] All local tasks are already in sync with Google Calendar.", "success");
            }
        } catch (e) {
            console.error("Auto-sync error:", e);
            appendTerminalLine(`[ERROR] Auto-sync failed: ${e.message}`, "error");
        }
    }


    // --- SECTION 1: TASKS CHECKLIST CONTROLLER ---
    const btnAddTaskTrigger = document.getElementById('btn-add-task-trigger');
    const modalTask = document.getElementById('modal-task');
    const btnCloseTaskModal = document.getElementById('btn-close-task-modal');
    const formTask = document.getElementById('form-task');
    const tasksCardsList = document.getElementById('tasks-cards-list');
    const tasksEmptyState = document.getElementById('tasks-empty-state');
    const taskSearchInput = document.getElementById('task-search-input');
    
    const taskModalTitle = document.getElementById('task-modal-title');
    const taskIdInput = document.getElementById('task-id');
    const taskTitleInput = document.getElementById('task-title');
    const taskDateInput = document.getElementById('task-date');
    const taskTimeInput = document.getElementById('task-time');
    const taskPrioritySelect = document.getElementById('task-priority');
    const taskNotesArea = document.getElementById('task-notes');

    // Pre-fill today's date for new task modal by default
    btnAddTaskTrigger.addEventListener('click', () => {
        taskModalTitle.textContent = "Create New Task";
        taskIdInput.value = "";
        formTask.reset();
        
        const today = getLocalDateString(new Date());
        taskDateInput.value = today;
        taskTimeInput.value = "10:00";
        
        modalTask.classList.add('active');
    });

    btnCloseTaskModal.addEventListener('click', () => {
        modalTask.classList.remove('active');
    });

    formTask.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const isEditing = !!taskIdInput.value;
        const taskId = taskIdInput.value || generateUUID();
        
        const newTask = {
            id: taskId,
            title: taskTitleInput.value.trim(),
            date: taskDateInput.value,
            time: taskTimeInput.value,
            priority: taskPrioritySelect.value,
            notes: taskNotesArea.value.trim(),
            completed: false,
            googleEventId: null
        };

        // If editing existing task, preserve its completed status & Google Event ID
        if (isEditing) {
            try {
                const existingTasks = await window.dbInstance.getAllTasks();
                const matched = existingTasks.find(t => t.id === taskId);
                if (matched) {
                    newTask.completed = matched.completed;
                    newTask.googleEventId = matched.googleEventId;
                }
            } catch (e) {
                console.error(e);
            }
        }

        try {
            await window.dbInstance.saveTask(newTask);
            modalTask.classList.remove('active');
            showToast(isEditing ? "Task updated!" : "Task created successfully!");
            
            // AUTOMATIC CALENDAR SYNC TRIGGER
            if (isEditing) {
                await handleAutoUpdateGoogleEvent(newTask);
            } else {
                await handleAutoCreateGoogleEvent(newTask);
            }

            // Refresh both task list view and interactive calendar grid to guarantee real-time sync across subviews
            loadAllTasks();
            renderCalendar();
        } catch (e) {
            console.error("Save task error:", e);
            showToast("Failed to save task.", "error");
        }
    });

    taskSearchInput.addEventListener('input', () => {
        loadAllTasks();
    });

    // Load Tasks list
    async function loadAllTasks() {
        try {
            const tasks = await window.dbInstance.getAllTasks();
            const query = taskSearchInput.value.toLowerCase().trim();
            
            // Sort: Incomplete first, then by date, then by time
            tasks.sort((a, b) => {
                if (a.completed !== b.completed) {
                    return a.completed ? 1 : -1;
                }
                const dateA = new Date(`${a.date}T${a.time || '00:00'}`);
                const dateB = new Date(`${b.date}T${b.time || '00:00'}`);
                return dateA - dateB;
            });

            // Filter
            const filteredTasks = tasks.filter(t => t.title.toLowerCase().includes(query));

            tasksCardsList.innerHTML = "";
            if (filteredTasks.length === 0) {
                tasksEmptyState.classList.add('active');
                tasksCardsList.style.display = 'none';
            } else {
                tasksEmptyState.classList.remove('active');
                tasksCardsList.style.display = 'flex';
                
                filteredTasks.forEach(task => {
                    const card = createTaskCard(task);
                    tasksCardsList.appendChild(card);
                });
            }
        } catch (e) {
            console.error("Load tasks error:", e);
        }
    }

    function createTaskCard(task) {
        const card = document.createElement('div');
        card.className = `task-card ${task.completed ? 'completed' : ''}`;
        
        // Convert dates to human readable string
        const formattedDate = new Date(task.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        card.innerHTML = `
            <div class="task-checkbox-wrapper">
                <input type="checkbox" class="task-checkbox-input" ${task.completed ? 'checked' : ''}>
                <span class="task-checkbox-custom"></span>
            </div>
            <div class="task-card-content">
                <span class="task-title">${task.title}</span>
                ${task.notes ? `<span class="task-notes">${task.notes}</span>` : ''}
                <div class="task-time-row">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    <span>${formattedDate} at ${task.time}</span>
                    <span class="priority-badge priority-${task.priority}">${task.priority}</span>
                </div>
            </div>
        `;

        // Checkbox click listener
        const checkbox = card.querySelector('.task-checkbox-input');
        checkbox.addEventListener('change', async (e) => {
            task.completed = checkbox.checked;
            try {
                await window.dbInstance.saveTask(task);
                card.classList.toggle('completed', task.completed);
                showToast(task.completed ? "Task completed! Great job!" : "Task marked incomplete.");
                
                // AUTOMATIC UPDATE SYNC TRIGGER (Appends/removes [DONE] tag on calendar)
                await handleAutoUpdateGoogleEvent(task);

                // Re-sort and refresh both screens with a slight delay for smooth visual transition satisfaction
                setTimeout(() => {
                    loadAllTasks();
                    renderCalendar();
                }, 600);
            } catch (e) {
                console.error(e);
            }
        });

        // Card body click (to edit/delete task)
        card.querySelector('.task-card-content').addEventListener('click', () => {
            openEditTaskModal(task);
        });

        return card;
    }

    function openEditTaskModal(task) {
        taskModalTitle.textContent = "Modify Scheduled Task";
        taskIdInput.value = task.id;
        taskTitleInput.value = task.title;
        taskDateInput.value = task.date;
        taskTimeInput.value = task.time;
        taskPrioritySelect.value = task.priority;
        taskNotesArea.value = task.notes || '';
        
        // Add a temporary delete button inside task form if it's an edit, remove existing if any
        let deleteBtn = formTask.querySelector('.btn-delete-task-action');
        if (!deleteBtn) {
            deleteBtn = document.createElement('button');
            deleteBtn.type = 'button';
            deleteBtn.className = 'btn-primary btn-delete-task-action full-width';
            deleteBtn.style.background = 'rgba(239, 68, 68, 0.1)';
            deleteBtn.style.color = 'var(--accent-coral)';
            deleteBtn.style.border = '1px solid rgba(239, 68, 68, 0.2)';
            deleteBtn.style.boxShadow = 'none';
            deleteBtn.style.marginTop = '8px';
            deleteBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                Delete Scheduled Task
            `;
            
            deleteBtn.addEventListener('click', async () => {
                if (confirm("Are you sure you want to delete this task event?")) {
                    try {
                        await window.dbInstance.deleteTask(task.id);
                        modalTask.classList.remove('active');
                        showToast("Task deleted.");
                        
                        // AUTOMATIC DELETION SYNC TRIGGER
                        if (task.googleEventId) {
                            await handleAutoDeleteGoogleEvent(task.googleEventId);
                        }

                        // Refresh both subviews to guarantee immediate database sync is rendered on all screens
                        loadAllTasks();
                        renderCalendar();
                    } catch (e) {
                        console.error(e);
                    }
                }
            });
            formTask.appendChild(deleteBtn);
        } else {
            deleteBtn.style.display = 'flex';
        }

        modalTask.classList.add('active');
    }

    // Ensure delete button is removed when task modal closes or resets
    btnCloseTaskModal.addEventListener('click', () => {
        const deleteBtn = formTask.querySelector('.btn-delete-task-action');
        if (deleteBtn) deleteBtn.style.display = 'none';
    });

    // --- SECTION 1B: INTERACTIVE GOOGLE CALENDAR VIEW CONTROLLER ---
    const btnCalPrev = document.getElementById('btn-cal-prev');
    const btnCalNext = document.getElementById('btn-cal-next');
    const calendarMonthYear = document.getElementById('calendar-month-year');
    const calendarGrid = document.getElementById('calendar-grid');
    
    const agendaSelectedDate = document.getElementById('agenda-selected-date');
    const agendaEventsList = document.getElementById('agenda-events-list');

    btnCalPrev.addEventListener('click', () => {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
        renderCalendar();
    });

    btnCalNext.addEventListener('click', () => {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
        renderCalendar();
    });

    async function renderCalendar() {
        const year = currentCalendarDate.getFullYear();
        const month = currentCalendarDate.getMonth();

        // Month Names
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        calendarMonthYear.textContent = `${monthNames[month]} ${year}`;

        // Get dates of calendar grid
        const firstDayIndex = new Date(year, month, 1).getDay();
        const lastDay = new Date(year, month + 1, 0).getDate();
        const prevLastDay = new Date(year, month, 0).getDate();

        try {
            // Get all tasks to show event dots on calendar days
            const tasks = await window.dbInstance.getAllTasks();
            
            // Clear the grid inside the try block immediately after the asynchronous database fetch to prevent concurrent appends race conditions
            calendarGrid.innerHTML = "";

            // 1. Previous Month Days
            for (let i = firstDayIndex; i > 0; i--) {
                const dayNum = prevLastDay - i + 1;
                const d = new Date(year, month - 1, dayNum);
                const dayDiv = createCalendarDayElement(d, dayNum, 'prev-month', tasks);
                calendarGrid.appendChild(dayDiv);
            }

            // 2. Current Month Days
            for (let i = 1; i <= lastDay; i++) {
                const d = new Date(year, month, i);
                const dayDiv = createCalendarDayElement(d, i, 'curr-month', tasks);
                calendarGrid.appendChild(dayDiv);
            }

            // 3. Next Month Days to fill grid rows (42 total slots in standard calendar grid)
            const totalCells = firstDayIndex + lastDay;
            const remainingCells = 42 - totalCells;
            for (let i = 1; i <= remainingCells; i++) {
                const d = new Date(year, month + 1, i);
                const dayDiv = createCalendarDayElement(d, i, 'next-month', tasks);
                calendarGrid.appendChild(dayDiv);
            }

            // Update Agenda Details
            renderAgenda();
        } catch (e) {
            console.error("Render calendar failed:", e);
        }
    }

    function createCalendarDayElement(dateObj, dayNum, monthClass, tasksList) {
        const dayDiv = document.createElement('div');
        dayDiv.className = `calendar-day ${monthClass}`;
        dayDiv.textContent = dayNum;

        const dateStr = getLocalDateString(dateObj);

        // Check if selected
        const selectedDateStr = getLocalDateString(selectedCalendarDate);
        if (dateStr === selectedDateStr) {
            dayDiv.classList.add('selected');
        }

        // Check if contains scheduled events/tasks
        const hasEvents = tasksList.some(t => t.date === dateStr);
        if (hasEvents) {
            dayDiv.classList.add('has-event');
        }

        // Click Day Handler
        dayDiv.addEventListener('click', () => {
            selectedCalendarDate = new Date(dateObj);
            
            // Remove previous selections
            const selectedDays = calendarGrid.querySelectorAll('.calendar-day.selected');
            selectedDays.forEach(d => d.classList.remove('selected'));
            
            // Apply new selection
            dayDiv.classList.add('selected');
            
            renderAgenda();
        });

        return dayDiv;
    }

    async function renderAgenda() {
        const dateStr = getLocalDateString(selectedCalendarDate);
        
        // Set Agenda Title
        const options = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
        agendaSelectedDate.textContent = selectedCalendarDate.toLocaleDateString('en-US', options);

        try {
            const tasks = await window.dbInstance.getAllTasks();
            const dayEvents = tasks.filter(t => t.date === dateStr);
            
            // Sort by time
            dayEvents.sort((a, b) => (a.time || '').localeCompare(b.time || ''));

            agendaEventsList.innerHTML = "";

            if (dayEvents.length === 0) {
                agendaEventsList.innerHTML = `
                    <div class="empty-state active" style="padding: 20px 0;">
                        <p style="font-size:13px; color:var(--text-muted);">No tasks scheduled for this day.</p>
                    </div>
                `;
            } else {
                dayEvents.forEach(task => {
                    const card = createTaskCard(task);
                    agendaEventsList.appendChild(card);
                });
            }
        } catch (e) {
            console.error("Render agenda logs error:", e);
        }
    }


    // --- SECTION 2: CLIENT CRM CONTROLLER ---
    const btnAddClientTrigger = document.getElementById('btn-add-client-trigger');
    const modalClient = document.getElementById('modal-client');
    const btnCloseClientModal = document.getElementById('btn-close-client-modal');
    const formClient = document.getElementById('form-client');
    
    const clientModalTitle = document.getElementById('client-modal-title');
    const clientIdInput = document.getElementById('client-id');
    const clientNameInput = document.getElementById('client-name');
    const clientEmailInput = document.getElementById('client-email');
    const clientPhoneInput = document.getElementById('client-phone');
    const clientHealthInput = document.getElementById('client-health-info');
    const clientObstaclesInput = document.getElementById('client-obstacles');
    // Bind the starting weight number input element from our HTML form sheet.
    const clientInitialWeightInput = document.getElementById('client-initial-weight');
    // Bind the starting waist measurement input element from our HTML form sheet.
    const clientInitialWaistInput = document.getElementById('client-initial-waist');
    // Bind the starting hip measurement input element from our HTML form sheet.
    const clientInitialHipInput = document.getElementById('client-initial-hip');
    
    const clientsTableBody = document.getElementById('clients-table-body');
    const clientsTableCard = document.getElementById('clients-table-card');
    const clientsEmptyState = document.getElementById('clients-empty-state');
    const clientSearchInput = document.getElementById('client-search-input');
    const btnReloadDemoData = document.getElementById('btn-reload-demo-data');
    
    // CRM Profiles Subviews
    const clientListSubview = document.getElementById('client-list-subview');
    const clientProfileSubview = document.getElementById('client-profile-subview');
    const btnClientProfileBack = document.getElementById('btn-client-profile-back');



    btnAddClientTrigger.addEventListener('click', () => {
        clientModalTitle.textContent = "Add Client Record";
        clientIdInput.value = "";
        formClient.reset();
        
        // Reset defaults
        document.getElementById('modal-wt-lbs').checked = true;
        document.getElementById('modal-ms-inches').checked = true;

        modalClient.classList.add('active');
    });

    btnCloseClientModal.addEventListener('click', () => {
        modalClient.classList.remove('active');
    });

    // Handle form submissions for saving a new or modified client profile record.
    formClient.addEventListener('submit', async (e) => {
        // Prevent the standard browser form submission from reloading our hybrid WebView shell.
        e.preventDefault();

        // Check if we are editing an existing profile (id exists) or creating a brand-new one.
        const isEditing = !!clientIdInput.value;
        // Retrieve the editing client ID or generate a brand new unique ID for new clients.
        const clientId = clientIdInput.value || 'client_' + Date.now() + '_' + Math.floor(Math.random() * 1000);

        // Read and map selected weight unit system radio option (lbs or kg).
        const wtUnit = document.getElementById('modal-wt-lbs').checked ? 'lbs' : 'kg';
        // Read and map selected measurement unit system radio option (inches or cm).
        const msUnit = document.getElementById('modal-ms-inches').checked ? 'inches' : 'cm';

        // Parse baseline numbers, defaulting to 0 if not entered.
        const startWt = parseFloat(clientInitialWeightInput.value) || 0;
        const startWaist = parseFloat(clientInitialWaistInput.value) || 0;
        const startHip = parseFloat(clientInitialHipInput.value) || 0;

        // Build or update the client record data model structure.
        const clientData = {
            // Set the unique identifier key.
            id: clientId,
            // Capture and trim the full name typed by the trainer.
            name: clientNameInput.value.trim(),
            // Capture and trim the email address, falling back to a dash if omitted.
            email: clientEmailInput.value.trim() || '-',
            // Capture and trim the phone number, falling back to a dash if omitted.
            phone: clientPhoneInput.value.trim() || '-',
            // Capture and trim initial metabolic details.
            healthInfo: clientHealthInput.value.trim() || '',
            // Capture and trim fitness obstacles notes.
            obstacles: clientObstaclesInput.value.trim() || '',
            // Save the preferred starting weight unit category.
            initialWeightUnit: wtUnit,
            // Save the preferred starting measurement unit category.
            initialMeasureUnit: msUnit,
            // Save the baseline starting weight value numeric log.
            initialWeight: startWt,
            // Save the baseline starting waist measurement value.
            initialWaist: startWaist,
            // Save the baseline starting hip measurement value.
            initialHip: startHip,
            // Default status to active on creation.
            active: true,
            // Default avatar picture value to null.
            avatar: null
        };

        // If editing an existing client, preserve their original active and avatar properties.
        if (isEditing) {
            try {
                // Fetch the existing client detail record from our database.
                const existing = await window.dbInstance.getClient(clientId);
                if (existing) {
                    // Retain their original status state.
                    clientData.active = existing.active;
                    // Retain their custom profile avatar base64 image if set.
                    clientData.avatar = existing.avatar;
                }
            } catch (err) {
                // Log technical database read errors.
                console.error("Retrieve existing client failed:", err);
            }
        }

        try {
            // Write the client profile record directly into the IndexedDB store.
            await window.dbInstance.saveClient(clientData);

            // If creating a brand-new client, we automatically write their Day 1 starting metrics as their first progress log entry!
            if (!isEditing) {
                // Create a unique progress log ID using timestamps.
                const logId = 'log_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
                // Assemble the initial progress log entry object.
                const baselineLog = {
                    id: logId,
                    clientId: clientId,
                    clientName: clientData.name,
                    date: getLocalDateString(new Date()),
                    weight: startWt,
                    weightUnit: wtUnit,
                    waist: startWaist,
                    hip: startHip,
                    chest: 0,
                    thighs: 0,
                    calf: 0,
                    measureUnit: msUnit,
                    frontPic: null,
                    sidePic: null
                };
                // Save this initial baseline log into our progress database logs store.
                await window.dbInstance.saveProgressLog(baselineLog);
                
                // Add an elegant audit trail activity feed log event to dashboard.
                const activityId = 'act_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
                // Assemble the dashboard recent activity feed data card.
                const initialActivity = {
                    id: activityId,
                    clientId: clientId,
                    clientName: clientData.name,
                    date: new Date().toISOString(),
                    weight: startWt,
                    weightUnit: wtUnit,
                    waist: startWaist,
                    hip: startHip
                };
                // Save the activity record to the IndexedDB actions log store.
                await window.dbInstance.saveActivity(initialActivity);
            }

            // Slide close the client edit sheet modal overlay.
            modalClient.classList.remove('active');
            // Reset all input form elements back to pristine values.
            formClient.reset();
            // Show a premium gold status toast indicating success.
            showToast(isEditing ? "Client profile updated successfully!" : "Client profile and baseline logged successfully!");
            
            // Re-fetch and load all active clients list grids in the background instantly.
            await loadAllClients();
            // Re-fetch dashboard statistics lists.
            await loadDashboardData();
        } catch (err) {
            // Print error stack logs.
            console.error("Save client profile failed:", err);
            // Display an alert toast detailing save failed.
            showToast("Failed to save client profile.", "error");
        }
    });

    if (btnReloadDemoData) {
        btnReloadDemoData.addEventListener('click', async () => {
            if (confirm("Restore premium demo fitness clients and logs database? This will clear all existing logs and replace them with demo data for testing.")) {
                try {
                    // Clear DB tables
                    const clients = await window.dbInstance.getAllClients();
                    for (const c of clients) {
                        await window.dbInstance.deleteClient(c.id);
                    }
                    
                    const tasks = await window.dbInstance.getAllTasks();
                    for (const t of tasks) {
                        await window.dbInstance.deleteTask(t.id);
                    }
                    
                    // Repopulate
                    await populateDemoData();
                    showToast("Premium demo dataset loaded successfully!");
                    
                    // Reload views
                    await loadDashboardData();
                    await loadAllTasks();
                    await loadAllClients();
                } catch (err) {
                    console.error("Reload demo data error:", err);
                    showToast("Failed to restore demo data.", "error");
                }
            }
        });
    }

    clientSearchInput.addEventListener('input', () => {
        loadAllClients();
    });

    async function loadAllClients() {
        try {
            const clients = await window.dbInstance.getAllClients();
            const query = clientSearchInput.value.toLowerCase().trim();

            // Filter search query
            const filteredClients = clients.filter(c => c.name.toLowerCase().includes(query));
            
            // Sort alphabetically by name
            filteredClients.sort((a, b) => a.name.localeCompare(b.name));

            // Separate active and all clients
            const activeClients = filteredClients.filter(c => c.active !== false);
            
            const activeBody = document.getElementById('active-clients-table-body');
            const allBody = document.getElementById('all-clients-table-body');
            
            if (!activeBody || !allBody) return;

            activeBody.innerHTML = "";
            allBody.innerHTML = "";

            // Active Table Rendering
            if (activeClients.length === 0) {
                activeBody.innerHTML = `
                    <tr>
                        <td colspan="4" style="text-align: center; color: var(--text-muted); padding: 16px; font-size: 12px; font-weight: 600;">
                            No active clients found. Toggle status in All Clients below to activate!
                        </td>
                    </tr>
                `;
            } else {
                for (const client of activeClients) {
                    const row = await createClientRow(client);
                    activeBody.appendChild(row);
                }
            }

            // All Table Rendering
            if (filteredClients.length === 0) {
                allBody.innerHTML = `
                    <tr>
                        <td colspan="4" style="text-align: center; color: var(--text-muted); padding: 16px; font-size: 12px; font-weight: 600;">
                            No clients in database. Click the "+" button to add!
                        </td>
                    </tr>
                `;
            } else {
                for (const client of filteredClients) {
                    const row = await createClientRow(client);
                    allBody.appendChild(row);
                }
            }

            // Manage overall empty states
            if (clients.length === 0) {
                clientsEmptyState.classList.add('active');
                document.getElementById('crm-directory-sections').style.display = 'none';
            } else {
                clientsEmptyState.classList.remove('active');
                document.getElementById('crm-directory-sections').style.display = 'flex';
            }
        } catch (e) {
            console.error("Load CRM clients list failed:", e);
        }
    }

    // This asynchronous function creates a single HTML table row representing a client's key directory parameters.
    async function createClientRow(client) {
        // Create a new tr (table row) element dynamically.
        const row = document.createElement('tr');
        // Style the row with a premium translucent bottom border to separate entries nicely.
        row.style.borderBottom = '1px solid var(--glass-border)';
        
        // Grab the first letter of their first and last name to form a two-letter avatar initials fallback.
        const initials = client.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

        // Assemble the HTML contents of the table row cells dynamically, wrapping overflowing properties strictly.
        row.innerHTML = `
            <!-- Column 1: Client Info (Avatar initials, name, and email Address) with strict wrapping and ellipsis clipping -->
            <td style="padding: 10px 8px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                <div style="display:flex; align-items:center; gap:10px;">
                    <!-- Circular Avatar block with gold styling and base64 image or initials fallback -->
                    <div class="client-avatar btn-view-profile-cell" style="width:34px; height:34px; font-size:11px; margin:0; flex-shrink:0; position:relative; overflow:hidden; cursor:pointer; background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%); border: 1px solid rgba(99, 102, 241, 0.25); color: var(--primary-light); font-family: var(--font-heading); font-weight: 700; display: flex; align-items: center; justify-content: center;">
                        ${client.avatar ? `<img src="${client.avatar}" style="width:100%; height:100%; border-radius:50%; object-fit:cover; position:absolute; top:0; left:0;">` : initials}
                    </div>
                    <!-- Text container set to min-width 0 so child span ellipsis triggers correctly instead of pushing widths -->
                    <div style="min-width: 0; flex: 1;">
                        <!-- Client name link text styled with gold accent, cursor pointer, and strict text clipping -->
                        <span class="btn-view-profile-cell" style="font-weight:800; color:var(--accent-gold); font-size:13px; display:block; cursor:pointer; text-decoration:none; transition:0.2s; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${client.name}</span>
                        <!-- Client email text styled muted, small size, and strictly truncated to prevent overflow -->
                        <span style="font-size:10.5px; color:var(--text-muted); display:block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${client.email}</span>
                    </div>
                </div>
            </td>
            <!-- Column 2: Phone number cell locked to a single line (no-wrap) and styled elegantly with a strict truncation fallback -->
            <td style="padding: 10px 8px; font-size: 12px; color: var(--text-secondary); font-weight: 600; vertical-align: middle; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${client.phone || '-'}
            </td>
            <!-- Column 3: Active Status iOS style toggle switch cell with a width of 60px -->
            <td style="padding: 10px 8px; text-align: center; vertical-align: middle; width: 60px;">
                <div style="display:flex; justify-content:center; align-items:center;">
                    <label class="theme-switch-container" style="width:36px; height:20px; cursor:pointer; margin:0; position:relative; display:inline-block;">
                        <!-- Hidden input checkbox keeping track of checked state -->
                        <input type="checkbox" class="client-status-checkbox" style="display:none;" ${client.active !== false ? 'checked' : ''}>
                        <!-- Outer sliding channel styled with gradients or translucent grey -->
                        <div class="client-status-switch" style="width:100%; height:100%; border-radius:15px; border:1px solid var(--glass-border); transition:0.3s; position:relative; background: ${client.active !== false ? 'var(--primary-gradient)' : 'rgba(255,255,255,0.05)'};">
                            <!-- Inner white sliding knob positioned dynamically based on checked status -->
                            <div class="client-status-knob" style="width:14px; height:14px; border-radius:50%; background:#FFFFFF; position:absolute; top:2px; left:${client.active !== false ? '18px' : '2px'}; transition:0.3s; box-shadow:0 1px 3px rgba(0,0,0,0.2);"></div>
                        </div>
                    </label>
                </div>
            </td>
            <!-- Column 4: Profile action triggers cell showing a single, compact View Profile button -->
            <td style="padding: 10px 8px; text-align: center; vertical-align: middle; width: 60px;">
                <div style="display:flex; justify-content:center; align-items:center;">
                    <!-- Sleek view profile button with glassmorphic styling that opens profile subview -->
                    <button class="btn-primary btn-view-profile" style="height:26px; padding:0 10px; font-size:10px; display:flex; align-items:center; justify-content:center; border-radius:4px; background:var(--bg-secondary); border:1px solid var(--glass-border); color:var(--text-primary); font-weight:700; cursor:pointer;" title="View Detailed Profile">
                        View
                    </button>
                </div>
            </td>
        `;

        // Bind references to the toggle checkbox, sliding knob, and toggle background container elements in the row.
        const checkbox = row.querySelector('.client-status-checkbox');
        const knob = row.querySelector('.client-status-knob');
        const switchBg = row.querySelector('.client-status-switch');

        // Listen for status checkbox change events to instantly slide the knob, style the colors, and auto-save.
        checkbox.addEventListener('change', async () => {
            // Update the client object state immediately in memory.
            client.active = checkbox.checked;
            // Instantly animate the switch knob sliding left or right.
            knob.style.left = checkbox.checked ? '18px' : '2px';
            // Instantly transition the switch background color to active gradient or dim grey.
            switchBg.style.background = checkbox.checked ? 'var(--primary-gradient)' : 'rgba(255,255,255,0.05)';

            try {
                // Auto-save the new status instantly inside our IndexedDB local database store.
                await window.dbInstance.saveClient(client);
                // Display a professional golden-themed status success toast.
                showToast(`${client.name} active status updated successfully!`);
                // Reload dashboard statistics in the background to instantly sync totals.
                await loadDashboardData();
                // Re-render client tables to instantly reflect correct listings without layout jumps.
                await loadAllClients();
            } catch (err) {
                // Print database write failures to debugging logs.
                console.error("Auto-saving active status toggle state failed:", err);
                // Display a detailed warning toast notifying the save operation failed.
                showToast("Failed to save client active status state.", "error");
            }
        });

        // Add click event listeners to the Avatar, Name link, and View button to slide open the client profile view.
        row.querySelectorAll('.btn-view-profile-cell, .btn-view-profile').forEach(el => {
            el.addEventListener('click', (e) => {
                // Prevent event bubbling or standard cell triggers.
                e.stopPropagation();
                // Slide open this client's dynamic profile workspace screen.
                openClientProfile(client);
            });
        });

        // Return the fully assembled, highly responsive, and interactive table row back to the caller.
        return row;
    }

    // --- SECTION 2B: DETAILED CLIENT PROFILE VIEW ENGINE ---
    
    // Auto-save medical & obstacles key events
    const clientHealthInfoArea = document.getElementById('client-health-info-area');
    const clientObstaclesArea = document.getElementById('client-obstacles-area');

    clientHealthInfoArea.addEventListener('input', () => {
        clearTimeout(autoSaveHealthTimeout);
        autoSaveHealthTimeout = setTimeout(async () => {
            if (!activeClient) return;
            activeClient.healthInfo = clientHealthInfoArea.value.trim();
            await window.dbInstance.saveClient(activeClient);
            console.log("Auto-saved Client Health Info.");
        }, 1000);
    });

    clientObstaclesArea.addEventListener('input', () => {
        clearTimeout(autoSaveObstaclesTimeout);
        autoSaveObstaclesTimeout = setTimeout(async () => {
            if (!activeClient) return;
            activeClient.obstacles = clientObstaclesArea.value.trim();
            await window.dbInstance.saveClient(activeClient);
            console.log("Auto-saved Client Obstacles.");
        }, 1000);
    });

    // This asynchronous function opens the detailed client profile screen and loads their data and progress logs.
    async function openClientProfile(client) {
        // Save a reference to the active client object in our global state so other functions can reference it.
        activeClient = client;
        
        // Remove the active visibility class from the client listing subview list to hide it.
        clientListSubview.classList.remove('active');
        // Add the active visibility class to the detailed profile subview to slide/fade it into view.
        clientProfileSubview.classList.add('active');

        // Fetch and load all progress logs for this client from the IndexedDB store first so that they are ready in memory.
        await refreshActiveClientLogs();

        // Render all header detail labels and initial starting metrics onto the profile screen.
        renderClientProfileHeader();

        // Render the progress logs table rows and update history.
        renderClientProfileLogs();
        // Redraw the SVG line chart representing weight/waist trends dynamically.
        renderSVGChart();
    }

    function closeClientProfile() {
        activeClient = null;
        activeClientLogs = [];
        clientProfileSubview.classList.remove('active');
        clientListSubview.classList.add('active');
    }

    btnClientProfileBack.addEventListener('click', () => {
        closeClientProfile();
        loadAllClients();
    });



    // Profile header renderer
    const profileNameDisplay = document.getElementById('profile-name-display');
    const btnEditClientTrigger = document.getElementById('btn-edit-client-trigger');
    const btnDeleteClient = document.getElementById('btn-delete-client');

    const clientEmailDisplay = document.getElementById('client-email-display');
    const clientPhoneDisplay = document.getElementById('client-phone-display');

    // This function renders the core details, status badges, profile avatar, and starting baselines on the client details profile page.
    function renderClientProfileHeader() {
        // If there is no active client loaded in memory, exit the function immediately.
        if (!activeClient) return;
        // Display the client's name inside the header title element.
        profileNameDisplay.textContent = activeClient.name;
        // Display the client's email address, displaying a single dash if it is empty.
        clientEmailDisplay.textContent = activeClient.email || '-';
        // Display the client's phone number, displaying a single dash if it is empty.
        clientPhoneDisplay.textContent = activeClient.phone || '-';
        // Populate the health/medical details textarea field with the client's stored health info.
        clientHealthInfoArea.value = activeClient.healthInfo || '';
        // Populate the biggest challenges textarea field with the client's stored obstacles notes.
        clientObstaclesArea.value = activeClient.obstacles || '';

        // Safely capture and sort all progress logs chronologically to identify the earliest log entry as fallback.
        const sortedLogs = activeClientLogs ? [...activeClientLogs].sort((a,b) => (a.date || '').localeCompare(b.date || '')) : [];
        // Save a reference to the earliest log entry if any exist.
        const firstLog = sortedLogs[0];

        // Retrieve starting weight, falling back to the earliest progress log weight or displaying zero if not set.
        const baselineWeightVal = activeClient.initialWeight || (firstLog ? firstLog.weight : 0);
        // Retrieve preferred weight unit, falling back to kilograms if not set.
        const baselineWeightUnit = activeClient.initialWeightUnit || (firstLog ? firstLog.weightUnit : 'kg');
        // Display the starting weight baseline formatted beautifully with the unit.
        document.getElementById('profile-starting-weight-display').textContent = baselineWeightVal ? `${baselineWeightVal} ${baselineWeightUnit}` : '-';

        // Retrieve starting waist measurement, falling back to earliest log or displaying zero if not set.
        const baselineWaistVal = activeClient.initialWaist || (firstLog ? firstLog.waist : 0);
        // Retrieve preferred measurement unit, falling back to centimeters if not set.
        const baselineMeasureUnit = activeClient.initialMeasureUnit || (firstLog ? firstLog.measureUnit : 'cm');
        // Display the starting waist baseline formatted beautifully with the unit.
        document.getElementById('profile-starting-waist-display').textContent = baselineWaistVal ? `${baselineWaistVal} ${baselineMeasureUnit}` : '-';

        // Retrieve starting hip measurement, falling back to earliest log or displaying zero if not set.
        const baselineHipVal = activeClient.initialHip || (firstLog ? firstLog.hip : 0);
        // Display the starting hip baseline formatted beautifully with the unit.
        document.getElementById('profile-starting-hip-display').textContent = baselineHipVal ? `${baselineHipVal} ${baselineMeasureUnit}` : '-';

        // Locate the HTML element representing the client status badge inside the profile view.
        const badge = clientProfileSubview.querySelector('.profile-status-badge');
        // If the badge element exists, customize its display content and glassmorphic colors depending on active state.
        if (badge) {
            // Set text to Active if active is true, otherwise Inactive.
            badge.textContent = activeClient.active !== false ? 'Active' : 'Inactive';
            // Apply green background for active status, red for inactive status.
            badge.style.background = activeClient.active !== false ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)';
            // Apply green border for active status, red for inactive status.
            badge.style.borderColor = activeClient.active !== false ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)';
            // Apply matching green color text for active state, red for inactive state.
            badge.style.color = activeClient.active !== false ? 'var(--accent-emerald)' : 'var(--accent-coral)';
        }

        // Circular Avatar Uploader display initials or image
        const profileAvatarInitials = document.getElementById('profile-avatar-initials');
        const profileAvatarImg = document.getElementById('profile-avatar-img');
        const initials = activeClient.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

        if (profileAvatarInitials && profileAvatarImg) {
            if (activeClient.avatar) {
                profileAvatarImg.src = activeClient.avatar;
                profileAvatarImg.style.display = 'block';
                profileAvatarInitials.style.display = 'none';
            } else {
                profileAvatarImg.src = "";
                profileAvatarImg.style.display = 'none';
                profileAvatarInitials.textContent = initials;
                profileAvatarInitials.style.display = 'block';
            }
        }
    }

    // Avatar picture upload handlers
    const profileAvatarContainer = document.getElementById('profile-avatar-container');
    const profileAvatarInput = document.getElementById('profile-avatar-input');

    if (profileAvatarContainer && profileAvatarInput) {
        profileAvatarContainer.addEventListener('click', () => {
            profileAvatarInput.click();
        });

        profileAvatarInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = async (event) => {
                const base64 = event.target.result;
                if (!activeClient) return;

                activeClient.avatar = base64;
                try {
                    await window.dbInstance.saveClient(activeClient);
                    showToast("Profile picture updated!");
                    renderClientProfileHeader();
                    await loadAllClients();
                } catch (err) {
                    console.error("Save avatar error:", err);
                    showToast("Failed to update avatar image.", "error");
                }
            };
            reader.readAsDataURL(file);
        });
    }

    btnEditClientTrigger.addEventListener('click', () => {
        // If no active client profile is loaded on screen, stop immediately.
        if (!activeClient) return;
        // Update the client modal sheet title to show edit mode.
        clientModalTitle.textContent = "Modify Client Profile";
        // Pre-fill the client's unique ID into the hidden form field.
        clientIdInput.value = activeClient.id;
        // Pre-fill the name field with active client's name.
        clientNameInput.value = activeClient.name;
        // Pre-fill the email address field with active client's email.
        clientEmailInput.value = activeClient.email;
        // Pre-fill the phone number field with active client's phone.
        clientPhoneInput.value = activeClient.phone;
        // Pre-fill the health/medical notes textarea.
        clientHealthInput.value = activeClient.healthInfo || '';
        // Pre-fill the core obstacles notes textarea.
        clientObstaclesInput.value = activeClient.obstacles || '';
        
        // Sort chronologically to find the earliest/baseline week progress log entry.
        const sortedLogs = activeClientLogs ? [...activeClientLogs].sort((a,b) => (a.date || '').localeCompare(b.date || '')) : [];
        // Extract the earliest log entry if any exist.
        const firstLog = sortedLogs[0];

        // Populate baseline starting weight, falling back to earliest log if not stored.
        clientInitialWeightInput.value = activeClient.initialWeight || (firstLog ? firstLog.weight : 0);
        // Populate baseline starting waist, falling back to earliest log if not stored.
        clientInitialWaistInput.value = activeClient.initialWaist || (firstLog ? firstLog.waist : 0);
        // Populate baseline starting hip, falling back to earliest log if not stored.
        clientInitialHipInput.value = activeClient.initialHip || (firstLog ? firstLog.hip : 0);

        // Pre-select the correct preferred weight unit radio button.
        if (activeClient.initialWeightUnit === 'kg') {
            document.getElementById('modal-wt-kg').checked = true;
        } else {
            document.getElementById('modal-wt-lbs').checked = true;
        }

        // Pre-select the correct preferred measurement unit radio button.
        if (activeClient.initialMeasureUnit === 'cm') {
            document.getElementById('modal-ms-cm').checked = true;
        } else {
            document.getElementById('modal-ms-inches').checked = true;
        }

        // Slide display the client profile editing modal sheet.
        modalClient.classList.add('active');
    });

    btnDeleteClient.addEventListener('click', async () => {
        if (!activeClient) return;
        if (confirm(`CAUTION: Are you sure you want to permanently delete the profile of "${activeClient.name}" and all of their weekly progress logs? This cannot be undone.`)) {
            try {
                await window.dbInstance.deleteClient(activeClient.id);
                showToast("Client profile deleted.");
                closeClientProfile();
                loadAllClients();
            } catch (e) {
                console.error(e);
                showToast("Failed to delete client.", "error");
            }
        }
    });

    async function refreshActiveClientLogs() {
        if (!activeClient) return;
        try {
            activeClientLogs = await window.dbInstance.getProgressLogsForClient(activeClient.id);
        } catch (e) {
            console.error("Refresh client progress logs error:", e);
        }
    }

    // --- TAB 2: LOGS & TRENDS ENGINE (Unified CRM Dashboard) ---
    const btnChartWeight = document.getElementById('btn-chart-weight');
    const btnChartWaist = document.getElementById('btn-chart-waist');
    const progressSvgChart = document.getElementById('progress-svg-chart');

    if (btnChartWeight) {
        btnChartWeight.addEventListener('click', () => {
            if (activeChartMetric === 'weight') return;
            activeChartMetric = 'weight';
            btnChartWeight.classList.add('active');
            btnChartWaist.classList.remove('active');
            renderSVGChart();
        });
    }

    if (btnChartWaist) {
        btnChartWaist.addEventListener('click', () => {
            if (activeChartMetric === 'waist') return;
            activeChartMetric = 'waist';
            btnChartWaist.classList.add('active');
            btnChartWeight.classList.remove('active');
            renderSVGChart();
        });
    }

    // Unified Weekly Progress Table & Action hooks
    const btnAddProgressRow = document.getElementById('btn-add-progress-row');

    if (btnAddProgressRow) {
        btnAddProgressRow.addEventListener('click', async () => {
            if (!activeClient) return;

            // Gather unit preference radios
            const wtUnit = getSelectedWeightUnit();
            const msUnit = getSelectedMeasureUnit();

            // Find last progress entry to copy over unit continuity and baseline values
            const lastLog = activeClientLogs[activeClientLogs.length - 1];

            const newLog = {
                id: generateUUID(),
                clientId: activeClient.id,
                date: getLocalDateString(new Date()),
                weight: lastLog ? lastLog.weight : 0,
                waist: lastLog ? lastLog.waist : null,
                hip: lastLog ? lastLog.hip : null,
                chest: lastLog ? lastLog.chest : null,
                thighs: lastLog ? lastLog.thighs : null,
                calf: lastLog ? lastLog.calf : null,
                weightUnit: lastLog ? lastLog.weightUnit : wtUnit,
                measureUnit: lastLog ? lastLog.measureUnit : msUnit,
                photoFront: null,
                photoSide: null
            };

            try {
                await window.dbInstance.saveProgressLog(newLog);
                showToast("New weekly progress week added!");
                await refreshActiveClientLogs();
                renderClientProfileLogs();
                renderSVGChart();
                await loadDashboardData();
            } catch (err) {
                console.error("Add progress row error:", err);
                showToast("Failed to append row.", "error");
            }
        });
    }

    // Core Logs rendering
    function renderClientProfileLogs() {
        const logsHistoryList = document.getElementById('logs-history-list');
        if (!logsHistoryList || !activeClient) return;

        logsHistoryList.innerHTML = "";

        if (activeClientLogs.length === 0) {
            logsHistoryList.innerHTML = `
                <tr>
                    <td colspan="10" style="text-align: center; color: var(--text-muted); padding: 24px 0; font-size: 13px; font-weight: 600;">
                        No progress weeks logged yet. Click "Add New Weekly Progress Row" below to log their first week!
                    </td>
                </tr>
            `;
            return;
        }

        // Sort descending (latest first) for listing
        const sortedLogs = [...activeClientLogs].sort((a, b) => new Date(b.date) - new Date(a.date));

        // Sync main unit radio buttons in header to match the latest entry
        const latestLog = activeClientLogs[activeClientLogs.length - 1];
        const wtPrefRadio = document.getElementById(`unit-wt-${latestLog.weightUnit}`);
        if (wtPrefRadio) wtPrefRadio.checked = true;
        const msPrefRadio = document.getElementById(`unit-ms-${latestLog.measureUnit}`);
        if (msPrefRadio) msPrefRadio.checked = true;

        sortedLogs.forEach(log => {
            const row = document.createElement('tr');
            row.style.borderBottom = '1px solid var(--glass-border)';

            // Prepare unique file inputs and previews
            const frontFileId = `file-front-${log.id}`;
            const sideFileId = `file-side-${log.id}`;

            row.innerHTML = `
                <td style="padding: 6px 4px; text-align: center;">
                    <input type="date" class="weekly-table-input log-field-date" value="${log.date}" style="text-align: center;">
                </td>
                <td style="padding: 6px 4px; text-align: center;">
                    <input type="number" step="0.1" class="weekly-table-input log-field-weight" value="${log.weight || 0}" style="text-align: center;">
                </td>
                <td style="padding: 6px 4px; text-align: center;">
                    <input type="number" step="0.05" class="weekly-table-input log-field-waist" value="${log.waist || ''}" placeholder="-" style="text-align: center;">
                </td>
                <td style="padding: 6px 4px; text-align: center;">
                    <input type="number" step="0.05" class="weekly-table-input log-field-hip" value="${log.hip || ''}" placeholder="-" style="text-align: center;">
                </td>
                <td style="padding: 6px 4px; text-align: center;">
                    <input type="number" step="0.05" class="weekly-table-input log-field-chest" value="${log.chest || ''}" placeholder="-" style="text-align: center;">
                </td>
                <td style="padding: 6px 4px; text-align: center;">
                    <input type="number" step="0.05" class="weekly-table-input log-field-thighs" value="${log.thighs || ''}" placeholder="-" style="text-align: center;">
                </td>
                <td style="padding: 6px 4px; text-align: center;">
                    <input type="number" step="0.05" class="weekly-table-input log-field-calf" value="${log.calf || ''}" placeholder="-" style="text-align: center;">
                </td>
                <td style="padding: 6px 4px; text-align: center; vertical-align: middle;">
                    <div class="cell-photo-container">
                        <div class="cell-photo-thumb btn-view-front-shot" style="width: 34px; height: 34px; border-radius: 6px; border: 1px solid var(--glass-border); overflow: hidden; background: rgba(255,255,255,0.03); cursor: pointer; flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
                            ${log.photoFront ? `<img class="img-front-preview" src="${log.photoFront}" style="width: 100%; height: 100%; object-fit: cover;">` : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 14px; height: 14px; opacity: 0.35;"><rect x="3" y="3" width="14" height="14" opacity="0.35;"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`}
                        </div>
                        <button class="cell-photo-upload-btn btn-trigger-front-file" style="background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 2px; display: flex; align-items: center; justify-content: center;">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="11" height="11"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                        </button>
                        <input type="file" id="${frontFileId}" accept="image/*" style="display: none;">
                    </div>
                </td>
                <td style="padding: 6px 4px; text-align: center; vertical-align: middle;">
                    <div class="cell-photo-container">
                        <div class="cell-photo-thumb btn-view-side-shot" style="width: 34px; height: 34px; border-radius: 6px; border: 1px solid var(--glass-border); overflow: hidden; background: rgba(255,255,255,0.03); cursor: pointer; flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
                            ${log.photoSide ? `<img class="img-side-preview" src="${log.photoSide}" style="width: 100%; height: 100%; object-fit: cover;">` : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 14px; height: 14px; opacity: 0.35;"><rect x="3" y="3" width="14" height="14" opacity="0.35;"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`}
                        </div>
                        <button class="cell-photo-upload-btn btn-trigger-side-file" style="background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 2px; display: flex; align-items: center; justify-content: center;">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="11" height="11"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                        </button>
                        <input type="file" id="${sideFileId}" accept="image/*" style="display: none;">
                    </div>
                </td>
                <td style="padding: 6px 4px; text-align: center; vertical-align: middle;">
                    <div style="display: flex; gap: 4px; justify-content: center; align-items: center;">
                        <button class="btn-primary btn-save-row" style="height: 26px; padding: 0 6px; font-size: 10px; display: flex; align-items: center; gap: 3px; border-radius: 4px; background: var(--primary-gradient); font-weight: 700; border: none; color: #FFFFFF; cursor: pointer;" title="Save Row Changes">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="10" height="10"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg> Save
                        </button>
                        <button class="btn-primary btn-delete-row" style="height: 26px; padding: 0 6px; font-size: 10px; display: flex; align-items: center; gap: 3px; border-radius: 4px; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25); color: var(--accent-coral); font-weight: 700; cursor: pointer;" title="Delete Row Log">
                            Delete
                        </button>
                    </div>
                </td>
            `;

            // Row input handles & change tracking
            const inpDate = row.querySelector('.log-field-date');
            const inpWeight = row.querySelector('.log-field-weight');
            const inpWaist = row.querySelector('.log-field-waist');
            const inpHip = row.querySelector('.log-field-hip');
            const inpChest = row.querySelector('.log-field-chest');
            const inpThighs = row.querySelector('.log-field-thighs');
            const inpCalf = row.querySelector('.log-field-calf');

            inpDate.addEventListener('change', () => { log.date = inpDate.value; });
            inpWeight.addEventListener('change', () => { log.weight = parseFloat(inpWeight.value) || 0; });
            inpWaist.addEventListener('change', () => { log.waist = inpWaist.value ? parseFloat(inpWaist.value) : null; });
            inpHip.addEventListener('change', () => { log.hip = inpHip.value ? parseFloat(inpHip.value) : null; });
            inpChest.addEventListener('change', () => { log.chest = inpChest.value ? parseFloat(inpChest.value) : null; });
            inpThighs.addEventListener('change', () => { log.thighs = inpThighs.value ? parseFloat(inpThighs.value) : null; });
            inpCalf.addEventListener('change', () => { log.calf = inpCalf.value ? parseFloat(inpCalf.value) : null; });

            // Lightbox clicks
            const thumbFront = row.querySelector('.btn-view-front-shot');
            const thumbSide = row.querySelector('.btn-view-side-shot');

            thumbFront.addEventListener('click', () => {
                if (log.photoFront) {
                    openFullscreenViewer(log.photoFront, `Front View progress dated ${new Date(log.date).toLocaleDateString()}`);
                } else {
                    row.querySelector('.btn-trigger-front-file').click();
                }
            });

            thumbSide.addEventListener('click', () => {
                if (log.photoSide) {
                    openFullscreenViewer(log.photoSide, `Side View progress dated ${new Date(log.date).toLocaleDateString()}`);
                } else {
                    row.querySelector('.btn-trigger-side-file').click();
                }
            });

            // Trigger hidden file uploads
            const btnFrontUpload = row.querySelector('.btn-trigger-front-file');
            const btnSideUpload = row.querySelector('.btn-trigger-side-file');
            const inputFront = row.querySelector(`#${frontFileId}`);
            const inputSide = row.querySelector(`#${sideFileId}`);

            btnFrontUpload.addEventListener('click', () => inputFront.click());
            btnSideUpload.addEventListener('click', () => inputSide.click());

            inputFront.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (event) => {
                    const base64 = event.target.result;
                    log.photoFront = base64;
                    
                    // Update preview instantly
                    thumbFront.innerHTML = `<img src="${base64}" style="width: 100%; height: 100%; object-fit: cover;">`;
                    showToast("Front picture loaded (click Save to persist).");
                };
                reader.readAsDataURL(file);
            });

            inputSide.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (event) => {
                    const base64 = event.target.result;
                    log.photoSide = base64;
                    
                    // Update preview instantly
                    thumbSide.innerHTML = `<img src="${base64}" style="width: 100%; height: 100%; object-fit: cover;">`;
                    showToast("Side picture loaded (click Save to persist).");
                };
                reader.readAsDataURL(file);
            });

            // Save Row
            row.querySelector('.btn-save-row').addEventListener('click', async () => {
                try {
                    // Update unit types based on currently selected units in the dashboard header
                    log.weightUnit = getSelectedWeightUnit();
                    log.measureUnit = getSelectedMeasureUnit();

                    await window.dbInstance.saveProgressLog(log);
                    showToast("Weekly progress changes saved successfully!");
                    await refreshActiveClientLogs();
                    renderClientProfileLogs();
                    renderSVGChart();
                    await loadDashboardData();
                } catch (err) {
                    console.error("Save row failed:", err);
                    showToast("Failed to save changes.", "error");
                }
            });

            // Delete Row
            row.querySelector('.btn-delete-row').addEventListener('click', async () => {
                if (confirm(`CAUTION: Are you sure you want to permanently delete this week's progress entry dated ${log.date}?`)) {
                    try {
                        await window.dbInstance.deleteProgressLog(log.id);
                        showToast("Weekly log deleted.");
                        await refreshActiveClientLogs();
                        renderClientProfileLogs();
                        renderSVGChart();
                        await loadDashboardData();
                    } catch (err) {
                        console.error("Delete row failed:", err);
                        showToast("Failed to delete log entry.", "error");
                    }
                }
            });

            logsHistoryList.appendChild(row);
        });
    }

    // Helper functions for reading units
    function getSelectedWeightUnit() {
        return document.querySelector('input[name="weight-unit-pref"]:checked')?.value || 'kg';
    }

    function getSelectedMeasureUnit() {
        return document.querySelector('input[name="measure-unit-pref"]:checked')?.value || 'cm';
    }

    // --- ADVANCED SVG RESPONSIVE CHARTING ENGINE ---
    function renderSVGChart() {
        if (!progressSvgChart) return;
        progressSvgChart.innerHTML = "";

        if (activeClientLogs.length === 0) {
            progressSvgChart.innerHTML = `
                <text x="250" y="120" text-anchor="middle" fill="var(--text-muted)" font-family="Outfit" font-size="14">
                    Log weekly progress data to populate chart visualizer
                </text>
            `;
            return;
        }

        // 1. Gather coordinates mapping data
        let chartData = [];
        
        if (activeChartMetric === 'weight') {
            const targetUnit = activeClientLogs[activeClientLogs.length - 1].weightUnit;
            chartData = activeClientLogs.map(log => {
                let w = log.weight;
                if (log.weightUnit !== targetUnit) {
                    w = targetUnit === 'lbs' ? log.weight * 2.20462 : log.weight / 2.20462;
                }
                return {
                    date: new Date(log.date),
                    value: w,
                    unit: targetUnit
                };
            });
        } else {
            const validLogs = activeClientLogs.filter(log => log.waist !== null && log.waist !== undefined);
            if (validLogs.length === 0) {
                progressSvgChart.innerHTML = `
                    <text x="250" y="120" text-anchor="middle" fill="var(--text-muted)" font-family="Outfit" font-size="14">
                        No waist measurement data recorded yet.
                    </text>
                `;
                return;
            }

            const targetUnit = validLogs[validLogs.length - 1].measureUnit;
            chartData = validLogs.map(log => {
                let m = log.waist;
                if (log.measureUnit !== targetUnit) {
                    m = targetUnit === 'inches' ? log.waist / 2.54 : log.waist * 2.54;
                }
                return {
                    date: new Date(log.date),
                    value: m,
                    unit: targetUnit
                };
            });
        }

        if (chartData.length === 0) return;

        // Sort data chronologically just in case
        chartData.sort((a,b) => a.date - b.date);

        // Limit to last 5 entries to look extremely clean and premium as requested in the plan
        const displayData = chartData.slice(-5);

        // 2. Chart Layout bounds
        const chartWidth = 500;
        const chartHeight = 240;
        const paddingLeft = 50;
        const paddingRight = 20;
        const paddingTop = 30;
        const paddingBottom = 40;

        const graphWidth = chartWidth - paddingLeft - paddingRight;
        const graphHeight = chartHeight - paddingTop - paddingBottom;

        // 3. Find limits
        const values = displayData.map(d => d.value);
        let maxVal = Math.max(...values);
        let minVal = Math.min(...values);

        // Add padding buffers to Y scale
        const buffer = (maxVal - minVal) * 0.15 || 5; 
        maxVal += buffer;
        minVal -= buffer;
        if (minVal < 0) minVal = 0; 

        // 4. Projection helpers
        function getY(val) {
            const fraction = (val - minVal) / (maxVal - minVal);
            return paddingTop + (1 - fraction) * graphHeight; 
        }

        // Draw horizontal grid lines & Y labels (3 splits)
        const splits = 3;
        for (let i = 0; i <= splits; i++) {
            const vFraction = i / splits;
            const vVal = minVal + vFraction * (maxVal - minVal);
            const yPos = getY(vVal);

            // Grid line
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", paddingLeft);
            line.setAttribute("y1", yPos);
            line.setAttribute("x2", chartWidth - paddingRight);
            line.setAttribute("y2", yPos);
            line.setAttribute("stroke", "rgba(255,255,255,0.06)");
            line.setAttribute("stroke-width", "1");
            progressSvgChart.appendChild(line);

            // Label text
            const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
            label.setAttribute("x", paddingLeft - 8);
            label.setAttribute("y", yPos + 4);
            label.setAttribute("text-anchor", "end");
            label.setAttribute("fill", "var(--text-muted)");
            label.setAttribute("font-size", "10");
            label.setAttribute("font-family", "Outfit");
            label.setAttribute("font-weight", "600");
            label.textContent = vVal.toFixed(1) + displayData[0].unit;
            progressSvgChart.appendChild(label);
        }

        // Draw dynamic Rounded Gradient Vertical Bar Pillars
        const barWidth = Math.min(32, (graphWidth / displayData.length) * 0.45);
        
        // Define Saffron-to-Indigo Gradient in defs
        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        const grad = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
        grad.setAttribute("id", "barGradient");
        grad.setAttribute("x1", "0%"); grad.setAttribute("y1", "0%");
        grad.setAttribute("x2", "0%"); grad.setAttribute("y2", "100%");
        
        const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        stop1.setAttribute("offset", "0%");
        // Using Kesar Saffron gradient color for bar top
        stop1.setAttribute("stop-color", "#FBBF24");
        
        const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        stop2.setAttribute("offset", "100%");
        // Royal Indigo color for bar base
        stop2.setAttribute("stop-color", "#4F46E5");
        
        grad.appendChild(stop1);
        grad.appendChild(stop2);
        defs.appendChild(grad);
        progressSvgChart.appendChild(defs);

        displayData.forEach((item, idx) => {
            let x;
            if (displayData.length === 1) {
                x = paddingLeft + graphWidth / 2 - barWidth / 2;
            } else {
                const fraction = idx / (displayData.length - 1);
                x = paddingLeft + fraction * (graphWidth - barWidth);
            }
            const y = getY(item.value);
            const barHeight = chartHeight - paddingBottom - y;
            
            // 1. Draw rounded vertical bar
            const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttribute("x", x);
            rect.setAttribute("y", y);
            rect.setAttribute("width", barWidth);
            rect.setAttribute("height", Math.max(4, barHeight));
            rect.setAttribute("rx", "6");
            rect.setAttribute("ry", "6");
            rect.setAttribute("fill", "url(#barGradient)");
            rect.setAttribute("filter", "drop-shadow(0px 3px 8px rgba(245, 158, 11, 0.25))");
            progressSvgChart.appendChild(rect);

            // 2. Draw value label text right above the bar
            const textVal = document.createElementNS("http://www.w3.org/2000/svg", "text");
            textVal.setAttribute("x", x + barWidth / 2);
            textVal.setAttribute("y", y - 6);
            textVal.setAttribute("text-anchor", "middle");
            textVal.setAttribute("fill", "var(--text-primary)");
            textVal.setAttribute("font-size", "9.5");
            textVal.setAttribute("font-family", "Outfit");
            textVal.setAttribute("font-weight", "800");
            textVal.textContent = item.value.toFixed(1);
            progressSvgChart.appendChild(textVal);

            // 3. Draw date label on X axis
            const formattedDate = item.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const labelX = document.createElementNS("http://www.w3.org/2000/svg", "text");
            labelX.setAttribute("x", x + barWidth / 2);
            labelX.setAttribute("y", chartHeight - paddingBottom + 18);
            labelX.setAttribute("text-anchor", "middle");
            labelX.setAttribute("fill", "var(--text-muted)");
            labelX.setAttribute("font-size", "10");
            labelX.setAttribute("font-family", "Outfit");
            labelX.setAttribute("font-weight", "700");
            labelX.textContent = formattedDate;
            progressSvgChart.appendChild(labelX);
        });
    }

    // --- FULLSCREEN IMAGE LIGHTBOX VIEW MODULE ---
    const modalImageViewer = document.getElementById('modal-image-viewer');
    const viewerImg = document.getElementById('viewer-img');
    const viewerCaption = document.getElementById('viewer-caption');
    const btnCloseViewer = document.getElementById('btn-close-viewer');

    function openFullscreenViewer(src, captionText) {
        if (!modalImageViewer || !viewerImg) return;
        viewerImg.src = src;
        if (viewerCaption) viewerCaption.textContent = captionText;
        modalImageViewer.style.display = 'flex';
        modalImageViewer.classList.add('active');
    }

    if (btnCloseViewer) {
        btnCloseViewer.addEventListener('click', () => {
            modalImageViewer.classList.remove('active');
            setTimeout(() => {
                modalImageViewer.style.display = 'none';
                viewerImg.src = "";
            }, 300);
        });
    }

    if (modalImageViewer) {
        modalImageViewer.addEventListener('click', (e) => {
            if (e.target === modalImageViewer || e.target === modalImageViewer.firstElementChild) {
                btnCloseViewer.click();
            }
        });
    }

});
