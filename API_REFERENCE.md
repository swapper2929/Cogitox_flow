# API Reference - Cogitox Flow

## Stores (Zustand)

### useAuthStore

Manages authentication state.

```javascript
import { useAuthStore } from './store/authStore';

const {
  isAuthenticated,    // boolean
  user,              // { id, username, email }
  login,             // (user, token) => void
  logout,            // () => void
  setUser,           // (user) => void
} = useAuthStore();
```

**Methods:**
- `login(user, token)` - Set authenticated user
- `logout()` - Clear authentication
- `setUser(user)` - Update user data

### useEditorStore

Manages presentation and slide state.

```javascript
import { useEditorStore, SLIDE_LAYOUTS } from './store/editorStore';

const {
  // Project state
  projectId,
  projectName,
  
  // Slide state
  slides,                    // Array of slide objects
  currentSlideIndex,
  
  // Element state
  selectedElementIds,
  
  // UI state
  zoom,                      // 50-200 (percent)
  showGrid,
  snapToGrid,
  
  // Slide operations
  addSlide,                  // (layout?, afterIndex?) => void
  duplicateSlide,            // (slideIndex) => void
  deleteSlide,               // (slideIndex) => void
  reorderSlides,             // (fromIndex, toIndex) => void
  setCurrentSlide,           // (index) => void
  getCurrentSlide,           // () => Slide
  
  // Element operations
  addElement,                // (element) => void
  updateElement,             // (elementId, updates) => void
  deleteElement,             // (elementId) => void
  selectElement,             // (elementId, multiSelect?) => void
  clearSelection,            // () => void
  
  // History
  addToHistory,              // () => void
  undo,                      // () => void
  redo,                      // () => void
  
  // UI
  setZoom,                   // (zoom) => void
  setShowGrid,               // (show) => void
  setSnapToGrid,             // (snap) => void
  
  // Project
  setProjectId,              // (id) => void
  setProjectName,            // (name) => void
  
  // Persistence
  saveProjectData,           // () => ProjectData
  loadProjectData,           // (data) => void
} = useEditorStore();
```

**Slide Layouts:**
```javascript
SLIDE_LAYOUTS = {
  TITLE_SLIDE: 'title-slide',
  TITLE_CONTENT: 'title-content',
  SECTION_HEADER: 'section-header',
  TWO_CONTENT: 'two-content',
  COMPARISON: 'comparison',
  TITLE_ONLY: 'title-only',
  BLANK: 'blank',
  CONTENT_CAPTION: 'content-caption',
  PICTURE_CAPTION: 'picture-caption',
}
```

## API Services

### authService.js

Authentication operations (local & OAuth).

```javascript
import {
  initLocalAuth,
  registerLocalUser,
  authenticateLocal,
  loadGoogleAPI,
  GOOGLE_OAUTH_CONFIG,
} from './api/authService';

// Initialize local auth system
initLocalAuth();

// Register new user
const user = registerLocalUser(username, email, password);
// Returns: { id, username, email }

// Authenticate user
const user = authenticateLocal(username, password);
// Returns: { id, username, email }
// Throws: Error if invalid

// Load Google API (optional)
const gapi = await loadGoogleAPI();
```

### googleDrive.js

Google Drive operations (requires auth).

```javascript
import {
  createProjectFolder,
  uploadProjectFile,
  downloadProjectFile,
  listProjectFiles,
  deleteProjectFile,
} from './api/googleDrive';

// Create folder for project
const folder = await createProjectFolder(projectName, userId);
// Returns: { id, name, webLink }

// Upload project file
const file = await uploadProjectFile(folderId, filename, content);
// Returns: { id, name, modifiedTime }

// Download project file
const data = await downloadProjectFile(fileId);
// Returns: File content object

// List files in folder
const files = await listProjectFiles(folderId);
// Returns: Array of file objects

// Delete file
await deleteProjectFile(fileId);
```

### indexedDB.js

Local storage operations.

```javascript
import {
  saveProjectLocally,
  loadProjectLocally,
  getAllProjectsLocally,
  deleteProjectLocally,
  cacheData,
  getCachedData,
  clearCache,
} from './api/indexedDB';

// Save project
await saveProjectLocally(projectData);

// Load project
const project = await loadProjectLocally(projectId);

// Get all projects
const projects = await getAllProjectsLocally();
// Returns: Array of project objects

// Delete project
await deleteProjectLocally(projectId);

// Cache data
await cacheData('key', { data: 'value' });

// Retrieve cached data
const data = await getCachedData('key');

// Clear all cache
await clearCache();
```

### exportService.js

Export functionality.

```javascript
import {
  exportToPDF,
  exportSlideToPNG,
  exportAllSlidesToPNG,
} from './api/exportService';

// Export all slides to PDF
await exportToPDF(slides, projectName);
// Downloads: projectName.pdf

// Export single slide to PNG
await exportSlideToPNG(canvas, 'slide-1.png');

// Export all slides to PNG
await exportAllSlidesToPNG(canvases, projectName);
// Downloads: projectName-slide-1.png, etc.
```

## Data Structures

### User Object
```javascript
{
  id: 'user-123456',
  username: 'john_doe',
  email: 'john@example.com',
}
```

