import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, LayoutGrid, IndianRupee, Compass, Search, Play } from 'lucide-react';
import { CATEGORIES, getAllProperties } from '../../data/db';

const KNOWN_AREAS = [
  'HSR Layout, Bengaluru',
  'Koramangala, Bengaluru',
  'Indiranagar, Bengaluru',
  'Whitefield, Bengaluru',
  'Sarjapur Road, Bengaluru',
  'Electronic City, Bengaluru',
  'Jayanagar, Bengaluru',
  'JP Nagar, Bengaluru',
  'Marathahalli, Bengaluru',
  'Yelahanka, Bengaluru',
  'Bannerghatta Road, Bengaluru',
  'Hebbal, Bengaluru',
  'Bengaluru, Karnataka',
  'Karnataka',
];

// Sale-style budgets (Apartments, Villas, Lands/Plots, Resale, New Launch, Plot, For Sale)
const SALE_BUDGETS = [
  { label: 'All Budgets', min: '', max: '' },
  { label: 'Under ₹50 Lakh', min: '', max: '5000000' },
  { label: '₹50 Lakh - ₹1 Cr', min: '5000000', max: '10000000' },
  { label: '₹1 Cr - ₹2 Cr', min: '10000000', max: '20000000' },
  { label: 'Above ₹2 Cr', min: '20000000', max: '' },
];

// Monthly rent budgets (Rental Properties, Commercial, For Rent)
const RENT_BUDGETS = [
  { label: 'All Budgets', min: '', max: '' },
  { label: 'Under ₹20,000 / month', min: '', max: '20000' },
  { label: '₹20,000 - ₹40,000 / month', min: '20000', max: '40000' },
  { label: '₹40,000 - ₹75,000 / month', min: '40000', max: '75000' },
  { label: 'Above ₹75,000 / month', min: '75000', max: '' },
];

// PG budgets (per bed / month — matches PG rentPerBed pricing)
const PG_BUDGETS = [
  { label: 'All Budgets', min: '', max: '' },
  { label: 'Under ₹6,000 / bed / month', min: '', max: '6000' },
  { label: '₹6,000 - ₹10,000 / bed / month', min: '6000', max: '10000' },
  { label: '₹10,000 - ₹15,000 / bed / month', min: '10000', max: '15000' },
  { label: 'Above ₹15,000 / bed / month', min: '15000', max: '' },
];

function resolveBudgetInfo(category, status) {
  if (category === 'PG / Co-living' || status === 'PG') {
    return { budgets: PG_BUDGETS, label: 'PG Budget' };
  }
  if (category === 'Commercial' || category === 'Rental Properties' || status === 'For Rent') {
    return { budgets: RENT_BUDGETS, label: 'Rent Budget' };
  }
  return { budgets: SALE_BUDGETS, label: 'Budget' };
}

