import React, { useMemo } from 'react';
import { Source, Layer, Marker } from 'react-map-gl/mapbox';

// Mock Data Generators
const generateRoutes = (count) => {
    const routes = {
        type: 'FeatureCollection',
        features: []
    };

    // Atlanta center
    const center = [-84.3880, 33.7490];

    for (let i = 0; i < count; i++) {
        // Random start/end points around Atlanta
        const start = [
            center[0] + (Math.random() - 0.5) * 0.1,
            center[1] + (Math.random() - 0.5) * 0.1
        ];
        const end = [
            center[0] + (Math.random() - 0.5) * 0.1,
            center[1] + (Math.random() - 0.5) * 0.1
        ];

        routes.features.push({
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: [start, end]
            },
            properties: {
                traffic: Math.random()
            }
        });
    }
    return routes;
};

const restaurants = [
    { id: 1, lat: 33.7490, lng: -84.3880, name: "Downtown Hub", type: "source" },
    { id: 2, lat: 33.7748, lng: -84.3963, name: "Midtown Eats", type: "source" },
    { id: 3, lat: 33.7537, lng: -84.3730, name: "Edgewood Kitchen", type: "source" },
];

const shelters = [
    { id: 4, lat: 33.7915, lng: -84.4260, name: "Westside Shelter", type: "shelter" },
    { id: 5, lat: 33.7320, lng: -84.4050, name: "Community Center", type: "shelter" },
    { id: 6, lat: 33.7650, lng: -84.3550, name: "Youth Point", type: "shelter" },
];

export default function DataLayers() {
    const routes = useMemo(() => generateRoutes(20), []);

    return (
        <>
            <Source id="routes" type="geojson" data={routes}>
                <Layer
                    id="route-line"
                    type="line" // ... keeping existing line styles
                    layout={{ 'line-join': 'round', 'line-cap': 'round' }}
                    paint={{
                        'line-color': '#eab308', // Gold connectors
                        'line-width': 2,
                        'line-opacity': 0.4
                    }}
                />
            </Source>

            {/* Restaurants (Supply) - Green Markers */}
            {restaurants.map(r => (
                <Marker key={r.id} longitude={r.lng} latitude={r.lat} anchor="bottom">
                    <div className="relative flex h-6 w-6 items-center justify-center group cursor-pointer">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border border-white"></span>
                        {/* Tooltip */}
                        <div className="absolute bottom-8 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap border border-green-500">
                            Source: {r.name}
                        </div>
                    </div>
                </Marker>
            ))}

            {/* Shelters (Demand) - Red Markers */}
            {shelters.map(s => (
                <Marker key={s.id} longitude={s.lng} latitude={s.lat} anchor="bottom">
                    <div className="relative flex h-8 w-8 items-center justify-center group cursor-pointer">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
                        {/* Tooltip */}
                        <div className="absolute bottom-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap border border-red-500">
                            Need: {s.name}
                        </div>
                    </div>
                </Marker>
            ))}
        </>
    );
}