### Project Object
```javascript
{
  projectId: 'project-123',
  projectName: 'My Presentation',
  slides: [...],        // Array of Slide objects
  createdAt: '2024-01-28T12:00:00Z',
  savedAt: '2024-01-28T12:30:00Z',
}
```

### Slide Object
```javascript
{
  id: 'slide-123',
  layout: 'title-content',  // SLIDE_LAYOUTS value
  elements: [...],          // Array of Element objects
  background: {
    type: 'solid',          // 'solid', 'gradient'
    color: '#ffffff',
  },
  notes: 'Speaker notes',
}
```

### Element Object (Text)
```javascript
{
  id: 'el-123',
  type: 'text',
  x: 100,
  y: 100,
  width: 300,
  height: 100,
  content: 'Text content',
  fontSize: 24,
  color: '#000000',
  fontFamily: 'Segoe UI',
  fontWeight: 'normal',
}
```

### Element Object (Shape)
```javascript
{
  id: 'el-456',
  type: 'shape',
  x: 200,
  y: 150,
  width: 150,
  height: 100,
  fillColor: '#0078d4',
  borderColor: '#000000',
  borderWidth: 1,
}
```

### Element Object (Image)
```javascript
{
  id: 'el-789',
  type: 'image',
  x: 50,
  y: 50,
  width: 200,
  height: 200,
  src: 'data:image/png;base64,...',
  rotation: 0,
}
```

## Hooks

### useLocalStorage
```javascript
import { useLocalStorage } from './hooks/useHooks';

const [value, setValue] = useLocalStorage('key', defaultValue);
// Works like useState but persists to localStorage
```

### useDebounce
```javascript
import { useDebounce } from './hooks/useHooks';

const debouncedValue = useDebounce(value, 500);
// Debounces value updates by 500ms
```

### useWindowSize
```javascript
import { useWindowSize } from './hooks/useHooks';

const { width, height } = useWindowSize();
// Gets current window dimensions
```

## Utilities

### helpers.js

```javascript
import {
  generateId,
  snapToGrid,
  calculateBoundingBox,
  alignElements,
  distributeElements,
  formatBytes,
  downloadJSON,
  uploadJSON,
} from './utils/helpers';

// Generate unique ID
const id = generateId();  // 'id-1234567890-abc123'

// Snap value to grid
const snapped = snapToGrid(125, 10, true);  // 120

// Get bounding box of elements
const bbox = calculateBoundingBox(elements);
// Returns: { x, y, width, height }

// Align elements (left, center, right, top, middle, bottom)
const aligned = alignElements(elements, 'center');

// Distribute elements (horizontal, vertical)
const distributed = distributeElements(elements, 'horizontal', 10);

// Format bytes to readable string
const size = formatBytes(1048576);  // '1 MB'

// Download data as JSON
downloadJSON(data, 'file.json');

// Upload JSON file
const data = await uploadJSON();
```

## Example Usage

### Create a new presentation
```javascript
import { useEditorStore } from './store/editorStore';
import { useAuthStore } from './store/authStore';

function CreatePresentation() {
  const { addSlide, setProjectName, saveProjectData } = useEditorStore();
  const { user } = useAuthStore();

  const handleCreate = (name) => {
    setProjectName(name);
    addSlide();
    const data = saveProjectData();
    console.log('Created:', data);
  };

  return (
    <button onClick={() => handleCreate('My Presentation')}>
      Create
    </button>
  );
}
```

### Add text element
```javascript
import { useEditorStore } from './store/editorStore';

function AddText() {
  const { addElement } = useEditorStore();

  const handleAddText = () => {
    addElement({
      type: 'text',
      x: 100,
      y: 100,
      width: 300,
      height: 100,
      content: 'Double click to edit',
      fontSize: 24,
      color: '#000000',
    });
  };

  return <button onClick={handleAddText}>Add Text</button>;
}
```

### Export presentation
```javascript
import { exportToPDF } from './api/exportService';
import { useEditorStore } from './store/editorStore';

function ExportButton() {
  const { slides, projectName } = useEditorStore();

  const handleExport = async () => {
    try {
      await exportToPDF(slides, projectName);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return <button onClick={handleExport}>Export PDF</button>;
}
```

### Save to IndexedDB
```javascript
import { saveProjectLocally } from './api/indexedDB';
import { useEditorStore } from './store/editorStore';

function SaveButton() {
  const { saveProjectData } = useEditorStore();

  const handleSave = async () => {
    const projectData = saveProjectData();
    await saveProjectLocally(projectData);
    console.log('Saved!');
  };

  return <button onClick={handleSave}>Save</button>;
}
```

## Error Handling

All async operations should be wrapped in try-catch:

```javascript
try {
  const project = await loadProjectLocally(projectId);
  if (!project) {
    throw new Error('Project not found');
  }
} catch (error) {
  console.error('Load failed:', error.message);
  // Handle error...
}
```

## Environment Variables

```javascript
// In components
const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const apiUrl = process.env.REACT_APP_API_BASE_URL;
const debugMode = process.env.REACT_APP_DEBUG_MODE === 'true';
```

---

**Note:** All storage is client-side. There is no backend API in the default configuration.
