import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';
import api from '../api';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [chartData, setChartData] = useState({
    upcoming: 0,
    ongoing: 0,
    past: 0,
  });

  useEffect(() => {
    api.get('/bookings').then(res => {
      const now = new Date();
      const stats = { upcoming: 0, ongoing: 0, past: 0 };

      res.data.forEach(b => {
        const start = new Date(b.start_time);
        const end = new Date(b.end_time);
        if (end < now) stats.past++;
        else if (start > now) stats.upcoming++;
        else stats.ongoing++;
      });

      setChartData(stats);
      setBookings(res.data.sort((a, b) => new Date(b.start_time) - new Date(a.start_time)));
    });
  }, []);

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

      {/* Chart + Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* 📊 Booking Distribution Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Booking Distribution</h2>
<div className="flex flex-col md:flex-row items-center justify-center gap-6">
  {/* 🍩 Donut Chart */}
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
    {/* Center Label */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
      <p className="text-2xl font-bold text-gray-800">{bookings.length}</p>
      <p className="text-xs text-gray-500">Total Bookings</p>
    </div>
  </div>

  {/* 🏷️ Custom Legend */}
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

        {/* 🧭 Quick Actions */}
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

      {/* 📅 Recent Bookings */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">🕘 Recent Bookings</h2>
        {bookings.slice(0, 5).length === 0 ? (
          <p className="text-gray-500">No recent bookings.</p>
        ) : (
          <ul className="divide-y">
            {bookings.slice(0, 5).map(b => (
              <li key={b.id} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-gray-800 font-medium">
                    Room ID: <span className="text-indigo-600">{b.room_id}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(b.start_time).toLocaleString()} → {new Date(b.end_time).toLocaleString()}
                  </p>
                </div>
                <span className="mt-2 sm:mt-0 bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">
                  User: {b.user_id}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
