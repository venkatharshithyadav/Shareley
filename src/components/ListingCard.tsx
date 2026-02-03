import React from 'react';
import { Link } from 'react-router-dom';
import { Listing } from '../types';
import { MapPin, DollarSign, Calendar, Heart } from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sell':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'lend':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'rent':
        return 'bg-violet-100 text-violet-700 border-violet-200';
      case 'free':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
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
    <Link to={`/listing/${listing.id}`} className="block group h-full">
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden h-full border border-gray-100 flex flex-col">
        <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden">
          {listing.images && listing.images.length > 0 ? (
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <span className="text-4xl">📷</span>
            </div>
          )}

          <div className="absolute top-3 left-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md bg-white/90 shadow-sm ${getTypeColor(listing.type)}`}>
              {getTypeLabel(listing.type)}
            </span>
          </div>

          <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-600 hover:text-red-500 hover:bg-white transition-all opacity-0 group-hover:opacity-100 list-none z-10">
            <Heart className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">{listing.title}</h3>
            <div className="flex items-center font-bold text-gray-900 bg-gray-50 px-2 py-1 rounded-lg">
              <DollarSign className="w-3.5 h-3.5 text-gray-500 mr-0.5" />
              {listing.price > 0 ? listing.price : 'Free'}
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed flex-1">{listing.description}</p>

          <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5" />
              <span className="truncate max-w-[80px]">{listing.location}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>{listing.size}</span>
              <span>{listing.condition}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;

