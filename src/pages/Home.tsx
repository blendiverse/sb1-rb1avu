import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Welcome to Cozy Homestay</h1>
      <p className="text-xl mb-8">Experience the comfort of home away from home.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={`https://source.unsplash.com/random/800x600?homestay,${index}`}
              alt={`Homestay ${index}`}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">Cozy Room {index}</h2>
              <p className="text-gray-600 mb-4">Experience comfort and tranquility in our beautifully designed rooms.</p>
              <Link to="/rooms" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300">
                View Rooms
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;