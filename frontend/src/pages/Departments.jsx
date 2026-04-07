import axios from "axios";
import React, { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";

function AddDepartmentModal({ open, onClose, onAdd, loading }) {
  const [form, setForm] = useState({
    department: "",
    hod: "",
    email: "",
    faculty: "",
    publications: "",
  });

  // Reset form when modal opens
  React.useEffect(() => {
    if (open) {
      setForm({
        department: "",
        hod: "",
        email: "",
        faculty: "",
        publications: "",
      });
    }
  }, [open]);

  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.18)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form
        className="departments-modal-form"
        onSubmit={(e) => {
          e.preventDefault();
          onAdd(form);
        }}
        style={{
          background: "#fff",
          borderRadius: 28,
          minWidth: 340,
          maxWidth: 480,
          width: "90vw",
          maxHeight: 540,
          display: "flex",
          flexDirection: "column",
          padding: 0,
          boxShadow: "0 2px 16px 0 rgba(0,0,0,0.10)",
          transition: "width 0.2s, min-width 0.2s, max-width 0.2s",
        }}
        autoComplete="off"
      >
        <div
          style={{
            background: "linear-gradient(90deg,#5b5bf7,#a0401e)",
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            padding: "28px 32px 18px 32px",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 28, fontWeight: 700 }}>Add Department</span>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#fff",
              fontSize: 28,
              cursor: "pointer",
            }}
            aria-label="Close"
          >
            <X size={32} />
          </button>
        </div>
        <div
          style={{
            padding: "32px 32px 0 32px",
            display: "flex",
            flexDirection: "column",
            gap: 18,
            overflowY: "auto",
            flex: 1,
            minHeight: 0,
            maxHeight: 320,
          }}
        >
          <input
            required
            placeholder="Department Name"
            value={form.department}
            onChange={(e) =>
              setForm((f) => ({ ...f, department: e.target.value }))
            }
            style={inputStyle}
          />
          <input
            required
            placeholder="HOD Name"
            value={form.hod}
            onChange={(e) => setForm((f) => ({ ...f, hod: e.target.value }))}
            style={inputStyle}
          />
          <input
            required
            placeholder="HOD Email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            style={inputStyle}
          />
          <input
            required
            placeholder="Faculty Count"
            value={form.faculty}
            onChange={(e) =>
              setForm((f) => ({ ...f, faculty: e.target.value }))
            }
            style={inputStyle}
          />
          <input
            required
            placeholder="Publications"
            value={form.publications}
            onChange={(e) =>
              setForm((f) => ({ ...f, publications: e.target.value }))
            }
            style={inputStyle}
          />
        </div>
        <div
          style={{
            display: "flex",
            gap: 18,
            justifyContent: "center",
            padding: "0 0 32px 0",
            marginTop: 18,
            background: "#fff",
            borderBottomLeftRadius: 28,
            borderBottomRightRadius: 28,
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "#fff",
              color: "#444",
              border: "1.5px solid #e0e0e0",
              borderRadius: 10,
              padding: "12px 32px",
              fontWeight: 600,
              fontSize: 18,
              cursor: "pointer",
              boxShadow: "0 1px 4px 0 rgba(0,0,0,0.04)",
              minWidth: 120,
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading
                ? "#ccc"
                : "linear-gradient(90deg,#5b5bf7,#a0401e)",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "12px 32px",
              fontWeight: 600,
              fontSize: 18,
              cursor: loading ? "not-allowed" : "pointer",
              minWidth: 180,
            }}
          >
            {loading ? "Adding..." : "Add Department"}
          </button>
        </div>
      </form>
    </div>
  );
}

const inputStyle = {
  padding: "16px 18px",
  borderRadius: 12,
  border: "1.5px solid #e0e0e0",
  fontSize: 17,
  outline: "none",
  fontWeight: 500,
  background: "#fafbfc",
  marginBottom: 0,
  width: "100%",
  boxSizing: "border-box",
};

