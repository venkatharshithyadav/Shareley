import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useListings } from '../context/ListingsContext';
import ListingCard from '../components/ListingCard';
import HeroSearch from '../components/HeroSearch';
import { Shirt, ArrowRight, Users, Heart, TrendingUp } from 'lucide-react';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { listings, loading } = useListings();
  const recentListings = listings.filter(l => l.status === 'active').slice(0, 6);

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

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Shareley?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Sustainable fashion made easy. Buy, sell, lend, and rent clothes with your community.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-pink-500" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Sustainable</h3>
              <p className="text-gray-600">
                Give clothes a second life and reduce fashion waste. Every item you share makes a difference.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-cyan-500" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Community</h3>
              <p className="text-gray-600">
                Connect with people in your area. Buy, sell, lend, or rent clothes with trusted community members.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Affordable</h3>
              <p className="text-gray-600">
                Find great deals on quality clothes. Or earn money by selling items you no longer need.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-pink-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in just a few simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-pink-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sign Up</h3>
              <p className="text-gray-600">Create your free account in seconds</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-cyan-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">List Items</h3>
              <p className="text-gray-600">Add your clothes and choose: sell, lend, rent, or give away</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Browse</h3>
              <p className="text-gray-600">Discover amazing clothes from your community</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect</h3>
              <p className="text-gray-600">Contact sellers and complete your transaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Listings */}
      {recentListings.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Recent Listings</h2>
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

