import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function SelectLogin() {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);

 useEffect(() => {
  const token = localStorage.getItem('accessToken');

  const tryRefresh = async () => {
    try {
      const res = await fetch('/api/refresh-token', {
        method: 'POST',
        credentials: 'include', // ✅ send cookie
      });

      if (!res.ok) throw new Error('Refresh failed');

      const data = await res.json();
      const newToken = data.accessToken;

      localStorage.setItem('accessToken', newToken);

      const decoded = jwtDecode(newToken);
      const role = decoded.role?.toLowerCase();

      if (role === 'admin') {
        navigate('/admin-dashboard');
      } else if (role === 'employee') {
        navigate('/dashboard');
      } else {
        setCheckingAuth(false);
      }
    } catch (err) {
      console.error('Refresh error:', err);
      localStorage.removeItem('accessToken');
      setCheckingAuth(false);
    }
  };

  if (token) {
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        // token expired
        tryRefresh();
      } else {
        const role = decoded.role?.toLowerCase();
        if (role === 'admin') {
          navigate('/admin-dashboard');
        } else if (role === 'employee') {
          navigate('/dashboard');
        } else {
          setCheckingAuth(false);
        }
      }
    } catch (error) {
      console.error('Invalid token:', error);
      localStorage.removeItem('accessToken');
      tryRefresh(); // attempt refresh on malformed token too
    }
  } else {
    // No token at all — try to refresh using cookie
    tryRefresh();
  }
}, [navigate]);



  if (checkingAuth) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center px-4">
      <div className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-xl rounded-xl p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-extrabold text-indigo-700 mb-6">Login</h1>
        <p className="text-gray-600 mb-8">Please select whether you're logging in as an admin or employee.</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/admin-login')}
            className="w-full sm:w-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-lg font-semibold shadow-lg transition"
          >
            Admin Login
          </button>
          <button
            onClick={() => navigate('/login')}
            className="w-full sm:w-1/2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 rounded-lg font-semibold shadow-lg transition"
          >
            Employee Login
          </button>
        </div>
      </div>
    </div>
  );
}
