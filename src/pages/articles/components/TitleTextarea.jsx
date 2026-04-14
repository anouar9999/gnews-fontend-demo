import { useRef, useEffect } from 'react';

export default function TitleTextarea({ value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.height = 'auto';
    ref.current.style.height = ref.current.scrollHeight + 'px';
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={e => onChange(e.target.value)}
      required
      placeholder="Untitled article…"
      rows={1}
      className="w-full bg-transparent text-white outline-none resize-none font-black leading-tight"
      style={{ fontSize: '38px', caretColor: '#FF6B00', letterSpacing: '-0.02em', overflow: 'hidden', minHeight: '52px' }}
    />
  );
}
