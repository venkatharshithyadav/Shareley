import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useListings } from '../context/ListingsContext';
import { useAuth } from '../context/AuthContext';
import ListingCard from '../components/ListingCard';
import { ListingType } from '../types';
import { Shirt, Filter, Plus } from 'lucide-react';

const Marketplace: React.FC = () => {
  const { listings } = useListings();
  const { isAuthenticated } = useAuth();
  const [filterType, setFilterType] = useState<ListingType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = Array.from(new Set(listings.map(l => l.category)));

  const filteredListings = listings.filter(listing => {
    const matchesType = filterType === 'all' || listing.type === filterType;
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || listing.category === categoryFilter;
    return matchesType && matchesSearch && matchesCategory && listing.status === 'active';
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-cyan-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Shirt className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">Shareley</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                to="/marketplace"
                className="text-gray-600 hover:text-pink-500 transition-colors font-medium"
              >
                Marketplace
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/add-listing"
                    className="bg-pink-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-pink-600 transition-colors inline-flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Listing
                  </Link>
                  <Link
                    to="/profile"
                    className="text-gray-600 hover:text-pink-500 transition-colors font-medium"
                  >
                    Profile
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-pink-500 transition-colors font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-pink-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-pink-600 transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-500 to-cyan-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Buy, Sell, Lend & Rent Clothes
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Join Shareley to discover sustainable fashion and connect with your community
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <Filter className="w-5 h-5 mr-2 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>
          
          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search listings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as ListingType | 'all')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="sell">Selling</option>
                <option value="lend">Lending</option>
                <option value="rent">Renting</option>
                <option value="free">Free</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="mb-4">
          <p className="text-gray-600">
            Found {filteredListings.length} {filteredListings.length === 1 ? 'listing' : 'listings'}
          </p>
        </div>

        {filteredListings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg">
            <Shirt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No listings found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or search query</p>
            {isAuthenticated && (
              <Link
                to="/add-listing"
                className="inline-flex items-center bg-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Listing
              </Link>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Marketplace;

