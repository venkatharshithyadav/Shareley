import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useListings } from '../context/ListingsContext';
import { useAuth } from '../context/AuthContext';
import { useBrandCampaigns } from '../context/BrandCampaignsContext';
import { ListingType } from '../types';
import { Shirt, ArrowLeft, Upload, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

const AddListing: React.FC = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { addListing } = useListings();
  const { campaigns } = useBrandCampaigns();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const campaignIdFromUrl = searchParams.get('campaignId');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    type: 'sell' as ListingType,
    category: '',
    size: '',
    condition: '',
    location: '',
    images: [] as string[],
    campaignId: campaignIdFromUrl || '',
  });

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Get user's campaigns if they're a brand
  const userCampaigns = user?.userType === 'company'
    ? campaigns.filter(c => c.userId === user.id)
    : [];

  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-cyan-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setError('');

      if (!e.target.files || e.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      console.log('Uploading file:', fileName);
      console.log('File size:', file.size);
      console.log('File type:', file.type);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('listing-images')
        .upload(filePath, file);

      console.log('Upload response:', { uploadData, uploadError });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      const { data } = supabase.storage.from('listing-images').getPublicUrl(filePath);

      console.log('Public URL:', data.publicUrl);

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, data.publicUrl]
      }));

    } catch (error: any) {
      console.error('Image upload error:', error);
      setError(error.message || 'Failed to upload image. Please check your Supabase storage configuration.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.title || !formData.description || !formData.category || !formData.size || !formData.location) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      if (!user) {
        setError('You must be logged in to create a listing');
        setLoading(false);
        return;
      }

      console.log('Creating listing with data:', {
        ...formData,
        userId: user.id,
        campaignId: formData.campaignId,
      });

      await addListing({
        ...formData,
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        status: 'active',
        campaignId: formData.campaignId || undefined,
      });

      console.log('Listing created successfully!');

      // Navigate to campaign detail if adding to campaign, otherwise marketplace
      if (formData.campaignId) {
        console.log('Navigating to campaign:', formData.campaignId);
        navigate(`/campaign/${formData.campaignId}`);
      } else {
        navigate('/marketplace');
      }
    } catch (err: any) {
      console.error('Failed to create listing:', err);
      setError(`Failed to create listing: ${err.message || 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    }));
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-cyan-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Add New Listing</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Listing Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Listing Type <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="sell">Selling</option>
                <option value="lend">Lending</option>
                <option value="rent">Renting</option>
                <option value="free">Giving Away (Free)</option>
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="e.g., Vintage Denim Jacket"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Describe your item..."
              />
            </div>

            {/* Campaign Selection (for brand users) */}
            {user?.userType === 'company' && userCampaigns.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add to Campaign (Optional)
                </label>
                <select
                  name="campaignId"
                  value={formData.campaignId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">No campaign (regular listing)</option>
                  {userCampaigns.map(campaign => (
                    <option key={campaign.id} value={campaign.id}>
                      {campaign.campaignTitle}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Select a campaign to add this product to your brand campaign
                </p>
              </div>
            )}

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photos
              </label>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {formData.images.map((url, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                    <img src={url} alt={`Listing ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">
                    {uploading ? 'Uploading...' : 'Upload Photo'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  <option value="Tops">Tops</option>
                  <option value="Bottoms">Bottoms</option>
                  <option value="Dresses">Dresses</option>
                  <option value="Jackets">Jackets</option>
                  <option value="Suits">Suits</option>
                  <option value="Shoes">Shoes</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Kids">Kids</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size <span className="text-red-500">*</span>
                </label>
                <select
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">Select size</option>
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                  <option value="Various">Various</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Condition */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition <span className="text-red-500">*</span>
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">Select condition</option>
                  <option value="New">New</option>
                  <option value="Like New">Like New</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price {formData.type !== 'free' && <span className="text-red-500">*</span>}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price || ''}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    disabled={formData.type === 'free'}
                    required={formData.type !== 'free'}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="Enter price (e.g., 50)"
                  />
                </div>
                {formData.type === 'free' && (
                  <p className="mt-1 text-sm text-gray-500">This item will be listed as free</p>
                )}
                <p className="mt-1 text-xs text-gray-400">Enter whole numbers. Decimals are optional.</p>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="e.g., San Francisco, CA"
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || uploading}
                className="px-6 py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Listing'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddListing;

