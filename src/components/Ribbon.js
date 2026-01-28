import React, { useState } from 'react';
import { useEditorStore, SLIDE_LAYOUTS, createDefaultSlide } from '../store/editorStore';
import { exportToPDF } from '../api/exportService';
import '../styles/Ribbon.css';

function Ribbon() {
  const editorStore = useEditorStore();
  const [activeTab, setActiveTab] = useState('home');
  
  const handleAddSlide = () => {
    editorStore.addSlide();
    editorStore.addToHistory();
  };
  
  const handleExportPDF = async () => {
    try {
      await exportToPDF(editorStore.slides, editorStore.projectName);
    } catch (error) {
      alert('Failed to export PDF: ' + error.message);
    }
  };
  
  return (
    <div className="ribbon">
      <div className="ribbon-tabs">
        {['Home', 'Insert', 'Design', 'Layout', 'View', 'Export'].map((tab) => (
          <button
            key={tab}
            className={`ribbon-tab ${activeTab === tab.toLowerCase() ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.toLowerCase())}
          >
            {tab}
          </button>
        ))}
      </div>
      
      <div className="ribbon-content">
        {activeTab === 'home' && (
          <div className="ribbon-group">
            <div className="ribbon-section">
              <label>Slides</label>
              <div className="ribbon-buttons">
                <button className="ribbon-btn" onClick={handleAddSlide}>
                  New Slide
                </button>
                <button className="ribbon-btn" onClick={() => editorStore.duplicateSlide(editorStore.currentSlideIndex)}>
                  Duplicate
                </button>
                <button className="ribbon-btn" onClick={() => editorStore.deleteSlide(editorStore.currentSlideIndex)}>
                  Delete
                </button>
              </div>
            </div>
            
            <div className="ribbon-section">
              <label>Editing</label>
              <div className="ribbon-buttons">
                <button className="ribbon-btn" onClick={() => editorStore.undo()}>
                  Undo
                </button>
                <button className="ribbon-btn" onClick={() => editorStore.redo()}>
                  Redo
                </button>
              </div>
            </div>
            
            <div className="ribbon-section">
              <label>View</label>
              <div className="ribbon-buttons">
                <button className="ribbon-btn" onClick={() => editorStore.setZoom(75)}>
                  75%
                </button>
                <button className="ribbon-btn" onClick={() => editorStore.setZoom(100)}>
                  100%
                </button>
                <button className="ribbon-btn" onClick={() => editorStore.setZoom(150)}>
                  150%
                </button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'insert' && (
          <div className="ribbon-group">
            <div className="ribbon-section">
              <label>Elements</label>
              <div className="ribbon-buttons">
                <button className="ribbon-btn">Text Box</button>
                <button className="ribbon-btn">Image</button>
                <button className="ribbon-btn">Shape</button>
                <button className="ribbon-btn">Table</button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'design' && (
          <div className="ribbon-group">
            <div className="ribbon-section">
              <label>Themes</label>
              <div className="ribbon-buttons">
                <button className="ribbon-btn">Office</button>
                <button className="ribbon-btn">Dark</button>
                <button className="ribbon-btn">Classic</button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'layout' && (
          <div className="ribbon-group">
            <div className="ribbon-section">
              <label>Layouts</label>
              <div className="ribbon-buttons">
                <button className="ribbon-btn">Title Slide</button>
                <button className="ribbon-btn">Title & Content</button>
                <button className="ribbon-btn">Blank</button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'view' && (
          <div className="ribbon-group">
            <div className="ribbon-section">
              <label>Presentation</label>
              <div className="ribbon-buttons">
                <button className="ribbon-btn">Slideshow</button>
                <button className="ribbon-btn">Grid View</button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'export' && (
          <div className="ribbon-group">
            <div className="ribbon-section">
              <label>Export</label>
              <div className="ribbon-buttons">
                <button className="ribbon-btn" onClick={handleExportPDF}>
                  Export PDF
                </button>
                <button className="ribbon-btn">Export PNG</button>
                <button className="ribbon-btn">Export PPT</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Ribbon;
