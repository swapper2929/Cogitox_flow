// Utility functions for presentation editor

export const generateId = () => `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const snapToGrid = (value, gridSize = 10, enabled = true) => {
  if (!enabled) return value;
  return Math.round(value / gridSize) * gridSize;
};

export const calculateBoundingBox = (elements) => {
  if (elements.length === 0) return { x: 0, y: 0, width: 0, height: 0 };
  
  const xs = elements.map(el => el.x || 0);
  const ys = elements.map(el => el.y || 0);
  const widths = elements.map(el => (el.x || 0) + (el.width || 0));
  const heights = elements.map(el => (el.y || 0) + (el.height || 0));
  
  return {
    x: Math.min(...xs),
    y: Math.min(...ys),
    width: Math.max(...widths) - Math.min(...xs),
    height: Math.max(...heights) - Math.min(...ys),
  };
};

export const alignElements = (elements, type) => {
  const bbox = calculateBoundingBox(elements);
  
  return elements.map(el => {
    const updated = { ...el };
    
    switch (type) {
      case 'left':
        updated.x = bbox.x;
        break;
      case 'center':
        updated.x = bbox.x + (bbox.width - (el.width || 0)) / 2;
        break;
      case 'right':
        updated.x = bbox.x + bbox.width - (el.width || 0);
        break;
      case 'top':
        updated.y = bbox.y;
        break;
      case 'middle':
        updated.y = bbox.y + (bbox.height - (el.height || 0)) / 2;
        break;
      case 'bottom':
        updated.y = bbox.y + bbox.height - (el.height || 0);
        break;
      default:
        break;
    }
    
    return updated;
  });
};

export const distributeElements = (elements, type, spacing = 10) => {
  if (elements.length < 2) return elements;
  
  const sortedByX = [...elements].sort((a, b) => (a.x || 0) - (b.x || 0));
  const sortedByY = [...elements].sort((a, b) => (a.y || 0) - (b.y || 0));
  
  const result = [];
  
  if (type === 'horizontal') {
    let currentX = sortedByX[0].x || 0;
    sortedByX.forEach((el, index) => {
      if (index > 0) {
        currentX += (sortedByX[index - 1].width || 0) + spacing;
      }
      result.push({ ...el, x: currentX });
    });
  } else if (type === 'vertical') {
    let currentY = sortedByY[0].y || 0;
    sortedByY.forEach((el, index) => {
      if (index > 0) {
        currentY += (sortedByY[index - 1].height || 0) + spacing;
      }
      result.push({ ...el, y: currentY });
    });
  }
  
  return result;
};

export const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export const downloadJSON = (data, filename) => {
  const element = document.createElement('a');
  element.setAttribute(
    'href',
    'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data))
  );
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export const uploadJSON = () => {
  return new Promise((resolve, reject) => {
    const element = document.createElement('input');
    element.setAttribute('type', 'file');
    element.setAttribute('accept', 'application/json');
    element.style.display = 'none';
    
    element.addEventListener('change', (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          resolve(data);
        } catch (error) {
          reject(new Error('Invalid JSON file'));
        }
      };
      
      reader.onerror = () => reject(new Error('File read error'));
      reader.readAsText(file);
    });
    
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  });
};
