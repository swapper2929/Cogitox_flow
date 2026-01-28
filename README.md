# Cogitox Flow - PowerPoint-like Presentation Editor

**Cogitox Flow** is an enterprise-grade, browser-based presentation editor that replicates Microsoft PowerPoint's look and functionality. Built entirely for GitHub Pages with no backend requirements.

## 🎯 Key Features

- **PowerPoint-identical UI**: Ribbon toolbar, slide panels, canvas, inspector, status bar
- **100% Client-side**: Runs entirely in the browser
- **GitHub Pages compatible**: Deploy directly without backend infrastructure
- **Offline-first**: IndexedDB for local caching and offline support
- **Google Drive integration**: Store presentations in Google Drive (optional)
- **Authentication**: Client-side OAuth or local username/password
- **Slide Layouts**: 9 pre-configured layouts
- **Rich Editing**: Text, shapes, images, tables
- **Export**: PDF and PNG export capabilities
- **Undo/Redo**: Full history stack with Ctrl+Z/Ctrl+Y

## 🛠 Technology Stack

- React 18 + React Router (HashRouter)
- Zustand (state management)
- Konva.js (canvas rendering)
- IndexedDB (offline storage)
- Google Drive API (optional cloud storage)

## 📦 Project Structure

```
src/
├── api/              # API layer (auth, storage, export)
├── components/       # React components (Ribbon, Canvas, etc.)
├── pages/           # Page components (Login, Home, Editor)
├── store/           # Zustand stores
└── styles/          # CSS stylesheets
```

## 🚀 Deployment on GitHub Pages

```bash
npm install
npm run build
npm run deploy
```

Then enable GitHub Pages in repository settings (gh-pages branch).

## 🔐 Authentication

- **Local**: Username/password (client-side storage)
- **Google OAuth**: Popup-based auth with Google Drive access

## 💾 Storage

- **IndexedDB**: Default, offline-capable (~50MB)
- **Google Drive**: Optional, unlimited cloud storage

## 📝 Usage

1. Sign in or create account
2. Create new presentation
3. Edit slides with ribbon toolbar
4. Use left panel for slide navigation
5. Edit properties in right inspector
6. Auto-saves every 2 seconds
7. Export as PDF or PNG

## ⌨️ Keyboard Shortcuts

- `Ctrl+Z` / `Cmd+Z`: Undo
- `Ctrl+Y` / `Cmd+Y`: Redo
- `Ctrl+N` / `Cmd+N`: New Slide
- `Delete`: Delete element

## 🎨 Design

- Light, bright interface with Segoe UI font
- Sharp edges (no rounded corners/glassmorphism)
- PowerPoint-accurate layout and spacing
- Desktop-first responsive design

## 📤 Export

- **PDF**: Full presentation with all slides
- **PNG**: Single or batch slide export

## 🐛 Development

```bash
npm start              # Local development
npm run build          # Production build
npm test              # Run tests
```

## 📋 Slide Layouts

- Title Slide
- Title and Content
- Section Header
- Two Content
- Comparison
- Title Only
- Blank
- Content with Caption
- Picture with Caption

## 🔒 Privacy & Security

- All data stays in your browser (no server)
- Google OAuth with drive.file scope only
- Optional client-side encryption
- No tracking or analytics

---

**Cogitox Labs International** - Enterprise Presentation Solutions