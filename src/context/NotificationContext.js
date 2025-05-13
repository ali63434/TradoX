import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot, doc, updateDoc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notificationSound] = useState(new Audio('/notification.mp3'));

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notificationsRef = collection(db, 'notifications');
        const q = query(
          notificationsRef,
          orderBy('timestamp', 'desc'),
          limit(50)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const newNotifications = [];
          let unread = 0;

          snapshot.forEach((doc) => {
            const notification = {
              id: doc.id,
              ...doc.data()
            };
            newNotifications.push(notification);
            if (!notification.read) unread++;
          });

          setNotifications(newNotifications);
          setUnreadCount(unread);
          setLoading(false);

          // Play sound for new notifications if user is active on the tab
          if (document.hasFocus() && unread > 0) {
            notificationSound.play().catch(error => {
              console.log('Error playing notification sound:', error);
            });
          }
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [notificationSound, unreadCount]);

  const markAsRead = async (notificationId) => {
    if (!currentUser) return;

    try {
      const notificationRef = doc(db, 'users', currentUser.uid, 'notifications', notificationId);
      await updateDoc(notificationRef, { read: true });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!currentUser) return;

    try {
      const batch = db.batch();
      notifications.forEach(notification => {
        if (!notification.read) {
          const notificationRef = doc(db, 'users', currentUser.uid, 'notifications', notification.id);
          batch.update(notificationRef, { read: true });
        }
      });
      await batch.commit();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}; 