import {
    doc,
    setDoc,
    getDoc,
    deleteDoc,
    serverTimestamp,
  } from 'firebase/firestore';
  import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
  import { db, storage } from './app'; // Make sure these imports are correct
  
  // Function to upload story to Firebase
  export const uploadStory = async (userId: string, image: File, duration: number, profilePicUrl: string) => {
    try {
      const storyRef = ref(storage, `stories/${userId}/${image.name}`);
      const uploadTask = await uploadBytesResumable(storyRef, image);
      const imageUrl = await getDownloadURL(uploadTask.ref);
  
      // Save the story metadata to Firestore
      await setDoc(doc(db, 'stories', userId), {
        imageUrl,
        profilePicUrl, // Save profile picture URL
        createdAt: serverTimestamp(),
        duration, // Story duration in days
      });
  
      console.log('Story uploaded successfully');
    } catch (error) {
      console.error('Error uploading story:', error);
    }
  };
  
  // Function to delete story after a set duration
  export const deleteStoryAfterTime = async (userId: string, duration: number) => {
    const timeInMilliseconds = duration * 24 * 60 * 60 * 1000; // Convert days to milliseconds
  
    setTimeout(async () => {
      try {
        const storyDocRef = doc(db, 'stories', userId);
        const storyDoc = await getDoc(storyDocRef);
  
        if (storyDoc.exists()) {
          const { imageUrl } = storyDoc.data();
  
          // Delete the story image from Firebase Storage
          const imageRef = ref(storage, imageUrl);
          await deleteObject(imageRef);
  
          // Delete the story document from Firestore
          await deleteDoc(storyDocRef);
  
          console.log(`Story deleted after ${duration} day(s)`);
        }
      } catch (error) {
        console.error('Error deleting story:', error);
      }
    }, timeInMilliseconds);
  };
  