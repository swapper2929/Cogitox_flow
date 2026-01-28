import React, { useState } from 'react';
import { useEditorStore } from '../store/editorStore';
import '../styles/SlidePanel.css';

function SlidePanel() {
  const editorStore = useEditorStore();
  const [draggedSlideIndex, setDraggedSlideIndex] = useState(null);
  
  const handleDragStart = (e, index) => {
    setDraggedSlideIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  
  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedSlideIndex !== null && draggedSlideIndex !== targetIndex) {
      editorStore.reorderSlides(draggedSlideIndex, targetIndex);
    }
    setDraggedSlideIndex(null);
  };
  
  const handleDragEnd = () => {
    setDraggedSlideIndex(null);
  };
  
  return (
    <div className="slide-panel">
      <div className="slide-panel-header">
        <h3>Slides</h3>
      </div>
      
      <div className="slide-list">
        {editorStore.slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`slide-thumbnail ${
              editorStore.currentSlideIndex === index ? 'active' : ''
            } ${draggedSlideIndex === index ? 'dragging' : ''}`}
            onClick={() => editorStore.setCurrentSlide(index)}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
          >
            <div className="thumbnail-content">
              <span className="slide-number">{index + 1}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SlidePanel;
