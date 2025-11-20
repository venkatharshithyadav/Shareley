import React from 'react';
import { Link } from 'react-router-dom';
import { Listing } from '../types';
import { MapPin, DollarSign, Calendar } from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sell':
        return 'bg-green-100 text-green-800';
      case 'lend':
        return 'bg-blue-100 text-blue-800';
      case 'rent':
        return 'bg-purple-100 text-purple-800';
      case 'free':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'sell':
        return 'Selling';
      case 'lend':
        return 'Lending';
      case 'rent':
        return 'Renting';
      case 'free':
        return 'Free';
      default:
        return type;
    }
  };

  return (
    <Link to={`/listing/${listing.id}`} className="block">
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden h-full">
        <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
          {listing.images && listing.images.length > 0 ? (
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-gray-400 text-4xl">👕</div>
          )}
          <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(listing.type)}`}>
            {getTypeLabel(listing.type)}
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{listing.title}</h3>
          <p className="text-gray-600 mb-4 line-clamp-2">{listing.description}</p>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {listing.location}
              </span>
            </div>
            {listing.price > 0 ? (
              <div className="flex items-center text-lg font-bold text-gray-900">
                <DollarSign className="w-5 h-5" />
                {listing.price}
              </div>
            ) : (
              <div className="text-lg font-bold text-green-600">Free</div>
            )}
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{listing.category} • {listing.size}</span>
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(listing.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                {listing.userName.charAt(0).toUpperCase()}
              </div>
              <span className="ml-2 text-sm text-gray-600">{listing.userName}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;

