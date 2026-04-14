export default function DarkTextarea({ ...props }) {
  return (
    <textarea
      {...props}
      className="w-full px-4 py-3 rounded-lg text-[13px] text-white outline-none transition-all duration-150 resize-none"
      style={{ background: '#111111', border: '1px solid #2a2a2a', caretColor: '#FF6B00' }}
      onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,107,0,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255,107,0,0.07)'; }}
      onBlur={e  => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.boxShadow = 'none'; }}
    />
  );
}
