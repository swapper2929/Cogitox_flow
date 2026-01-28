import React from 'react';
import { useEditorStore } from '../store/editorStore';
import '../styles/InspectorPanel.css';

function InspectorPanel() {
  const editorStore = useEditorStore();
  const selectedElements = editorStore.selectedElementIds
    .map((id) => editorStore.getCurrentSlide()?.elements?.find((el) => el.id === id))
    .filter(Boolean);
  
  const handlePropertyChange = (propertyName, value) => {
    selectedElements.forEach((element) => {
      editorStore.updateElement(element.id, { [propertyName]: value });
    });
  };
  
  return (
    <div className="inspector-panel">
      <div className="inspector-header">
        <h3>Format</h3>
      </div>
      
      <div className="inspector-content">
        {selectedElements.length === 0 ? (
          <div className="inspector-placeholder">
            <p>Select an element to format</p>
          </div>
        ) : (
          <>
            {selectedElements[0].type === 'text' && (
              <div className="inspector-section">
                <label>Text</label>
                <input
                  type="text"
                  value={selectedElements[0].content || ''}
                  onChange={(e) => handlePropertyChange('content', e.target.value)}
                  placeholder="Text content"
                />
                
                <label>Font Size</label>
                <input
                  type="number"
                  value={selectedElements[0].fontSize || 24}
                  onChange={(e) => handlePropertyChange('fontSize', parseInt(e.target.value))}
                  min="8"
                  max="72"
                />
                
                <label>Color</label>
                <input
                  type="color"
                  value={selectedElements[0].color || '#000000'}
                  onChange={(e) => handlePropertyChange('color', e.target.value)}
                />
              </div>
            )}
            
            {selectedElements[0].type === 'shape' && (
              <div className="inspector-section">
                <label>Fill Color</label>
                <input
                  type="color"
                  value={selectedElements[0].fillColor || '#0078d4'}
                  onChange={(e) => handlePropertyChange('fillColor', e.target.value)}
                />
                
                <label>Width</label>
                <input
                  type="number"
                  value={selectedElements[0].width || 100}
                  onChange={(e) => handlePropertyChange('width', parseInt(e.target.value))}
                  min="10"
                />
                
                <label>Height</label>
                <input
                  type="number"
                  value={selectedElements[0].height || 100}
                  onChange={(e) => handlePropertyChange('height', parseInt(e.target.value))}
                  min="10"
                />
              </div>
            )}
            
            <div className="inspector-section">
              <label>Position</label>
              <div className="inspector-row">
                <div>
                  <label>X</label>
                  <input
                    type="number"
                    value={selectedElements[0].x || 0}
                    onChange={(e) => handlePropertyChange('x', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <label>Y</label>
                  <input
                    type="number"
                    value={selectedElements[0].y || 0}
                    onChange={(e) => handlePropertyChange('y', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default InspectorPanel;
