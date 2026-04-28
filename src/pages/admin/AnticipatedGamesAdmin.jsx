import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, X, ChevronUp, ChevronDown, Search, Pencil, Trash2,
  Gamepad2, Calendar, Star, Globe, Monitor, Smartphone,
  GripVertical, Sparkles, Clock, ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

/* ─── helpers ─────────────────────────────────────────────── */
function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "").replace(/--+/g, "-");
}

const GENRES = ["RPG", "FPS", "Action", "Aventure", "Sport", "MMORPG", "Stratégie", "Simulation", "Horreur", "Plateforme", "Battle Royale", "Autre"];
const PLATFORMS = ["PC", "PS5", "Xbox Series", "Nintendo Switch", "iOS", "Android"];
const STATUSES = [
  { key: "coming_soon", label: "Bientôt", color: "#60a5fa" },
  { key: "tba", label: "TBA", color: "#facc15" },
  { key: "released", label: "Sorti", color: "#4ade80" },
];

/* ─── RankBadge with up/down controls ──────────────────────── */
function RankBadge({ rank, onUp, onDown, isFirst, isLast }) {
  const [hovered, setHovered] = useState(false);
  const [bumped, setBumped] = useState(null);

  const fire = (dir, fn) => {
    setBumped(dir);
    fn();
    setTimeout(() => setBumped(null), 300);
  };

  return (
    <div
      className="flex flex-col items-center justify-center gap-0.5 select-none"
      style={{ width: 52 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        disabled={isFirst}
        onClick={() => fire("up", onUp)}
        className="w-6 h-5 flex items-center justify-center rounded transition-all disabled:opacity-0"
        style={{ opacity: hovered && !isFirst ? 1 : 0, background: "rgba(255,107,0,0.15)", color: "#ff6b00", transition: "opacity 0.15s, background 0.1s" }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,107,0,0.3)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,107,0,0.15)"; }}
      >
        <ChevronUp size={12} strokeWidth={3} />
      </button>
      <div
        style={{
          width: 36, height: 36, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: rank <= 3
            ? `linear-gradient(135deg, ${rank === 1 ? "#FFD700" : rank === 2 ? "#C0C0C0" : "#CD7F32"}, ${rank === 1 ? "#FFA500" : rank === 2 ? "#A0A0A0" : "#A0522D"})`
            : "linear-gradient(135deg, rgba(255,107,0,0.25), rgba(255,107,0,0.08))",
          border: rank <= 3
            ? `2px solid ${rank === 1 ? "rgba(255,215,0,0.6)" : rank === 2 ? "rgba(192,192,192,0.5)" : "rgba(205,127,50,0.5)"}`
            : "1px solid rgba(255,107,0,0.3)",
          boxShadow: hovered ? "0 0 14px rgba(255,107,0,0.35)" : bumped ? "0 0 20px rgba(255,107,0,0.5)" : "none",
          transform: bumped === "up" ? "translateY(-4px) scale(1.15)" : bumped === "down" ? "translateY(4px) scale(1.15)" : "scale(1)",
          transition: "transform 0.2s, box-shadow 0.2s",
          fontWeight: 900, fontSize: 15,
          color: rank <= 3 ? "#111" : "#ff6b00",
        }}
      >
        {rank}
      </div>
      <button
        disabled={isLast}
        onClick={() => fire("down", onDown)}
        className="w-6 h-5 flex items-center justify-center rounded transition-all disabled:opacity-0"
        style={{ opacity: hovered && !isLast ? 1 : 0, background: "rgba(255,107,0,0.15)", color: "#ff6b00", transition: "opacity 0.15s, background 0.1s" }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,107,0,0.3)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,107,0,0.15)"; }}
      >
        <ChevronDown size={12} strokeWidth={3} />
      </button>
    </div>
  );
}

/* ─── GameForm drawer ───────────────────────────────────────── */
const EMPTY_GAME = {
  title: "", slug: "", genre: "", platforms: [], developer: "",
  publisher: "", release_date: "", cover_image: "", description: "",
  trailer_url: "", status: "coming_soon", hype_score: 80,
};

const inputStyle = {
  width: "100%", padding: "10px 13px",
  background: "#111111", border: "1px solid #2a2a2a",
  borderRadius: 8, color: "#fff", fontSize: 13, outline: "none",
  caretColor: "#FF6B00", transition: "border-color .15s, box-shadow .15s",
};

