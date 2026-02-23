import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBrandCampaigns } from '../context/BrandCampaignsContext';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Upload, X, Calendar, Percent } from 'lucide-react';
import toast from 'react-hot-toast';

const EditCampaign: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const { campaigns, refreshCampaigns } = useBrandCampaigns();
    const navigate = useNavigate();

    const campaign = campaigns.find(c => c.id === id);

    const [formData, setFormData] = useState({
        campaignTitle: '',
        description: '',
        imageUrl: '',
        discountPercentage: 0,
        endDate: '',
        category: '',
    });

    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!authLoading && (!isAuthenticated || user?.userType !== 'company')) {
            toast.error('Only verified brands can edit campaigns');
            navigate('/');
        }
    }, [isAuthenticated, user, authLoading, navigate]);

    useEffect(() => {
        if (campaign) {
            // Check if user owns this campaign
            if (campaign.userId !== user?.id) {
                toast.error('You can only edit your own campaigns');
                navigate('/');
                return;
            }

            setFormData({
                campaignTitle: campaign.campaignTitle,
                description: campaign.description || '',
                imageUrl: campaign.imageUrl,
                discountPercentage: campaign.discountPercentage || 0,
                endDate: campaign.endDate ? new Date(campaign.endDate).toISOString().slice(0, 16) : '',
                category: campaign.category,
            });
        }
    }, [campaign, user, navigate]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            setError('');

            if (!e.target.files || e.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = e.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `campaign_${Date.now()}_${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('listing-images')
                .upload(filePath, file);

            if (uploadError) {
                throw new Error(`Upload failed: ${uploadError.message}`);
            }

            const { data } = supabase.storage.from('listing-images').getPublicUrl(filePath);

            setFormData(prev => ({
                ...prev,
                imageUrl: data.publicUrl
            }));

            toast.success('Image uploaded successfully!');
        } catch (error: any) {
            console.error('Image upload error:', error);
            setError(error.message || 'Failed to upload image');
            toast.error('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!formData.imageUrl) {
            setError('Please upload a campaign image');
            setLoading(false);
            return;
        }

        if (!user || !campaign) {
            setError('Invalid request');
            setLoading(false);
            return;
        }

        try {
            const { error: updateError } = await supabase
                .from('brand_campaigns')
                .update({
                    campaign_title: formData.campaignTitle,
                    description: formData.description,
                    image_url: formData.imageUrl,
                    discount_percentage: formData.discountPercentage || null,
                    end_date: formData.endDate || null,
                    category: formData.category,
                })
                .eq('id', campaign.id);

            if (updateError) {
                throw updateError;
            }

            await refreshCampaigns();
            toast.success('Campaign updated successfully!');
            navigate(`/campaign/${campaign.id}`);
        } catch (err: any) {
            console.error('Error updating campaign:', err);
            setError(err.message || 'Failed to update campaign');
            toast.error('Failed to update campaign');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'discountPercentage' ? parseInt(value) || 0 : value,
        }));
    };

    if (authLoading || !campaign) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-cyan-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-500"></div>
            </div>
        );
    }

    if (!isAuthenticated || user?.userType !== 'company') {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-cyan-50">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <Link
                        to={`/campaign/${campaign.id}`}
                        className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Campaign
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Campaign</h1>
                    <p className="text-gray-600 mb-6">
                        Update your campaign details
                    </p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Campaign Image */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Campaign Image <span className="text-red-500">*</span>
                            </label>

                            {formData.imageUrl ? (
                                <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 group">
                                    <img src={formData.imageUrl} alt="Campaign" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <label className="aspect-video rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition-colors">
                                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-500">
                                        {uploading ? 'Uploading...' : 'Click to upload campaign image'}
                                    </span>
                                    <span className="text-xs text-gray-400 mt-1">Recommended: 1200x600px</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>

                        {/* Campaign Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Campaign Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="campaignTitle"
                                value={formData.campaignTitle}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                placeholder="e.g., Summer Collection 2024"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                placeholder="Describe your campaign..."
                            />
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
                                    <option value="Shoes">Shoes</option>
                                    <option value="Clothing">Clothing</option>
                                    <option value="Accessories">Accessories</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Designer">Designer</option>
                                    <option value="Casual">Casual</option>
                                </select>
                            </div>

                            {/* Discount Percentage */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Discount Percentage
                                </label>
                                <div className="relative">
                                    <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="number"
                                        name="discountPercentage"
                                        value={formData.discountPercentage || ''}
                                        onChange={handleChange}
                                        min="0"
                                        max="100"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                        placeholder="e.g., 50"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* End Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Campaign End Date
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="datetime-local"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-center justify-end space-x-4 pt-4">
                            <Link
                                to={`/campaign/${campaign.id}`}
                                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={loading || uploading}
                                className="px-6 py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Updating...' : 'Update Campaign'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditCampaign;
