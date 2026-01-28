// PDF and Image Export utilities

export const exportToPDF = async (slides, projectName) => {
  const { jsPDF } = window;
  if (!jsPDF) {
    throw new Error('jsPDF not loaded');
  }
  
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [356.4, 266.4], // PowerPoint widescreen 16:9
  });
  
  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    
    // Add background
    if (slide.background?.type === 'solid') {
      pdf.setFillColor(slide.background.color || '#ffffff');
      pdf.rect(0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight(), 'F');
    }
    
    // Render elements (simplified - you may need html2canvas for complex content)
    slide.elements.forEach((el) => {
      if (el.type === 'text') {
        pdf.setFontSize(el.fontSize || 12);
        pdf.text(el.content, el.x / 10, el.y / 10);
      }
    });
    
    if (i < slides.length - 1) {
      pdf.addPage();
    }
  }
  
  pdf.save(`${projectName}.pdf`);
};

export const exportSlideToPNG = async (canvas, filename = 'slide.png') => {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        resolve();
      }, 'image/png');
    } catch (error) {
      reject(error);
    }
  });
};

export const exportAllSlidesToPNG = async (canvases, projectName) => {
  for (let i = 0; i < canvases.length; i++) {
    const canvas = canvases[i];
    const filename = `${projectName}-slide-${i + 1}.png`;
    await new Promise((resolve) => setTimeout(resolve, 100)); // Small delay
    await exportSlideToPNG(canvas, filename);
  }
};
