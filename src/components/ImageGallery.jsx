import { useState } from 'react';

export default function ImageGallery({ images = [], alt = '' }) {
  const [active, setActive] = useState(0);
  const safeImages = images.length ? images : ['https://placehold.co/800x600?text=No+Image'];

  return (
    <div>
      <img src={safeImages[active]} alt={alt} className="w-full h-[360px] object-cover rounded-xl mb-3" />
      {safeImages.length > 1 && (
        <div className="flex gap-3 mb-6 flex-wrap">
          {safeImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-20 h-16 rounded-lg overflow-hidden border-2 ${active === i ? 'border-gold' : 'border-transparent'}`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}