import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import api from '../api';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [chartData, setChartData] = useState({ upcoming: 0, ongoing: 0, past: 0 });

  useEffect(() => {
    const now = new Date();
    const stats = { upcoming: 0, ongoing: 0, past: 0 };

    async function fetchData() {
      try {
        const [bookingsRes, usersRes, roomsRes] = await Promise.all([
          api.get('/bookings'),
          api.get('/users'),
          api.get('/rooms'),
        ]);

        bookingsRes.data.forEach(b => {
          const start = new Date(b.start_time);
          const end = new Date(b.end_time);
          if (end < now) stats.past++;
          else if (start > now) stats.upcoming++;
          else stats.ongoing++;
        });

        setBookings(bookingsRes.data.sort((a, b) => new Date(b.start_time) - new Date(a.start_time)));
        setUsers(usersRes.data);
        setRooms(roomsRes.data);
        setChartData(stats);
      } catch (err) {
        console.error('Dashboard data load failed:', err);
      }
    }

    fetchData();
  }, []);

  const getUsername = (id) => users.find(u => u.id === id)?.username || `User #${id}`;
  const getRoomName = (id) => rooms.find(r => r.id === id)?.name || `Room #${id}`;

  const todayDate = new Date().toISOString().split('T')[0];
  const todayBookings = bookings.filter(b => {
    const startDate = new Date(b.start_time).toISOString().split('T')[0];
    return startDate === todayDate;
  });

  const doughnutData = {
    labels: ['Upcoming', 'Ongoing', 'Past'],
    datasets: [
      {
        data: [chartData.upcoming, chartData.ongoing, chartData.past],
        backgroundColor: ['#facc15', '#22c55e', '#9ca3af'],
        borderColor: ['#eab308', '#16a34a', '#71717a'],
        borderWidth: 1,
        cutout: '70%',
      },
    ],
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 to-blue-100 p-6">
      <h1 className="text-3xl font-bold text-indigo-700 mb-8 text-center">Admin Dashboard</h1>

      {/* 📊 Chart + Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* 🍩 Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Booking Distribution</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="relative w-48 h-48">
              <Doughnut
                data={doughnutData}
                options={{
                  plugins: {
                    legend: { display: false },
                    tooltip: { enabled: true },
                  },
                }}
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="text-2xl font-bold text-gray-800">{bookings.length}</p>
                <p className="text-xs text-gray-500">Total Bookings</p>
              </div>
            </div>

            {/* 🏷️ Legend */}
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                <span className="text-gray-700">Upcoming ({chartData.upcoming})</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span className="text-gray-700">Ongoing ({chartData.ongoing})</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-gray-400"></span>
                <span className="text-gray-700">Past ({chartData.past})</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 🧭 Quick Links */}
        <div className="bg-white p-6 rounded-xl shadow-md grid gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Manage Rooms</h2>
            <p className="text-sm text-gray-600 mb-3">Add, edit or view available rooms.</p>
            <button
              onClick={() => navigate('/rooms')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
            >
              Go to Room Management
            </button>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">View All Bookings</h2>
            <p className="text-sm text-gray-600 mb-3">Check who booked what and when.</p>
            <button
              onClick={() => navigate('/admin/bookings')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
            >
              View Bookings
            </button>
          </div>
        </div>
      </div>

      {/* 📅 Recent Bookings List */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">🕘 Recent Bookings (Today)</h2>

        {todayBookings.length === 0 ? (
          <p className="text-gray-500">No bookings today.</p>
        ) : (
          <ul className="divide-y">
            {todayBookings.slice(0, 5).map(b => {
              const now = new Date();
              const start = new Date(b.start_time);
              const end = new Date(b.end_time);
              const isOngoing = start <= now && now <= end;

              return (
                <li key={b.id} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-gray-800 font-medium">
                      Room: <span className="text-indigo-600">{getRoomName(b.room_id)}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      {start.toLocaleString()} → {end.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">
                      {getUsername(b.user_id)}
                    </span>
                    {isOngoing && (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded shadow">
                        Ongoing
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
