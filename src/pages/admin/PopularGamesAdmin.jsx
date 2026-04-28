import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, X, ChevronUp, ChevronDown, Search, Pencil, Trash2,
  Gamepad2, Flame, Star, ExternalLink, TrendingUp, Users,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

/* ─── helpers ─────────────────────────────────────────────── */
function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "").replace(/--+/g, "-");
}

const GENRES = ["RPG", "FPS", "Action", "Aventure", "Sport", "MMORPG", "Stratégie", "Simulation", "Horreur", "Plateforme", "Battle Royale", "Autre"];
const PLATFORMS = ["PC", "PS5", "Xbox Series", "Nintendo Switch", "iOS", "Android"];

/* ─── Podium RankBadge ──────────────────────────────────────── */
const PODIUM_COLORS = {
  1: { bg: "linear-gradient(135deg,#FFD700,#FFA500)", border: "rgba(255,215,0,0.7)", glow: "rgba(255,215,0,0.55)", text: "#111" },
  2: { bg: "linear-gradient(135deg,#C0C0C0,#909090)", border: "rgba(192,192,192,0.6)", glow: "rgba(192,192,192,0.4)", text: "#111" },
  3: { bg: "linear-gradient(135deg,#CD7F32,#8B4513)", border: "rgba(205,127,50,0.6)", glow: "rgba(205,127,50,0.4)", text: "#fff" },
};

function RankBadge({ rank, onUp, onDown, isFirst, isLast }) {
  const [hovered, setHovered] = useState(false);
  const [pulse, setPulse] = useState(null);
  const pod = PODIUM_COLORS[rank];

  const fire = (dir, fn) => { setPulse(dir); fn(); setTimeout(() => setPulse(null), 350); };

  return (
    <div className="flex flex-col items-center gap-0.5 select-none" style={{ width: 56 }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <button disabled={isFirst} onClick={() => fire("up", onUp)}
        style={{ width: 24, height: 20, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 5, border: "none", cursor: isFirst ? "default" : "pointer", background: hovered && !isFirst ? "rgba(255,107,0,0.18)" : "transparent", color: hovered && !isFirst ? "#FF6B00" : "transparent", transition: "all 0.15s" }}>
        <ChevronUp size={13} strokeWidth={3} />
      </button>
      {rank === 1 && <div style={{ fontSize: 12, lineHeight: 1, marginBottom: -2, transform: pulse ? "scale(1.4)" : "scale(1)", transition: "transform 0.2s" }}>👑</div>}
      <div style={{
        width: rank <= 3 ? 42 : 36, height: rank <= 3 ? 42 : 36, borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        background: pod ? pod.bg : "linear-gradient(135deg, rgba(255,107,0,0.25), rgba(255,107,0,0.08))",
        border: `${rank <= 3 ? 2 : 1}px solid ${pod ? pod.border : "rgba(255,107,0,0.3)"}`,
        boxShadow: hovered ? `0 0 20px ${pod ? pod.glow : "rgba(255,107,0,0.35)"}, inset 0 1px 0 rgba(255,255,255,0.2)` : pod ? `0 0 10px ${pod.glow}` : "none",
        transform: pulse === "up" ? "translateY(-5px) scale(1.18)" : pulse === "down" ? "translateY(5px) scale(1.18)" : "scale(1)",
        transition: "transform 0.25s cubic-bezier(0.16,1,0.3,1), box-shadow 0.2s",
        fontWeight: 900, fontSize: rank <= 3 ? 17 : 14, color: pod ? pod.text : "#FF6B00",
      }}>
        {rank}
      </div>
      <button disabled={isLast} onClick={() => fire("down", onDown)}
        style={{ width: 24, height: 20, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 5, border: "none", cursor: isLast ? "default" : "pointer", background: hovered && !isLast ? "rgba(255,107,0,0.18)" : "transparent", color: hovered && !isLast ? "#FF6B00" : "transparent", transition: "all 0.15s" }}>
        <ChevronDown size={13} strokeWidth={3} />
      </button>
    </div>
  );
}

/* ─── Popularity bar ─────────────────────────────────────────── */
function PopularityBar({ score }) {
  const pct = Math.min(100, Math.max(0, score ?? 0));
  const color = pct >= 80 ? "#4ade80" : pct >= 50 ? "#FF6B00" : "#60a5fa";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 90 }}>
      <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.07)", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 4, transition: "width 0.4s ease", boxShadow: `0 0 6px ${color}` }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 800, color, minWidth: 28, textAlign: "right" }}>{pct}</span>
    </div>
  );
}

