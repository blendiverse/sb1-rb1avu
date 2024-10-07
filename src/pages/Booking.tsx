import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Room {
  id: number;
  name: string;
  price: number;
  capacity: number;
}

const Booking: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { roomId } = location.state || {};

  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  useEffect(() => {
    if (checkIn && checkOut) {
      fetchAvailableRooms();
    }
  }, [checkIn, checkOut]);

  const fetchAvailableRooms = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/check_availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          check_in: checkIn.toISOString().split('T')[0],
          check_out: checkOut.toISOString().split('T')[0],
        }),
      });
      const data = await response.json();
      setAvailableRooms(data);
    } catch (error) {
      console.error('Error fetching available rooms:', error);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom || !checkIn || !checkOut) {
      alert('Please select a room and dates');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          room_id: selectedRoom.id,
          guest_name: 'Guest', // You might want to get this from user input or user profile
          check_in: checkIn.toISOString().split('T')[0],
          check_out: checkOut.toISOString().split('T')[0],
        }),
      });
      if (response.ok) {
        alert('Booking successful!');
        navigate('/');
      } else {
        alert('Booking failed. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Book Your Stay</h1>
      <form onSubmit={handleBooking} className="max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="checkIn" className="block text-gray-700 font-bold mb-2">Check-in Date</label>
          <DatePicker
            selected={checkIn}
            onChange={(date) => setCheckIn(date)}
            selectsStart
            startDate={checkIn}
            endDate={checkOut}
            minDate={new Date()}
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="checkOut" className="block text-gray-700 font-bold mb-2">Check-out Date</label>
          <DatePicker
            selected={checkOut}
            onChange={(date) => setCheckOut(date)}
            selectsEnd
            startDate={checkIn}
            endDate={checkOut}
            minDate={checkIn}
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
          />
        </div>
        {availableRooms.length > 0 && (
          <div className="mb-6">
            <label htmlFor="room" className="block text-gray-700 font-bold mb-2">Select Room</label>
            <select
              id="room"
              value={selectedRoom?.id || ''}
              onChange={(e) => setSelectedRoom(availableRooms.find(room => room.id === parseInt(e.target.value)) || null)}
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
            >
              <option value="">Select a room</option>
              {availableRooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name} - ${room.price}/night
                </option>
              ))}
            </select>
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
          disabled={!selectedRoom || !checkIn || !checkOut}
        >
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default Booking;