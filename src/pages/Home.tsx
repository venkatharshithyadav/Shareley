import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useListings } from '../context/ListingsContext';
import { useBrandCampaigns } from '../context/BrandCampaignsContext';
import ListingCard from '../components/ListingCard';
import BrandCampaignCard from '../components/BrandCampaignCard';
import HeroSearch from '../components/HeroSearch';
import { ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { listings, loading } = useListings();
  const { campaigns, loading: campaignsLoading } = useBrandCampaigns();
  const recentListings = listings.filter(l => l.status === 'active').slice(0, 6);

  if (loading || campaignsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-cyan-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-cyan-50">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-20 right-10 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-cyan-600">
                AI-Powered
              </span>{' '}
              Fashion
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              The world's first voice-assisted marketplace. Just say what you're looking for.
            </p>

            <HeroSearch />

          </div>
        </div>
      </section>

      {/* Brand Campaigns Section - Main Focus */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Shop by Brand
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Exclusive deals from top international brands. Click on any brand to explore their collection.
            </p>
          </div>

          {campaigns.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {campaigns.slice(0, 8).map(campaign => (
                  <BrandCampaignCard key={campaign.id} campaign={campaign} />
                ))}
              </div>

              {campaigns.length > 8 && (
                <div className="text-center mt-12">
                  <Link
                    to="/marketplace?campaigns=true"
                    className="inline-flex items-center text-pink-500 hover:text-pink-600 font-semibold text-lg"
                  >
                    View All {campaigns.length} Brand Campaigns
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-6">No brand campaigns available at the moment.</p>
              <Link
                to="/marketplace"
                className="inline-flex items-center bg-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors"
              >
                Browse Community Listings
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Recent Listings */}
      {recentListings.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-pink-50 to-cyan-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Community Listings</h2>
                <p className="text-xl text-gray-600">Check out the latest items from our community</p>
              </div>
              <Link
                to="/marketplace"
                className="text-pink-500 hover:text-pink-600 font-semibold inline-flex items-center"
              >
                View All
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentListings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-pink-500 to-cyan-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join Shareley today and start buying, selling, lending, and renting clothes with your community.
          </p>
          {!isAuthenticated ? (
            <Link
              to="/signup"
              className="bg-white text-pink-500 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors inline-flex items-center"
            >
              Create Free Account
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          ) : (
            <Link
              to="/marketplace"
              className="bg-white text-pink-500 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors inline-flex items-center"
            >
              Browse Marketplace
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
