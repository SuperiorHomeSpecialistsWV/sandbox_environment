import React from 'react';
import { Footer } from './Footer.tsx';
import { Navbar } from './Navbar.tsx';
import { Sidebar } from './Sidebar.tsx';

interface MainLayoutProps {
    children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    );
} 