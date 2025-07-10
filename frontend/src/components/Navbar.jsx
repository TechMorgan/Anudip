import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const token = localStorage.getItem('token');
  let user = null;

  try {
    user = token ? jwtDecode(token) : null;
  } catch (e) {
    localStorage.clear();
    navigate('/select-login');
  }

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  // Hide navbar on auth pages
  const hideNavbar = ['/', '/login', '/register', '/admin-login', '/select-login'].includes(location.pathname);
  if (hideNavbar) return null;

  const dashboardRoute = user?.role === 'Admin' ? '/admin-dashboard' : '/dashboard';

  return (
    <nav className="sticky top-0 z-50 w-full bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* App Title */}
        <Link
          to={dashboardRoute}
          className="text-xl text-white font-bold tracking-wide hover:text-white"
        >
         Meeting Room App 📅
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex gap-6 items-center text-sm">
          <Link to={dashboardRoute} className="text-white hover:text-white transition">Dashboard</Link>

          {user?.role === 'Employee' && (
            <Link to="/bookings" className="text-white hover:text-white transition">My Bookings</Link>
          )}

          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white transition"
          >
            Logout
          </button>

          {user && (
            <span className="text-sm font-light">
              Logged in as: <span className="font-medium">{user.role}</span>
            </span>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-white focus:outline-none"
          title="Toggle navigation"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="lg:hidden px-4 pb-4 bg-gradient-to-r from-indigo-600 to-cyan-600 text-sm">
          <ul className="space-y-3">
            <li>
              <Link
                to={dashboardRoute}
                className="block hover:text-gray-200 text-white"
                onClick={() => setMobileOpen(false)}
              >
                Dashboard
              </Link>
            </li>

            {user?.role === 'Employee' && (
              <li>
                <Link
                  to="/bookings"
                  className="block hover:text-gray-200 text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  My Bookings
                </Link>
              </li>
            )}

            <li>
              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white w-full text-left"
              >
                Logout
              </button>
            </li>

            {user && (
              <li className="text-white text-xs font-light">
                Logged in as: <span className="font-medium">{user.role}</span>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}
