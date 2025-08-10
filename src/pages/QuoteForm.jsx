// src/pages/QuoteForm.jsx
import React, { useEffect, useState } from "react";
import { createQuote, getQuote, updateQuote } from "../api/api";
import { useNavigate, useParams } from "react-router-dom";

export default function QuoteForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const res = await getQuote(id);
        setText(res.data.text || "");
        setAuthor(res.data.author || "");
      } catch (e) {
        console.error(e);
        alert("Failed to load quote");
      }
    })();
  }, [id, isEdit]);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (isEdit) {
        await updateQuote(id, { text, author });
      } else {
        await createQuote({ text, author });
      }
      navigate("/quotes");
    } catch (e) {
      console.error(e);
      alert("Save failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>{isEdit ? "Edit Quote" : "Create Quote"}</h2>
      <form onSubmit={submit} style={{ maxWidth: 600 }}>
        <div style={{ marginBottom: 8 }}>
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Quote text" required rows={4} style={{ width: "100%" }} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author (optional)" />
        </div>
        <button type="submit" disabled={busy}>
          {busy ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}
