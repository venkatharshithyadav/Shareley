import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useListings } from '../context/ListingsContext';
import { useBrandCampaigns } from '../context/BrandCampaignsContext';
import ListingCard from '../components/ListingCard';
import BrandCampaignCard from '../components/BrandCampaignCard';
import { supabase } from '../lib/supabase';
import { Shirt, Plus, LogOut, User, Trash2, Upload, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile: React.FC = () => {
  const { user, logout, isAuthenticated, loading: authLoading } = useAuth();
  const { getUserListings, deleteListing, updateListing, loading: listingsLoading } = useListings();
  const { campaigns, loading: campaignsLoading } = useBrandCampaigns();
  const navigate = useNavigate();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadingAvatar(true);
      console.log('Starting avatar upload...');

      if (!e.target.files || e.target.files.length === 0) {
        console.log('No file selected');
        return;
      }

      const file = e.target.files[0];
      console.log('File selected:', file.name, 'Size:', file.size, 'Type:', file.type);

      const fileExt = file.name.split('.').pop();
      const fileName = `avatar_${user?.id}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      console.log('Uploading to:', filePath);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('listing-images')
        .upload(filePath, file);

      console.log('Upload response:', { uploadData, uploadError });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      const { data } = supabase.storage.from('listing-images').getPublicUrl(filePath);
      console.log('Public URL:', data.publicUrl);

      // Update user metadata with avatar URL
      console.log('Updating user metadata...');
      const { data: updateData, error: updateError } = await supabase.auth.updateUser({
        data: { avatar: data.publicUrl }
      });

      console.log('Update response:', { updateData, updateError });

      if (updateError) {
        throw new Error(`Failed to update profile: ${updateError.message}`);
      }

      toast.success('Profile picture updated! Refreshing...');

      // Wait a moment for Supabase to sync
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      toast.error(error.message || 'Failed to upload profile picture. Please check the console for details.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (authLoading || listingsLoading || campaignsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-cyan-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const userListings = getUserListings(user.id);
  const activeListings = userListings.filter(l => l.status === 'active');
  const soldListings = userListings.filter(l => l.status !== 'active');

  // Get brand's campaigns
  const brandCampaigns = user.userType === 'company'
    ? campaigns.filter(c => c.userId === user.id)
    : [];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isCompany = user.userType === 'company';

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* Avatar with Upload */}
              <div className="relative group">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{user.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>

                {/* Upload Button Overlay */}
                <label className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-6 h-6 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={uploadingAvatar}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-600">{user.email}</p>
                {isCompany && (
                  <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                    Brand Account
                  </span>
                )}
                <p className="text-sm text-gray-500 mt-1">
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
            <div className="text-4xl font-bold text-gray-900">
              {isCompany ? brandCampaigns.length : userListings.length}
            </div>
            <div className="text-gray-600 mt-2">
              {isCompany ? 'Total Campaigns' : 'Total Listings'}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-4xl font-bold text-green-600">
              {isCompany ? brandCampaigns.filter(c => c.isActive).length : activeListings.length}
            </div>
            <div className="text-gray-600 mt-2">
              {isCompany ? 'Active Campaigns' : 'Active Listings'}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-4xl font-bold text-gray-600">
              {isCompany ? brandCampaigns.filter(c => !c.isActive).length : soldListings.length}
            </div>
            <div className="text-gray-600 mt-2">
              {isCompany ? 'Inactive Campaigns' : 'Completed'}
            </div>
          </div>
        </div>

        {/* Brand Campaigns Section */}
        {isCompany && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Brand Campaigns</h2>
              <Link
                to="/create-campaign"
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition-all inline-flex items-center shadow-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Campaign
              </Link>
            </div>

            {brandCampaigns.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {brandCampaigns.map(campaign => (
                  <BrandCampaignCard key={campaign.id} campaign={campaign} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <Shirt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No campaigns yet</h3>
                <p className="text-gray-600 mb-6">
                  Create your first brand campaign to showcase your products
                </p>
                <Link
                  to="/create-campaign"
                  className="inline-flex items-center bg-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Campaign
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Individual User Listings Section */}
        {!isCompany && (
          <>
            {/* Active Listings */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">My Active Listings</h2>
                <Link
                  to="/add-listing"
                  className="bg-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors inline-flex items-center"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add New Listing
                </Link>
              </div>

              {activeListings.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeListings.map(listing => (
                    <div key={listing.id} className="relative">
                      <ListingCard listing={listing} />
                      <div className="absolute top-2 right-2 flex space-x-2">
                        <button
                          onClick={() => deleteListing(listing.id)}
                          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                  <Shirt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No active listings</h3>
                  <p className="text-gray-600 mb-6">
                    Start selling, lending, or renting your clothes
                  </p>
                  <Link
                    to="/add-listing"
                    className="inline-flex items-center bg-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Your First Listing
                  </Link>
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
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
