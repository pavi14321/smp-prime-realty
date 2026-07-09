import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { addSubmission } from '../data/submissionsStore';
import { sendOtp, verifyOtp } from '../utils/otpService';
import BackButton from '../components/BackButton';
import ImageUploader from '../components/ImageUploader';
import toast from 'react-hot-toast';

const typeFromParam = { sell: 'Sell', rent: 'Rent', pg: 'PG' };

function makeEmpty(listingType) {
  return {
    ownerName: '',
    propertyName: '',
    location: '',
    sqft: '',
    condition: 'Good',
    constructionStatus: 'Ready to Move',
    listingType,
    expectedAmount: '',
    email: '',
    phone: '',
    genderPreference: 'Co-living',
    washingMachine: false,
    hotWater: false,
    washroomType: 'Attached',
    powerBackup: false,
    parking: false,
    sharingOptions: [{ id: 1, sharingType: '2 Sharing', rooms: '', rent: '' }],
  };
}

export default function ListProperty() {
  const [params] = useSearchParams();
  const initialType = typeFromParam[params.get('type')] || 'Sell';

  const [form, setForm] = useState(makeEmpty(initialType));
  const [images, setImages] = useState([]);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [submitted, setSubmitted] = useState(null);

  const set = (key) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: val }));
  };

  const handleSendOtp = () => {
    if (!/^\d{10}$/.test(form.phone)) {
      toast.error('Enter a valid 10-digit phone number first');
      return;
    }
    const code = sendOtp(form.phone);
    toast.success(`Demo OTP sent: ${code}`);
    setOtpSent(true);
  };

  const handleVerifyOtp = () => {
    const result = verifyOtp(form.phone, otp);
    if (!result.ok) {
      toast.error(result.reason);
      return;
    }
    setPhoneVerified(true);
    toast.success('Phone number verified');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phoneVerified) {
      toast.error('Please verify your phone number via OTP first');
      return;
    }
    if (images.length === 0) {
      toast.error('Please upload at least 1 photo');
      return;
    }
    if (form.listingType === 'PG') {
      const validRows = form.sharingOptions.filter((r) => r.rooms && r.rent);
      if (validRows.length === 0) {
        toast.error('Please add at least one sharing type with rooms and rent');
        return;
      }
    }
    const submission = addSubmission({ ...form, images });
    setSubmitted(submission);
  };

  if (submitted) {
    return (
      <div className="container-x py-16 max-w-xl mx-auto text-center">
        <BackButton className="text-left" />
        <CheckCircle2 size={48} className="mx-auto text-green-600 mb-4" />
        <h1 className="font-display text-2xl font-bold text-brand-dark mb-2">
          Your {form.listingType === 'PG' ? 'PG' : 'property'} is under review
        </h1>
        <p className="text-gray-600 mb-4">
          Reference ID <strong>{submitted.id}</strong>. Our admin team will verify your details
          and call you on <strong>{submitted.phone}</strong> before it goes live on the website.
        </p>
        <button
          className="btn-outline"
          onClick={() => {
            setSubmitted(null);
            setForm(makeEmpty('Sell'));
            setImages([]);
            setOtpSent(false);
            setPhoneVerified(false);
            setOtp('');
          }}
        >
          Submit another listing
        </button>
      </div>
    );
  }

  return (
    <div className="container-x py-16 max-w-2xl mx-auto">
      <BackButton />
      <h1 className="font-display text-3xl font-bold text-brand-dark mb-2">List Your Property</h1>
      <p className="text-gray-600 mb-8">
        Selling, renting, or running a PG? Share the details below — our team will review and
        contact you before it appears on SMP Prime Realty.
      </p>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-xl p-6 grid md:grid-cols-2 gap-5">
        <Field label="What do you want to list?" required full>
          <select value={form.listingType} onChange={set('listingType')} className="input">
            <option value="Sell">Sell a Property</option>
            <option value="Rent">Rent Out a Property</option>
            <option value="PG">List a PG / Co-living Space</option>
          </select>
        </Field>

        <Field label="Your Name" required>
          <input required value={form.ownerName} onChange={set('ownerName')} className="input" placeholder="Full name" />
        </Field>
        <Field label={form.listingType === 'PG' ? 'PG Name' : 'Property Name / Title'} required>
          <input required value={form.propertyName} onChange={set('propertyName')} className="input" placeholder={form.listingType === 'PG' ? 'e.g. Green Nest PG' : 'e.g. 3BHK Apartment'} />
        </Field>

        <Field label="Location" required>
          <input required value={form.location} onChange={set('location')} className="input" placeholder="Area, City" />
        </Field>
        <Field label="Area (Sq.Ft, optional for PG)">
          <input type="number" value={form.sqft} onChange={set('sqft')} className="input" placeholder="1200" />
        </Field>

        {form.listingType !== 'PG' && (
          <>
            <Field label="Condition" required>
              <select value={form.condition} onChange={set('condition')} className="input">
                <option>Good</option>
                <option>Average</option>
                <option>Needs Repair</option>
              </select>
            </Field>
            <Field label="Construction Status" required>
              <select value={form.constructionStatus} onChange={set('constructionStatus')} className="input">
                <option>Ready to Move</option>
                <option>Under Construction</option>
              </select>
            </Field>
            <Field label="Expected Amount (₹)" required>
              <input required type="number" value={form.expectedAmount} onChange={set('expectedAmount')} className="input" placeholder="8500000" />
            </Field>
          </>
        )}

        {form.listingType === 'PG' && (
          <>
            <Field label="Gender Preference" required>
              <select value={form.genderPreference} onChange={set('genderPreference')} className="input">
                <option>Co-living</option>
                <option>Men Only</option>
                <option>Women Only</option>
              </select>
            </Field>
            <Field label="Washroom Type" required>
              <select value={form.washroomType} onChange={set('washroomType')} className="input">
                <option>Attached</option>
                <option>Common</option>
              </select>
            </Field>

            <div className="md:col-span-2 flex items-center gap-6 flex-wrap">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={form.washingMachine} onChange={set('washingMachine')} /> Washing Machine
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={form.hotWater} onChange={set('hotWater')} /> Hot Water
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={form.powerBackup} onChange={set('powerBackup')} /> Power Backup
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={form.parking} onChange={set('parking')} /> Parking
              </label>
            </div>

            <Field label="Sharing Type & Rent" full required>
              <SharingRows rows={form.sharingOptions} onChange={(rows) => setForm((f) => ({ ...f, sharingOptions: rows }))} />
            </Field>
          </>
        )}

        <Field label="Email" required>
          <input required type="email" value={form.email} onChange={set('email')} className="input" placeholder="you@example.com" />
        </Field>

        <Field label="Phone Number" required>
          <div className="flex gap-2">
            <input
              required
              value={form.phone}
              onChange={set('phone')}
              disabled={phoneVerified}
              className="input flex-1"
              placeholder="10-digit mobile number"
            />
            {!phoneVerified && (
              <button type="button" onClick={handleSendOtp} className="btn-outline whitespace-nowrap text-sm">
                {otpSent ? 'Resend OTP' : 'Send OTP'}
              </button>
            )}
          </div>
        </Field>

        {otpSent && !phoneVerified && (
          <Field label="Enter OTP" full>
            <div className="flex gap-2">
              <input value={otp} onChange={(e) => setOtp(e.target.value)} className="input flex-1" placeholder="4-digit OTP" />
              <button type="button" onClick={handleVerifyOtp} className="btn-primary whitespace-nowrap text-sm">
                Verify
              </button>
            </div>
          </Field>
        )}

        {phoneVerified && (
          <div className="md:col-span-2 flex items-center gap-2 text-sm text-green-600">
            <ShieldCheck size={16} /> Phone number verified
          </div>
        )}

        <Field label="Photos — outlook & inner look" full required>
          <ImageUploader images={images} onChange={setImages} max={6} label="Photos" />
        </Field>

        <div className="md:col-span-2">
          <button type="submit" disabled={!phoneVerified} className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
            Submit Details
          </button>
        </div>
      </form>
    </div>
  );
}

