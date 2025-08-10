// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { getRandomQuote } from "../api/api";
import QuoteCard from "../components/QuoteCard";

export default function Home() {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRandom = async () => {
    setLoading(true);
    try {
      const res = await getRandomQuote();
      setQuote(res.data);
    } catch (e) {
      console.error(e);
      setQuote(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandom();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Random Quote</h2>
      {loading ? (
        <p>Loading...</p>
      ) : quote && quote.id ? (
        <QuoteCard quote={quote} />
      ) : (
        <p>No quotes available.</p>
      )}
      <button onClick={fetchRandom} style={{ marginTop: 12 }}>
        New random quote
      </button>
    </div>
  );
}
