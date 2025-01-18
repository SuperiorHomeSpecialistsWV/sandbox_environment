import React from 'react';

export function Sidebar() {
    const menuItems = [
        { name: 'Dashboard', path: '/' },
        { name: 'Communications', path: '/communications' },
        { name: 'Integrations', path: '/integrations' },
        { name: 'Templates', path: '/templates' },
    ];

    return (
        <aside className="w-64 bg-white border-r min-h-screen">
            <div className="p-4">
                <nav className="space-y-1">
                    {menuItems.map((item) => (
                        <a
                            key={item.path}
                            href={item.path}
                            className="flex items-center px-2 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
                        >
                            {item.name}
                        </a>
                    ))}
                </nav>
            </div>
        </aside>
    );
} 