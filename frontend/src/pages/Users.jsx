import React, { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "";
const responsiveStyles = `
@media (max-width: 900px) {
  .users-container {
    padding: 0.75rem 0.1rem 1rem !important;
    max-width: 100vw !important;
    min-width: 0 !important;
    width: 100vw !important;
  }
  .users-card {
    padding: 1rem 0.75rem 1.15rem !important;
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
    padding: 0.25rem 0.15rem 0.75rem 0.15rem !important;
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
import { jwtDecode } from "jwt-decode";

function UserModal({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState(
    initial || {
      name: "",
      email: "",
      role: "faculty",
      password: "",
      registerNumber: "",
      year: "",
      department: "",
    },
  );
  useEffect(() => {
    setForm(
      initial || {
        name: "",
        email: "",
        role: "faculty",
        password: "",
        registerNumber: "",
        year: "",
        department: "",
      }
    );
  }, [initial, open]);

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
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form
        style={{
          background: "#f5f2ec",
          borderRadius: 12,
          padding: 32,
          minWidth: 320,
          boxShadow: "0 2px 16px 0 rgba(0,0,0,0.10)",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
        onSubmit={(e) => {
          e.preventDefault();
          onSave(form);
        }}
      >
        <h2 style={{ margin: 0, fontSize: 22 }}>
          {initial ? "Edit User" : "Add User"}
        </h2>
        <input
          required
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          style={{ padding: 8, borderRadius: 6, border: "1.5px solid #d4cfc5" }}
        />
        <input
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          style={{ padding: 8, borderRadius: 6, border: "1.5px solid #d4cfc5" }}
        />
        <select
          value={form.role}
          onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
          style={{ padding: 8, borderRadius: 6, border: "1.5px solid #d4cfc5" }}
        >
          <option value="admin">Admin</option>
          <option value="department">Department</option>
          <option value="faculty">Faculty</option>
          <option value="student">Student</option>
        </select>

        {/* Student-specific fields */}
        {form.role === "student" && (
          <>
            <input
              required
              placeholder="Register Number"
              value={form.registerNumber}
              onChange={e => setForm(f => ({ ...f, registerNumber: e.target.value }))}
              style={{ padding: 8, borderRadius: 6, border: "1.5px solid #d4cfc5" }}
            />
            <input
              required
              placeholder="Year"
              value={form.year}
              onChange={e => setForm(f => ({ ...f, year: e.target.value }))}
              style={{ padding: 8, borderRadius: 6, border: "1.5px solid #d4cfc5" }}
            />
            <input
              required
              placeholder="Department"
              value={form.department}
              onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
              style={{ padding: 8, borderRadius: 6, border: "1.5px solid #d4cfc5" }}
            />
          </>
        )}
        {!initial && (
          <input
            required
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm((f) => ({ ...f, password: e.target.value }))
            }
            style={{
              padding: 8,
              borderRadius: 6,
              border: "1.5px solid #d4cfc5",
            }}
          />
        )}
        {/* Status field removed */}
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button
            type="submit"
            style={{
              background: "#c8522a",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "8px 18px",
              fontWeight: 600,
            }}
          >
            {initial ? "Save" : "Add"}
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "#ede8de",
              color: "#8a8178",
              border: "none",
              borderRadius: 6,
              padding: "8px 18px",
            }}
          >
            Cancel
          </button>
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
  const [roleFilter, setRoleFilter] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAdd = async (form) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
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

      const { id, password, ...rest } = form;

      const body = password ? { ...rest, password } : rest;

      const res = await fetch(`${API}/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update user");
      }

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

      const res = await fetch(`${API}/api/users/${id}/disable`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to disable user");

      setDeleteId(null);
      setConfirmDelete(false);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };
  const token = localStorage.getItem("token");
  const currentUser = token ? jwtDecode(token) : null;

  return (
    <>
      <style>{responsiveStyles}</style>
      <div
        className="users-container"
        style={{
          padding: "0.75rem 2rem 1.5rem",
          maxWidth: 1240,
          margin: "0 auto",
          minHeight: "calc(100vh - 64px)",
          background: "transparent",
          width: "100%",
        }}
      >
        <div
          className="users-card"
          style={{
            background: "#f5f2ec",
            borderRadius: 12,
            boxShadow: "0 2px 12px 0 rgba(0,0,0,0.07)",
            padding: "1.5rem 1.75rem 1.75rem",
            marginTop: 0,
            minHeight: 0,
            width: "100%",
            maxWidth: "100%",
          }}
        >
          <div
            className="users-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
              marginBottom: 20,
              flexWrap: "wrap",
            }}
          >
            <h1
              style={{
                fontSize: "clamp(1.6rem, 3vw, 2.1rem)",
                fontWeight: 700,
                letterSpacing: "0.02em",
                margin: 0,
              }}
            >
              User Management
            </h1>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                style={{
                  padding: "8px 14px",
                  borderRadius: 6,
                  border: "1.5px solid #d4cfc5",
                  background: "#fff",
                  color: "#0f0f0f",
                  fontWeight: 500,
                  fontSize: 15,
                }}
              >
                <option value="">All Roles</option>
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="department">Department</option>
              </select>
              {currentUser?.role === "admin" && (
                <button
                  onClick={() => {
                    setModalOpen(true);
                    setEditUser(null);
                  }}
                  style={{
                    background: "linear-gradient(90deg,#c8522a,#a0401e)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "11px 22px",
                    fontWeight: 600,
                    fontSize: 15,
                    boxShadow: "0 2px 8px 0 rgba(160,64,30,0.12)",
                  }}
                >
                  + Add User
                </button>
              )}
            </div>
          </div>
          {error && (
            <div style={{ color: "#a0401e", marginBottom: 16 }}>{error}</div>
          )}
          {/* Render separate tables for each role, but only show the filtered one if a filter is selected */}
          {['admin', 'faculty', 'department', 'student'].map(role => {
            if (roleFilter && role !== roleFilter) return null;
            const roleUsers = users.filter(u => u.role === role);
            if (roleUsers.length === 0) return null;
            return (
              <div key={role} style={{ marginBottom: 40 }}>
                <h2 style={{ margin: '18px 0 10px 0', fontSize: 22, color: '#a0401e' }}>{role.charAt(0).toUpperCase() + role.slice(1)}s</h2>
                <table
                  className="users-table"
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 15,
                    background: "#f5f2ec",
                    minWidth: 600,
                  }}
                >
                  <thead style={{ background: "#ede8de" }}>
                    <tr>
                      <th style={{ padding: "14px 16px", textAlign: "left", fontWeight: 600, color: "#0f0f0f" }}>Name</th>
                      <th style={{ padding: "14px 16px", textAlign: "left", fontWeight: 600, color: "#0f0f0f" }}>Role</th>
                      <th style={{ padding: "14px 16px", textAlign: "left", fontWeight: 600, color: "#0f0f0f" }}>Email</th>
                      {role === 'student' && <th style={{ padding: "14px 16px", textAlign: "left", fontWeight: 600, color: "#0f0f0f" }}>Register Number</th>}
                      {role === 'student' && <th style={{ padding: "14px 16px", textAlign: "left", fontWeight: 600, color: "#0f0f0f" }}>Year</th>}
                      {role === 'student' && <th style={{ padding: "14px 16px", textAlign: "left", fontWeight: 600, color: "#0f0f0f" }}>Department</th>}
                      <th style={{ padding: "14px 16px", textAlign: "right", fontWeight: 600, color: "#0f0f0f" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roleUsers.map(user => (
                      <tr key={user.id} style={{ borderBottom: "1px solid #d4cfc5" }}>
                        <td style={{ padding: "12px 16px" }}>{user.name}</td>
                        <td style={{ padding: "12px 16px" }}>{user.role}</td>
                        <td style={{ padding: "12px 16px" }}>{user.email}</td>
                        {role === 'student' && <td style={{ padding: "12px 16px" }}>{user.registerNumber || user.register_number || "-"}</td>}
                        {role === 'student' && <td style={{ padding: "12px 16px" }}>{user.year || "-"}</td>}
                        {role === 'student' && <td style={{ padding: "12px 16px" }}>{user.department || "-"}</td>}
                        <td style={{ padding: "12px 16px", textAlign: "right" }}>
                          <button
                            onClick={() => {
                              setEditUser(user);
                              setModalOpen(true);
                            }}
                            style={{
                              background: "#ede8de",
                              color: "#0f0f0f",
                              border: "none",
                              borderRadius: 6,
                              padding: "6px 14px",
                              marginRight: 8,
                              fontWeight: 600,
                              fontSize: 14,
                            }}
                          >
                            Edit
                          </button>
                          {currentUser?.id !== user.id && (
                            <button
                              onClick={() => {
                                setDeleteId(user.id);
                                setConfirmDelete(true);
                              }}
                              style={{
                                background: "#fdf0ec",
                                color: "#a0401e",
                                border: "none",
                                borderRadius: 6,
                                padding: "6px 14px",
                                fontWeight: 600,
                                fontSize: 14,
                              }}
                            >
                              Disable
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
        <UserModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditUser(null);
          }}
          onSave={editUser ? handleEdit : handleAdd}
          initial={editUser}
        />
        {confirmDelete && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.18)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                background: "#f5f2ec",
                borderRadius: 12,
                padding: 24,
                minWidth: 320,
                boxShadow: "0 2px 16px 0 rgba(0,0,0,0.10)",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div style={{ fontSize: 18, marginBottom: 12 }}>
                Are you sure you want to disable this user?
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                {currentUser?.id !== deleteId && (
                  <button
                    onClick={() => handleDelete(deleteId)}
                    style={{
                      background: "#c8522a",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      padding: "8px 18px",
                      fontWeight: 600,
                    }}
                  >
                    Disable
                  </button>
                )}
                <button
                  onClick={() => {
                    setDeleteId(null);
                    setConfirmDelete(false);
                  }}
                  style={{
                    background: "#ede8de",
                    color: "#8a8178",
                    border: "none",
                    borderRadius: 6,
                    padding: "8px 18px",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Users;