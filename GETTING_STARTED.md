# Getting Started with Cogitox Flow

## Quick Start (5 minutes)

### 1. Prerequisites
- Node.js 16.x or higher
- npm 7.x or higher
- Git

Check your versions:
```bash
node --version
npm --version
```

### 2. Clone & Install
```bash
git clone https://github.com/yourusername/Cogitox_flow.git
cd Cogitox_flow
npm install
```

### 3. Start Development Server
```bash
npm start
```

Your app opens at `http://localhost:3000`

### 4. Create a Test Account
- Sign in page appears automatically
- Create a new account: `testuser` / `password123`
- Create your first presentation

## Development Guide

### Project Structure

```
Cogitox_flow/
├── public/
│   ├── index.html           # Entry point
│   └── 404.html            # GitHub Pages SPA fix
├── src/
│   ├── api/                # API layer
│   │   ├── authService.js
│   │   ├── googleDrive.js
│   │   ├── indexedDB.js
│   │   └── exportService.js
│   ├── components/         # React components
│   │   ├── Ribbon.js
│   │   ├── SlidePanel.js
│   │   ├── Canvas.js
│   │   ├── InspectorPanel.js
│   │   ├── StatusBar.js
│   │   └── Modal.js
│   ├── pages/             # Page components
│   │   ├── LoginPage.js
│   │   ├── HomePage.js
│   │   └── EditorPage.js
│   ├── store/             # Zustand stores
│   │   ├── authStore.js
│   │   └── editorStore.js
│   ├── styles/            # CSS files
│   ├── utils/
│   │   └── helpers.js
│   ├── hooks/
│   │   └── useHooks.js
│   ├── App.js             # Main component
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
├── README.md
├── DEPLOYMENT.md
├── GETTING_STARTED.md
└── .gitignore
```

### Key Concepts

#### State Management (Zustand)
Uses lightweight Zustand stores for state:

```javascript
// In components
import { useEditorStore } from '../store/editorStore';

function MyComponent() {
  const { slides, addSlide } = useEditorStore();
  // Use state and actions
}
```

#### Authentication
Two authentication methods:

**Client-side (Default)**:
- Credentials stored in browser localStorage
- No server needed
- Best for internal/demo use

**Google OAuth (Optional)**:
- Configure with `.env` file
- Requires Google Client ID
- Access to Google Drive

#### Storage
**IndexedDB** (Default):
- Automatic, works offline
- ~50MB per domain
- Persists across sessions

**Google Drive** (Optional):
- Unlimited storage
- Requires authentication
- Cloud sync capability

### Common Tasks

#### Add a New Component
1. Create file in `src/components/MyComponent.js`
2. Create CSS file in `src/styles/MyComponent.css`
3. Import and use in parent component

```javascript
// src/components/MyComponent.js
import '../styles/MyComponent.css';

function MyComponent() {
  return <div className="my-component">Content</div>;
}

export default MyComponent;
```

#### Add a New Store
1. Create in `src/store/myStore.js`
2. Use Zustand pattern with `create()`
3. Import in components with `useMyStore()`

```javascript
import { create } from 'zustand';

export const useMyStore = create((set, get) => ({
  value: 0,
  increment: () => set(state => ({ value: state.value + 1 })),
}));
```

#### Add a Ribbon Feature
Edit `src/components/Ribbon.js`:
1. Add new tab to tabs array
2. Add new case in ribbon-content rendering
3. Implement button handlers

```javascript
// In Ribbon.js
{activeTab === 'newtab' && (
  <div className="ribbon-group">
    <div className="ribbon-section">
      <label>Section Name</label>
      <div className="ribbon-buttons">
        <button className="ribbon-btn" onClick={handleAction}>
          Action Button
        </button>
      </div>
    </div>
  </div>
)}
```

#### Add Canvas Elements
Edit `src/components/Canvas.js`:
1. Add element type to switch statement
2. Implement render logic with Konva components
3. Add update logic in `editorStore`

```javascript
case 'mycustom':
  return (
    <Rect
      {...renderProps}
      fill={element.fillColor || '#0078d4'}
    />
  );
```

