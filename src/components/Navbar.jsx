// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Navbar() {
  const { auth, logout } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL || "";

  // try to remove trailing slash if present
  const swaggerLink = apiUrl.replace(/\/$/, "") + "/swagger/";

  return (
    <nav style={{ padding: "12px 16px", borderBottom: "1px solid #eee" }}>
      <Link to="/" style={{ marginRight: 12 }}>
        Home
      </Link>
      <Link to="/quotes" style={{ marginRight: 12 }}>
        Quotes
      </Link>


      <span style={{ float: "right" }}>
        {auth.isAuthenticated ? (
          <>
            <strong style={{ marginRight: 8 }}>{auth.username}</strong>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: 8 }}>
              Login
            </Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </span>
    </nav>
  );
}
