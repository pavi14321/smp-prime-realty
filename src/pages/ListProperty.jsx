import { useState } from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { addSubmission } from '../data/submissionsStore';
import { sendOtp, verifyOtp } from '../utils/otpService';
import BackButton from '../components/BackButton';
import toast from 'react-hot-toast';

const empty = {
  ownerName: '',
  propertyName: '',
  location: '',
  sqft: '',
  condition: 'Good',
  constructionStatus: 'Ready to Move',
  listingType: 'Sell',
  expectedAmount: '',
  email: '',
  phone: '',
};

export default function ListProperty() {
  const [form, setForm] = useState(empty);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [submitted, setSubmitted] = useState(null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSendOtp = () => {
    if (!/^\d{10}$/.test(form.phone)) {
      toast.error('Enter a valid 10-digit phone number first');
      return;
    }
    const code = sendOtp(form.phone);
    toast.success(`Demo OTP sent: ${code}`); // remove in production
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
    const submission = addSubmission({ ...form });
    setSubmitted(submission);
  };

  if (submitted) {
    return (
      <div className="container-x py-16 max-w-xl mx-auto text-center">
        <BackButton className="text-left" />
        <CheckCircle2 size={48} className="mx-auto text-green-600 mb-4" />
        <h1 className="font-display text-2xl font-bold text-brand-dark mb-2">
          Your property is under review
        </h1>
        <p className="text-gray-600 mb-4">
          Reference ID <strong>{submitted.id}</strong>. Our admin team will verify your details
          and call you on <strong>{submitted.phone}</strong> before your listing goes live on the
          website.
        </p>
        <button
          className="btn-outline"
          onClick={() => { setSubmitted(null); setForm(empty); setOtpSent(false); setPhoneVerified(false); setOtp(''); }}
        >
          Submit another property
        </button>
      </div>
    );
  }

  return (
    <div className="container-x py-16 max-w-2xl mx-auto">
      <BackButton />
      <h1 className="font-display text-3xl font-bold text-brand-dark mb-2">List Your Property</h1>
      <p className="text-gray-600 mb-8">
        Want to sell or rent your property? Share the details below — our team will review and
        contact you before it appears on SMP Prime Realty.
      </p>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-xl p-6 grid md:grid-cols-2 gap-5">
        <Field label="Your Name" required>
          <input required value={form.ownerName} onChange={set('ownerName')} className="input" placeholder="Full name" />
        </Field>
        <Field label="Property Name / Title" required>
          <input required value={form.propertyName} onChange={set('propertyName')} className="input" placeholder="e.g. 3BHK Apartment" />
        </Field>

        <Field label="Location" required>
          <input required value={form.location} onChange={set('location')} className="input" placeholder="Area, City" />
        </Field>
        <Field label="Area (Sq.Ft)" required>
          <input required type="number" value={form.sqft} onChange={set('sqft')} className="input" placeholder="1200" />
        </Field>

        <Field label="I want to" required>
          <select value={form.listingType} onChange={set('listingType')} className="input">
            <option value="Sell">Sell</option>
            <option value="Rent">Rent</option>
          </select>
        </Field>
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

        <div className="md:col-span-2">
          <button type="submit" disabled={!phoneVerified} className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
            Submit Property Details
          </button>
        </div>
      </form>
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