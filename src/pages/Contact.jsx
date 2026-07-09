import { Phone, Mail, MapPin } from 'lucide-react';
import BackButton from '../components/BackButton';

export default function Contact() {
  return (
    <div className="container-x py-16 grid md:grid-cols-2 gap-10">
      <div>
        <BackButton />
        <h1 className="font-display text-3xl font-bold text-brand-dark mb-4">Contact Us</h1>
        <p className="text-gray-600 mb-8">We are here to help you find your perfect place.</p>
        <div className="space-y-5 text-sm text-gray-600">
          <p className="flex items-center gap-3"><Phone size={16} className="text-brand-dark" /> +91 98765 43210</p>
          <p className="flex items-center gap-3"><Mail size={16} className="text-brand-dark" /> info@smpprimerealty.com</p>
          <p className="flex items-center gap-3"><MapPin size={16} className="text-brand-dark" /> No. 123, 2nd Floor, 4th Main, HSR Layout, Bengaluru - 560102</p>
        </div>
      </div>
      <form className="bg-white border border-gray-100 rounded-xl p-6 space-y-4">
        <input className="input" placeholder="Full Name" />
        <input className="input" placeholder="Email" />
        <input className="input" placeholder="Phone" />
        <textarea className="input" rows={4} placeholder="Message" />
        <button className="btn-primary w-full">Send Message</button>
      </form>
    </div>
  );
}