import React, { useEffect, useRef } from 'react';
import { Stage, Layer, Rect, Text, Image } from 'react-konva';
import { useEditorStore } from '../store/editorStore';
import '../styles/Canvas.css';

function Canvas() {
  const editorStore = useEditorStore();
  const stageRef = useRef(null);
  const slide = editorStore.getCurrentSlide();
  
  // PowerPoint standard: 10" x 7.5" at 96 DPI = 960 x 720
  const SLIDE_WIDTH = 960;
  const SLIDE_HEIGHT = 720;
  const SLIDE_ASPECT = SLIDE_WIDTH / SLIDE_HEIGHT; // 4:3 or 16:9
  
  // Calculate display dimensions based on zoom
  const displayWidth = SLIDE_WIDTH * (editorStore.zoom / 100);
  const displayHeight = SLIDE_HEIGHT * (editorStore.zoom / 100);
  
  const handleStageClick = (e) => {
    if (e.target === e.target.getStage()) {
      editorStore.clearSelection();
    }
  };
  
  const handleElementClick = (elementId, e) => {
    e.cancelBubble = true;
    const isMultiSelect = e.evt.ctrlKey || e.evt.metaKey;
    editorStore.selectElement(elementId, isMultiSelect);
  };
  
  return (
    <div className="canvas-container">
      <div className="canvas-viewport">
        <Stage
          ref={stageRef}
          width={displayWidth}
          height={displayHeight}
          onClick={handleStageClick}
          style={{
            background: 'white',
            border: '1px solid #ccc',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <Layer>
            {/* Slide Background */}
            <Rect
              width={SLIDE_WIDTH}
              height={SLIDE_HEIGHT}
              fill={slide?.background?.color || '#ffffff'}
            />
            
            {/* Grid (optional) */}
            {editorStore.showGrid && (
              <Layer>
                {Array.from({ length: Math.ceil(SLIDE_WIDTH / 50) }).map((_, i) => (
                  <Rect
                    key={`v-${i}`}
                    x={i * 50}
                    y={0}
                    width={1}
                    height={SLIDE_HEIGHT}
                    fill="#f0f0f0"
                  />
                ))}
                {Array.from({ length: Math.ceil(SLIDE_HEIGHT / 50) }).map((_, i) => (
                  <Rect
                    key={`h-${i}`}
                    x={0}
                    y={i * 50}
                    width={SLIDE_WIDTH}
                    height={1}
                    fill="#f0f0f0"
                  />
                ))}
              </Layer>
            )}
            
            {/* Slide Elements */}
            {slide?.elements?.map((element) => (
              <RenderElement
                key={element.id}
                element={element}
                isSelected={editorStore.selectedElementIds.includes(element.id)}
                onClick={(e) => handleElementClick(element.id, e)}
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}

function RenderElement({ element, isSelected, onClick }) {
  const editorStore = useEditorStore();
  
  switch (element.type) {
    case 'text':
      return (
        <Text
          x={element.x || 0}
          y={element.y || 0}
          text={element.content || 'Text Box'}
          fontSize={element.fontSize || 24}
          fill={element.color || '#000'}
          width={element.width || 300}
          height={element.height || 100}
          onClick={onClick}
          stroke={isSelected ? '#0078d4' : 'transparent'}
          strokeWidth={isSelected ? 2 : 0}
          draggable
          onDragEnd={(e) => {
            editorStore.updateElement(element.id, {
              x: e.target.x(),
              y: e.target.y(),
            });
          }}
        />
      );
    
    case 'shape':
      return (
        <Rect
          x={element.x || 0}
          y={element.y || 0}
          width={element.width || 100}
          height={element.height || 100}
          fill={element.fillColor || '#0078d4'}
          stroke={isSelected ? '#0078d4' : 'transparent'}
          strokeWidth={isSelected ? 2 : 0}
          onClick={onClick}
          draggable
          onDragEnd={(e) => {
            editorStore.updateElement(element.id, {
              x: e.target.x(),
              y: e.target.y(),
            });
          }}
        />
      );
    
    default:
      return null;
  }
}

export default Canvas;
