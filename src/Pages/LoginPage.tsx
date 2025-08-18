import React, { useEffect, useState } from 'react';
import { useNavigate, Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import googleloginicon from '../../assets/googleloginicon.png'

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
    <div className='flex w-[90%] mx-auto my-10'>
      <div className='w-[50%] h-[100vh] bg-primary rounded-[40px] flex justify-center items-center'>
        <div className='bg-yellow-300 '>testing</div>
      </div>

      <div className='w-[50%] bg-secondary rounded-[40px] flex justify-center items-center'>
        <div className="">
          <h2 className="text-5xl font-sans mb-4">Login</h2>

          <form onSubmit={onSubmit} className="">
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
            <p className=''>If you dont have an account please
              <Link to={'/register'}
                className="w-full text-red-700 px-2"
              >
                Register
              </Link>
              first.
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-white p-2 rounded disabled:opacity-60"
            >
              {submitting ? 'Logging in…' : 'Login'}
            </button>
          </form>


          <button
            onClick={() => { window.location.href = 'http://localhost:3000/api/auth/google'; }}
            className="w-full mt-3 flex justify-center items-center  bg-white p-2 rounded"
          >
            <img src={googleloginicon} className='w-6 mr-3' alt="" /><span> Login with Google</span>
          </button>
        </div>
      </div>
    </div>

  );
}
