import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useEditorStore } from '../store/editorStore';
import { saveProjectLocally, loadProjectLocally } from '../api/indexedDB';
import Ribbon from '../components/Ribbon';
import SlidePanel from '../components/SlidePanel';
import Canvas from '../components/Canvas';
import InspectorPanel from '../components/InspectorPanel';
import StatusBar from '../components/StatusBar';
import '../styles/EditorPage.css';

function EditorPage() {
  const { projectId } = useParams();
  const editorStore = useEditorStore();
  const [autosaveStatus, setAutosaveStatus] = useState('');
  const autosaveTimerRef = useRef(null);
  
  // Load project on mount
  useEffect(() => {
    const loadProject = async () => {
      if (projectId) {
        try {
          const projectData = await loadProjectLocally(projectId);
          if (projectData) {
            editorStore.loadProjectData(projectData);
          } else {
            editorStore.setProjectId(projectId);
          }
        } catch (error) {
          console.error('Error loading project:', error);
        }
      }
    };
    
    loadProject();
  }, [projectId]);
  
  // Autosave
  useEffect(() => {
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }
    
    setAutosaveStatus('Saving...');
    
    autosaveTimerRef.current = setTimeout(async () => {
      try {
        const projectData = editorStore.saveProjectData();
        await saveProjectLocally(projectData);
        setAutosaveStatus('Saved');
        setTimeout(() => setAutosaveStatus(''), 2000);
      } catch (error) {
        console.error('Autosave failed:', error);
        setAutosaveStatus('Save failed');
      }
    }, 2000);
    
    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [editorStore.slides, editorStore.projectName]);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          e.preventDefault();
          editorStore.undo();
        } else if (e.key === 'y') {
          e.preventDefault();
          editorStore.redo();
        } else if (e.key === 'n') {
          e.preventDefault();
          editorStore.addSlide();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  return (
    <div className="editor-page">
      <Ribbon />
      <div className="editor-main">
        <SlidePanel />
        <Canvas />
        <InspectorPanel />
      </div>
      <StatusBar autosaveStatus={autosaveStatus} />
    </div>
  );
}

export default EditorPage;
