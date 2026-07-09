import BackButton from '../components/BackButton';

export default function About() {
  return (
    <div className="container-x py-16">
      <BackButton />
      <h1 className="font-display text-3xl font-bold text-brand-dark mb-4">About SMP Prime Realty</h1>
      <p className="text-gray-600 max-w-2xl">
        SMP Prime Realty has been helping families and businesses across Bengaluru find their perfect place for
        years. We specialize in residential, commercial, rental, resale, villas, apartments and land deals, backed
        by transparent pricing and end-to-end legal and loan support.
      </p>
    </div>
  );
}