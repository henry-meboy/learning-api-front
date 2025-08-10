// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import QuotesList from "./pages/QuotesList";
import QuoteForm from "./pages/QuoteForm";

export default function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/quotes" element={<QuotesList />} />
        <Route path="/quotes/new" element={<QuoteForm />} />
        <Route path="/quotes/:id/edit" element={<QuoteForm />} />
      </Routes>
    </div>
  );
}
