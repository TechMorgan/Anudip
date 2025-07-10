import { Link, useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

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

  // Hide navbar on login/register/home pages
  const hideNavbar = ['/', '/login', '/register', '/admin-login', '/select-login'].includes(location.pathname);
  if (hideNavbar) return null;

  const dashboardRoute = user?.role === 'Admin' ? '/admin-dashboard' : '/dashboard';

  return (
    <nav className="sticky top-0 z-50 w-full bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between">
        {/* App Logo / Title */}
        <Link
          to={dashboardRoute}
          className="text-xl text-white font-bold tracking-wide hover:text-white"
        >
          📅 Meeting Room App
        </Link>

        {/* Navigation Links */}
        <div className="hidden lg:block">
          <ul className="flex flex-col gap-2 mt-2 lg:mt-0 lg:flex-row lg:items-center lg:gap-6 text-sm">
            <li>
              <Link
                to={dashboardRoute}
                className="text-white hover:text-white transition"
              >
                Dashboard
              </Link>
            </li>

            {user?.role === 'Employee' && (
              <li>
                <Link
                  to="/bookings"
                  className="text-white hover:text-white transition"
                >
                  My Bookings
                </Link>
              </li>
            )}

            <li>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
              >
                Logout
              </button>
            </li>

            {user && (
              <li>
                <span className="text-sm font-light">
                  Logged in as: <span className="font-semibold">{user.role}</span>
                </span>
              </li>
            )}
          </ul>
        </div>

        {/* Mobile Hamburger Placeholder */}
        <button
          className="ml-auto block lg:hidden text-white focus:outline-none"
          type="button"
          title="Menu (Not implemented)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
