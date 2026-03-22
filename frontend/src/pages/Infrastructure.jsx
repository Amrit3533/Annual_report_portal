import { useState } from "react";
import { Link } from "react-router-dom";
import {
  labFacilities,
  equipment,
  buildings,
  classrooms,
  seminarHalls,
  offices,
} from "./data/infrastructureData";

export default function Infrastructure() {
  const [expandedSection, setExpandedSection] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("labs");
  const [formData, setFormData] = useState({
    name: "",
    quantity: 1,
  });

  const [data, setData] = useState({
    labs: [...labFacilities],
    equipment: [...equipment],
    buildings: [...buildings],
    classrooms: [...classrooms],
    seminarHalls: [...seminarHalls],
    offices: [...offices],
  });

  const infrastructureData = [
    {
      id: "labs",
      name: "Lab Facilities Catalogue",
      icon: "🔬",
      count: data.labs.length,
      items: data.labs,
      color: "#3b82f6",
    },
    {
      id: "equipment",
      name: "Equipment List",
      icon: "⚙️",
      count: data.equipment.length,
      items: data.equipment,
      color: "#8b5cf6",
    },
    {
      id: "buildings",
      name: "Buildings",
      icon: "🏢",
      count: data.buildings.length,
      items: data.buildings,
      color: "#ec4899",
    },
    {
      id: "classrooms",
      name: "Classrooms",
      icon: "📚",
      count: data.classrooms.length,
      items: data.classrooms,
      color: "#f59e0b",
    },
    {
      id: "seminars",
      name: "Seminar Halls",
      icon: "🎓",
      count: data.seminarHalls.length,
      items: data.seminarHalls,
      color: "#10b981",
    },
    {
      id: "offices",
      name: "Offices",
      icon: "💼",
      count: data.offices.length,
      items: data.offices,
      color: "#06b6d4",
    },
  ];

  const toggleSection = (id) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const openModal = (category) => {
    setSelectedCategory(category);
    setShowModal(true);
    setFormData({ name: "", description: "", location: "" });
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) : value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setData((prev) => ({
      ...prev,
      [selectedCategory]: [
        ...prev[selectedCategory],
        { name: formData.name, quantity: formData.quantity },
      ],
    }));
    setShowModal(false);
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
          --border: #e0e0e0;
          --card: #fff;
        }

        .page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 8% 12%, rgba(200, 82, 42, 0.08), transparent 35%),
            radial-gradient(circle at 88% 2%, rgba(160, 64, 30, 0.10), transparent 32%),
            linear-gradient(180deg, #f5f2ec 0%, #ede8de 100%);
          color: var(--ink);
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          padding: 28px 14px;
          overflow-y: auto;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .header {
          background: linear-gradient(90deg, #5b5bf7 0%, #a0401e 100%);
          color: #fff;
          padding: 40px 28px;
          border-radius: 18px;
          margin-bottom: 32px;
          box-shadow: 0 14px 28px rgba(200, 82, 42, 0.08);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .header h1 {
          margin: 0;
          font-size: 36px;
          line-height: 1.2;
          letter-spacing: -0.01em;
        }

        .header p {
          margin: 8px 0 0;
          opacity: 0.95;
          font-size: 16px;
        }

        .header-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .btn {
          padding: 11px 16px;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .btn-primary {
          background: #dbeafe;
          color: #0f2347;
          border: 1px solid #bfdbfe;
        }

        .btn-primary:hover {
          background: #bfdbfe;
          transform: translateY(-1px);
        }

        .btn-back {
          background: transparent;
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .btn-back:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.5);
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .card {
          background: var(--card);
          border: 1.5px solid var(--border);
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 6px 16px rgba(200, 82, 42, 0.06);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(16, 38, 84, 0.12);
        }

        .card-header {
          padding: 20px;
          border-bottom: 1.5px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }

        .card-icon {
          font-size: 32px;
        }

        .card-title-group {
          flex: 1;
        }

        .card-title {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: var(--ink);
        }

        .card-count {
          margin: 6px 0 0;
          font-size: 24px;
          font-weight: 700;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .expand-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          padding: 0;
          transition: transform 0.3s ease;
          color: var(--mid);
        }

        .expand-btn.open {
          transform: rotate(180deg);
        }

        .card-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s ease;
        }

        .card-content.expanded {
          max-height: 500px;
        }

        .card-items {
          padding: 20px;
          background: #f8fbff;
        }

        .item-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 10px;
        }

        .item-list li {
          padding: 10px 12px;
          background: var(--card);
          border: 1.5px solid var(--border);
          border-radius: 8px;
          font-size: 14px;
          color: var(--ink);
        }

        .item-list li::before {
          content: "→ ";
          color: var(--mid);
          font-weight: 600;
          margin-right: 8px;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-top: 32px;
          padding: 24px;
          background: var(--card);
          border: 1px solid var(--line);
          border-radius: 14px;
          box-shadow: 0 6px 16px rgba(16, 38, 84, 0.06);
        }

        .stat-box {
          text-align: center;
          padding: 16px;
        }

        .stat-number {
          font-size: 32px;
          font-weight: 700;
          color: var(--mid);
          margin: 0;
        }

        .stat-label {
          font-size: 13px;
          color: var(--muted);
          margin: 8px 0 0;
        }

        .total-facilities {
          text-align: center;
          margin-top: 32px;
          padding: 24px;
          background: linear-gradient(135deg, rgba(200, 82, 42, 0.08) 0%, rgba(160, 64, 30, 0.10) 100%);
          border: 1.5px solid var(--border);
          border-radius: 14px;
        }

        .total-facilities h2 {
          margin: 0;
          font-size: 28px;
          color: var(--ink);
        }

        .total-facilities p {
          margin: 8px 0 0;
          color: var(--muted);
          font-size: 16px;
        }

        @media (max-width: 640px) {
          .grid {
            grid-template-columns: 1fr;
          }

          .header {
            padding: 24px;
          }

          .header-content {
            flex-direction: column;
            align-items: flex-start;
          }

          .header h1 {
            font-size: 28px;
          }

          .stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="page">
        <div className="container">
          <div className="header">
            <div className="header-content">
              <div>
                <h1>Infrastructure Catalogue</h1>
                <p>Complete overview of facilities, equipment, and buildings</p>
              </div>
              <div className="header-actions">
                <button className="btn btn-primary" onClick={() => openModal("labs")}>➕ Add Infrastructure</button>
              </div>
            </div>
          </div>

          {showModal && (
            <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
              <div style={{ background: "#fff", borderRadius: 12, padding: 32, minWidth: 320, boxShadow: "0 4px 24px #0002", position: "relative" }}>
                <button onClick={closeModal} style={{ position: "absolute", top: 12, right: 16, background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#a0401e" }}>×</button>
                <h2 style={{ color: "#a0401e", marginBottom: 18 }}>Add Infrastructure</h2>
                <form onSubmit={handleFormSubmit}>
                  <div style={{ marginBottom: 14 }}>
                    <label>Category</label>
                    <select name="category" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} style={{ width: "100%", padding: 8, borderRadius: 6, border: "1.5px solid #e0e0e0" }}>
                      <option value="labs">Lab Facilities</option>
                      <option value="equipment">Equipment</option>
                      <option value="buildings">Buildings</option>
                      <option value="classrooms">Classrooms</option>
                      <option value="seminarHalls">Seminar Halls</option>
                      <option value="offices">Offices</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <label>Name</label>
                    <input name="name" value={formData.name} onChange={handleFormChange} required style={{ width: "100%", padding: 8, borderRadius: 6, border: "1.5px solid #e0e0e0" }} />
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <label>Quantity</label>
                    <input name="quantity" type="number" min="1" value={formData.quantity} onChange={handleFormChange} required style={{ width: "100%", padding: 8, borderRadius: 6, border: "1.5px solid #e0e0e0" }} />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>Add</button>
                </form>
              </div>
            </div>
          )}

          <div className="grid">
            {infrastructureData.map((section) => (
              <div key={section.id} className="card">
                <div className="card-header" onClick={() => toggleSection(section.id)}>
                  <div>
                    <span className="card-icon">{section.icon}</span>
                  </div>
                  <div className="card-title-group">
                    <h3 className="card-title">{section.name}</h3>
                    <div className="card-count">{section.count}</div>
                  </div>
                  <button 
                    className={`expand-btn ${expandedSection === section.id ? "open" : ""}`}
                    aria-label="Toggle section"
                  >
                    ⌄
                  </button>
                </div>

                <div className={`card-content ${expandedSection === section.id ? "expanded" : ""}`}>
                  <div className="card-items">
                    <ul className="item-list">
                      {section.items.map((item, idx) => (
                        <li key={idx}>
                          {typeof item === "string"
                            ? item
                            : `${item.name} (Qty: ${item.quantity})`}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="stats">
            {infrastructureData.map((section) => (
              <div key={section.id} className="stat-box">
                <p className="stat-number">{section.count}</p>
                <p className="stat-label">{section.name}</p>
              </div>
            ))}
          </div>

          <div className="total-facilities">
            <h2>
              Total Infrastructure Assets: {infrastructureData.reduce((sum, item) => sum + item.count, 0)}
            </h2>
            <p>All facilities, equipment, and spaces in the organization</p>
          </div>
        </div>
      </div>
    </>
  );

}