import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { initLocalAuth, registerLocalUser, authenticateLocal } from '../api/authService';
import '../styles/LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleLocalAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      initLocalAuth();
      
      let user;
      if (isRegister) {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        user = registerLocalUser(username, email, password);
      } else {
        user = authenticateLocal(username, password);
      }
      
      const token = btoa(`${username}:${Date.now()}`);
      login(user, token);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleLogin = () => {
    alert('Google OAuth will be configured with your Google Client ID');
  };
  
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Cogitox Flow</h1>
          <p>PowerPoint-like Presentation Editor</p>
        </div>
        
        <form onSubmit={handleLocalAuth} className="login-form">
          <h2>{isRegister ? 'Create Account' : 'Sign In'}</h2>
          
          {error && <div className="error-message">{error}</div>}
          
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          
          {isRegister && (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          )}
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          {isRegister && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}
          
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>
        
        <button className="google-button" onClick={handleGoogleLogin}>
          Sign in with Google
        </button>
        
        <button
          className="toggle-auth"
          onClick={() => {
            setIsRegister(!isRegister);
            setError('');
          }}
        >
          {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
