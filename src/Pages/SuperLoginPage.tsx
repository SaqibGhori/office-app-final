import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { api } from "../api";
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function SuperLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPass] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { token, role, login } = useAuth();

  // ✅ Auto-redirect if already logged in
  if (token) {
    if (role === "superadmin" || role === "admin") {
      return <Navigate to="/superadmin/home" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const { data } = await api.post("/superadmin/auth/login", {
        email,
        password,
      });

      if (!data?.token || !data?.role) {
        throw new Error(data?.msg || "Invalid login response");
      }

      // ✅ Only allow superadmin/admin roles
      if (data.role !== "superadmin" && data.role !== "admin") {
        setError("Only superadmin or admin accounts can log in from this page.");
        setSubmitting(false);
        return;
      }

      // ✅ Save token, role, and email using AuthContext
      login(data.token, data.role, email);
      // ✅ Redirect based on role
      if (data.role === "superadmin") {
        navigate("/superadmin/home", { replace: true });
      } else {
        navigate("/superadmin/dashboard", { replace: true });
      }
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
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl mb-4 text-center font-bold text-[#001a33]">
        Superadmin Login
      </h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          value={password}
          onChange={e => setPass(e.target.value)}
          placeholder="Password"
          required
          className="w-full p-2 border rounded"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#001a33] text-white p-2 rounded disabled:opacity-60"
        >
          {submitting ? "Logging in…" : "Log In"}
        </button>
      </form>
    </div>
  );
}
