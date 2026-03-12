
import React, { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;
const responsiveStyles = `
@media (max-width: 900px) {
  .users-container {
    padding: 1.2rem 0.2rem !important;
    max-width: 100vw !important;
    min-width: 0 !important;
    width: 100vw !important;
  }
  .users-card {
    padding: 1.2rem 0.2rem 1.5rem 0.2rem !important;
    max-width: 100vw !important;
    width: 100vw !important;
  }
  .users-table th, .users-table td {
    padding: 10px 6px !important;
    font-size: 14px !important;
  }
  .users-header {
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 12px;
    width: 100%;
  }
  .users-header h1 {
    font-size: 1.3rem !important;
  }
  .users-table {
    font-size: 14px !important;
    min-width: 600px;
  }
}
@media (max-width: 600px) {
  .users-container, .users-card {
    padding: 0.2rem 0.1rem 0.5rem 0.1rem !important;
    max-width: 100vw !important;
    width: 100vw !important;
  }
  .users-header h1 {
    font-size: 1.1rem !important;
  }
  .users-table th, .users-table td {
    padding: 6px 2px !important;
    font-size: 11px !important;
  }
  .users-table {
    font-size: 11px !important;
    min-width: 480px;
  }
}
`;

function UserModal({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState(initial || { name: "", email: "", role: "faculty", password: "" });
  useEffect(() => { setForm(initial || { name: "", email: "", role: "faculty", password: "" }); }, [initial, open]);
  if (!open) return null;
  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.18)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <form style={{ background: "#fff", borderRadius: 12, padding: 32, minWidth: 320, boxShadow: "0 2px 16px 0 rgba(0,0,0,0.10)", display: "flex", flexDirection: "column", gap: 16 }} onSubmit={e => { e.preventDefault(); onSave(form); }}>
        <h2 style={{ margin: 0, fontSize: 22 }}>{initial ? "Edit User" : "Add User"}</h2>
        <input required placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={{ padding: 8, borderRadius: 6, border: "1.5px solid #d4cfc5" }} />
        <input required type="email" placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={{ padding: 8, borderRadius: 6, border: "1.5px solid #d4cfc5" }} />
        <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} style={{ padding: 8, borderRadius: 6, border: "1.5px solid #d4cfc5" }}>
          <option value="admin">Admin</option>
          <option value="department">Department</option>
          <option value="faculty">Faculty</option>
          <option value="student">Student</option>
        </select>
        {!initial && <input required type="password" placeholder="Password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} style={{ padding: 8, borderRadius: 6, border: "1.5px solid #d4cfc5" }} />}
        {/* Status field removed */}
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button type="submit" style={{ background: "#c8522a", color: "#fff", border: "none", borderRadius: 6, padding: "8px 18px", fontWeight: 600 }}>{initial ? "Save" : "Add"}</button>
          <button type="button" onClick={onClose} style={{ background: "#ede8de", color: "#8a8178", border: "none", borderRadius: 6, padding: "8px 18px" }}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAdd = async (form) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error("Failed to add user");
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  // Edit user (PUT)
  const handleEdit = async (form) => {
    try {
      const token = localStorage.getItem("token");
      const { password, ...rest } = form;
      const body = password ? { ...rest, password } : rest;
      const res = await fetch(`${API}/api/users/${form.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error("Failed to update user");
      setEditUser(null);
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  // Delete user (DELETE)
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to delete user");
      setDeleteId(null);
      setConfirmDelete(false);
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <style>{responsiveStyles}</style>
      <div className="users-container" style={{
        padding: "2.5rem 3.5rem",
        maxWidth: 1280,
        margin: "0 auto",
        minHeight: "calc(100vh - 64px)",
        background: "#f5f2ec",
        width: "100%"
      }}>
        <div className="users-card" style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 12px 0 rgba(0,0,0,0.07)",
          padding: "2rem 2.5rem 2.5rem 2.5rem",
          marginTop: 32,
          minHeight: 500,
          width: "100%",
          maxWidth: "100%"
        }}>
          <div className="users-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
            <h1 style={{ fontSize: "2.2rem", fontWeight: 700, letterSpacing: "0.02em", margin: 0 }}>User Management</h1>
            <button onClick={() => { setModalOpen(true); setEditUser(null); }} style={{ background: "linear-gradient(90deg,#5b5bf7,#a0401e)", color: "#fff", border: "none", borderRadius: 8, padding: "12px 28px", fontWeight: 600, fontSize: 16, boxShadow: "0 2px 8px 0 rgba(90,90,90,0.07)" }}>+ Add User</button>
          </div>
          {error && <div style={{ color: "#a0401e", marginBottom: 16 }}>{error}</div>}
          <div style={{ overflowX: "auto", width: "100%" }}>
            <table className="users-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: 16, background: "#fff", minWidth: 600 }}>
              <thead style={{ background: "#f5f2ec" }}>
                <tr>
                  <th style={{ padding: "16px 18px", textAlign: "left", fontWeight: 600, color: "#222" }}>Name</th>
                  <th style={{ padding: "16px 18px", textAlign: "left", fontWeight: 600, color: "#222" }}>Role</th>
                  <th style={{ padding: "16px 18px", textAlign: "left", fontWeight: 600, color: "#222" }}>Email</th>
                  <th style={{ padding: "16px 18px", textAlign: "right", fontWeight: 600, color: "#222" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} style={{ padding: 40, textAlign: "center" }}>Loading...</td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan={4} style={{ padding: 40, textAlign: "center" }}>No users found.</td></tr>
                ) : users.map(user => (
                  <tr key={user.id} style={{ borderBottom: "1px solid #ede8de" }}>
                    <td style={{ padding: "14px 18px" }}>{user.name}</td>
                    <td style={{ padding: "14px 18px" }}>{user.role}</td>
                    <td style={{ padding: "14px 18px" }}>{user.email}</td>
                    <td style={{ padding: "14px 18px", textAlign: "right" }}>
                      <button onClick={() => { setEditUser(user); setModalOpen(true); }} style={{ background: "#ede8de", color: "#5b5bf7", border: "none", borderRadius: 6, padding: "6px 14px", marginRight: 8, fontWeight: 600, fontSize: 15 }}>Edit</button>
                      <button onClick={() => { setDeleteId(user.id); setConfirmDelete(true); }} style={{ background: "#fff0f0", color: "#a0401e", border: "none", borderRadius: 6, padding: "6px 14px", fontWeight: 600, fontSize: 15 }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <UserModal open={modalOpen} onClose={() => { setModalOpen(false); setEditUser(null); }} onSave={editUser ? handleEdit : handleAdd} initial={editUser} />
        {confirmDelete && (
          <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.18)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ background: "#fff", borderRadius: 12, padding: 32, minWidth: 320, boxShadow: "0 2px 16px 0 rgba(0,0,0,0.10)", display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ fontSize: 18, marginBottom: 12 }}>Are you sure you want to delete this user?</div>
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => handleDelete(deleteId)} style={{ background: "#a0401e", color: "#fff", border: "none", borderRadius: 6, padding: "8px 18px", fontWeight: 600 }}>Delete</button>
                <button onClick={() => { setDeleteId(null); setConfirmDelete(false); }} style={{ background: "#ede8de", color: "#8a8178", border: "none", borderRadius: 6, padding: "8px 18px" }}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Users;

