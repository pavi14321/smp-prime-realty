import { Users, Award, Building2, FileCheck } from 'lucide-react';

const items = [
  { icon: Users, title: 'Trusted By Thousands', desc: '1000+ happy customers and counting.' },
  { icon: Award, title: 'Best Price Guarantee', desc: 'We ensure transparent deals with best prices.' },
  { icon: Building2, title: 'Wide Range Of Options', desc: 'From apartments to lands, we have it all.' },
  { icon: FileCheck, title: 'Legal & Loan Support', desc: 'End to end support for legal verification and loans.' },
];

export default function WhyChooseUs() {
  return (
    <section className="container-x py-20">
      <h2 className="font-display text-3xl font-bold text-center text-brand-dark mb-12">Why Choose Us</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <div key={it.title} className="text-center">
              <span className="w-14 h-14 mx-auto rounded-full bg-brand-50 text-brand-dark flex items-center justify-center mb-4">
                <Icon size={24} />
              </span>
              <h3 className="font-semibold text-brand-dark mb-2">{it.title}</h3>
              <p className="text-sm text-gray-500">{it.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
