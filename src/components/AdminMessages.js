import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaEnvelope, FaEnvelopeOpen, FaCheckDouble } from 'react-icons/fa';
import { collection, query, where, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

const MessagesContainer = styled.div`
  background: rgba(26, 26, 29, 0.95);
  border-radius: 12px;
  padding: 1rem;
  margin-top: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
`;

const MessagesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const MessagesTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ffffff;
  font-weight: 600;
`;

const MarkAllRead = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #26d0ce;
  background: none;
  border: none;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(38, 208, 206, 0.1);
  }
`;

const MessageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 300px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
`;

const MessageItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.unread ? 'rgba(38, 208, 206, 0.1)' : 'transparent'};

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const MessageIcon = styled.div`
  color: ${props => props.unread ? '#26d0ce' : '#b0b8c1'};
  font-size: 1.25rem;
  margin-top: 0.25rem;
`;

const MessageContent = styled.div`
  flex: 1;
`;

const MessageTitle = styled.div`
  color: #ffffff;
  font-weight: ${props => props.unread ? '600' : '400'};
  margin-bottom: 0.25rem;
`;

const MessageText = styled.div`
  color: #b0b8c1;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
`;

const MessageTime = styled.div`
  color: #b0b8c1;
  font-size: 0.75rem;
`;

const UnreadDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #26d0ce;
  margin-top: 0.5rem;
`;

const AdminMessages = ({ onMessageClick }) => {
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    // Query messages for the current user
    const q = query(
      collection(db, 'messages'),
      where('for', 'in', [currentUser.uid, 'all']),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(newMessages);
      setUnreadCount(newMessages.filter(msg => !msg.read).length);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const markAsRead = async (messageId) => {
    try {
      await updateDoc(doc(db, 'messages', messageId), {
        read: true
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadMessages = messages.filter(msg => !msg.read);
      await Promise.all(
        unreadMessages.map(msg =>
          updateDoc(doc(db, 'messages', msg.id), { read: true })
        )
      );
    } catch (error) {
      console.error('Error marking all messages as read:', error);
    }
  };

  const handleMessageClick = (message) => {
    if (!message.read) {
      markAsRead(message.id);
    }
    if (onMessageClick) {
      onMessageClick(message);
    }
  };

  return (
    <MessagesContainer>
      <MessagesHeader>
        <MessagesTitle>
          <FaEnvelope />
          Admin Messages
          {unreadCount > 0 && (
            <span style={{ 
              background: '#26d0ce', 
              color: '#ffffff',
              padding: '0.125rem 0.5rem',
              borderRadius: '12px',
              fontSize: '0.75rem',
              marginLeft: '0.5rem'
            }}>
              {unreadCount}
            </span>
          )}
        </MessagesTitle>
        {unreadCount > 0 && (
          <MarkAllRead onClick={markAllAsRead}>
            <FaCheckDouble />
            Mark all as read
          </MarkAllRead>
        )}
      </MessagesHeader>
      <MessageList>
        {messages.map(message => (
          <MessageItem 
            key={message.id} 
            unread={!message.read}
            onClick={() => handleMessageClick(message)}
          >
            <MessageIcon unread={!message.read}>
              {message.read ? <FaEnvelopeOpen /> : <FaEnvelope />}
            </MessageIcon>
            <MessageContent>
              <MessageTitle unread={!message.read}>
                {message.title}
              </MessageTitle>
              <MessageText>
                {message.content}
              </MessageText>
              <MessageTime>
                {message.timestamp?.toDate().toLocaleString()}
              </MessageTime>
            </MessageContent>
            {!message.read && <UnreadDot />}
          </MessageItem>
        ))}
        {messages.length === 0 && (
          <div style={{ 
            color: '#b0b8c1', 
            textAlign: 'center', 
            padding: '1rem' 
          }}>
            No messages yet
          </div>
        )}
      </MessageList>
    </MessagesContainer>
  );
};

export default AdminMessages; 