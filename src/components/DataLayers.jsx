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
    { id: 1, lat: 33.7490, lng: -84.3880, name: "Downtown Hub" },
    { id: 2, lat: 33.7748, lng: -84.3963, name: "Midtown Eats" },
    { id: 3, lat: 33.7537, lng: -84.3730, name: "Edgewood Kitchen" },
    { id: 4, lat: 33.7915, lng: -84.4260, name: "Westside Provisions" },
];

export default function DataLayers() {
    const routes = useMemo(() => generateRoutes(20), []);

    return (
        <>
            <Source id="routes" type="geojson" data={routes}>
                <Layer
                    id="route-line"
                    type="line"
                    layout={{
                        'line-join': 'round',
                        'line-cap': 'round'
                    }}
                    paint={{
                        'line-color': [
                            'interpolate',
                            ['linear'],
                            ['get', 'traffic'],
                            0, '#22c55e', // low traffic - green
                            0.5, '#eab308', // medium - yellow
                            1, '#ef4444' // high - red
                        ],
                        'line-width': 4,
                        'line-opacity': 0.8
                    }}
                />
            </Source>

            {/* Pulsing Markers */}
            {restaurants.map(r => (
                <Marker key={r.id} longitude={r.lng} latitude={r.lat} anchor="bottom">
                    <div className="relative flex h-8 w-8 items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-orange-500 border-2 border-white"></span>
                    </div>
                </Marker>
            ))}
        </>
    );
}
