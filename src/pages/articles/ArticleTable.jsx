import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Pencil, Trash2, Send, Archive,
  Star, Zap, FileText, X, Plus,
  ChevronUp, ChevronDown as ChevronDownIcon,
} from "lucide-react";

/* ─── grid template (exported for external use) ─────────── */
export const GRID_COLS = "40px 1fr 130px 90px 120px 120px 100px 130px";

/* ─── status config ─────────────────────────────────────── */
const STATUS_CFG = {
  nouveau:      { label: "New",        bg: "rgba(96,165,250,0.08)",  border: "rgba(96,165,250,0.22)",  color: "#60a5fa", rgb: "96,165,250"  },
  brouillon_ia: { label: "AI Draft",   bg: "rgba(250,204,21,0.08)",  border: "rgba(250,204,21,0.22)",  color: "#facc15", rgb: "250,204,21"  },
  en_revision:  { label: "In Review",  bg: "rgba(251,146,60,0.08)",  border: "rgba(251,146,60,0.22)",  color: "#fb923c", rgb: "251,146,60"  },
  publie:       { label: "Published",  bg: "rgba(74,222,128,0.08)",  border: "rgba(74,222,128,0.22)",  color: "#4ade80", rgb: "74,222,128"  },
  archive:      { label: "Archived",   bg: "rgba(107,114,128,0.08)", border: "rgba(107,114,128,0.22)", color: "#6b7280", rgb: "107,114,128" },
};

/* ─── helpers ───────────────────────────────────────────── */
function fmtDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  const dd   = String(d.getDate()).padStart(2, "0");
  const mm   = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

/* ─── ColHeader ─────────────────────────────────────────── */
function ColHeader({ children, sortable = true }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "5px", userSelect: "none" }}>
      <span style={{
        fontSize: "10px",
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.18)",
        lineHeight: 1,
      }}>
        {children}
      </span>
      {sortable && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1px", opacity: 0.7 }}>
          <ChevronUp    size={8} style={{ color: "#FF6B00", display: "block" }} />
          <ChevronDownIcon size={8} style={{ color: "#FF6B00", display: "block" }} />
        </div>
      )}
    </div>
  );
}

/* ─── Checkbox ──────────────────────────────────────────── */
function Checkbox({ checked, indeterminate, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-checked={checked}
      style={{
        width: "16px", height: "16px",
        borderRadius: "4px",
        border: checked || indeterminate ? "none" : "1px solid rgba(255,255,255,0.15)",
        background: checked ? "#FF6B00" : indeterminate ? "rgba(255,107,0,0.3)" : "rgba(255,255,255,0.04)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        transition: "all 0.15s ease",
        boxShadow: (checked || indeterminate) ? "0 0 8px rgba(255,107,0,0.4)" : "none",
        cursor: "pointer",
      }}
    >
      {checked && (
        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
          <path d="M1 3.2L3.5 5.5L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {!checked && indeterminate && (
        <div style={{ width: "8px", height: "1.5px", background: "white", borderRadius: "1px" }} />
      )}
    </button>
  );
}

