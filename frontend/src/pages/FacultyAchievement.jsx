
import axios from "axios";
import { useEffect, useState } from "react";

const initialAchievements = [];

export default function FacultyAchievement() {
  const [achievements, setAchievements] = useState(initialAchievements);
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    facultyName: "",
    department: "",
    achievement: "",
    category: "",
    date: "",
    description: "",
  });

  const categories = [
    "All",
    "Academic",
    "Research",
    "Award",
    "Publication",
    "Innovation",
    "Other",
  ];

  const filteredAchievements =
    filter === "All"
      ? achievements
      : achievements.filter((a) => a.category === filter);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAchievement = {
      id: achievements.length + 1,
      ...formData,
    };
    setAchievements([newAchievement, ...achievements]);
    setFormData({
      facultyName: "",
      department: "",
      achievement: "",
      category: "",
      date: "",
      description: "",
    });
    setShowForm(false);
  };

  const API = import.meta.env.VITE_API_URL;


  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    };
    axios
      .get(`${API}/api/faculty-achievements`, config)
      .then((res) => setAchievements(res.data));
  }, [API]);

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
          --border: #d4cfc5;
          --shadow: rgba(15,15,15,0.08);
        }

        .achievements-page {
          min-height: 100vh;
          overflow-y: auto;
          padding: 24px 14px 36px;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          background: var(--paper);
          color: var(--ink);
        }

        .wrap {
          max-width: 1140px;
          margin: 0 auto;
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

        .title-section h1 {
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

        .topbar-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .btn {
          border: none;
          padding: 10px 18px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.15s ease, background 0.2s ease;
          text-decoration: none;
          display: inline-block;
        }

        .btn-primary {
          background: #fff;
          color: var(--accent-dark);
        }

        .btn-primary:hover {
          background: var(--cream);
          transform: translateY(-1px);
        }

        .btn-secondary {
          background: var(--cream);
          color: var(--accent-dark);
          border: 1px solid var(--border);
        }

        .btn-secondary:hover {
          background: var(--border);
          transform: translateY(-1px);
        }

        .filters {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
          flex-wrap: wrap;
          background: #fff;
          padding: 14px;
          border-radius: 14px;
          border: 1px solid var(--border);
        }

        .filter-btn {
          border: 1px solid #bfdbfe;
          background: #ffffff;
          color: #0f2347;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-btn:hover {
          background: #dbeafe;
        }

        .filter-btn.active {
          background: var(--mid);
          color: var(--accent-dark);
          border-color: var(--mid);
        }

        .grid {
          display: grid;
          gap: 14px;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
        }

        .card {
          border: 1px solid var(--line);
          background: var(--card);
          border-radius: 14px;
          padding: 18px;
          box-shadow: 0 10px 20px rgba(20, 40, 80, 0.07);
          position: relative;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
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

        .card h3 {
          margin: 0 0 8px;
          font-size: 19px;
          color: #16356e;
          line-height: 1.3;
        }

        .faculty-info {
          margin: 8px 0;
          color: #3f5f95;
          font-size: 13px;
          font-weight: 600;
        }

        .date {
          margin: 6px 0 12px;
          color: #516487;
          font-size: 13px;
        }

        .desc {
          margin: 0;
          color: #2b4778;
          line-height: 1.5;
          font-size: 14px;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 35, 71, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal {
          background: var(--paper);
          border-radius: 18px;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(15, 35, 71, 0.3);
        }

        .modal-header {
          background: var(--accent);
          color: #fff;
          padding: 20px 24px;
          border-radius: 18px 18px 0 0;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 24px;
        }

        .modal-body {
          padding: 24px;
          background: var(--paper);
        }

        .form-section {
          display: grid;
          gap: 16px;
        }

        .field {
          display: grid;
          gap: 8px;
        }

        label {
          font-size: 13px;
          font-weight: 600;
          color: #2f4671;
        }

        input, select, textarea {
          width: 100%;
          border: 1px solid #b9cfff;
          border-radius: 10px;
          padding: 11px 12px;
          font-size: 14px;
          color: var(--ink);
          background: var(--paper);
        }

        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: var(--mid);
          box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.15);
        }

        textarea {
          resize: vertical;
          min-height: 100px;
        }

        .modal-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          margin-top: 20px;
        }

        .btn-cancel {
          background: #e5e7eb;
          color: #374151;
        }

        .btn-cancel:hover {
          background: #d1d5db;
        }

        .btn-submit {
          background: var(--accent);
          color: #fff;
        }

        .btn-submit:hover {
          background: var(--mid-dark);
        }

        @media (max-width: 760px) {
          .achievements-page { padding: 12px 10px 24px; }
          .topbar { align-items: flex-start; flex-direction: column; }
          .title-section h1 { font-size: 26px; }
          .grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <main className="achievements-page">
        <div className="wrap">
          <div className="topbar">
            <div className="title-section">
              <h1>Faculty Achievements</h1>
              <p className="subtitle">
                Excellence and accomplishments of our faculty
              </p>
            </div>
            <div className="topbar-actions">
              <button
                className="btn btn-primary"
                onClick={() => setShowForm(true)}
              >
                + Add Achievement
              </button>
            </div>
          </div>

          <div className="filters">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${filter === cat ? "active" : ""}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <section className="grid">
            {filteredAchievements.map((achievement) => (
              <article className="card" key={achievement.id}>
                <span className="badge">{achievement.category}</span>
                <h3>{achievement.achievement}</h3>
                <p className="faculty-info">
                  {achievement.facultyName} • {achievement.department}
                </p>
                <p className="date">📅 {achievement.date}</p>
                <p className="desc">{achievement.description}</p>
              </article>
            ))}
          </section>
        </div>

        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Add New Achievement</h2>
              </div>
              <form className="modal-body" onSubmit={handleSubmit}>
                <div className="form-section">
                  <div className="field">
                    <label htmlFor="facultyName">Faculty Name</label>
                    <input
                      id="facultyName"
                      name="facultyName"
                      value={formData.facultyName}
                      onChange={handleChange}
                      required
                      placeholder="Enter faculty name"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="department">Department</label>
                    <input
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      required
                      placeholder="Enter department"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="achievement">Achievement Title</label>
                    <input
                      id="achievement"
                      name="achievement"
                      value={formData.achievement}
                      onChange={handleChange}
                      required
                      placeholder="Enter achievement title"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="category">Category</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select category</option>
                      <option value="Academic">Academic</option>
                      <option value="Research">Research</option>
                      <option value="Award">Award</option>
                      <option value="Publication">Publication</option>
                      <option value="Innovation">Innovation</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="date">Date</label>
                    <input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      placeholder="Select date"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      placeholder="Describe the achievement"
                    />
                  </div>
                </div>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn btn-cancel"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-submit">
                    Add Achievement
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
