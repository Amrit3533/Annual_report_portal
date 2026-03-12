import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link, Outlet } from "react-router-dom";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: "Users",
    path: "/dashboard/users",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    label: "Departments",
    path: "/dashboard/departments",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M16 3v4M8 3v4" />
      </svg>
    ),
  },
  {
    label: "Academic Data",
    path: "/dashboard/academic-data",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <rect x="4" y="4" width="16" height="13" rx="2" />
      </svg>
    ),
  },
  {
    label: "Research",
    path: "/dashboard/research",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19.428 15.341A8 8 0 1 1 21 12" />
        <path d="M22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  
  {
    label: "Infrastructure",
    path: "/dashboard/infrastructure",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M16 3v4M8 3v4" />
      </svg>
    ),
  },
  {
    label: "Student Achievement",
    path: "/dashboard/student-achievement",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    ),
  },
  {
    label: "Faculty Achievement",
    path: "/dashboard/faculty-achievement",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="7" r="4" />
        <path d="M6.5 17h11a2.5 2.5 0 0 1 2.5 2.5V21" />
      </svg>
    ),
  },
  {
    label: "Extracurricular Activities",
    path: "/dashboard/extracurricular-activities",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    label: "Reports",
    path: "/dashboard/reports",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M16 3v4M8 3v4" />
      </svg>
    ),
  },
];

function useUser() {
  try {
    const raw = localStorage.getItem("user");
    if (raw) return JSON.parse(raw);
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(
        atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
      );
      return {
        name: payload.name || payload.sub || "User",
        email: payload.email || "",
        role: payload.role || "user",
      };
    }
  } catch (e) {
    // ignore error
  }
  return { name: "User", email: "", role: "user" };
}

