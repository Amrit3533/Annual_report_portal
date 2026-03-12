const activities = [
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

export default function ExtracurricularActivities() {
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
          </div>

          <section className="grid">
            {activities.map((activity) => (
              <article className="card" key={activity.title}>
                <span className="badge">{activity.category}</span>
                <h3>{activity.title}</h3>
                <p className="date">{activity.date}</p>
                <p className="desc">{activity.description}</p>
              </article>
            ))}
          </section>
        </div>
      </main>
    </>
  );
}
