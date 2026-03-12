import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "";

const STATUS_CONFIG = {
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

const SUBMITTABLE = ["draft", "rejected"];

function StatusBadge({ status }) {
  const s = STATUS_CONFIG[status?.toLowerCase()] || STATUS_CONFIG.draft;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
        fontSize: "0.62rem",
        fontWeight: 500,
        letterSpacing: "0.13em",
        textTransform: "uppercase",
        color: s.color,
        background: s.bg,
        border: `1px solid ${s.border}`,
        borderRadius: "100px",
        padding: "0.25rem 0.65rem",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: s.color,
          flexShrink: 0,
        }}
      />
      {s.label}
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr className="skeleton-row">
      {[55, 40, 70, 50, 80].map((w, i) => (
        <td key={i} style={{ padding: "1rem 1.25rem" }}>
          <span
            className="shimmer"
            style={{
              display: "block",
              height: "0.85rem",
              width: `${w}%`,
              borderRadius: "4px",
            }}
          />
        </td>
      ))}
    </tr>
  );
}

export default function Reports() {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterYear, setFilterYear] = useState("all");
  const [sortBy, setSortBy] = useState("created_desc");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const PER_PAGE = 10;

  // Action states
  const [submitting, setSubmitting] = useState(null); // report id
  const [submitConfirm, setSubmitConfirm] = useState(null); // report id
  const [toast, setToast] = useState(null); // { type, message }

  // Fallback demo data
  const fallbackReports = [
    {
      id: 1,
      title: "Annual Academic Report 2025",
      department: "Computer Science",
      year: 2025,
      status: "approved",
      updatedAt: "2026-03-01T10:00:00Z",
      createdAt: "2026-02-01T10:00:00Z",
    },
    {
      id: 2,
      title: "Research Achievements 2025",
      department: "Research",
      year: 2025,
      status: "pending",
      updatedAt: "2026-03-05T10:00:00Z",
      createdAt: "2026-02-10T10:00:00Z",
    },
    {
      id: 3,
      title: "Infrastructure Report 2025",
      department: "Infrastructure",
      year: 2025,
      status: "draft",
      updatedAt: "2026-03-10T10:00:00Z",
      createdAt: "2026-02-15T10:00:00Z",
    },
  ];

  // Derived filter values from loaded reports
  const allYears = [
    ...new Set((reports.length > 0 ? reports : fallbackReports).map((r) => r.year).filter(Boolean)),
  ].sort((a, b) => b - a);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login", { replace: true });
      return;
    }
    setMounted(true);
  }, [navigate]);

  useEffect(() => {
    if (mounted) fetchReports();
  }, [mounted, page, filterStatus, filterYear, sortBy, fetchReports]);

  // Debounced search
  useEffect(() => {
    if (!mounted) return;
    const t = setTimeout(() => {
      setPage(1);
      fetchReports();
    }, 350);
    return () => clearTimeout(t);
  }, [search, fetchReports, mounted]);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        page,
        limit: PER_PAGE,
        ...(search && { search }),
        ...(filterStatus !== "all" && { status: filterStatus }),
        ...(filterYear !== "all" && { year: filterYear }),
        ...(sortBy && { sort: sortBy }),
      });

      const res = await fetch(`${API_BASE}/api/reports?${params}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.status === 401 || res.status === 403) {
        navigate("/login", { replace: true });
        return;
      }
      if (!res.ok) throw new Error("Failed to load reports.");

      const data = await res.json();

      // Normalize various API shapes
      const list =
        data.reports ||
        data.data ||
        data.items ||
        (Array.isArray(data) ? data : []);
      const total = data.total || data.totalCount || list.length;
      const pages =
        data.totalPages || data.pages || Math.ceil(total / PER_PAGE) || 1;

      setReports(list);
      setTotalCount(total);
      setTotalPages(pages);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [page, search, filterStatus, filterYear, sortBy, navigate]);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmitReport = async (report) => {
    if (submitConfirm !== report.id && submitConfirm !== report._id) {
      setSubmitConfirm(report.id || report._id);
      return;
    }
    const id = report.id || report._id;
    setSubmitConfirm(null);
    setSubmitting(id);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/reports/${id}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.message || "Submission failed.");
      }
      showToast("success", `"${report.title}" submitted for approval.`);
      fetchReports();
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setSubmitting(null);
    }
  };

  // Filtered + sorted client-side (supplements server-side filtering)
  const displayed = reports.length > 0 ? reports : fallbackReports;

  const activeFilters = [
    filterStatus !== "all",
    filterYear !== "all",
    search.trim(),
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearch("");
    setFilterStatus("all");
    setFilterYear("all");
    setPage(1);
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
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }

        .rp-page {
          min-height: 100vh;
          background: var(--paper);
          font-family: 'DM Sans', sans-serif;
          color: var(--ink);
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .rp-page.visible { opacity: 1; }

        /* ── TOPBAR ── */
        .rp-topbar {
          height: 56px;
          border-bottom: 1px solid var(--border);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 2rem; position: sticky; top: 0;
          background: var(--paper); z-index: 20; gap: 1rem;
        }
        .topbar-left { display: flex; align-items: center; gap: 0.5rem; }
        .page-eyebrow {
          font-size: 0.65rem; font-weight: 500; letter-spacing: 0.18em;
          text-transform: uppercase; color: var(--muted);
        }
        .topbar-sep { color: var(--border); }

        .new-btn {
          display: inline-flex; align-items: center; gap: 0.45rem;
          padding: 0.42rem 0.9rem; background: var(--accent); color: #fff;
          font-family: 'DM Sans', sans-serif; font-size: 0.75rem; font-weight: 500;
          letter-spacing: 0.06em; text-transform: uppercase;
          border: none; border-radius: 6px; cursor: pointer; text-decoration: none;
          transition: background 0.15s, transform 0.15s;
        }
        .new-btn:hover { background: var(--accent-dk); transform: translateY(-1px); }

        /* ── HEADER ── */
        .rp-header {
          padding: 2.5rem 2rem 0;
          max-width: 1100px; margin: 0 auto;
        }
        .rp-title {
          font-family: 'Instrument Serif', serif;
          font-size: 2rem; font-weight: 400; line-height: 1.1;
          margin-bottom: 0.3rem;
        }
        .rp-title em { font-style: italic; color: var(--accent); }
        .rp-subtitle { font-size: 0.82rem; color: var(--muted); }

        /* ── TOOLBAR ── */
        .rp-toolbar {
          display: flex; align-items: center; gap: 0.75rem;
          padding: 1.5rem 2rem 0;
          max-width: 1100px; margin: 0 auto;
          flex-wrap: wrap;
        }
        .search-wrap {
          flex: 1; min-width: 200px; max-width: 320px; position: relative;
        }
        .search-icon {
          position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%);
          color: var(--muted); pointer-events: none;
        }
        .search-input {
          width: 100%; padding: 0.62rem 0.9rem 0.62rem 2.2rem;
          background: #fff; border: 1.5px solid var(--border); border-radius: 8px;
          font-family: 'DM Sans', sans-serif; font-size: 0.82rem; color: var(--ink);
          outline: none; transition: border-color 0.2s, box-shadow 0.2s;
        }
        .search-input::placeholder { color: #b8b2a8; }
        .search-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(200,82,42,0.1); }

        .filter-select {
          padding: 0.62rem 2rem 0.62rem 0.85rem;
          background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%238a8178' stroke-width='2.5' stroke-linecap='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E") no-repeat right 0.65rem center;
          border: 1.5px solid var(--border); border-radius: 8px;
          font-family: 'DM Sans', sans-serif; font-size: 0.82rem; color: var(--ink);
          outline: none; cursor: pointer; -webkit-appearance: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .filter-select:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(200,82,42,0.1); }
        .filter-select.active { border-color: var(--accent); color: var(--accent-dk); background-color: #fdf0ec; }

        .sort-select {
          padding: 0.62rem 2rem 0.62rem 0.85rem;
          background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%238a8178' stroke-width='2.5' stroke-linecap='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E") no-repeat right 0.65rem center;
          border: 1.5px solid var(--border); border-radius: 8px;
          font-family: 'DM Sans', sans-serif; font-size: 0.82rem; color: var(--ink);
          outline: none; cursor: pointer; -webkit-appearance: none;
          transition: border-color 0.2s;
        }
        .sort-select:focus { border-color: var(--accent); }

        .toolbar-spacer { flex: 1; }

        .clear-btn {
          display: inline-flex; align-items: center; gap: 0.35rem;
          font-size: 0.75rem; color: var(--muted); background: none;
          border: 1.5px solid var(--border); border-radius: 7px;
          padding: 0.55rem 0.85rem; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.15s, color 0.15s;
          white-space: nowrap;
        }
        .clear-btn:hover { border-color: var(--accent); color: var(--accent-dk); }

        .count-chip {
          font-size: 0.72rem; color: var(--muted);
          padding: 0.35rem 0; white-space: nowrap;
        }
        .count-chip strong { color: var(--ink); }

        /* ── TABLE WRAPPER ── */
        .rp-table-wrap {
          padding: 1.25rem 2rem 2rem;
          max-width: 1100px; margin: 0 auto;
        }

        .table-shell {
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
        }

        table {
          width: 100%; border-collapse: collapse;
          font-size: 0.85rem;
        }

        thead tr {
          border-bottom: 1px solid var(--border);
          background: var(--cream);
        }
        th {
          padding: 0.75rem 1.25rem;
          text-align: left; font-size: 0.65rem; font-weight: 500;
          letter-spacing: 0.13em; text-transform: uppercase; color: var(--muted);
          white-space: nowrap; user-select: none;
        }
        th.sortable { cursor: pointer; transition: color 0.15s; }
        th.sortable:hover { color: var(--ink); }
        th.sorted { color: var(--accent-dk); }

        tbody tr {
          border-bottom: 1px solid var(--border);
          transition: background 0.12s;
          animation: fadeIn 0.2s ease;
        }
        tbody tr:last-child { border-bottom: none; }
        tbody tr:hover { background: #faf9f7; }

        td { padding: 1rem 1.25rem; vertical-align: middle; }

        .shimmer {
          background: linear-gradient(90deg, #ede8de 25%, #f5f2ec 50%, #ede8de 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        .skeleton-row td { padding: 1rem 1.25rem; }

        /* Title cell */
        .report-title-cell { display: flex; flex-direction: column; gap: 0.2rem; }
        .report-title {
          font-weight: 500; color: var(--ink); line-height: 1.3;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          max-width: 320px;
        }
        .report-dept {
          font-size: 0.72rem; color: var(--muted);
        }

        /* Year cell */
        .year-chip {
          display: inline-block;
          font-size: 0.72rem; font-weight: 500;
          color: var(--ink); background: var(--cream);
          border: 1px solid var(--border);
          border-radius: 5px; padding: 0.2rem 0.55rem;
        }

        /* Actions cell */
        .actions-cell { display: flex; align-items: center; gap: 0.4rem; }

        .act-btn {
          display: inline-flex; align-items: center; gap: 0.35rem;
          font-size: 0.72rem; font-weight: 500;
          padding: 0.38rem 0.7rem; border-radius: 6px; cursor: pointer;
          border: 1.5px solid transparent; text-decoration: none;
          font-family: 'DM Sans', sans-serif; white-space: nowrap;
          transition: background 0.15s, border-color 0.15s, color 0.15s, transform 0.12s;
        }
        .act-btn:hover { transform: translateY(-1px); }
        .act-btn:active { transform: translateY(0); }

        .act-view {
          color: var(--muted); border-color: var(--border); background: none;
        }
        .act-view:hover { color: var(--ink); border-color: #b8b2a8; background: var(--cream); }

        .act-edit {
          color: #4a7fcb; border-color: rgba(74,127,203,0.3); background: none;
        }
        .act-edit:hover { background: #eef3fb; border-color: rgba(74,127,203,0.5); }

        .act-submit {
          color: var(--accent-dk); border-color: rgba(200,82,42,0.35); background: #fdf0ec;
        }
        .act-submit:hover { background: #fae6de; border-color: var(--accent); }
        .act-submit.confirming {
          color: #fff; background: var(--accent); border-color: var(--accent);
          animation: pulse-btn 0.8s ease infinite alternate;
        }
        @keyframes pulse-btn {
          from { box-shadow: 0 0 0 0 rgba(200,82,42,0.4); }
          to   { box-shadow: 0 0 0 5px rgba(200,82,42,0); }
        }
        .act-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        .spinner-sm {
          width: 11px; height: 11px;
          border: 1.5px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── EMPTY STATE ── */
        .empty-state {
          display: flex; flex-direction: column; align-items: center;
          padding: 4rem 2rem; gap: 1rem; text-align: center;
        }
        .empty-icon {
          width: 52px; height: 52px; border-radius: 50%;
          background: var(--cream); display: flex; align-items: center; justify-content: center;
          color: var(--muted);
        }
        .empty-title { font-family: 'Instrument Serif', serif; font-size: 1.3rem; }
        .empty-sub { font-size: 0.8rem; color: var(--muted); }

        /* ── ERROR ── */
        .error-bar {
          display: flex; align-items: center; gap: 0.6rem;
          background: #fdf0ec; border: 1px solid rgba(200,82,42,0.3);
          color: var(--accent-dk); border-radius: 8px;
          padding: 0.85rem 1rem; font-size: 0.82rem; margin-bottom: 1rem;
        }

        /* ── PAGINATION ── */
        .pagination {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1rem 1.25rem; border-top: 1px solid var(--border);
          background: var(--cream); flex-wrap: wrap; gap: 0.75rem;
        }
        .page-info { font-size: 0.75rem; color: var(--muted); }
        .page-info strong { color: var(--ink); }
        .page-btns { display: flex; align-items: center; gap: 0.35rem; }
        .page-btn {
          display: inline-flex; align-items: center; justify-content: center;
          width: 30px; height: 30px; border-radius: 6px;
          border: 1.5px solid var(--border); background: #fff;
          font-size: 0.78rem; font-weight: 500; color: var(--muted);
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: border-color 0.15s, color 0.15s, background 0.15s;
        }
        .page-btn:hover:not(:disabled) { border-color: #b8b2a8; color: var(--ink); }
        .page-btn.active { background: var(--ink); border-color: var(--ink); color: #fff; }
        .page-btn:disabled { opacity: 0.35; cursor: default; }

        /* ── TOAST ── */
        .toast {
          position: fixed; bottom: 1.5rem; left: 50%; transform: translateX(-50%);
          display: inline-flex; align-items: center; gap: 0.6rem;
          padding: 0.75rem 1.25rem; border-radius: 10px;
          font-size: 0.82rem; font-weight: 500;
          box-shadow: 0 8px 32px rgba(15,15,15,0.18);
          z-index: 200; white-space: nowrap;
          animation: slideUp 0.3s ease;
        }
        .toast.success { background: #1a3a28; color: #7ae0a0; }
        .toast.error   { background: #3a1a12; color: #f0a090; }

        /* ── RESPONSIVE ── */
        @media (max-width: 780px) {
          .rp-topbar, .rp-header, .rp-toolbar, .rp-table-wrap { padding-left: 1.25rem; padding-right: 1.25rem; }
          .col-dept, .col-updated { display: none; }
          .report-title { max-width: 180px; }
          th.col-dept, th.col-updated { display: none; }
        }
        @media (max-width: 520px) {
          .col-year { display: none; }
          th.col-year { display: none; }
          .toolbar-spacer { display: none; }
        }
      `}</style>

      <div className={`rp-page ${mounted ? "visible" : ""}`}>
        {/* ── TOPBAR ── */}
        <div className="rp-topbar">
          <div className="topbar-left">
            <span className="page-eyebrow">Dashboard</span>
            <span className="topbar-sep">/</span>
            <span className="page-eyebrow" style={{ color: "var(--ink)" }}>
              Reports
            </span>
          </div>
          <Link to="/dashboard/reports/create" className="new-btn">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Report
          </Link>
        </div>

        {/* ── HEADER ── */}
        <div className="rp-header">
          <h1 className="rp-title">
            All <em>Reports</em>
          </h1>
          <p className="rp-subtitle">
            Browse, filter, and manage your organisation's reports.
          </p>
        </div>

        {/* ── TOOLBAR ── */}
        <div className="rp-toolbar">
          {/* Search */}
          <div className="search-wrap">
            <span className="search-icon">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="search"
              className="search-input"
              placeholder="Search reports…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              aria-label="Search reports"
            />
          </div>

          {/* Status filter */}
          <select
            className={`filter-select ${filterStatus !== "all" ? "active" : ""}`}
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setPage(1);
            }}
            aria-label="Filter by status"
          >
            <option value="all">All statuses</option>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </select>

          {/* Year filter */}
          <select
            className={`filter-select ${filterYear !== "all" ? "active" : ""}`}
            value={filterYear}
            onChange={(e) => {
              setFilterYear(e.target.value);
              setPage(1);
            }}
            aria-label="Filter by year"
          >
            <option value="all">All years</option>
            {allYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort by"
          >
            <option value="created_desc">Newest first</option>
            <option value="created_asc">Oldest first</option>
            <option value="title_asc">Title A–Z</option>
            <option value="title_desc">Title Z–A</option>
            <option value="year_desc">Year (newest)</option>
            <option value="year_asc">Year (oldest)</option>
          </select>

          <div className="toolbar-spacer" />

          {/* Count */}
          {!loading && (
            <span className="count-chip">
              <strong>{totalCount}</strong>{" "}
              {totalCount === 1 ? "report" : "reports"}
            </span>
          )}

          {/* Clear filters */}
          {activeFilters > 0 && (
            <button className="clear-btn" onClick={clearFilters}>
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              Clear ({activeFilters})
            </button>
          )}
        </div>

        {/* ── TABLE ── */}
        <div className="rp-table-wrap">
          {error && (
            <div className="error-bar" role="alert">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
              <button
                onClick={fetchReports}
                style={{
                  marginLeft: "auto",
                  fontSize: "0.75rem",
                  background: "none",
                  border: "none",
                  color: "var(--accent)",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Retry
              </button>
            </div>
          )}

          <div className="table-shell">
            <table>
              <thead>
                <tr>
                  <th style={{ width: "40%" }}>Title</th>
                  <th className="col-year" style={{ width: "8%" }}>
                    Year
                  </th>
                  <th className="col-dept" style={{ width: "16%" }}>
                    Department
                  </th>
                  <th style={{ width: "12%" }}>Status</th>
                  <th className="col-updated" style={{ width: "12%" }}>
                    Updated
                  </th>
                  <th style={{ width: "12%", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading &&
                  Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))}

                {!loading && displayed.length === 0 && (
                  <tr>
                    <td colSpan={6}>
                      <div className="empty-state">
                        <div className="empty-icon">
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                        </div>
                        <div className="empty-title">No reports found</div>
                        <div className="empty-sub">
                          {activeFilters > 0
                            ? "Try adjusting your filters or search term."
                            : "Create your first report to get started."}
                        </div>
                        {activeFilters > 0 ? (
                          <button
                            className="clear-btn"
                            onClick={clearFilters}
                            style={{ marginTop: "0.5rem" }}
                          >
                            Clear filters
                          </button>
                        ) : (
                          <Link
                            to="/dashboard/reports/create"
                            className="new-btn"
                            style={{ marginTop: "0.5rem" }}
                          >
                            Create report
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                )}

                {!loading &&
                  displayed.map((report) => {
                    const id = report.id || report._id;
                    const status = report.status?.toLowerCase() || "draft";
                    const canSubmit = SUBMITTABLE.includes(status);
                    const isSubmitting = submitting === id;
                    const isConfirming = submitConfirm === id;

                    return (
                      <tr key={id}>
                        {/* Title */}
                        <td>
                          <div className="report-title-cell">
                            <span className="report-title" title={report.title}>
                              {report.title}
                            </span>
                            {report.department && (
                              <span className="report-dept">
                                {report.department}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Year */}
                        <td className="col-year">
                          {report.year ? (
                            <span className="year-chip">{report.year}</span>
                          ) : (
                            <span style={{ color: "var(--border)" }}>—</span>
                          )}
                        </td>

                        {/* Department (visible on wider screens) */}
                        <td
                          className="col-dept"
                          style={{ fontSize: "0.8rem", color: "var(--muted)" }}
                        >
                          {report.department || "—"}
                        </td>

                        {/* Status */}
                        <td>
                          <StatusBadge status={status} />
                        </td>

                        {/* Updated */}
                        <td
                          className="col-updated"
                          style={{ fontSize: "0.75rem", color: "var(--muted)" }}
                        >
                          {report.updatedAt || report.createdAt
                            ? new Date(
                                report.updatedAt || report.createdAt,
                              ).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "—"}
                        </td>

                        {/* Actions */}
                        <td>
                          <div
                            className="actions-cell"
                            style={{ justifyContent: "flex-end" }}
                          >
                            <Link
                              to={`/reports/${id}`}
                              className="act-btn act-view"
                            >
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                              >
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                              View
                            </Link>

                            <Link
                              to={`/reports/${id}/edit`}
                              className="act-btn act-edit"
                            >
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                              >
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                              Edit
                            </Link>

                            {canSubmit && (
                              <button
                                className={`act-btn act-submit ${isConfirming ? "confirming" : ""}`}
                                onClick={() => handleSubmitReport(report)}
                                disabled={isSubmitting}
                                title={
                                  isConfirming
                                    ? "Click again to confirm"
                                    : "Submit for approval"
                                }
                              >
                                {isSubmitting ? (
                                  <>
                                    <span className="spinner-sm" /> Sending…
                                  </>
                                ) : isConfirming ? (
                                  <>
                                    <svg
                                      width="12"
                                      height="12"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2.5"
                                      strokeLinecap="round"
                                    >
                                      <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    Confirm
                                  </>
                                ) : (
                                  <>
                                    <svg
                                      width="12"
                                      height="12"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                    >
                                      <line x1="22" y1="2" x2="11" y2="13" />
                                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                    </svg>
                                    Submit
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>

            {/* ── PAGINATION ── */}
            {!loading && totalPages > 1 && (
              <div className="pagination">
                <span className="page-info">
                  Showing{" "}
                  <strong>
                    {(page - 1) * PER_PAGE + 1}–
                    {Math.min(page * PER_PAGE, totalCount)}
                  </strong>{" "}
                  of <strong>{totalCount}</strong>
                </span>
                <div className="page-btns">
                  <button
                    className="page-btn"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    aria-label="Previous page"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>

                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    let p;
                    if (totalPages <= 7) p = i + 1;
                    else if (page <= 4) p = i + 1;
                    else if (page >= totalPages - 3) p = totalPages - 6 + i;
                    else p = page - 3 + i;
                    return (
                      <button
                        key={p}
                        className={`page-btn ${page === p ? "active" : ""}`}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </button>
                    );
                  })}

                  <button
                    className="page-btn"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    aria-label="Next page"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── TOAST ── */}
      {toast && (
        <div className={`toast ${toast.type}`} role="status">
          {toast.type === "success" ? (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          )}
          {toast.message}
        </div>
      )}
    </>
  );
}
