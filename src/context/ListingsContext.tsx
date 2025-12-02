import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Listing, ListingsContextType } from '../types';
import { supabase } from '../lib/supabase';

const ListingsContext = createContext<ListingsContextType | undefined>(undefined);

export const useListings = () => {
  const context = useContext(ListingsContext);
  if (!context) {
    throw new Error('useListings must be used within a ListingsProvider');
  }
  return context;
};

interface ListingsProviderProps {
  children: ReactNode;
}

export const ListingsProvider: React.FC<ListingsProviderProps> = ({ children }) => {
  const [listings, setListings] = useState<Listing[]>([]);
  useEffect(() => {
    const fetchListings = async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching listings:', error.message);
      } else {
        // Map Supabase data to our Listing type
        const mappedListings: Listing[] = data.map((item: any) => ({
          id: item.id,
          userId: item.user_id,
          userName: item.user_name,
          title: item.title,
          description: item.description,
          price: item.price,
          type: item.type,
          category: item.category,
          size: item.size,
          condition: item.condition,
          images: item.images,
          location: item.location,
          createdAt: item.created_at,
          status: item.status,
        }));
        setListings(mappedListings);
      }
    };
    fetchListings();
  }, []);

  const addListing = async (listing: Omit<Listing, 'id' | 'createdAt'>) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const newListing = {
      user_id: userData.user.id,
      user_name: listing.userName,
      title: listing.title,
      description: listing.description,
      price: listing.price,
      type: listing.type,
      category: listing.category,
      size: listing.size,
      condition: listing.condition,
      images: listing.images,
      location: listing.location,
      status: 'active',
    };

    const { data, error } = await supabase
      .from('listings')
      .insert([newListing])
      .select()
      .single();

    if (error) {
      console.error('Error adding listing:', error.message);
    } else if (data) {
      const mappedListing: Listing = {
        id: data.id,
        userId: data.user_id,
        userName: data.user_name,
        title: data.title,
        description: data.description,
        price: data.price,
        type: data.type,
        category: data.category,
        size: data.size,
        condition: data.condition,
        images: data.images,
        location: data.location,
        createdAt: data.created_at,
        status: data.status,
      };
      setListings([mappedListing, ...listings]);
    }
  };

  const updateListing = async (id: string, updates: Partial<Listing>) => {
    // Convert camelCase to snake_case for Supabase
    const supabaseUpdates: any = {};
    if (updates.title) supabaseUpdates.title = updates.title;
    if (updates.description) supabaseUpdates.description = updates.description;
    if (updates.price) supabaseUpdates.price = updates.price;
    // ... add other fields as needed

    const { data, error } = await supabase
      .from('listings')
      .update(supabaseUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating listing:', error.message);
    } else if (data) {
      // Update local state
      setListings(listings.map(l => l.id === id ? { ...l, ...updates } : l));
    }
  };

  const deleteListing = async (id: string) => {
    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting listing:', error.message);
    } else {
      setListings(listings.filter(listing => listing.id !== id));
    }
  };

  const getListingById = (id: string): Listing | undefined => {
    return listings.find(listing => listing.id === id);
  };

  const getUserListings = (userId: string): Listing[] => {
    return listings.filter(listing => listing.userId === userId);
  };

  return (
    <ListingsContext.Provider
      value={{
        listings,
        addListing,
        updateListing,
        deleteListing,
        getListingById,
        getUserListings,
      }}
    >
      {children}
    </ListingsContext.Provider>
  );
};

