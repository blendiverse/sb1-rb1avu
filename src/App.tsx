import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import RoomList from './pages/RoomList';
import Booking from './pages/Booking';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = (admin: boolean) => {
    setIsAuthenticated(true);
    setIsAdmin(admin);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header isAuthenticated={isAuthenticated} isAdmin={isAdmin} onLogout={handleLogout} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rooms" element={<RoomList />} />
            <Route
              path="/booking"
              element={isAuthenticated ? <Booking /> : <Navigate to="/login" />}
            />
            <Route
              path="/login"
              element={<Login onLogin={handleLogin} />}
            />
            <Route path="/register" element={<Register />} />
            <Route
              path="/admin"
              element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;