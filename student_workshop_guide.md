# Workshop: Building a 3D Urban Anayltics Dashboard
**Target Audience**: Architecture & Planning Students
**Goal**: Create a web-based, interactive 3D map of a city using open-source tools.

---

## 🛠️ Phase 1: The Digital Toolbox (Prerequisites)

Before we start building, ensure you have the following installed:
1.  **Node.js (LTS Version)**: The engine that runs our development tools. [Download here](https://nodejs.org/).
2.  **VS Code**: The code editor we will use. [Download here](https://code.visualstudio.com/).
3.  **Git**: For version control and publishing. [Download here](https://git-scm.com/).
4.  **Mapbox Account**: Sign up at [mapbox.com](https://www.mapbox.com/) and create a generic public **Access Token**.

---

## 🚀 Phase 2: Laying the Foundation (Project Setup)

We will use **Vite** (pronounced "veet") to quickly set up a modern web project with **React**.

1.  **Open Terminal** in VS Code (Ctrl+` or Terminal > New Terminal).
2.  Run the creation command:
    ```bash
    npm create vite@latest city-dashboard -- --template react
    ```
3.  Enter the project folder and install the code libraries:
    ```bash
    cd city-dashboard
    npm install
    npm install react-map-gl mapbox-gl
    ```
4.  Start your local server:
    ```bash
    npm run dev
    ```
    *Open the link (e.g., `http://localhost:5173`) in your browser.*

---

## 🗺️ Phase 3: The Context Site (Basic Map)

We need a canvas. We will replace the default code with a full-screen map.

**1. Create the Map Component**
Create a new file `src/Map.jsx`:
```jsx
import React from 'react';
import Map, { NavigationControl } from 'react-map-gl/mapbox';

const TOKEN = 'YOUR_MAPBOX_TOKEN_HERE'; // 🔑 Replace this!

export default function MapComponent() {
  return (
    <Map
      initialViewState={{
        longitude: -84.3880, // Atlanta
        latitude: 33.7490,
        zoom: 14,
        pitch: 60, // Tilt for 3D effect
        bearing: -20
      }}
      style={{width: '100vw', height: '100vh'}}
      mapStyle="mapbox://styles/mapbox/dark-v11" // Try 'light-v11' or 'satellite-streets-v12'
      mapboxAccessToken={TOKEN}
      mapLib={window.mapboxgl} // Important for compatibility
    >
      <NavigationControl />
    </Map>
  );
}
```

**2. Update the Main App**
In `src/App.jsx`:
```jsx
import MapComponent from './Map';

function App() {
  return <MapComponent />;
}
export default App;
```

**3. Add the Library CDN**
In `index.html`, add these lines inside the `<head>` tag:
```html
<link href="https://api.mapbox.com/mapbox-gl-js/v3.1.2/mapbox-gl.css" rel="stylesheet">
<script src="https://api.mapbox.com/mapbox-gl-js/v3.1.2/mapbox-gl.js"></script>
```

---

## 🏢 Phase 4: Going Vertical (3D Buildings)

Architecture is about volume. Let's turn the flat map into a 3D model using Mapbox's global building data.

Update `src/Map.jsx` to include the **Layer** component inside the `<Map>` tag:

```jsx
import Map, { Layer, NavigationControl } from 'react-map-gl/mapbox';

// ... inside the Map component, before closing </Map>
<Layer
  id="3d-buildings"
  type="fill-extrusion"
  source="composite"
  source-layer="building"
  filter={['==', 'extrude', 'true']}
  minzoom={15}
  paint={{
    'fill-extrusion-color': '#aaa', // Building color
    'fill-extrusion-height': ['get', 'height'], // Data-driven height
    'fill-extrusion-base': ['get', 'min_height'],
    'fill-extrusion-opacity': 0.6
  }}
/>
```

### 🎨 Design Challenge
Try changing the `fill-extrusion-color` to match your studio's color palette, or use an interpolator to color buildings by height!

---

## 🌍 Phase 5: Exhibition (Publishing)

Publish your dashboard to the web using **GitHub Pages**.

1.  **Initialize Git**:
    ```bash
    git init
    git add .
    git commit -m "Initial dashboard"
    ```
2.  **Create a Repository** on GitHub (name it `city-dashboard`).
3.  **Push your code** (follow the instructions on GitHub).
4.  **Configure Deployment**:
    - Go to Repository Settings > Pages.
    - Source: **GitHub Actions**.
    - Create a `.github/workflows/deploy.yml` file in your project (ask your instructor for the template).

---

## 📚 Resources
- **Mapbox Studio**: Design custom base maps (colors, fonts).
- **React-Map-GL Docs**: Advanced markers and popups.
- **Tailwind CSS**: Rapid styling for overlay panels.
