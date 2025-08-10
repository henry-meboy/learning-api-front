// src/pages/Signup.jsx
import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await signup({ username, password });
      setMsg("Account created. Please login.");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      console.error(err);
      setMsg("Signup failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Signup</h2>
      <form onSubmit={submit} style={{ maxWidth: 420 }}>
        <div style={{ marginBottom: 8 }}>
          <input placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div style={{ marginBottom: 8 }}>
          <input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" disabled={busy}>
          Create account
        </button>
        {msg && <p>{msg}</p>}
      </form>
    </div>
  );
}
