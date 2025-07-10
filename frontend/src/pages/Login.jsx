import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/login', form);
	  const user = res.data.user;
	  localStorage.setItem('token', res.data.token);
	  navigate(user.role === 'Admin' ? '/rooms' : '/dashboard');
    } catch {
      alert('Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

      <form onSubmit={submit} className="space-y-4">
        <input
          placeholder="Username"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Login
        </button>
      </form>

      <p className="mt-4 text-center">
        Don’t have an account?{' '}
        <Link to="/register" className="text-blue-600 hover:underline">
          Register here
        </Link>
      </p>
    </div>
  );
}
