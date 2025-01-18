import { motion } from 'framer-motion';
import { Bell, Search, Settings, User } from 'lucide-react';
import React, { useState } from 'react';

const MainDashboard = () => {
    const [notifications, setNotifications] = useState(3);

    const quickStats = [
        { label: 'Active Leads', value: '24', trend: '+12%' },
        { label: 'Pending Installs', value: '8', trend: '-2%' },
        { label: 'Monthly Revenue', value: '$45.2K', trend: '+8%' },
        { label: 'Customer Rating', value: '4.8', trend: '+0.3' },
    ];

    return (
        <div className="flex h-screen bg-white">
            <div className="flex-1 overflow-auto bg-gray-50">
                <header className="bg-white shadow-lg border-b border-gray-200">
                    <div className="h-20 flex items-center justify-between px-6">
                        <div className="flex items-center flex-1">
                            <h2 className="text-2xl font-bold text-[#102F62]">Welcome to Your Dashboard</h2>
                        </div>

                        <div className="mx-4 flex-1 max-w-xl">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-[#3A77B4] focus:ring-2 focus:ring-[#3A77B4]/20 transition-all"
                                />
                                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button className="relative p-2 text-gray-600 hover:text-[#102F62] transition-colors">
                                <Bell className="h-6 w-6" />
                                {notifications > 0 && (
                                    <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                        {notifications}
                                    </span>
                                )}
                            </button>
                            <button className="p-2 text-gray-600 hover:text-[#102F62] transition-colors">
                                <Settings className="h-6 w-6" />
                            </button>
                            <button className="flex items-center space-x-2 p-2 text-gray-600 hover:text-[#102F62] transition-colors">
                                <User className="h-6 w-6" />
                                <span className="hidden md:inline">Profile</span>
                            </button>
                        </div>
                    </div>
                </header>

                <main className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {quickStats.map((stat, index) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                key={stat.label}
                                className="bg-white rounded-lg shadow-md p-6"
                            >
                                <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-2xl font-bold text-[#102F62]">{stat.value}</span>
                                    <span className={`text-sm ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                                        {stat.trend}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* ... existing section cards code ... */}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainDashboard; 