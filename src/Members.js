import React, { useState } from "react";
import { addMember, updateMember, deleteMember } from "./api";

function Members({ members, fetchMembers }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) return alert("All fields required");

    try {
      if (editingId) {
        await updateMember(editingId, { name, email });
        setEditingId(null);
      } else {
        await addMember({ name, email, joinedAt: new Date().toISOString() });
      }

      setName("");
      setEmail("");
      fetchMembers();
    } catch (err) {
      console.error(err);
      alert("Failed to save member.");
    }
  };

  const handleEdit = (member) => {
    setEditingId(member._id);
    setName(member.name);
    setEmail(member.email);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this member?")) return;
    try {
      await deleteMember(id);
      fetchMembers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete member.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", padding: "30px", fontFamily: "Arial, sans-serif", backgroundColor: "#f5f6fa" }}>
      
      {/* Add/Edit Member Form */}
      <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", marginBottom: "30px" }}>
        <h2 style={{ marginBottom: "15px", color: "#2c3e50" }}>{editingId ? "Edit Member" : "Add Member"}</h2>
        <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
          />
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
          />
          <div style={{ gridColumn: "1 / -1", display: "flex", gap: "10px" }}>
            <button
              type="submit"
              style={{ flex: 1, backgroundColor: "#27ae60", color: "#fff", border: "none", padding: "10px", borderRadius: "6px", cursor: "pointer" }}
            >
              {editingId ? "Update" : "Add"}
            </button>
            <button
              type="button"
              onClick={() => { setName(""); setEmail(""); setEditingId(null); }}
              style={{ flex: 1, backgroundColor: "#7f8c8d", color: "#fff", border: "none", padding: "10px", borderRadius: "6px", cursor: "pointer" }}
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Members Table */}
      <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
        <h2 style={{ marginBottom: "15px", color: "#2c3e50" }}>Member List</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ backgroundColor: "#2980b9", color: "#fff" }}>
            <tr>
              <th style={{ padding: "12px", textAlign: "left" }}>Name</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Email</th>
              <th style={{ padding: "12px", textAlign: "center" }}>Joined</th>
              <th style={{ padding: "12px", textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: "12px", textAlign: "center" }}>No members found</td>
              </tr>
            ) : (
              members.map((member, index) => (
                <tr key={member._id} style={{ backgroundColor: index % 2 === 0 ? "#fdfdfd" : "#f9f9f9", transition: "background-color 0.3s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#d1e7fd")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = index % 2 === 0 ? "#fdfdfd" : "#f9f9f9")}>
                  <td style={{ padding: "10px" }}>{member.name}</td>
                  <td style={{ padding: "10px" }}>{member.email}</td>
                  <td style={{ padding: "10px", textAlign: "center" }}>{new Date(member.joinedAt).toLocaleDateString()}</td>
                  <td style={{ padding: "10px", display: "flex", justifyContent: "center", gap: "5px" }}>
                    <button onClick={() => handleEdit(member)} style={{ backgroundColor: "#f39c12", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" }}>Edit</button>
                    <button onClick={() => handleDelete(member._id)} style={{ backgroundColor: "#c0392b", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" }}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Members;





