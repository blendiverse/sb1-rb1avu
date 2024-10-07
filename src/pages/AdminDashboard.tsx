import React, { useState, useEffect } from 'react';

interface Booking {
  id: number;
  room_id: number;
  guest_name: string;
  check_in: string;
  check_out: string;
}

interface Room {
  id: number;
  name: string;
  price: number;
  capacity: number;
}

const AdminDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [newRoom, setNewRoom] = useState<Omit<Room, 'id'>>({ name: '', price: 0, capacity: 1 });

  useEffect(() => {
    fetchBookings();
    fetchRooms();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/bookings');
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/rooms');
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/admin/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRoom),
      });
      if (response.ok) {
        alert('Room added successfully');
        fetchRooms();
        setNewRoom({ name: '', price: 0, capacity: 1 });
      } else {
        alert('Failed to add room');
      }
    } catch (error) {
      console.error('Error adding room:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleDeleteRoom = async (roomId: number) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/rooms/${roomId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert('Room deleted successfully');
          fetchRooms();
        } else {
          alert('Failed to delete room');
        }
      } catch (error) {
        console.error('Error deleting room:', error);
        alert('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Bookings</h2>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-out</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td className="px-6 py-4 whitespace-nowrap">{booking.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{booking.room_id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{booking.guest_name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{booking.check_in}</td>
                <td className="px-6 py-4 whitespace-nowrap">{booking.check_out}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Rooms</h2>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rooms.map((room) => (
              <tr key={room.id}>
                <td className="px-6 py-4 whitespace-nowrap">{room.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{room.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">${room.price}</td>
                <td className="px-6 py-4 whitespace-nowrap">{room.capacity}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleDeleteRoom(room.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Add New Room</h2>
      <form onSubmit={handleAddRoom} className="max-w-md">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Room Name</label>
          <input
            type="text"
            id="name"
            value={newRoom.name}
            onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
            required
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="price" className="block text-gray-700 font-bold mb-2">Price per Night</label>
          <input
            type="number"
            id="price"
            value={newRoom.price}
            onChange={(e) => setNewRoom({ ...newRoom, price: Number(e.target.value) })}
            required
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="capacity" className="block text-gray-700 font-bold mb-2">Capacity</label>
          <input
            type="number"
            id="capacity"
            value={newRoom.capacity}
            onChange={(e) => setNewRoom({ ...newRoom, capacity: Number(e.target.value) })}
            required
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Add Room
        </button>
      </form>
    </div>
  );
};

export default AdminDashboard;