import React, { useMemo, useState } from 'react';
import { Source, Layer, Marker, Popup } from 'react-map-gl/mapbox';


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

const pickupLocations = [
    { id: 7, lat: 33.7620, lng: -84.3850, name: "Community Fridge (Piedmont)", type: "pickup" },
    { id: 8, lat: 33.7400, lng: -84.4100, name: "Open Pantry South", type: "pickup" },
    { id: 9, lat: 33.7850, lng: -84.3900, name: "Student Commons Popup", type: "pickup" },
];

const generateConnections = () => {
    const features = [];
    const activeCars = [];

    // Create connections between some restaurants and shelters
    restaurants.forEach((r, i) => {
        // Connect each restaurant to a random shelter
        const target = shelters[i % shelters.length];

        const start = [r.lng, r.lat];
        const end = [target.lng, target.lat];

        // Route Line
        features.push({
            type: 'Feature',
            geometry: { type: 'LineString', coordinates: [start, end] },
            properties: { traffic: Math.random() }
        });

        // Car Data (Start, End, Duration, Offset)
        activeCars.push({
            id: `car-${i}`,
            start,
            end,
            duration: 5000 + Math.random() * 5000, // 5-10 seconds
            startTime: Date.now() + Math.random() * 5000
        });
    });

    return {
        geojson: { type: 'FeatureCollection', features },
        cars: activeCars
    };
};

export default function DataLayers() {
    // Memoize the route network data
    const { geojson, cars } = useMemo(() => generateConnections(), []);

    // Animation Frame State
    const [time, setTime] = React.useState(Date.now());
    const [selectedMarker, setSelectedMarker] = useState(null);

    React.useEffect(() => {
        let animationFrame;
        const animate = () => {
            setTime(Date.now());
            animationFrame = requestAnimationFrame(animate);
        };
        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, []);

    return (
        <>
            {/* Route Lines */}
            <Source id="routes" type="geojson" data={geojson}>
                <Layer
                    id="route-line"
                    type="line"
                    layout={{ 'line-join': 'round', 'line-cap': 'round' }}
                    paint={{
                        'line-color': '#ffffff', // Standard Red
                        'line-width': 10,
                        'line-opacity': 0.5
                    }}
                />
            </Source>

            {/* Animated Delivery Cars */}
            {cars.map(car => {
                // Calculate current position
                const elapsed = (time - car.startTime) % car.duration;
                const progress = elapsed / car.duration;

                // Simple Linear Interpolation (Lerp)
                const lng = car.start[0] + (car.end[0] - car.start[0]) * progress;
                const lat = car.start[1] + (car.end[1] - car.start[1]) * progress;

                return (
                    <Marker key={car.id} longitude={lng} latitude={lat} anchor="center">
                        <div className="bg-blue-500 p-1.5 rounded-full shadow-[0_0_10px_#3b82f6] border border-white z-20">
                            {/* Tiny Truck Icon or just a dot */}
                            <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                    </Marker>
                );
            })}

            {/* Restaurants (Supply) - Green Markers */}
            {restaurants.map(r => (
                <Marker
                    key={r.id}
                    longitude={r.lng}
                    latitude={r.lat}
                    anchor="bottom"
                    onClick={e => {
                        e.originalEvent.stopPropagation();
                        setSelectedMarker({ ...r, type: 'source' });
                    }}
                >
                    <div className="relative flex h-6 w-6 items-center justify-center group cursor-pointer z-10">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border border-white"></span>
                        <div className="absolute bottom-8 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap border border-green-500 font-bold">
                            {r.name}
                        </div>
                    </div>
                </Marker>
            ))}

            {/* pickup: Self-Service Locations (Cyan) */}
            {pickupLocations.map(p => (
                <Marker
                    key={p.id}
                    longitude={p.lng}
                    latitude={p.lat}
                    anchor="bottom"
                    onClick={e => {
                        e.originalEvent.stopPropagation();
                        setSelectedMarker({ ...p, type: 'pickup' });
                    }}
                >
                    <div className="relative flex h-8 w-8 items-center justify-center group cursor-pointer z-10">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500 border-2 border-white"></span>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-1 h-1 bg-white rounded-full"></div>
                        </div>
                        <div className="absolute bottom-10 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap border border-cyan-500 font-bold">
                            {p.name}
                        </div>
                    </div>
                </Marker>
            ))}

            {/* Shelters (Demand) - Red Markers */}
            {shelters.map(s => (
                <Marker
                    key={s.id}
                    longitude={s.lng}
                    latitude={s.lat}
                    anchor="bottom"
                    onClick={e => {
                        e.originalEvent.stopPropagation();
                        setSelectedMarker({ ...s, type: 'shelter' });
                    }}
                >
                    <div className="relative flex h-8 w-8 items-center justify-center group cursor-pointer z-10">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
                        <div className="absolute bottom-10 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap border border-red-500 font-bold">
                            {s.name}
                        </div>
                    </div>
                </Marker>
            ))}

            {/* Narrative Popup */}
            {selectedMarker && (
                <Popup
                    longitude={selectedMarker.lng}
                    latitude={selectedMarker.lat}
                    anchor="top"
                    onClose={() => setSelectedMarker(null)}
                    closeOnClick={false}
                    className="z-50"
                >
                    <div className="p-2 min-w-[200px] text-zinc-900">
                        <h3 className="font-bold text-base mb-1">{selectedMarker.name}</h3>
                        <div className="text-sm border-t border-zinc-200 pt-1 mt-1">
                            {selectedMarker.type === 'source' && (
                                <>
                                    <p className="font-semibold text-green-700">Supply Available</p>
                                    <p className="italic text-zinc-600">"Fresh produce donation ready. 50lbs loaded."</p>
                                </>
                            )}
                            {selectedMarker.type === 'shelter' && (
                                <>
                                    <p className="font-semibold text-red-700">Critical Need</p>
                                    <p className="italic text-zinc-600">"Urgent request for warm meals. Capacity at 90%."</p>
                                </>
                            )}
                            {selectedMarker.type === 'pickup' && (
                                <>
                                    <p className="font-semibold text-cyan-700">Self-Service</p>
                                    <p className="italic text-zinc-600">"Community Fridge restocked 10 mins ago. Open 24/7."</p>
                                </>
                            )}
                        </div>
                    </div>
                </Popup>
            )}
        </>
    );
}
