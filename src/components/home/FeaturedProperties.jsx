import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getFeaturedProperties, subscribeDB } from '../../data/db';
import PropertyCard from '../PropertyCard';

export default function FeaturedProperties() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const load = () => setProperties(getFeaturedProperties().slice(0, 4));
    load();
    return subscribeDB(load);
  }, []);

  return (
    <section className="bg-cream py-20">
      <div className="container-x">
        <div className="flex items-center justify-between mb-12">
          <h2 className="font-display text-3xl font-bold text-brand-dark">Featured Properties</h2>
          <Link to="/properties" className="text-sm font-semibold text-brand-dark flex items-center gap-1 hover:text-gold-dark">
            View All Properties <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </div>
    </section>
  );
}