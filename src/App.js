import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { FaUserCircle, FaChartLine, FaWallet, FaHistory, FaCog, FaHome, FaSignOutAlt } from 'react-icons/fa';
import Home from './pages/Home';
import Trading from './pages/Trading';
import Wallet from './pages/Wallet';
import History from './pages/History';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

function AppContent() {
  const { currentUser, logout, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not authenticated, show auth routes
  if (!currentUser) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // If authenticated, show main app layout
  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <FaUserCircle className="text-3xl text-blue-400" />
          <div>
            <span className="text-lg font-semibold">Aloush</span>
            <div className="text-sm text-gray-400">{currentUser.email}</div>
          </div>
        </div>
        <nav className="flex flex-col gap-4">
          <SidebarLink to="/" icon={<FaHome />} label="Home" />
          <SidebarLink to="/trading" icon={<FaChartLine />} label="Trading" />
          <SidebarLink to="/wallet" icon={<FaWallet />} label="Wallet" />
          <SidebarLink to="/history" icon={<FaHistory />} label="History" />
          <SidebarLink to="/settings" icon={<FaCog />} label="Settings" />
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded transition text-red-400"
          >
            <FaSignOutAlt className="text-xl" />
            <span className="text-base">Sign Out</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trading" element={<Trading />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function SidebarLink({ to, icon, label }) {
  return (
    <Link to={to} className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded transition">
      <span className="text-xl">{icon}</span>
      <span className="text-base">{label}</span>
    </Link>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </AuthProvider>
  );
}
