import React, { useState, useEffect } from "react";
import { getLoans, addLoan, returnLoan, deleteLoan } from "./api";

function Loans({ books, members }) {
  const [loans, setLoans] = useState([]);
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedMember, setSelectedMember] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const res = await getLoans();
      setLoans(res.data);
    } catch (err) {
      console.error("Failed to fetch loans:", err);
      alert("Failed to fetch loans. Check console for details.");
    }
  };

  const handleCreateLoan = async (e) => {
    e.preventDefault();
    if (!selectedBook || !selectedMember || !dueDate)
      return alert("Select book, member, and due date");

    try {
      await addLoan({ bookId: selectedBook, memberId: selectedMember, dueAt: dueDate });
      setSelectedBook("");
      setSelectedMember("");
      setDueDate("");
      fetchLoans();
    } catch (err) {
      console.error("Failed to create loan:", err.response || err);
      alert("Failed to create loan. Check console for details");
    }
  };

  const handleReturnLoan = async (loanId) => {
    try {
      await returnLoan(loanId);
      fetchLoans();
    } catch (err) {
      console.error("Failed to return loan:", err.response || err);
      alert("Failed to return loan. Check console for details");
    }
  };

  const handleDeleteLoan = async (loanId) => {
    if (!window.confirm("Are you sure you want to delete this loan?")) return;
    try {
      await deleteLoan(loanId);
      fetchLoans();
    } catch (err) {
      console.error("Failed to delete loan:", err.response || err);
      alert("Failed to delete loan. Check console for details");
    }
  };

  return (
    <div style={{ minHeight: "100vh", padding: "30px", fontFamily: "Arial, sans-serif", backgroundColor: "#f5f6fa" }}>
      {/* Loan Form */}
      <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", marginBottom: "30px" }}>
        <h2 style={{ marginBottom: "15px", color: "#2c3e50" }}>Create Loan</h2>
        <form onSubmit={handleCreateLoan} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "15px" }}>
          <select value={selectedBook} onChange={(e) => setSelectedBook(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}>
            <option value="">Select Book</option>
            {books.map((book) => (
              <option key={book._id} value={book._id}>
                {book.title} ({book.copies} copies)
              </option>
            ))}
          </select>

          <select value={selectedMember} onChange={(e) => setSelectedMember(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}>
            <option value="">Select Member</option>
            {members.map((member) => (
              <option key={member._id} value={member._id}>
                {member.name}
              </option>
            ))}
          </select>

          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} />

          <div style={{ gridColumn: "1 / -1", display: "flex", gap: "10px" }}>
            <button type="submit" style={{ flex: 1, backgroundColor: "#27ae60", color: "#fff", border: "none", padding: "10px", borderRadius: "6px", cursor: "pointer" }}>
              Create
            </button>
            <button type="button" onClick={() => { setSelectedBook(""); setSelectedMember(""); setDueDate(""); }} style={{ flex: 1, backgroundColor: "#7f8c8d", color: "#fff", border: "none", padding: "10px", borderRadius: "6px", cursor: "pointer" }}>
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Loans Table */}
      <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
        <h2 style={{ marginBottom: "15px", color: "#2c3e50" }}>Current Loans</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ backgroundColor: "#2980b9", color: "#fff" }}>
            <tr>
              <th style={{ padding: "12px", textAlign: "left" }}>Book</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Member</th>
              <th style={{ padding: "12px", textAlign: "center" }}>Loaned At</th>
              <th style={{ padding: "12px", textAlign: "center" }}>Due At</th>
              <th style={{ padding: "12px", textAlign: "center" }}>Returned At</th>
              <th style={{ padding: "12px", textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loans.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: "12px", textAlign: "center" }}>No loans found</td>
              </tr>
            ) : (
              loans.map((loan, index) => (
                <tr key={loan._id} style={{ backgroundColor: index % 2 === 0 ? "#fdfdfd" : "#f9f9f9", transition: "background-color 0.3s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#d1e7fd")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = index % 2 === 0 ? "#fdfdfd" : "#f9f9f9")}>
                  <td style={{ padding: "10px" }}>{loan.bookId?.title}</td>
                  <td style={{ padding: "10px" }}>{loan.memberId?.name}</td>
                  <td style={{ padding: "10px", textAlign: "center" }}>{new Date(loan.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: "10px", textAlign: "center" }}>{new Date(loan.dueAt).toLocaleDateString()}</td>
                  <td style={{ padding: "10px", textAlign: "center" }}>{loan.returnedAt ? new Date(loan.returnedAt).toLocaleDateString() : "-"}</td>
                  <td style={{ padding: "10px", display: "flex", justifyContent: "center", gap: "5px" }}>
                    {!loan.returnedAt && (
                      <button onClick={() => handleReturnLoan(loan._id)} style={{ backgroundColor: "#f39c12", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" }}>
                        Return
                      </button>
                    )}
                    <button onClick={() => handleDeleteLoan(loan._id)} style={{ backgroundColor: "#c0392b", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" }}>
                      Delete
                    </button>
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

export default Loans;












