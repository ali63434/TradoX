import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FaComments, FaTimes, FaPaperPlane, FaRobot } from 'react-icons/fa';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

const ChatButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0033cc 0%, #26d0ce 100%);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 12px -1px rgba(0, 0, 0, 0.2), 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
`;

const ChatContainer = styled.div`
  position: fixed;
  bottom: 5rem;
  right: 2rem;
  width: 350px;
  height: 500px;
  background: rgba(26, 26, 29, 0.95);
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
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

const ChatHeader = styled.div`
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ChatTitle = styled.div`
  font-weight: 600;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CloseButton = styled.button`
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

const MessagesContainer = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
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

const Message = styled.div`
  max-width: 80%;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  background: ${props => props.isUser ? 'linear-gradient(135deg, #0033cc 0%, #26d0ce 100%)' : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    ${props => props.isUser ? 'right: -8px;' : 'left: -8px;'}
    width: 0;
    height: 0;
    border: 8px solid transparent;
    border-bottom-color: ${props => props.isUser ? '#26d0ce' : 'rgba(255, 255, 255, 0.1)'};
    border-top: 0;
  }
`;

const MessageTime = styled.div`
  font-size: 0.75rem;
  color: #b0b8c1;
  margin-top: 0.25rem;
  text-align: ${props => props.isUser ? 'right' : 'left'};
`;

const InputContainer = styled.div`
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  gap: 0.5rem;
`;

const MessageInput = styled.input`
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: white;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #26d0ce;
  }
  
  &::placeholder {
    color: #b0b8c1;
  }
`;

const SendButton = styled.button`
  background: linear-gradient(135deg, #0033cc 0%, #26d0ce 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const BotMessage = styled(Message)`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  
  svg {
    color: #26d0ce;
    font-size: 1.25rem;
  }
`;

const faqKeywords = [
  {
    keywords: ["join", "contest", "tournament"],
    reply: "To join a contest, go to the Trading page and select a tournament from the available options. You can participate in daily and weekly competitions with real prizes!"
  },
  {
    keywords: ["reset", "password", "forgot"],
    reply: "To reset your password, click on 'Forgot Password?' on the login screen. You'll receive an email with instructions to set a new password."
  },
  {
    keywords: ["rewards", "prizes", "win"],
    reply: "Top traders win USDT, points, and VIP access in every contest. The rewards are distributed based on your ranking and performance."
  },
  {
    keywords: ["help", "support", "contact"],
    reply: "Our support team is available 24/7. You can reach us through this chat or email us at support@tradox.com"
  },
  {
    keywords: ["trading", "trade", "how to"],
    reply: "To start trading, go to the Trading page, select your preferred trading pair, set your position size, and click Buy or Sell. Remember to use stop-loss orders to manage risk."
  }
];

const SupportChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { currentUser } = useAuth();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && currentUser) {
      const q = query(
        collection(db, `chats/${currentUser.uid}/messages`),
        orderBy('timestamp', 'asc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const newMessages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMessages(newMessages);
      });

      return () => unsubscribe();
    }
  }, [isOpen, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() || !currentUser) return;

    const userMessage = {
      text: message,
      isUser: true,
      timestamp: serverTimestamp()
    };

    try {
      await addDoc(collection(db, `chats/${currentUser.uid}/messages`), userMessage);
      setMessage('');

      // Check for FAQ matches
      const lowerMessage = message.toLowerCase();
      const matchedFaq = faqKeywords.find(faq =>
        faq.keywords.some(keyword => lowerMessage.includes(keyword))
      );

      if (matchedFaq) {
        setTimeout(async () => {
          await addDoc(collection(db, `chats/${currentUser.uid}/messages`), {
            text: matchedFaq.reply,
            isUser: false,
            timestamp: serverTimestamp()
          });
        }, 1000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <ChatButton onClick={() => setIsOpen(!isOpen)}>
        <FaComments />
      </ChatButton>

      {isOpen && (
        <ChatContainer>
          <ChatHeader>
            <ChatTitle>
              <FaComments />
              Support Chat
            </ChatTitle>
            <CloseButton onClick={() => setIsOpen(false)}>
              <FaTimes />
            </CloseButton>
          </ChatHeader>

          <MessagesContainer>
            {messages.map((msg, index) => (
              <div key={msg.id || index}>
                {msg.isUser ? (
                  <Message isUser>
                    {msg.text}
                    <MessageTime isUser>
                      {msg.timestamp?.toDate().toLocaleTimeString()}
                    </MessageTime>
                  </Message>
                ) : (
                  <BotMessage>
                    <FaRobot />
                    <div>
                      {msg.text}
                      <MessageTime>
                        {msg.timestamp?.toDate().toLocaleTimeString()}
                      </MessageTime>
                    </div>
                  </BotMessage>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </MessagesContainer>

          <InputContainer>
            <MessageInput
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
            />
            <SendButton onClick={handleSend} disabled={!message.trim()}>
              <FaPaperPlane />
            </SendButton>
          </InputContainer>
        </ChatContainer>
      )}
    </>
  );
};

export default SupportChat; 