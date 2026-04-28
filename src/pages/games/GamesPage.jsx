import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Flame } from "lucide-react";
import AnticipatedGamesAdmin from "../admin/AnticipatedGamesAdmin";
import PopularGamesAdmin from "../admin/PopularGamesAdmin";

const TABS = [
  { key: "anticipated", label: "Jeux attendus", icon: Sparkles, color: "#FF6B00" },
  { key: "popular",     label: "Jeux populaires", icon: Flame,    color: "#4ade80" },
];

export default function GamesPage() {
  const [tab, setTab] = useState("anticipated");

  return (
    <div className="space-y-5">
      {/* Tab toggle */}
      <div style={{ display: "flex", gap: 6, padding: "4px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, width: "fit-content" }}>
        {TABS.map(({ key, label, icon: Icon, color }) => {
          const active = tab === key;
          return (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "8px 18px", borderRadius: 8, border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: 800, letterSpacing: "0.02em",
                transition: "all 0.18s ease",
                background: active ? `rgba(${color === "#FF6B00" ? "255,107,0" : "74,222,128"},0.14)` : "transparent",
                color: active ? color : "rgba(255,255,255,0.35)",
                boxShadow: active ? `0 0 0 1px ${color}40` : "none",
              }}
            >
              <Icon size={14} strokeWidth={2.5} />
              {label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        >
          {tab === "anticipated" ? <AnticipatedGamesAdmin /> : <PopularGamesAdmin />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
