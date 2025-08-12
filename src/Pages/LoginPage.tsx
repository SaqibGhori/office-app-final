import React, { useState } from 'react';
import { useNavigate , Navigate} from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
   const { token } = useAuth();
     if (token) return <Navigate to="/" replace />;

     const navigate  = useNavigate();

  const [email, setEmail]     = useState('');
  const [password, setPass]   = useState('');
  const [error, setError]     = useState<string|null>(null);
  const { login }             = useAuth();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.msg || 'Login failed');
      // Save token & role
      login(body.token, body.role, email);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl mb-4">Login</h2>
      <form onSubmit={onSubmit} className="space-y-4">
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
          placeholder="Password"
          required
          className="w-full p-2 border rounded"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">
          Login
        </button>
      </form>
       <button
        onClick={() => navigate('/register')}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 mt-4"
      >
        Go to Register
      </button> 
    </div>
  );
}