### Styling

Use CSS with BEM naming:
```css
.component-name {
  /* Block */
}

.component-name__element {
  /* Element */
}

.component-name--modifier {
  /* Modifier */
}
```

Colors:
- Primary Blue: `#0078d4` (PowerPoint)
- Light Gray: `#f3f3f3`
- Border Gray: `#d0d0d0`
- Text: `#1a1a1a` or `#666`

### Keyboard Shortcuts

Core shortcuts already implemented:
- `Ctrl+Z` / `Cmd+Z`: Undo
- `Ctrl+Y` / `Cmd+Y`: Redo
- `Ctrl+N` / `Cmd+N`: New Slide

To add more, edit `src/pages/EditorPage.js`:

```javascript
const handleKeyDown = (e) => {
  if (e.ctrlKey || e.metaKey) {
    if (e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  }
};
```

### Debugging

#### Browser DevTools
1. Open: `F12` (Windows/Linux) or `Cmd+Option+I` (Mac)
2. **Console**: Check for errors
3. **Application → IndexedDB**: View stored presentations
4. **Application → LocalStorage**: View auth tokens

#### React DevTools
Install extension: [React DevTools](https://react-devtools-tutorial.vercel.app/)

#### Zustand DevTools
Export store with debugging:
```javascript
import { devtools } from 'zustand/middleware';

export const useEditorStore = create(
  devtools((set, get) => ({...}))
);
```

### Testing Locally

```bash
# Start dev server
npm start

# Open in browser
# http://localhost:3000

# Test different screen sizes
# DevTools → Toggle device toolbar (Ctrl+Shift+M)

# Test offline
# DevTools → Network → Offline → Reload
```

## Building for Production

### Build Process
```bash
npm run build
```

Creates optimized `build/` folder:
- JavaScript bundles minified
- CSS optimized
- Assets hashed for caching
- Ready for deployment

### Pre-deployment Checklist
- [ ] All features tested locally
- [ ] No console errors
- [ ] localStorage works
- [ ] Offline mode works
- [ ] Export PDF/PNG works
- [ ] Responsive design tested

### Deploy to GitHub Pages

```bash
# 1. Build
npm run build

# 2. Deploy
npm run deploy

# 3. Verify
# Visit: https://yourusername.github.io/Cogitox_flow
```

## Troubleshooting

### "Module not found" error
```bash
# Clean install
rm -rf node_modules
rm package-lock.json
npm install
```

### Port 3000 already in use
```bash
# Use different port
PORT=3001 npm start
```

### localStorage is not defined (SSR)
Wrap in `typeof window !== 'undefined'`:
```javascript
if (typeof window !== 'undefined') {
  localStorage.setItem('key', 'value');
}
```

### Canvas not rendering
Check:
1. Stage dimensions correct
2. Layer inside Stage
3. Elements have x, y, width, height
4. No render errors in console

### Git deployment issues
```bash
# Clear cache
rm -rf build node_modules
npm install

# Rebuild and deploy
npm run build
npm run deploy
```

## Performance Tips

1. **Lazy load components**: Use React.lazy() for heavy components
2. **Memoize expensive calculations**: Use useMemo hook
3. **Debounce inputs**: Use useDebounce for real-time updates
4. **Optimize images**: Compress before adding to presentations
5. **Monitor bundle size**: Run `npm run build` and check output

## Security Notes

- ✅ No server—data never leaves browser
- ✅ localStorage encrypted if needed (optional library)
- ✅ Google OAuth uses secure token flow
- ⚠️ Demo credentials are not production-ready
- ⚠️ Enable HTTPS for production deployment

## Next Steps

1. Configure Google OAuth (optional)
2. Add custom branding/theming
3. Implement additional slide layouts
4. Add animation/transition support
5. Build collaborative features
6. Deploy to production

## Support

- Check README.md for feature overview
- See DEPLOYMENT.md for deployment details
- Review component files for implementation examples
- Check browser console for errors

---

**Happy coding!** 🚀
