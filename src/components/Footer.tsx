import React from 'react';
import { Link } from 'react-router-dom';
import { Shirt, Github, Twitter, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center space-x-2 mb-6">
                            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                <Shirt className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight">Shareley</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            The world's first AI-assisted fashion marketplace. Buy, sell, lend, and rent clothes with your community in a sustainable way.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-6">Marketplace</h3>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li>
                                <Link to="/marketplace" className="hover:text-white transition-colors">Browse Listings</Link>
                            </li>
                            <li>
                                <Link to="/marketplace?type=sell" className="hover:text-white transition-colors">Buy Clothes</Link>
                            </li>
                            <li>
                                <Link to="/marketplace?type=rent" className="hover:text-white transition-colors">Rent Outfits</Link>
                            </li>
                            <li>
                                <Link to="/add-listing" className="hover:text-white transition-colors">Sell Your Items</Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-6">Support</h3>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li>
                                <a href="#" className="hover:text-white transition-colors">Help Center</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition-colors">Safety Guidelines</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-6">Stay Updated</h3>
                        <p className="text-gray-400 text-sm mb-4">
                            Subscribe to our newsletter for the latest fashion trends and updates.
                        </p>
                        <form className="flex flex-col space-y-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                            />
                            <button
                                type="submit"
                                className="bg-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-pink-600 transition-colors text-sm"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Shareley. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
