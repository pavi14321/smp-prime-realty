import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, LayoutGrid, IndianRupee, Compass, Search, Play } from 'lucide-react';

export default function Hero() {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');

  const handleSearch = () => {
    navigate(`/properties${location ? `?q=${encodeURIComponent(location)}` : ''}`);
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
            We offer the best real estate deals in residential, commercial, rental, resale, villas, apartments and lands.
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
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-5 grid sm:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
          <Field icon={<MapPin size={16} />} label="Location" value={location} onChange={setLocation} placeholder="Enter location" />
          <Field icon={<LayoutGrid size={16} />} label="Property Type" placeholder="All Type" readOnly />
          <Field icon={<IndianRupee size={16} />} label="Budget" placeholder="Min - Max" readOnly />
          <Field icon={<Compass size={16} />} label="Status" placeholder="All Status" readOnly />
          <button onClick={handleSearch} className="btn-primary flex items-center justify-center gap-2 h-full">
            Search Property <Search size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}

function Field({ icon, label, placeholder, value, onChange, readOnly }) {
  return (
    <div className="flex items-center gap-3 border-r border-gray-100 last:border-0 px-2">
      <span className="text-brand-dark">{icon}</span>
      <div className="w-full">
        <p className="text-xs font-semibold text-gray-700">{label}</p>
        <input
          className="text-sm text-gray-500 w-full outline-none placeholder:text-gray-400 bg-transparent"
          placeholder={placeholder}
          value={value}
          readOnly={readOnly}
          onChange={(e) => onChange && onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
