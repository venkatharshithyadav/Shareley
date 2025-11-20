export type ListingType = 'sell' | 'lend' | 'rent' | 'free';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
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
  status: 'active' | 'sold' | 'lent' | 'rented' | 'taken';
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface ListingsContextType {
  listings: Listing[];
  addListing: (listing: Omit<Listing, 'id' | 'createdAt'>) => void;
  updateListing: (id: string, updates: Partial<Listing>) => void;
  deleteListing: (id: string) => void;
  getListingById: (id: string) => Listing | undefined;
  getUserListings: (userId: string) => Listing[];
}

