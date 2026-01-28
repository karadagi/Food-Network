import React, { useEffect, useRef, useState } from 'react';
import { Layers, ChevronDown } from 'lucide-react';
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

const MAP_STYLES = [
    { name: 'Night', style: 'mapbox://styles/mapbox/navigation-night-v1' },
    { name: 'Dark', style: 'mapbox://styles/mapbox/dark-v11' },
    { name: 'Satellite', style: 'mapbox://styles/mapbox/satellite-streets-v12' },
    { name: 'Light', style: 'mapbox://styles/mapbox/light-v11' }
];

export default function MapComponent({ children }) {
    const mapRef = useRef(null);
    const [viewState, setViewState] = useState(ATLANTA_VIEW);
    const [mapStyle, setMapStyle] = useState(MAP_STYLES[0].style);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
            mapStyle={mapStyle}
            mapboxAccessToken={MAPBOX_TOKEN}
            fog={{
                "range": [0.5, 10],
                "color": "#242b3b", // Deep Slate/Blue matching buildings
                "horizon-blend": 0.2,
                "high-color": "#1e293b", // Dark Blue-Grey
                "space-color": "#0f172a", // Darker Slate
                "star-intensity": 0.5
            }}
        >
            <NavigationControl position="top-right" showCompass={false} />
            <FullscreenControl position="top-right" />

            {/* Style Switcher */}
            <div className="absolute top-4 right-12 z-10 flex flex-col items-end">
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="bg-black/80 backdrop-blur-md p-2 rounded-lg border border-zinc-700 text-white flex items-center space-x-2 hover:bg-black/90 transition-colors shadow-xl"
                >
                    <Layers className="w-5 h-5 text-zinc-300" />
                    <span className="text-sm font-medium pr-1">
                        {MAP_STYLES.find(s => s.style === mapStyle)?.name}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                    <div className="mt-2 bg-black/90 backdrop-blur-xl border border-zinc-800 rounded-lg shadow-2xl overflow-hidden min-w-[140px]">
                        {MAP_STYLES.map((style) => (
                            <button
                                key={style.name}
                                onClick={() => {
                                    setMapStyle(style.style);
                                    setIsDropdownOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between
                                    ${mapStyle === style.style
                                        ? 'bg-blue-600/20 text-blue-400 font-bold'
                                        : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                                    }`}
                            >
                                {style.name}
                                {mapStyle === style.style && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Logistics Network - Gold/Amber flow */}
            <Layer
                id="neon-roads"
                source="composite"
                source-layer="road"
                type="line"
                filter={['==', 'class', 'street']}
                paint={{
                    'line-color': '#ffffffff', // Amber
                    'line-width': 8,
                    'line-blur': 1,
                    'line-opacity': 0.8
                }}
            />
            <Layer
                id="neon-roads-main"
                source="composite"
                source-layer="road"
                type="line"
                filter={['in', 'class', 'motorway', 'primary', 'secondary']}
                paint={{
                    'line-color': '#ffcc00', // Bright Gold
                    'line-width': 3,
                    'line-blur': 3,
                    'line-opacity': 0.8
                }}
            />

            <Layer
                id="3d-buildings"
                source="composite"
                source-layer="building"
                type="fill-extrusion"
                minzoom={14}
                paint={{
                    'fill-extrusion-color': '#1a1a1a', // Darker matte background
                    'fill-extrusion-height': ['get', 'height'],
                    'fill-extrusion-base': ['get', 'min_height'],
                    'fill-extrusion-opacity': 1,
                    'fill-extrusion-vertical-gradient': true
                }}
            />
            {children}
        </Map>
    );
}


