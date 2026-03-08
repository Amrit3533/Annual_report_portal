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

export default function Activities() {
  return (
    <>
      <style>{`
        * { box-sizing: border-box; }

        .activities-page {
          min-height: 100vh;
          overflow-y: auto;
          padding: 24px 14px 36px;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          background:
            radial-gradient(circle at 10% 10%, rgba(37, 99, 235, 0.10), transparent 35%),
            radial-gradient(circle at 90% 20%, rgba(14, 116, 144, 0.10), transparent 35%),
            linear-gradient(180deg, #f9fbff 0%, #eff5ff 100%);
          color: #17213a;
        }

        .wrap {
          max-width: 980px;
          margin: 0 auto;
        }

        .topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
          gap: 10px;
        }

        .title {
          margin: 0;
          font-size: 32px;
          line-height: 1.1;
          letter-spacing: -0.01em;
        }

        .subtitle {
          margin: 8px 0 0;
          color: #4a5b7a;
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
          gap: 12px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .card {
          border: 1px solid #dce6fa;
          background: #ffffff;
          border-radius: 14px;
          padding: 16px;
          box-shadow: 0 10px 20px rgba(20, 40, 80, 0.06);
        }

        .badge {
          display: inline-block;
          font-size: 11px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          background: #dbeafe;
          color: #1e3a8a;
          border-radius: 999px;
          padding: 5px 9px;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .card h3 {
          margin: 0;
          font-size: 20px;
        }

        .date {
          margin: 8px 0 12px;
          color: #475a7a;
          font-size: 13px;
        }

        .desc {
          margin: 0;
          color: #2a3852;
          line-height: 1.5;
          font-size: 14px;
        }

        @media (max-width: 760px) {
          .activities-page { padding: 12px 10px 24px; }
          .topbar { align-items: flex-start; flex-direction: column; }
          .title { font-size: 26px; }
          .grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <main className="activities-page">
        <div className="wrap">
          <div className="topbar">
            <div>
              <h1 className="title">Activities</h1>
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