function initials(name = "") {
  return (
    name
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U"
  );
}

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const userMenuRef = useRef(null);
  const user = useUser();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login", { replace: true });
      return;
    }
    // Use a timeout to avoid cascading renders
    setTimeout(() => setMounted(true), 0);
  }, [navigate]);

  // Close mobile sidebar on route change
  useEffect(() => {
    // Use a timeout to avoid cascading renders
    setTimeout(() => setMobileOpen(false), 0);
  }, [location.pathname]);

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target))
        setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const isActive = (path) => {
    if (path === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(path);
  };

  // Current page title
  const currentItem = NAV_ITEMS.find((i) => isActive(i.path));
  const pageTitle = currentItem?.label || "Dashboard";

  if (!mounted) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --ink:       #0f0f0f;
          --paper:     #f5f2ec;
          --cream:     #ede8de;
          --accent:    #c8522a;
          --accent-dk: #a0401e;
          --muted:     #8a8178;
          --border:    #d4cfc5;
          --sidebar-w: 220px;
          --sidebar-collapsed: 64px;
          --navbar-h:  56px;
          --transition: 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        html, body { height: 100%; background: var(--paper); }

        .layout-root {
          display: flex;
          min-height: 100vh;
          height: 100dvh;
          font-family: 'DM Sans', sans-serif;
          color: var(--ink);
          background: linear-gradient(120deg, #f5f2ec 60%, #ede8de 100%);
          overflow: hidden;
        }

        /* ═══════════════ SIDEBAR ═══════════════ */
        .sidebar {
          width: var(--sidebar-w);
          background: var(--ink);
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          position: relative;
          transition: width var(--transition), box-shadow 0.2s;
          z-index: 50;
          overflow: hidden;
          box-shadow: 2px 0 16px 0 rgba(0,0,0,0.07);
        }
        .sidebar.collapsed { width: var(--sidebar-collapsed); }

        /* Subtle glow */
        .sidebar::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 40%;
          background: radial-gradient(ellipse 80% 60% at 50% 110%, rgba(200,82,42,0.12) 0%, transparent 70%);
          pointer-events: none;
        }

        /* Logo */
        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0 1.1rem;
          height: var(--navbar-h);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          flex-shrink: 0;
          overflow: hidden;
          text-decoration: none;
          background: rgba(255,255,255,0.02);
        }
        .logo-mark {
          width: 32px; height: 32px;
          border-radius: 9px;
          background: linear-gradient(135deg, var(--accent), var(--accent-dk));
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-family: 'Instrument Serif', serif;
          font-size: 1.2rem;
          color: #fff;
          font-style: italic;
          box-shadow: 0 2px 8px 0 rgba(200,82,42,0.10);
        }
        .logo-text {
          font-family: 'Instrument Serif', serif;
          font-size: 1.15rem;
          color: #f5f2ec;
          white-space: nowrap;
          opacity: 1;
          letter-spacing: 0.03em;
          transition: opacity var(--transition);
          text-shadow: 0 1px 2px rgba(0,0,0,0.08);
        }
        .sidebar.collapsed .logo-text { opacity: 0; pointer-events: none; }

        /* Nav */
        .sidebar-nav {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 1rem 0;
          scrollbar-width: none;
        }
        .sidebar-nav::-webkit-scrollbar { display: none; }

        .nav-group { margin-bottom: 0.25rem; }
        .nav-group-label {
          font-size: 0.6rem;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #3a3735;
          padding: 0.6rem 1.1rem 0.3rem;
          white-space: nowrap;
          overflow: hidden;
          transition: opacity var(--transition);
        }
        .sidebar.collapsed .nav-group-label { opacity: 0; }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.6rem 1.1rem;
          margin: 0 0.5rem;
          border-radius: 7px;
          text-decoration: none;
          color: #7a7370;
          font-size: 0.85rem;
          font-weight: 400;
          white-space: nowrap;
          position: relative;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
          overflow: hidden;
        }
        .nav-item:hover { background: rgba(255,255,255,0.05); color: #d4cfc5; }
        .nav-item.active {
          background: rgba(200,82,42,0.15);
          color: #f5f2ec;
        }
        .nav-item.active .nav-icon { color: var(--accent); }
        .nav-item.accent-item { color: var(--accent); }
        .nav-item.accent-item:hover { background: rgba(200,82,42,0.12); color: #e06840; }

        .nav-icon { flex-shrink: 0; display: flex; align-items: center; }

        .nav-label {
          opacity: 1;
          transition: opacity var(--transition);
          flex: 1;
        }
        .sidebar.collapsed .nav-label { opacity: 0; pointer-events: none; }

        .nav-badge {
          background: var(--accent);
          color: #fff;
          font-size: 0.6rem;
          font-weight: 500;
          padding: 0.1rem 0.4rem;
          border-radius: 100px;
          min-width: 18px;
          text-align: center;
          opacity: 1;
          transition: opacity var(--transition);
        }
        .sidebar.collapsed .nav-badge { opacity: 0; }

        /* Active indicator */
        .nav-item.active::before {
          content: '';
          position: absolute;
          left: -0.5rem;
          top: 20%;
          height: 60%;
          width: 3px;
          border-radius: 0 3px 3px 0;
          background: var(--accent);
        }

        /* Tooltip on collapsed */
        .nav-item[data-tooltip]:hover::after {
          content: attr(data-tooltip);
          position: absolute;
          left: calc(100% + 0.75rem);
          top: 50%;
          transform: translateY(-50%);
          background: rgba(15,15,15,0.95);
          color: #f5f2ec;
          font-size: 0.75rem;
          padding: 0.35rem 0.65rem;
          border-radius: 5px;
          white-space: nowrap;
          pointer-events: none;
          z-index: 100;
          opacity: 0;
          animation: fadeTooltip 0.15s 0.2s forwards;
        }
        @keyframes fadeTooltip { to { opacity: 1; } }

        /* Collapse toggle */
        .sidebar-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          border-top: 1px solid rgba(255,255,255,0.05);
          cursor: pointer;
          color: #3a3735;
          transition: color 0.15s;
          flex-shrink: 0;
        }
        .sidebar-toggle:hover { color: #7a7370; }
        .toggle-icon {
          transition: transform var(--transition);
          flex-shrink: 0;
        }
        .sidebar.collapsed .toggle-icon { transform: rotate(180deg); }

        /* ═══════════════ MOBILE OVERLAY ═══════════════ */
        .mobile-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(15,15,15,0.5);
          z-index: 40;
          backdrop-filter: blur(2px);
          opacity: 0;
          transition: opacity 0.25s;
        }
        .mobile-overlay.open { opacity: 1; }

        /* ═══════════════ MAIN AREA ═══════════════ */
        .main-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-width: 0;
          background: linear-gradient(120deg, #f5f2ec 80%, #ede8de 100%);
        }

        /* ═══════════════ NAVBAR ═══════════════ */
        .navbar {
          height: var(--navbar-h);
          background: var(--paper);
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2.2rem;
          flex-shrink: 0;
          gap: 1rem;
          box-shadow: 0 2px 8px 0 rgba(0,0,0,0.03);
        }

        .navbar-left {
          display: flex;
          align-items: center;
          gap: 1rem;
          min-width: 0;
        }

        .hamburger {
          display: none;
          align-items: center;
          justify-content: center;
          width: 32px; height: 32px;
          border: none;
          background: none;
          cursor: pointer;
          color: var(--muted);
          border-radius: 6px;
          transition: background 0.15s, color 0.15s;
          flex-shrink: 0;
        }
        .hamburger:hover { background: var(--cream); color: var(--ink); }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          color: var(--muted);
          min-width: 0;
        }
        .breadcrumb-home { color: var(--muted); text-decoration: none; transition: color 0.15s; }
        .breadcrumb-home:hover { color: var(--ink); }
        .breadcrumb-sep { color: var(--border); }
        .breadcrumb-current {
          color: var(--ink);
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .navbar-right {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .icon-btn {
          width: 32px; height: 32px;
          border: none;
          background: none;
          cursor: pointer;
          color: var(--muted);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s, color 0.15s;
          position: relative;
        }
        .icon-btn:hover { background: var(--cream); color: var(--ink); }

        .notif-dot {
          position: absolute;
          top: 5px; right: 5px;
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--accent);
          border: 1.5px solid var(--paper);
        }

        /* User menu trigger */
        .user-trigger {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.3rem 0.5rem 0.3rem 0.3rem;
          border: 1px solid var(--border);
          border-radius: 100px;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
          position: relative;
        }
        .user-trigger:hover { border-color: #b8b2a8; background: var(--cream); }

        .avatar {
          width: 26px; height: 26px;
          border-radius: 50%;
          background: var(--accent);
          color: #fff;
          font-size: 0.65rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          letter-spacing: 0.02em;
        }
        .user-name {
          font-size: 0.78rem;
          font-weight: 500;
          color: var(--ink);
          max-width: 90px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .chevron-down {
          color: var(--muted);
          transition: transform 0.2s;
          flex-shrink: 0;
        }
        .user-trigger.open .chevron-down { transform: rotate(180deg); }

        /* User dropdown */
        .user-dropdown {
          position: absolute;
          top: calc(100% + 0.5rem);
          right: 0;
          width: 200px;
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 10px;
          box-shadow: 0 8px 32px rgba(15,15,15,0.12), 0 2px 8px rgba(15,15,15,0.06);
          z-index: 100;
          overflow: hidden;
          animation: dropIn 0.15s ease;
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .dropdown-header {
          padding: 0.85rem 1rem;
          border-bottom: 1px solid var(--border);
        }
        .dropdown-name {
          font-size: 0.82rem;
          font-weight: 500;
          color: var(--ink);
          margin-bottom: 0.1rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .dropdown-email {
          font-size: 0.7rem;
          color: var(--muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .dropdown-role {
          display: inline-block;
          font-size: 0.58rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--accent-dk);
          background: #fdf0ec;
          border: 1px solid rgba(200,82,42,0.2);
          border-radius: 100px;
          padding: 0.15rem 0.5rem;
          margin-top: 0.35rem;
        }

        .dropdown-items { padding: 0.4rem 0; }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.55rem 1rem;
          font-size: 0.8rem;
          color: var(--ink);
          cursor: pointer;
          transition: background 0.12s;
          text-decoration: none;
        }
        .dropdown-item:hover { background: var(--cream); }
        .dropdown-item svg { color: var(--muted); flex-shrink: 0; }
        .dropdown-item.danger { color: var(--accent-dk); }
        .dropdown-item.danger svg { color: var(--accent); }
        .dropdown-item.danger:hover { background: #fdf0ec; }

        .dropdown-sep { height: 1px; background: var(--border); margin: 0.3rem 0; }

        /* ═══════════════ CONTENT ═══════════════ */
        .content-area {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          background: var(--paper);
          scrollbar-width: thin;
          scrollbar-color: var(--border) transparent;
        }
        .content-area::-webkit-scrollbar { width: 5px; }
        .content-area::-webkit-scrollbar-track { background: transparent; }
        .content-area::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }

        .content-inner {
          padding: 2.5rem 3.5rem 2.5rem 3.5rem;
          max-width: 1280px;
          min-height: 100%;
          background: rgba(255,255,255,0.85);
          border-radius: 18px;
          margin: 2.5rem auto;
          box-shadow: 0 4px 32px 0 rgba(200,82,42,0.04);
        }

        /* ═══════════════ RESPONSIVE ═══════════════ */
        @media (max-width: 900px) {
          .content-inner {
            padding: 1.5rem 0.5rem;
            margin: 1.2rem auto;
          }
        }
        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            top: 0; left: 0; bottom: 0;
            transform: translateX(-100%);
            transition: transform var(--transition);
            width: var(--sidebar-w) !important;
            z-index: 50;
          }
          .sidebar.mobile-open { transform: translateX(0); }
          .sidebar-toggle { display: none; }
          .mobile-overlay { display: block; }
          .hamburger { display: flex; }
          .content-inner {
            padding: 1.2rem 0.2rem;
            margin: 0.5rem auto;
          }
          .user-name { display: none; }
        }

        @media (max-width: 480px) {
          .navbar { padding: 0 1rem; }
        }
      `}</style>

      <div className="layout-root">
        {/* ── MOBILE OVERLAY ── */}
        <div
          className={`mobile-overlay ${mobileOpen ? "open" : ""}`}
          onClick={() => setMobileOpen(false)}
        />

        {/* ══════════════════ SIDEBAR ══════════════════ */}
        <aside
          className={`sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}
        >
          {/* Logo */}
          <Link to="/dashboard" className="sidebar-logo">
            <div className="logo-mark">A</div>
            <span className="logo-text">Annual report portal</span>
          </Link>

          {/* Nav groups */}
          <nav className="sidebar-nav" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive(item.path) ? "active" : ""}`}
                data-tooltip={collapsed ? item.label : undefined}
                aria-current={isActive(item.path) ? "page" : undefined}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Collapse toggle */}
          <div
            className="sidebar-toggle"
            onClick={() => setCollapsed((c) => !c)}
            role="button"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setCollapsed((c) => !c)}
          >
            <svg
              className="toggle-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </div>
        </aside>

        {/* ══════════════════ MAIN AREA ══════════════════ */}
        <div className="main-area">
          {/* ── NAVBAR ── */}
          <header className="navbar">
            <div className="navbar-left">
              {/* Hamburger (mobile only) */}
              <button
                className="hamburger"
                onClick={() => setMobileOpen((o) => !o)}
                aria-label="Toggle menu"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>

              {/* Breadcrumb */}
              <nav className="breadcrumb" aria-label="Breadcrumb">
                <Link to="/dashboard" className="breadcrumb-home">
                  Home
                </Link>
                {pageTitle !== "Dashboard" && (
                  <>
                    <span className="breadcrumb-sep" aria-hidden>
                      /
                    </span>
                    <span className="breadcrumb-current">{pageTitle}</span>
                  </>
                )}
              </nav>
            </div>

            <div className="navbar-right">
              {/* Notifications */}
              <button className="icon-btn" aria-label="Notifications">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <span className="notif-dot" aria-hidden />
              </button>

              {/* Settings */}
              <Link
                to="/dashboard/settings"
                className="icon-btn"
                aria-label="Settings"
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </Link>

              {/* User menu */}
              <div ref={userMenuRef} style={{ position: "relative" }}>
                <div
                  className={`user-trigger ${userMenuOpen ? "open" : ""}`}
                  onClick={() => setUserMenuOpen((o) => !o)}
                  role="button"
                  aria-haspopup="true"
                  aria-expanded={userMenuOpen}
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" && setUserMenuOpen((o) => !o)
                  }
                >
                  <div className="avatar">{initials(user.name)}</div>
                  <span className="user-name">{user.name}</span>
                  <svg
                    className="chevron-down"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>

                {userMenuOpen && (
                  <div className="user-dropdown" role="menu">
                    <div className="dropdown-header">
                      <div className="dropdown-name">{user.name}</div>
                      <div className="dropdown-email">{user.email}</div>
                      {user.role && (
                        <div className="dropdown-role">{user.role}</div>
                      )}
                    </div>

                    <div className="dropdown-items">
                      <Link
                        to="/dashboard/profile"
                        className="dropdown-item"
                        role="menuitem"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        Profile
                      </Link>
                      <Link
                        to="/dashboard/settings"
                        className="dropdown-item"
                        role="menuitem"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="3" />
                          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                        </svg>
                        Settings
                      </Link>

                      <div className="dropdown-sep" />

                      <div
                        className="dropdown-item danger"
                        role="menuitem"
                        onClick={handleLogout}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Sign out
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* ── CONTENT AREA ── */}
          <main className="content-area">
            <div className="content-inner">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
