import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "";

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 10 }, (_, i) => CURRENT_YEAR - i);

const MAX_DESC = 1000;

export default function CreateReport() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    year: "",
    department_id: "",
    description: "",
    status: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const titleRef = useRef(null);
  const [departments, setDepartments] = useState([]);
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login", { replace: true });
      return;
    }
    setMounted(true);
    setTimeout(() => titleRef.current?.focus(), 350);
  }, [navigate]);
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_BASE}/api/departments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        console.log("API RESPONSE:", data);
        setDepartments(data);
      } catch (err) {
        console.error("Failed to load departments", err);
        setDepartments([]);
      }
    };

    fetchDepartments();
  }, []);
  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Report title is required.";
    else if (form.title.length > 120)
      e.title = "Title must be under 120 characters.";
    if (!form.year) e.year = "Please select a year.";
    if (!form.department_id) e.department_id = "Please select a department.";
    if (!form.description.trim()) e.description = "Description is required.";
    else if (form.description.length > MAX_DESC)
      e.description = `Max ${MAX_DESC} characters.`;
    if (!form.status) e.status = "Please select a status.";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/api/reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: form.title.trim(),
          year: Number(form.year),
          department_id: form.department_id,
          description: form.description.trim(),
          status: form.status,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 401 || res.status === 403) {
        navigate("/login", { replace: true });
        return;
      }

      if (!res.ok) {
        throw new Error(
          data.message || data.error || "Failed to create report.",
        );
      }

      // On success, redirect to reports list and show toast
      navigate("/dashboard/reports", { state: { toast: "Report created Successfully" } });
      return;
    } catch (err) {
      setApiError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const charCount = form.description.length;
  const charOver = charCount > MAX_DESC;

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
          --green:     #2a7a4b;
          --green-bg:  #edf5f0;
        }

        html, body { min-height: 100%; background: var(--paper); }

        .cr-page {
          min-height: 100vh;
          background: var(--paper);
          font-family: 'DM Sans', sans-serif;
          color: var(--ink);
          display: flex;
          flex-direction: column;
          opacity: 0;
          transition: opacity 0.45s ease;
        }
        .cr-page.visible { opacity: 1; }

        /* ── TOPBAR ── */
        .cr-topbar {
          height: 56px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          flex-shrink: 0;
          position: sticky;
          top: 0;
          background: var(--paper);
          z-index: 10;
        }
        .topbar-left { display: flex; align-items: center; gap: 0.5rem; }
        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.78rem;
          color: var(--muted);
          text-decoration: none;
          padding: 0.35rem 0.6rem;
          border-radius: 6px;
          transition: background 0.15s, color 0.15s;
        }
        .back-btn:hover { background: var(--cream); color: var(--ink); }
        .topbar-sep { color: var(--border); font-size: 0.9rem; }
        .topbar-title {
          font-size: 0.82rem;
          font-weight: 500;
          color: var(--muted);
        }

        .draft-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.62rem;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--muted);
          border: 1px solid var(--border);
          border-radius: 100px;
          padding: 0.25rem 0.6rem;
        }
        .draft-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: var(--border);
        }

        /* ── LAYOUT ── */
        .cr-body {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 0;
          max-width: 1100px;
          width: 100%;
          margin: 0 auto;
          padding: 3rem 2rem;
          align-items: start;
          gap: 3rem;
        }

        /* ── LEFT: FORM ── */
        .form-col {}

        .form-eyebrow {
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 0.4rem;
        }
        .form-heading {
          font-family: 'Instrument Serif', serif;
          font-size: 2.2rem;
          font-weight: 400;
          line-height: 1.1;
          margin-bottom: 0.6rem;
        }
        .form-heading em { font-style: italic; color: var(--accent); }
        .form-sub {
          font-size: 0.82rem;
          color: var(--muted);
          margin-bottom: 2.5rem;
          line-height: 1.5;
        }

        /* API error */
        .api-error {
          background: #fdf0ec;
          border: 1px solid rgba(200,82,42,0.3);
          color: var(--accent-dk);
          border-radius: 8px;
          padding: 0.8rem 1rem;
          font-size: 0.8rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          animation: shake 0.35s ease;
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        /* Fields */
        .field-stack { display: flex; flex-direction: column; gap: 1.4rem; }

        .field { display: flex; flex-direction: column; gap: 0.45rem; }
        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; }

        .field label {
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        .required-star { color: var(--accent); font-size: 0.65rem; }

        .field input,
        .field select,
        .field textarea {
          background: var(--cream);
          border: 1.5px solid var(--border);
          border-radius: 8px;
          padding: 0.85rem 1rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.92rem;
          color: var(--ink);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          -webkit-appearance: none;
          width: 100%;
        }
        .field input::placeholder,
        .field textarea::placeholder { color: #b8b2a8; }
        .field select { cursor: pointer; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238a8178' stroke-width='2.5' stroke-linecap='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 0.9rem center; padding-right: 2.5rem; }
        .field select option[value=""] { color: #b8b2a8; }

        .field input:focus,
        .field select:focus,
        .field textarea:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(200,82,42,0.1);
        }
        .field input.err,
        .field select.err,
        .field textarea.err { border-color: var(--accent); }

        .field input:disabled,
        .field select:disabled,
        .field textarea:disabled { opacity: 0.6; cursor: not-allowed; }

        .field textarea { resize: vertical; min-height: 150px; line-height: 1.6; }

        .field-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: -0.1rem;
        }
        .field-error { font-size: 0.7rem; color: var(--accent-dk); }
        .char-count { font-size: 0.68rem; color: var(--muted); }
        .char-count.over { color: var(--accent-dk); font-weight: 500; }

        /* Title character bar */
        .title-bar {
          height: 2px;
          border-radius: 99px;
          background: var(--border);
          margin-top: 0.3rem;
          overflow: hidden;
        }
        .title-bar-fill {
          height: 100%;
          border-radius: 99px;
          background: var(--accent);
          transition: width 0.2s ease;
        }

        /* Form actions */
        .form-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: 2rem;
          align-items: center;
        }
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          padding: 0.88rem 1.6rem;
          background: var(--accent);
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }
        .btn-primary:hover:not(:disabled) { background: var(--accent-dk); transform: translateY(-1px); }
        .btn-primary:active:not(:disabled) { transform: translateY(0); }
        .btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }

        .btn-ghost {
          display: inline-flex;
          align-items: center;
          padding: 0.88rem 1.2rem;
          background: none;
          color: var(--muted);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 400;
          border: 1.5px solid var(--border);
          border-radius: 8px;
          cursor: pointer;
          text-decoration: none;
          transition: border-color 0.15s, color 0.15s, background 0.15s;
        }
        .btn-ghost:hover { border-color: #b8b2a8; color: var(--ink); background: var(--cream); }

        .spinner {
          width: 13px; height: 13px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── RIGHT: SIDEBAR TIPS ── */
        .tips-col {
          position: sticky;
          top: calc(56px + 3rem);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .tip-card {
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 1.1rem 1.2rem;
        }
        .tip-card-title {
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.45rem;
        }
        .tip-card-title svg { color: var(--accent); flex-shrink: 0; }

        .tip-list { display: flex; flex-direction: column; gap: 0.6rem; }
        .tip-item {
          display: flex;
          gap: 0.6rem;
          font-size: 0.78rem;
          color: #5a5550;
          line-height: 1.45;
        }
        .tip-bullet {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: var(--accent);
          flex-shrink: 0;
          margin-top: 0.5rem;
          opacity: 0.6;
        }

        .field-status-list { display: flex; flex-direction: column; gap: 0.5rem; }
        .field-status {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.78rem;
          color: var(--muted);
          transition: color 0.2s;
        }
        .field-status.done { color: var(--green); }
        .status-check {
          width: 16px; height: 16px;
          border-radius: 50%;
          border: 1.5px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.2s, border-color 0.2s;
        }
        .field-status.done .status-check {
          background: var(--green);
          border-color: var(--green);
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .cr-body { grid-template-columns: 1fr; padding: 2rem 1.5rem; gap: 2rem; }
          .tips-col { position: static; }
        }
        @media (max-width: 560px) {
          .field-row { grid-template-columns: 1fr; }
          .cr-topbar { padding: 0 1rem; }
        }
      `}</style>

      <div className={`cr-page ${mounted ? "visible" : ""}`}>
        {/* ── TOPBAR ── */}
        <div className="cr-topbar">
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
            <span className="topbar-title">New Report</span>
          </div>
          {/* Removed draft badge */}
        </div>

        {/* ── BODY ── */}
        <div className="cr-body">
          {/* FORM */}
          <div className="form-col">
            <p className="form-eyebrow">Report builder</p>
            <h1 className="form-heading">
              Create a <em>new</em> report
            </h1>
            <p className="form-sub">
              Fill in the details below. All fields are required before
              submission.
            </p>

            {apiError && (
              <div className="api-error" role="alert">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  style={{ flexShrink: 0, marginTop: "1px" }}
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="field-stack">
                {/* Title */}
                <div className="field">
                  <label htmlFor="title">
                    Report title <span className="required-star">✦</span>
                  </label>
                  <input
                    ref={titleRef}
                    id="title"
                    name="title"
                    type="text"
                    placeholder="e.g. Q3 Financial Performance Summary"
                    value={form.title}
                    onChange={handleChange}
                    disabled={loading}
                    maxLength={120}
                    className={errors.title ? "err" : ""}
                    autoComplete="off"
                  />
                  <div className="title-bar">
                    <div
                      className="title-bar-fill"
                      style={{
                        width: `${Math.min((form.title.length / 120) * 100, 100)}%`,
                        background:
                          form.title.length > 120
                            ? "var(--accent)"
                            : "var(--accent)",
                      }}
                    />
                  </div>
                  {errors.title && (
                    <span className="field-error">{errors.title}</span>
                  )}
                </div>

                {/* Year + Department + Status */}
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="year">
                      Year <span className="required-star">✦</span>
                    </label>
                    <select
                      id="year"
                      name="year"
                      value={form.year}
                      onChange={handleChange}
                      disabled={loading}
                      className={errors.year ? "err" : ""}
                    >
                      <option value="">Select year</option>
                      {YEARS.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                    {errors.year && (
                      <span className="field-error">{errors.year}</span>
                    )}
                  </div>

                  <div className="field">
                    <label htmlFor="department">
                      Department <span className="required-star">✦</span>
                    </label>
                    <select
                      id="department"
                      name="department_id"
                      value={form.department_id}
                      onChange={handleChange}
                      disabled={loading}
                      className={errors.department_id ? "err" : ""}
                    >
                      <option value="">Select department</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                    {errors.department_id && (
                      <span className="field-error">
                        {errors.department_id}
                      </span>
                    )}
                  </div>

                  <div className="field">
                    <label htmlFor="status">
                      Report Status <span className="required-star">✦</span>
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      disabled={loading}
                      className={errors.status ? "err" : ""}
                    >
                      <option value="">Select status</option>
                      <option value="draft">Draft</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    {errors.status && (
                      <span className="field-error">{errors.status}</span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="field">
                  <label htmlFor="description">
                    Description <span className="required-star">✦</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Provide a clear summary of this report's scope, findings, and purpose…"
                    value={form.description}
                    onChange={handleChange}
                    disabled={loading}
                    className={errors.description ? "err" : ""}
                    rows={6}
                  />
                  <div className="field-footer">
                    <span className="field-error">
                      {errors.description || ""}
                    </span>
                    <span className={`char-count ${charOver ? "over" : ""}`}>
                      {charCount} / {MAX_DESC}
                    </span>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading || charOver}
                  aria-busy={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner" /> Submitting…
                    </>
                  ) : (
                    <>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      >
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                      Create report
                    </>
                  )}
                </button>
                <Link to="/dashboard/reports" className="btn-ghost">
                  Cancel
                </Link>
              </div>
            </form>
          </div>

          {/* TIPS SIDEBAR */}
          <aside className="tips-col" aria-label="Form guidance">
            {/* Completion tracker */}
            <div className="tip-card">
              <div className="tip-card-title">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Completion
              </div>
              <div className="field-status-list">
                {[
                  { label: "Title", filled: form.title.trim().length > 0 },
                  { label: "Year", filled: !!form.year },
                  { label: "Department", filled: !!form.department_id },
                  {
                    label: "Description",
                    filled: form.description.trim().length > 0,
                  },
                ].map(({ label, filled }) => (
                  <div
                    key={label}
                    className={`field-status ${filled ? "done" : ""}`}
                  >
                    <div className="status-check">
                      {filled && (
                        <svg
                          width="8"
                          height="8"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#fff"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Writing tips */}
            <div className="tip-card">
              <div className="tip-card-title">
                <svg
                  width="13"
                  height="13"
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
                Writing tips
              </div>
              <div className="tip-list">
                {[
                  "Use a descriptive title that identifies the period and subject at a glance.",
                  "The description should state the scope, key findings, and intended audience.",
                  "Avoid abbreviations that readers outside your team might not recognise.",
                ].map((tip, i) => (
                  <div key={i} className="tip-item">
                    <div className="tip-bullet" />
                    {tip}
                  </div>
                ))}
              </div>
            </div>

            {/* What happens next */}
            <div className="tip-card">
              <div className="tip-card-title">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
                What happens next
              </div>
              <div className="tip-list">
                {[
                  "Report is saved and assigned a unique ID.",
                  "Submitted for approval by the relevant team.",
                  "You'll be redirected to the report detail page.",
                ].map((step, i) => (
                  <div key={i} className="tip-item">
                    <div className="tip-bullet" />
                    {step}
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
