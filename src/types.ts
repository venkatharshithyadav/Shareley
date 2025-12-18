export type ListingType = 'sell' | 'lend' | 'rent' | 'free';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
  userType?: 'individual' | 'company';
  companyName?: string;
  isVerifiedBrand?: boolean;
}

export interface Listing {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  title: string;
  description: string;
  price: number;
  type: ListingType;
  category: string;
  size: string;
  condition: string;
  images: string[];
  location: string;
  createdAt: string;
  campaignId?: string; // Link to brand campaign
  status: 'active' | 'sold' | 'lent' | 'rented' | 'taken';
}

export interface BrandCampaign {
  id: string;
  userId?: string;
  brandName: string;
  campaignTitle: string;
  description?: string;
  imageUrl: string;
  discountPercentage?: number;
  endDate?: string;
  category: string;
  isActive: boolean;
  createdAt: string;
}


export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, userType?: 'individual' | 'company', companyName?: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface ListingsContextType {
  listings: Listing[];
  loading: boolean;
  error: string | null;
  addListing: (listing: Omit<Listing, 'id' | 'createdAt'>) => Promise<void>;
  updateListing: (id: string, updates: Partial<Listing>) => Promise<void>;
  deleteListing: (id: string) => Promise<void>;
  getListingById: (id: string) => Listing | undefined;
  getUserListings: (userId: string) => Listing[];
  refreshListings: () => Promise<void>;
}

