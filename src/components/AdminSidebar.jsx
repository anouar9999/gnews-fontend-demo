import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  Newspaper,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  BarChart3,
  TrendingUp,
  Tag,
  Radio,
  Image,
  FolderTree,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import GnewzLogo from "./public/GnewzLogo";
import toast from "react-hot-toast";

const navGroups = [
  {
    label: "Overview",
    items: [
      {
        to: "/admin/dashboard",
        icon: LayoutDashboard,
        labelKey: "admin.dashboard",
        end: true,
      },
      {
        to: "/admin/analytics",
        icon: TrendingUp,
        labelKey: "admin.analytics",
        end: true,
      },
    ],
  },
  {
    label: "Content",
    items: [
      { to: "/admin/articles", icon: BarChart3, labelKey: "admin.articles" },
      { to: "/admin/raw-news", icon: Newspaper, labelKey: "admin.rawNews" },
      { to: "/admin/categories", icon: FolderTree, labelKey: "admin.categories" },
      { to: "/admin/tags", icon: Tag, labelKey: "admin.tags" },
      { to: "/admin/sources", icon: Radio, labelKey: "admin.sources" },
      { to: "/admin/media", icon: Image, labelKey: "admin.media" },
    ],
  },
  {
    label: "System",
    items: [
      { to: "/admin/users", icon: Users, labelKey: "admin.users" },
      { to: "/admin/settings", icon: Settings, labelKey: "admin.settings" },
    ],
  },
];

export default function AdminSidebar({ collapsed, onToggle, onClose }) {
  const { t } = useTranslation();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/admin/login");
  };

  const handleNavClick = () => {
    onClose?.();
  };

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "A";

  return (
    <aside
      className={`h-full flex flex-col transition-all duration-300 ease-in-out ${
        collapsed ? "w-17.5" : "w-65"
      }`}
      style={{
        background: "var(--color-dark)",
        borderRight: "1px solid rgba(255,107,0,0.12)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center shrink-0 px-4"
        style={{
          height: "72px",
          borderBottom: "1px solid rgba(255,107,0,0.10)",
        }}
      >
        {collapsed ? (
          <button
            onClick={onToggle}
            className="mx-auto flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
            style={{ background: "rgba(255,107,0,0.12)", color: "#ff6b00" }}
          >
            <ChevronRight size={16} />
          </button>
        ) : (
          <>
            <div className="flex flex-col gap-0.5 overflow-hidden flex-1">
              <GnewzLogo size={130} variant="dark" />
              
            </div>

            {/* Mobile close */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:text-white transition-colors ml-2 shrink-0"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <X size={15} />
            </button>

            {/* Desktop collapse */}
            <button
              onClick={onToggle}
              className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-gray-600 hover:text-white transition-all duration-200 shrink-0 ml-2"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <ChevronRight
                size={13}
                style={{ transform: "rotate(180deg)" }}
              />
            </button>
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-5 space-y-1">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-2">
            {/* Group label */}
            {!collapsed && (
              <p
                className="px-5 mb-2 text-[10px] font-bold uppercase tracking-[0.14em] select-none"
                style={{ color: "rgba(255,255,255,0.2)" }}
              >
                {group.label}
              </p>
            )}
            {collapsed && (
              <div
                className="mx-auto my-3"
                style={{
                  width: "22px",
                  height: "1px",
                  background: "rgba(255,255,255,0.07)",
                }}
              />
            )}

            <ul className="space-y-0.5 px-2">
              {group.items.map(({ to, icon: Icon, labelKey, end }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={end}
                    onClick={handleNavClick}
                    title={collapsed ? t(labelKey) : undefined}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-150 relative
                      ${collapsed ? "justify-center px-0 py-3" : "px-3 py-2.5"}
                      ${isActive ? "text-white" : "text-gray-500 hover:text-gray-300"}`
                    }
                    style={({ isActive }) =>
                      isActive
                        ? {
                            background:
                              "linear-gradient(135deg, rgba(255,107,0,0.18) 0%, rgba(255,107,0,0.07) 100%)",
                            boxShadow: "inset 1px 0 0 0 rgba(255,107,0,0.5)",
                          }
                        : { background: "transparent" }
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {/* Active left bar */}
                        {isActive && !collapsed && (
                          <span
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 rounded-r-full"
                            style={{
                              height: "60%",
                              background: "#ff6b00",
                              boxShadow: "0 0 8px rgba(255,107,0,0.6)",
                            }}
                          />
                        )}

                        <span
                          className="shrink-0 flex items-center justify-center transition-all duration-150"
                          style={{
                            color: isActive
                              ? "#ff6b00"
                              : "rgba(255,255,255,0.3)",
                          }}
                        >
                          <Icon size={17} strokeWidth={isActive ? 2.2 : 1.8} />
                        </span>

                        {!collapsed && (
                          <span className="truncate leading-none flex-1">
                            {t(labelKey)}
                          </span>
                        )}

                        {!collapsed && (
                          <ChevronRight
                            size={12}
                            className="shrink-0 transition-all duration-150"
                            style={{
                              opacity: isActive ? 0.7 : 0,
                              color: "#ff6b00",
                              transform: isActive
                                ? "translateX(0)"
                                : "translateX(-4px)",
                            }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div
        className="shrink-0"
        style={{ borderTop: "1px solid rgba(255,107,0,0.10)" }}
      >
        {/* User profile row */}
        {!collapsed && (
          <div
            className="flex items-center gap-3 px-4 py-3"
            style={{ borderBottom: "1px solid rgba(255,107,0,0.08)" }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,107,0,0.3), rgba(255,107,0,0.1))",
                color: "#ff6b00",
                border: "1px solid rgba(255,107,0,0.25)",
              }}
            >
              {initials}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-semibold text-white truncate leading-tight">
                {user?.username || "Admin"}
              </p>
              <p
                className="text-[10px] truncate leading-tight mt-0.5"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                {user?.user_type || "administrator"}
              </p>
            </div>
          </div>
        )}

        {/* Logout button */}
        {/* <div className="p-2">
          <button
            onClick={handleLogout}
            title={collapsed ? t("admin.logout") : undefined}
            className={`group flex items-center gap-3 w-full rounded-xl text-sm font-medium transition-all duration-150
              ${collapsed ? "justify-center px-0 py-3" : "px-3 py-2.5"}`}
            style={{ color: "rgba(248,113,113,0.55)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(239,68,68,0.07)";
              e.currentTarget.style.color = "rgba(248,113,113,0.9)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "rgba(248,113,113,0.55)";
            }}
          >
            <LogOut size={16} className="shrink-0" strokeWidth={1.8} />
            {!collapsed && (
              <span>{t("admin.logout")}</span>
            )}
          </button>
        </div> */}
      </div>
    </aside>
  );
}
