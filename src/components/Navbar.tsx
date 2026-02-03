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
        <nav className="fixed top-0 w-full z-50 transition-all duration-300 glass-morphism border-b border-gray-100/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg transform transition-transform group-hover:rotate-12 group-hover:scale-110">
                            <Shirt className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-600 tracking-tight">Shareley</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/marketplace"
                            className={`text-sm font-medium transition-all duration-200 hover:text-indigo-600 relative group ${isActive('/marketplace') ? 'text-indigo-600' : 'text-gray-600'}`}
                        >
                            Marketplace
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
                        </Link>

                        {isAuthenticated ? (
                            <>
                                {user?.userType === 'company' ? (
                                    <Link
                                        to="/create-campaign"
                                        className={`text-sm font-medium transition-colors hover:text-indigo-600 ${isActive('/create-campaign') ? 'text-indigo-600' : 'text-gray-600'}`}
                                    >
                                        Create Campaign
                                    </Link>
                                ) : (
                                    <Link
                                        to="/add-listing"
                                        className={`text-sm font-medium transition-colors hover:text-indigo-600 ${isActive('/add-listing') ? 'text-indigo-600' : 'text-gray-600'}`}
                                    >
                                        Add Listing
                                    </Link>
                                )}
                                <div className="relative group">
                                    <Link
                                        to="/profile"
                                        className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-indigo-600 ${isActive('/profile') ? 'text-indigo-600' : 'text-gray-600'}`}
                                    >
                                        {user?.avatar ? (
                                            <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover border-2 border-transparent group-hover:border-indigo-500 transition-all shadow-sm" />
                                        ) : (
                                            <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-indigo-50 transition-colors shadow-sm">
                                                <User className="w-5 h-5 text-gray-500 group-hover:text-indigo-500" />
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
                                    className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="px-6 py-2.5 rounded-full text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-0.5"
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
                            className="p-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none transition-colors"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 absolute w-full shadow-2xl transition-all">
                    <div className="px-4 pt-4 pb-8 space-y-3">
                        <Link
                            to="/marketplace"
                            className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Marketplace
                        </Link>
                        {isAuthenticated ? (
                            <>
                                {user?.userType === 'company' ? (
                                    <Link
                                        to="/create-campaign"
                                        className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Create Campaign
                                    </Link>
                                ) : (
                                    <Link
                                        to="/add-listing"
                                        className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Add Listing
                                    </Link>
                                )}
                                <Link
                                    to="/profile"
                                    className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={() => {
                                        logout();
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="pt-4 flex flex-col space-y-3">
                                <Link
                                    to="/login"
                                    className="block w-full text-center px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors border border-gray-200"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="block w-full text-center px-4 py-3 rounded-xl text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
