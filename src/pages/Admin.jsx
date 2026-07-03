import { useEffect, useState } from 'react';
import { PlusCircle, Trash2, Star, LayoutList, CheckCircle2 } from 'lucide-react';
import { getAllProperties, addProperty, deleteProperty, updateProperty, subscribeDB, CATEGORIES } from '../data/db';

const emptyForm = {
  title: '',
  location: '',
  price: '',
  priceLabel: '',
  status: 'For Sale',
  category: 'Apartments',
  beds: '',
  baths: '',
  sqft: '',
  dimensions: '',
  parking: '',
  facing: 'North Facing',
  negotiable: false,
  readyToMove: true,
  featured: true,
  description: '',
  amenitiesText: '',
  imagesText: '',
  lat: '12.9716',
  lng: '77.5946',
};

export default function Admin() {
  const [tab, setTab] = useState('add');
  const [properties, setProperties] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [lastAdded, setLastAdded] = useState(null);

  useEffect(() => {
    const load = () => setProperties(getAllProperties());
    load();
    return subscribeDB(load);
  }, []);

  const set = (key) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const price = parseFloat(form.price) || 0;
    const priceLabel =
      form.priceLabel ||
      (form.status === 'For Rent'
        ? `₹${price.toLocaleString('en-IN')} / Month`
        : `₹${price.toLocaleString('en-IN')}`);

    const images = form.imagesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const amenities = form.amenitiesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const newProperty = addProperty({
      title: form.title,
      location: form.location,
      price,
      priceLabel,
      status: form.status,
      category: form.category,
      beds: parseInt(form.beds) || 0,
      baths: parseInt(form.baths) || 0,
      sqft: parseInt(form.sqft) || 0,
      dimensions: form.dimensions,
      parking: form.parking,
      facing: form.facing,
      negotiable: form.negotiable,
      readyToMove: form.readyToMove,
      featured: form.featured,
      description: form.description,
      amenities,
      images,
      lat: form.lat,
      lng: form.lng,
    });

    setLastAdded(newProperty);
    setForm(emptyForm);
    setTab('list');
  };

  return (
    <div className="container-x py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-brand-dark">Admin Panel</h1>
          <p className="text-sm text-gray-500">Add and manage property listings shown on the website.</p>
        </div>
        <div className="flex gap-2 bg-white border border-gray-200 rounded-lg p-1">
          <TabButton active={tab === 'add'} onClick={() => setTab('add')} icon={<PlusCircle size={15} />} label="Add Property" />
          <TabButton active={tab === 'list'} onClick={() => setTab('list')} icon={<LayoutList size={15} />} label={`Manage (${properties.length})`} />
        </div>
      </div>

      {lastAdded && tab === 'list' && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-6">
          <CheckCircle2 size={16} /> Property added successfully with ID <strong>{lastAdded.id}</strong>. It now appears on the website.
        </div>
      )}

      {tab === 'add' ? (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-xl p-6 grid md:grid-cols-2 gap-5">
          <Field label="Property Title" required>
            <input required value={form.title} onChange={set('title')} className="input" placeholder="e.g. Luxury 4BHK Villa" />
          </Field>
          <Field label="Location" required>
            <input required value={form.location} onChange={set('location')} className="input" placeholder="e.g. Sarjapur Road, Bengaluru" />
          </Field>

          <Field label="Category" required>
            <select value={form.category} onChange={set('category')} className="input">
              {CATEGORIES.map((c) => (
                <option key={c.name}>{c.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Status" required>
            <select value={form.status} onChange={set('status')} className="input">
              <option>For Sale</option>
              <option>For Rent</option>
              <option>New Launch</option>
              <option>Plot</option>
            </select>
          </Field>

          <Field label="Price (₹)" required>
            <input required type="number" value={form.price} onChange={set('price')} className="input" placeholder="8500000" />
          </Field>
          <Field label="Custom Price Label (optional)">
            <input value={form.priceLabel} onChange={set('priceLabel')} className="input" placeholder="Auto-generated if left blank" />
          </Field>

          <Field label="Beds">
            <input type="number" value={form.beds} onChange={set('beds')} className="input" placeholder="0 for plots" />
          </Field>
          <Field label="Baths">
            <input type="number" value={form.baths} onChange={set('baths')} className="input" placeholder="0 for plots" />
          </Field>

          <Field label="Area (Sq.Ft)" required>
            <input required type="number" value={form.sqft} onChange={set('sqft')} className="input" placeholder="1650" />
          </Field>
          <Field label="Plot Dimensions (optional)">
            <input value={form.dimensions} onChange={set('dimensions')} className="input" placeholder="e.g. 30x40" />
          </Field>

          <Field label="Parking">
            <input value={form.parking} onChange={set('parking')} className="input" placeholder="e.g. 2 Car Parking" />
          </Field>
          <Field label="Facing">
            <select value={form.facing} onChange={set('facing')} className="input">
              <option>North Facing</option>
              <option>South Facing</option>
              <option>East Facing</option>
              <option>West Facing</option>
            </select>
          </Field>

          <Field label="Latitude (Bengaluru default)">
            <input value={form.lat} onChange={set('lat')} className="input" />
          </Field>
          <Field label="Longitude (Bengaluru default)">
            <input value={form.lng} onChange={set('lng')} className="input" />
          </Field>

          <div className="md:col-span-2 flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" checked={form.negotiable} onChange={set('negotiable')} /> Price Negotiable
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" checked={form.readyToMove} onChange={set('readyToMove')} /> Ready To Move
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" checked={form.featured} onChange={set('featured')} /> Show in Featured
            </label>
          </div>

          <Field label="Description" full>
            <textarea value={form.description} onChange={set('description')} rows={4} className="input" placeholder="Describe the property..." />
          </Field>

          <Field label="Amenities (one per line)" full>
            <textarea value={form.amenitiesText} onChange={set('amenitiesText')} rows={3} className="input" placeholder={'Gated Community\n24/7 Security\nSwimming Pool'} />
          </Field>

          <Field label="Image URLs (one per line, optional — placeholder used if empty)" full>
            <textarea value={form.imagesText} onChange={set('imagesText')} rows={3} className="input" placeholder={'https://example.com/image1.jpg\nhttps://example.com/image2.jpg'} />
          </Field>

          <div className="md:col-span-2">
            <button type="submit" className="btn-primary">
              Add Property
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-brand-50 text-brand-dark text-left">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Featured</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <tr key={p.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.id}</td>
                  <td className="px-4 py-3 font-medium text-brand-dark">{p.title}</td>
                  <td className="px-4 py-3 text-gray-500">{p.location}</td>
                  <td className="px-4 py-3">{p.priceLabel}</td>
                  <td className="px-4 py-3">
                    <span className="tag bg-brand-dark">{p.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => updateProperty(p.id, { featured: !p.featured })}>
                      <Star size={16} className={p.featured ? 'fill-gold text-gold' : 'text-gray-300'} />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => deleteProperty(p.id)} className="text-red-500 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {properties.length === 0 && <p className="text-center text-gray-400 py-10 text-sm">No properties yet.</p>}
        </div>
      )}
    </div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        active ? 'bg-brand-dark text-white' : 'text-gray-500 hover:text-brand-dark'
      }`}
    >
      {icon} {label}
    </button>
  );
}

function Field({ label, children, required, full }) {
  return (
    <div className={full ? 'md:col-span-2' : ''}>
      <label className="text-xs font-medium text-gray-600 mb-1 block">
        {label} {required && <span className="text-sale">*</span>}
      </label>
      {children}
    </div>
  );
}
