import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import {
  Plus,
  BarChart2,
  Search,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  FileText,
  CheckCircle2,
  Clock,
  Newspaper,
} from "lucide-react";
import api from "../../api/axios";
import toast from "react-hot-toast";

/* ─── helpers ─────────────────────────────────────────────── */

function relativeTime(dateStr) {
  if (!dateStr) return "—";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 2) return "À l'instant";
  if (mins < 60) return `Il y a ${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Il y a ${hrs}h`;
  return `Il y a ${Math.floor(hrs / 24)}j`;
}

function timeStr(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function fmtNum(n) {
  if (n == null) return "—";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "k";
  return String(n);
}

/* ─── status config ───────────────────────────────────────── */

const STATUS_CFG = {
  publie: { label: "Publié", dot: "#4ade80" },
  nouveau: { label: "Nouveau", dot: "#60a5fa" },
  brouillon_ia: { label: "Brouillon IA", dot: "#facc15" },
  en_revision: { label: "En révision", dot: "#fb923c" },
  archive: { label: "Archivé", dot: "#6b7280" },
};

/* ─── sub-components ──────────────────────────────────────── */

function MetricCard({ label, value, subtitle, badge, accentColor }) {
  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-2"
      style={{
        background: "#111114",
        border: "1px solid rgba(255,255,255,0.06)",
        borderLeft: `3px solid ${accentColor}`,
      }}
    >
      <div className="flex items-center justify-between">
        <span
          className="text-[10px] font-bold uppercase tracking-widest"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          {label}
        </span>
        {badge != null && (
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
            style={{
              color: accentColor,
              background: `${accentColor}18`,
            }}
          >
            {badge >= 0 ? `+${badge}` : badge}
          </span>
        )}
      </div>
      <p
        className="text-white font-extrabold leading-none"
        style={{ fontSize: "36px" }}
      >
        {fmtNum(value)}
      </p>
      <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
        {subtitle}
      </p>
    </div>
  );
}

function QuickStat({ label, value, dotColor }) {
  return (
    <div className="flex items-center text-black gap-3 px-4 py-2.5">
      <span
        className="w-2 h-2 rounded-full shrink-0"
        style={{ background: dotColor, boxShadow: `0 0 6px ${dotColor}` }}
      />
      <div>
        <p className="text-black font-bold text-lg leading-tight">
          {fmtNum(value)}
        </p>
        <p className="text-[10px] font-semibold uppercase tracking-wider">
          {label}
        </p>
      </div>
    </div>
  );
}

/* ─── main component ──────────────────────────────────────── */

const ARTICLE_FILTERS = [
  { key: "all", label: "Tous" },
  { key: "nouveau", label: "Nouveaux" },
  { key: "brouillon_ia", label: "Brouillons IA" },
  { key: "en_revision", label: "En révision" },
  { key: "publie", label: "Publiés" },
];

