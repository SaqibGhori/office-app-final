import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import watticon from '../../assets/watticon.png'
import axios from 'axios';
import { api } from "../api"; // path adjust karo

export default function RegisterPage() {
  // const BASE = import.meta.env.VITE_API_URL || "https://api.wattmatrix.io";

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPass] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  if (token) return <Navigate to="/dashboard" replace />;
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // next paint pe state set taa-ke transition run ho
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await api.post("/api/auth/register", {
        name,
        email,
        password,
      });
      // success
      navigate("/login");
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.msg ??
        err.response?.data?.errors?.[0]?.msg ??
        err.message
        : "Registration failed";
      setError(message);
    }
  };

  return (
    <div className="flex w-[90%] bg-primary rounded-[44px] mx-auto my-10 overflow-hidden">
      {/* LEFT: form box slides in from right */}
      <div
        className={`w-[50%] bg-secondary rounded-[40px] shadow-2xl flex justify-center items-center
        transform transition-all duration-700 ease-out will-change-transform
        ${ready ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
      >
        <div className="w-[80%]">
          <h2 className="text-5xl font-sans mb-4 text-primary">Register</h2>
          <form onSubmit={onSubmit}>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Name"
              required
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="password"
              value={password}
              onChange={e => setPass(e.target.value)}
              placeholder="Password (min 6 chars)"
              required
              className="w-full p-2 mb-4 border rounded"
            />
            {error && <p className="text-red-500">{error}</p>}
            <p>
              If you already have an account go to login {" "}
              <Link to="/login" className="text-red-700 px-2">Login</Link>
              page.
            </p>
            <button
              type="submit"
              className="w-full bg-primary text-white p-2 rounded disabled:opacity-60"
            >
              Register
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT: logo side (as-is) */}
      <div className="w-[50%] h-[90vh] flex justify-center items-center">
        <div>
          <img src={watticon} className="w-48 mx-auto" alt="" />
          <h1 className="text-white font-serif font-bold text-5xl">Watt Matrix</h1>
        </div>
      </div>
    </div>

  );
}
