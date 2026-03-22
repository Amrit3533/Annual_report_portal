import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "";

// ── Field schema ─────────────────────────────────────────────────────────────
const FIELDS = [
  {
    key: "programs",
    label: "Programs & Courses",
    placeholder: "List the academic programs and courses offered this period. Include new additions, discontinuations, and enrolment caps.",
    hint: "e.g. BSc Computer Science (new), MBA (revised curriculum), Diploma in Data Analytics",
    maxLength: 1000,
    rows: 4,
  },
  {
    key: "enrollment",
    label: "Student Enrollment",
    placeholder: "Summarise total student enrollment figures. Break down by undergraduate, postgraduate, and part-time where applicable.",
    hint: "e.g. Total: 4,820 — UG: 3,200 | PG: 1,400 | Part-time: 220",
    maxLength: 800,
    rows: 3,
  },
  {
    key: "graduations",
    label: "Graduations",
    placeholder: "Describe graduation outcomes for the period. Include ceremony dates, graduate counts, and notable award recipients.",
    hint: "e.g. 642 graduates across 3 ceremonies; 12 first-class honours; 2 Chancellor's medals",
    maxLength: 800,
    rows: 3,
  },
  {
    key: "faculty",
    label: "Faculty Highlights",
    placeholder: "Highlight key faculty developments — new hires, promotions, retirements, awards, and notable achievements.",
    hint: "e.g. Prof. A. Mensah promoted to Full Professor; Dr. Osei received Best Lecturer award",
    maxLength: 1000,
    rows: 4,
  },
  {
    key: "curriculum",
    label: "Curriculum Updates",
    placeholder: "Describe any curriculum changes, new modules, accreditation updates, or programme restructuring carried out this period.",
    hint: "e.g. Introduced AI Ethics module in Year 3 Engineering; obtained AACSB accreditation renewal",
    maxLength: 1000,
    rows: 4,
  },
];

const ACCENT   = "#4a7fcb";
const ACCENT_BG = "#eef3fb";

// ── Helpers ──────────────────────────────────────────────────────────────────
function charPct(val, max) { return Math.min((val.length / max) * 100, 100); }

