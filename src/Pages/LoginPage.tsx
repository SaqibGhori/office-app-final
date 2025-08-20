import React, { useEffect, useState } from 'react';
import { useNavigate, Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import googleloginicon from '../../assets/googleloginicon.png'
import watticon from '../../assets/watticon.png'
import axios from 'axios';
import { api } from "../api";


export default function LoginPage() {

  const { token, login } = useAuth();
  const navigate = useNavigate();
  const { search, hash } = useLocation();
  const BASE = import.meta.env.VITE_API_URL || "https://api.wattmatrix.io";

  if (token) return <Navigate to="/" replace />;

  const [email, setEmail] = useState('');
  const [password, setPass] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);


  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const params =
      hash && hash.startsWith('#')
        ? new URLSearchParams(hash.slice(1))
        : new URLSearchParams(search);

    const t = params.get('token');
    const r = params.get('role') || 'user';
    const e = params.get('email') || '';

    if (t) {
      login(t, r, e);
      navigate('/', { replace: true });
    }
  }, [search, hash, login, navigate]);


  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const { data } = await api.post(
        "/api/auth/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      login(data.token, data.role, email);
      navigate("/");
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.msg ??
        err.response?.data?.errors?.[0]?.msg ??
        err.message
        : "Login failed";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex w-[90%] bg-primary rounded-[44px] mx-auto my-10 overflow-hidden">
      <div className="w-[50%] h-[90vh] flex justify-center items-center">
        <div>
          <img src={watticon} className="w-48 mx-auto" alt="" />
          <h1 className="text-white font-serif font-bold text-5xl">Watt Matrix</h1>
        </div>
      </div>

      <div
        className={`w-[50%] bg-secondary rounded-[40px] shadow-2xl flex justify-center items-center
    transform transition-all duration-700 ease-out will-change-transform
    ${ready ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}
      >
        <div className="w-[80%]">
          <h2 className="text-5xl font-sans mb-4 text-primary">Login</h2>

          <form onSubmit={onSubmit}>
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
              placeholder="Password"
              required
              className="w-full p-2 mb-4 border rounded"
            />
            {error && <p className="text-red-500">{error}</p>}
            <p>
              If you dont have an account please{" "}
              <Link to="/register" className="text-red-700 px-2">Register</Link>
              first.
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-white p-2 rounded disabled:opacity-60 mt-3"
            >
              {submitting ? "Logging in…" : "Login"}
            </button>
          </form>

          <button
            onClick={() => { window.location.href = `${BASE}/api/auth/google`; }}
            className="w-full mt-3 flex justify-center items-center bg-white p-2 rounded"
          >
            <img src={googleloginicon} className="w-6 mr-3" alt="" />
            <span>Login with Google</span>
          </button>
        </div>
      </div>
    </div>

  );
}
