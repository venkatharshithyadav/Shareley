import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useListings } from '../context/ListingsContext';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { ArrowLeft, MapPin, DollarSign, Calendar, Mail, MessageSquare, Share2, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

const ListingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getListingById } = useListings();
  const { user } = useAuth();
  const { startConversation, setActiveConversationId, setIsChatOpen } = useChat();
  const navigate = useNavigate();
  const [chatLoading, setChatLoading] = useState(false);

  const listing = id ? getListingById(id) : undefined;

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Listing not found</h2>
          <Link to="/marketplace" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Go back to marketplace
          </Link>
        </div>
      </div>
    );
  }

  const handleChat = async () => {
    if (!user) {
      toast.error('Please login to chat with seller');
      navigate('/login');
      return;
    }

    setChatLoading(true);
    try {
      const conversationId = await startConversation(listing.userId, listing.userName, listing.userAvatar);
      setActiveConversationId(conversationId);
      setIsChatOpen(true);
    } catch (error) {
      console.error(error);
      toast.error('Failed to start chat');
    } finally {
      setChatLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sell':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'lend':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'rent':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'free':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const isOwner = user?.id === listing.userId;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center text-gray-500 hover:text-gray-900 transition-colors group"
        >
          <div className="p-2 rounded-full bg-white shadow-sm border border-gray-100 mr-3 group-hover:border-gray-200 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-medium">Back to Marketplace</span>
        </button>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group">
              <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                {listing.images && listing.images.length > 0 ? (
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <span className="text-6xl">📷</span>
                  </div>
                )}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors text-gray-700 hover:text-red-500">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors text-gray-700 hover:text-indigo-600">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Description & Details */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{listing.title}</h1>
                  <div className="flex items-center space-x-4 text-gray-500">
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                      {listing.location}
                    </span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                      {new Date(listing.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${getTypeColor(listing.type)} uppercase tracking-wide`}>
                  {listing.type}
                </span>
              </div>

              <div className="prose prose-gray max-w-none mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed text-lg">{listing.description}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-8 border-t border-gray-100">
                <div>
                  <span className="text-sm text-gray-500 block mb-1">Category</span>
                  <span className="font-medium text-gray-900">{listing.category}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500 block mb-1">Size</span>
                  <span className="font-medium text-gray-900">{listing.size}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500 block mb-1">Condition</span>
                  <span className="font-medium text-gray-900">{listing.condition}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Price Card */}
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
                <div className="mb-8">
                  <span className="text-sm text-gray-500 uppercase tracking-wider font-medium">Price</span>
                  <div className="flex items-baseline mt-1">
                    <span className="text-4xl font-bold text-gray-900">
                      {listing.price > 0 ? `$${listing.price}` : 'Free'}
                    </span>
                    {listing.type === 'rent' && <span className="text-gray-500 ml-2">/ day</span>}
                  </div>
                </div>

                <div className="space-y-3">
                  {!isOwner ? (
                    <>
                      <button
                        onClick={handleChat}
                        disabled={chatLoading}
                        className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg transform active:scale-[0.98] flex items-center justify-center space-x-2"
                      >
                        {chatLoading ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <MessageSquare className="w-5 h-5" />
                            <span>Chat with Seller</span>
                          </>
                        )}
                      </button>
                      <a
                        href={`mailto:?subject=Regarding: ${listing.title}`}
                        className="w-full bg-white text-gray-700 border border-gray-200 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Mail className="w-5 h-5" />
                        <span>Email Seller</span>
                      </a>
                    </>
                  ) : (
                    <div className="w-full bg-gray-50 text-gray-500 py-4 rounded-xl font-medium text-center border border-gray-200">
                      You own this listing
                    </div>
                  )}
                </div>
              </div>

              {/* Seller Profile Card */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Seller Information</h3>
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md">
                    {listing.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">{listing.userName}</p>
                    <p className="text-sm text-gray-500">Joined recently</p>
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

