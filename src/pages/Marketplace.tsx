import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useListings } from '../context/ListingsContext';
import { useBrandCampaigns } from '../context/BrandCampaignsContext';
import { useAuth } from '../context/AuthContext';
import ListingCard from '../components/ListingCard';
import BrandCampaignCard from '../components/BrandCampaignCard';
import VoiceSearch from '../components/VoiceSearch';
import { analyzeSearchIntent, extractBrandFromQuery, isBrandQuery } from '../utils/aiSearch';
import { ListingType, Listing } from '../types';
import { Shirt, Filter, Plus, Sparkles, X } from 'lucide-react';

const Marketplace: React.FC = () => {
  const { listings, loading } = useListings();
  const { campaigns, getCampaignsByBrand, loading: campaignsLoading } = useBrandCampaigns();
  const { isAuthenticated } = useAuth();
  const [filterType, setFilterType] = useState<ListingType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [aiResults, setAiResults] = useState<Listing[] | null>(null);
  const [isAiActive, setIsAiActive] = useState(false);
  const [showCampaigns, setShowCampaigns] = useState(false);
  const [brandFilter, setBrandFilter] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    const ai = params.get('ai');
    const brand = params.get('brand');
    const showCampaignsParam = params.get('campaigns');

    if (brand) {
      setBrandFilter(brand);
      setShowCampaigns(true);
    }

    if (showCampaignsParam === 'true') {
      setShowCampaigns(true);
    }

    if (query && ai === 'true') {
      setSearchQuery(query);

      // Check if it's a brand query
      const detectedBrand = extractBrandFromQuery(query);
      if (detectedBrand || isBrandQuery(query)) {
        setShowCampaigns(true);
        if (detectedBrand) {
          setBrandFilter(detectedBrand);
        }
      }

      setIsAiActive(true);
      const results = analyzeSearchIntent(query, listings);
      setAiResults(results);
    }
  }, [location.search, listings]);

  const categories = Array.from(new Set(listings.map(l => l.category)));

  const handleVoiceSearch = (query: string) => {
    setSearchQuery(query);
    setIsAiActive(true);
    const results = analyzeSearchIntent(query, listings);
    setAiResults(results);
  };

  const clearAiSearch = () => {
    setIsAiActive(false);
    setAiResults(null);
    setSearchQuery('');
  };

  // Standard filtering
  const standardFilteredListings = listings.filter(listing => {
    const matchesType = filterType === 'all' || listing.type === filterType;
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || listing.category === categoryFilter;
    return matchesType && matchesSearch && matchesCategory && listing.status === 'active';
  });

  const displayListings = isAiActive && aiResults ? aiResults : standardFilteredListings;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-cyan-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-cyan-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-500 to-cyan-500 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            AI-Powered Fashion Marketplace
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Tell us what you're looking for, and let our AI find the perfect match.
          </p>

          {/* AI Search Bar */}
          <div className="max-w-2xl mx-auto bg-white rounded-full p-2 shadow-2xl flex items-center">
            <div className="pl-4">
              <Sparkles className="w-6 h-6 text-pink-500" />
            </div>
            <input
              type="text"
              placeholder="Try 'I need a halloween outfit' or 'Summer dress for beach party'..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (isAiActive) setIsAiActive(false); // Reset AI mode on manual typing
              }}
              className="flex-grow px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent"
            />
            <div className="pr-2">
              <VoiceSearch onSearch={handleVoiceSearch} />
            </div>
          </div>
          {isAiActive && (
            <div className="mt-4 inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              AI Results Active
              <button onClick={clearAiSearch} className="ml-2 hover:text-pink-200">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Brand Campaigns Section */}
      {showCampaigns && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {brandFilter ? `${brandFilter} Campaigns` : 'Brand Campaigns'}
              </h2>
              <p className="text-gray-600">Exclusive deals from international brands</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {(brandFilter ? getCampaignsByBrand(brandFilter) : campaigns).map(campaign => (
                <BrandCampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
            {brandFilter && (
              <button
                onClick={() => {
                  setBrandFilter(null);
                  setShowCampaigns(false);
                }}
                className="text-pink-500 hover:text-pink-600 font-semibold inline-flex items-center"
              >
                <X className="w-4 h-4 mr-2" />
                Clear brand filter
              </button>
            )}
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isAiActive && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center mb-4">
              <Filter className="w-5 h-5 mr-2 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
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
        )}

        {/* Listings Grid */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-gray-600">
            Found {displayListings.length} {displayListings.length === 1 ? 'listing' : 'listings'}
            {isAiActive && ' (AI Recommended)'}
          </p>
        </div>

        {displayListings.length === 0 ? (
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
            {displayListings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Marketplace;

