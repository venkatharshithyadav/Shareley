import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Listing, ListingsContextType } from '../types';

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
  const [initialized, setInitialized] = useState(false);

  const initializeSampleListings = () => {
    const sampleListings: Listing[] = [
      {
        id: '1',
        userId: 'sample1',
        userName: 'Sarah Johnson',
        title: 'Vintage Denim Jacket',
        description: 'Beautiful vintage denim jacket in excellent condition. Perfect for layering.',
        price: 25,
        type: 'sell',
        category: 'Jackets',
        size: 'M',
        condition: 'Like New',
        images: [],
        location: 'San Francisco, CA',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        status: 'active',
      },
      {
        id: '2',
        userId: 'sample2',
        userName: 'Mike Chen',
        title: 'Summer Dresses Collection',
        description: 'Three beautiful summer dresses. Looking to lend for a special occasion.',
        price: 0,
        type: 'lend',
        category: 'Dresses',
        size: 'S-M',
        condition: 'Good',
        images: [],
        location: 'New York, NY',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        status: 'active',
      },
      {
        id: '3',
        userId: 'sample3',
        userName: 'Emma Davis',
        title: 'Formal Suit Set',
        description: 'Professional suit set available for rent. Perfect for interviews or events.',
        price: 15,
        type: 'rent',
        category: 'Suits',
        size: 'L',
        condition: 'Excellent',
        images: [],
        location: 'Los Angeles, CA',
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        status: 'active',
      },
      {
        id: '4',
        userId: 'sample4',
        userName: 'Alex Brown',
        title: 'Kids Clothes Bundle',
        description: 'Giving away gently used kids clothes. All sizes included.',
        price: 0,
        type: 'free',
        category: 'Kids',
        size: 'Various',
        condition: 'Good',
        images: [],
        location: 'Chicago, IL',
        createdAt: new Date(Date.now() - 345600000).toISOString(),
        status: 'active',
      },
    ];
    setListings(sampleListings);
    localStorage.setItem('listings', JSON.stringify(sampleListings));
  };

  useEffect(() => {
    // Load listings from localStorage on mount
    const savedListings = localStorage.getItem('listings');
    if (savedListings) {
      try {
        const parsed = JSON.parse(savedListings);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setListings(parsed);
        } else {
          initializeSampleListings();
        }
      } catch (e) {
        // If parsing fails, initialize with sample listings
        initializeSampleListings();
      }
    } else {
      // Initialize with sample listings
      initializeSampleListings();
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    // Save listings to localStorage whenever they change (but not on initial load)
    if (initialized) {
      localStorage.setItem('listings', JSON.stringify(listings));
    }
  }, [listings, initialized]);

  const addListing = (listing: Omit<Listing, 'id' | 'createdAt'>) => {
    const newListing: Listing = {
      ...listing,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setListings([newListing, ...listings]);
  };

  const updateListing = (id: string, updates: Partial<Listing>) => {
    setListings(listings.map(listing => listing.id === id ? { ...listing, ...updates } : listing));
  };

  const deleteListing = (id: string) => {
    setListings(listings.filter(listing => listing.id !== id));
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

