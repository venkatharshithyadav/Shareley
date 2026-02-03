import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { Toaster } from 'react-hot-toast';
import ChatWidget from './ChatWidget';

const Layout: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-grow pt-16">
                <Outlet />
            </main>
            <ChatWidget />
            <Footer />
            <Toaster
                position="bottom-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#333',
                        color: '#fff',
                    },
                    success: {
                        style: {
                            background: '#10B981',
                        },
                    },
                    error: {
                        style: {
                            background: '#EF4444',
                        },
                    },
                }}
            />
        </div>
    );
};

export default Layout;
