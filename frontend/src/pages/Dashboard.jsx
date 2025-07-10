import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import DashboardCharts from './DashboardCharts'; // adjust if path differs

export default function Dashboard() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    api.get('/rooms').then((res) => setRooms(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* 📊 Chart Heading */}
        <h2 className="text-3xl font-bold text-black text-center">
          📊 Booking Status
        </h2>

        {/* Booking Charts */}
        <DashboardCharts />

        {/* 🏢 Available Rooms Heading */}
        <h2 className="text-3xl font-bold text-black text-center">
          🏢 Available Meeting Rooms
        </h2>

        {/* 🏠 Room Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl border border-slate-200 p-6 transition duration-300 ease-in-out"
            >
              <div className="mb-3">
                <h3 className="text-2xl font-semibold text-gray-800">{room.name}</h3>
                <p className="text-sm text-gray-500">{room.location}</p>
              </div>

              <div className="text-sm text-gray-700 space-y-1 mb-5">
                <p><span className="font-semibold">Capacity:</span> {room.capacity}</p>
                <p><span className="font-semibold">Amenities:</span> {room.amenities}</p>
              </div>

              <Link
                to={`/book?room_id=${room.id}`}
                className="inline-block w-full text-center bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white px-4 py-2 rounded-lg font-medium shadow-md transition"
              >
                Book Room
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
