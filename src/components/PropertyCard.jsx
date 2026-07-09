import { Link } from 'react-router-dom';
import { MapPin, BedDouble, Bath, Ruler, Heart, Users, Home } from 'lucide-react';

const tagColor = {
  'For Sale': 'bg-sale',
  'For Rent': 'bg-rent',
  'New Launch': 'bg-gold-dark',
  Plot: 'bg-plotTag',
  PG: 'bg-gold-dark',
};

export default function PropertyCard({ property, showHeart }) {
  const { id, title, location, priceLabel, status, images, beds, baths, sqft, dimensions, pg } = property;

  return (
    <Link
      to={`/properties/${id}`}
      className="block bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-shadow group"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={images?.[0]}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className={`tag absolute top-3 left-3 ${tagColor[status] || 'bg-brand-dark'}`}>{status}</span>
        {showHeart && (
          <span className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center">
            <Heart size={14} className="text-gray-500" />
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display font-semibold text-brand-dark text-[15px] mb-1 truncate">{title}</h3>
        <p className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          <MapPin size={12} /> {location}
        </p>
        <p className="text-gold-dark font-bold text-base mb-3">{priceLabel}</p>

        {status === 'PG' && pg ? (
          <div className="flex items-center gap-4 text-xs text-gray-600 border-t border-gray-100 pt-3">
            <span className="flex items-center gap-1"><Users size={13} /> {pg.genderPreference}</span>
            <span className="flex items-center gap-1"><Home size={13} /> {pg.sharingOptions?.[0]?.sharingType || 'Multiple options'}</span>
          </div>
        ) : (
          <div className="flex items-center gap-4 text-xs text-gray-600 border-t border-gray-100 pt-3">
            {beds > 0 && (
              <span className="flex items-center gap-1">
                <BedDouble size={13} /> {beds} Beds
              </span>
            )}
            {baths > 0 && (
              <span className="flex items-center gap-1">
                <Bath size={13} /> {baths} Baths
              </span>
            )}
            <span className="flex items-center gap-1">
              <Ruler size={13} /> {sqft} Sq.Ft {dimensions ? `(${dimensions})` : ''}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}