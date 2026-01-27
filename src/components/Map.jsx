import React, { useEffect, useRef, useState } from 'react';
import Map, { Source, Layer, NavigationControl, FullscreenControl } from 'react-map-gl/mapbox';

// Atlanta coordinates
const ATLANTA_VIEW = {
    longitude: -84.3880,
    latitude: 33.7490,
    zoom: 15.5,
    pitch: 60,
    bearing: -20
};

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export default function MapComponent({ children }) {
    const mapRef = useRef(null);
    const [viewState, setViewState] = useState(ATLANTA_VIEW);
    const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!MAPBOX_TOKEN) {
        return (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 text-white z-50">
                <div className="text-center p-6 max-w-md border border-red-500 rounded bg-red-900/20">
                    <h2 className="text-xl font-bold mb-2">Mapbox Token Missing</h2>
                    <p>Please create a <code className="bg-black/50 px-1 py-0.5 rounded">.env</code> file in the project root with your token.</p>
                </div>
            </div>
        );
    }

    return (
        <Map
            ref={mapRef}
            mapLib={window.mapboxgl}
            {...viewState}
            onMove={evt => setViewState(evt.viewState)}
            style={{ width: '100%', height: '100%' }}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            mapboxAccessToken={MAPBOX_TOKEN}
        >
            <NavigationControl position="top-right" />
            <FullscreenControl position="top-right" />

            <Layer
                id="3d-buildings"
                source="composite"
                source-layer="building"
                filter={['==', 'extrude', 'true']}
                type="fill-extrusion"
                minzoom={15}
                paint={{
                    'fill-extrusion-color': '#aaa',
                    'fill-extrusion-height': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        15,
                        0,
                        15.05,
                        ['get', 'height']
                    ],
                    'fill-extrusion-base': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        15,
                        0,
                        15.05,
                        ['get', 'min_height']
                    ],
                    'fill-extrusion-opacity': 0.6
                }}
            />
            {children}
        </Map>
    );
}


