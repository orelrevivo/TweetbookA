import {
    doc,
    updateDoc,
    increment,
    serverTimestamp
  } from 'firebase/firestore';
  import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
  import { storage } from './app';
  import {
    usersCollection,
    tweetsCollection,
  } from './collections';
  import type { FilesWithId, ImagesPreview } from '@lib/types/file';
// Manage replies count
export async function manageReply(
    type: 'increment' | 'decrement',
    tweetId: string
  ): Promise<void> {
    const tweetRef = doc(tweetsCollection, tweetId);
  
    try {
      await updateDoc(tweetRef, {
        userReplies: increment(type === 'increment' ? 1 : -1),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Failed to update replies count:", error);
    }
  }
  
  
// Upload images to storage
export async function uploadImages(
    userId: string,
    files: FilesWithId
  ): Promise<ImagesPreview | null> {
    if (files.length === 0) return null;
  
    const imagesPreview = await Promise.all(
      files.map(async (file) => {
        const { id, name: alt, type } = file;
        const storageRef = ref(storage, `images/${userId}/${id}`);
        await uploadBytesResumable(storageRef, file);
        const src = await getDownloadURL(storageRef);
        return { id, src, alt, type };
      })
    );
  
    return imagesPreview;
  }
  // Manage total tweets count
export async function manageTotalTweets(
    type: 'increment' | 'decrement',
    userId: string
  ): Promise<void> {
    const userRef = doc(usersCollection, userId);
    await updateDoc(userRef, {
      totalTweets: increment(type === 'increment' ? 1 : -1),
      updatedAt: serverTimestamp()
    });
  }
  
// Manage total photos count
export async function manageTotalPhotos(
    type: 'increment' | 'decrement',
    userId: string
  ): Promise<void> {
    const userRef = doc(usersCollection, userId);
    await updateDoc(userRef, {
      totalPhotos: increment(type === 'increment' ? 1 : -1),
      updatedAt: serverTimestamp()
    });
  }
  