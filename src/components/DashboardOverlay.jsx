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
            <h3 className="text-2xl font-bold text-white">{value}</h3>
        </div>
    </motion.div>
);

export default function DashboardOverlay() {
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

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pointer-events-auto">
                <StatCard
                    icon={Store}
                    label="Active Restaurants"
                    value="142"
                    color="bg-orange-500"
                />
                <StatCard
                    icon={Truck}
                    label="Deliveries in Progress"
                    value="89"
                    color="bg-blue-500"
                />
                <StatCard
                    icon={Users}
                    label="Active Users"
                    value="12.5k"
                    color="bg-purple-500"
                />
                <StatCard
                    icon={TrendingUp}
                    label="Avg. Delivery Time"
                    value="24m"
                    color="bg-green-500"
                />
            </div>
        </div>
    );
}