export default function Hero() {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [budgetIdx, setBudgetIdx] = useState(0);
  const wrapperRef = useRef(null);

  const propertyLocations = getAllProperties().map((p) => p.location).filter(Boolean);
  const suggestionPool = [...new Set([...KNOWN_AREAS, ...propertyLocations])];

  const suggestions =
    location.trim().length > 0
      ? suggestionPool.filter((s) => s.toLowerCase().includes(location.trim().toLowerCase())).slice(0, 6)
      : [];

  const { budgets, label: budgetLabel } = resolveBudgetInfo(category, status);

  // Reset budget selection whenever the budget set itself changes (category/status switch)
  useEffect(() => {
    setBudgetIdx(0);
  }, [category, status]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategoryChange = (value) => {
    setCategory(value);
    // If PG selected as property type, auto-align status to PG for a consistent search
    if (value === 'PG / Co-living') {
      setStatus('PG');
    } else if (status === 'PG') {
      // Moving away from PG category while status is still PG — clear status so it's not stuck
      setStatus('');
    }
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    if (value === 'PG') {
      setCategory('PG / Co-living');
    } else if (category === 'PG / Co-living') {
      setCategory('');
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location.trim()) params.set('q', location.trim());
    if (category) params.set('category', category);
    if (status) params.set('status', status);
    const budget = budgets[budgetIdx];
    if (budget.min) params.set('minPrice', budget.min);
    if (budget.max) params.set('maxPrice', budget.max);
    navigate(`/properties${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <section className="bg-cream">
      <div className="container-x grid lg:grid-cols-2 gap-10 items-center pt-14 pb-24 lg:pb-10">
        <div>
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-gold-dark bg-gold/10 px-3 py-1.5 rounded-full mb-5">
            ★ Trusted Real Estate Partner
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-brand-dark leading-tight mb-5">
            Find Your <span className="text-gold-dark">Dream</span>
            <br /> Property With Us
          </h1>
          <p className="text-gray-600 max-w-md mb-8">
            We offer the best real estate deals in residential, commercial, rental, resale, villas, apartments, lands and PGs.
          </p>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/properties')} className="btn-primary">
              Explore Properties
            </button>
            <button onClick={() => navigate('/contact')} className="btn-outline">
              Contact Us
            </button>
            <span className="w-11 h-11 rounded-full border border-gray-300 flex items-center justify-center text-brand-dark shrink-0">
              <Play size={16} />
            </span>
          </div>
        </div>

        <div className="relative">
          <img
            src="https://placehold.co/800x600/1B4B3A/FBF8F1?text=Dream+Home"
            alt="Dream property"
            className="rounded-2xl w-full h-[420px] object-cover"
          />
        </div>
      </div>

      <div className="container-x -mt-16 lg:-mt-8 relative z-10">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-5 grid sm:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
          <div className="relative" ref={wrapperRef}>
            <div className="flex items-center gap-3 border-r border-gray-100 lg:border-r px-2">
              <span className="text-brand-dark shrink-0 mt-4">
                <MapPin size={16} />
              </span>
              <div className="w-full">
                <p className="text-xs font-semibold text-gray-700">Location</p>
                <input
                  className="text-sm text-gray-500 w-full outline-none placeholder:text-gray-400 bg-transparent"
                  placeholder="Enter city, area..."
                  value={location}
                  onChange={(e) => { setLocation(e.target.value); setShowSuggestions(true); }}
                  onFocus={() => setShowSuggestions(true)}
                />
              </div>
            </div>
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-100 rounded-lg shadow-lg z-20 overflow-hidden">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => { setLocation(s); setShowSuggestions(false); }}
                    className="flex items-center gap-2 w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-dark"
                  >
                    <MapPin size={13} className="text-gray-400 shrink-0" /> {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <SelectField icon={<LayoutGrid size={16} />} label="Property Type" value={category} onChange={handleCategoryChange}>
            <option value="">All Type</option>
            {CATEGORIES.map((c) => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
            <option value="PG / Co-living">PG / Co-living</option>
          </SelectField>

          <SelectField icon={<IndianRupee size={16} />} label={budgetLabel} value={budgetIdx} onChange={(v) => setBudgetIdx(Number(v))}>
            {budgets.map((b, i) => (
              <option key={b.label} value={i}>{b.label}</option>
            ))}
          </SelectField>

          <SelectField icon={<Compass size={16} />} label="Status" value={status} onChange={handleStatusChange}>
            <option value="">All Status</option>
            <option>For Sale</option>
            <option>For Rent</option>
            <option>New Launch</option>
            <option>Plot</option>
            <option>PG</option>
          </SelectField>

          <button onClick={handleSearch} className="btn-primary flex items-center justify-center gap-2 h-full">
            Search Property <Search size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}

function SelectField({ icon, label, value, onChange, children }) {
  return (
    <div className="flex items-center gap-3 border-r border-gray-100 last:border-0 px-2">
      <span className="text-brand-dark shrink-0">{icon}</span>
      <div className="w-full">
        <p className="text-xs font-semibold text-gray-700">{label}</p>
        <select
          className="text-sm text-gray-500 w-full outline-none bg-transparent cursor-pointer"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {children}
        </select>
      </div>
    </div>
  );
}