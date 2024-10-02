import { db } from './app'; // Make sure this is the correct path to your Firebase config
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';

// Function to send a new message to Firestore
export const sendMessage = async (userId: string, username: string, text: string) => {
  if (!userId || !username || !text) {
    throw new Error('Invalid message data');
  }

  try {
    await addDoc(collection(db, 'chatMessages'), {
      userId,
      username,
      text,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Function to subscribe to real-time messages from Firestore
export const subscribeToMessages = (callback: (messages: any[]) => void) => {
  const messagesQuery = query(collection(db, 'chatMessages'), orderBy('timestamp', 'asc'));

  return onSnapshot(messagesQuery, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(messages);
  });
};
// Function to create a new stream
export const createStream = async (userId: string) => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    const streamRef = await addDoc(collection(db, 'streams'), {
      userId,
      createdAt: serverTimestamp(),
      // Add any other necessary stream info here
    });
    return streamRef.id; // Return the stream ID or relevant information
  } catch (error) {
    console.error('Error creating stream:', error);
    throw error;
  }
};
