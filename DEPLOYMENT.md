# Cogitox Flow - Deployment Checklist

## Pre-Deployment

- [ ] Google OAuth Client ID obtained (optional but recommended)
- [ ] GitHub repository created
- [ ] Node.js 16+ installed locally
- [ ] Domain/GitHub Pages URL decided

## Setup Steps

1. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/Cogitox_flow.git
   cd Cogitox_flow
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   - Create `.env` file in root:
   ```
   REACT_APP_GOOGLE_CLIENT_ID=your_client_id_here
   ```

4. **Build Project**
   ```bash
   npm run build
   ```

5. **Deploy to GitHub Pages**
   ```bash
   npm run deploy
   ```

6. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Select `gh-pages` branch as source
   - Wait for deployment to complete
   - Visit: `https://yourusername.github.io/Cogitox_flow`

## Post-Deployment

- [ ] Test in Chrome, Firefox, Safari (desktop)
- [ ] Test login functionality
- [ ] Test slide creation and editing
- [ ] Test export (PDF/PNG)
- [ ] Verify offline capability
- [ ] Check console for errors (F12)
- [ ] Test on different screen sizes
- [ ] Verify Google Drive integration (if configured)

## Troubleshooting

### "404 - Not Found" on GitHub Pages
- Ensure `package.json` has correct `"homepage"`
- Verify `gh-pages` branch exists
- Check GitHub Pages source is set to `gh-pages`

### Routing Issues
- App uses HashRouter by default
- All routes prefixed with `#` (e.g., `/#/editor/123`)
- This is GitHub Pages compatible

### localStorage Issues
- Clear browser cache if auth not working
- Check browser allows localStorage
- Use incognito/private mode to test fresh

### Google OAuth Not Working
- Verify Client ID in `.env`
- Check authorized redirect URIs in Google Cloud Console
- Include both main domain and `/Cogitox_flow` path

## Performance Tips

- Slides auto-save to IndexedDB every 2 seconds
- Use Chrome DevTools to monitor performance
- For large presentations (100+ slides), consider pagination
- Export as PNG for sharing individual slides

## Customization

### Change App Name
- Update `title` in `public/index.html`
- Update text in `LoginPage.js`

### Change Theme Colors
- Edit color values in `.css` files
- Primary blue: `#0078d4` (PowerPoint blue)
- Replace all instances for theme change

### Add More Slide Layouts
- Edit `SLIDE_LAYOUTS` in `store/editorStore.js`
- Add layout templates in `createDefaultSlide()`

### Modify Ribbon Tabs
- Edit tabs in `components/Ribbon.js`
- Add new functionality in corresponding sections

## GitHub Pages Size Limits

- Free tier: 1GB repository size
- Build artifacts (~2-3MB) included in `gh-pages` branch
- Most presentations stored in IndexedDB (browser storage)
- Large presentations can be uploaded to Google Drive

## Continuous Deployment

To auto-deploy on push:
1. Use GitHub Actions workflow (`.github/workflows/deploy.yml`)
2. Configure to run `npm run deploy` on main branch push
3. Example workflow included in project templates

## Support & Maintenance

- Check browser console (F12) for errors
- IndexedDB storage viewable in DevTools → Application → IndexedDB
- Monitor browser storage usage
- Clear old presentations periodically to free space

---

**Last Updated**: January 2026
**Status**: Production Ready
