import React, { useState } from 'react';
import { useNavigate, Navigate  } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {

  const [name, setName]     = useState('');
  const [email, setEmail]   = useState('');
  const [password, setPass] = useState('');
  const [error, setError]   = useState<string|null>(null);
    const { token } = useAuth();
    if (token) return <Navigate to="/dashboard" replace />;
  const navigate = useNavigate();
  

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.msg || body.errors?.[0]?.msg || 'Registration failed');
      }
      // Success: redirect to login
      navigate('/login');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl mb-4">Register</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          value={name}
          onChange={e=>setName(e.target.value)}
          placeholder="Name"
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          value={email}
          onChange={e=>setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          value={password}
          onChange={e=>setPass(e.target.value)}
          placeholder="Password (min 6 chars)"
          required
          className="w-full p-2 border rounded"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
}
