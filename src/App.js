import React, { useState } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { FaUserCircle, FaChartLine, FaWallet, FaHistory, FaCog, FaHome, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not authenticated, show auth routes
  if (!currentUser) {
    return (
      <div className="min-h-screen w-full bg-gray-900">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    );
  }

  // If authenticated, show main app layout
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-gray-900 text-white">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-gray-800">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-white p-2"
        >
          {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
        <div className="flex items-center gap-2">
          <FaUserCircle className="text-2xl text-blue-400" />
          <span className="text-sm font-medium">{currentUser.email}</span>
        </div>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 bg-gray-800 p-6 flex flex-col
        transform transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="hidden md:flex items-center gap-3 mb-8">
          <FaUserCircle className="text-3xl text-blue-400" />
          <div>
            <span className="text-lg font-semibold">Aloush</span>
            <div className="text-sm text-gray-400">{currentUser.email}</div>
          </div>
        </div>
        <nav className="flex flex-col gap-4">
          <SidebarLink to="/" icon={<FaHome />} label="Home" onClick={() => setIsSidebarOpen(false)} />
          <SidebarLink to="/trading" icon={<FaChartLine />} label="Trading" onClick={() => setIsSidebarOpen(false)} />
          <SidebarLink to="/wallet" icon={<FaWallet />} label="Wallet" onClick={() => setIsSidebarOpen(false)} />
          <SidebarLink to="/history" icon={<FaHistory />} label="History" onClick={() => setIsSidebarOpen(false)} />
          <SidebarLink to="/settings" icon={<FaCog />} label="Settings" onClick={() => setIsSidebarOpen(false)} />
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded transition text-red-400"
          >
            <FaSignOutAlt className="text-xl" />
            <span className="text-base">Sign Out</span>
          </button>
        </nav>
      </aside>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
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

function SidebarLink({ to, icon, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded transition"
    >
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
