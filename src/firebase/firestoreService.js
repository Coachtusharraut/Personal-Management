import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './config';

// Initial seed data for Tushar Raut
export const INITIAL_DATA = {
  tasks: [
    {
      id: 'task-1',
      title: 'Review System Architecture & Cloud Firestore Rules',
      description: 'Audit production security rules, verify index configurations, and optimize query latency.',
      status: 'in-progress',
      priority: 'urgent',
      dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      category: 'Engineering',
      subtasks: [
        { id: 'st-1', text: 'Check collection security rules', completed: true },
        { id: 'st-2', text: 'Configure composite indexes', completed: true },
        { id: 'st-3', text: 'Deploy to Firebase Hosting', completed: false }
      ]
    },
    {
      id: 'task-2',
      title: 'Quarterly Financial Health & Investment Review',
      description: 'Analyze monthly recurring expenses, mutual funds SIP allocations, and emergency fund ratio.',
      status: 'todo',
      priority: 'high',
      dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      category: 'Finance',
      subtasks: [
        { id: 'st-4', text: 'Export bank statements', completed: false },
        { id: 'st-5', text: 'Update portfolio balance sheet', completed: false }
      ]
    },
    {
      id: 'task-3',
      title: 'Deep Work: Complete 3 Pomodoro Focus Sessions',
      description: 'Zero interruptions, phone on DND, focus on high-impact software design.',
      status: 'done',
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
      category: 'Productivity',
      subtasks: [
        { id: 'st-6', text: 'Session 1: Feature specs', completed: true },
        { id: 'st-7', text: 'Session 2: Core modules', completed: true }
      ]
    },
    {
      id: 'task-4',
      title: 'Workout & 10,000 Steps Daily Routine',
      description: 'Push-pull workout followed by an evening brisk walk.',
      status: 'todo',
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
      category: 'Health',
      subtasks: []
    }
  ],
  habits: [
    {
      id: 'habit-1',
      name: 'Morning Hydration & 15m Mobility',
      description: '500ml water + full body stretching upon waking up',
      category: 'Health',
      streak: 14,
      targetDays: 7,
      history: {
        [new Date().toISOString().split('T')[0]]: true,
        [new Date(Date.now() - 86400000).toISOString().split('T')[0]]: true,
        [new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0]]: true,
        [new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0]]: true,
      }
    },
    {
      id: 'habit-2',
      name: 'Read 20 Pages (Tech / Leadership / Philosophy)',
      description: 'Consistent daily compound learning',
      category: 'Mindset',
      streak: 9,
      targetDays: 7,
      history: {
        [new Date().toISOString().split('T')[0]]: true,
        [new Date(Date.now() - 86400000).toISOString().split('T')[0]]: true,
        [new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0]]: true,
      }
    },
    {
      id: 'habit-3',
      name: 'Coding & AI Exploration',
      description: 'Build or refactor components, test agentic workflows',
      category: 'Engineering',
      streak: 21,
      targetDays: 7,
      history: {
        [new Date().toISOString().split('T')[0]]: true,
        [new Date(Date.now() - 86400000).toISOString().split('T')[0]]: true,
        [new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0]]: true,
        [new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0]]: true,
      }
    },
    {
      id: 'habit-4',
      name: 'Daily Reflection & Journaling',
      description: 'Log wins, lessons, and top 3 priorities for tomorrow',
      category: 'Productivity',
      streak: 6,
      targetDays: 5,
      history: {
        [new Date(Date.now() - 86400000).toISOString().split('T')[0]]: true,
      }
    }
  ],
  notes: [
    {
      id: 'note-1',
      title: 'Tushar Raut OS Architecture & Philosophy',
      content: '# Vision for Personal Management\n\n- **Decoupled execution**: Separate planning from execution to eliminate context switching.\n- **Real-time feedback loops**: Fast metrics, streak tracking, and automated summaries.\n- **Data Sovereignty**: Full cloud backup with instant one-click JSON export.\n\n### Core Pillars:\n1. Health & Energy\n2. High-leverage Engineering\n3. Financial Freedom\n4. Continuous Learning',
      category: 'Philosophy',
      pinned: true,
      updatedAt: new Date().toISOString()
    },
    {
      id: 'note-2',
      title: 'Firebase Optimization Cheatsheet',
      content: '### Key Tips for Cloud Firestore & Auth\n- Use subcollections `/users/{uid}/...` for clean security rules and isolation.\n- IndexedDB persistence keeps the app instant and functional offline.\n- Real-time listeners (`onSnapshot`) auto-unsubscribe on component unmount.',
      category: 'Engineering',
      pinned: false,
      updatedAt: new Date(Date.now() - 86400000).toISOString()
    }
  ],
  expenses: [
    {
      id: 'exp-1',
      description: 'Cloud Server & Dev Tools Subscription',
      amount: 48.00,
      type: 'expense',
      category: 'Technology',
      date: new Date().toISOString().split('T')[0]
    },
    {
      id: 'exp-2',
      description: 'Consulting & Software Engineering Retainer',
      amount: 3200.00,
      type: 'income',
      category: 'Income',
      date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0]
    },
    {
      id: 'exp-3',
      description: 'Health Food & Nutrition Supplies',
      amount: 72.50,
      type: 'expense',
      category: 'Health',
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0]
    },
    {
      id: 'exp-4',
      description: 'Kindle & Audiobooks',
      amount: 19.99,
      type: 'expense',
      category: 'Education',
      date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0]
    }
  ],
  goals: [
    {
      id: 'goal-1',
      title: 'Master Agentic AI & Autonomous Systems',
      category: 'Career & Tech',
      progress: 75,
      targetDate: '2026-12-31',
      milestones: [
        { text: 'Build modular agent workflows', done: true },
        { text: 'Integrate MCP servers & tools', done: true },
        { text: 'Deploy production autonomous assistants', done: false }
      ]
    },
    {
      id: 'goal-2',
      title: 'Hit 15% Body Fat & Run 10K under 50 Mins',
      category: 'Fitness',
      progress: 60,
      targetDate: '2026-12-31',
      milestones: [
        { text: 'Consistent 4x weekly strength training', done: true },
        { text: 'Complete 5K under 24 mins', done: true },
        { text: 'Run 10K endurance benchmark', done: false }
      ]
    },
    {
      id: 'goal-3',
      title: 'Build & Scale Personal Software Ecosystem',
      category: 'Projects',
      progress: 85,
      targetDate: '2026-12-31',
      milestones: [
        { text: 'Deploy personal webapp on Firebase', done: true },
        { text: 'Sync cross-device real-time state', done: true },
        { text: 'Add AI assistant integrations', done: false }
      ]
    }
  ]
};

