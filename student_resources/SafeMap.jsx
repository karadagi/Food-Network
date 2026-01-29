import React, { useRef, useState } from 'react';
import Map, { NavigationControl } from 'react-map-gl';
import mapboxgl from 'mapbox-gl'; // Import directly from package
import 'mapbox-gl/dist/mapbox-gl.css'; // Ensure CSS is loaded

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export default function SafeMap({ children }) {
    // 1. Validation: Fail fast if no token
    if (!MAPBOX_TOKEN) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#18181b',
                color: '#ef4444',
                fontFamily: 'monospace'
            }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Mapbox Token Missing</h2>
                    <p style={{ marginTop: '0.5rem', color: '#a1a1aa' }}>
                        Create a <code style={{ backgroundColor: '#27272a', padding: '0.2rem' }}>.env</code> file:
                    </p>
                    <pre style={{ backgroundColor: '#27272a', padding: '1rem', marginTop: '1rem', borderRadius: '0.5rem' }}>
                        VITE_MAPBOX_TOKEN=pk.your_token_here
                    </pre>
                </div>
            </div>
        );
    }

    // 2. Initial View State (Atlanta defaults)
    const [viewState, setViewState] = useState({
        longitude: -84.3880,
        latitude: 33.7490,
        zoom: 12
    });

    return (
        <Map
            {...viewState}
            onMove={evt => setViewState(evt.viewState)}
            // 3. Robust Styling
            style={{ width: '100vw', height: '100vh' }}
            mapStyle="mapbox://styles/mapbox/dark-v11"
            mapboxAccessToken={MAPBOX_TOKEN}
            // 4. Critical: Use the imported library, not window
            mapLib={mapboxgl}
        >
            <NavigationControl position="top-right" />
            {children}
        </Map>
    );
}
