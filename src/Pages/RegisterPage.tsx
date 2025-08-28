import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import watticon from '../../assets/watticon.png';
import axios from 'axios';
import { api } from "../api";

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPass] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  if (token) return <Navigate to="/dashboard" replace />;

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post("/api/auth/register", { name, email, password });
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
    <div className="flex flex-col md:flex-row w-[90%] bg-primary rounded-[44px] mx-auto my-10 overflow-hidden">

      {/* FORM SECTION */}
      <div
        className={`
          w-full md:w-1/2 bg-secondary rounded-t-[40px] md:rounded-[40px] shadow-2xl 
          flex justify-center items-center transform transition-all duration-700 ease-out will-change-transform
          ${ready 
            ? "opacity-100 translate-y-0 md:translate-x-0" 
            : "opacity-0 translate-y-full md:translate-x-full md:translate-y-0"
          }
        `}
      >
        <div className="w-[80%] py-8 md:py-0">
          <h2 className="text-3xl md:text-5xl font-sans mb-4 text-primary text-center md:text-left">
            Register
          </h2>

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
            <p className="text-center md:text-left">
              If you already have an account go to {" "}
              <Link to="/login" className="text-red-700 px-2">Login</Link>
              page.
            </p>
            <button
              type="submit"
              className="w-full bg-primary text-white p-2 rounded disabled:opacity-60 mt-3"
            >
              Register
            </button>
          </form>
        </div>
      </div>

      {/* IMAGE SECTION */}
      <div className="w-full md:w-1/2 h-[40vh] md:h-[90vh] flex justify-center items-center">
        <div>
          <img src={watticon} className="w-32 md:w-48 mx-auto" alt="" />
          <h1 className="text-white font-serif font-bold text-3xl md:text-5xl text-center md:text-left">
            Watt Matrix
          </h1>
        </div>
      </div>
    </div>
  );
}
