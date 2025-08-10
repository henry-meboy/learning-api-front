// src/context/AuthContext.jsx
import React, { createContext, useEffect, useState } from "react";
import { login as apiLogin, signup as apiSignup } from "../api/api";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState({ isAuthenticated: false, username: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const access = localStorage.getItem("access");
    const username = localStorage.getItem("username");
    if (access && username) {
      setAuth({ isAuthenticated: true, username });
    } else {
      setAuth({ isAuthenticated: false, username: null });
    }
    setLoading(false);
  }, []);

  const login = async ({ username, password }) => {
    const resp = await apiLogin({ username, password });
    const { access, refresh } = resp.data;
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
    localStorage.setItem("username", username);
    setAuth({ isAuthenticated: true, username });
    return resp;
  };

  const signup = async ({ username, password }) => {
    return apiSignup({ username, password });
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");
    setAuth({ isAuthenticated: false, username: null });
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ auth, loading, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};