function GameForm({ editData, onClose, onSaved }) {
  const [form, setForm] = useState(editData ?? EMPTY_GAME);
  const [saving, setSaving] = useState(false);
  const PANEL_W = 520;

  const set = (k, v) => setForm((f) => ({
    ...f, [k]: v,
    ...(k === "title" && !editData ? { slug: slugify(v) } : {}),
  }));

  const togglePlatform = (p) => {
    setForm((f) => ({
      ...f,
      platforms: f.platforms.includes(p)
        ? f.platforms.filter((x) => x !== p)
        : [...f.platforms, p],
    }));
  };

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
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 40, backdropFilter: "blur(4px)" }}
      />
      <motion.div
        key="panel"
        initial={{ x: -PANEL_W, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -PANEL_W, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "fixed", top: 0, left: 0, bottom: 0, width: PANEL_W,
          background: "#161618", borderRight: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "8px 0 40px rgba(0,0,0,0.6)", zIndex: 50, display: "flex", flexDirection: "column",
        }}
      >
        {/* Header */}
        <div style={{ background: "#1a1a1c", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
          <div style={{ width: 3, alignSelf: "stretch", borderRadius: "0 2px 2px 0", background: "linear-gradient(180deg, #FF6B00, rgba(255,107,0,0.3))" }} />
          <div className="flex-1 min-w-0">
            <p style={{ fontSize: 15, fontWeight: 800, color: "#fff", margin: 0 }}>{editData ? "Modifier le jeu" : "Ajouter un jeu attendu"}</p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>Les jeux les plus attendus de la communauté</p>
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
            <input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Ex: Grand Theft Auto VI" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
          </Field>

          <Field label="Slug (URL)">
            <input value={form.slug} onChange={(e) => set("slug", slugify(e.target.value))} placeholder="grand-theft-auto-vi" style={{ ...inputStyle, fontFamily: "monospace", color: "#ff6b00" }} onFocus={onFocus} onBlur={onBlur} />
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Genre">
              <select value={form.genre} onChange={(e) => set("genre", e.target.value)} style={{ ...inputStyle, appearance: "none" }} onFocus={onFocus} onBlur={onBlur}>
                <option value="">Sélectionner…</option>
                {GENRES.map((g) => <option key={g}>{g}</option>)}
              </select>
            </Field>
            <Field label="Statut">
              <select value={form.status} onChange={(e) => set("status", e.target.value)} style={{ ...inputStyle, appearance: "none" }} onFocus={onFocus} onBlur={onBlur}>
                {STATUSES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </Field>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Développeur">
              <input value={form.developer} onChange={(e) => set("developer", e.target.value)} placeholder="Rockstar Games" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
            </Field>
            <Field label="Éditeur">
              <input value={form.publisher} onChange={(e) => set("publisher", e.target.value)} placeholder="Take-Two" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
            </Field>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Date de sortie prévue">
              <input type="date" value={form.release_date} onChange={(e) => set("release_date", e.target.value)} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
            </Field>
            <Field label={`Score Hype: ${form.hype_score}/100`}>
              <div style={{ paddingTop: 6 }}>
                <input type="range" min={0} max={100} value={form.hype_score} onChange={(e) => set("hype_score", Number(e.target.value))} style={{ width: "100%", accentColor: "#FF6B00" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>
                  <span>0</span><span>50</span><span>100</span>
                </div>
              </div>
            </Field>
          </div>

          <Field label="Plateformes">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
              {PLATFORMS.map((p) => {
                const active = form.platforms.includes(p);
                return (
                  <button key={p} type="button" onClick={() => togglePlatform(p)}
                    style={{
                      padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer",
                      background: active ? "rgba(255,107,0,0.15)" : "rgba(255,255,255,0.05)",
                      border: active ? "1px solid rgba(255,107,0,0.4)" : "1px solid rgba(255,255,255,0.1)",
                      color: active ? "#FF6B00" : "rgba(255,255,255,0.35)", transition: "all 0.15s",
                    }}
                  >{p}</button>
                );
              })}
            </div>
          </Field>

          <Field label="URL Image de couverture">
            <input value={form.cover_image} onChange={(e) => set("cover_image", e.target.value)} placeholder="https://..." style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
          </Field>

          <Field label="URL Trailer (YouTube)">
            <input value={form.trailer_url} onChange={(e) => set("trailer_url", e.target.value)} placeholder="https://youtube.com/watch?v=..." style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
          </Field>

          <Field label="Description">
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Présentation du jeu…" rows={4}
              style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit", lineHeight: 1.5 }} onFocus={onFocus} onBlur={onBlur} />
          </Field>
        </div>

        {/* Footer */}
        <div style={{ background: "#1a1a1c", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "12px 20px", display: "flex", gap: 10, flexShrink: 0 }}>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 py-3 text-[13px] font-black text-white tracking-wide"
            style={{
              background: "linear-gradient(135deg, #FF6B00 0%, #e05500 100%)",
              boxShadow: "0 6px 0 #a33a00, 0 8px 16px rgba(255,107,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)",
              transform: "translateY(-3px)", transition: "transform 0.08s, box-shadow 0.08s", borderRadius: 8, border: "none", cursor: saving ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => { if (!saving) { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 8px 0 #a33a00, 0 12px 24px rgba(255,107,0,0.55), inset 0 1px 0 rgba(255,255,255,0.18)"; } }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 6px 0 #a33a00, 0 8px 16px rgba(255,107,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)"; }}
            onMouseDown={(e) => { e.currentTarget.style.transform = "translateY(0px)"; e.currentTarget.style.boxShadow = "0 2px 0 #a33a00, 0 4px 8px rgba(255,107,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)"; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 6px 0 #a33a00, 0 8px 16px rgba(255,107,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)"; }}
          >
            {saving ? <span style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid #fff", borderTopColor: "transparent", display: "inline-block", animation: "spin 0.7s linear infinite" }} /> : null}
            {saving ? "Enregistrement…" : editData ? "Mettre à jour" : "Ajouter le jeu"}
          </button>
          <button onClick={onClose} className="px-5 py-3 text-[13px] font-semibold rounded-lg"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", cursor: "pointer" }}>
            Annuler
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

/* ─── Status badge ──────────────────────────────────────────── */
function StatusPill({ status }) {
  const cfg = STATUSES.find((s) => s.key === status) ?? STATUSES[0];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 9px", borderRadius: 20,
      background: `${cfg.color}18`, border: `1px solid ${cfg.color}40`,
      color: cfg.color, fontSize: 11, fontWeight: 700,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor" }} />
      {cfg.label}
    </span>
  );
}

/* ─── Main page ─────────────────────────────────────────────── */
export default function AnticipatedGamesAdmin() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [formState, setFormState] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [rowHover, setRowHover] = useState(null);

  const fetchGames = () => {
    setLoading(true);
    api.get("/games/", { params: { game_type: "anticipated", page_size: 100 } })
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
      game_type: "anticipated",
      release_date: data.release_date || null,
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
            Jeux les plus <span className="text-orange">attendus</span>
          </h1>
          <p className="text-[12px] uppercase tracking-widest mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
            {games.length} jeu{games.length !== 1 ? "x" : ""} dans le classement
          </p>
        </div>
        <button
          onClick={() => setFormState({ editData: null })}
          className="flex items-center gap-2 px-4 py-3 text-[13px] font-black text-white tracking-wide shrink-0"
          style={{
            background: "linear-gradient(135deg, #FF6B00 0%, #e05500 100%)",
            boxShadow: "0 6px 0 #a33a00, 0 8px 16px rgba(255,107,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)",
            transform: "translateY(-3px)", transition: "transform 0.08s, box-shadow 0.08s", borderRadius: 8, border: "none", cursor: "pointer",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 8px 0 #a33a00, 0 12px 24px rgba(255,107,0,0.55), inset 0 1px 0 rgba(255,255,255,0.18)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 6px 0 #a33a00, 0 8px 16px rgba(255,107,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)"; }}
          onMouseDown={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 0 #a33a00, 0 4px 8px rgba(255,107,0,0.3)"; }}
          onMouseUp={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 6px 0 #a33a00, 0 8px 16px rgba(255,107,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)"; }}
        >
          <Plus size={15} strokeWidth={3} /> Ajouter un jeu
        </button>
      </div>

      {/* ── Filter bar ─────────────────────────────────────── */}
      <div className="overflow-hidden" style={{ background: "linear-gradient(160deg,#161618,#111113)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ height: "1px", background: "linear-gradient(90deg,rgba(255,107,0,0.6),rgba(255,107,0,0) 60%)" }} />
        <div className="flex items-center gap-3 px-4 py-3">
          <Search size={14} style={{ color: "rgba(255,255,255,0.25)", flexShrink: 0 }} />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un jeu, genre…"
            className="flex-1 bg-transparent text-white text-sm outline-none"
            style={{ caretColor: "#FF6B00", color: "rgba(255,255,255,0.9)" }}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{ color: "rgba(255,255,255,0.3)", background: "none", border: "none", cursor: "pointer" }}>
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ── Ranking hint ───────────────────────────────────── */}
      <div className="flex items-center gap-2" style={{ color: "rgba(255,255,255,0.2)", fontSize: 11 }}>
        <GripVertical size={12} />
        <span>Survolez le rang pour réorganiser · Les médailles indiquent le Top 3</span>
      </div>

      {/* ── Games list ─────────────────────────────────────── */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div style={{ width: 28, height: 28, borderRadius: "50%", border: "2.5px solid #FF6B00", borderTopColor: "transparent", animation: "spin 0.7s linear infinite" }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl flex flex-col items-center justify-center py-24 gap-4"
          style={{ background: "linear-gradient(160deg,#161618,#111113)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <Gamepad2 size={40} style={{ color: "rgba(255,255,255,0.07)" }} />
          <p className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.2)" }}>
            {search ? "Aucun résultat" : "Aucun jeu attendu pour l'instant"}
          </p>
          <button onClick={() => setFormState({ editData: null })}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold"
            style={{ background: "rgba(255,107,0,0.12)", border: "1px solid rgba(255,107,0,0.25)", color: "#FF6B00" }}>
            <Plus size={14} /> Ajouter le premier jeu
          </button>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(160deg,#161618,#111113)", border: "1px solid rgba(255,255,255,0.07)" }}>
          {/* Column headers */}
          <div style={{ display: "grid", gridTemplateColumns: "52px 56px 1fr 120px 100px 120px 80px", alignItems: "center", height: 40, background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 16px", gap: 12 }}>
            {["#", "", "Jeu", "Genre", "Plateformes", "Sortie", "Actions"].map((h) => (
              <span key={h} style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.22)" }}>{h}</span>
            ))}
          </div>

          {/* Rows */}
          {filtered.map((game, idx) => {
            const globalIdx = games.findIndex((g) => g.id === game.id);
            const hovered = rowHover === game.id;
            return (
              <motion.div
                key={game.id}
                layout
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  display: "grid", gridTemplateColumns: "52px 56px 1fr 120px 100px 120px 80px",
                  alignItems: "center", padding: "10px 16px", gap: 12,
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  background: hovered ? "rgba(255,255,255,0.02)" : "transparent",
                  position: "relative", transition: "background 0.1s",
                }}
                onMouseEnter={() => setRowHover(game.id)}
                onMouseLeave={() => setRowHover(null)}
              >
                <div style={{ position: "absolute", left: 0, top: 8, bottom: 8, width: 3, borderRadius: "0 2px 2px 0", background: hovered ? "rgba(255,107,0,0.35)" : "transparent", transition: "background .12s" }} />

                <RankBadge
                  rank={globalIdx + 1}
                  onUp={() => moveRank(globalIdx, "up")}
                  onDown={() => moveRank(globalIdx, "down")}
                  isFirst={globalIdx === 0}
                  isLast={globalIdx === games.length - 1}
                />

                <div style={{ width: 44, height: 44, borderRadius: 8, overflow: "hidden", background: "rgba(255,255,255,0.06)", flexShrink: 0 }}>
                  {game.cover_image
                    ? <img src={game.cover_image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><Gamepad2 size={18} style={{ color: "rgba(255,255,255,0.15)" }} /></div>
                  }
                </div>

                <div className="min-w-0">
                  <p className="font-bold text-[13px] text-white truncate">{game.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {game.developer && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{game.developer}</span>}
                    {game.hype_score != null && (
                      <span style={{ fontSize: 10, fontWeight: 800, color: "#FF6B00", background: "rgba(255,107,0,0.12)", padding: "1px 6px", borderRadius: 10, border: "1px solid rgba(255,107,0,0.2)" }}>
                        🔥 {game.hype_score}%
                      </span>
                    )}
                  </div>
                </div>

                <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.55)", background: "rgba(255,255,255,0.05)", padding: "3px 8px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.07)", whiteSpace: "nowrap" }}>
                  {game.genre || "—"}
                </span>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                  {(game.platforms ?? []).slice(0, 3).map((p) => (
                    <span key={p} style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.04)", padding: "2px 5px", borderRadius: 4, border: "1px solid rgba(255,255,255,0.07)" }}>{p}</span>
                  ))}
                  {(game.platforms ?? []).length > 3 && <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>+{game.platforms.length - 3}</span>}
                </div>

                <div>
                  <StatusPill status={game.status} />
                  {game.release_date && (
                    <p style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", marginTop: 3 }}>
                      {new Date(game.release_date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
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
          <GameForm
            key="form"
            editData={formState.editData}
            onClose={() => setFormState(null)}
            onSaved={handleSaved}
          />
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function ActionBtn({ icon, hoverColor, hoverText, onClick }) {
  return (
    <button onClick={onClick}
      className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
      style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.35)", border: "none", cursor: "pointer" }}
      onMouseEnter={(e) => { e.currentTarget.style.background = hoverColor; e.currentTarget.style.color = hoverText; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(255,255,255,0.35)"; }}
    >{icon}</button>
  );
}
