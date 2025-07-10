import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState('');
  const [deleteMode, setDeleteMode] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return setError('No token found');

    const { role } = jwtDecode(token);
    if (role !== 'Admin') {
      setError('Access denied: Admins only');
      return;
    }

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bookingsRes, usersRes, roomsRes] = await Promise.all([
        api.get('/bookings'),
        api.get('/users'),
        api.get('/rooms'),
      ]);
      setBookings(bookingsRes.data);
      setUsers(usersRes.data);
      setRooms(roomsRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    try {
      await api.delete(`/bookings/${id}`);
      setBookings(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete booking');
    }
  };

  const getRoomName = (id) => rooms.find(r => r.id === id)?.name || 'Unknown';
  const getUserName = (id) => users.find(u => u.id === id)?.username || 'Unknown';

  // Group bookings by date (based on start_time)
  const groupedBookings = bookings.reduce((acc, b) => {
    const date = new Date(b.start_time).toISOString().split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(b);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-indigo-700">📋 All Bookings</h2>
          <button
            onClick={() => setDeleteMode(!deleteMode)}
            className={`px-4 py-2 rounded text-white font-medium shadow transition ${
              deleteMode
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {deleteMode ? 'Exit Delete Mode' : 'Delete'}
          </button>
        </div>

        {error && <p className="text-red-600 font-medium">{error}</p>}

        {Object.keys(groupedBookings).length === 0 ? (
          <p className="text-center text-gray-600">No bookings found.</p>
        ) : (
          Object.entries(groupedBookings)
            .sort((a, b) => new Date(a[0]) - new Date(b[0])) // sort by date ascending
            .map(([date, bookingsForDate]) => (
              <div key={date} className="bg-white/80 backdrop-blur-md rounded-lg shadow border border-gray-200">
                <div className="bg-indigo-100 text-indigo-800 px-6 py-3 rounded-t font-semibold">
                  📅 {new Date(date).toDateString()}
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto">
                    <thead className="bg-gray-50 text-gray-700 text-sm uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-2 text-left">Room</th>
                        <th className="px-4 py-2 text-left">User</th>
                        <th className="px-4 py-2 text-left">Start</th>
                        <th className="px-4 py-2 text-left">End</th>
                        {deleteMode && <th className="px-4 py-2 text-left">Actions</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {bookingsForDate.map((b, i) => (
                        <tr
                          key={b.id}
                          className={`text-sm ${
                            i % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                          } hover:bg-indigo-50 transition`}
                        >
                          <td className="px-4 py-3">{getRoomName(b.room_id)}</td>
                          <td className="px-4 py-3">{getUserName(b.user_id)}</td>
                          <td className="px-4 py-3">
                            {new Date(b.start_time).toLocaleString()}
                          </td>
                          <td className="px-4 py-3">
                            {new Date(b.end_time).toLocaleString()}
                          </td>
                          {deleteMode && (
                            <td className="px-4 py-3">
                              <button
                                onClick={() => handleDelete(b.id)}
                                className="text-red-600 hover:text-red-800 font-medium"
                              >
                                Delete
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}
