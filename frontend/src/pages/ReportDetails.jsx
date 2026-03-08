import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "";

// ── Section definitions ──────────────────────────────────────────────────────
const SECTIONS = [
  {
    key: "academic",
    label: "Academic",
    icon: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
    color: "#4a7fcb",
    bg: "#eef3fb",
    fields: [
      { key: "programs", label: "Programs & Courses" },
      { key: "enrollment", label: "Student Enrollment" },
      { key: "graduations", label: "Graduations" },
      { key: "faculty", label: "Faculty Highlights" },
      { key: "curriculum", label: "Curriculum Updates" },
    ],
  },
  {
    key: "research",
    label: "Research",
    icon: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    color: "#7a52c8",
    bg: "#f3eefb",
    fields: [
      { key: "projects", label: "Active Projects" },
      { key: "publications", label: "Publications" },
      { key: "grants", label: "Grants & Funding" },
      { key: "partnerships", label: "Research Partnerships" },
      { key: "outcomes", label: "Key Outcomes" },
    ],
  },
  {
    key: "financial",
    label: "Financial",
    icon: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    color: "#2a7a4b",
    bg: "#edf5f0",
    fields: [
      { key: "revenue", label: "Revenue" },
      { key: "expenditure", label: "Expenditure" },
      { key: "budget", label: "Budget Allocation" },
      { key: "surplus_deficit", label: "Surplus / Deficit" },
      { key: "audit", label: "Audit Summary" },
    ],
  },
  {
    key: "infrastructure",
    label: "Infrastructure",
    icon: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    color: "#c8772a",
    bg: "#fdf4ec",
    fields: [
      { key: "facilities", label: "Facilities" },
      { key: "technology", label: "Technology & IT" },
      { key: "maintenance", label: "Maintenance" },
      { key: "projects", label: "Ongoing Projects" },
      { key: "capacity", label: "Capacity Planning" },
    ],
  },
  {
    key: "achievements",
    label: "Achievements",
    icon: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
      </svg>
    ),
    color: "#c8522a",
    bg: "#fdf0ec",
    fields: [
      { key: "awards", label: "Awards & Recognition" },
      { key: "milestones", label: "Key Milestones" },
      { key: "staff", label: "Staff Achievements" },
      { key: "student", label: "Student Achievements" },
      { key: "community", label: "Community Impact" },
    ],
  },
  {
    key: "activities",
    label: "Activities",
    icon: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    color: "#2a8a8a",
    bg: "#edf8f8",
    fields: [
      { key: "events", label: "Events & Conferences" },
      { key: "outreach", label: "Community Outreach" },
      { key: "collaborations", label: "Collaborations" },
      { key: "training", label: "Training & Workshops" },
      { key: "upcoming", label: "Upcoming Plans" },
    ],
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    draft: {
      label: "Draft",
      color: "#8a8178",
      bg: "var(--cream)",
      border: "var(--border)",
    },
    pending: {
      label: "Pending",
      color: "#b07820",
      bg: "#fdf8ec",
      border: "rgba(176,120,32,0.3)",
    },
    approved: {
      label: "Approved",
      color: "#2a7a4b",
      bg: "#edf5f0",
      border: "rgba(42,122,75,0.3)",
    },
    rejected: {
      label: "Rejected",
      color: "#a0401e",
      bg: "#fdf0ec",
      border: "rgba(200,82,42,0.3)",
    },
  };
  const s = map[status?.toLowerCase()] || map.draft;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
        fontSize: "0.65rem",
        fontWeight: 500,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: s.color,
        background: s.bg,
        border: `1px solid ${s.border}`,
        borderRadius: "100px",
        padding: "0.28rem 0.7rem",
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: s.color,
          display: "inline-block",
        }}
      />
      {s.label}
    </span>
  );
}

function SkeletonBlock({ w = "100%", h = "1rem", radius = "4px" }) {
  return (
    <span
      style={{
        display: "block",
        width: w,
        height: h,
        borderRadius: radius,
        background:
          "linear-gradient(90deg, #e8e4dc 25%, #f0ece4 50%, #e8e4dc 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.4s infinite",
      }}
    />
  );
}

