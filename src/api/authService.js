// Google OAuth Client ID Configuration
// IMPORTANT: Replace with your actual Google OAuth Client ID
export const GOOGLE_OAUTH_CONFIG = {
  clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
  scope: 'https://www.googleapis.com/auth/drive.file',
  discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
};

// Local Auth (client-side only)
export const initLocalAuth = () => {
  if (!localStorage.getItem('cogitox_auth_initialized')) {
    localStorage.setItem('cogitox_auth_users', JSON.stringify({}));
    localStorage.setItem('cogitox_auth_initialized', 'true');
  }
};

export const authenticateLocal = (username, password) => {
  const users = JSON.parse(localStorage.getItem('cogitox_auth_users') || '{}');
  const user = users[username];
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // Simple hash verification (client-side only)
  if (user.passwordHash !== btoa(password)) {
    throw new Error('Invalid password');
  }
  
  return {
    id: user.id,
    username: user.username,
    email: user.email,
  };
};

export const registerLocalUser = (username, email, password) => {
  const users = JSON.parse(localStorage.getItem('cogitox_auth_users') || '{}');
  
  if (users[username]) {
    throw new Error('User already exists');
  }
  
  const newUser = {
    id: `user-${Date.now()}`,
    username,
    email,
    passwordHash: btoa(password),
    createdAt: new Date().toISOString(),
  };
  
  users[username] = newUser;
  localStorage.setItem('cogitox_auth_users', JSON.stringify(users));
  
  return {
    id: newUser.id,
    username: newUser.username,
    email: newUser.email,
  };
};

// Load Google API (when available)
export const loadGoogleAPI = () => {
  return new Promise((resolve, reject) => {
    if (window.gapi) {
      window.gapi.load('client:auth2', async () => {
        try {
          await window.gapi.client.init({
            clientId: GOOGLE_OAUTH_CONFIG.clientId,
            scope: GOOGLE_OAUTH_CONFIG.scope,
            discoveryDocs: GOOGLE_OAUTH_CONFIG.discoveryDocs,
          });
          resolve(window.gapi);
        } catch (error) {
          reject(error);
        }
      });
    } else {
      reject(new Error('Google API not loaded'));
    }
  });
};