function SaveIndicator({ state }) {
  if (state === "saving")  return (
    <span className="save-ind saving">
      <span className="save-spinner" />Saving…
    </span>
  );
  if (state === "saved")   return (
    <span className="save-ind saved">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
      Saved
    </span>
  );
  if (state === "error")   return (
    <span className="save-ind err">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/></svg>
      Save failed
    </span>
  );
  return null;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function AcademicForm() {
  const { reportId } = useParams();
  const navigate = useNavigate();

  const [form, setForm]           = useState(Object.fromEntries(FIELDS.map(f => [f.key, ""])));
  const [errors, setErrors]       = useState({});
  const [apiError, setApiError]   = useState("");
  const [loading, setLoading]     = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [saveState, setSaveState] = useState(null); // null | saving | saved | error
  const [mounted, setMounted]     = useState(false);
  const [isDirty, setIsDirty]     = useState(false);
  const [successBanner, setSuccessBanner] = useState(false);
  const [existingId, setExistingId] = useState(null); // existing academic record id

  const autosaveTimer = useRef(null);
  const firstFieldRef = useRef(null);

  // ── Auth + fetch ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!localStorage.getItem("token")) { navigate("/login", { replace: true }); return; }
    if (!reportId) { navigate("/dashboard/reports", { replace: true }); return; }
    setMounted(true);
    fetchExisting();
  }, [reportId]);

  const fetchExisting = async () => {
    setLoading(true);
    setApiError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/academic/${reportId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.status === 401 || res.status === 403) { navigate("/login", { replace: true }); return; }
      if (res.status === 404) { setLoading(false); return; } // no data yet, blank form
      if (!res.ok) throw new Error("Failed to load academic data.");
      const data = await res.json();
      const record = data.academic || data.data || data;
      if (record && typeof record === "object") {
        setForm(prev => {
          const merged = { ...prev };
          FIELDS.forEach(f => { if (record[f.key] != null) merged[f.key] = String(record[f.key]); });
          return merged;
        });
        setExistingId(record.id || record._id || null);
      }
    } catch (err) {
      setApiError(err.message || "Could not load existing data.");
    } finally {
      setLoading(false);
      setTimeout(() => firstFieldRef.current?.focus(), 300);
    }
  };

  // ── Autosave (draft) ────────────────────────────────────────────────────────
  const autosave = useCallback(async (values) => {
    if (!isDirty) return;
    setSaveState("saving");
    try {
      const token = localStorage.getItem("token");
      const method = existingId ? "PUT" : "POST";
      const url    = existingId
        ? `${API_BASE}/api/academic/${existingId}`
        : `${API_BASE}/api/academic`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ reportId, ...values, draft: true }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      const id = data.id || data._id || data.academic?.id || data.academic?._id;
      if (id && !existingId) setExistingId(id);
      setSaveState("saved");
      setIsDirty(false);
      setTimeout(() => setSaveState(null), 2500);
    } catch {
      setSaveState("error");
      setTimeout(() => setSaveState(null), 3000);
    }
  }, [reportId, existingId, isDirty]);

  // ── Change handler ──────────────────────────────────────────────────────────
  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
    setApiError("");
    setIsDirty(true);

    // Debounced autosave
    clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      autosave({ ...form, [key]: value });
    }, 2000);
  };

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    FIELDS.forEach(f => {
      if (!form[f.key].trim())         e[f.key] = `${f.label} is required.`;
      else if (form[f.key].length > f.maxLength) e[f.key] = `Max ${f.maxLength} characters.`;
    });
    return e;
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearTimeout(autosaveTimer.current);
    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length) { setErrors(fieldErrors); return; }

    setSubmitting(true);
    setApiError("");

    try {
      const token  = localStorage.getItem("token");
      const method = existingId ? "PUT" : "POST";
      const url    = existingId
        ? `${API_BASE}/api/academic/${existingId}`
        : `${API_BASE}/api/academic`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ reportId, ...form, draft: false }),
      });

      const data = await res.json();
      if (res.status === 401 || res.status === 403) { navigate("/login", { replace: true }); return; }
      if (!res.ok) throw new Error(data.message || data.error || "Failed to save academic data.");

      setIsDirty(false);
      setSuccessBanner(true);
      setTimeout(() => navigate(`/reports/${reportId}`), 1800);
    } catch (err) {
      setApiError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  // Completion %
  const filledCount = FIELDS.filter(f => form[f.key].trim().length > 0).length;
  const completionPct = Math.round((filledCount / FIELDS.length) * 100);

  if (!mounted) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --ink:        #0f0f0f;
          --paper:      #f5f2ec;
          --cream:      #ede8de;
          --accent:     ${ACCENT};
          --accent-dk:  #2d5fa0;
          --accent-bg:  ${ACCENT_BG};
          --muted:      #8a8178;
          --border:     #d4cfc5;
          --green:      #2a7a4b;
          --green-bg:   #edf5f0;
        }

        html, body { min-height: 100%; background: var(--paper); }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes successPop {
          0%   { transform: scale(0.92); opacity: 0; }
          60%  { transform: scale(1.02); }
          100% { transform: scale(1);    opacity: 1; }
        }

        .af-page {
          min-height: 100vh;
          background: var(--paper);
          font-family: 'DM Sans', sans-serif;
          color: var(--ink);
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .af-page.visible { opacity: 1; }

        /* ── TOPBAR ── */
        .af-topbar {
          height: 56px;
          border-bottom: 1px solid var(--border);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 2rem; position: sticky; top: 0;
          background: var(--paper); z-index: 20; gap: 1rem;
        }
        .topbar-left { display: flex; align-items: center; gap: 0.5rem; min-width: 0; }
        .back-btn {
          display: inline-flex; align-items: center; gap: 0.4rem;
          font-size: 0.78rem; color: var(--muted); text-decoration: none;
          padding: 0.35rem 0.6rem; border-radius: 6px; flex-shrink: 0;
          transition: background 0.15s, color 0.15s;
        }
        .back-btn:hover { background: var(--cream); color: var(--ink); }
        .topbar-sep { color: var(--border); flex-shrink: 0; }
        .topbar-crumb { font-size: 0.8rem; font-weight: 500; color: var(--ink); }

        .section-badge {
          display: inline-flex; align-items: center; gap: 0.4rem;
          font-size: 0.62rem; font-weight: 500; letter-spacing: 0.14em;
          text-transform: uppercase; color: var(--accent);
          background: var(--accent-bg);
          border: 1px solid rgba(74,127,203,0.25);
          border-radius: 100px; padding: 0.28rem 0.7rem;
        }

        /* ── PROGRESS HEADER ── */
        .progress-bar-wrap {
          background: var(--ink);
          padding: 1.5rem 2rem;
          display: flex; align-items: center; gap: 2rem; flex-wrap: wrap;
          position: relative; overflow: hidden;
        }
        .progress-bar-wrap::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 50% 200% at 0% 50%, rgba(74,127,203,0.15) 0%, transparent 60%);
          pointer-events: none;
        }
        .progress-info { flex: 1; min-width: 200px; position: relative; z-index: 1; }
        .progress-eyebrow {
          font-size: 0.62rem; font-weight: 500; letter-spacing: 0.18em;
          text-transform: uppercase; color: #3a3735; margin-bottom: 0.3rem;
        }
        .progress-title {
          font-family: 'Instrument Serif', serif;
          font-size: 1.5rem; color: #f5f2ec; line-height: 1.1;
        }
        .progress-title em { font-style: italic; color: ${ACCENT}; }

        .progress-meter { flex: 1; min-width: 220px; position: relative; z-index: 1; }
        .progress-labels {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 0.5rem;
        }
        .progress-label { font-size: 0.7rem; color: #4a4745; }
        .progress-pct { font-size: 0.8rem; font-weight: 500; color: #f5f2ec; }
        .progress-track {
          height: 4px; background: rgba(255,255,255,0.07); border-radius: 99px; overflow: hidden;
        }
        .progress-fill {
          height: 100%; border-radius: 99px; background: ${ACCENT};
          transition: width 0.4s ease;
        }
        .progress-steps {
          display: flex; gap: 0.5rem; margin-top: 0.75rem; flex-wrap: wrap;
        }
        .step-chip {
          display: inline-flex; align-items: center; gap: 0.3rem;
          font-size: 0.6rem; padding: 0.2rem 0.5rem; border-radius: 100px;
          transition: background 0.2s, color 0.2s;
        }
        .step-chip.done { background: rgba(74,127,203,0.15); color: ${ACCENT}; }
        .step-chip.empty { background: rgba(255,255,255,0.04); color: #3a3735; }

        /* ── BODY ── */
        .af-body {
          display: grid;
          grid-template-columns: 1fr 280px;
          gap: 2.5rem;
          max-width: 1060px; margin: 0 auto;
          padding: 2.5rem 2rem 4rem;
          align-items: start;
        }

        /* ── SKELETON ── */
        .skeleton-field {
          background: #fff; border: 1px solid var(--border);
          border-radius: 10px; padding: 1.3rem; margin-bottom: 1.25rem;
        }
        .shimmer {
          display: block;
          background: linear-gradient(90deg, #ede8de 25%, #f5f2ec 50%, #ede8de 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 4px;
        }

        /* ── FIELDS ── */
        .form-col { animation: fadeUp 0.35s ease; }

        .api-error {
          background: #fdf0ec; border: 1px solid rgba(200,82,42,0.3);
          color: #a0401e; border-radius: 8px;
          padding: 0.8rem 1rem; font-size: 0.8rem; margin-bottom: 1.5rem;
          display: flex; align-items: flex-start; gap: 0.6rem;
        }

        .success-banner {
          background: var(--green-bg); border: 1px solid rgba(42,122,75,0.25);
          border-radius: 10px; padding: 1.1rem 1.3rem; margin-bottom: 1.5rem;
          display: flex; align-items: center; gap: 0.85rem;
          animation: successPop 0.4s ease;
        }
        .success-icon {
          width: 32px; height: 32px; border-radius: 50%; background: var(--green);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .success-text strong { font-size: 0.85rem; color: var(--green); display: block; margin-bottom: 0.1rem; }
        .success-text p { font-size: 0.76rem; color: #4a7a5a; }

        .field-card {
          background: #fff;
          border: 1.5px solid var(--border);
          border-radius: 10px;
          padding: 1.3rem 1.4rem;
          margin-bottom: 1.25rem;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .field-card:focus-within {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(74,127,203,0.1);
        }
        .field-card.has-error { border-color: #c8522a; }

        .field-top {
          display: flex; align-items: flex-start; justify-content: space-between;
          gap: 0.5rem; margin-bottom: 0.6rem;
        }
        .field-label {
          font-size: 0.7rem; font-weight: 500; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--muted);
          display: flex; align-items: center; gap: 0.35rem;
        }
        .field-num {
          width: 18px; height: 18px; border-radius: 5px;
          background: var(--accent-bg); color: var(--accent);
          font-size: 0.6rem; font-weight: 600;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .char-bar {
          height: 2px; border-radius: 99px; background: var(--border); overflow: hidden;
          margin-bottom: 0.6rem;
        }
        .char-bar-fill {
          height: 100%; border-radius: 99px;
          background: var(--accent); transition: width 0.25s ease;
        }
        .char-bar-fill.warn { background: #c8522a; }

        .field-textarea {
          width: 100%;
          background: var(--cream);
          border: 1.5px solid var(--border);
          border-radius: 7px;
          padding: 0.8rem 0.95rem;
          font-family: 'DM Sans', sans-serif; font-size: 0.88rem;
          color: var(--ink); line-height: 1.65;
          outline: none; resize: vertical;
          transition: border-color 0.2s, box-shadow 0.2s;
          -webkit-appearance: none;
        }
        .field-textarea::placeholder { color: #b8b2a8; }
        .field-textarea:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(74,127,203,0.1); }
        .field-textarea:disabled { opacity: 0.6; cursor: not-allowed; }

        .field-footer {
          display: flex; justify-content: space-between; align-items: center;
          margin-top: 0.5rem;
        }
        .field-hint { font-size: 0.68rem; color: #b8b2a8; line-height: 1.4; flex: 1; }
        .field-error { font-size: 0.7rem; color: #a0401e; }
        .char-count { font-size: 0.68rem; color: var(--muted); white-space: nowrap; margin-left: 0.5rem; }
        .char-count.over { color: #a0401e; font-weight: 500; }

        /* ── ACTIONS ── */
        .form-actions {
          display: flex; align-items: center; gap: 0.75rem;
          margin-top: 0.5rem; flex-wrap: wrap;
        }
        .btn-primary {
          display: inline-flex; align-items: center; gap: 0.55rem;
          padding: 0.88rem 1.7rem; background: var(--accent); color: #fff;
          font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 500;
          letter-spacing: 0.06em; text-transform: uppercase;
          border: none; border-radius: 8px; cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }
        .btn-primary:hover:not(:disabled) { background: var(--accent-dk); transform: translateY(-1px); }
        .btn-primary:active:not(:disabled) { transform: translateY(0); }
        .btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }

        .btn-ghost {
          display: inline-flex; align-items: center;
          padding: 0.88rem 1.2rem; background: none; color: var(--muted);
          font-family: 'DM Sans', sans-serif; font-size: 0.85rem;
          border: 1.5px solid var(--border); border-radius: 8px; cursor: pointer;
          text-decoration: none;
          transition: border-color 0.15s, color 0.15s, background 0.15s;
        }
        .btn-ghost:hover { border-color: #b8b2a8; color: var(--ink); background: var(--cream); }

        .spinner {
          width: 13px; height: 13px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        /* Save indicator */
        .save-ind {
          display: inline-flex; align-items: center; gap: 0.35rem;
          font-size: 0.75rem; border-radius: 6px; padding: 0.3rem 0.6rem;
        }
        .save-ind.saving { color: var(--muted); }
        .save-ind.saved  { color: var(--green); background: var(--green-bg); }
        .save-ind.err    { color: #a0401e; background: #fdf0ec; }
        .save-spinner {
          width: 10px; height: 10px;
          border: 1.5px solid rgba(0,0,0,0.15);
          border-top-color: var(--muted); border-radius: 50%;
          animation: spin 0.7s linear infinite; display: inline-block;
        }

        /* ── SIDEBAR ── */
        .sidebar-col {
          position: sticky; top: calc(56px + 2.5rem);
          display: flex; flex-direction: column; gap: 1rem;
        }

        .info-card {
          background: #fff; border: 1px solid var(--border);
          border-radius: 10px; padding: 1.1rem 1.2rem;
        }
        .info-card-title {
          font-size: 0.65rem; font-weight: 500; letter-spacing: 0.14em;
          text-transform: uppercase; color: var(--muted);
          margin-bottom: 0.75rem;
          display: flex; align-items: center; gap: 0.4rem;
        }
        .info-card-title svg { color: var(--accent); flex-shrink: 0; }

        /* Field list */
        .field-list { display: flex; flex-direction: column; gap: 0.45rem; }
        .field-list-item {
          display: flex; align-items: center; gap: 0.6rem;
          font-size: 0.78rem; color: var(--muted);
          cursor: pointer; padding: 0.3rem 0.4rem; border-radius: 6px;
          transition: background 0.12s, color 0.12s;
          border: none; background: none; font-family: 'DM Sans', sans-serif;
          text-align: left; width: 100%;
        }
        .field-list-item:hover { background: var(--cream); color: var(--ink); }
        .field-list-item.done { color: var(--green); }
        .fli-check {
          width: 16px; height: 16px; border-radius: 50%;
          border: 1.5px solid var(--border);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          transition: background 0.2s, border-color 0.2s;
        }
        .field-list-item.done .fli-check { background: var(--green); border-color: var(--green); }

        /* Tips */
        .tip-list { display: flex; flex-direction: column; gap: 0.6rem; }
        .tip-item { display: flex; gap: 0.55rem; font-size: 0.76rem; color: #5a5550; line-height: 1.45; }
        .tip-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); flex-shrink: 0; margin-top: 0.45rem; opacity: 0.6; }

        /* Report info */
        .report-info { display: flex; flex-direction: column; gap: 0.5rem; }
        .ri-row { display: flex; justify-content: space-between; font-size: 0.76rem; }
        .ri-label { color: var(--muted); }
        .ri-value { font-weight: 500; color: var(--ink); }

        /* ── RESPONSIVE ── */
        @media (max-width: 860px) {
          .af-body { grid-template-columns: 1fr; gap: 2rem; }
          .sidebar-col { position: static; }
          .progress-bar-wrap { gap: 1.5rem; }
        }
        @media (max-width: 520px) {
          .af-topbar { padding: 0 1rem; }
          .af-body { padding: 1.75rem 1.25rem 3rem; }
          .progress-bar-wrap { padding: 1.25rem; }
        }
      `}</style>

      <div className={`af-page ${mounted ? "visible" : ""}`}>

        {/* ── TOPBAR ── */}
        <div className="af-topbar">
          <div className="topbar-left">
            <Link to={`/reports/${reportId}`} className="back-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
              Report
            </Link>
            <span className="topbar-sep">/</span>
            <span className="topbar-crumb">Academic Data</span>
          </div>
          <div className="section-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
            Academic
          </div>
        </div>

        {/* ── PROGRESS HEADER ── */}
        <div className="progress-bar-wrap">
          <div className="progress-info">
            <div className="progress-eyebrow">Section 1 of 6</div>
            <div className="progress-title">
              <em>Academic</em> Data
            </div>
          </div>
          <div className="progress-meter">
            <div className="progress-labels">
              <span className="progress-label">{filledCount} of {FIELDS.length} fields complete</span>
              <span className="progress-pct">{completionPct}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${completionPct}%` }} />
            </div>
            <div className="progress-steps">
              {FIELDS.map(f => (
                <span key={f.key} className={`step-chip ${form[f.key].trim() ? "done" : "empty"}`}>
                  {form[f.key].trim()
                    ? <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    : <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><circle cx="12" cy="12" r="4" fill="currentColor"/></svg>
                  }
                  {f.label.split(" ")[0]}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="af-body">

          {/* FORM COLUMN */}
          <div className="form-col">

            {successBanner && (
              <div className="success-banner" role="status">
                <div className="success-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div className="success-text">
                  <strong>Academic data saved</strong>
                  <p>Redirecting to report overview…</p>
                </div>
              </div>
            )}

            {apiError && (
              <div className="api-error" role="alert">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{flexShrink:0,marginTop:"1px"}}>
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {apiError}
              </div>
            )}

            {/* Skeleton */}
            {loading && FIELDS.map((_, i) => (
              <div key={i} className="skeleton-field">
                <span className="shimmer" style={{ width: "120px", height: "0.65rem", marginBottom: "0.75rem" }} />
                <span className="shimmer" style={{ width: "100%", height: "80px" }} />
              </div>
            ))}

            {/* Fields */}
            {!loading && (
              <form onSubmit={handleSubmit} noValidate id="academic-form">
                {FIELDS.map((field, idx) => {
                  const val      = form[field.key];
                  const pct      = charPct(val, field.maxLength);
                  const isOver   = val.length > field.maxLength;
                  const hasErr   = !!errors[field.key];

                  return (
                    <div
                      key={field.key}
                      id={`field-${field.key}`}
                      className={`field-card ${hasErr ? "has-error" : ""}`}
                    >
                      <div className="field-top">
                        <label htmlFor={field.key} className="field-label">
                          <span className="field-num">{idx + 1}</span>
                          {field.label}
                        </label>
                      </div>

                      {/* Char fill bar */}
                      <div className="char-bar">
                        <div className={`char-bar-fill ${isOver ? "warn" : ""}`} style={{ width: `${pct}%` }} />
                      </div>

                      <textarea
                        ref={idx === 0 ? firstFieldRef : null}
                        id={field.key}
                        name={field.key}
                        rows={field.rows}
                        placeholder={field.placeholder}
                        value={val}
                        onChange={e => handleChange(field.key, e.target.value)}
                        disabled={submitting || successBanner}
                        className="field-textarea"
                        aria-invalid={hasErr}
                        aria-describedby={`${field.key}-footer`}
                      />

                      <div className="field-footer" id={`${field.key}-footer`}>
                        {hasErr
                          ? <span className="field-error">{errors[field.key]}</span>
                          : <span className="field-hint">{field.hint}</span>
                        }
                        <span className={`char-count ${isOver ? "over" : ""}`}>
                          {val.length}/{field.maxLength}
                        </span>
                      </div>
                    </div>
                  );
                })}

                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={submitting || successBanner}
                    aria-busy={submitting}
                  >
                    {submitting ? (
                      <><span className="spinner" />Saving…</>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
                        </svg>
                        Save Academic Data
                      </>
                    )}
                  </button>
                  <Link to={`/reports/${reportId}`} className="btn-ghost">Cancel</Link>
                  <SaveIndicator state={saveState} />
                </div>
              </form>
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="sidebar-col" aria-label="Form guidance">

            {/* Field navigator */}
            <div className="info-card">
              <div className="info-card-title">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                Fields
              </div>
              <div className="field-list">
                {FIELDS.map(f => {
                  const done = form[f.key].trim().length > 0;
                  return (
                    <button
                      key={f.key}
                      className={`field-list-item ${done ? "done" : ""}`}
                      onClick={() => document.getElementById(`field-${f.key}`)?.scrollIntoView({ behavior: "smooth", block: "center" })}
                      type="button"
                    >
                      <div className="fli-check">
                        {done && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                      </div>
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Report info */}
            <div className="info-card">
              <div className="info-card-title">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                Report
              </div>
              <div className="report-info">
                <div className="ri-row">
                  <span className="ri-label">Report ID</span>
                  <span className="ri-value" style={{ fontSize: "0.7rem", fontFamily: "monospace" }}>{reportId}</span>
                </div>
                <div className="ri-row">
                  <span className="ri-label">Section</span>
                  <span className="ri-value">1 of 6</span>
                </div>
                <div className="ri-row">
                  <span className="ri-label">Status</span>
                  <span className="ri-value" style={{ color: existingId ? "var(--green)" : "var(--muted)" }}>
                    {existingId ? "Existing record" : "New entry"}
                  </span>
                </div>
                <div className="ri-row">
                  <span className="ri-label">Autosave</span>
                  <span className="ri-value" style={{ color: "var(--green)" }}>Enabled</span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="info-card">
              <div className="info-card-title">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                Tips
              </div>
              <div className="tip-list">
                {[
                  //"Use numbers where possible — e.g. "642 graduates" is clearer than "many graduates".",
                  "Your draft is autosaved every 2 seconds while you type.",
                  "You can return and edit this section at any time before the report is submitted.",
                ].map((tip, i) => (
                  <div key={i} className="tip-item">
                    <div className="tip-dot" />
                    {tip}
                  </div>
                ))}
              </div>
            </div>

          </aside>
        </div>
      </div>
    </>
  );
}