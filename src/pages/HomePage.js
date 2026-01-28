import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useEditorStore } from '../store/editorStore';
import { getAllProjectsLocally } from '../api/indexedDB';
import '../styles/HomePage.css';

function HomePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { setProjectId, setProjectName } = useEditorStore();
  
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  
  useEffect(() => {
    loadProjects();
  }, []);
  
  const loadProjects = async () => {
    try {
      const localProjects = await getAllProjectsLocally();
      setProjects(localProjects || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateProject = () => {
    if (!newProjectName.trim()) {
      alert('Please enter a project name');
      return;
    }
    
    const projectId = `project-${Date.now()}`;
    setProjectId(projectId);
    setProjectName(newProjectName);
    navigate(`/editor/${projectId}`);
  };
  
  const handleOpenProject = (project) => {
    setProjectId(project.id);
    setProjectName(project.projectName);
    navigate(`/editor/${project.id}`);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="home-page">
      <div className="home-header">
        <div className="header-left">
          <h1>Cogitox Flow</h1>
        </div>
        <div className="header-right">
          <span className="user-info">{user?.username}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </div>
      
      <div className="home-content">
        <div className="new-project-section">
          <button
            className="new-project-btn"
            onClick={() => setShowNewProjectModal(true)}
          >
            <span className="plus-icon">+</span>
            <span>New Presentation</span>
          </button>
        </div>
        
        <div className="projects-section">
          <h2>Recent Presentations</h2>
          {loading ? (
            <p>Loading projects...</p>
          ) : projects.length === 0 ? (
            <p>No presentations yet. Create one to get started!</p>
          ) : (
            <div className="projects-grid">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="project-card"
                  onClick={() => handleOpenProject(project)}
                >
                  <div className="project-thumbnail">
                    <div className="thumbnail-placeholder">📊</div>
                  </div>
                  <div className="project-info">
                    <h3>{project.projectName}</h3>
                    <p>{project.slides?.length || 0} slides</p>
                    <small>{new Date(project.savedAt).toLocaleDateString()}</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {showNewProjectModal && (
        <div className="modal-overlay" onClick={() => setShowNewProjectModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>New Presentation</h2>
            <input
              type="text"
              placeholder="Presentation name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleCreateProject();
              }}
              autoFocus
            />
            <div className="modal-buttons">
              <button
                className="btn-cancel"
                onClick={() => setShowNewProjectModal(false)}
              >
                Cancel
              </button>
              <button className="btn-create" onClick={handleCreateProject}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