// Helper to get local storage key
const getLocalKey = (userId, collectionName) => `tr_mgmt_${userId || 'guest'}_${collectionName}`;

export function subscribeCollection(userId, collectionName, callback) {
  if (!userId || userId.startsWith('tushar_demo') || userId.startsWith('guest')) {
    // Guest or demo mode -> use LocalStorage with real-time sync
    const key = getLocalKey(userId, collectionName);
    const stored = localStorage.getItem(key);
    let data;
    if (stored) {
      try {
        data = JSON.parse(stored);
      } catch {
        data = INITIAL_DATA[collectionName] || [];
      }
    } else {
      data = INITIAL_DATA[collectionName] || [];
      localStorage.setItem(key, JSON.stringify(data));
    }
    callback(data);

    // Event listener for storage changes
    const handler = (e) => {
      if (e.key === key) {
        callback(JSON.parse(e.newValue || '[]'));
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }

  // Real Firebase Firestore subscription
  try {
    const colRef = collection(db, 'users', userId, collectionName);
    const q = query(colRef);
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      if (snapshot.empty) {
        // If collection empty in firestore, initialize seed data for user convenience
        const initial = INITIAL_DATA[collectionName] || [];
        callback(initial);
      } else {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(items);
      }
    }, (error) => {
      console.warn(`Firestore listener error on ${collectionName}:`, error);
      // Fallback to local
      const key = getLocalKey(userId, collectionName);
      const cached = localStorage.getItem(key);
      callback(cached ? JSON.parse(cached) : (INITIAL_DATA[collectionName] || []));
    });
    return unsubscribe;
  } catch (err) {
    console.error(`Error subscribing to ${collectionName}:`, err);
    callback(INITIAL_DATA[collectionName] || []);
    return () => {};
  }
}

