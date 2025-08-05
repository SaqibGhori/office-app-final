import React, { useState } from 'react';
import { useNavigate }    from 'react-router-dom';

export default function SuperLoginPage() {
  const [email, setEmail]     = useState('');
  const [password, setPass]   = useState('');
  const [error, setError]     = useState<string|null>(null);
  const navigate              = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await fetch('http://localhost:3000/superadmin/auth/login', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ email, password })
    });
    const body = await res.json();
    if (!res.ok) return setError(body.msg || 'Login failed');

    localStorage.setItem('superToken', body.token);
    navigate('/superadmin/home');
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl mb-4">Superadmin Login</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" required className="w-full p-2 border rounded"/>
        <input type="password" value={password} onChange={e=>setPass(e.target.value)} placeholder="Password" required className="w-full p-2 border rounded"/>
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">
          Log In
        </button>
      </form>
    </div>
  );
}
