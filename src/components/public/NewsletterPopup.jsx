import { useState, useEffect } from "react";
import { X, CheckCircle, Flame } from "lucide-react";
import api from "../../api/axios";
import Button3D from "../Button3D";

const STORAGE_KEY = "gnewz_newsletter";

const HERO_IMG =
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80";

const PERKS = [
  "Breaking gaming news and exclusive previews",
  "In-depth reviews and hardware comparisons",
  "Esports results, tournaments and highlights",
  "Best deals on games and tech gear",
];

export default function NewsletterPopup({ forceOpen = false, onForceClose }) {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (forceOpen) {
      setVisible(true);
      setSuccess(false);
      setEmail("");
      setError("");
    }
  }, [forceOpen]);

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, "dismissed");
    setVisible(false);
    onForceClose?.();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) return;
    setLoading(true);
    try {
      await api.post("/newsletter/subscribe/", { email: email.trim() });
      setSuccess(true);
      localStorage.setItem(STORAGE_KEY, "subscribed");
      setTimeout(() => {
        setVisible(false);
        onForceClose?.();
      }, 3500);
    } catch (err) {
      setError(
        err?.response?.data?.error || "Failed to subscribe. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal — split layout */}
      <div
        className="relative  max-w-5xl flex overflow-hidden"
        style={{
          background: "#1a1a1a",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* ── Left — image panel ── */}
        <div className="relative hidden md:block w-[280px] shrink-0">
          <img
            src={HERO_IMG}
            alt="Gaming"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Dark overlay — heavier at bottom */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(160deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.72) 100%)",
            }}
          />
          {/* Left-side content */}
          <div className="relative h-full flex flex-col justify-between p-6">
            {/* Badge */}
            <div className="flex items-center gap-2">
              <Flame size={13} fill="var(--color-orange)" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">
                Free Newsletter
              </span>
            </div>

            {/* Bottom copy */}
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest mb-1 text-orange">
                Join 50 000+ gamers
              </p>
              <h3 className="text-white font-black text-[22px] uppercase leading-tight tracking-tight">
                Stay ahead of the game
              </h3>
              <p className="mt-2 text-[11px] leading-relaxed ">
                Daily news, reviews &amp; deals — straight to your inbox.
              </p>
            </div>
          </div>
        </div>

        {/* ── Right — form panel ── */}
        <div
          className="flex-1 min-w-0 flex flex-col"
          style={{ borderLeft: "1px solid #2e2e2e" }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: "1px solid #2e2e2e", background: "#161616" }}
          >
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-white">
                GNEWZ Newsletter
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: "#888" }}>
                Gaming &amp; Tech — delivered daily
              </p>
            </div>
            <button
              onClick={handleClose}
              className="w-7 h-7 flex items-center justify-center transition-colors duration-150"
              style={{ color: "#555" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ccc")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
            >
              <X size={15} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 px-6 py-6">
            {success ? (
              <div className="flex flex-col items-center justify-center h-full py-10 text-center">
                <div
                  className="w-14 h-14 flex items-center justify-center mb-4"
                  // style={{ background: 'rgba(232,0,28,0.1)' }}
                >
                  <CheckCircle size={64} className="text-green-400" />
                </div>
                <p className="text-[12px] font-black uppercase tracking-widest text-white mb-2">
                  You're subscribed!
                </p>
                <p
                  className="text-[12px] leading-relaxed"
                  style={{ color: "#888" }}
                >
                  Welcome to GNEWZ. The best of Gaming &amp; Tech is coming to
                  your inbox.
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-[20px] font-black uppercase tracking-tight text-white leading-tight mb-3">
                  Subscribe to the <span className="text-orange">GNEWZ</span>{" "}
                  Newsletter
                </h2>

                <p
                  className="text-[12px] leading-relaxed mb-5"
                  style={{ color: "#888" }}
                >
                  It's <strong className="text-white font-bold">free.</strong>{" "}
                  Get news, reviews, previews, hardware picks and exclusive
                  features delivered straight to your inbox.
                </p>

                {/* Perks */}
                <ul className="space-y-2 mb-6">
                  {PERKS.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-[11px]"
                      style={{ color: "#aaa" }}
                    >
                      <span className="mt-[5px] w-1.5 h-1.5 rounded-full shrink-0 bg-orange" />
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex gap-2 mb-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    placeholder="your@email.com"
                    required
                    className="flex-1 text-[12px] text-white placeholder-[#555] outline-none transition-colors"
                    style={{
                      background: "#111",
                      border: "1px solid #2e2e2e",
                      padding: "10px 12px",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = "rgba(232,0,28,0.5)")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = "#2e2e2e")
                    }
                  />
                  <Button3D
                    type="submit"
                    color="var(--color-orange)"
                    disabled={loading}
                    className="text-[11px] uppercase tracking-widest px-5 shrink-0 disabled:opacity-50"
                  >
                    {loading ? "…" : "Subscribe"}
                  </Button3D>
                </form>

                {error && (
                  <p className="text-[11px] mb-3" style={{ color: "#e8001c" }}>
                    {error}
                  </p>
                )}

                <p
                  className="text-[10px] leading-relaxed"
                  style={{ color: "#555" }}
                >
                  By subscribing you confirm you are over 13 years old.
                  Unsubscribe anytime via the link in each email. See our{" "}
                  <a
                    href="/privacy-policy"
                    className="underline transition-colors"
                    style={{ color: "#777" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#ccc")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#777")}
                  >
                    Privacy Policy
                  </a>
                  .
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
