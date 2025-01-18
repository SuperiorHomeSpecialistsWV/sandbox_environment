import React from 'react';

export function Navbar() {
    return (
        <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <span className="text-xl font-semibold">Your App Name</span>
                    </div>
                    <div className="flex items-center">
                        {/* Add user profile, notifications, etc. */}
                        <span className="p-2">Profile</span>
                    </div>
                </div>
            </div>
        </nav>
    );
} 