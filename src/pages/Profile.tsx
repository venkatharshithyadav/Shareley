import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useListings } from '../context/ListingsContext';
import ListingCard from '../components/ListingCard';
import { Shirt, ArrowLeft, Plus, LogOut, User } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { getUserListings } = useListings();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const userListings = getUserListings(user.id);
  const activeListings = userListings.filter(l => l.status === 'active');
  const soldListings = userListings.filter(l => l.status !== 'active');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-cyan-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/marketplace')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Shirt className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">Shareley</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/marketplace"
                className="text-gray-600 hover:text-pink-500 transition-colors font-medium"
              >
                Marketplace
              </Link>
              <Link
                to="/add-listing"
                className="bg-pink-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-pink-600 transition-colors inline-flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Listing
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-10 h-10" />
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-600 mt-1">{user.email}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-3xl font-bold text-gray-900">{userListings.length}</div>
            <div className="text-gray-600 mt-1">Total Listings</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-3xl font-bold text-green-600">{activeListings.length}</div>
            <div className="text-gray-600 mt-1">Active Listings</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-3xl font-bold text-gray-600">{soldListings.length}</div>
            <div className="text-gray-600 mt-1">Completed</div>
          </div>
        </div>

        {/* Active Listings */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Active Listings</h2>
            <Link
              to="/add-listing"
              className="bg-pink-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-pink-600 transition-colors inline-flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Listing
            </Link>
          </div>

          {activeListings.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <Shirt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No active listings</h3>
              <p className="text-gray-600 mb-6">Start selling, lending, or renting your clothes</p>
              <Link
                to="/add-listing"
                className="inline-flex items-center bg-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Listing
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeListings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>

        {/* Completed Listings */}
        {soldListings.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Completed Listings</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {soldListings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

