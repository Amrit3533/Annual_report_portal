import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const API_BASE = import.meta.env.VITE_API_URL || "";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const emailRef = useRef(null);

  useEffect(() => {
    // Redirect if already logged in
    if (localStorage.getItem("token")) {
      navigate("/dashboard", { replace: true });
      return;
    }
    setMounted(true);
    setTimeout(() => emailRef.current?.focus(), 400);
  }, [navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Invalid credentials");
      }

      const token = data.token || data.accessToken || data.jwt;
      if (!token) throw new Error("No token received from server.");

      localStorage.setItem("token", token);

      // Optional: store user info if provided
      if (data.user) localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
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
          --ink: #0f0f0f;
          --paper: #f5f2ec;
          --cream: #ede8de;
          --accent: #c8522a;
          --accent-dark: #a0401e;
          --muted: #8a8178;
          --border: #d4cfc5;
          --shadow: rgba(15,15,15,0.08);
        }

        html, body { height: 100%; }

        .login-root {
          min-height: 100vh;
          background: var(--paper);
          display: grid;
          grid-template-columns: 1fr 1fr;
          font-family: 'DM Sans', sans-serif;
          color: var(--ink);
          overflow: hidden;
        }

        /* ── LEFT PANEL ── */
        .panel-left {
          background: var(--ink);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 3rem;
          position: relative;
          overflow: hidden;
          opacity: 0;
          transform: translateX(-24px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .panel-left.visible { opacity: 1; transform: translateX(0); }

        .panel-left::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 50% at 20% 80%, rgba(200,82,42,0.18) 0%, transparent 70%),
            radial-gradient(ellipse 40% 60% at 80% 20%, rgba(200,82,42,0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .left-rule {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .left-rule span {
          display: block;
          width: 28px;
          height: 2px;
          background: var(--accent);
        }
        .left-rule p {
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--muted);
        }

        .left-headline {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(2.6rem, 4vw, 3.8rem);
          line-height: 1.08;
          color: #f5f2ec;
          position: relative;
          z-index: 1;
        }
        .left-headline em {
          font-style: italic;
          color: var(--accent);
        }

        .left-footer {
          font-size: 0.72rem;
          color: #4a4745;
          letter-spacing: 0.04em;
          position: relative;
          z-index: 1;
        }

        /* Decorative number */
        .deco-number {
          position: absolute;
          bottom: -0.5rem;
          right: 2rem;
          font-family: 'Instrument Serif', serif;
          font-size: 14rem;
          line-height: 1;
          color: rgba(255,255,255,0.03);
          user-select: none;
          pointer-events: none;
        }

        /* ── RIGHT PANEL ── */
        .panel-right {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 3rem 4rem;
          opacity: 0;
          transform: translateX(24px);
          transition: opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s;
        }
        .panel-right.visible { opacity: 1; transform: translateX(0); }

        .form-shell {
          width: 100%;
          max-width: 360px;
        }

        .form-eyebrow {
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 0.5rem;
        }

        .form-title {
          font-family: 'Instrument Serif', serif;
          font-size: 2.2rem;
          font-weight: 400;
          color: var(--ink);
          margin-bottom: 2.5rem;
          line-height: 1.1;
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin-bottom: 1rem;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .field label {
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
        }

        .field input {
          background: var(--cream);
          border: 1.5px solid var(--border);
          border-radius: 6px;
          padding: 0.85rem 1rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          color: var(--ink);
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          -webkit-appearance: none;
        }
        .field input::placeholder { color: #b8b2a8; }
        .field input:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(200,82,42,0.12);
        }
        .field input:disabled { opacity: 0.6; cursor: not-allowed; }

        .forgot {
          text-align: right;
          margin-bottom: 2rem;
        }
        .forgot a {
          font-size: 0.75rem;
          color: var(--muted);
          text-decoration: none;
          transition: color 0.2s;
        }
        .forgot a:hover { color: var(--accent); }

        .error-msg {
          background: #fdf0ec;
          border: 1px solid rgba(200,82,42,0.3);
          color: var(--accent-dark);
          border-radius: 6px;
          padding: 0.75rem 1rem;
          font-size: 0.82rem;
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

        .btn-submit {
          width: 100%;
          padding: 0.9rem 1rem;
          background: var(--accent);
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.88rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: background 0.2s ease, transform 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
        }
        .btn-submit:hover:not(:disabled) { background: var(--accent-dark); transform: translateY(-1px); }
        .btn-submit:active:not(:disabled) { transform: translateY(0); }
        .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 1.75rem 0;
        }
        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border);
        }
        .divider span {
          font-size: 0.7rem;
          color: var(--muted);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .signup-prompt {
          text-align: center;
          font-size: 0.8rem;
          color: var(--muted);
        }
        .signup-prompt a {
          color: var(--ink);
          font-weight: 500;
          text-decoration: none;
          border-bottom: 1px solid var(--border);
          transition: border-color 0.2s, color 0.2s;
        }
        .signup-prompt a:hover { color: var(--accent); border-color: var(--accent); }

        /* ── RESPONSIVE ── */
        @media (max-width: 768px) {
          .login-root { grid-template-columns: 1fr; }
          .panel-left { display: none; }
          .panel-right { padding: 2.5rem 1.75rem; }
        }
      `}</style>

      <div className="login-root">
        {/* LEFT */}
        <div className={`panel-left ${mounted ? "visible" : ""}`}>
          <div className="left-rule">
            <span />
            <p>Secure Access</p>
            <span></span>
          </div>

          <div className="left-headline">
            Annual Report Portal<br />
            for

            <em> Institutional</em> <br />
            excellence
          </div>

          <div className="left-footer">
            © {new Date().getFullYear()} · All rights reserved
          </div>

          <div className="deco-number">6</div>
        </div>

        {/* RIGHT */}
        <div className={`panel-right ${mounted ? "visible" : ""}`}>
          <div className="form-shell">
            <p className="form-eyebrow">Welcome back</p>
            <h1 className="form-title">Sign in</h1>

            <form onSubmit={handleSubmit} noValidate>
              <div className="field-group">
                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input
                    ref={emailRef}
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </div>

                <div className="field password-field">
                  <label htmlFor="password">Password</label>
                  <div className="password-input-wrapper">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="toggle-password-btn"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.06 10.06 0 0 1 12 20c-5 0-9.27-3.11-11-8 1.21-3.06 3.6-5.5 6.53-6.71"/><path d="M1 1l22 22"/><path d="M9.53 9.53A3.5 3.5 0 0 0 12 16.5c1.38 0 2.63-.83 3.16-2.03"/><path d="M14.47 14.47A3.5 3.5 0 0 1 12 7.5c-.62 0-1.2.16-1.7.44"/></svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12S5 5 12 5s11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3.5"/></svg>
                      )}
                    </button>
                  </div>
                  <style>{`
                    .password-field .password-input-wrapper {
                      display: flex;
                      align-items: stretch;
                      position: relative;
                    }
                    .password-field input[type="password"],
                    .password-field input[type="text"] {
                      flex: 1 1 auto;
                      border-top-right-radius: 0;
                      border-bottom-right-radius: 0;
                      border-right: none;
                    }
                    .toggle-password-btn {
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      width: 48px;
                      min-width: 48px;
                      height: auto;
                      background: none;
                      border: 1.5px solid var(--border);
                      border-left: none;
                      border-top-right-radius: 6px;
                      border-bottom-right-radius: 6px;
                      color: #8a8178;
                      cursor: pointer;
                      transition: color 0.2s, background 0.2s;
                      padding: 0;
                    }
                    .toggle-password-btn svg {
                      display: block;
                    }
                    .toggle-password-btn:hover,
                    .toggle-password-btn:focus {
                      color: #c8522a;
                      background: #f5f2ec;
                      outline: none;
                    }
                  `}</style>
                </div>
              </div>

              <div className="forgot">
                <a href="/forgot-password">Forgot password?</a>
              </div>

              {error && (
                <div className="error-msg" role="alert">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="btn-submit"
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner" />
                    Signing in…
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>


            
          </div>
        </div>
      </div>
    </>
  );
}