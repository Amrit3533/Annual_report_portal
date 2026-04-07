import React, { useState } from "react";

const initialActivities = [
  {
    title: "Tech Symposium 2026",
    date: "Mar 20, 2026",
    category: "Seminar",
    description: "Industry experts will discuss AI trends, cloud systems, and modern engineering practices.",
  },
  {
    title: "Coding Challenge Week",
    date: "Apr 03, 2026",
    category: "Competition",
    description: "Team-based coding rounds with real-world problem statements and prize awards.",
  },
  {
    title: "Research Paper Workshop",
    date: "Apr 18, 2026",
    category: "Workshop",
    description: "Hands-on training on research methods, citation style, and publication submission.",
  },
  {
    title: "Career Guidance Session",
    date: "May 02, 2026",
    category: "Career",
    description: "Resume reviews, interview tips, and internship planning from senior mentors.",
  },
  {
    title: "Community Outreach Program",
    date: "May 15, 2026",
    category: "Social",
    description: "Student-led social initiative focused on education support and local engagement.",
  },
  {
    title: "Annual Cultural Fest",
    date: "Jun 01, 2026",
    category: "Festival",
    description: "Music, drama, dance, and club showcases celebrating student creativity.",
  },
];

function AddActivityModal({ open, onClose, onAdd }) {
  const [form, setForm] = useState({
    title: "",
    date: "",
    category: "",
    description: "",
  });
  React.useEffect(() => {
    if (open) setForm({ title: "", date: "", category: "", description: "" });
  }, [open]);
  if (!open) return null;
  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.18)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <form
        onSubmit={e => { e.preventDefault(); onAdd(form); }}
        style={{ background: "#fff", borderRadius: 18, minWidth: 320, maxWidth: 400, width: "90vw", boxShadow: "0 2px 16px 0 rgba(0,0,0,0.10)", display: "flex", flexDirection: "column", gap: 0, padding: 0 }}
        autoComplete="off"
      >
        <div style={{ background: "linear-gradient(90deg,#5b5bf7,#a0401e)", borderTopLeftRadius: 18, borderTopRightRadius: 18, padding: "20px 24px 12px 24px", color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 22, fontWeight: 700 }}>Add Activity</span>
          <button type="button" onClick={onClose} style={{ background: "none", border: "none", color: "#fff", fontSize: 24, cursor: "pointer" }}>&#10005;</button>
        </div>
        <div style={{ padding: "20px 24px 0 24px", display: "flex", flexDirection: "column", gap: 14 }}>
          <input required placeholder="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={inputStyle} />
          <input required placeholder="Date (e.g. Mar 20, 2026)" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={inputStyle} />
          <input required placeholder="Category" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={inputStyle} />
          <textarea required placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ ...inputStyle, minHeight: 60, resize: "vertical" }} />
        </div>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", padding: "0 0 20px 0", marginTop: 14 }}>
          <button type="button" onClick={onClose} style={{ background: "#fff", color: "#444", border: "1.5px solid #e0e0e0", borderRadius: 8, padding: "10px 24px", fontWeight: 600, fontSize: 16, cursor: "pointer", minWidth: 90 }}>Cancel</button>
          <button type="submit" style={{ background: "linear-gradient(90deg,#5b5bf7,#a0401e)", color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontWeight: 600, fontSize: 16, cursor: "pointer", minWidth: 120 }}>Add Activity</button>
        </div>
      </form>
    </div>
  );
}

const inputStyle = {
  padding: "12px 14px",
  borderRadius: 8,
  border: "1.5px solid #e0e0e0",
  fontSize: 15,
  outline: "none",
  fontWeight: 500,
  background: "#fafbfc",
  color: "#222", // Make input text dark for visibility
  marginBottom: 0,
  width: "100%",
  boxSizing: "border-box",
};

