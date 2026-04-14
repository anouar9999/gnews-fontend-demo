export default function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="relative shrink-0 w-10 h-6 rounded-full transition-all duration-200"
      style={{
        background: checked ? '#FF6B00' : '#2a2a2a',
        boxShadow: checked ? '0 0 10px rgba(255,107,0,0.35)' : 'none',
      }}
    >
      <span
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
        style={{ left: checked ? '18px' : '4px' }}
      />
    </button>
  );
}
