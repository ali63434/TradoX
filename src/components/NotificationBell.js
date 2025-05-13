import React, { useState, useRef, useEffect } from 'react';
import { FiBell } from 'react-icons/fi';
import { useNotifications } from '../context/NotificationContext';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import AdminMessages from './AdminMessages';
import MessageModal from './MessageModal';

const NotificationButton = styled.button`
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(26, 26, 29, 0.95);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 0.75rem;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #26d0ce;
  }
`;

const NotificationBadge = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(26, 26, 29, 0.95);
`;

const NotificationDropdown = styled(motion.div)`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  width: 320px;
  background: rgba(26, 26, 29, 0.95);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  z-index: 1000;
  
  @media (max-width: 640px) {
    width: calc(100vw - 2rem);
    right: -0.5rem;
  }
`;

const NotificationHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NotificationTitle = styled.h3`
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
`;

const MarkAllRead = styled.button`
  color: #26d0ce;
  font-size: 0.875rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(38, 208, 206, 0.1);
  }
`;

const NotificationList = styled.div`
  max-height: 400px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255,255,255,0.1);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.2);
    border-radius: 3px;
  }
`;

const NotificationItem = styled(motion.div)`
  padding: 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255,255,255,0.05);
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const NotificationMessage = styled.div`
  color: #ffffff;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  opacity: ${props => props.read ? 0.7 : 1};
`;

const NotificationTime = styled.div`
  color: #b0b8c1;
  font-size: 0.75rem;
`;

const EmptyState = styled.div`
  padding: 2rem;
  text-align: center;
  color: #b0b8c1;
`;

const LoadingState = styled.div`
  padding: 2rem;
  text-align: center;
  color: #b0b8c1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const NotificationBell = () => {
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    // Handle notification click (e.g., navigate to relevant page)
  };

  const handleMessageClick = (message) => {
    setSelectedMessage(message);
  };

  const handleCloseModal = () => {
    setSelectedMessage(null);
  };

  return (
    <div ref={dropdownRef}>
      <NotificationButton onClick={() => setIsOpen(!isOpen)}>
        <FiBell size={20} />
        {unreadCount > 0 && <NotificationBadge>{unreadCount}</NotificationBadge>}
      </NotificationButton>

      <AnimatePresence>
        {isOpen && (
          <NotificationDropdown
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <NotificationHeader>
              <NotificationTitle>Notifications</NotificationTitle>
              {unreadCount > 0 && (
                <MarkAllRead onClick={markAllAsRead}>
                  Mark all as read
                </MarkAllRead>
              )}
            </NotificationHeader>

            <NotificationList>
              {isLoading ? (
                <LoadingState>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Loading...
                </LoadingState>
              ) : notifications.length > 0 ? (
                notifications.slice(0, 5).map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <NotificationMessage read={notification.read}>
                      {notification.message}
                    </NotificationMessage>
                    <NotificationTime>
                      {new Date(notification.timestamp?.toDate()).toLocaleString()}
                    </NotificationTime>
                  </NotificationItem>
                ))
              ) : (
                <EmptyState>No notifications</EmptyState>
              )}
            </NotificationList>
          </NotificationDropdown>
        )}
      </AnimatePresence>

      {selectedMessage && (
        <MessageModal 
          message={selectedMessage} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};

export default NotificationBell; 