import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FaUser, FaGlobe, FaSun, FaMoon, FaBell, FaLock, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MenuContainer = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: rgba(26, 26, 29, 0.95);
  border-radius: 12px;
  padding: 0.5rem;
  min-width: 200px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1000;
  animation: slideDown 0.2s ease-out;
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  color: #ffffff;
  background: none;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  svg {
    font-size: 1.25rem;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0.5rem 0;
`;

const SettingsMenu = ({ onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    // Add theme switching logic here
  };

  return (
    <MenuContainer ref={menuRef}>
      <MenuItem onClick={() => navigate('/profile')}>
        <FaUser />
        Edit Profile
      </MenuItem>
      <MenuItem onClick={() => navigate('/language')}>
        <FaGlobe />
        Change Language
      </MenuItem>
      <MenuItem onClick={toggleTheme}>
        {theme === 'dark' ? <FaSun /> : <FaMoon />}
        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
      </MenuItem>
      <MenuItem onClick={() => navigate('/notifications')}>
        <FaBell />
        Notification Preferences
      </MenuItem>
      <MenuItem onClick={() => navigate('/security')}>
        <FaLock />
        Security
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout}>
        <FaSignOutAlt />
        Logout
      </MenuItem>
    </MenuContainer>
  );
};

export default SettingsMenu; 