const responsiveStyles = `
@media (max-width: 700px) {
  .departments-modal-form {
    min-width: 95vw !important;
    max-width: 98vw !important;
    padding: 0 !important;
  }
  .departments-modal-form .modal-header {
    padding: 18px 12px 12px 12px !important;
    font-size: 22px !important;
  }
  .departments-modal-form .modal-fields {
    padding: 18px 12px 0 12px !important;
    gap: 12px !important;
    max-height: 220px !important;
  }
  .departments-modal-form .modal-actions {
    padding: 0 0 18px 0 !important;
    margin-top: 10px !important;
  }
  .departments-table {
    min-width: 400px !important;
    font-size: 15px !important;
  }
}

@media (max-width: 500px) {
  .departments-modal-form {
    min-width: 100vw !important;
    max-width: 100vw !important;
    border-radius: 0 !important;
  }
  .departments-modal-form .modal-header {
    font-size: 18px !important;
    padding: 12px 6px 8px 6px !important;
  }
  .departments-modal-form .modal-fields {
    padding: 10px 6px 0 6px !important;
    gap: 8px !important;
    max-height: 120px !important;
  }
  .departments-modal-form .modal-actions {
    padding: 0 0 10px 0 !important;
    margin-top: 6px !important;
  }
  .departments-table {
    min-width: 300px !important;
    font-size: 13px !important;
  }
}`;

// Inject styles into the document head
if (
  typeof document !== "undefined" &&
  !document.getElementById("departments-responsive-styles")
) {
  const style = document.createElement("style");
  style.id = "departments-responsive-styles";
  style.innerHTML = responsiveStyles;
  document.head.appendChild(style);
}

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/departments", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      const formatted = data.map((dept) => ({
        id: dept.id,
        department: dept.name || "N/A",
        hod: dept.hod_name || "N/A",
        email: dept.email || "N/A",
        faculty: dept.total_faculty ?? "N/A",
        publications: dept.publications_count ?? "N/A",
      }));
      setDepartments(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddDepartment = async (form) => {
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(form.email)) {
        return alert("Invalid email format");
      }
      const payload = {
        name: form.department.trim(),
        description: "", // optional
        hod_name: form.hod.trim(),
        email: form.email.trim(),
        total_faculty: Number(form.faculty),
        publications_count: Number(form.publications),
      };

      const token = localStorage.getItem("token");
      setLoading(true);
      console.log("TOKEN:", token);
      await axios.post("http://localhost:5000/api/departments", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchDepartments();
      setModalOpen(false);
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Failed to add department");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);
  return (
    <div
      style={{
        padding: "2.5rem 1rem",
        maxWidth: 1200,
        margin: "0 auto",
        minHeight: "80vh",
        background: "#f5f2ec",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          boxShadow: "0 2px 12px 0 rgba(0,0,0,0.07)",
          padding: "2rem 1.5rem 2.5rem 1.5rem",
          marginTop: 32,
          minHeight: 400,
          width: "100%",
          maxWidth: "100%",
          overflow: "auto",
          transition: "min-height 0.2s, width 0.2s",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 32,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <h1
            style={{
              fontSize: "2.2rem",
              fontWeight: 700,
              letterSpacing: "0.02em",
              margin: 0,
            }}
          >
            Department Management
          </h1>
          <button
            style={{
              background: "linear-gradient(90deg,#5b5bf7,#a0401e)",
              color: "#fff",
              border: "none",
              borderRadius: 16,
              padding: "14px 28px",
              fontWeight: 600,
              fontSize: 18,
              boxShadow: "0 2px 8px 0 rgba(90,90,90,0.07)",
              display: "flex",
              alignItems: "center",
              gap: 10,
              minWidth: 180,
            }}
            onClick={() => setModalOpen(true)}
          >
            <Plus size={22} /> Add Department
          </button>
        </div>
        <div style={{ overflowX: "auto", width: "100%" }}>
          <table
            className="departments-table"
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 17,
              background: "#fff",
              minWidth: 700,
              maxWidth: "100%",
            }}
          >
            <thead style={{ background: "#f5f2ec" }}>
              <tr>
                <th style={thStyle}>Department</th>
                <th style={thStyle}>HOD</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Total Faculty</th>
                <th style={thStyle}>No. of Publications</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept) => (
                <tr key={dept.id} style={{ borderBottom: "1px solid #ede8de" }}>
                  <td style={tdStyle}>{dept.department}</td>
                  <td style={tdStyle}>{dept.hod}</td>
                  <td style={tdStyle}>{dept.email}</td>
                  <td style={tdStyle}>{dept.faculty}</td>
                  <td style={tdStyle}>{dept.publications}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <AddDepartmentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddDepartment}
        loading={loading}
      />
    </div>
  );
}

const thStyle = {
  padding: "14px 12px",
  textAlign: "left",
  fontWeight: 600,
  color: "#222",
  minWidth: 100,
};

const tdStyle = {
  padding: "12px 12px",
  color: "#444",
  fontWeight: 400,
  fontSize: 16,
  wordBreak: "break-word",
};
