import React, { useState } from "react";
import { addBook, updateBook, deleteBook } from "./api";

function Books({ books, fetchBooks }) {
  const [isbn, setIsbn] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [copies, setCopies] = useState("");
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isbn || !title || !author || !copies) return alert("All fields are required");

    const isbnDigits = isbn.replace(/[^0-9]/g, "");
    if (isbnDigits.length !== 13) return alert("ISBN must be exactly 13 digits");

    try {
      if (editingId) {
        await updateBook(editingId, { isbn: isbnDigits, title, author, copies: Number(copies) });
        setEditingId(null);
      } else {
        await addBook({ isbn: isbnDigits, title, author, copies: Number(copies) });
      }

      setIsbn("");
      setTitle("");
      setAuthor("");
      setCopies("");

      fetchBooks();
    } catch (err) {
      console.error(err);
      alert("Failed to save book.");
    }
  };

  const handleEdit = (book) => {
    setEditingId(book._id);
    setIsbn(book.isbn);
    setTitle(book.title);
    setAuthor(book.author);
    setCopies(book.copies);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this book?")) return;
    try {
      await deleteBook(id);
      fetchBooks();
    } catch (err) {
      console.error(err);
      alert("Failed to delete book.");
    }
  };

  return (
    <div className="container" style={{ padding: "30px", fontFamily: "Arial, sans-serif", minHeight: "100vh", backgroundColor: "#f5f6fa" }}>
      {/* Add/Edit Book Form */}
      <div className="form-container" style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", marginBottom: "30px" }}>
        <h2 style={{ marginBottom: "15px", color: "#2c3e50" }}>{editingId ? "Edit Book" : "Add Book"}</h2>
        <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "15px" }}>
          <input 
            placeholder="ISBN (13 digits)" 
            value={isbn} 
            onChange={(e) => setIsbn(e.target.value)} 
            style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} 
          />
          <input 
            placeholder="Title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} 
          />
          <input 
            placeholder="Author" 
            value={author} 
            onChange={(e) => setAuthor(e.target.value)} 
            style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} 
          />
          <input 
            type="number" 
            placeholder="Copies" 
            value={copies} 
            onChange={(e) => setCopies(e.target.value)} 
            style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} 
            min="1"
          />
          <div style={{ gridColumn: "1 / -1", display: "flex", gap: "10px", marginTop: "10px" }}>
            <button type="submit" style={{ flex: 1, backgroundColor: "#27ae60", color: "#fff", border: "none", padding: "10px", borderRadius: "6px", cursor: "pointer" }}>
              {editingId ? "Update" : "Add Book"}
            </button>
            <button type="button" onClick={() => { setIsbn(""); setTitle(""); setAuthor(""); setCopies(""); setEditingId(null); }} style={{ flex: 1, backgroundColor: "#7f8c8d", color: "#fff", border: "none", padding: "10px", borderRadius: "6px", cursor: "pointer" }}>
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Books Table */}
      <div className="table-container" style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
        <h2 style={{ marginBottom: "15px", color: "#2c3e50" }}>All Books</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ backgroundColor: "#2980b9", color: "#fff" }}>
            <tr>
              <th style={{ padding: "12px", textAlign: "left" }}>ISBN</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Title</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Author</th>
              <th style={{ padding: "12px", textAlign: "center" }}>Copies</th>
              <th style={{ padding: "12px", textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: "12px", textAlign: "center" }}>No books found</td>
              </tr>
            ) : (
              books.map((book, index) => (
                <tr key={book._id} style={{ backgroundColor: index % 2 === 0 ? "#fdfdfd" : "#f9f9f9", transition: "background-color 0.3s" }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#d1e7fd"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? "#fdfdfd" : "#f9f9f9"}>
                  <td style={{ padding: "10px" }}>{book.isbn}</td>
                  <td style={{ padding: "10px" }}>{book.title}</td>
                  <td style={{ padding: "10px" }}>{book.author}</td>
                  <td style={{ padding: "10px", textAlign: "center" }}>{book.copies}</td>
                  <td style={{ padding: "10px", display: "flex", justifyContent: "center", gap: "5px" }}>
                    <button onClick={() => handleEdit(book)} style={{ backgroundColor: "#e67e22", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" }}>Edit</button>
                    <button onClick={() => handleDelete(book._id)} style={{ backgroundColor: "#c0392b", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" }}>Delete</button>
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

export default Books;







