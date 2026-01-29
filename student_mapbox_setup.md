# 🗺️ Essential: Safe Mapbox Setup Guide

**Stop! Read this before you start coding.**

One of the most common issues in these workshops is the map not loading (blank white screen) because of mixed-up installations. Follow these steps exactly to ensure your "Vibe Coding" session goes smoothly.

## 1. The Clean Install

We are using `npm` packages, not CDN links. This is more stable.

Run this command in your terminal:
```bash
npm install mapbox-gl react-map-gl
```

## 2. The Token (The Key to the City)

1.  Create a file named `.env` in your project root (next to `package.json`).
2.  Add this single line:
    ```
    VITE_MAPBOX_TOKEN=pk.eyJ1... (paste your token here)
    ```
    *(Note: It MUST start with `VITE_`)*

## 3. The Forgotten Step: CSS

If your map looks "broken" or the markers are huge/invisible, you forgot the CSS.

Open `src/main.jsx` (or wherever your `createRoot` call is) and add this import at the very top:

```javascript
import 'mapbox-gl/dist/mapbox-gl.css';
```

## 4. The "Safe" Component

When you ask Antigravity to create a map, sometimes it tries to use `window.mapboxgl` which we don't have.

**Prompt Antigravity with this specifically:**

> "Create a Map component using 'react-map-gl'. Import 'mapboxgl' directly from 'mapbox-gl' package. Do NOT use CDN links in index.html. Ensure the map takes up the full screen."

## Troubleshooting

-   **White Screen?** Check your console (`F12`). If it says "Access Token Missing", check step 2.
-   **Weird Layout?** Check step 3.
-   **Mapbox GL JS mismatch?** Delete `node_modules` and run `npm install`.
