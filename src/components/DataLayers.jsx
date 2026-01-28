import React, { useMemo, useState, useEffect } from 'react';
import { Source, Layer, Marker, Popup } from 'react-map-gl/mapbox';
import { Truck, Navigation2 } from 'lucide-react';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

// Helper to calculate bearing between two points
const calculateBearing = (start, end) => {
    const startLat = start[1] * (Math.PI / 180);
    const startLng = start[0] * (Math.PI / 180);
    const endLat = end[1] * (Math.PI / 180);
    const endLng = end[0] * (Math.PI / 180);

    const y = Math.sin(endLng - startLng) * Math.cos(endLat);
    const x = Math.cos(startLat) * Math.sin(endLat) -
        Math.sin(startLat) * Math.cos(endLat) * Math.cos(endLng - startLng);
    const bearing = Math.atan2(y, x);
    return (bearing * 180) / Math.PI;
};

// Helper to get distance between two points (Haversine mostly, but for short distances simple euclidean on lat/long is okayish, but let's use a simple approximation for interpolation logic or just use the segment lengths provided by Mapbox API if we parsed them, but raw coords are easier to just loop through).
// Actually, for smooth animation along a LineString, we need to know the total length to normalize time, or just traverse segment by segment.
// Strategy: We will treat the route as a series of segments. We'll distribute the total duration across the total distance.

const getPathLength = (coordinates) => {
    let length = 0;
    for (let i = 0; i < coordinates.length - 1; i++) {
        const [x1, y1] = coordinates[i];
        const [x2, y2] = coordinates[i + 1];
        length += Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }
    return length;
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

export default function DataLayers() {
    const [routes, setRoutes] = useState({ type: 'FeatureCollection', features: [] });
    const [cars, setCars] = useState([]);
    const [time, setTime] = useState(Date.now());
    const [selectedMarker, setSelectedMarker] = useState(null);

    // Initialize Cars and Fetch Routes
    useEffect(() => {
        const initCars = async () => {
            const newCars = [];
            const newRouteFeatures = [];

            // Create 5 random car missions
            for (let i = 0; i < 5; i++) {
                const source = restaurants[i % restaurants.length];
                const target = shelters[(i + 1) % shelters.length];

                // Fetch real route from Mapbox
                try {
                    const query = await fetch(
                        `https://api.mapbox.com/directions/v5/mapbox/driving/${source.lng},${source.lat};${target.lng},${target.lat}?geometries=geojson&access_token=${MAPBOX_TOKEN}`
                    );
                    const json = await query.json();

                    if (json.routes && json.routes[0]) {
                        const route = json.routes[0];
                        const coords = route.geometry.coordinates;

                        // Add to visual route lines
                        newRouteFeatures.push({
                            type: 'Feature',
                            geometry: route.geometry,
                            properties: { traffic: Math.random() }
                        });

                        const length = getPathLength(coords);

                        // Calculate realistic duration based on length
                        // length is in degrees. 1 deg ~= 111km.
                        // 0.01 deg ~= 1.1km. 
                        // Real city speed ~30km/h. 
                        // Let's make it simulate "fast time" but not instant.
                        // Trial: 500,000 ms per degree of length
                        // If path is 0.05 deg (approx 5km), duration = 25,000ms (25s) -> still fast?
                        // User said "too fast". Let's try 2,000,000 ms per degree.
                        // 0.05 * 2,000,000 = 100,000ms = 100s.
                        const speedFactor = 2000000;

                        newCars.push({
                            id: `car-${i}`,
                            path: coords,
                            duration: length * speedFactor,
                            startTime: Date.now() + Math.random() * 5000,
                            pathLength: length
                        });
                    }
                } catch (error) {
                    console.error("Failed to fetch route", error);
                }
            }

            setRoutes({ type: 'FeatureCollection', features: newRouteFeatures });
            setCars(newCars);
        };

        if (MAPBOX_TOKEN) {
            initCars();
        }
    }, []);

    // Animation Loop
    useEffect(() => {
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
            <Source id="routes" type="geojson" data={routes}>
                <Layer
                    id="route-line"
                    type="line"
                    layout={{ 'line-join': 'round', 'line-cap': 'round' }}
                    paint={{
                        'line-color': '#3b82f6', // Blue route lines
                        'line-width': 4,
                        'line-opacity': 0.4
                    }}
                />
            </Source>

            {/* Animated Delivery Cars */}
            {cars.map(car => {
                if (!car.path || car.path.length < 2) return null;

                const elapsed = (time - car.startTime) % car.duration;
                const progress = elapsed / car.duration; // 0 to 1

                // Calculate position along the path
                // We map the linear progress (0-1) to the path's coordinate segments
                // A simple approximation: assume uniform speed across segments (not strictly true but visually okay)
                // Refined approach: Walk distance

                const targetDist = progress * car.pathLength;
                let currentDist = 0;
                let position = car.path[0];
                let bearing = 0;

                for (let i = 0; i < car.path.length - 1; i++) {
                    const start = car.path[i];
                    const end = car.path[i + 1];
                    const segDist = Math.sqrt(Math.pow(end[0] - start[0], 2) + Math.pow(end[1] - start[1], 2));

                    if (currentDist + segDist > targetDist) {
                        // We are in this segment
                        const segProgress = (targetDist - currentDist) / segDist;
                        position = [
                            start[0] + (end[0] - start[0]) * segProgress,
                            start[1] + (end[1] - start[1]) * segProgress
                        ];
                        bearing = calculateBearing(start, end);
                        break;
                    }
                    currentDist += segDist;
                }

                return (
                    <Marker key={car.id} longitude={position[0]} latitude={position[1]} anchor="center">
                        <div
                            style={{
                                transform: `rotate(${bearing}deg)`,
                                transition: 'transform 0.1s linear'
                            }}
                            className="relative z-30"
                        >
                            <div className="bg-blue-600 p-2 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)] border-2 border-white flex items-center justify-center">
                                {/* Navigation Arrow - Points Up by default which matches 0 bearing (North) */}
                                <Navigation2 className="w-5 h-5 text-white fill-white" />
                            </div>
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
                        <div className="absolute bottom-8 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap border border-green-500 font-bold hidden group-hover:block">
                            {r.name}
                        </div>
                    </div>
                </Marker>
            ))}

            {/* Pickup Locations (Cyan) */}
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
                        <div className="absolute bottom-10 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap border border-cyan-500 font-bold hidden group-hover:block">
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
                        <div className="absolute bottom-10 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap border border-red-500 font-bold hidden group-hover:block">
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
