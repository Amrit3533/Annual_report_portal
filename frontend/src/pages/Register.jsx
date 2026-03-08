import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "";

// ── Role options available to admin when creating a new user ──
const ROLES = [
  { value: "user", label: "User", desc: "Standard access" },
  { value: "editor", label: "Editor", desc: "Can create & edit content" },
  { value: "admin", label: "Admin", desc: "Full system access" },
];

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null); // { name, email }
  const [mounted, setMounted] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 8) e.password = "Minimum 8 characters.";
    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match.";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setApiError("");
  };

  const handleRoleSelect = (value) => {
    setForm((prev) => ({ ...prev, role: value }));
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
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          role: form.role,
        }),
      });

      const data = await res.json();

      if (res.status === 401 || res.status === 403) {
        navigate("/login", { replace: true });
        return;
      }
      if (!res.ok)
        throw new Error(data.message || data.error || "Registration failed.");

      setSuccess({ name: form.name.trim(), email: form.email.trim() });
      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "user",
      });
    } catch (err) {
      setApiError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --ink:        #0f0f0f;
          --paper:      #f5f2ec;
          --cream:      #ede8de;
          --accent:     #c8522a;
          --accent-dk:  #a0401e;
          --muted:      #8a8178;
          --border:     #d4cfc5;
          --green:      #2a7a4b;
          --green-bg:   #edf5f0;
          --green-br:   rgba(42,122,75,0.25);
        }

        html, body { height: 100%; background: var(--paper); }

        .page {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          font-family: 'DM Sans', sans-serif;
          color: var(--ink);
          opacity: 0;
          transition: opacity 0.5s ease;
        }
        .page.visible { opacity: 1; }

        /* ── LEFT: DARK PANEL ── */
        .panel-left {
          background: var(--ink);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 3rem;
          position: relative;
          overflow: hidden;
          transform: translateX(-20px);
          transition: transform 0.65s ease;
        }
        .page.visible .panel-left { transform: translateX(0); }

        .panel-left::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 55% 45% at 15% 85%, rgba(200,82,42,0.15) 0%, transparent 70%),
            radial-gradient(ellipse 35% 55% at 85% 15%, rgba(200,82,42,0.07) 0%, transparent 70%);
          pointer-events: none;
        }

        .left-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(200,82,42,0.15);
          border: 1px solid rgba(200,82,42,0.3);
          border-radius: 100px;
          padding: 0.3rem 0.75rem;
          width: fit-content;
        }
        .left-tag svg { flex-shrink: 0; }
        .left-tag span {
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--accent);
        }

        .left-headline {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(2.4rem, 3.5vw, 3.4rem);
          line-height: 1.1;
          color: #f5f2ec;
          position: relative;
          z-index: 1;
        }
        .left-headline em {
          font-style: italic;
          color: var(--accent);
        }

        .left-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
          position: relative;
          z-index: 1;
        }
        .stat-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          padding: 1rem;
        }
        .stat-num {
          font-family: 'Instrument Serif', serif;
          font-size: 1.8rem;
          color: var(--accent);
          line-height: 1;
          margin-bottom: 0.25rem;
        }
        .stat-label {
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #4a4745;
        }

        .left-footer {
          font-size: 0.7rem;
          color: #3a3735;
          letter-spacing: 0.04em;
        }

        .deco-text {
          position: absolute;
          bottom: -1rem;
          right: 1.5rem;
          font-family: 'Instrument Serif', serif;
          font-size: 11rem;
          line-height: 1;
          color: rgba(255,255,255,0.025);
          user-select: none;
          pointer-events: none;
        }

        /* ── RIGHT: FORM PANEL ── */
        .panel-right {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 3rem 4rem;
          overflow-y: auto;
          transform: translateX(20px);
          transition: transform 0.65s ease 0.1s;
        }
        .page.visible .panel-right { transform: translateX(0); }

        /* Top nav */
        .top-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2.5rem;
        }
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.78rem;
          color: var(--muted);
          text-decoration: none;
          transition: color 0.2s;
        }
        .back-link:hover { color: var(--ink); }
        .admin-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: #fdf0ec;
          border: 1px solid rgba(200,82,42,0.25);
          border-radius: 100px;
          padding: 0.28rem 0.7rem;
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--accent-dk);
        }
        .dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: var(--accent);
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.4; }
        }

        .form-shell { width: 100%; max-width: 400px; }

        .form-eyebrow {
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 0.4rem;
        }
        .form-title {
          font-family: 'Instrument Serif', serif;
          font-size: 2rem;
          font-weight: 400;
          margin-bottom: 2rem;
          line-height: 1.1;
        }

        /* Fields */
        .field-group { display: flex; flex-direction: column; gap: 1.1rem; margin-bottom: 1.5rem; }
        .field-row   { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

        .field { display: flex; flex-direction: column; gap: 0.4rem; }
        .field label {
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .field input {
          background: var(--cream);
          border: 1.5px solid var(--border);
          border-radius: 6px;
          padding: 0.8rem 1rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.92rem;
          color: var(--ink);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          -webkit-appearance: none;
        }
        .field input::placeholder { color: #b8b2a8; }
        .field input:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(200,82,42,0.12);
        }
        .field input:disabled { opacity: 0.6; cursor: not-allowed; }
        .field input.has-error { border-color: var(--accent); }

        .field-error {
          font-size: 0.7rem;
          color: var(--accent-dk);
          margin-top: 0.1rem;
        }

        /* Role selector */
        .role-section { margin-bottom: 1.5rem; }
        .role-label {
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 0.6rem;
          display: block;
        }
        .role-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.6rem;
        }
        .role-card {
          border: 1.5px solid var(--border);
          border-radius: 8px;
          padding: 0.75rem;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s, transform 0.15s;
          background: var(--cream);
          user-select: none;
        }
        .role-card:hover { border-color: #b8b2a8; transform: translateY(-1px); }
        .role-card.selected {
          border-color: var(--accent);
          background: #fdf0ec;
          box-shadow: 0 0 0 3px rgba(200,82,42,0.1);
        }
        .role-card-name {
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--ink);
          margin-bottom: 0.2rem;
        }
        .role-card-desc {
          font-size: 0.65rem;
          color: var(--muted);
          line-height: 1.3;
        }
        .role-card.selected .role-card-name { color: var(--accent-dk); }

        /* API error */
        .api-error {
          background: #fdf0ec;
          border: 1px solid rgba(200,82,42,0.3);
          color: var(--accent-dk);
          border-radius: 6px;
          padding: 0.7rem 1rem;
          font-size: 0.8rem;
          margin-bottom: 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          animation: shake 0.35s ease;
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        /* Success */
        .success-banner {
          background: var(--green-bg);
          border: 1px solid var(--green-br);
          border-radius: 8px;
          padding: 1rem 1.2rem;
          margin-bottom: 1.25rem;
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          animation: slideDown 0.35s ease;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .success-icon {
          flex-shrink: 0;
          width: 20px; height: 20px;
          border-radius: 50%;
          background: var(--green);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 1px;
        }
        .success-text strong {
          font-size: 0.82rem;
          color: var(--green);
          display: block;
          margin-bottom: 0.15rem;
        }
        .success-text p {
          font-size: 0.76rem;
          color: #4a7a5a;
          line-height: 1.4;
        }

        /* Submit button */
        .btn-submit {
          width: 100%;
          padding: 0.88rem 1rem;
          background: var(--accent);
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          transition: background 0.2s, transform 0.15s;
        }
        .btn-submit:hover:not(:disabled) { background: var(--accent-dk); transform: translateY(-1px); }
        .btn-submit:active:not(:disabled) { transform: translateY(0); }
        .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .spinner {
          width: 13px; height: 13px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Responsive */
        @media (max-width: 900px) {
          .panel-right { padding: 2.5rem 2rem; }
          .field-row { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .page { grid-template-columns: 1fr; }
          .panel-left { display: none; }
          .panel-right { padding: 2rem 1.5rem; justify-content: flex-start; padding-top: 2.5rem; }
        }
      `}</style>

      <div className={`page ${mounted ? "visible" : ""}`}>
        {/* ── LEFT PANEL ── */}
        <div className="panel-left">
          <div className="left-tag">
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#c8522a"
              strokeWidth="2.5"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>Admin Console</span>
          </div>

          <div className="left-headline">
            Expand the
            <br />
            team with
            <br />
            <em>intention.</em>
          </div>

          <div className="left-stats">
            <div className="stat-card">
              <div className="stat-num">3</div>
              <div className="stat-label">Role levels</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">JWT</div>
              <div className="stat-label">Auth method</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">8+</div>
              <div className="stat-label">Min. password</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">✓</div>
              <div className="stat-label">Admin-gated</div>
            </div>
          </div>

          <div className="left-footer">
            © {new Date().getFullYear()} · Admin access only
          </div>

          <div className="deco-text">R</div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="panel-right">
          <div className="form-shell">
            {/* Top nav */}
            <div className="top-nav">
              <a href="/dashboard" className="back-link">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Back to dashboard
              </a>
              <div className="admin-badge">
                <div className="dot" />
                Admin only
              </div>
            </div>

            <p className="form-eyebrow">User management</p>
            <h1 className="form-title">Register new user</h1>

            {/* Success banner */}
            {success && (
              <div className="success-banner" role="status">
                <div className="success-icon">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className="success-text">
                  <strong>Account created</strong>
                  <p>
                    <strong>{success.name}</strong> ({success.email}) has been
                    registered successfully.
                  </p>
                </div>
              </div>
            )}

            {/* API error */}
            {apiError && (
              <div className="api-error" role="alert">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="field-group">
                {/* Name */}
                <div className="field">
                  <label htmlFor="name">Full name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Jane Smith"
                    value={form.name}
                    onChange={handleChange}
                    disabled={loading}
                    className={errors.name ? "has-error" : ""}
                  />
                  {errors.name && (
                    <span className="field-error">{errors.name}</span>
                  )}
                </div>

                {/* Email */}
                <div className="field">
                  <label htmlFor="email">Email address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="off"
                    placeholder="jane@example.com"
                    value={form.email}
                    onChange={handleChange}
                    disabled={loading}
                    className={errors.email ? "has-error" : ""}
                  />
                  {errors.email && (
                    <span className="field-error">{errors.email}</span>
                  )}
                </div>

                {/* Passwords */}
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="password">Password</label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Min. 8 chars"
                      value={form.password}
                      onChange={handleChange}
                      disabled={loading}
                      className={errors.password ? "has-error" : ""}
                    />
                    {errors.password && (
                      <span className="field-error">{errors.password}</span>
                    )}
                  </div>
                  <div className="field">
                    <label htmlFor="confirmPassword">Confirm</label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Repeat password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      disabled={loading}
                      className={errors.confirmPassword ? "has-error" : ""}
                    />
                    {errors.confirmPassword && (
                      <span className="field-error">
                        {errors.confirmPassword}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Role selector */}
              <div className="role-section">
                <span className="role-label">Assign role</span>
                <div className="role-grid">
                  {ROLES.map((r) => (
                    <div
                      key={r.value}
                      className={`role-card ${form.role === r.value ? "selected" : ""}`}
                      onClick={() => !loading && handleRoleSelect(r.value)}
                      role="radio"
                      aria-checked={form.role === r.value}
                      tabIndex={0}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleRoleSelect(r.value)
                      }
                    >
                      <div className="role-card-name">{r.label}</div>
                      <div className="role-card-desc">{r.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="btn-submit"
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner" /> Creating account…
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
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <line x1="19" y1="8" x2="19" y2="14" />
                      <line x1="22" y1="11" x2="16" y2="11" />
                    </svg>
                    Create account
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
