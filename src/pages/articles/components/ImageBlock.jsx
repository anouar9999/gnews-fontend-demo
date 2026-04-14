import { Upload, X } from 'lucide-react';
import FieldLabel from './FieldLabel';

export default function ImageBlock({ imagePreview, fileInputRef, handleFileChange, handleRemoveImage }) {
  return (
    <div>
      <FieldLabel>Cover Image</FieldLabel>
      {imagePreview ? (
        <div className="relative w-full h-52 rounded-xl overflow-hidden group">
          <img src={imagePreview} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
          >
            <X size={13} />
          </button>
          <div
            className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold text-white"
            style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            100%
          </div>
        </div>
      ) : (
        <label
          className="flex flex-col items-center justify-center w-full h-40 rounded-xl cursor-pointer transition-all duration-150 group"
          style={{ border: '2px dashed #2a2a2a' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,107,0,0.4)'; e.currentTarget.style.background = 'rgba(255,107,0,0.03)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.background = 'transparent'; }}
        >
          <div
            className="w-10 h-10 flex items-center justify-center rounded-xl mb-3 transition-colors"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            <Upload size={18} style={{ color: 'rgba(255,255,255,0.3)' }} />
          </div>
          <span className="text-[13px] font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Add cover image</span>
          <span className="text-[11px] mt-1" style={{ color: 'rgba(255,255,255,0.18)' }}>PNG, JPG, WEBP</span>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>
      )}
    </div>
  );
}
