import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Store, TrendingUp, Users } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/80 backdrop-blur-md border border-zinc-800 p-4 rounded-xl shadow-lg flex items-center space-x-4"
    >
        <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
            <p className="text-zinc-400 text-sm font-medium">{label}</p>
            <motion.h3
                key={value} // Triggers animation on change
                initial={{ color: "#34d399", scale: 1.1 }} // Flash Green & Scale Up
                animate={{ color: "#ffffff", scale: 1 }}   // Fade to White & Scale Down
                transition={{ duration: 0.5 }}
                className="text-2xl font-bold"
            >
                {value}
            </motion.h3>
        </div>
    </motion.div>
);

const ActivityItem = ({ text, time }) => (
    <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ opacity: 0 }}
        className="bg-black/90 backdrop-blur-md border-l-2 border-l-orange-500 border-t border-r border-b border-zinc-800 p-3 rounded mb-2 shadow-lg"
    >
        <p className="text-gray-100 text-sm font-medium">{text}</p>
        <p className="text-zinc-500 text-xs mt-1 font-mono">{time}</p>
    </motion.div>
);

export default function DashboardOverlay() {
    const [stats, setStats] = React.useState({
        restaurants: 142,
        deliveries: 89,
        users: 12500,
        avgTime: 24
    });

    const [activities, setActivities] = React.useState([
        { id: 1, text: "System Online. Monitoring Logistics.", time: "Now" }
    ]);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => ({
                restaurants: Math.max(130, prev.restaurants + (Math.random() > 0.5 ? 1 : -1)),
                deliveries: Math.max(50, prev.deliveries + Math.floor(Math.random() * 5) - 2),
                users: Math.max(12000, prev.users + Math.floor(Math.random() * 10) - 4),
                avgTime: Math.max(20, Math.min(35, prev.avgTime + (Math.random() > 0.6 ? 1 : -1)))
            }));
        }, 3000); // Update every 3 seconds

        return () => clearInterval(interval);
    }, []);

    // Activity Feed Simulation
    React.useEffect(() => {
        const messages = [
            "Driver #42 picked up 50lbs from Midtown Eats",
            "Route optimized for Westside Shelter delivery",
            "New donation alert: 200 meals available",
            "Community Center received shipment",
            "Traffic delay rerouted in Sector 4",
            "Volunteer #89 checked in at Downtown Hub",
            "Surplus detected at Edgewood Kitchen"
        ];

        const interval = setInterval(() => {
            const randomMsg = messages[Math.floor(Math.random() * messages.length)];
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            setActivities(prev => [{ id: Date.now(), text: randomMsg, time }, ...prev].slice(0, 5));
        }, 4500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-start pointer-events-auto"
            >
                <div className="bg-black/90 backdrop-blur-md p-6 rounded-2xl border border-zinc-800 shadow-2xl">
                    <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-red-600 mb-1">
                        ATLANTA FOOD NETWORK
                    </h1>
                    <p className="text-zinc-500 font-medium tracking-wide text-sm">REAL-TIME LOGISTICS NETWORK</p>
                </div>

                <div className="flex space-x-4">
                    <div className="bg-black/80 backdrop-blur-md px-4 py-2 rounded-lg border border-zinc-800 flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-white text-sm font-medium">System Online</span>
                    </div>
                </div>
            </motion.div>

            {/* Live Activity Feed - Right Side */}
            <div className="absolute top-32 right-6 w-80 pointer-events-auto flex flex-col items-end">
                <h3 className="text-zinc-500 font-bold mb-2 uppercase tracking-widest text-xs">Live Feed</h3>
                <div className="w-full">
                    {activities.map(activity => (
                        <ActivityItem key={activity.id} text={activity.text} time={activity.time} />
                    ))}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pointer-events-auto">
                <StatCard
                    icon={Store}
                    label="Active Restaurants"
                    value={stats.restaurants}
                    color="bg-orange-500"
                />
                <StatCard
                    icon={Truck}
                    label="Deliveries in Progress"
                    value={stats.deliveries}
                    color="bg-blue-500"
                />
                <StatCard
                    icon={Users}
                    label="Active Users"
                    value={(stats.users / 1000).toFixed(1) + 'k'}
                    color="bg-purple-500"
                />
                <StatCard
                    icon={TrendingUp}
                    label="Avg. Delivery Time"
                    value={stats.avgTime + 'm'}
                    color="bg-green-500"
                />
            </div>
        </div>
    );
}
