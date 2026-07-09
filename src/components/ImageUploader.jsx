import { useRef } from 'react';
import { UploadCloud, X } from 'lucide-react';

// DEMO ONLY — converts images to base64 for in-memory storage.
// Once your Express/Neon backend is ready, replace this with an upload
// to your server/S3/Cloudinary and store the returned URL instead.
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ImageUploader({ images, onChange, max = 3, label }) {
  const inputRef = useRef(null);

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    const room = max - images.length;
    if (room <= 0) return;
    const toAdd = files.slice(0, room);
    const dataUrls = await Promise.all(toAdd.map(fileToDataUrl));
    onChange([...images, ...dataUrls]);
    e.target.value = '';
  };

  const removeAt = (idx) => onChange(images.filter((_, i) => i !== idx));

  return (
    <div>
      <label className="text-xs font-medium text-gray-600 mb-1 block">
        {label || 'Photos'} <span className="text-gray-400">({images.length}/{max})</span>
      </label>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-2">
        {images.map((src, i) => (
          <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
            <img src={src} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={12} />
            </button>
            {i === 0 && (
              <span className="absolute bottom-1 left-1 tag bg-brand-dark text-[10px] px-1.5 py-0.5">Cover</span>
            )}
          </div>
        ))}
        {images.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:text-brand-dark hover:border-brand-dark transition-colors"
          >
            <UploadCloud size={18} />
            <span className="text-[10px] mt-1">Upload</span>
          </button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={handleFiles} />
      <p className="text-[11px] text-gray-400">First photo is used as the cover image. Max {max} photos.</p>
    </div>
  );
}