/* ─── GameForm ──────────────────────────────────────────────── */
const EMPTY_GAME = {
  title: "", slug: "", genre: "", platforms: [], developer: "", publisher: "",
  release_date: "", cover_image: "", description: "", trailer_url: "",
  popularity_score: 75, player_count: "", metacritic: "", rating: 4.0,
};

const inputStyle = {
  width: "100%", padding: "10px 13px", background: "#111111",
  border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff", fontSize: 13, outline: "none",
  caretColor: "#FF6B00", transition: "border-color .15s, box-shadow .15s",
};

function Field({ label, children }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

function GameForm({ editData, onClose, onSaved }) {
  const [form, setForm] = useState(editData ?? EMPTY_GAME);
  const [saving, setSaving] = useState(false);
  const PANEL_W = 540;

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v, ...(k === "title" && !editData ? { slug: slugify(v) } : {}) }));

  const togglePlatform = (p) => setForm((f) => ({
    ...f, platforms: f.platforms.includes(p) ? f.platforms.filter((x) => x !== p) : [...f.platforms, p],
  }));

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("Le titre est requis"); return; }
    setSaving(true);
    try {
      await onSaved(form);
    } finally {
      setSaving(false);
    }
  };

  const onFocus = (e) => { e.target.style.borderColor = "rgba(255,107,0,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(255,107,0,0.07)"; };
  const onBlur = (e) => { e.target.style.borderColor = "#2a2a2a"; e.target.style.boxShadow = "none"; };

  return (
    <AnimatePresence>
      <motion.div key="bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
        onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 40, backdropFilter: "blur(4px)" }} />
      <motion.div key="pn" initial={{ x: -PANEL_W, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -PANEL_W, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: "fixed", top: 0, left: 0, bottom: 0, width: PANEL_W, background: "#161618", borderRight: "1px solid rgba(255,255,255,0.07)", boxShadow: "8px 0 40px rgba(0,0,0,0.6)", zIndex: 50, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ background: "#1a1a1c", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
          <div style={{ width: 3, alignSelf: "stretch", borderRadius: "0 2px 2px 0", background: "linear-gradient(180deg,#22c55e,rgba(34,197,94,0.3))" }} />
          <div className="flex-1 min-w-0">
            <p style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>{editData ? "Modifier le jeu" : "Ajouter un jeu populaire"}</p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>Les jeux les plus joués de la communauté</p>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px", display: "flex", flexDirection: "column", gap: 18 }}>
          {form.cover_image && (
            <div style={{ width: "100%", height: 140, borderRadius: 10, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
              <img src={form.cover_image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}

          <Field label="Titre *">
            <input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Ex: Fortnite" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
          </Field>

          <Field label="Slug (URL)">
            <input value={form.slug} onChange={(e) => set("slug", slugify(e.target.value))} placeholder="fortnite" style={{ ...inputStyle, fontFamily: "monospace", color: "#ff6b00" }} onFocus={onFocus} onBlur={onBlur} />
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Genre">
              <select value={form.genre} onChange={(e) => set("genre", e.target.value)} style={{ ...inputStyle, appearance: "none" }} onFocus={onFocus} onBlur={onBlur}>
                <option value="">Sélectionner…</option>
                {GENRES.map((g) => <option key={g}>{g}</option>)}
              </select>
            </Field>
            <Field label="Note Metacritic (0–100)">
              <input type="number" min={0} max={100} value={form.metacritic} onChange={(e) => set("metacritic", e.target.value)} placeholder="92" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
            </Field>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Développeur">
              <input value={form.developer} onChange={(e) => set("developer", e.target.value)} placeholder="Epic Games" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
            </Field>
            <Field label="Éditeur">
              <input value={form.publisher} onChange={(e) => set("publisher", e.target.value)} placeholder="Epic Games" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
            </Field>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Joueurs actifs (ex: 4.5M)">
              <input value={form.player_count} onChange={(e) => set("player_count", e.target.value)} placeholder="4 500 000" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
            </Field>
            <Field label="Note communauté (0–5)">
              <input type="number" min={0} max={5} step={0.1} value={form.rating} onChange={(e) => set("rating", parseFloat(e.target.value))} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
            </Field>
          </div>

          <Field label={`Score de popularité: ${form.popularity_score}/100`}>
            <input type="range" min={0} max={100} value={form.popularity_score} onChange={(e) => set("popularity_score", Number(e.target.value))} style={{ width: "100%", accentColor: "#22c55e", marginTop: 4 }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>
              <span>Peu connu</span><span>Viral</span>
            </div>
          </Field>

          <Field label="Plateformes">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
              {PLATFORMS.map((p) => {
                const active = form.platforms.includes(p);
                return (
                  <button key={p} type="button" onClick={() => togglePlatform(p)}
                    style={{ padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer", background: active ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.05)", border: active ? "1px solid rgba(34,197,94,0.35)" : "1px solid rgba(255,255,255,0.1)", color: active ? "#22c55e" : "rgba(255,255,255,0.35)", transition: "all 0.15s" }}>
                    {p}
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="URL Image de couverture">
            <input value={form.cover_image} onChange={(e) => set("cover_image", e.target.value)} placeholder="https://..." style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
          </Field>

          <Field label="Date de sortie">
            <input type="date" value={form.release_date} onChange={(e) => set("release_date", e.target.value)} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
          </Field>

          <Field label="URL Trailer">
            <input value={form.trailer_url} onChange={(e) => set("trailer_url", e.target.value)} placeholder="https://youtube.com/..." style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
          </Field>

          <Field label="Description">
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Présentation du jeu…" rows={4}
              style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit", lineHeight: 1.5 }} onFocus={onFocus} onBlur={onBlur} />
          </Field>
        </div>

        {/* Footer */}
        <div style={{ background: "#1a1a1c", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "12px 20px", display: "flex", gap: 10, flexShrink: 0 }}>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 py-3 text-[13px] font-black text-white tracking-wide"
            style={{ background: "linear-gradient(135deg,#22c55e 0%,#16a34a 100%)", boxShadow: "0 6px 0 #14532d,0 8px 16px rgba(34,197,94,0.35),inset 0 1px 0 rgba(255,255,255,0.18)", transform: "translateY(-3px)", transition: "transform 0.08s,box-shadow 0.08s", borderRadius: 8, border: "none", cursor: saving ? "not-allowed" : "pointer" }}
            onMouseEnter={(e) => { if (!saving) { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 8px 0 #14532d,0 12px 24px rgba(34,197,94,0.45),inset 0 1px 0 rgba(255,255,255,0.18)"; } }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 6px 0 #14532d,0 8px 16px rgba(34,197,94,0.35),inset 0 1px 0 rgba(255,255,255,0.18)"; }}
            onMouseDown={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 0 #14532d,0 4px 8px rgba(34,197,94,0.2)"; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 6px 0 #14532d,0 8px 16px rgba(34,197,94,0.35),inset 0 1px 0 rgba(255,255,255,0.18)"; }}
          >
            {saving && <span style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid #fff", borderTopColor: "transparent", display: "inline-block", animation: "spin 0.7s linear infinite" }} />}
            {saving ? "Enregistrement…" : editData ? "Mettre à jour" : "Ajouter le jeu"}
          </button>
          <button onClick={onClose} style={{ padding: "10px 20px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
            Annuler
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function ActionBtn({ icon, hoverColor, hoverText, onClick }) {
  return (
    <button onClick={onClick}
      style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.35)", border: "none", cursor: "pointer" }}
      onMouseEnter={(e) => { e.currentTarget.style.background = hoverColor; e.currentTarget.style.color = hoverText; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(255,255,255,0.35)"; }}
    >{icon}</button>
  );
}

/* ─── Main page ─────────────────────────────────────────────── */
export default function PopularGamesAdmin() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [formState, setFormState] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [rowHover, setRowHover] = useState(null);

  const fetchGames = () => {
    setLoading(true);
    api.get("/games/", { params: { game_type: "popular", page_size: 100 } })
      .then(({ data }) => setGames(data.results ?? data))
      .catch(() => toast.error("Erreur de chargement"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchGames(); }, []);

  const filtered = games.filter((g) =>
    g.title.toLowerCase().includes(search.toLowerCase()) ||
    (g.genre ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const moveRank = async (idx, dir) => {
    const list = [...games];
    const target = dir === "up" ? idx - 1 : idx + 1;
    if (target < 0 || target >= list.length) return;
    const gameA = list[idx];
    const gameB = list[target];
    [list[idx], list[target]] = [list[target], list[idx]];
    setGames(list);
    try {
      await Promise.all([
        api.patch(`/games/${gameA.id}/`, { rank: gameB.rank }),
        api.patch(`/games/${gameB.id}/`, { rank: gameA.rank }),
      ]);
    } catch {
      setGames([...games]);
      toast.error("Erreur de tri");
    }
  };

  const handleSaved = async (data) => {
    const payload = {
      ...data,
      game_type: "popular",
      release_date: data.release_date || null,
      metacritic: data.metacritic !== "" ? Number(data.metacritic) : null,
      rating: data.rating !== "" ? Number(data.rating) : null,
    };
    try {
      if (formState.editData) {
        await api.patch(`/games/${formState.editData.id}/`, payload);
        toast.success("Jeu mis à jour !");
      } else {
        await api.post("/games/", payload);
        toast.success("Jeu ajouté !");
      }
      setFormState(null);
      fetchGames();
    } catch (err) {
      const detail = err?.response?.data;
      const msg = typeof detail === "string"
        ? detail
        : detail?.detail ?? detail?.title?.[0] ?? detail?.slug?.[0] ?? "Erreur lors de l'enregistrement";
      toast.error(msg);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/games/${id}/`);
      setGames((prev) => prev.filter((g) => g.id !== id));
      toast.success("Jeu supprimé");
      setDeleteId(null);
    } catch {
      toast.error("Erreur de suppression");
    }
  };

  return (
    <div className="space-y-5">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[38px] font-black uppercase tracking-tighter text-white leading-none">
            Jeux les plus <span style={{ color: "#4ade80" }}>populaires</span>
          </h1>
          <p className="text-[12px] uppercase tracking-widest mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
            {games.length} jeu{games.length !== 1 ? "x" : ""} dans le classement
          </p>
        </div>
        <button
          onClick={() => setFormState({ editData: null })}
          className="flex items-center gap-2 px-4 py-3 text-[13px] font-black text-white tracking-wide shrink-0"
          style={{ background: "linear-gradient(135deg,#22c55e 0%,#16a34a 100%)", boxShadow: "0 6px 0 #14532d,0 8px 16px rgba(34,197,94,0.35),inset 0 1px 0 rgba(255,255,255,0.18)", transform: "translateY(-3px)", transition: "transform 0.08s,box-shadow 0.08s", borderRadius: 8, border: "none", cursor: "pointer" }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 8px 0 #14532d,0 12px 24px rgba(34,197,94,0.45),inset 0 1px 0 rgba(255,255,255,0.18)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 6px 0 #14532d,0 8px 16px rgba(34,197,94,0.35),inset 0 1px 0 rgba(255,255,255,0.18)"; }}
          onMouseDown={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 0 #14532d,0 4px 8px rgba(34,197,94,0.2)"; }}
          onMouseUp={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 6px 0 #14532d,0 8px 16px rgba(34,197,94,0.35),inset 0 1px 0 rgba(255,255,255,0.18)"; }}
        >
          <Plus size={15} strokeWidth={3} /> Ajouter un jeu
        </button>
      </div>

      {/* ── Filter bar ─────────────────────────────────────── */}
      <div className="overflow-hidden" style={{ background: "linear-gradient(160deg,#161618,#111113)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ height: "1px", background: "linear-gradient(90deg,rgba(74,222,128,0.6),rgba(74,222,128,0) 60%)" }} />
        <div className="flex items-center gap-3 px-4 py-3">
          <Search size={14} style={{ color: "rgba(255,255,255,0.25)", flexShrink: 0 }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un jeu, genre…"
            className="flex-1 bg-transparent text-white text-sm outline-none" style={{ caretColor: "#4ade80" }} />
          {search && <button onClick={() => setSearch("")} style={{ color: "rgba(255,255,255,0.3)", background: "none", border: "none", cursor: "pointer" }}><X size={14} /></button>}
        </div>
      </div>

      {/* ── Ranking hint ───────────────────────────────────── */}
      <div className="flex items-center gap-2" style={{ color: "rgba(255,255,255,0.2)", fontSize: 11 }}>
        <TrendingUp size={12} />
        <span>Survolez le rang pour réorganiser · La barre de popularité reflète le score</span>
      </div>

      {/* ── Games list ─────────────────────────────────────── */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div style={{ width: 28, height: 28, borderRadius: "50%", border: "2.5px solid #4ade80", borderTopColor: "transparent", animation: "spin 0.7s linear infinite" }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl flex flex-col items-center justify-center py-24 gap-4"
          style={{ background: "linear-gradient(160deg,#161618,#111113)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <Flame size={40} style={{ color: "rgba(255,255,255,0.07)" }} />
          <p className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.2)" }}>
            {search ? "Aucun résultat" : "Aucun jeu populaire pour l'instant"}
          </p>
          <button onClick={() => setFormState({ editData: null })}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold"
            style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)", color: "#4ade80" }}>
            <Plus size={14} /> Ajouter le premier jeu
          </button>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(160deg,#161618,#111113)", border: "1px solid rgba(255,255,255,0.07)" }}>
          {/* Column headers */}
          <div style={{ display: "grid", gridTemplateColumns: "56px 56px 1fr 110px 140px 70px 80px", alignItems: "center", height: 40, background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 16px", gap: 12 }}>
            {["#", "", "Jeu", "Genre", "Popularité", "Note", "Actions"].map((h) => (
              <span key={h} style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.22)" }}>{h}</span>
            ))}
          </div>

          {/* Rows */}
          {filtered.map((game, idx) => {
            const globalIdx = games.findIndex((g) => g.id === game.id);
            const hovered = rowHover === game.id;
            return (
              <motion.div key={game.id} layout transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                style={{ display: "grid", gridTemplateColumns: "56px 56px 1fr 110px 140px 70px 80px", alignItems: "center", padding: "10px 16px", gap: 12, borderBottom: "1px solid rgba(255,255,255,0.04)", background: hovered ? "rgba(255,255,255,0.02)" : "transparent", position: "relative", transition: "background 0.1s" }}
                onMouseEnter={() => setRowHover(game.id)} onMouseLeave={() => setRowHover(null)}>
                <div style={{ position: "absolute", left: 0, top: 8, bottom: 8, width: 3, borderRadius: "0 2px 2px 0", background: hovered ? "rgba(74,222,128,0.35)" : "transparent", transition: "background .12s" }} />

                <RankBadge rank={globalIdx + 1} onUp={() => moveRank(globalIdx, "up")} onDown={() => moveRank(globalIdx, "down")} isFirst={globalIdx === 0} isLast={globalIdx === games.length - 1} />

                <div style={{ width: 44, height: 44, borderRadius: 8, overflow: "hidden", background: "rgba(255,255,255,0.06)", flexShrink: 0 }}>
                  {game.cover_image ? <img src={game.cover_image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><Gamepad2 size={18} style={{ color: "rgba(255,255,255,0.15)" }} /></div>}
                </div>

                <div className="min-w-0">
                  <p className="font-bold text-[13px] text-white truncate">{game.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {game.developer && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{game.developer}</span>}
                    {game.player_count && (
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#4ade80", background: "rgba(74,222,128,0.1)", padding: "1px 6px", borderRadius: 10, border: "1px solid rgba(74,222,128,0.2)" }}>
                        <Users size={9} style={{ display: "inline", marginRight: 2 }} />{game.player_count}
                      </span>
                    )}
                  </div>
                </div>

                <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.55)", background: "rgba(255,255,255,0.05)", padding: "3px 8px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.07)", whiteSpace: "nowrap" }}>
                  {game.genre || "—"}
                </span>

                <PopularityBar score={game.popularity_score} />

                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {game.rating != null && (
                    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                      <Star size={10} style={{ color: "#facc15", fill: "#facc15" }} />
                      <span style={{ fontSize: 12, fontWeight: 800, color: "#facc15" }}>{Number(game.rating).toFixed(1)}</span>
                    </div>
                  )}
                  {game.metacritic && (
                    <span style={{ fontSize: 10, fontWeight: 800, color: game.metacritic >= 80 ? "#4ade80" : game.metacritic >= 60 ? "#facc15" : "#f87171", background: "rgba(255,255,255,0.05)", padding: "1px 5px", borderRadius: 4, border: "1px solid rgba(255,255,255,0.08)" }}>
                      MC {game.metacritic}
                    </span>
                  )}
                </div>

                <div style={{ display: "flex", gap: 6 }}>
                  <ActionBtn icon={<Pencil size={12} />} hoverColor="rgba(96,165,250,0.12)" hoverText="#60a5fa" onClick={() => setFormState({ editData: game })} />
                  <ActionBtn icon={<Trash2 size={12} />} hoverColor="rgba(248,113,113,0.12)" hoverText="#f87171" onClick={() => setDeleteId(game.id)} />
                  {game.trailer_url && <ActionBtn icon={<ExternalLink size={12} />} hoverColor="rgba(74,222,128,0.12)" hoverText="#4ade80" onClick={() => window.open(game.trailer_url, "_blank")} />}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── Delete confirmation ─────────────────────────────── */}
      <AnimatePresence>
        {deleteId && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 60, backdropFilter: "blur(4px)" }}
              onClick={() => setDeleteId(null)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 70, background: "#161618", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 28, width: 360, boxShadow: "0 24px 60px rgba(0,0,0,0.6)" }}>
              <p className="text-white font-black text-lg mb-2">Supprimer ce jeu ?</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginBottom: 20 }}>Cette action est irréversible.</p>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => handleDelete(deleteId)} style={{ flex: 1, padding: "10px 0", borderRadius: 8, background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.35)", color: "#f87171", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Supprimer</button>
                <button onClick={() => setDeleteId(null)} style={{ flex: 1, padding: "10px 0", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Annuler</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Game form drawer ────────────────────────────────── */}
      <AnimatePresence>
        {formState && (
          <GameForm key="form" editData={formState.editData} onClose={() => setFormState(null)} onSaved={handleSaved} />
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
