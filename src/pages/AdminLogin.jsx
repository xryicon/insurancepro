import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    navigate('/admin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f1c] text-white">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-xl">

        <h1 className="text-xl font-semibold mb-6 text-center">
          Admin Login
        </h1>

        <div className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 rounded text-white"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 rounded text-white"
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full text-sm text-gray-400 hover:text-white mt-2"
          >
            Back to website
          </button>

        </div>
      </div>
    </div>
  );
}