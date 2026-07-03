import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  BedDouble,
  Bath,
  Ruler,
  Car,
  Compass,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { getPropertyById, subscribeDB } from '../data/db';

const tabs = ['Overview', 'Amenities', 'Floor Plan', 'Location', 'Nearby Places'];

export default function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [tab, setTab] = useState('Overview');
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    const load = () => setProperty(getPropertyById(id));
    load();
    return subscribeDB(load);
  }, [id]);

  if (!property) {
    return (
      <div className="container-x py-20 text-center text-gray-500">
        Property not found. <Link to="/properties" className="text-brand-dark underline">Back to properties</Link>
      </div>
    );
  }

  const mapSrc = `https://www.google.com/maps?q=${property.lat},${property.lng}&hl=en&z=14&output=embed`;

  return (
    <div className="container-x py-8">
      <p className="text-xs text-gray-500 mb-4">
        <Link to="/">Home</Link> <span className="mx-1">›</span>
        <Link to="/properties">Properties</Link> <span className="mx-1">›</span>
        <span className="text-brand-dark">Property Details</span>
      </p>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left / main column */}
        <div className="lg:col-span-2">
          <img
            src={property.images[activeImg]}
            alt={property.title}
            className="w-full h-[360px] object-cover rounded-xl mb-3"
          />
          <div className="flex gap-3 mb-6">
            {property.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`w-20 h-16 rounded-lg overflow-hidden border-2 ${
                  activeImg === i ? 'border-gold' : 'border-transparent'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="tag bg-sale">{property.status}</span>
            {property.featured && <span className="tag bg-gold-dark">Featured</span>}
          </div>
          <h1 className="font-display text-2xl font-bold text-brand-dark mb-1">{property.title}</h1>
          <p className="flex items-center gap-1 text-sm text-gray-500 mb-3">
            <MapPin size={14} /> {property.location}
          </p>
          <p className="text-2xl font-bold text-gold-dark mb-6">
            {property.priceLabel}{' '}
            {property.negotiable && <span className="text-xs font-normal text-gray-400">Negotiable</span>}
          </p>

          <div className="grid grid-cols-3 gap-4 mb-6 bg-white border border-gray-100 rounded-xl p-5">
            {property.beds > 0 && <Spec icon={<BedDouble size={16} />} label={`${property.beds} Beds`} />}
            {property.baths > 0 && <Spec icon={<Bath size={16} />} label={`${property.baths} Baths`} />}
            <Spec icon={<Ruler size={16} />} label={`${property.sqft} Sq.Ft`} />
            {property.parking && <Spec icon={<Car size={16} />} label={property.parking} />}
            {property.facing && <Spec icon={<Compass size={16} />} label={property.facing} />}
            <Spec
              icon={<CheckCircle2 size={16} />}
              label={property.readyToMove ? 'Ready To Move' : 'Under Construction'}
            />
          </div>

          <div className="flex gap-3 mb-8">
            <button className="btn-primary">Schedule Visit</button>
            <button className="btn-outline">Make An Offer</button>
          </div>

          <div className="border-b border-gray-200 flex gap-6 mb-6 text-sm font-medium text-gray-500 overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`pb-3 whitespace-nowrap border-b-2 ${
                  tab === t ? 'border-gold text-brand-dark' : 'border-transparent'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === 'Overview' && (
            <div>
              <h3 className="font-display font-semibold text-lg text-brand-dark mb-3">Property Description</h3>
              <p className="text-sm text-gray-600 mb-4">{property.description}</p>
              <ul className="text-sm text-gray-600 space-y-2 mb-8">
                {property.amenities.map((a) => (
                  <li key={a} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-dark" /> {a}
                  </li>
                ))}
              </ul>

              <div className="bg-white border border-gray-100 rounded-xl overflow-hidden grid sm:grid-cols-2">
                <iframe
                  title="map"
                  src={mapSrc}
                  className="w-full h-56 border-0"
                  loading="lazy"
                />
                <div className="p-5 flex flex-col justify-center">
                  <p className="text-xs text-gray-500 mb-1">Location</p>
                  <p className="text-sm font-medium text-brand-dark mb-4">{property.location}</p>
                  <a
                    href={`https://www.google.com/maps?q=${property.lat},${property.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary text-sm text-center w-fit"
                  >
                    View on Map
                  </a>
                </div>
              </div>
            </div>
          )}

          {tab === 'Amenities' && (
            <div className="grid sm:grid-cols-2 gap-3">
              {property.amenities.map((a) => (
                <div key={a} className="flex items-center gap-2 bg-white border border-gray-100 rounded-lg p-3 text-sm text-gray-600">
                  <CheckCircle2 size={16} className="text-brand-dark" /> {a}
                </div>
              ))}
            </div>
          )}

          {tab === 'Floor Plan' && (
            <div className="bg-white border border-gray-100 rounded-xl p-10 text-center text-gray-400 text-sm">
              Floor plan image will be added here.
            </div>
          )}

          {tab === 'Location' && (
            <iframe title="map-tab" src={mapSrc} className="w-full h-96 rounded-xl border-0" loading="lazy" />
          )}

          {tab === 'Nearby Places' && (
            <div className="text-sm text-gray-600">
              Nearby schools, hospitals, malls and transit info will be added here.
            </div>
          )}

          <div className="mt-8 bg-gold/10 border border-gold/30 rounded-xl p-6 flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="font-semibold text-brand-dark mb-1">Interested in this property?</p>
              <p className="text-sm text-gray-500">Share your details and our expert will contact you.</p>
            </div>
            <button className="btn-primary">I'm Interested</button>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <h3 className="font-display font-semibold text-lg text-brand-dark mb-1">Get Property Details</h3>
            <p className="text-sm text-gray-500 mb-4">
              Please login or submit your details to view property owner contact information.
            </p>
            <div className="flex gap-2 mb-4">
              <button className="flex-1 btn-primary text-sm py-2">Login with OTP</button>
              <button className="flex-1 btn-outline text-sm py-2">Login</button>
            </div>
            <label className="text-xs font-medium text-gray-600">Full Name</label>
            <input className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm mb-3 mt-1" placeholder="Enter your full name" />
            <label className="text-xs font-medium text-gray-600">Mobile Number</label>
            <input className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm mb-4 mt-1" placeholder="Enter mobile number" />
            <button onClick={() => setOtpSent(true)} className="btn-primary w-full text-sm">
              {otpSent ? 'OTP Sent!' : 'Send OTP'}
            </button>
            <p className="flex items-center gap-1 text-xs text-gray-400 mt-3">
              <ShieldCheck size={12} /> We respect your privacy. Your details are safe with us.
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <h3 className="font-display font-semibold text-lg text-brand-dark mb-4">Contact Us</h3>
            <p className="text-sm text-gray-500 mb-4">We are here to help you.</p>
            <ContactRow icon={<Phone size={15} />} title="Phone" value="+91 98765 43210" />
            <ContactRow icon={<Mail size={15} />} title="Email" value="info@smpprimerealty.com" />
            <ContactRow icon={<MapPin size={15} />} title="Office Address" value="No. 123, 2nd Floor, 4th Main, HSR Layout, Bengaluru - 560102" />
            <ContactRow icon={<Clock size={15} />} title="Working Hours" value="Mon - Sat: 9:00 AM - 7:00 PM, Sunday: Closed" last />
          </div>
        </div>
      </div>
    </div>
  );
}

function Spec({ icon, label }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <span className="text-brand-dark">{icon}</span> {label}
    </div>
  );
}

function ContactRow({ icon, title, value, last }) {
  return (
    <div className={`flex items-start gap-3 ${last ? '' : 'mb-4'}`}>
      <span className="w-8 h-8 rounded-full bg-brand-50 text-brand-dark flex items-center justify-center shrink-0">
        {icon}
      </span>
      <div>
        <p className="text-xs text-gray-500">{title}</p>
        <p className="text-sm font-medium text-brand-dark">{value}</p>
      </div>
    </div>
  );
}
