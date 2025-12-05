import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shirt, Menu, X, Plus, User, LogOut } from 'lucide-react';

const Navbar: React.FC = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-cyan-500 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
                            <Shirt className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900 tracking-tight">Shareley</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/marketplace"
                            className={`text-sm font-medium transition-colors hover:text-pink-500 ${isActive('/marketplace') ? 'text-pink-500' : 'text-gray-600'
                                }`}
                        >
                            Marketplace
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/add-listing"
                                    className={`text-sm font-medium transition-colors hover:text-pink-500 ${isActive('/add-listing') ? 'text-pink-500' : 'text-gray-600'
                                        }`}
                                >
                                    Add Listing
                                </Link>
                                <div className="relative group">
                                    <Link
                                        to="/profile"
                                        className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-pink-500 ${isActive('/profile') ? 'text-pink-500' : 'text-gray-600'
                                            }`}
                                    >
                                        {user?.avatar ? (
                                            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border-2 border-transparent group-hover:border-pink-500 transition-all" />
                                        ) : (
                                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-pink-50 transition-colors">
                                                <User className="w-4 h-4" />
                                            </div>
                                        )}
                                        <span>Profile</span>
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/login"
                                    className="text-sm font-medium text-gray-600 hover:text-pink-500 transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-600 hover:text-gray-900 focus:outline-none"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        <Link
                            to="/marketplace"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-pink-500 hover:bg-pink-50"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Marketplace
                        </Link>
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/add-listing"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-pink-500 hover:bg-pink-50"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Add Listing
                                </Link>
                                <Link
                                    to="/profile"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-pink-500 hover:bg-pink-50"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={() => {
                                        logout();
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-pink-500 hover:bg-pink-50"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-pink-500 hover:bg-pink-50"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
