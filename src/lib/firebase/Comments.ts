import { db } from './app';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, where } from 'firebase/firestore';

// Add a response for a user's post
export async function addResponse(userId: string, postId: string, message: string): Promise<void> {
  try {
    const responsesRef = collection(db, `users/${userId}/responses`);
    await addDoc(responsesRef, {
      postId,
      message,
      timestamp: serverTimestamp(),
    });
    console.log(`Response added for user ${userId}: ${message}`);
  } catch (error) {
    console.error(`Error adding response for user ${userId}:`, error);
  }
}

// Get responses for a user
export async function getResponses(userId: string): Promise<any[]> {
  try {
    const responsesRef = collection(db, `users/${userId}/responses`);
    const responsesQuery = query(responsesRef, orderBy('timestamp', 'desc'));

    const querySnapshot = await getDocs(responsesQuery);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error(`Error fetching responses for user ${userId}:`, error);
    return [];
  }
}
