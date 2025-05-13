import React from 'react';
import styled from 'styled-components';
import { FaTimes } from 'react-icons/fa';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: rgba(26, 26, 29, 0.95);
  border-radius: 12px;
  padding: 1.5rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #b0b8c1;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.2s;
  
  &:hover {
    color: white;
  }
`;

const MessageTitle = styled.h2`
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  padding-right: 2rem;
`;

const MessageContent = styled.div`
  color: #b0b8c1;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  white-space: pre-wrap;
`;

const MessageMeta = styled.div`
  color: #b0b8c1;
  font-size: 0.875rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MessageModal = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>
        <MessageTitle>{message.title}</MessageTitle>
        <MessageContent>{message.content}</MessageContent>
        <MessageMeta>
          <span>From: Admin</span>
          <span>{message.timestamp?.toDate().toLocaleString()}</span>
        </MessageMeta>
      </ModalContent>
    </ModalOverlay>
  );
};

export default MessageModal; 