import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode'; // ✅ Fix the import syntax

export default function SelectLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const role = decoded?.role;

        if (role === 'Admin') {
          navigate('/admin-dashboard', { replace: true });
        } else if (role === 'Employee') {
          navigate('/dashboard', { replace: true });
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('jwtToken'); // Clean up if token is broken
      }
    }
  }, [navigate]);

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
