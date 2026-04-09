import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
const API = import.meta.env.VITE_API_URL || "";

const inputStyle = {
  padding: "12px 14px",
  borderRadius: 8,
  border: "1.5px solid #e0e0e0",
  fontSize: 15,
  outline: "none",
  fontWeight: 500,
  background: "#fafbfc",
  color: "#222", // Ensure text is visible
  marginBottom: 0,
  width: "100%",
  boxSizing: "border-box",
};
const addBtnStyle = {
  background: "#e0e7ff",
  color: "#222",
  border: "none",
  borderRadius: 8,
  fontWeight: 700,
  fontSize: 24,
  width: 40,
  height: 40,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
};
const removeBtnStyle = {
  background: "#fee2e2",
  color: "#b91c1c",
  border: "none",
  borderRadius: 8,
  fontWeight: 700,
  fontSize: 24,
  width: 40,
  height: 40,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
};
const thStyle = {
  padding: "10px 8px",
  textAlign: "left",
  fontWeight: 600,
  color: "#222",
  minWidth: 80,
};
const tdStyle = {
  padding: "8px 8px",
  color: "#444",
  fontWeight: 400,
  fontSize: 15,
  wordBreak: "break-word",
};

function AddPublicationModal({ open, onClose, onAdd, existing }) {
  const [form, setForm] = useState({
    title: "",
    authors: [""],
    journal: "",
    year: "",
    doi: "",
    department: "",
    file: null,
  });
  const [dupHint, setDupHint] = useState("");
  React.useEffect(() => {
    if (open) {
      setForm({
        title: "",
        authors: [""],
        journal: "",
        year: "",
        doi: "",
        department: "",
        file: null,
      });
      setDupHint("");
    }
  }, [open]);
  React.useEffect(() => {
    if (!form.title) return setDupHint("");
    const similar = existing.find(
      (p) => p.paper_title?.toLowerCase() === form.title.toLowerCase(),
    );
    setDupHint(
      similar ? "Possible duplicate: publication with this title exists." : "",
    );
  }, [form.title, existing]);
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
        onSubmit={(e) => {
          e.preventDefault();
          onAdd(form);
        }}
        style={{
          background: "#fff",
          borderRadius: 18,
          minWidth: 340,
          maxWidth: 500,
          width: "95vw",
          boxShadow: "0 2px 16px 0 rgba(0,0,0,0.10)",
          display: "flex",
          flexDirection: "column",
          gap: 0,
          padding: 0,
        }}
        autoComplete="off"
        encType="multipart/form-data"
      >
        <div
          style={{
            background: "linear-gradient(90deg,#5b5bf7,#a0401e)",
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            padding: "20px 24px 12px 24px",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 22, fontWeight: 700 }}>Add Publication</span>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#fff",
              fontSize: 24,
              cursor: "pointer",
            }}
          >
            &#10005;
          </button>
        </div>
        <div
          style={{
            padding: "20px 24px 0 24px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            maxHeight: 400,
            overflowY: "auto",
          }}
        >
          <input
            required
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            style={inputStyle}
            autoFocus
          />
          <div>
            <label style={{ fontWeight: 500 }}>Authors</label>
            {form.authors.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                <input
                  required
                  placeholder={`Author ${i + 1}`}
                  value={a}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      authors: f.authors.map((x, j) =>
                        j === i ? e.target.value : x,
                      ),
                    }))
                  }
                  style={{ ...inputStyle, flex: 1 }}
                  autoFocus={i === 0}
                />
                {form.authors.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        authors: f.authors.filter((_, j) => j !== i),
                      }))
                    }
                    style={removeBtnStyle}
                  >
                    -
                  </button>
                )}
                {i === form.authors.length - 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setForm((f) => ({ ...f, authors: [...f.authors, ""] }))
                    }
                    style={addBtnStyle}
                  >
                    +
                  </button>
                )}
              </div>
            ))}
          </div>
          <input
            required
            placeholder="Journal/Conference"
            type="text"
            value={form.journal}
            onChange={(e) =>
              setForm((f) => ({ ...f, journal: e.target.value }))
            }
            style={inputStyle}
          />
          <input
            required
            placeholder="Year"
            type="number"
            min="1900"
            max={new Date().getFullYear()}
            value={form.year}
            onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
            style={inputStyle}
          />
          <input
            placeholder="DOI/URL"
            value={form.doi}
            onChange={(e) => setForm((f) => ({ ...f, doi: e.target.value }))}
            style={inputStyle}
          />
          <input
            placeholder="Department"
            value={form.department}
            onChange={(e) =>
              setForm((f) => ({ ...f, department: e.target.value }))
            }
            style={inputStyle}
          />
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) =>
              setForm((f) => ({ ...f, file: e.target.files[0] }))
            }
            style={inputStyle}
          />
          {dupHint && (
            <div
              style={{
                color: "#b91c1c",
                fontWeight: 500,
                fontSize: 13,
                marginTop: 2,
              }}
            >
              {dupHint}
            </div>
          )}
        </div>
        <div
          style={{
            display: "flex",
            gap: 14,
            justifyContent: "center",
            padding: "0 0 20px 0",
            marginTop: 14,
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "#fff",
              color: "#444",
              border: "1.5px solid #e0e0e0",
              borderRadius: 8,
              padding: "10px 24px",
              fontWeight: 600,
              fontSize: 16,
              cursor: "pointer",
              minWidth: 90,
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              background: "linear-gradient(90deg,#5b5bf7,#a0401e)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "10px 24px",
              fontWeight: 600,
              fontSize: 16,
              cursor: "pointer",
              minWidth: 120,
            }}
          >
            Add Publication
          </button>
        </div>
      </form>
    </div>
  );
}
export default function Research() {
  const [publications, setPublications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [yearFilter, setYearFilter] = useState("");
  const [sortBy, setSortBy] = useState("year");

  useEffect(() => {
    const fetchResearch = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/api/research`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPublications(res.data);
      } catch (err) {
        console.error("Error fetching:", err);
      }
    };

    fetchResearch();
  }, []);

  const handleAddPublication = async (form) => {
    try {
      const payload = {
        paper_title: form.title,
        journal_name: form.journal,
        publication_year: form.year,
        authors: form.authors.join(", "),
        doi_url: form.doi,
        description: "",
        indexed: false,
        report_id: "some-report-id", // fix later
      };

      const token = localStorage.getItem("token");

      await axios.post(`${API}/api/research`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh list
      const updated = await axios.get(`${API}/api/research`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPublications(updated.data);

      setModalOpen(false);
    } catch (err) {
      console.error("Error adding research:", err);
    }
  };

  // Filter and sort
  let filtered = publications;
  if (yearFilter)
    filtered = filtered.filter(
      (p) => String(p.publication_year) === String(yearFilter),
    );
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === "year")
      return (b.publication_year || 0) - (a.publication_year || 0);

    if (sortBy === "journal")
      return (a.journal_name || "").localeCompare(b.journal_name || "");
    return 0;
  });

  const years = Array.from(new Set(publications.map((p) => p.publication_year)))
    .filter(Boolean)
    .sort((a, b) => b - a);

  return (
    <div style={{ padding: 40, maxWidth: 1100, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 28,
        }}
      >
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Research Publications</h1>
        <button
          onClick={() => setModalOpen(true)}
          style={{
            background: "linear-gradient(90deg,#5b5bf7,#a0401e)",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "12px 24px",
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          + Add Publication
        </button>
      </div>
      <div
        style={{
          display: "flex",
          gap: 18,
          marginBottom: 18,
          alignItems: "center",
        }}
      >
        <label>Year:</label>
        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            border: "1.5px solid #e0e0e0",
            fontSize: 15,
          }}
        >
          <option value="">All</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <label>Sort by:</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            border: "1.5px solid #e0e0e0",
            fontSize: 15,
          }}
        >
          <option value="year">Year</option>
          <option value="journal">Journal/Conference</option>
        </select>
      </div>
      <h3>Total Publications: {publications.length}</h3>
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 2px 12px 0 rgba(0,0,0,0.07)",
          padding: 24,
          minHeight: 200,
        }}
      >
        {filtered.length === 0 ? (
          <div style={{ color: "#888", fontSize: 18 }}>
            No publications found.
          </div>
        ) : (
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}
          >
            <thead>
              <tr style={{ background: "#f5f2ec" }}>
                <th style={thStyle}>Title</th>
                <th style={thStyle}>Authors</th>
                <th style={thStyle}>Journal/Conference</th>
                <th style={thStyle}>Year</th>
                <th style={thStyle}>DOI/URL</th>
                <th style={thStyle}>Department</th>
                <th style={thStyle}>PDF</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((pub, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #ede8de" }}>
                  <td>{pub.paper_title}</td>
                  <td>{pub.authors}</td>
                  <td>{pub.journal_name}</td>
                  <td>{pub.publication_year}</td>
                  <td>
                    {pub.doi_url && (
                      <a href={pub.doi_url} target="_blank">
                        Link
                      </a>
                    )}
                  </td>
                  <td>{pub.department_name}</td>
                  <td>{pub.pdf_url ? "PDF" : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <AddPublicationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddPublication}
        existing={publications}
      />
    </div>
  );
}
