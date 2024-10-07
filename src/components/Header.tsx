import React from 'react';
import { Link } from 'react-router-dom';
import { Home, User, LogOut } from 'lucide-react';

interface HeaderProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated, isAdmin, onLogout }) => {
  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Home size={24} />
          <span className="text-xl font-bold">Cozy Homestay</span>
        </Link>