function SharingRows({ rows, onChange }) {
  const update = (id, key, value) => onChange(rows.map((r) => (r.id === id ? { ...r, [key]: value } : r)));
  const addRow = () => onChange([...rows, { id: Date.now(), sharingType: '2 Sharing', rooms: '', rent: '' }]);
  const removeRow = (id) => onChange(rows.filter((r) => r.id !== id));

  return (
    <div className="space-y-3">
      {rows.map((r) => (
        <div key={r.id} className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center bg-gray-50 rounded-lg p-3">
          <select value={r.sharingType} onChange={(e) => update(r.id, 'sharingType', e.target.value)} className="input">
            <option>1 Sharing</option>
            <option>2 Sharing</option>
            <option>3 Sharing</option>
            <option>4 Sharing</option>
          </select>
          <input type="number" value={r.rooms} onChange={(e) => update(r.id, 'rooms', e.target.value)} className="input" placeholder="No. of rooms" />
          <input type="number" value={r.rent} onChange={(e) => update(r.id, 'rent', e.target.value)} className="input" placeholder="Rent ₹ / month" />
          {rows.length > 1 && (
            <button type="button" onClick={() => removeRow(r.id)} className="text-red-500 text-xs underline justify-self-start">
              Remove
            </button>
          )}
        </div>
      ))}
      <button type="button" onClick={addRow} className="text-brand-dark text-sm underline">
        + Add another sharing type
      </button>
    </div>
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