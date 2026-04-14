const STATUS_MAP = {
  nouveau:      { label: 'New',        dot: '#60a5fa', color: 'rgba(96,165,250,0.85)',  bg: 'rgba(96,165,250,0.08)',  border: 'rgba(96,165,250,0.2)'  },
  brouillon_ia: { label: 'AI Draft',   dot: '#facc15', color: 'rgba(250,204,21,0.85)',  bg: 'rgba(250,204,21,0.08)',  border: 'rgba(250,204,21,0.2)'  },
  en_revision:  { label: 'In Review',  dot: '#fb923c', color: 'rgba(251,146,60,0.85)',  bg: 'rgba(251,146,60,0.08)',  border: 'rgba(251,146,60,0.2)'  },
  publie:       { label: 'Published',  dot: '#4ade80', color: 'rgba(74,222,128,0.85)',  bg: 'rgba(74,222,128,0.08)',  border: 'rgba(74,222,128,0.2)'  },
  archive:      { label: 'Archived',   dot: '#6b7280', color: 'rgba(107,114,128,0.85)', bg: 'rgba(107,114,128,0.08)', border: 'rgba(107,114,128,0.2)' },
};

export default function StatusBadge({ status }) {
  const cfg = STATUS_MAP[status] ?? { label: status, dot: '#6b7280', color: 'rgba(107,114,128,0.85)', bg: 'rgba(107,114,128,0.08)', border: 'rgba(107,114,128,0.2)' };
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold"
      style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: cfg.dot, boxShadow: `0 0 5px ${cfg.dot}` }}
      />
      {cfg.label}
    </span>
  );
}
