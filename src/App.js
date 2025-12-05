import React, { useState, useEffect } from "react";
import Books from "./Books";      // no components folder
import Members from "./Members";  // no components folder
import Loans from "./Loans";      // no components folder
import { getBooks, getMembers } from "./api";

function App() {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [activeSection, setActiveSection] = useState("books"); // Navigation: books/members/loans

  // Fetch books and members
  useEffect(() => {
    fetchBooks();
    fetchMembers();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await getBooks();
      setBooks(res.data);
    } catch (err) {
      console.error("Failed to fetch books:", err);
      alert("Failed to fetch books. Check console.");
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await getMembers();
      setMembers(res.data);
    } catch (err) {
      console.error("Failed to fetch members:", err);
      alert("Failed to fetch members. Check console.");
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Library System</h1>

      {/* Navigation */}
      <nav style={{ marginBottom: "20px" }}>
        <button onClick={() => setActiveSection("books")}>Books</button>
        <button onClick={() => setActiveSection("members")}>Members</button>
        <button onClick={() => setActiveSection("loans")}>Loans</button>
      </nav>

      {/* Sections */}
      {activeSection === "books" && <Books books={books} fetchBooks={fetchBooks} />}
      {activeSection === "members" && <Members members={members} fetchMembers={fetchMembers} />}
      {activeSection === "loans" && <Loans books={books} members={members} />}
    </div>
  );
}

export default App;
