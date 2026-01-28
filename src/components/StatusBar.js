import React from 'react';
import { useEditorStore } from '../store/editorStore';
import '../styles/StatusBar.css';

function StatusBar({ autosaveStatus }) {
  const editorStore = useEditorStore();
  const totalSlides = editorStore.slides.length;
  const currentSlide = editorStore.currentSlideIndex + 1;
  
  return (
    <div className="status-bar">
      <div className="status-left">
        <span className="status-item">
          Slide {currentSlide} of {totalSlides}
        </span>
        <span className="status-divider">|</span>
        <span className="status-item">Zoom: {editorStore.zoom}%</span>
      </div>
      
      <div className="status-center">
        <span className="status-item autosave-status">
          {autosaveStatus && `${autosaveStatus}`}
        </span>
      </div>
      
      <div className="status-right">
        <button
          className="status-btn"
          onClick={() => editorStore.setZoom(Math.max(50, editorStore.zoom - 10))}
          title="Zoom Out"
        >
          −
        </button>
        <input
          type="range"
          min="50"
          max="200"
          value={editorStore.zoom}
          onChange={(e) => editorStore.setZoom(parseInt(e.target.value))}
          className="zoom-slider"
        />
        <button
          className="status-btn"
          onClick={() => editorStore.setZoom(Math.min(200, editorStore.zoom + 10))}
          title="Zoom In"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default StatusBar;
