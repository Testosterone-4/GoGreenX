// src/contexts/NotificationContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [ws, setWs] = useState(null);
  const { currentUser } = useAuth();

  // Fetch initial notifications
  useEffect(() => {
    if (currentUser) {
      fetchNotifications();
      setupWebSocket();
    }

    return () => {
      if (ws) ws.close();
    };
  }, [currentUser]);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications/');
      setNotifications(response.data);
      updateUnreadCount(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUnreadCount = (notifs) => {
    const count = notifs.filter(n => !n.is_read).length;
    setUnreadCount(count);
  };

  const setupWebSocket = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/ws/notifications/`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setNotifications(prev => [data, ...prev]);
      setUnreadCount(prev => prev + 1);
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    setWs(socket);
  };

  const markAsRead = async (id) => {
    try {
      await api.post(`/notifications/${id}/mark_as_read/`);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post('/notifications/mark_all_as_read/');
      setNotifications(prev =>
        prev.map(n => ({ ...n, is_read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        fetchNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);