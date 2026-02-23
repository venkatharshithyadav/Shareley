import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBrandCampaigns } from '../context/BrandCampaignsContext';
import { useListings } from '../context/ListingsContext';
import { ArrowLeft, Plus, Package, Edit, Trash2, Settings } from 'lucide-react';
import ListingCard from '../components/ListingCard';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

const CampaignDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user, isAuthenticated } = useAuth();
    const { campaigns, refreshCampaigns } = useBrandCampaigns();
    const { listings, refreshListings, deleteListing } = useListings();
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingCampaign, setDeletingCampaign] = useState(false);

    // Refresh listings when component mounts
    useEffect(() => {
        refreshListings();
    }, [id]);

    const campaign = campaigns.find(c => c.id === id);
    const campaignProducts = listings.filter(l => l.campaignId === id && l.status === 'active');
    const isOwner = user?.id === campaign?.userId;

    const handleDeleteCampaign = async () => {
        if (!campaign) return;

        try {
            setDeletingCampaign(true);

            // Delete all products in the campaign first
            for (const product of campaignProducts) {
                await deleteListing(product.id);
            }

            // Delete the campaign
            const { error } = await supabase
                .from('brand_campaigns')
                .delete()
                .eq('id', campaign.id);

            if (error) throw error;

            await refreshCampaigns();
            toast.success('Campaign deleted successfully');
            navigate('/profile');
        } catch (error: any) {
            console.error('Error deleting campaign:', error);
            toast.error('Failed to delete campaign');
        } finally {
            setDeletingCampaign(false);
            setShowDeleteModal(false);
        }
    };

    const handleDeleteProduct = async (productId: string) => {
        if (!confirm('Are you sure you want to remove this product from the campaign?')) {
            return;
        }

        try {
            await deleteListing(productId);
            await refreshListings();
            toast.success('Product removed from campaign');
        } catch (error) {
            toast.error('Failed to remove product');
        }
    };

    const handleToggleCampaignStatus = async () => {
        if (!campaign) return;

        try {
            const newStatus = !campaign.isActive;
            const { error } = await supabase
                .from('brand_campaigns')
                .update({ is_active: newStatus })
                .eq('id', campaign.id);

            if (error) throw error;

            await refreshCampaigns();
            toast.success(`Campaign ${newStatus ? 'activated' : 'deactivated'}`);
        } catch (error) {
            toast.error('Failed to update campaign status');
        }
    };

    if (!campaign) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 to-cyan-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Campaign not found</h2>
                    <Link to="/" className="text-pink-500 hover:text-pink-600">
                        Go back to home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-cyan-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <div className="flex items-center justify-between mb-6">
                    <Link
                        to="/"
                        className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Home
                    </Link>

                    {isOwner && (
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={handleToggleCampaignStatus}
                                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${campaign.isActive
                                        ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                                        : 'bg-green-500 text-white hover:bg-green-600'
                                    }`}
                            >
                                {campaign.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <Link
                                to={`/edit-campaign/${campaign.id}`}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors inline-flex items-center"
                            >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Campaign
                            </Link>
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors inline-flex items-center"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </button>
                        </div>
                    )}
                </div>

                {/* Campaign Header */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                    <div className="relative h-96">
                        <img
                            src={campaign.imageUrl}
                            alt={campaign.campaignTitle}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                        {/* Status Badge */}
                        {!campaign.isActive && (
                            <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold">
                                Inactive
                            </div>
                        )}

                        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full">
                                    <span className="font-bold text-gray-900">{campaign.brandName}</span>
                                </div>
                                {campaign.discountPercentage && (
                                    <div className="bg-red-500 px-4 py-2 rounded-full">
                                        <span className="font-bold">-{campaign.discountPercentage}%</span>
                                    </div>
                                )}
                            </div>
                            <h1 className="text-4xl font-bold mb-2">{campaign.campaignTitle}</h1>
                            {campaign.description && (
                                <p className="text-lg text-white/90">{campaign.description}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Products Section */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Campaign Products</h2>
                            <p className="text-gray-600 mt-1">
                                {campaignProducts.length} {campaignProducts.length === 1 ? 'product' : 'products'} available
                            </p>
                        </div>
                        {isOwner && (
                            <Link
                                to={`/add-listing?campaignId=${id}`}
                                className="bg-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors inline-flex items-center"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Add Product
                            </Link>
                        )}
                    </div>

                    {campaignProducts.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {campaignProducts.map(product => (
                                <div key={product.id} className="relative">
                                    <ListingCard listing={product} />
                                    {isOwner && (
                                        <div className="absolute top-2 right-2 flex space-x-2 z-10">
                                            <Link
                                                to={`/edit-listing/${product.id}`}
                                                className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-lg"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteProduct(product.id)}
                                                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {isOwner ? 'No products yet' : 'No products available'}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {isOwner
                                    ? 'Start adding products to this campaign to showcase them to users'
                                    : 'This campaign doesn\'t have any products yet. Check back later!'}
                            </p>
                            {isOwner && (
                                <Link
                                    to={`/add-listing?campaignId=${id}`}
                                    className="inline-flex items-center bg-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors"
                                >
                                    <Plus className="w-5 h-5 mr-2" />
                                    Add Your First Product
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Delete Campaign?</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this campaign? This will also remove all {campaignProducts.length} products from the campaign. This action cannot be undone.
                        </p>
                        <div className="flex space-x-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                disabled={deletingCampaign}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteCampaign}
                                disabled={deletingCampaign}
                                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
                            >
                                {deletingCampaign ? 'Deleting...' : 'Delete Campaign'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CampaignDetail;
