// pages/AcademicData.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const AcademicData = () => {
  const [data, setData] = useState([]);
  const [reports, setReports] = useState([]);
  const [form, setForm] = useState({
    report_id: "",
    total_students: "",
    pass_percentage: "",
    toppers_count: "",
    academic_year: "",
    description: "",
  });
  const [editId, setEditId] = useState(null);

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/academic");
      setData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const fetchReports = async () => {
  try {
    const res = await axios.get("/api/reports");

    console.log("Reports API:", res.data);

    setReports(res.data.data);   // ← IMPORTANT FIX

  } catch (err) {
    console.error("Error fetching reports:", err);
  }
};

  useEffect(() => {
    fetchData();
    fetchReports();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`/api/academic/${editId}`, form);
      } else {
        await axios.post("/api/academic", form);
      }
      setForm({
        report_id: "",
        total_students: "",
        pass_percentage: "",
        toppers_count: "",
        academic_year: "",
        description: "",
      });
      setEditId(null);
      fetchData();
    } catch (err) {
      console.error("Error saving data:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/academic/${id}`);
      fetchData();
    } catch (err) {
      console.error("Error deleting data:", err);
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

  return (
    <div style={{ padding: "20px" }}>
      <h2>Academic Data</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <select
          name="report_id"
          value={form.report_id}
          onChange={handleChange}
          required
        >
          <option value="">Select Report</option>

          {Array.isArray(reports) &&
            reports.map((report) => (
              <option key={report.id} value={report.id}>
                {report.title} ({report.year})
              </option>
            ))}
        </select>
        <input
          type="number"
          name="total_students"
          placeholder="Total Students"
          value={form.total_students}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          step="0.01"
          name="pass_percentage"
          placeholder="Pass Percentage"
          value={form.pass_percentage}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="toppers_count"
          placeholder="Toppers Count"
          value={form.toppers_count}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="academic_year"
          placeholder="Academic Year"
          value={form.academic_year}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <button type="submit">{editId ? "Update" : "Add"}</button>
      </form>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Report ID</th>
            <th>Total Students</th>
            <th>Pass %</th>
            <th>Toppers</th>
            <th>Year</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((record) => (
            <tr key={record.id}>
              <td>{record.id}</td>
              <td>{record.report_id}</td>
              <td>{record.total_students}</td>
              <td>{record.pass_percentage}</td>
              <td>{record.toppers_count}</td>
              <td>{record.academic_year}</td>
              <td>{record.description}</td>
              <td>
                <button onClick={() => handleEdit(record)}>Edit</button>
                <button onClick={() => handleDelete(record.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan="8">No records found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AcademicData;
