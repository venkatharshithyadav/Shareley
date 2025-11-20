import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useListings } from '../context/ListingsContext';
import { useAuth } from '../context/AuthContext';
import { Shirt, ArrowLeft, MapPin, DollarSign, Calendar, User, Mail } from 'lucide-react';

const ListingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getListingById } = useListings();
  const { user } = useAuth();
  const navigate = useNavigate();

  const listing = id ? getListingById(id) : undefined;

  if (!listing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Listing not found</h2>
          <Link to="/marketplace" className="text-pink-500 hover:text-pink-600">
            Go back to marketplace
          </Link>
        </div>
      </div>
    );
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sell':
        return 'bg-green-100 text-green-800';
      case 'lend':
        return 'bg-blue-100 text-blue-800';
      case 'rent':
        return 'bg-purple-100 text-purple-800';
      case 'free':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'sell':
        return 'Selling';
      case 'lend':
        return 'Lending';
      case 'rent':
        return 'Renting';
      case 'free':
        return 'Free';
      default:
        return type;
    }
  };

  const isOwner = user?.id === listing.userId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-cyan-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
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
            <Link
              to="/marketplace"
              className="text-gray-600 hover:text-pink-500 transition-colors font-medium"
            >
              Marketplace
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Image */}
              <div className="h-96 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                {listing.images && listing.images.length > 0 ? (
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 text-8xl">👕</div>
                )}
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getTypeColor(listing.type)}`}>
                    {getTypeLabel(listing.type)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(listing.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">{listing.title}</h1>
                <p className="text-gray-600 text-lg mb-6">{listing.description}</p>

                {/* Details */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Category</h3>
                    <p className="text-gray-900">{listing.category}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Size</h3>
                    <p className="text-gray-900">{listing.size}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Condition</h3>
                    <p className="text-gray-900">{listing.condition}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Location</h3>
                    <p className="text-gray-900 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {listing.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              {/* Price */}
              <div className="mb-6">
                {listing.price > 0 ? (
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-8 h-8 text-gray-600" />
                    <span className="text-4xl font-bold text-gray-900">{listing.price}</span>
                  </div>
                ) : (
                  <div className="text-4xl font-bold text-green-600">Free</div>
                )}
              </div>

              {/* Contact Button */}
              {!isOwner ? (
                <button className="w-full bg-pink-500 text-white py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors mb-4 flex items-center justify-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Contact Seller
                </button>
              ) : (
                <div className="w-full bg-gray-100 text-gray-600 py-3 rounded-lg font-semibold text-center mb-4">
                  This is your listing
                </div>
              )}

              {/* Seller Info */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-4">Seller</h3>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {listing.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{listing.userName}</p>
                    <p className="text-sm text-gray-500">Member</p>
                  </div>
                </div>
              </div>

              {/* Listing Info */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    Listed {new Date(listing.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {listing.location}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;