const FILTER_COLORS = {
  nouveau: "#60a5fa",
  brouillon_ia: "#facc15",
  en_revision: "#fb923c",
  publie: "#4ade80",
};

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [stats, setStats] = useState(null);

  /* greeting */
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "BONJOUR" : hour < 18 ? "BON APRÈS-MIDI" : "BONSOIR";

  const today = new Date()
    .toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .toUpperCase();

  /* stats */
  useEffect(() => {
    api
      .get("/stats/")
      .then(({ data }) => setStats(data))
      .catch(() => {});
  }, []);

  /* articles */
  const fetchArticles = async () => {
    try {
      setLoading(true);
      const params = { page, page_size: 7 };
      if (search) params.search = search;
      if (filter !== "all") params.status = filter;
      const { data } = await api.get("/articles/", { params });
      setArticles(data.results ?? []);
      setTotalCount(data.count ?? 0);
    } catch {
      /* offline */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [page, filter]); // eslint-disable-line
  useEffect(() => {
    const id = setTimeout(() => {
      setPage(1);
      fetchArticles();
    }, 400);
    return () => clearTimeout(id);
  }, [search]); // eslint-disable-line

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet article ?")) return;
    try {
      await api.delete(`/articles/${id}/`);
      toast.success("Article supprimé");
      fetchArticles();
    } catch {
      toast.error("Impossible de supprimer");
    }
  };

  const totalPages = Math.ceil(totalCount / 7);

  return (
    <div className="space-y-6">
      {/* ── Welcome banner ─────────────────────────────────── */}
      <div className=" bg-amber-100 --6 text-black px-6 py-5 flex flex-col  sm:flex-row sm:items-center gap-5">
        {/* Greeting */}
        <div className="flex-1 min-w-0">
          <h1
            className="text-[48px] font-black uppercase tracking-tighter text-black leading-none"
            style={{ fontSize: "clamp(22px,3vw,30px)" }}
          >
            <h1 className="text-[48px] font-black uppercase tracking-tighter text-black leading-none">
              {" "}
              <span className="">{greeting}, </span>
              <span style={{ color: "#ff6b00" }}>
                {(user?.username ?? "Admin").toUpperCase()}
              </span>
            </h1>
          </h1>
          <p className="text-[10px] font-bold tracking-widest mt-1.5">
            {today}
          </p>
        </div>

        {/* Quick counters */}
        <div
          className="flex items-stretch gap-0 rounded-xl overflow-hidden shrink-0"
          style={{ border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <QuickStat
            label="En attente"
            value={stats?.articles?.pending ?? stats?.articles?.new ?? "—"}
            dotColor="#facc15"
          />
          <div style={{ width: "1px", background: "rgba(255,255,255,0.07)" }} />
          <QuickStat
            label="Aujourd'hui"
            value={
              stats?.articles?.today ?? stats?.articles?.published_today ?? "—"
            }
            dotColor="#4ade80"
          />
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/admin/articles/new"
            className="flex items-center gap-2 px-4 py-3 text-[13px] font-black text-white tracking-wide shrink-0 select-none"
            style={{
              background:
                "linear-gradient(135deg, var(--color-orange) 0%, #e05500 100%)",
              boxShadow:
                "0 6px 0 #a33a00, 0 8px 16px rgba(255,107,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)",
              transform: "translateY(-3px)",
              transition: "transform 0.08s ease, box-shadow 0.08s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 8px 0 #a33a00, 0 12px 24px rgba(255,107,0,0.55), inset 0 1px 0 rgba(255,255,255,0.18)";
              e.currentTarget.style.transform = "translateY(-5px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow =
                "0 6px 0 #a33a00, 0 8px 16px rgba(255,107,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)";
              e.currentTarget.style.transform = "translateY(-3px)";
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.boxShadow =
                "0 2px 0 #a33a00, 0 4px 8px rgba(255,107,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)";
              e.currentTarget.style.transform = "translateY(0px)";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.boxShadow =
                "0 6px 0 #a33a00, 0 8px 16px rgba(255,107,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)";
              e.currentTarget.style.transform = "translateY(-3px)";
            }}
          >
            <Plus size={15} strokeWidth={3} />
            New Article
          </Link>

          <Link
            to="/admin/analytics"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150"
            style={{
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <BarChart2 size={14} />
            Analytics
          </Link>
        </div>
      </div>

      {/* ── Vue d'ensemble ─────────────────────────────────── */}
      <div>
        <p className="text-[10px] font-white font-bold uppercase tracking-widest mb-3">
          Vue d'ensemble
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <MetricCard
            label="Articles collectés"
            value={stats?.articles?.total}
            subtitle="Toutes les sources"
            badge={stats?.articles?.new_today ?? 0}
            accentColor="#facc15"
          />
          <MetricCard
            label="Brouillons IA"
            value={stats?.articles?.ai_draft ?? 0}
            subtitle="En attente de validation"
            accentColor="#ff6b00"
          />
          <MetricCard
            label="En révision"
            value={stats?.articles?.in_review ?? 0}
            subtitle="Relecture en cours"
            accentColor="#60a5fa"
          />
          <MetricCard
            label="Publiés aujourd'hui"
            value={
              stats?.articles?.published_today ?? stats?.articles?.published
            }
            subtitle="Sur GNEWS.ma"
            accentColor="#4ade80"
          />
        </div>
      </div>

      {/* ── Article management panel ───────────────────────── */}
      <div
        className=" overflow-hidden"
        style={{
          background: "#111114",
        }}
      >
        {/* Panel header */}
        <div
          className="px-5 py-4 flex items-center gap-3"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,107,0,0.3), rgba(255,107,0,0.1))",
              border: "1px solid rgba(255,107,0,0.25)",
            }}
          >
            <FileText size={16} style={{ color: "#ff6b00" }} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-sans font-bold text-sm tracking-wide uppercase">
              Gestion des Articles
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "#ff6b00" }}>
              {fmtNum(totalCount)} articles au total
            </p>
          </div>
          <Link
            to="/admin/articles"
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all duration-150"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.45)",
            }}
          >
            Voir tout
            <ChevronRight size={12} />
          </Link>
        </div>

        {/* Toolbar */}
        <div
          className="px-5 py-3 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
        >
          {/* Filter tabs */}
          <div className="flex items-center gap-1 flex-wrap">
            {ARTICLE_FILTERS.map(({ key, label }) => {
              const isActive = filter === key;
              const color = FILTER_COLORS[key];
              return (
                <button
                  key={key}
                  onClick={() => {
                    setFilter(key);
                    setPage(1);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150"
                  style={
                    isActive
                      ? key === "all"
                        ? {
                            background: "rgba(255,255,255,0.1)",
                            color: "#ffffff",
                            border: "1px solid rgba(255,255,255,0.12)",
                          }
                        : {
                            background: `${color}18`,
                            color,
                            border: `1px solid ${color}30`,
                          }
                      : {
                          background: "transparent",
                          color: "rgba(255,255,255,0.3)",
                          border: "1px solid transparent",
                        }
                  }
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative shrink-0">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "rgba(255,255,255,0.25)" }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="text-white text-xs rounded-xl pl-8 pr-4 py-2 outline-none transition-all duration-150 w-44"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                caretColor: "#ff6b00",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,107,0,0.35)";
                e.currentTarget.style.background = "rgba(255,107,0,0.03)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              }}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                {["Article", "Catégorie", "Statut", "Date", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest whitespace-nowrap"
                      style={{ color: "rgba(255,255,255,0.2)" }}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <RefreshCw
                        size={20}
                        className="animate-spin"
                        style={{ color: "rgba(255,107,0,0.5)" }}
                      />
                      <span
                        className="text-xs"
                        style={{ color: "rgba(255,255,255,0.2)" }}
                      >
                        Chargement…
                      </span>
                    </div>
                  </td>
                </tr>
              ) : articles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <Newspaper
                      size={28}
                      className="mx-auto mb-3"
                      style={{ color: "rgba(255,255,255,0.1)" }}
                    />
                    <p
                      className="text-sm font-medium"
                      style={{ color: "rgba(255,255,255,0.3)" }}
                    >
                      Aucun article trouvé.
                    </p>
                    <p
                      className="text-xs mt-1"
                      style={{ color: "rgba(255,255,255,0.15)" }}
                    >
                      Créez votre premier article ou modifiez les filtres.
                    </p>
                  </td>
                </tr>
              ) : (
                articles.map((item) => {
                  const statusCfg = STATUS_CFG[item.status] ?? {
                    label: item.status,
                    dot: "#6b7280",
                  };
                  const catName = item.category?.name ?? item.category ?? "—";
                  const thumbnail =
                    item.featured_image ?? item.thumbnail ?? null;
                  return (
                    <tr
                      key={item.id}
                      className="group transition-colors duration-100"
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.015)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      {/* Article */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {/* Thumbnail */}
                          <div
                            className="w-14 h-10 rounded-lg shrink-0 overflow-hidden"
                            style={{ background: "rgba(255,255,255,0.06)" }}
                          >
                            {thumbnail ? (
                              <img
                                src={thumbnail}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Newspaper
                                  size={14}
                                  style={{ color: "rgba(255,255,255,0.15)" }}
                                />
                              </div>
                            )}
                          </div>
                          {/* Text */}
                          <div className="min-w-0">
                            <p className="text-white font-semibold text-[13px] truncate max-w-55 leading-tight">
                              {item.title ?? "—"}
                            </p>
                            <p
                              className="text-[11px] mt-0.5 truncate max-w-55 leading-tight"
                              style={{ color: "rgba(255,255,255,0.25)" }}
                            >
                              {item.excerpt ??
                                (item.content ?? "").slice(0, 80)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span
                          className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold"
                          style={{
                            background: "rgba(255,255,255,0.06)",
                            color: "rgba(255,255,255,0.6)",
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}
                        >
                          {catName}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span
                          className="inline-flex items-center gap-1.5 text-[11px] font-semibold"
                          style={{ color: statusCfg.dot }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{
                              background: statusCfg.dot,
                              boxShadow: `0 0 5px ${statusCfg.dot}`,
                            }}
                          />
                          {statusCfg.label}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <p
                          className="text-[12px] font-medium"
                          style={{ color: "rgba(255,255,255,0.55)" }}
                        >
                          {relativeTime(item.created_at)}
                        </p>
                        <p
                          className="text-[10px] mt-0.5"
                          style={{ color: "rgba(255,255,255,0.2)" }}
                        >
                          {timeStr(item.created_at)}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <Link
                            to={`/admin/articles/${item.id}/edit`}
                            className="w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-100"
                            style={{
                              background: "rgba(255,255,255,0.05)",
                              color: "rgba(255,255,255,0.35)",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background =
                                "rgba(96,165,250,0.12)";
                              e.currentTarget.style.color = "#60a5fa";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background =
                                "rgba(255,255,255,0.05)";
                              e.currentTarget.style.color =
                                "rgba(255,255,255,0.35)";
                            }}
                          >
                            <Pencil size={12} />
                          </Link>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-100"
                            style={{
                              background: "rgba(255,255,255,0.05)",
                              color: "rgba(255,255,255,0.35)",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background =
                                "rgba(248,113,113,0.12)";
                              e.currentTarget.style.color = "#f87171";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background =
                                "rgba(255,255,255,0.05)";
                              e.currentTarget.style.color =
                                "rgba(255,255,255,0.35)";
                            }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div
          className="px-5 py-3 flex items-center justify-between"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <span
            className="text-[11px]"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            Page <span className="text-white font-semibold">{page}</span> sur{" "}
            <span className="text-white font-semibold">{totalPages || 1}</span>{" "}
            ({fmtNum(totalCount)} articles)
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-7 h-7 flex items-center justify-center rounded-lg transition-all disabled:opacity-25"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              <ChevronLeft size={13} />
            </button>

            {Array.from(
              { length: Math.min(totalPages, 5) },
              (_, i) => i + 1,
            ).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className="w-7 h-7 text-[11px] font-bold rounded-lg transition-all"
                style={
                  page === p
                    ? {
                        background: "linear-gradient(135deg, #ff6b00, #cc4400)",
                        color: "#fff",
                        boxShadow: "0 0 10px rgba(255,107,0,0.35)",
                      }
                    : {
                        color: "rgba(255,255,255,0.3)",
                        background: "transparent",
                      }
                }
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="w-7 h-7 flex items-center justify-center rounded-lg transition-all disabled:opacity-25"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
