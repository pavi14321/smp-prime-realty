import { useNavigate } from 'react-router-dom';
import { Building2, Home, Map, KeyRound, ArrowLeftRight, Building } from 'lucide-react';
import { CATEGORIES } from '../../data/db';

const icons = {
  Apartments: Building2,
  Villas: Home,
  'Lands / Plots': Map,
  'Rental Properties': KeyRound,
  'Resale Properties': ArrowLeftRight,
  Commercial: Building,
};

export default function Categories() {
  const navigate = useNavigate();
  return (
    <section className="container-x py-20">
      <h2 className="font-display text-3xl font-bold text-center text-brand-dark mb-12">Browse By Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
        {CATEGORIES.map((c) => {
          const Icon = icons[c.name];
          return (
            <button
              key={c.name}
              onClick={() => navigate(`/properties?category=${encodeURIComponent(c.name)}`)}
              className="bg-white border border-gray-100 rounded-xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <span className="w-12 h-12 mx-auto rounded-full bg-brand-50 text-brand-dark flex items-center justify-center mb-4">
                <Icon size={22} />
              </span>
              <p className="font-semibold text-brand-dark text-sm mb-1">{c.name}</p>
              <p className="text-xs text-gray-500">{c.count}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
