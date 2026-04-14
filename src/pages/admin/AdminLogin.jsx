import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { Lock, User, Eye, EyeOff, Shield } from "lucide-react";
import toast from "react-hot-toast";
import GnewzLogo from "../../components/public/GnewzLogo";
import LanguageSwitch from "../../components/LanguageSwitch";

const inputStyle = {
  width: "100%",
  padding: "12px 14px 12px 44px",
  background: "#111111",
  border: "1px solid #2a2a2a",
  borderRadius: 5,
  color: "#fff",
  fontSize: 15,
  outline: "none",
  caretColor: "#FF6B00",
  transition: "border-color .15s, box-shadow .15s",
};

export default function AdminLogin() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      toast.success(`Welcome back, ${username}!`, { duration: 4000 });
      navigate("/admin/dashboard");
    } catch {
      toast.error("Invalid credentials", { duration: 4000 });
    } finally {
      setLoading(false);
    }
  };

  const getInputStyle = (field) => ({
    ...inputStyle,
    borderColor: focusedField === field ? "rgba(255,107,0,0.5)" : "#2a2a2a",
    boxShadow: focusedField === field ? "0 0 0 3px rgba(255,107,0,0.07)" : "none",
  });

  return (
    <div className="h-screen overflow-hidden flex" style={{ background: "#0D0D0D" }}>

      {/* ── Left decorative panel ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[52%] p-12 relative overflow-hidden"
        style={{
          backgroundImage: 'url("/images/Gemini_Generated_Image_f7pmqff7pmqff7pm.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlays */}
        <div className="absolute inset-0 bg-black/70" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
       
        {/* Right-edge fade */}
        <div
          className="absolute top-0 right-0 h-full w-40 pointer-events-none"
          style={{ background: "linear-gradient(to right, transparent, #0D0D0D)" }}
        />

        {/* Logo */}
        <div className="relative z-10">
          <GnewzLogo size={150} variant="dark" />
        </div>

        {/* Headline */}
        <div className="relative z-10">
          <p
            className="text-[10px] font-extrabold uppercase tracking-[0.35em] mb-4"
            style={{ color: "#FF6B00" }}
          >
            Admin Console
          </p>
          <h2
            className="text-white font-black uppercase leading-none mb-4"
            style={{ fontSize: 48, textShadow: "0 2px 20px rgba(0,0,0,0.8)", letterSpacing: "-0.03em" }}
          >
            GNEWZ
            <br />
            CONTROL
            <br />
            CENTER
          </h2>
          <p
            className="text-sm leading-relaxed max-w-xs"
            style={{ color: "rgba(255,255,255,0.5)", textShadow: "0 1px 8px rgba(0,0,0,0.9)" }}
          >
            Restricted access. Authorized personnel only.
          </p>
        </div>

        <p
          className="text-xs relative z-10"
          style={{ color: "rgba(255,255,255,0.28)", textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}
        >
          © 2026 GNEWZ. All rights reserved.
        </p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col h-full" style={{ background: "#0D0D0D" }}>

        {/* Top bar */}
        <div
          className="flex items-center justify-between px-8 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="lg:hidden">
            <GnewzLogo size={36} variant="dark" />
          </div>
          <div className="ml-auto">
            <LanguageSwitch />
          </div>
        </div>

        {/* Centered form */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div style={{ width: "100%", maxWidth: 400 }}>

            {/* Form card */}
            <div
              className="overflow-hidden"
            
            >
            

              <div className="px-8 py-10">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                  {/* <div
                    className="flex items-center justify-center w-9 h-9 shrink-0"
                    style={{
                      background: "rgba(255,107,0,0.1)",
                      border: "1px solid rgba(255,107,0,0.25)",
                      borderRadius: 10,
                    }}
                  >
                    <Shield size={16} style={{ color: "#FF6B00" }} />
                  </div> */}
                  <div>
                    <p
                      className="text-[10px] font-extrabold uppercase tracking-widest mb-0.5"
                      style={{ color: "rgba(255,255,255,0.25)" }}
                    >
                      {t("admin.adminConsole")}
                    </p>
                    <h1 className="text-white font-black text-[32px] leading-none tracking-tight">
                      {t("admin.signIn")}
                    </h1>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                  {/* Username */}
                  <div>
                    <label
                      className="block text-[11px] font-extrabold uppercase tracking-widest mb-2"
                      style={{ color: "rgba(255,255,255,0.25)" }}
                    >
                      {t("admin.username")}
                    </label>
                    <div className="relative">
                      <User
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ color: focusedField === "username" ? "#FF6B00" : "rgba(255,255,255,0.28)" }}
                      />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        required
                        style={getInputStyle("username")}
                        onFocus={() => setFocusedField("username")}
                        onBlur={() => setFocusedField(null)}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      className="block text-[11px] font-extrabold uppercase tracking-widest mb-2"
                      style={{ color: "rgba(255,255,255,0.25)" }}
                    >
                      {t("admin.password")}
                    </label>
                    <div className="relative">
                      <Lock
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ color: focusedField === "password" ? "#FF6B00" : "rgba(255,255,255,0.28)" }}
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        style={{ ...getInputStyle("password"), paddingRight: 40 }}
                        onFocus={() => setFocusedField("password")}
                        onBlur={() => setFocusedField(null)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                        style={{ color: "rgba(255,255,255,0.28)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.28)")}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* 3D orange submit button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-4 text-[15px] font-black text-white tracking-wide mt-2 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      background: "linear-gradient(135deg, #FF6B00 0%, #e05500 100%)",
                      boxShadow: loading
                        ? "none"
                        : "0 6px 0 #a33a00, 0 8px 16px rgba(255,107,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)",
                      transform: loading ? "translateY(0px)" : "translateY(-3px)",
                      transition: "transform 0.08s ease, box-shadow 0.08s ease",
                      borderRadius: 10,
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.currentTarget.style.boxShadow =
                          "0 8px 0 #a33a00, 0 12px 24px rgba(255,107,0,0.55), inset 0 1px 0 rgba(255,255,255,0.18)";
                        e.currentTarget.style.transform = "translateY(-5px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) {
                        e.currentTarget.style.boxShadow =
                          "0 6px 0 #a33a00, 0 8px 16px rgba(255,107,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)";
                        e.currentTarget.style.transform = "translateY(-3px)";
                      }
                    }}
                    onMouseDown={(e) => {
                      if (!loading) {
                        e.currentTarget.style.boxShadow =
                          "0 2px 0 #a33a00, 0 4px 8px rgba(255,107,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)";
                        e.currentTarget.style.transform = "translateY(0px)";
                      }
                    }}
                    onMouseUp={(e) => {
                      if (!loading) {
                        e.currentTarget.style.boxShadow =
                          "0 6px 0 #a33a00, 0 8px 16px rgba(255,107,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)";
                        e.currentTarget.style.transform = "translateY(-3px)";
                      }
                    }}
                  >
                    {loading ? (
                      <>
                        <div
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            border: "2px solid rgba(255,255,255,0.3)",
                            borderTopColor: "#fff",
                            animation: "spin 0.7s linear infinite",
                          }}
                        />
                        {t("admin.signingIn")}
                      </>
                    ) : (
                      t("admin.signInBtn")
                    )}
                  </button>
                </form>
              </div>

              {/* Footer */}
              <div
                className="px-8 py-4 flex items-center justify-center gap-2"
              >
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "#FF6B00", boxShadow: "0 0 6px rgba(255,107,0,0.6)" }}
                />
                <p
                  className="text-[10px] font-extrabold uppercase tracking-widest"
                  style={{ color: "rgba(255,255,255,0.18)" }}
                >
                  Secure — Encrypted — Monitored
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
