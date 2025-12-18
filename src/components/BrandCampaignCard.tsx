import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BrandCampaign } from '../types';
import { Clock, Percent, Building2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface BrandCampaignCardProps {
    campaign: BrandCampaign;
}

const BrandCampaignCard: React.FC<BrandCampaignCardProps> = ({ campaign }) => {
    const [brandLogo, setBrandLogo] = useState<string | null>(null);

    useEffect(() => {
        const fetchBrandLogo = async () => {
            if (campaign.userId) {
                try {
                    // Try to get user data from Supabase
                    const { data: { user }, error } = await supabase.auth.getUser();

                    // If this is the current user's campaign, use their avatar
                    if (user && user.id === campaign.userId && user.user_metadata?.avatar) {
                        setBrandLogo(user.user_metadata.avatar);
                    }
                } catch (err) {
                    console.log('Could not fetch brand logo:', err);
                }
            }
        };
        fetchBrandLogo();
    }, [campaign.userId]);

    const getTimeRemaining = () => {
        if (!campaign.endDate) return null;

        const now = new Date();
        const end = new Date(campaign.endDate);
        const diff = end.getTime() - now.getTime();

        if (diff <= 0) return 'Ended';

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        return `${days}d ${hours}h`;
    };

    const timeRemaining = getTimeRemaining();

    return (
        <Link
            to={`/campaign/${campaign.id}`}
            className="group block relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
        >
            {/* Image */}
            <div className="relative h-80 overflow-hidden bg-gray-100">
                <img
                    src={campaign.imageUrl}
                    alt={campaign.campaignTitle}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Brand Logo & Name Badge */}
                <div className="absolute top-4 left-4 flex items-center space-x-3">
                    {brandLogo ? (
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-lg bg-white">
                            <img src={brandLogo} alt={campaign.brandName} className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border-2 border-white shadow-lg">
                            <Building2 className="w-6 h-6 text-gray-600" />
                        </div>
                    )}
                    <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                        <span className="font-bold text-gray-900 text-sm">{campaign.brandName}</span>
                    </div>
                </div>

                {/* Discount Badge */}
                {campaign.discountPercentage && (
                    <div className="absolute top-4 right-4">
                        <div className="bg-red-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-1">
                            <Percent className="w-4 h-4" />
                            <span className="font-bold text-lg">-{campaign.discountPercentage}%</span>
                        </div>
                    </div>
                )}

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2 drop-shadow-lg">
                        {campaign.campaignTitle}
                    </h3>

                    {campaign.description && (
                        <p className="text-sm text-white/90 mb-3 line-clamp-2 drop-shadow">
                            {campaign.description}
                        </p>
                    )}

                    {/* Time Remaining */}
                    {timeRemaining && timeRemaining !== 'Ended' && (
                        <div className="flex items-center space-x-2 text-sm bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 w-fit">
                            <Clock className="w-4 h-4" />
                            <span className="font-medium">ends in {timeRemaining}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-pink-500 rounded-2xl transition-all duration-300 pointer-events-none" />
        </Link>
    );
};

export default BrandCampaignCard;
