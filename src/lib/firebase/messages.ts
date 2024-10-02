import {
  doc,
  collection,
  setDoc,
  getDocs,
  query,
  where,
  updateDoc,
  serverTimestamp,
  arrayUnion,
  orderBy,
  addDoc
} from 'firebase/firestore';
import { db } from './app'; // Ensure `db` is initialized as Firestore instance

interface Group {
  groupId: string;
  userIds: string[];
  createdAt: any;
}

// Create a new group with a list of user IDs
export async function createGroup(userIds: string[]): Promise<void> {
  if (userIds.length < 2) {
    throw new Error('You must select at least two users to create a group.');
  }

  const newGroupRef = doc(collection(db, 'groups'));
  const groupId = newGroupRef.id;

  const newGroup: Group = {
    groupId,
    userIds,
    createdAt: serverTimestamp(),
  };

  await setDoc(newGroupRef, newGroup);
}

// Create a new chat or fetch an existing one
export async function createOrFetchChat(userId: string, targetUserId: string): Promise<string> {
  const chatQuery = query(
    collection(db, 'chats'),
    where('userIds', 'array-contains', userId)
  );

  const chatSnapshot = await getDocs(chatQuery);
  let chatId = '';

  chatSnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.userIds.includes(targetUserId)) {
      chatId = doc.id; // Chat exists
    }
  });

  if (!chatId) {
    // Create new chat
    const newChatRef = doc(collection(db, 'chats'));
    chatId = newChatRef.id;

    await setDoc(newChatRef, {
      chatId,
      userIds: [userId, targetUserId],
      messages: [],
      createdAt: serverTimestamp(),
    });
  }

  return chatId;
}

// Fetch all chats for a user
export async function fetchUserChats(userId: string) {
  const chatQuery = query(
    collection(db, 'chats'),
    where('userIds', 'array-contains', userId)
  );

  const chatSnapshot = await getDocs(chatQuery);
  const chats = chatSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return chats;
}

// Save a message to a chat
export async function saveMessageToChat(chatId: string, senderId: string, message: string) {
  const chatRef = doc(db, 'chats', chatId);

  await updateDoc(chatRef, {
    messages: arrayUnion({
      senderId,
      message,
      createdAt: serverTimestamp(),
    }),
  });
}

// Report a user
export async function reportUser(userId: string, reason: string) {
  const reportRef = doc(db, 'reports', userId);
  await setDoc(reportRef, {
    reason,
    reportedAt: serverTimestamp(),
  });
}

// Fetch messages for a user
export async function getUserMessages(userId: string) {
  const messagesRef = collection(db, 'users', userId, 'messages');
  const q = query(messagesRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data());
}

// Add a new message for a user
export async function addUserMessage(userId: string, message: string) {
  const messagesRef = collection(db, 'users', userId, 'messages');
  await addDoc(messagesRef, {
    message,
    createdAt: serverTimestamp(),
  });
}

// Add a user to a group
export async function addUserToGroup(groupId: string, userId: string) {
  const groupRef = doc(db, 'groups', groupId);
  await updateDoc(groupRef, {
    userIds: arrayUnion(userId),
  });
}

// Block a user
export async function blockUser(userId: string) {
  const userRef = doc(db, 'blockedUsers', userId);
  const userDoc = await getDocs(userRef);

  if (!userDoc.empty) {
    throw new Error('User is already blocked.');
  }

  await setDoc(userRef, {
    blockedAt: serverTimestamp(),
  });
}
