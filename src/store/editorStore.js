import { create } from 'zustand';

const SLIDE_LAYOUTS = {
  TITLE_SLIDE: 'title-slide',
  TITLE_CONTENT: 'title-content',
  SECTION_HEADER: 'section-header',
  TWO_CONTENT: 'two-content',
  COMPARISON: 'comparison',
  TITLE_ONLY: 'title-only',
  BLANK: 'blank',
  CONTENT_CAPTION: 'content-caption',
  PICTURE_CAPTION: 'picture-caption',
};

const createDefaultSlide = (layout = SLIDE_LAYOUTS.TITLE_CONTENT) => ({
  id: `slide-${Date.now()}`,
  layout,
  elements: [],
  background: { type: 'solid', color: '#ffffff' },
  notes: '',
});

export const useEditorStore = create((set, get) => ({
  projectId: null,
  projectName: 'Untitled Presentation',
  slides: [createDefaultSlide()],
  currentSlideIndex: 0,
  selectedElementIds: [],
  clipboard: null,
  history: [],
  historyIndex: -1,
  zoom: 100,
  showGrid: true,
  snapToGrid: true,
  
  // Slide operations
  addSlide: (layout = SLIDE_LAYOUTS.TITLE_CONTENT, afterIndex = null) => {
    set((state) => {
      const newSlide = createDefaultSlide(layout);
      const insertIndex = afterIndex !== null ? afterIndex + 1 : state.slides.length;
      const newSlides = [
        ...state.slides.slice(0, insertIndex),
        newSlide,
        ...state.slides.slice(insertIndex),
      ];
      return { slides: newSlides, currentSlideIndex: insertIndex };
    });
  },
  
  duplicateSlide: (slideIndex) => {
    set((state) => {
      const slideToDuplicate = state.slides[slideIndex];
      const newSlide = {
        ...slideToDuplicate,
        id: `slide-${Date.now()}`,
        elements: slideToDuplicate.elements.map((el) => ({
          ...el,
          id: `el-${Date.now()}-${Math.random()}`,
        })),
      };
      return {
        slides: [
          ...state.slides.slice(0, slideIndex + 1),
          newSlide,
          ...state.slides.slice(slideIndex + 1),
        ],
        currentSlideIndex: slideIndex + 1,
      };
    });
  },
  
  deleteSlide: (slideIndex) => {
    set((state) => {
      if (state.slides.length === 1) return state;
      const newSlides = state.slides.filter((_, i) => i !== slideIndex);
      const newIndex = Math.max(0, slideIndex - 1);
      return { slides: newSlides, currentSlideIndex: newIndex };
    });
  },
  
  reorderSlides: (fromIndex, toIndex) => {
    set((state) => {
      const newSlides = [...state.slides];
      const [removed] = newSlides.splice(fromIndex, 1);
      newSlides.splice(toIndex, 0, removed);
      return { slides: newSlides, currentSlideIndex: toIndex };
    });
  },
  
  setCurrentSlide: (index) => set({ currentSlideIndex: index }),
  
  getCurrentSlide: () => {
    const state = get();
    return state.slides[state.currentSlideIndex];
  },
  
  // Element operations
  addElement: (element) => {
    set((state) => {
      const slide = state.slides[state.currentSlideIndex];
      const newElement = {
        id: `el-${Date.now()}-${Math.random()}`,
        ...element,
      };
      const newSlide = {
        ...slide,
        elements: [...slide.elements, newElement],
      };
      const newSlides = [...state.slides];
      newSlides[state.currentSlideIndex] = newSlide;
      return { slides: newSlides };
    });
  },
  
  updateElement: (elementId, updates) => {
    set((state) => {
      const slide = state.slides[state.currentSlideIndex];
      const newSlide = {
        ...slide,
        elements: slide.elements.map((el) =>
          el.id === elementId ? { ...el, ...updates } : el
        ),
      };
      const newSlides = [...state.slides];
      newSlides[state.currentSlideIndex] = newSlide;
      return { slides: newSlides };
    });
  },
  
  deleteElement: (elementId) => {
    set((state) => {
      const slide = state.slides[state.currentSlideIndex];
      const newSlide = {
        ...slide,
        elements: slide.elements.filter((el) => el.id !== elementId),
      };
      const newSlides = [...state.slides];
      newSlides[state.currentSlideIndex] = newSlide;
      return { slides: newSlides, selectedElementIds: [] };
    });
  },
  
  selectElement: (elementId, multiSelect = false) => {
    set((state) => {
      let selectedElementIds = state.selectedElementIds;
      if (multiSelect) {
        selectedElementIds = selectedElementIds.includes(elementId)
          ? selectedElementIds.filter((id) => id !== elementId)
          : [...selectedElementIds, elementId];
      } else {
        selectedElementIds = [elementId];
      }
      return { selectedElementIds };
    });
  },
  
  clearSelection: () => set({ selectedElementIds: [] }),
  
  // History
  addToHistory: () => {
    set((state) => {
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(JSON.stringify(state.slides));
      return { history: newHistory, historyIndex: newHistory.length - 1 };
    });
  },
  
  undo: () => {
    set((state) => {
      if (state.historyIndex > 0) {
        const newIndex = state.historyIndex - 1;
        const slides = JSON.parse(state.history[newIndex]);
        return { slides, historyIndex: newIndex };
      }
      return state;
    });
  },
  
  redo: () => {
    set((state) => {
      if (state.historyIndex < state.history.length - 1) {
        const newIndex = state.historyIndex + 1;
        const slides = JSON.parse(state.history[newIndex]);
        return { slides, historyIndex: newIndex };
      }
      return state;
    });
  },
  
  // UI
  setZoom: (zoom) => set({ zoom }),
  setShowGrid: (show) => set({ showGrid: show }),
  setSnapToGrid: (snap) => set({ snapToGrid: snap }),
  
  // Project
  setProjectId: (id) => set({ projectId: id }),
  setProjectName: (name) => set({ projectName: name }),
  
  // Save/Load
  saveProjectData: () => {
    const state = get();
    return {
      projectId: state.projectId,
      projectName: state.projectName,
      slides: state.slides,
      createdAt: new Date().toISOString(),
    };
  },
  
  loadProjectData: (data) => {
    set({
      projectId: data.projectId,
      projectName: data.projectName,
      slides: data.slides,
      currentSlideIndex: 0,
    });
  },
}));

export { SLIDE_LAYOUTS, createDefaultSlide };
