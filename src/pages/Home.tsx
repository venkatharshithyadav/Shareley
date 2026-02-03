import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useListings } from '../context/ListingsContext';
import { useBrandCampaigns } from '../context/BrandCampaignsContext';
import ListingCard from '../components/ListingCard';
import BrandCampaignCard from '../components/BrandCampaignCard';
import HeroSearch from '../components/HeroSearch';
import { ArrowRight, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { listings, loading } = useListings();
  const { campaigns, loading: campaignsLoading } = useBrandCampaigns();
  const recentListings = listings.filter(l => l.status === 'active').slice(0, 6);

  if (loading || campaignsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-16 lg:pt-32 lg:pb-24">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full -z-10 bg-white">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-tr from-purple-50 to-transparent"></div>
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-40 right-1/4 w-96 h-96 bg-pink-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-indigo-100 shadow-sm mb-6 animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-medium text-indigo-900">The Future of Fashion Commerce</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
            Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">Unique</span> <br />
            Fashion & Style
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed font-light">
            The world's first AI-powered marketplace. Buy, sell, and discover exclusive drops from top brands and your community.
          </p>

          <div className="max-w-xl mx-auto mb-10 transform hover:scale-[1.01] transition-transform duration-300">
            <HeroSearch />
          </div>

          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup"
                className="px-6 py-3 rounded-full bg-gray-900 text-white font-semibold text-base hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center"
              >
                Start Exploring
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Brand Campaigns Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                Curated Collections
              </h2>
              <p className="text-xl text-gray-500 max-w-2xl">
                Exclusive drops and campaigns from world-renowned brands.
              </p>
            </div>
            {campaigns.length > 4 && (
              <Link to="/marketplace?campaigns=true" className="group flex items-center text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
                View Collections
                <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>

          {campaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {campaigns.slice(0, 8).map(campaign => (
                <div key={campaign.id} className="transform transition-all duration-300 hover:-translate-y-2">
                  <BrandCampaignCard campaign={campaign} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
              <div className="inline-block p-4 rounded-full bg-indigo-50 mb-4">
                <TrendingUp className="w-8 h-8 text-indigo-500" />
              </div>
              <p className="text-gray-500 text-lg">New collections dropping soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* Recent Listings with dark background for contrast */}
      {recentListings.length > 0 && (
        <section className="py-24 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-16">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4">Fresh from the Community</h2>
                <p className="text-xl text-gray-400">Discover unique pieces listed by people like you.</p>
              </div>
              <Link
                to="/marketplace"
                className="hidden md:flex items-center px-6 py-3 rounded-full border border-white/20 hover:bg-white/10 transition-colors font-medium"
              >
                View Marketplace
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentListings.map(listing => (
                // We might need to wrap ListingCard to style it for dark mode if it doesn't support it natively
                // Assuming ListingCard is flexible or we might need to adjust it. 
                // For now, let's wrap it in a div that ensures text visibility if the card has transparent bg
                <div key={listing.id} className="transform hover:scale-[1.02] transition-transform duration-300">
                  <ListingCard listing={listing} />
                </div>
              ))}
            </div>

            <div className="mt-12 text-center md:hidden">
              <Link
                to="/marketplace"
                className="inline-flex items-center text-indigo-400 font-semibold"
              >
                View Marketplace
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Features / Benefits */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="p-6">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-600">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Authentic & Verified</h3>
              <p className="text-gray-500 leading-relaxed">Every item is verified for authenticity so you can shop with complete peace of mind.</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-purple-600">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Powered Discovery</h3>
              <p className="text-gray-500 leading-relaxed">Our advanced AI helps you find exactly what you're looking for with voice search.</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-pink-600">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Sustainable Fashion</h3>
              <p className="text-gray-500 leading-relaxed">Join the circular economy by buying and selling pre-loved items.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 z-0"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8 tracking-tight">
            Ready to Upgrade Your Style?
          </h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            Join thousands of fashion enthusiasts buying, selling, and discovering unique pieces every day.
          </p>
          {!isAuthenticated ? (
            <Link
              to="/signup"
              className="inline-flex items-center px-8 py-4 rounded-full bg-white text-indigo-900 font-bold text-lg hover:bg-indigo-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              Get Started Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          ) : (
            <Link
              to="/marketplace"
              className="inline-flex items-center px-8 py-4 rounded-full bg-white text-indigo-900 font-bold text-lg hover:bg-indigo-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
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
