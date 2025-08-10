// src/pages/Login.jsx
import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await login({ username, password });
      navigate("/quotes");
    } catch (err) {
      console.error(err);
      setError("Invalid credentials or network error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>
      <form onSubmit={submit} style={{ maxWidth: 420 }}>
        <div style={{ marginBottom: 8 }}>
          <input placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div style={{ marginBottom: 8 }}>
          <input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" disabled={busy}>
          Login
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}
