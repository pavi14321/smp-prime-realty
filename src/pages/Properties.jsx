import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { getAllProperties, subscribeDB, CATEGORIES } from '../data/db';
import PropertyCard from '../components/PropertyCard';
import BackButton from '../components/BackButton';

export default function Properties() {
  const [params] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [query, setQuery] = useState(params.get('q') || '');
  const [category, setCategory] = useState(params.get('category') || '');
  const [status, setStatus] = useState(params.get('status') || '');
  const [sort, setSort] = useState('newest');
  const [minPrice] = useState(params.get('minPrice') ? Number(params.get('minPrice')) : null);
  const [maxPrice] = useState(params.get('maxPrice') ? Number(params.get('maxPrice')) : null);

  useEffect(() => {
    const load = () => setProperties(getAllProperties());
    load();
    return subscribeDB(load);
  }, []);

  let filtered = properties.filter((p) => {
    const matchesQuery =
      !query ||
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.location.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = !category || p.category === category;
    const matchesStatus = !status || p.status === status;
    const matchesMin = !minPrice || p.price >= minPrice;
    const matchesMax = !maxPrice || p.price <= maxPrice;
    return matchesQuery && matchesCategory && matchesStatus && matchesMin && matchesMax;
  });

  if (sort === 'price-low') filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sort === 'price-high') filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sort === 'newest') filtered = [...filtered].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="container-x py-10">
      <BackButton />
      <h1 className="font-display text-3xl font-bold text-brand-dark mb-6">Properties</h1>

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-3 py-2 flex-1 min-w-[200px]">
          <Search size={16} className="text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search properties..."
            className="outline-none text-sm w-full"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-gray-200 rounded-md px-3 py-2 text-sm bg-white"
        >
          <option value="">All Status</option>
          <option>For Sale</option>
          <option>For Rent</option>
          <option>New Launch</option>
          <option>Plot</option>
          <option>PG</option>
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-200 rounded-md px-3 py-2 text-sm bg-white"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.name}>{c.name}</option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-gray-200 rounded-md px-3 py-2 text-sm bg-white flex items-center gap-2"
        >
          <option value="newest">Newest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No properties match your search. Try adjusting the filters.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <PropertyCard key={p.id} property={p} showHeart />
          ))}
        </div>
      )}
    </div>
  );
}