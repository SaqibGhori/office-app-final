import React, { useEffect, useState } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { token, login } = useAuth();
  const navigate = useNavigate();
  const { search, hash } = useLocation();

  // already logged in? go straight to dashboard
  if (token) return <Navigate to="/" replace />;

  const [email, setEmail] = useState('');
  const [password, setPass] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // ⬇️ auto-login when redirected back from Google with token in URL
  useEffect(() => {
    const params =
      hash && hash.startsWith('#')
        ? new URLSearchParams(hash.slice(1)) // handle /login#token=...
        : new URLSearchParams(search);       // handle /login?token=...

    const t = params.get('token');
    const r = params.get('role')  || 'user';
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
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.msg || 'Login failed');

      // same flow as Google: store & go
      login(body.token, body.role, email);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl mb-4">Login</h2>

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

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-green-600 text-white p-2 rounded disabled:opacity-60"
        >
          {submitting ? 'Logging in…' : 'Login'}
        </button>
      </form>

      <button
        onClick={() => navigate('/register')}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 mt-4"
      >
        Go to Register
      </button>

      <button
        onClick={() => { window.location.href = 'http://localhost:3000/api/auth/google'; }}
        className="w-full mt-3 bg-red-600 text-white p-2 rounded"
      >
        Continue with Google
      </button>
    </div>
  );
}