export async function addItem(userId, collectionName, item) {
  const newItem = {
    ...item,
    id: item.id || `${collectionName}-${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  if (!userId || userId.startsWith('tushar_demo') || userId.startsWith('guest')) {
    const key = getLocalKey(userId, collectionName);
    const existing = JSON.parse(localStorage.getItem(key) || JSON.stringify(INITIAL_DATA[collectionName] || []));
    const updated = [newItem, ...existing];
    localStorage.setItem(key, JSON.stringify(updated));
    // Trigger custom event to notify current window
    window.dispatchEvent(new StorageEvent('storage', { key, newValue: JSON.stringify(updated) }));
    return newItem;
  }

  try {
    const colRef = collection(db, 'users', userId, collectionName);
    const docRef = await addDoc(colRef, {
      ...newItem,
      serverTime: serverTimestamp()
    });
    return { ...newItem, id: docRef.id };
  } catch (error) {
    console.warn(`Failed writing to Firestore, falling back to local:`, error);
    const key = getLocalKey(userId, collectionName);
    const existing = JSON.parse(localStorage.getItem(key) || JSON.stringify(INITIAL_DATA[collectionName] || []));
    const updated = [newItem, ...existing];
    localStorage.setItem(key, JSON.stringify(updated));
    return newItem;
  }
}

export async function updateItem(userId, collectionName, id, updates) {
  if (!userId || userId.startsWith('tushar_demo') || userId.startsWith('guest')) {
    const key = getLocalKey(userId, collectionName);
    const existing = JSON.parse(localStorage.getItem(key) || JSON.stringify(INITIAL_DATA[collectionName] || []));
    const updated = existing.map(item => item.id === id ? { ...item, ...updates } : item);
    localStorage.setItem(key, JSON.stringify(updated));
    window.dispatchEvent(new StorageEvent('storage', { key, newValue: JSON.stringify(updated) }));
    return;
  }

  try {
    const docRef = doc(db, 'users', userId, collectionName, id);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.warn('Update failed in firestore, syncing locally:', error);
    const key = getLocalKey(userId, collectionName);
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const updated = existing.map(item => item.id === id ? { ...item, ...updates } : item);
    localStorage.setItem(key, JSON.stringify(updated));
  }
}

export async function deleteItem(userId, collectionName, id) {
  if (!userId || userId.startsWith('tushar_demo') || userId.startsWith('guest')) {
    const key = getLocalKey(userId, collectionName);
    const existing = JSON.parse(localStorage.getItem(key) || JSON.stringify(INITIAL_DATA[collectionName] || []));
    const updated = existing.filter(item => item.id !== id);
    localStorage.setItem(key, JSON.stringify(updated));
    window.dispatchEvent(new StorageEvent('storage', { key, newValue: JSON.stringify(updated) }));
    return;
  }

  try {
    const docRef = doc(db, 'users', userId, collectionName, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.warn('Delete failed in firestore, updating locally:', error);
    const key = getLocalKey(userId, collectionName);
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const updated = existing.filter(item => item.id !== id);
    localStorage.setItem(key, JSON.stringify(updated));
  }
}

// Export all user data as formatted JSON
export function exportAllData(userId) {
  const result = {};
  ['tasks', 'habits', 'notes', 'expenses', 'goals'].forEach(col => {
    const key = getLocalKey(userId, col);
    const data = localStorage.getItem(key);
    result[col] = data ? JSON.parse(data) : (INITIAL_DATA[col] || []);
  });
  return JSON.stringify(result, null, 2);
}

// Import all user data
export function importAllData(userId, jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    ['tasks', 'habits', 'notes', 'expenses', 'goals'].forEach(col => {
      if (parsed[col]) {
        const key = getLocalKey(userId, col);
        localStorage.setItem(key, JSON.stringify(parsed[col]));
        window.dispatchEvent(new StorageEvent('storage', { key, newValue: JSON.stringify(parsed[col]) }));
      }
    });
    return true;
  } catch (err) {
    console.error('Import error:', err);
    return false;
  }
}