/* ─── ArticleAvatar ─────────────────────────────────────── */
function ArticleAvatar({ src, title, status }) {
  const cfg = STATUS_CFG[status] ?? STATUS_CFG.archive;
  const letter = (title || "?")[0].toUpperCase();
  if (src) {
    return (
      <div style={{
        width: "42px", height: "42px", borderRadius: "50%",
        overflow: "hidden", flexShrink: 0,
        border: `1.5px solid rgba(${cfg.rgb},0.22)`,
        boxShadow: `0 0 0 3px rgba(${cfg.rgb},0.06)`,
      }}>
        <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    );
  }
  return (
    <div style={{
      width: "42px", height: "42px", borderRadius: "50%", flexShrink: 0,
      background: `linear-gradient(135deg, rgba(${cfg.rgb},0.18) 0%, rgba(${cfg.rgb},0.05) 100%)`,
      border: `1.5px solid rgba(${cfg.rgb},0.2)`,
      boxShadow: `0 0 0 3px rgba(${cfg.rgb},0.06)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "15px", fontWeight: 700,
      color: `rgb(${cfg.rgb})`,
    }}>
      {letter}
    </div>
  );
}

/* ─── StatusPill ────────────────────────────────────────── */
function StatusPill({ status }) {
  const cfg = STATUS_CFG[status] ?? STATUS_CFG.archive;
  return (
    <span style={{
      display: "inline-block",
      background: cfg.bg,
      color: cfg.color,
      border: `1px solid ${cfg.border}`,
      borderRadius: "8px",
      padding: "3px 10px",
      fontSize: "11px",
      fontWeight: 600,
      whiteSpace: "nowrap",
      lineHeight: "1.5",
    }}>
      {cfg.label}
    </span>
  );
}

/* ─── SkeletonRow ───────────────────────────────────────── */
function SkeletonRow() {
  const pulse = {
    background: "rgba(255,255,255,0.05)",
    borderRadius: "4px",
    animation: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
  };
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: GRID_COLS,
      gap: "16px",
      padding: "0 20px",
      alignItems: "center",
      height: "72px",
      borderBottom: "1px solid rgba(255,255,255,0.04)",
    }}>
      <div style={{ ...pulse, width: "16px", height: "16px", borderRadius: "4px" }} />
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ ...pulse, width: "42px", height: "42px", borderRadius: "50%", flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ ...pulse, height: "13px", width: "58%", marginBottom: "7px" }} />
          <div style={{ ...pulse, height: "10px", width: "36%", background: "rgba(255,255,255,0.03)" }} />
        </div>
      </div>
      {[85, 55, 72, 80, 90, 60].map((w, i) => (
        <div key={i} style={{ ...pulse, height: "11px", width: `${w}%`, background: "rgba(255,255,255,0.04)" }} />
      ))}
    </div>
  );
}

/* ─── EmptyState ────────────────────────────────────────── */
function EmptyState({ hasFilters, canEdit, clearFilters }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", userSelect: "none" }}>
      <div style={{ position: "relative", width: "112px", height: "112px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "32px" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1px solid rgba(255,107,0,0.08)" }} />
        <div style={{ position: "absolute", inset: "14px", borderRadius: "50%", border: "1px dashed rgba(255,107,0,0.14)" }} />
        {/* Corner reticle ticks */}
        {[
          { top: 0,       left: 0,       borderTop: "1.5px solid rgba(255,107,0,0.4)", borderLeft: "1.5px solid rgba(255,107,0,0.4)" },
          { top: 0,       right: 0,      borderTop: "1.5px solid rgba(255,107,0,0.4)", borderRight: "1.5px solid rgba(255,107,0,0.4)" },
          { bottom: 0,    left: 0,       borderBottom: "1.5px solid rgba(255,107,0,0.4)", borderLeft: "1.5px solid rgba(255,107,0,0.4)" },
          { bottom: 0,    right: 0,      borderBottom: "1.5px solid rgba(255,107,0,0.4)", borderRight: "1.5px solid rgba(255,107,0,0.4)" },
        ].map((s, i) => (
          <div key={i} style={{ position: "absolute", width: "12px", height: "12px", ...s }} />
        ))}
        <div style={{
          width: "56px", height: "56px", borderRadius: "16px",
          background: "linear-gradient(135deg, rgba(255,107,0,0.1) 0%, rgba(255,107,0,0.04) 100%)",
          border: "1px solid rgba(255,107,0,0.2)",
          boxShadow: "0 0 30px rgba(255,107,0,0.08)",
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative", zIndex: 1,
        }}>
          <FileText size={24} style={{ color: "rgba(255,107,0,0.55)" }} />
        </div>
      </div>

      <p style={{ fontSize: "15px", fontWeight: 700, color: "rgba(255,255,255,0.7)", marginBottom: "6px" }}>
        {hasFilters ? "No articles found" : "No articles yet"}
      </p>
      <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)", textAlign: "center", maxWidth: "260px", marginBottom: "28px", lineHeight: 1.6 }}>
        {hasFilters
          ? "Try adjusting your filters or clearing the search."
          : "Your library is empty. Create your first article to get started."}
      </p>

      {hasFilters ? (
        <button
          onClick={clearFilters}
          style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: 600, padding: "8px 16px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.09)", cursor: "pointer", transition: "all 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.09)"; e.currentTarget.style.color = "rgba(255,255,255,0.65)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(255,255,255,0.45)"; }}
        >
          <X size={12} /> Clear filters
        </button>
      ) : canEdit && (
        <Link
          to="/admin/articles/new"
          style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 700, padding: "10px 20px", borderRadius: "12px", background: "linear-gradient(135deg, #FF6B00 0%, #cc4400 100%)", color: "white", textDecoration: "none", boxShadow: "0 4px 20px rgba(255,107,0,0.35)", transition: "all 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 28px rgba(255,107,0,0.55)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(255,107,0,0.35)"; e.currentTarget.style.transform = "none"; }}
        >
          <Plus size={14} strokeWidth={2.5} /> New Article
        </Link>
      )}
    </div>
  );
}

/* ─── ActionBtn ─────────────────────────────────────────── */
function ActionBtn({ icon: Icon, label, colorRgb, onClick, as: Tag = "button", to, disabled }) {
  const base  = { background: `rgba(${colorRgb},0.07)`, color: `rgb(${colorRgb})`, border: `1px solid rgba(${colorRgb},0.14)` };
  const hover = { background: `rgba(${colorRgb},0.16)`, borderColor: `rgba(${colorRgb},0.35)`, boxShadow: `0 0 10px rgba(${colorRgb},0.2)` };
  const shared = {
    title: label, "aria-label": label,
    style: { ...base, width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "10px", transition: "all 0.15s", cursor: "pointer", flexShrink: 0 },
    onMouseEnter: e => Object.assign(e.currentTarget.style, hover),
    onMouseLeave: e => Object.assign(e.currentTarget.style, base),
  };
  if (Tag === "button") return <button {...shared} onClick={onClick} disabled={disabled}><Icon size={13} /></button>;
  return <Link {...shared} to={to}><Icon size={13} /></Link>;
}

/* ═══════════════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════════════ */
export default function ArticleTable({ articles, loading, canEdit, canDelete, onAction, hasFilters, clearFilters }) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(new Set());

  const allSelected  = articles.length > 0 && articles.every(a => selected.has(a.id));
  const someSelected = !allSelected && articles.some(a => selected.has(a.id));

  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(articles.map(a => a.id)));
  const toggleRow = id => setSelected(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  return (
    <div style={{
      background: "linear-gradient(160deg, #161618 0%, #111113 100%)",
      borderRadius: "14px",
      overflow: "hidden",
      border: "1px solid rgba(255,255,255,0.05)",
      boxShadow: "0 4px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
    }}>

      {/* ── Column header ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: GRID_COLS,
        gap: "16px",
        padding: "0 20px",
        alignItems: "center",
        height: "44px",
        background: "#1a1a1c",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Checkbox checked={allSelected} indeterminate={someSelected} onChange={toggleAll} />
        </div>
        <ColHeader>Article</ColHeader>
        <ColHeader>Author</ColHeader>
        <ColHeader>Views</ColHeader>
        <ColHeader>Status</ColHeader>
        <ColHeader>Flags</ColHeader>
        <ColHeader sortable={false}>Date</ColHeader>
        <ColHeader sortable={false}>Actions</ColHeader>
      </div>

      {/* ── Loading skeletons ── */}
      {loading && [...Array(6)].map((_, i) => <SkeletonRow key={i} />)}

      {/* ── Empty state ── */}
      {!loading && articles.length === 0 && (
        <EmptyState hasFilters={hasFilters} canEdit={canEdit} clearFilters={clearFilters} />
      )}

      {/* ── Data rows ── */}
      {!loading && articles.map((row, i) => {
        const isLast    = i === articles.length - 1;
        const isChecked = selected.has(row.id);
        const thumbnail = row.featured_image ?? row.image ?? row.thumbnail ?? null;
        const author    = row.author?.username ?? row.author ?? "—";
        const category  = row.category?.name ?? null;

        return (
          <div
            key={row.id ?? i}
            style={{
              display: "grid",
              gridTemplateColumns: GRID_COLS,
              gap: "16px",
              padding: "0 20px",
              alignItems: "center",
              height: "72px",
              borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.04)",
              cursor: "pointer",
              transition: "background 0.12s ease",
              position: "relative",
              background: isChecked ? "rgba(255,107,0,0.03)" : "transparent",
            }}
            onClick={() => navigate(`/admin/articles/${row.id}`)}
            onMouseEnter={e => {
              if (!isChecked) e.currentTarget.style.background = "rgba(255,255,255,0.028)";
              const bar = e.currentTarget.querySelector(".accent-bar");
              if (bar && !isChecked) bar.style.background = "rgba(255,107,0,0.45)";
            }}
            onMouseLeave={e => {
              if (!isChecked) e.currentTarget.style.background = "transparent";
              const bar = e.currentTarget.querySelector(".accent-bar");
              if (bar && !isChecked) bar.style.background = "transparent";
            }}
          >
            {/* Left orange accent bar */}
            <div
              className="accent-bar"
              style={{
                position: "absolute",
                left: 0, top: 0, bottom: 0,
                width: "3px",
                borderRadius: "0 3px 3px 0",
                background: isChecked ? "rgba(255,107,0,0.7)" : "transparent",
                transition: "background 0.15s ease",
              }}
            />

            {/* Checkbox */}
            <div
              style={{ display: "flex", alignItems: "center" }}
              onClick={e => { e.stopPropagation(); toggleRow(row.id); }}
            >
              <Checkbox checked={isChecked} onChange={() => toggleRow(row.id)} />
            </div>

            {/* Article: avatar + title + sub-label */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
              <ArticleAvatar src={thumbnail} title={row.title} status={row.status} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{
                  fontSize: "14px", fontWeight: 700, color: "#ffffff",
                  margin: 0, lineHeight: 1.3,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }} title={row.title}>
                  {row.title}
                </p>
                <p style={{
                  fontSize: "11px", fontWeight: 500, color: "rgba(255,255,255,0.35)",
                  margin: "3px 0 0",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {category ?? `/${row.slug ?? `article-${row.id}`}`}
                </p>
              </div>
            </div>

            {/* Author */}
            <div style={{
              fontSize: "13px", fontWeight: 500, color: "rgba(255,255,255,0.72)",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {author}
            </div>

            {/* Views */}
            <div style={{
              fontSize: "13px", fontWeight: 600,
              color: "rgba(255,255,255,0.45)",
              fontVariantNumeric: "tabular-nums",
            }}>
              {(row.view_count ?? 0).toLocaleString()}
            </div>

            {/* Status pill */}
            <div>
              <StatusPill status={row.status} />
            </div>

            {/* Flags */}
            <div style={{ display: "flex", alignItems: "center", gap: "4px", flexWrap: "wrap" }}>
              {row.is_featured && (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "4px",
                  background: "rgba(250,204,21,0.07)", color: "#facc15",
                  border: "1px solid rgba(250,204,21,0.18)", borderRadius: "8px",
                  padding: "3px 8px", fontSize: "10px", fontWeight: 700, whiteSpace: "nowrap",
                }}>
                  <Star size={8} fill="currentColor" /> Featured
                </span>
              )}
              {row.is_breaking && (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "4px",
                  background: "rgba(248,113,113,0.07)", color: "#f87171",
                  border: "1px solid rgba(248,113,113,0.18)", borderRadius: "8px",
                  padding: "3px 8px", fontSize: "10px", fontWeight: 700, whiteSpace: "nowrap",
                }}>
                  <Zap size={8} fill="currentColor" /> Breaking
                </span>
              )}
              {!row.is_featured && !row.is_breaking && (
                <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.12)" }}>—</span>
              )}
            </div>

            {/* Date */}
            <div>
              <time style={{
                fontSize: "11px", fontWeight: 500,
                color: "rgba(255,255,255,0.22)",
                fontVariantNumeric: "tabular-nums",
              }} dateTime={row.created_at}>
                {fmtDate(row.created_at)}
              </time>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }} onClick={e => e.stopPropagation()}>
              {canEdit && (
                <>
                  <ActionBtn as={Link} to={`/admin/articles/${row.id}/edit`} icon={Pencil} label="Edit"    colorRgb="96,165,250" />
                  {row.status !== "publie"  && <ActionBtn icon={Send}    label="Publish" colorRgb="74,222,128" onClick={() => onAction("publish", row)} />}
                  {row.status !== "archive" && <ActionBtn icon={Archive} label="Archive" colorRgb="251,146,60" onClick={() => onAction("archive", row)} />}
                </>
              )}
              {canDelete && (
                <ActionBtn icon={Trash2} label="Delete" colorRgb="248,113,113" onClick={() => onAction("delete", row)} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
