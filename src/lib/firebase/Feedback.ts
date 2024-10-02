import {
    doc,
    setDoc,
    collection,
    getDocs,
    query,
    where,
    serverTimestamp
  } from 'firebase/firestore';
  import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
  import { db, storage } from './app'; // Import Firebase configuration
  import { getAuth } from 'firebase/auth'; // Import Firebase Auth
  
  /**
   * Upload feedback data to Firebase Firestore and Storage.
   */
  export async function uploadFeedback(
    summary: string,
    email: string,
    details: string,
    files: File[]
  ): Promise<void> {
    try {
      const auth = getAuth(); // Get the Firebase Auth instance
      const user = auth.currentUser; // Get the currently logged-in user
  
      if (!user) {
        throw new Error('User not authenticated');
      }
  
      const userId = user.uid; // Get the user's ID
      const feedbackRef = doc(collection(db, 'feedback')); // Create a new document
      const fileUrls: string[] = [];
  
      // Upload each file to Firebase Storage and get the download URL
      for (const file of files) {
        const storageRef = ref(storage, `feedback_files/${userId}/${file.name}`); // Save files in a folder specific to the user
        const uploadTaskSnapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(uploadTaskSnapshot.ref);
        fileUrls.push(downloadURL);
      }
  
      // Save feedback to Firestore with the userId
      await setDoc(feedbackRef, {
        userId, // Store the user's ID
        summary,
        email,
        details,
        files: fileUrls,
        createdAt: serverTimestamp(),
      });
  
      console.log('Feedback successfully uploaded!');
    } catch (error) {
      console.error('Error uploading feedback:', error);
      throw new Error('Failed to upload feedback.');
    }
  }
  
  /**
   * Fetch feedbacks for the currently logged-in user from Firestore
   */
  export async function fetchFeedbacks(): Promise<FeedbackData[]> {
    try {
      const auth = getAuth(); // Get the Firebase Auth instance
      const user = auth.currentUser; // Get the currently logged-in user
  
      if (!user) {
        throw new Error('User not authenticated');
      }
  
      const userId = user.uid; // Get the user's ID
  
      // Query Firestore to fetch feedbacks for the currently logged-in user
      const feedbackQuery = query(collection(db, 'feedback'), where('userId', '==', userId));
      const feedbackSnapshot = await getDocs(feedbackQuery);
      const feedbacks: FeedbackData[] = [];
  
      feedbackSnapshot.forEach((doc) => {
        feedbacks.push({
          id: doc.id,
          summary: doc.data().summary,
          email: doc.data().email,
          details: doc.data().details,
          createdAt: doc.data().createdAt.toDate(),
          files: doc.data().files,
        });
      });
  
      return feedbacks;
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      throw new Error('Failed to fetch feedbacks.');
    }
  }
  