import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Home as HomeIcon, Menu, X, ChevronDown } from 'lucide-react';

const links = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Properties', to: '/properties' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="container-x flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-2">
          <span className="w-10 h-10 rounded-md bg-brand-dark flex items-center justify-center text-white">
            <HomeIcon size={20} />
          </span>
          <span>
            <span className="block font-display font-bold text-lg text-brand-dark leading-tight">
              SMP Prime Realty
            </span>
            <span className="block text-[11px] text-gray-500">Find Your Perfect Place</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-700">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `hover:text-brand-dark transition-colors ${isActive ? 'text-brand-dark' : ''}`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <span className="flex items-center gap-1 cursor-default text-gray-700">
            Services <ChevronDown size={14} />
          </span>
        </nav>

        <div className="hidden lg:block">
          <Link to="/contact" className="btn-primary text-sm">
            Get In Touch
          </Link>
        </div>

        <button className="lg:hidden text-brand-dark" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-gray-100 px-4 pb-4">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm font-medium text-gray-700"
            >
              {l.label}
            </Link>
          ))}
          <Link to="/admin" onClick={() => setOpen(false)} className="block py-2 text-sm font-medium text-gold-dark">
            Admin Panel
          </Link>
        </div>
      )}
    </header>
  );
}
