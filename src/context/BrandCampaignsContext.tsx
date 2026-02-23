import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BrandCampaign } from '../types';
import { supabase } from '../lib/supabase';

interface BrandCampaignsContextType {
    campaigns: BrandCampaign[];
    loading: boolean;
    error: string | null;
    getActiveCampaigns: () => BrandCampaign[];
    getCampaignsByBrand: (brandName: string) => BrandCampaign[];
    getCampaignsByCategory: (category: string) => BrandCampaign[];
    refreshCampaigns: () => Promise<void>;
}

const BrandCampaignsContext = createContext<BrandCampaignsContextType | undefined>(undefined);

export const useBrandCampaigns = () => {
    const context = useContext(BrandCampaignsContext);
    if (!context) {
        throw new Error('useBrandCampaigns must be used within a BrandCampaignsProvider');
    }
    return context;
};

interface BrandCampaignsProviderProps {
    children: ReactNode;
}

export const BrandCampaignsProvider: React.FC<BrandCampaignsProviderProps> = ({ children }) => {
    const [campaigns, setCampaigns] = useState<BrandCampaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCampaigns = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('brand_campaigns')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            const mappedCampaigns: BrandCampaign[] = data.map((item: any) => ({
                id: item.id,
                userId: item.user_id,
                brandName: item.brand_name,
                campaignTitle: item.campaign_title,
                description: item.description,
                imageUrl: item.image_url,
                discountPercentage: item.discount_percentage,
                endDate: item.end_date,
                category: item.category,
                isActive: item.is_active,
                createdAt: item.created_at,
            }));
            setCampaigns(mappedCampaigns);
        } catch (err: any) {
            console.error('Error fetching brand campaigns:', err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const refreshCampaigns = async () => {
        await fetchCampaigns();
    };

    const getActiveCampaigns = (): BrandCampaign[] => {
        return campaigns.filter(campaign => campaign.isActive);
    };

    const getCampaignsByBrand = (brandName: string): BrandCampaign[] => {
        return campaigns.filter(
            campaign => campaign.brandName.toLowerCase() === brandName.toLowerCase() && campaign.isActive
        );
    };

    const getCampaignsByCategory = (category: string): BrandCampaign[] => {
        return campaigns.filter(
            campaign => campaign.category.toLowerCase() === category.toLowerCase() && campaign.isActive
        );
    };

    return (
        <BrandCampaignsContext.Provider
            value={{
                campaigns,
                loading,
                error,
                getActiveCampaigns,
                getCampaignsByBrand,
                getCampaignsByCategory,
                refreshCampaigns,
            }}
        >
            {children}
        </BrandCampaignsContext.Provider>
    );
};