function EmptyField({ label }) {
  return (
    <div
      style={{
        padding: "1rem",
        background: "rgba(0,0,0,0.02)",
        border: "1.5px dashed var(--border)",
        borderRadius: "8px",
        fontSize: "0.78rem",
        color: "var(--muted)",
        fontStyle: "italic",
      }}
    >
      No {label.toLowerCase()} data recorded.
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ReportDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(SECTIONS[0].key);
  const [mounted, setMounted] = useState(false);
  const tabsRef = useRef(null);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login", { replace: true });
      return;
    }
    setMounted(true);
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/reports/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.status === 401 || res.status === 403) {
        navigate("/login", { replace: true });
        return;
      }
      if (res.status === 404) {
        setError("Report not found.");
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error("Failed to load report.");
      const data = await res.json();
      setReport(data.report || data);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const activeSection = SECTIONS.find((s) => s.key === activeTab);
  const sectionData = report?.[activeTab] || {};

  const scrollTabIntoView = (key) => {
    setActiveTab(key);
    const el = tabsRef.current?.querySelector(`[data-tab="${key}"]`);
    el?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  };

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
        }

        html, body { min-height: 100%; background: var(--paper); }

        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .rd-page {
          min-height: 100vh;
          background: var(--paper);
          font-family: 'DM Sans', sans-serif;
          color: var(--ink);
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .rd-page.visible { opacity: 1; }

        /* ── TOPBAR ── */
        .rd-topbar {
          height: 56px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          position: sticky;
          top: 0;
          background: var(--paper);
          z-index: 20;
          gap: 1rem;
        }
        .topbar-left { display: flex; align-items: center; gap: 0.5rem; min-width: 0; }
        .back-btn {
          display: inline-flex; align-items: center; gap: 0.4rem;
          font-size: 0.78rem; color: var(--muted); text-decoration: none;
          padding: 0.35rem 0.6rem; border-radius: 6px;
          transition: background 0.15s, color 0.15s; flex-shrink: 0;
        }
        .back-btn:hover { background: var(--cream); color: var(--ink); }
        .topbar-sep { color: var(--border); flex-shrink: 0; }
        .topbar-crumb {
          font-size: 0.8rem; font-weight: 500; color: var(--ink);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .topbar-right { display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0; }

        .icon-btn {
          width: 32px; height: 32px; border: none; background: none; cursor: pointer;
          color: var(--muted); border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s, color 0.15s; text-decoration: none;
        }
        .icon-btn:hover { background: var(--cream); color: var(--ink); }

        .edit-btn {
          display: inline-flex; align-items: center; gap: 0.45rem;
          padding: 0.4rem 0.9rem; background: var(--accent); color: #fff;
          font-family: 'DM Sans', sans-serif; font-size: 0.75rem; font-weight: 500;
          letter-spacing: 0.06em; text-transform: uppercase;
          border: none; border-radius: 6px; cursor: pointer; text-decoration: none;
          transition: background 0.15s, transform 0.15s;
        }
        .edit-btn:hover { background: var(--accent-dk); transform: translateY(-1px); }

        /* ── HERO ── */
        .rd-hero {
          background: var(--ink);
          padding: 2.5rem 2rem 0;
          position: relative;
          overflow: hidden;
        }
        .rd-hero::before {
          content: '';
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 50% 80% at 5% 100%, rgba(200,82,42,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 30% 50% at 95% 10%, rgba(200,82,42,0.07) 0%, transparent 60%);
          pointer-events: none;
        }

        .hero-meta {
          display: flex; align-items: center; gap: 0.6rem;
          margin-bottom: 1rem; flex-wrap: wrap;
        }
        .meta-pill {
          display: inline-flex; align-items: center; gap: 0.35rem;
          font-size: 0.65rem; font-weight: 500; letter-spacing: 0.14em;
          text-transform: uppercase; color: #5a5550;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 100px; padding: 0.25rem 0.65rem;
        }
        .meta-sep { color: rgba(255,255,255,0.1); font-size: 0.8rem; }

        .hero-title {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(1.8rem, 3vw, 2.8rem);
          line-height: 1.1; color: #f5f2ec;
          margin-bottom: 1rem; position: relative; z-index: 1;
        }
        .hero-desc {
          font-size: 0.88rem; color: #7a7370; line-height: 1.65;
          max-width: 680px; position: relative; z-index: 1;
          margin-bottom: 1.75rem;
        }

        /* Section progress dots in hero */
        .hero-sections {
          display: flex; gap: 0.5rem; align-items: center;
          position: relative; z-index: 1; margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }
        .hero-section-dot {
          display: flex; align-items: center; gap: 0.4rem;
          font-size: 0.65rem; color: #3a3735;
          padding: 0.2rem 0.5rem;
        }
        .section-dot-pip {
          width: 6px; height: 6px; border-radius: 50%;
          transition: transform 0.2s;
        }
        .hero-section-dot.has-data .section-dot-pip { transform: scale(1.3); }

        /* ── TAB STRIP ── */
        .tab-strip-wrap {
          background: var(--ink);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          position: sticky;
          top: 56px;
          z-index: 15;
        }
        .tab-strip {
          display: flex;
          overflow-x: auto;
          scrollbar-width: none;
          padding: 0 2rem;
          gap: 0;
        }
        .tab-strip::-webkit-scrollbar { display: none; }

        .tab-btn {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.85rem 1.1rem;
          font-family: 'DM Sans', sans-serif; font-size: 0.8rem; font-weight: 400;
          color: #4a4745; border: none; background: none; cursor: pointer;
          white-space: nowrap; position: relative;
          transition: color 0.15s;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
        }
        .tab-btn:hover { color: #8a8178; }
        .tab-btn.active {
          color: #f5f2ec;
          font-weight: 500;
        }
        .tab-btn.active::after {
          content: '';
          position: absolute; bottom: -1px; left: 0; right: 0;
          height: 2px; border-radius: 99px;
          background: var(--active-color, var(--accent));
        }

        /* ── CONTENT ── */
        .rd-content {
          max-width: 1000px;
          margin: 0 auto;
          padding: 2.5rem 2rem 4rem;
        }

        .section-header {
          display: flex; align-items: flex-start; justify-content: space-between;
          margin-bottom: 2rem; gap: 1rem; flex-wrap: wrap;
        }
        .section-title-group {}
        .section-eyebrow {
          font-size: 0.62rem; font-weight: 500; letter-spacing: 0.2em;
          text-transform: uppercase; color: var(--muted); margin-bottom: 0.3rem;
        }
        .section-title {
          font-family: 'Instrument Serif', serif;
          font-size: 1.6rem; font-weight: 400; line-height: 1.1;
          display: flex; align-items: center; gap: 0.6rem;
        }
        .section-icon-wrap {
          width: 32px; height: 32px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        /* Field cards */
        .fields-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
          animation: fadeUp 0.3s ease;
        }
        .field-card {
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 1.2rem 1.3rem;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .field-card:hover { box-shadow: 0 4px 16px rgba(15,15,15,0.06); transform: translateY(-1px); }
        .field-card.full-width { grid-column: 1 / -1; }

        .field-card-label {
          font-size: 0.65rem; font-weight: 500; letter-spacing: 0.14em;
          text-transform: uppercase; color: var(--muted); margin-bottom: 0.6rem;
          display: flex; align-items: center; gap: 0.4rem;
        }
        .field-card-label-dot {
          width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0;
        }
        .field-card-value {
          font-size: 0.88rem; color: var(--ink); line-height: 1.65; white-space: pre-wrap;
        }

        /* Section nav arrows */
        .section-nav {
          display: flex; align-items: center; gap: 0.5rem; margin-top: 3rem;
          padding-top: 2rem; border-top: 1px solid var(--border);
        }
        .section-nav-btn {
          display: inline-flex; align-items: center; gap: 0.45rem;
          font-size: 0.78rem; color: var(--muted);
          background: none; border: 1.5px solid var(--border);
          border-radius: 7px; padding: 0.55rem 1rem; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.15s, color 0.15s, background 0.15s;
          text-decoration: none;
        }
        .section-nav-btn:hover { border-color: #b8b2a8; color: var(--ink); background: var(--cream); }
        .section-nav-btn:disabled { opacity: 0.3; cursor: default; }
        .section-nav-spacer { flex: 1; }
        .section-counter {
          font-size: 0.7rem; color: var(--muted);
          padding: 0 0.5rem;
        }

        /* ── SKELETON ── */
        .skeleton-hero { padding: 2.5rem 2rem 2rem; background: var(--ink); }
        .skeleton-section { padding: 2.5rem 2rem; max-width: 1000px; margin: 0 auto; }
        .skeleton-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
        .skeleton-card {
          background: #fff; border: 1px solid var(--border);
          border-radius: 10px; padding: 1.2rem 1.3rem;
        }

        /* ── ERROR / EMPTY ── */
        .error-state {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; min-height: 60vh; gap: 1rem; text-align: center;
        }
        .error-icon {
          width: 48px; height: 48px; border-radius: 50%;
          background: #fdf0ec; display: flex; align-items: center; justify-content: center;
          color: var(--accent);
        }
        .error-title {
          font-family: 'Instrument Serif', serif; font-size: 1.5rem; color: var(--ink);
        }
        .error-sub { font-size: 0.82rem; color: var(--muted); }

        /* ── RESPONSIVE ── */
        @media (max-width: 680px) {
          .fields-grid { grid-template-columns: 1fr; }
          .rd-hero { padding: 2rem 1.25rem 0; }
          .rd-topbar { padding: 0 1rem; }
          .rd-content { padding: 1.75rem 1.25rem 3rem; }
          .tab-strip { padding: 0 1rem; }
          .topbar-crumb { max-width: 140px; }
        }
      `}</style>

      <div className={`rd-page ${mounted ? "visible" : ""}`}>
        {/* ── TOPBAR ── */}
        <div className="rd-topbar">
          <div className="topbar-left">
            <Link to="/dashboard/reports" className="back-btn">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Reports
            </Link>
            <span className="topbar-sep">/</span>
            <span className="topbar-crumb">
              {loading ? "Loading…" : report?.title || `Report #${id}`}
            </span>
          </div>

          {!loading && report && (
            <div className="topbar-right">
              <StatusBadge status={report.status} />
              <button
                className="icon-btn"
                title="Print"
                onClick={() => window.print()}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <polyline points="6 9 6 2 18 2 18 9" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect x="6" y="14" width="12" height="8" />
                </svg>
              </button>
              <Link to={`/reports/${id}/edit`} className="edit-btn">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit
              </Link>
            </div>
          )}
        </div>

        {/* ── ERROR STATE ── */}
        {!loading && error && (
          <div className="error-state">
            <div className="error-icon">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div className="error-title">{error}</div>
            <div className="error-sub">Check the report ID or try again.</div>
            <Link
              to="/dashboard/reports"
              className="back-btn"
              style={{ marginTop: "0.5rem" }}
            >
              ← Back to Reports
            </Link>
          </div>
        )}

        {/* ── SKELETON ── */}
        {loading && (
          <>
            <div className="skeleton-hero">
              <SkeletonBlock w="120px" h="0.7rem" radius="99px" />
              <div style={{ marginTop: "1rem" }}>
                <SkeletonBlock w="60%" h="2.2rem" radius="6px" />
              </div>
              <div style={{ marginTop: "0.75rem" }}>
                <SkeletonBlock w="85%" h="0.85rem" radius="4px" />
              </div>
              <div style={{ marginTop: "0.5rem" }}>
                <SkeletonBlock w="55%" h="0.85rem" radius="4px" />
              </div>
              <div style={{ marginTop: "1.5rem", height: "42px" }} />
            </div>
            <div
              style={{
                background: "var(--ink)",
                height: "44px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            />
            <div className="skeleton-section">
              <SkeletonBlock w="180px" h="1.5rem" radius="6px" />
              <div style={{ marginTop: "1.5rem" }} className="skeleton-row">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="skeleton-card">
                    <SkeletonBlock w="80px" h="0.65rem" radius="99px" />
                    <div style={{ marginTop: "0.75rem" }}>
                      <SkeletonBlock h="0.85rem" radius="4px" />
                    </div>
                    <div style={{ marginTop: "0.4rem" }}>
                      <SkeletonBlock w="70%" h="0.85rem" radius="4px" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── REPORT ── */}
        {!loading && !error && report && (
          <>
            {/* HERO */}
            <div className="rd-hero">
              <div className="hero-meta">
                {report.department && (
                  <span className="meta-pill">{report.department}</span>
                )}
                {report.year && (
                  <span className="meta-pill">{report.year}</span>
                )}
                {report.createdAt && (
                  <span className="meta-pill">
                    {new Date(report.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>

              <h1 className="hero-title">{report.title}</h1>

              {report.description && (
                <p className="hero-desc">{report.description}</p>
              )}

              {/* Section data indicators */}
              <div className="hero-sections">
                {SECTIONS.map((s) => {
                  const data = report[s.key] || {};
                  const hasData = Object.values(data).some(
                    (v) => v && String(v).trim(),
                  );
                  return (
                    <button
                      key={s.key}
                      className={`hero-section-dot ${hasData ? "has-data" : ""}`}
                      onClick={() => scrollTabIntoView(s.key)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "0.2rem 0.5rem",
                      }}
                    >
                      <span
                        className="section-dot-pip"
                        style={{ background: hasData ? s.color : "#2a2826" }}
                      />
                      <span
                        style={{
                          fontSize: "0.65rem",
                          letterSpacing: "0.08em",
                          color: hasData ? "#8a8178" : "#2a2826",
                        }}
                      >
                        {s.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TAB STRIP */}
            <div className="tab-strip-wrap">
              <div className="tab-strip" ref={tabsRef}>
                {SECTIONS.map((s) => (
                  <button
                    key={s.key}
                    data-tab={s.key}
                    className={`tab-btn ${activeTab === s.key ? "active" : ""}`}
                    style={{ "--active-color": s.color }}
                    onClick={() => scrollTabIntoView(s.key)}
                  >
                    <span
                      style={{
                        color: activeTab === s.key ? s.color : "inherit",
                      }}
                    >
                      {s.icon}
                    </span>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* SECTION CONTENT */}
            <div className="rd-content">
              <div className="section-header">
                <div className="section-title-group">
                  <div className="section-eyebrow">
                    Section {SECTIONS.findIndex((s) => s.key === activeTab) + 1}{" "}
                    of {SECTIONS.length}
                  </div>
                  <div className="section-title">
                    <div
                      className="section-icon-wrap"
                      style={{ background: activeSection.bg }}
                    >
                      <span style={{ color: activeSection.color }}>
                        {activeSection.icon}
                      </span>
                    </div>
                    {activeSection.label}
                  </div>
                </div>
              </div>

              <div className="fields-grid" key={activeTab}>
                {activeSection.fields.map((field, i) => {
                  const value = sectionData[field.key];
                  const isEmpty = !value || !String(value).trim();
                  const isLast = i === activeSection.fields.length - 1;
                  const isOdd = activeSection.fields.length % 2 !== 0;
                  const fullWidth = isLast && isOdd;

                  return (
                    <div
                      key={field.key}
                      className={`field-card ${fullWidth ? "full-width" : ""}`}
                    >
                      <div className="field-card-label">
                        <span
                          className="field-card-label-dot"
                          style={{ background: activeSection.color }}
                        />
                        {field.label}
                      </div>
                      {isEmpty ? (
                        <EmptyField label={field.label} />
                      ) : (
                        <div className="field-card-value">{String(value)}</div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Section navigation */}
              <div className="section-nav">
                <button
                  className="section-nav-btn"
                  disabled={
                    SECTIONS.findIndex((s) => s.key === activeTab) === 0
                  }
                  onClick={() => {
                    const idx = SECTIONS.findIndex((s) => s.key === activeTab);
                    if (idx > 0) scrollTabIntoView(SECTIONS[idx - 1].key);
                  }}
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  Previous
                </button>

                <span className="section-counter">
                  {SECTIONS.findIndex((s) => s.key === activeTab) + 1} /{" "}
                  {SECTIONS.length}
                </span>

                <div className="section-nav-spacer" />

                <button
                  className="section-nav-btn"
                  disabled={
                    SECTIONS.findIndex((s) => s.key === activeTab) ===
                    SECTIONS.length - 1
                  }
                  onClick={() => {
                    const idx = SECTIONS.findIndex((s) => s.key === activeTab);
                    if (idx < SECTIONS.length - 1)
                      scrollTabIntoView(SECTIONS[idx + 1].key);
                  }}
                >
                  Next
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
