import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Home as HomeIcon, Menu, X, ChevronDown, Building2, ShieldCheck, Search, KeyRound } from 'lucide-react';

const links = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Properties', to: '/properties' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
];

const serviceLinks = [
  { label: 'Sell Your Property', to: '/list-property?type=sell', icon: Building2, hint: 'For Sellers' },
  { label: 'Rent Out Your Property', to: '/list-property?type=rent', icon: KeyRound, hint: 'For Owners' },
  { label: 'List Your PG', to: '/list-property?type=pg', icon: Building2, hint: 'For PG Owners' },
  { label: 'Browse Properties & PGs', to: '/properties', icon: Search, hint: 'For Buyers & Tenants' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="container-x flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-2">
          <span className="w-10 h-10 rounded-md bg-brand-dark flex items-center justify-center text-white">
            <HomeIcon size={20} />
          </span>
          <span>
            <span className="block font-display font-bold text-lg text-brand-dark leading-tight">SMP Prime Realty</span>
            <span className="block text-[11px] text-gray-500">Find Your Perfect Place</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-700">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => `hover:text-brand-dark transition-colors ${isActive ? 'text-brand-dark' : ''}`}
            >
              {l.label}
            </NavLink>
          ))}

          <div className="relative" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
            <button
              type="button"
              onClick={() => setServicesOpen((v) => !v)}
              className="flex items-center gap-1 text-gray-700 hover:text-brand-dark transition-colors"
            >
              Services <ChevronDown size={14} className={`transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
            </button>

            {servicesOpen && (
              <div className="absolute top-full left-0 pt-3 w-72">
                <div className="bg-white border border-gray-100 rounded-lg shadow-lg py-2">
                  {serviceLinks.map((s) => {
                    const Icon = s.icon;
                    return (
                      <Link
                        key={s.label}
                        to={s.to}
                        onClick={() => setServicesOpen(false)}
                        className="flex items-start gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-dark"
                      >
                        <Icon size={15} className="mt-0.5 shrink-0" />
                        <span>
                          <span className="block">{s.label}</span>
                          <span className="block text-[11px] text-gray-400">{s.hint}</span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link to="/list-property" className="btn-outline text-sm">List Property / PG</Link>
          <Link to="/contact" className="btn-primary text-sm">Get In Touch</Link>
          <Link
            to="/admin"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-dark border border-gray-200 rounded-md px-3 py-2 transition-colors"
          >
            <ShieldCheck size={15} /> Admin Login
          </Link>
        </div>

        <button className="lg:hidden text-brand-dark" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-gray-100 px-4 pb-4">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="block py-2 text-sm font-medium text-gray-700">
              {l.label}
            </Link>
          ))}

          <button
            type="button"
            onClick={() => setMobileServicesOpen((v) => !v)}
            className="flex items-center justify-between w-full py-2 text-sm font-medium text-gray-700"
          >
            Services <ChevronDown size={14} className={`transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} />
          </button>
          {mobileServicesOpen && (
            <div className="pl-3 border-l-2 border-gray-100 mb-2">
              {serviceLinks.map((s) => (
                <Link
                  key={s.label}
                  to={s.to}
                  onClick={() => { setOpen(false); setMobileServicesOpen(false); }}
                  className="block py-2 text-sm text-gray-600"
                >
                  {s.label} <span className="text-[11px] text-gray-400">— {s.hint}</span>
                </Link>
              ))}
            </div>
          )}

          <Link to="/list-property" onClick={() => setOpen(false)} className="btn-primary w-full text-center text-sm mt-2 inline-block">
            List Property / PG
          </Link>
          <Link
            to="/admin"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-1.5 w-full text-center text-sm mt-2 border border-gray-200 rounded-md px-3 py-2 text-gray-600"
          >
            <ShieldCheck size={15} /> Admin Login
          </Link>
        </div>
      )}
    </header>
  );
}