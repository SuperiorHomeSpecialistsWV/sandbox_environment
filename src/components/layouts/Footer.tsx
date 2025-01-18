import React from 'react';

export function Footer() {
    return (
        <footer className="bg-white border-t">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                <p className="text-center text-gray-500">
                    © {new Date().getFullYear()} Your App Name. All rights reserved.
                </p>
            </div>
        </footer>
    );
} 