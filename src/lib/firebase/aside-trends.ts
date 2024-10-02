import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './app'; // Firebase configuration

// Function to create a new hashtag
export async function createHashtag(hashtag: string) {
  try {
    // Check if the hashtag already exists
    const hashtagsQuery = query(collection(db, 'hashtags'), where('name', '==', hashtag));
    const querySnapshot = await getDocs(hashtagsQuery);
    if (!querySnapshot.empty) {
      throw new Error('Hashtag already exists.');
    }

    // Create the hashtag if it does not exist
    const hashtagRef = doc(collection(db, 'hashtags'));
    await setDoc(hashtagRef, {
      name: hashtag,
      timestamp: serverTimestamp(),
    });
    console.log('Hashtag created:', hashtag);
  } catch (error) {
    console.error('Error creating hashtag:', error);
    throw error; // Rethrow the error to be caught by the frontend
  }
}

// Function to get all hashtags
export async function getHashtags() {
  try {
    const hashtagsQuery = query(collection(db, 'hashtags'));
    const querySnapshot = await getDocs(hashtagsQuery);
    const hashtags: string[] = [];
    querySnapshot.forEach((doc) => {
      hashtags.push(doc.data().name);
    });
    return hashtags;
  } catch (error) {
    console.error('Error fetching hashtags:', error);
    return [];
  }
}

// Function to delete a hashtag
export async function deleteHashtag(hashtag: string) {
  try {
    const hashtagsQuery = query(collection(db, 'hashtags'), where('name', '==', hashtag));
    const querySnapshot = await getDocs(hashtagsQuery);
    if (!querySnapshot.empty) {
      const docId = querySnapshot.docs[0].id; // Get the document ID of the hashtag
      await deleteDoc(doc(db, 'hashtags', docId)); // Delete the document
      console.log('Hashtag deleted:', hashtag);
    } else {
      throw new Error('Hashtag not found.');
    }
  } catch (error) {
    console.error('Error deleting hashtag:', error);
    throw error; // Rethrow the error to be caught by the frontend
  }
}
