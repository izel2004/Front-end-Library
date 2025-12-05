import axios from "axios";

// Use local backend in development, deployed backend in production
const BASE_URL = process.env.NODE_ENV === "production"
  ? "https://library-eight-liart.vercel.app/api" // deployed backend
  : "http://localhost:3000/api";                 // local backend

// Books
export const getBooks = () => axios.get(`${BASE_URL}/books`);
export const addBook = (data) => axios.post(`${BASE_URL}/books`, data);
export const updateBook = (id, data) => axios.put(`${BASE_URL}/books/${id}`, data);
export const deleteBook = (id) => axios.delete(`${BASE_URL}/books/${id}`);

// Members
export const getMembers = () => axios.get(`${BASE_URL}/members`);
export const addMember = (data) => axios.post(`${BASE_URL}/members`, data);
export const updateMember = (id, data) => axios.put(`${BASE_URL}/members/${id}`, data);
export const deleteMember = (id) => axios.delete(`${BASE_URL}/members/${id}`);

// Loans
export const getLoans = () => axios.get(`${BASE_URL}/loans`);
export const addLoan = (data) => axios.post(`${BASE_URL}/loans`, data);
export const returnLoan = (id) => axios.put(`${BASE_URL}/loans/return/${id}`);
export const deleteLoan = (id) => axios.delete(`${BASE_URL}/loans/${id}`);


