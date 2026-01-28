// IndexedDB operations for offline support and local caching

const DB_NAME = 'CogitoxFlowDB';
const DB_VERSION = 1;
const STORE_PROJECTS = 'projects';
const STORE_SLIDES = 'slides';
const STORE_CACHE = 'cache';

let db = null;

const initDB = () => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }
    
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };
    
    request.onupgradeneeded = (event) => {
      const database = event.target.result;
      
      if (!database.objectStoreNames.contains(STORE_PROJECTS)) {
        database.createObjectStore(STORE_PROJECTS, { keyPath: 'id' });
      }
      
      if (!database.objectStoreNames.contains(STORE_SLIDES)) {
        database.createObjectStore(STORE_SLIDES, { keyPath: 'id' });
      }
      
      if (!database.objectStoreNames.contains(STORE_CACHE)) {
        database.createObjectStore(STORE_CACHE, { keyPath: 'key' });
      }
    };
  });
};

export const saveProjectLocally = async (projectData) => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_PROJECTS], 'readwrite');
    const store = transaction.objectStore(STORE_PROJECTS);
    const request = store.put({
      id: projectData.projectId,
      ...projectData,
      savedAt: new Date().toISOString(),
    });
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

export const loadProjectLocally = async (projectId) => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_PROJECTS], 'readonly');
    const store = transaction.objectStore(STORE_PROJECTS);
    const request = store.get(projectId);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

export const getAllProjectsLocally = async () => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_PROJECTS], 'readonly');
    const store = transaction.objectStore(STORE_PROJECTS);
    const request = store.getAll();
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

export const deleteProjectLocally = async (projectId) => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_PROJECTS], 'readwrite');
    const store = transaction.objectStore(STORE_PROJECTS);
    const request = store.delete(projectId);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

export const cacheData = async (key, value) => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_CACHE], 'readwrite');
    const store = transaction.objectStore(STORE_CACHE);
    const request = store.put({
      key,
      value,
      timestamp: Date.now(),
    });
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

export const getCachedData = async (key) => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_CACHE], 'readonly');
    const store = transaction.objectStore(STORE_CACHE);
    const request = store.get(key);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result?.value);
  });
};

export const clearCache = async () => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_CACHE], 'readwrite');
    const store = transaction.objectStore(STORE_CACHE);
    const request = store.clear();
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};
