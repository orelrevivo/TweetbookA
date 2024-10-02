import {
    doc,
    collection,
    setDoc,
    getDocs,
    query,
    orderBy,
    serverTimestamp,
    getDoc,
    deleteDoc,
    updateDoc
  } from 'firebase/firestore';
  import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
  import { db, storage } from './app';
  
  // Function to create a new advertisement post
  export async function createAdPost(postData: any, file: File | null): Promise<void> {
    const adPostRef = doc(collection(db, 'ads'));
    const newAdPost = {
      ...postData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      id: adPostRef.id,
      expiry: null // Default expiry to null
    };
  
    if (file) {
      const storageRef = ref(storage, `ads/${adPostRef.id}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      uploadTask.on(
        'state_changed',
        () => {},
        (error) => {
          console.error('File upload error:', error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          newAdPost.imageUrl = downloadURL;
          await setDoc(adPostRef, newAdPost);
        }
      );
    } else {
      await setDoc(adPostRef, newAdPost);
    }
  }
  
  // Function to get a specific advertisement post by ID
  export async function getAdPost(postId: string): Promise<any> {
    const postDoc = await getDoc(doc(db, 'ads', postId));
    if (postDoc.exists()) {
      return postDoc.data();
    } else {
      throw new Error('Post not found');
    }
  }
  
  // Function to fetch all advertisement posts
  export async function fetchAdPosts(): Promise<any[]> {
    const adsQuery = query(collection(db, 'ads'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(adsQuery);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
  
  // Function to delete an advertisement post
  export const deleteAdPost = async (postId: string): Promise<void> => {
    try {
      const postRef = doc(db, 'ads', postId);
      await deleteDoc(postRef);
      console.log(`Ad post with ID ${postId} deleted`);
    } catch (error) {
      console.error('Error deleting ad post:', error);
    }
  };
  
  // Function to update an advertisement post's expiry time
  export const updateAdPostExpiry = async (postId: string, expiryTime: number): Promise<void> => {
    try {
      const postRef = doc(db, 'ads', postId);
      await updateDoc(postRef, { expiry: expiryTime });
      console.log(`Ad post with ID ${postId} updated with expiry time ${expiryTime}`);
    } catch (error) {
      console.error('Error updating ad post expiry:', error);
    }
  };
  
// Function to like or unlike an advertisement post
export const likeAdPost = async (postId: string, userId: string): Promise<void> => {
  try {
    const postRef = doc(db, 'ads', postId);
    const postDoc = await getDoc(postRef);

    if (postDoc.exists()) {
      const postData = postDoc.data();
      const currentLikes = postData.likes || 0;
      const likedBy = postData.likedBy || [];

      if (likedBy.includes(userId)) {
        // User has already liked the post, so remove their like
        await updateDoc(postRef, {
          likes: currentLikes - 1,
          likedBy: likedBy.filter(id => id !== userId),
        });
      } else {
        // User has not liked the post, so add their like
        await updateDoc(postRef, {
          likes: currentLikes + 1,
          likedBy: [...likedBy, userId],
        });
      }
      console.log(`Ad post with ID ${postId} updated.`);
    } else {
      throw new Error('Post not found');
    }
  } catch (error) {
    console.error('Error updating ad post like status:', error);
  }
};

// Function to block an advertisement post
export const blockAdPost = async (userId: string, postId: string): Promise<void> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const blockedAds = userDoc.data().blockedAds || [];
      if (!blockedAds.includes(postId)) {
        blockedAds.push(postId);
        await updateDoc(userDocRef, { blockedAds });
        console.log(`Ad post with ID ${postId} blocked for user ${userId}.`);
      } else {
        console.log(`Ad post with ID ${postId} is already blocked for user ${userId}.`);
      }
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    console.error('Error blocking ad post:', error);
  }
};

// Function to unblock an advertisement post
export const unblockAdPost = async (userId: string, postId: string): Promise<void> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const blockedAds = userDoc.data().blockedAds || [];
      const updatedBlockedAds = blockedAds.filter((id: string) => id !== postId);
      await updateDoc(userDocRef, { blockedAds: updatedBlockedAds });
      console.log(`Ad post with ID ${postId} unblocked for user ${userId}.`);
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    console.error('Error unblocking ad post:', error);
  }
};

// Function to report an advertisement post
export const reportAdPost = async (postId: string, reportReason: string): Promise<void> => {
  try {
    const reportRef = doc(collection(db, 'adReports'));
    const newReport = {
      postId,
      reportReason,
      reportedAt: serverTimestamp(),
    };
    await setDoc(reportRef, newReport);
    console.log(`Ad post with ID ${postId} reported for reason: ${reportReason}.`);
  } catch (error) {
    console.error('Error reporting ad post:', error);
  }
};