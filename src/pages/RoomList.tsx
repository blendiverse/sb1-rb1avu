import React from 'react';
import { Link } from 'react-router-dom';

const rooms = [
  { id: 1, name: 'Cozy Single', price: 50, capacity: 1, image: '/images/room1.jpg' },
  { id: 2, name: 'Double Delight', price: 80, capacity: 2, image: '/images/room2.jpg' },
  { id: 3, name: 'Family Suite', price: 120, capacity: 4, image: '/images/room3.jpg' },
  { id: 4, name: 'Luxury Penthouse', price: 200, capacity: 2, image: '/images/room4.jpg' },
  { id: 5, name: 'Garden View', price: 90, capacity: 2, image: '/images/room5.jpg' },
  { id: 6, name: 'Ocean Breeze', price: 150, capacity: 3, image: '/images/room6.jpg' },
];

const RoomList: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Our Rooms</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rooms.map((room) => (
          <div key={room.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={room.image}
              alt={room.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{room.name}</h2>
              <p className="text-gray-600 mb-2">Capacity: {room.capacity} {room.capacity === 1 ? 'person' : 'people'}</p>
              <p className="text-lg font-bold mb-4">${room.price} / night</p>
              <Link
                to="/booking"
                state={{ roomId: room.id }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
              >
                Book Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomList;