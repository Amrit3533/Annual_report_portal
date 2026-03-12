
import React, { useState } from "react";

const API = import.meta.env.VITE_API_URL;

export default function FinancialForm() {
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API}/api/financial`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Submission failed");
      setMessage("Financial data submitted successfully.");
    } catch (err) {
      setMessage("Error submitting financial data.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Example fields, replace with your actual form fields */}
      <input name="amount" placeholder="Amount" onChange={handleChange} />
      <input name="description" placeholder="Description" onChange={handleChange} />
      <button type="submit">Submit</button>
      {message && <div>{message}</div>}
    </form>
  );
}
