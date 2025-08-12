import React, { useState } from 'react';
import { useNavigate }    from 'react-router-dom';

export default function SuperSignupPage() {
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPass]   = useState('');
  const [error, setError]     = useState<string|null>(null);
  const navigate              = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await fetch('http://localhost:3000/superadmin/auth/signup', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ name, email, password })
    });
    if (!res.ok) {
      const body = await res.json();
      return setError(body.msg || 'Signup failed');
    }
    navigate('/superadmin/login');
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl mb-4">Superadmin Sign Up</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <input value={name}       onChange={e=>setName(e.target.value)}       placeholder="Name"     required className="w-full p-2 border rounded"/>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email"    required className="w-full p-2 border rounded"/>
        <input type="password" value={password} onChange={e=>setPass(e.target.value)} placeholder="Password" required className="w-full p-2 border rounded"/>
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Sign Up
        </button>
      </form>
    </div>
  );
}
