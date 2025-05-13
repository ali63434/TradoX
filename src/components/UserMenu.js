import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSettings,
  FiGlobe, 
  FiHeadphones, 
  FiUser, 
  FiSun, 
  FiMoon, 
  FiLogOut,
  FiChevronDown,
  FiHelpCircle,
  FiBell
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import AdminMessages from './AdminMessages';
import MessageModal from './MessageModal';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('en');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [lastSupportReply, setLastSupportReply] = useState(null);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && 
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle escape key to close menu
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  const handleLanguageChange = async (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        'settings.language': newLanguage
      });
    } catch (error) {
      console.error('Error updating language:', error);
    }
  };

  const handleSignOut = async () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      try {
        await logout();
        navigate('/login');
      } catch (error) {
        console.error('Error signing out:', error);
      }
    }
  };

  const handleMessageClick = (message) => {
    setSelectedMessage(message);
  };

  const handleCloseModal = () => {
    setSelectedMessage(null);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      {/* Menu Button */}
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="relative flex items-center justify-center w-10 h-10 text-white bg-gray-800 rounded-full hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Open menu"
      >
        <FiSettings className="text-xl" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
          3
        </span>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden z-50"
          >
            {/* Language Section */}
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Language
              </h3>
              <select
                value={language}
                onChange={handleLanguageChange}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
              >
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
            </div>

            {/* Support & Help Section */}
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Support & Help
              </h3>
              <button
                onClick={() => {
                  navigate('/support');
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FiHeadphones className="text-gray-400" />
                <span>Support Center</span>
              </button>
              <button
                onClick={() => {
                  navigate('/help');
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FiHelpCircle className="text-gray-400" />
                <span>Help Center</span>
              </button>
              {lastSupportReply && (
                <p className="mt-2 text-xs text-gray-400">
                  Last reply: {new Date(lastSupportReply).toLocaleString()}
                </p>
              )}
            </div>

            {/* Notifications Section */}
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Notifications
              </h3>
              <div className="max-h-48 overflow-y-auto">
                <AdminMessages onMessageClick={handleMessageClick} />
              </div>
              <button
                onClick={() => {
                  navigate('/notifications');
                  setIsOpen(false);
                }}
                className="w-full mt-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                View All Notifications
              </button>
            </div>

            {/* Account Section */}
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Account
              </h3>
              <button
                onClick={() => {
                  navigate('/profile');
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FiUser className="text-gray-400" />
                <span>My Profile</span>
              </button>
              <button
                onClick={handleThemeToggle}
                className="w-full flex items-center gap-3 px-3 py-2 text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                {theme === 'dark' ? (
                  <FiSun className="text-gray-400" />
                ) : (
                  <FiMoon className="text-gray-400" />
                )}
                <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>

            {/* Sign Out Section */}
            <div className="p-4">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <FiLogOut />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message Modal */}
      {selectedMessage && (
        <MessageModal 
          message={selectedMessage} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};

export default UserMenu; 