import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function BackButton({ className = '' }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className={`flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-brand-dark transition-colors mb-4 ${className}`}
    >
      <ArrowLeft size={16} /> Back
    </button>
  );
}