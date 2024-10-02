// src/lib/firebase/user.ts (or appropriate path)
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './app'; // Ensure this imports your Firestore instance

export async function updateUserVisibility(userId: string, visibility: 'public' | 'private') {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, { visibility });
}
