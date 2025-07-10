import { useEffect, useState } from 'react';
import api from '../api';

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({
    name: '',
    location: '',
    capacity: '',
    amenities: '',
  });
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [message, setMessage] = useState('');

  const fetchRooms = () => {
    api.get('/rooms').then(res => setRooms(res.data));
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRoomId) {
        // Edit mode: update existing room
        await api.put(`/rooms/${editingRoomId}`, form);
        setMessage('✅ Room updated successfully!');
      } else {
        // Add mode: create new room
        await api.post('/rooms', form);
        setMessage('✅ Room added successfully!');
      }
      setForm({ name: '', location: '', capacity: '', amenities: '' });
      setEditingRoomId(null);
      fetchRooms();
    } catch (err) {
      setMessage('❌ Failed to save room.');
    }
  };

  const handleEdit = (room) => {
    setForm({
      name: room.name,
      location: room.location,
      capacity: room.capacity,
      amenities: room.amenities,
    });
    setEditingRoomId(room.id);
    setMessage('');
  };

  const handleDelete = async (roomId) => {
    const confirm = window.confirm('Are you sure you want to delete this room?');
    if (!confirm) return;

    try {
      await api.delete(`/rooms/${roomId}`);
      setMessage('✅ Room deleted successfully!');
      fetchRooms();
    } catch {
      setMessage('❌ Failed to delete room.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Room Management</h2>
      {message && <div className="mb-4 text-center font-medium">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Room Name"
          className="w-full p-2 border rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Location"
          className="w-full p-2 border rounded"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Capacity"
          className="w-full p-2 border rounded"
          value={form.capacity}
          onChange={(e) => setForm({ ...form, capacity: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Amenities (comma-separated)"
          className="w-full p-2 border rounded"
          value={form.amenities}
          onChange={(e) => setForm({ ...form, amenities: e.target.value })}
          required
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          {editingRoomId ? 'Update Room' : 'Add Room'}
        </button>
        {editingRoomId && (
          <button
            type="button"
            className="ml-4 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            onClick={() => {
              setEditingRoomId(null);
              setForm({ name: '', location: '', capacity: '', amenities: '' });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <div>
        <h3 className="text-xl font-semibold mb-2">Existing Rooms</h3>
        <ul className="space-y-3">
          {rooms.map((room) => (
            <li key={room.id} className="p-4 border rounded shadow-sm">
              <p className="font-bold">{room.name}</p>
              <p>Location: {room.location}</p>
              <p>Capacity: {room.capacity}</p>
              <p>Amenities: {room.amenities}</p>
              <div className="mt-2 flex gap-3">
                <button
                  onClick={() => handleEdit(room)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(room.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  🗑 Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
