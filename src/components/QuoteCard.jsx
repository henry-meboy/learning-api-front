// src/components/QuoteCard.jsx
import React from "react";

export default function QuoteCard({ quote, canEdit = false, onEdit, onDelete }) {
  return (
    <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8, marginBottom: 12 }}>
      <p style={{ fontSize: 16, marginBottom: 8 }}>{quote.text}</p>
      <p style={{ margin: 0, fontStyle: "italic" }}>— {quote.author || "Anonymous"}</p>
      <p style={{ color: "#666", fontSize: 12, marginTop: 8 }}>
        by {quote.created_by_username || "unknown"} • {new Date(quote.created_at).toLocaleString()}
      </p>
      {canEdit && (
        <div style={{ marginTop: 8 }}>
          <button onClick={() => onEdit(quote)} style={{ marginRight: 8 }}>
            Edit
          </button>
          <button onClick={() => onDelete(quote.id)}>Delete</button>
        </div>
      )}
    </div>
  );
}
