import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const EditReport = () => {
  const { id } = useParams();   // 👈 important
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    year: "",
    department_id: "",
    description: "",
  });

  // 🔹 Fetch existing report data
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get(`${API}/api/reports/reports/${id}`);
        setForm(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchReport();
  }, [id]);

  // 🔹 Handle change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${API}/api/reports/${id}`, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("Report updated");
      navigate("/dashboard/reports");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Edit Report</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
        />

        <input
          name="year"
          value={form.year}
          onChange={handleChange}
          placeholder="Year"
        />

        <input
          name="department_id"
          value={form.department_id}
          onChange={handleChange}
          placeholder="Department ID"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
        />

        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default EditReport;