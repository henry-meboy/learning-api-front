// src/pages/QuotesList.jsx
import React, { useEffect, useState } from "react";
import { listQuotes, deleteQuote } from "../api/api";
import QuoteCard from "../components/QuoteCard";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

export default function QuotesList() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await listQuotes();
      setQuotes(res.data || []);
    } catch (e) {
      console.error(e);
      setErr("Failed to load quotes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this quote?")) return;
    try {
      await deleteQuote(id);
      setQuotes((s) => s.filter((q) => q.id !== id));
    } catch (e) {
      console.error(e);
      alert("Delete failed");
    }
  };

  const handleEdit = (quote) => {
    navigate(`/quotes/${quote.id}/edit`);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Quotes</h2>
      <div style={{ marginBottom: 12 }}>
        {auth.isAuthenticated ? <Link to="/quotes/new">Create new quote</Link> : <Link to="/login">Login to create quotes</Link>}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : err ? (
        <p style={{ color: "red" }}>{err}</p>
      ) : quotes.length === 0 ? (
        <p>No quotes yet.</p>
      ) : (
        quotes.map((q) => (
          <QuoteCard
            key={q.id}
            quote={q}
            canEdit={auth.isAuthenticated && auth.username === q.created_by_username}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
}
