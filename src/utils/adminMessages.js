import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Send an admin message to one or more users
 * @param {Object} message - The message object
 * @param {string} message.title - The message title
 * @param {string} message.content - The message content
 * @param {string|string[]} message.for - User ID(s) to send the message to, or 'all' for all users
 * @returns {Promise<string>} The ID of the created message
 */
export const sendAdminMessage = async ({ title, content, for: recipients }) => {
  try {
    // Validate inputs
    if (!title || !content) {
      throw new Error('Title and content are required');
    }

    if (!recipients) {
      throw new Error('Recipients are required');
    }

    // Convert single recipient to array
    const recipientArray = Array.isArray(recipients) ? recipients : [recipients];

    // Create message document
    const messageData = {
      title,
      content,
      for: recipientArray,
      timestamp: serverTimestamp(),
      read: false,
      type: 'admin'
    };

    // Add message to Firestore
    const docRef = await addDoc(collection(db, 'messages'), messageData);
    return docRef.id;
  } catch (error) {
    console.error('Error sending admin message:', error);
    throw error;
  }
};

/**
 * Send a message to all users
 * @param {string} title - The message title
 * @param {string} content - The message content
 * @returns {Promise<string>} The ID of the created message
 */
export const sendGlobalMessage = async (title, content) => {
  return sendAdminMessage({
    title,
    content,
    for: 'all'
  });
};

/**
 * Send a message to specific users
 * @param {string} title - The message title
 * @param {string} content - The message content
 * @param {string[]} userIds - Array of user IDs to send the message to
 * @returns {Promise<string>} The ID of the created message
 */
export const sendTargetedMessage = async (title, content, userIds) => {
  return sendAdminMessage({
    title,
    content,
    for: userIds
  });
}; 