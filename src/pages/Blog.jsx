import BackButton from '../components/BackButton';

export default function Blog() {
  return (
    <div className="container-x py-16">
      <BackButton />
      <h1 className="font-display text-3xl font-bold text-brand-dark mb-4">Blog</h1>
      <p className="text-gray-600">Real estate tips, market insights and guides — coming soon.</p>
    </div>
  );
}