export default function ExtracurricularActivities() {
  const [activities, setActivities] = useState(initialActivities);
  const [modalOpen, setModalOpen] = useState(false);
  const handleAddActivity = (form) => {
    setActivities(prev => [{ ...form }, ...prev]);
    setModalOpen(false);
  };
  return (
    <>
      <style>{`
        * { box-sizing: border-box; }

        :root {
          --ink: #0f0f0f;
          --paper: #f5f2ec;
          --cream: #ede8de;
          --accent: #c8522a;
          --accent-dark: #a0401e;
          --muted: #8a8178;
        .badge {
          display: inline-block;
          font-size: 11px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          background: #c8522a;
          color: #fff;
          border-radius: 999px;
          padding: 5px 10px;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .wrap {
          max-width: 1140px;
          margin: 0 auto;
          width: 100%;
        }

        .topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          gap: 10px;
          background: var(--accent);
          border: 1px solid var(--accent-dark);
          border-radius: 18px;
          padding: 22px 24px;
          box-shadow: 0 14px 26px var(--shadow);
        }

        .title {
          margin: 0;
          font-size: 34px;
          line-height: 1.06;
          letter-spacing: -0.01em;
          color: #fff;
        }

        .subtitle {
          margin: 8px 0 0;
          color: var(--cream);
          font-size: 14px;
        }

        .nav-link {
          text-decoration: none;
          background: #1d4ed8;
          color: #ffffff;
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 14px;
          font-weight: 600;
          white-space: nowrap;
        }

        .nav-link:hover {
          background: #1e40af;
        }

        .grid {
          display: grid;
          gap: 24px;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          align-items: stretch;
        }

          .card::before {
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            height: 4px;
            background: linear-gradient(90deg, #a0401e, #c8522a);
          }
        }

        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 28px rgba(20, 40, 80, 0.12);
        }

        .card::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 4px;
          background: linear-gradient(90deg, #1d4ed8, #60a5fa);
        }

        .badge {
          display: inline-block;
          font-size: 11px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          background: #dbeafe;
          color: #16356e;
          border-radius: 999px;
          padding: 5px 10px;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .card {
          border: 1px solid var(--border);
          background: #fff;
          border-radius: 14px;
          padding: 24px 20px 20px 20px;
          box-shadow: 0 10px 20px rgba(20, 40, 80, 0.07);
          position: relative;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          min-height: 210px;
        }
          font-size: 13px;
        }

        .desc {
          margin: 0;
          color: #2b4778;
          line-height: 1.5;
          font-size: 14px;
        }

        @media (max-width: 900px) {
          .wrap { max-width: 100%; padding: 0 6px; }
          .grid { grid-template-columns: 1fr 1fr; gap: 16px; }
        }
        @media (max-width: 760px) {
          .activities-page { padding: 12px 4px 24px; }
          .topbar { align-items: flex-start; flex-direction: column; }
          .title { font-size: 26px; }
          .grid { grid-template-columns: 1fr; gap: 12px; }
          .card { min-width: 0; min-height: 160px; padding: 16px 8px 14px 8px; }
        }
      `}</style>

      <main className="activities-page">
        <div className="wrap">
          <div className="topbar">
            <div>
              <h1 className="title">Extracurricular Activities</h1>
              <p className="subtitle">Upcoming events, workshops, and student programs</p>
            </div>
            <button onClick={() => setModalOpen(true)} style={{ background: "linear-gradient(90deg,#5b5bf7,#a0401e)", color: "#fff", border: "none", borderRadius: 10, padding: "12px 24px", fontWeight: 600, fontSize: 16, cursor: "pointer", marginLeft: 12 }}>+ Add Activity</button>
          </div>
          <section className="grid">
            {activities.map((activity) => (
              <article className="card" key={activity.title + activity.date}>
                <span className="badge">{activity.category}</span>
                <h3>{activity.title}</h3>
                <p className="date">{activity.date}</p>
                <p className="desc">{activity.description}</p>
              </article>
            ))}
          </section>
        </div>
        <AddActivityModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={handleAddActivity} />
      </main>
    </>
  );
}
