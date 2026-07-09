import { Link } from 'react-router-dom';
import { Home as HomeIcon, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white pt-14 pb-6 mt-20">
      <div className="container-x grid grid-cols-2 md:grid-cols-5 gap-10 pb-10 border-b border-white/10">
        <div className="col-span-2">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <span className="w-9 h-9 rounded-md bg-gold flex items-center justify-center text-brand-dark">
              <HomeIcon size={18} />
            </span>
            <span className="font-display font-bold text-lg">SMP Prime Realty</span>
          </Link>
          <p className="text-sm text-white/70 max-w-xs mb-5">
            Your trusted real estate partner for life.
          </p>
          <div className="flex gap-3">
            {[Facebook, Instagram, Linkedin, Youtube].map((Icon, i) => (
              <span
                key={i}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-brand-dark transition-colors cursor-pointer"
              >
                <Icon size={15} />
              </span>
            ))}
          </div>
        </div>

        <FooterCol
          title="Quick Links"
          items={['Home', 'About Us', 'Properties', 'Services', 'Blog', 'Contact']}
        />
        <FooterCol
          title="Property Types"
          items={['Apartments', 'Villas', 'Lands / Plots', 'Rental Properties', 'Resale Properties', 'Commercial']}
        />
        <FooterCol
          title="Services"
          items={['Buy Property', 'Rent Property', 'Resale Property', 'Loan Support', 'Legal Support']}
        />
      </div>

      <div className="container-x flex flex-col md:flex-row items-center justify-between pt-6 text-xs text-white/60 gap-3">
        <span>© 2026 SMP Prime Realty. All Rights Reserved.</span>
        <div className="flex gap-4">
          <span>Privacy Policy</span>
          <span>Terms & Conditions</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }) {
  return (
    <div>
      <h4 className="font-semibold mb-4 text-sm">{title}</h4>
      <ul className="space-y-2 text-sm text-white/70">
        {items.map((i) => (
          <li key={i} className="hover:text-gold-light transition-colors cursor-pointer">
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}