import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "";

const emptyForm = {
  report_id: "",
  total_students: "",
  pass_percentage: "",
  toppers_count: "",
  academic_year: "",
  description: "",
};

const AcademicData = () => {
  const [data, setData] = useState([]);
  const [reports, setReports] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API}/api/academic`);
      setData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Unable to load academic records right now.");
    }
  };

  const fetchReports = async () => {
    try {
      const res = await axios.get(`${API}/api/reports`);
      const normalizedReports = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
      setReports(normalizedReports);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setReports([]);
    }
  };

  useEffect(() => {
    const load = async () => {
      await Promise.allSettled([fetchData(), fetchReports()]);
      setLoading(false);
    };

    load();
  }, []);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editId) {
        await axios.put(`${API}/api/academic/${editId}`, form);
      } else {
        await axios.post(`${API}/api/academic`, form);
      }

      resetForm();
      setError("");
      fetchData();
    } catch (err) {
      console.error("Error saving data:", err);
      setError("Unable to save the record. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/api/academic/${id}`);
      setError("");
      fetchData();
    } catch (err) {
      console.error("Error deleting data:", err);
      setError("Unable to delete the selected record.");
    }
  };

  const handleEdit = (record) => {
    setForm({
      report_id: record.report_id,
      total_students: record.total_students,
      pass_percentage: record.pass_percentage,
      toppers_count: record.toppers_count,
      academic_year: record.academic_year,
      description: record.description || "",
    });
    setEditId(record.id);
  };

  const summary = useMemo(() => {
    const totalRecords = data.length;
    const averagePass =
      totalRecords > 0
        ? (
            data.reduce((sum, record) => sum + Number(record.pass_percentage || 0), 0) /
            totalRecords
          ).toFixed(1)
        : "0.0";

    return [
      { label: "Records", value: totalRecords },
      { label: "Avg pass %", value: `${averagePass}%` },
      { label: "Reports", value: reports.length },
    ];
  }, [data, reports.length]);

  const reportLabelById = useMemo(() => {
    return reports.reduce((accumulator, report) => {
      const title = report.title || report.name || "Report";
      const year = report.year || report.academic_year || "N/A";
      accumulator[String(report.id)] = `${title} (${year})`;
      return accumulator;
    }, {});
  }, [reports]);

  const getReportLabel = (report) => {
    const title = report.title || report.name || "Report";
    const year = report.year || report.academic_year || "N/A";
    return `${title} (${year})`;
  };

  return (
    <div className="academic-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&family=Instrument+Serif:ital@0;1&display=swap');

        .academic-page {
          min-height: 100vh;
          padding: 28px;
          background:
            radial-gradient(circle at top left, rgba(200, 82, 42, 0.08), transparent 30%),
            radial-gradient(circle at bottom right, rgba(15, 15, 15, 0.05), transparent 28%),
            #f5f2ec;
        }

        .academic-shell {
          max-width: 1480px;
          margin: 0 auto;
        }

        .academic-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .academic-headline {
          max-width: 760px;
        }

        .academic-kicker {
          margin: 0 0 10px;
          color: #c8522a;
          text-transform: uppercase;
          letter-spacing: 0.22em;
          font-size: 0.72rem;
          font-weight: 700;
        }

        .academic-title {
          margin: 0;
          font-family: 'Instrument Serif', Georgia, serif;
          font-size: clamp(2.2rem, 4vw, 3.6rem);
          line-height: 0.95;
          letter-spacing: -0.02em;
          color: #121212;
        }

        .academic-copy {
          margin: 10px 0 0;
          color: #7d746b;
          line-height: 1.6;
          max-width: 68ch;
        }

        .academic-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .academic-pill {
          border-radius: 999px;
          padding: 0.52rem 0.85rem;
          background: rgba(255, 255, 255, 0.72);
          border: 1px solid rgba(212, 207, 197, 0.9);
          color: #7d746b;
          font-size: 0.82rem;
          box-shadow: 0 10px 30px rgba(15, 15, 15, 0.05);
        }

        .academic-notice {
          margin-bottom: 18px;
          padding: 0.95rem 1rem;
          border-radius: 14px;
          border: 1px solid rgba(200, 82, 42, 0.22);
          background: rgba(200, 82, 42, 0.08);
          color: #a0401e;
        }

        .academic-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1.25fr);
          gap: 24px;
          align-items: start;
        }

        .academic-card {
          background: rgba(255, 250, 244, 0.92);
          border: 1px solid rgba(212, 207, 197, 0.95);
          border-radius: 30px;
          box-shadow: 0 22px 60px rgba(15, 15, 15, 0.08);
          backdrop-filter: blur(16px);
        }

        .academic-panel {
          padding: 24px;
        }

        .academic-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 20px;
        }

        .academic-panel-title {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #121212;
        }

        .academic-panel-subtitle {
          margin: 8px 0 0;
          color: #7d746b;
          line-height: 1.55;
        }

        .academic-editor {
          display: grid;
          gap: 14px;
        }

        .academic-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .academic-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .academic-field label {
          color: #7d746b;
          font-size: 0.76rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-weight: 700;
        }

        .academic-input,
        .academic-select,
        .academic-textarea {
          width: 100%;
          border: 1px solid rgba(212, 207, 197, 0.95);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.88);
          color: #121212;
          padding: 0.92rem 1rem;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
        }

        .academic-input:focus,
        .academic-select:focus,
        .academic-textarea:focus {
          border-color: rgba(200, 82, 42, 0.7);
          box-shadow: 0 0 0 4px rgba(200, 82, 42, 0.12);
        }

        .academic-textarea {
          min-height: 120px;
          resize: vertical;
        }

        .academic-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 6px;
        }

        .academic-btn {
          border: none;
          border-radius: 14px;
          padding: 0.92rem 1.2rem;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.16s ease, background 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
        }

        .academic-btn:hover {
          transform: translateY(-1px);
        }

        .academic-btn-primary {
          background: #c8522a;
          color: #fff;
          box-shadow: 0 14px 30px rgba(200, 82, 42, 0.24);
        }

        .academic-btn-primary:hover {
          background: #a0401e;
        }

        .academic-btn-secondary {
          background: rgba(237, 232, 222, 0.95);
          color: #121212;
        }

        .academic-btn-danger {
          background: rgba(200, 82, 42, 0.12);
          color: #a0401e;
        }

        .academic-summary {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .academic-table-wrap {
          overflow: auto;
          border-radius: 22px;
          border: 1px solid rgba(212, 207, 197, 0.7);
          background: rgba(255, 255, 255, 0.7);
        }

        .academic-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 760px;
        }

        .academic-table th,
        .academic-table td {
          padding: 14px 16px;
          text-align: left;
          border-bottom: 1px solid rgba(212, 207, 197, 0.55);
          vertical-align: top;
        }

        .academic-table th {
          font-size: 0.73rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #7d746b;
          background: rgba(237, 232, 222, 0.55);
        }

        .academic-table td {
          font-size: 0.95rem;
          color: #121212;
        }

        .academic-table tr:last-child td {
          border-bottom: none;
        }

        .academic-table-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .academic-empty {
          padding: 28px 16px;
          text-align: center;
          color: #7d746b;
        }

        .academic-table-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 0.34rem 0.72rem;
          background: rgba(200, 82, 42, 0.12);
          color: #a0401e;
          font-size: 0.78rem;
          font-weight: 700;
        }

        @media (max-width: 1200px) {
          .academic-layout {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .academic-page {
            padding: 16px;
          }

          .academic-header {
            align-items: flex-start;
          }

          .academic-grid {
            grid-template-columns: 1fr;
          }

          .academic-panel {
            padding: 20px;
          }

          .academic-table {
            min-width: 680px;
          }
        }
      `}</style>

      <div className="academic-shell">
        <header className="academic-header">
          <div className="academic-headline">
            <p className="academic-kicker">Academic records</p>
            <h1 className="academic-title">Academic Data</h1>
            <p className="academic-copy">
              Enter and maintain academic summary data with a cleaner editor, stronger spacing, and a better table view.
            </p>
          </div>
          <div className="academic-meta">
            {summary.map((item) => (
              <span key={item.label} className="academic-pill">
                {item.value} {item.label}
              </span>
            ))}
          </div>
        </header>

        {error ? <div className="academic-notice">{error}</div> : null}

        <section className="academic-layout">
          <div className="academic-card academic-panel">
            <div className="academic-head" style={{ marginBottom: 0 }}>
              <div>
                <p className="academic-kicker">Record editor</p>
                <h2 className="academic-panel-title">{editId ? "Update academic record" : "Add academic record"}</h2>
                <p className="academic-panel-subtitle">
                  Keep each report-linked record structured and easy to review.
                </p>
              </div>
            </div>

            <form className="academic-editor" onSubmit={handleSubmit}>
              <div className="academic-grid">
                <div className="academic-field">
                  <label htmlFor="report_id">Report</label>
                  <select
                    className="academic-select"
                    id="report_id"
                    name="report_id"
                    value={form.report_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select report</option>
                    {Array.isArray(reports) && reports.map((report) => (
                      <option key={report.id} value={report.id}>
                        {getReportLabel(report)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="academic-field">
                  <label htmlFor="academic_year">Academic year</label>
                  <input
                    className="academic-input"
                    type="number"
                    name="academic_year"
                    id="academic_year"
                    placeholder="2025"
                    value={form.academic_year}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="academic-field">
                  <label htmlFor="total_students">Total students</label>
                  <input
                    className="academic-input"
                    type="number"
                    name="total_students"
                    id="total_students"
                    placeholder="1200"
                    value={form.total_students}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="academic-field">
                  <label htmlFor="pass_percentage">Pass percentage</label>
                  <input
                    className="academic-input"
                    type="number"
                    step="0.01"
                    name="pass_percentage"
                    id="pass_percentage"
                    placeholder="92.5"
                    value={form.pass_percentage}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="academic-field">
                  <label htmlFor="toppers_count">Toppers count</label>
                  <input
                    className="academic-input"
                    type="number"
                    name="toppers_count"
                    id="toppers_count"
                    placeholder="25"
                    value={form.toppers_count}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="academic-field">
                  <label htmlFor="description">Description</label>
                  <textarea
                    className="academic-textarea"
                    name="description"
                    id="description"
                    placeholder="Optional note about the record"
                    value={form.description}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="academic-actions">
                <button className="academic-btn academic-btn-primary" type="submit">
                  {editId ? "Update record" : "Add record"}
                </button>
                {editId ? (
                  <button className="academic-btn academic-btn-secondary" type="button" onClick={resetForm}>
                    Cancel edit
                  </button>
                ) : null}
              </div>
            </form>
          </div>

          <div className="academic-card academic-panel">
            <div className="academic-head">
              <div>
                <p className="academic-kicker">Saved entries</p>
                <h2 className="academic-panel-title">Academic data table</h2>
                <p className="academic-panel-subtitle">
                  Track every entry with edit and delete actions in one view.
                </p>
              </div>
              <div className="academic-table-badge">{loading ? "Loading" : `${data.length} rows`}</div>
            </div>

            <div className="academic-table-wrap">
              <table className="academic-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Report</th>
                    <th>Total students</th>
                    <th>Pass %</th>
                    <th>Toppers</th>
                    <th>Year</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {!loading && data.map((record) => (
                    <tr key={record.id}>
                      <td>{record.id}</td>
                      <td>{reportLabelById[String(record.report_id)] || record.report_id}</td>
                      <td>{record.total_students}</td>
                      <td>{record.pass_percentage}</td>
                      <td>{record.toppers_count}</td>
                      <td>{record.academic_year}</td>
                      <td>{record.description || "-"}</td>
                      <td>
                        <div className="academic-table-actions">
                          <button className="academic-btn academic-btn-secondary" type="button" onClick={() => handleEdit(record)}>
                            Edit
                          </button>
                          <button className="academic-btn academic-btn-danger" type="button" onClick={() => handleDelete(record.id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!loading && data.length === 0 ? (
                    <tr>
                      <td className="academic-empty" colSpan="8">
                        No academic records found.
                      </td>
                    </tr>
                  ) : null}
                  {loading ? (
                    <tr>
                      <td className="academic-empty" colSpan="8">
                        Loading academic records...
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AcademicData;
