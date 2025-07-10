import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/login', form);
      const user = res.data.user;
      if (user.role !== 'Admin') {
        setError('Access denied. You are not an admin.');
        return;
      }
      localStorage.setItem('token', res.data.token);
      navigate('/admin-dashboard'); // You can route this wherever the admin lands
    } catch {
      setError('Login failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-6">Admin Login</h2>
      {error && <p className="mb-4 text-red-600">{error}</p>}
      <form onSubmit={submit} className="w-full max-w-sm space-y-4">
        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 border rounded"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Login
        </button>
      </form>

      <button
        onClick={() => navigate('/')}
        className="mt-4 text-blue-600 hover:underline"
      >
        ← Back
      </button>
    </div>
  );
}
