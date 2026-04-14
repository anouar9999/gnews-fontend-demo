import { useState } from 'react';
import { X } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

export default function TextBlock({ block, onChange, onRemove, isOnly }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <RichTextEditor
        value={block.content}
        onChange={html => onChange({ content: html })}
        placeholder="Write something here…"
        minHeight={52}
      />
      {!isOnly && hovered && (
        <button
          type="button"
          onClick={onRemove}
          title="Remove block"
          className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full"
          style={{ background: '#2a2a2a', border: '1px solid #3a3a3a', color: 'rgba(255,255,255,0.4)', zIndex: 10 }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.15)'; e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.3)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#2a2a2a'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.borderColor = '#3a3a3a'; }}
        >
          <X size={9} />
        </button>
      )}
    </div>
  );
}
