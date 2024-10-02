import { db, storage } from './app'; // Ensure this imports your Firebase config
import { doc, updateDoc, getDoc, collection, query, orderBy, getDocs, setDoc, arrayUnion, arrayRemove, serverTimestamp, writeBatch } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// Fetch group details, including visibility
export const getGroupDetails = async (groupId: string) => {
  const groupRef = doc(db, 'groups', groupId);
  const groupSnap = await getDoc(groupRef);
  return groupSnap.exists() ? groupSnap.data() : null;
};

// Fetch group messages
export const getGroupMessages = async (groupId: string) => {
  const messagesRef = collection(db, 'groups', groupId, 'posts');
  const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'));
  const messagesSnapshot = await getDocs(messagesQuery);
  const messagesList = messagesSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
  return messagesList;
};
// Upload image to storage
export const uploadImage = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      snapshot => {
        // Optionally implement progress updates
      },
      error => {
        console.error('Image upload failed:', error);
        reject('Image upload failed');
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
};

// Create a new post
export const createPost = async (groupId: string, text: string, imageUrls: string[]) => {
  const postsRef = collection(db, 'groups', groupId, 'posts');
  await setDoc(doc(postsRef), {
    text,
    images: imageUrls.length > 0 ? imageUrls : [], // Ensure this handles the image URLs correctly
    timestamp: serverTimestamp(),
    likes: 0,
    commentsList: [],
    userLikes: [],
  });
};

// Manage likes
export function manageLike(type: 'like' | 'unlike', userId: string, postId: string) {
  return async (): Promise<void> => {
    const batch = writeBatch(db);
    const postRef = doc(db, 'groups', postId, 'posts', postId);
    const userStatsRef = doc(userStatsCollection(userId), 'stats');

    if (type === 'like') {
      batch.update(postRef, {
        userLikes: arrayUnion(userId),
        updatedAt: serverTimestamp(),
      });
      batch.update(userStatsRef, {
        likes: arrayUnion(postId),
        updatedAt: serverTimestamp(),
      });
    } else {
      batch.update(postRef, {
        userLikes: arrayRemove(userId),
        updatedAt: serverTimestamp(),
      });
      batch.update(userStatsRef, {
        likes: arrayRemove(postId),
        updatedAt: serverTimestamp(),
      });
    }

    await batch.commit();
  };
}

// Add a comment to a post
export const addComment = async (groupId: string, postId: string, comment: string, username: string) => {
  if (!comment || !username) return;

  const postRef = doc(db, 'groups', groupId, 'posts', postId);
  const commentId = `${username}-${Date.now()}`;

  await updateDoc(postRef, {
    commentsList: arrayUnion({ text: comment, username, id: commentId }),
  });
};

// Update group visibility
export const updateGroupVisibility = async (groupId: string, isPublic: boolean) => {
  const groupRef = doc(db, 'groups', groupId);
  await updateDoc(groupRef, { isPublic });
};

// Update user's bio
export const updateBio = async (userId: string | undefined, bio: string) => {
  if (userId) {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { bio });
  }
};

// Function to follow or unfollow a user
export const manageFollow = async (userId: string, followUserId: string, isFollowing: boolean) => {
  const userRef = doc(db, 'users', userId);
  
  if (isFollowing) {
    // Unfollow
    await updateDoc(userRef, {
      following: arrayRemove(followUserId),
    });
  } else {
    // Follow
    await updateDoc(userRef, {
      following: arrayUnion(followUserId),
    });
  }
};

// Function to join a group
export const joinGroup = async (groupId: string, userId: string) => {
  try {
    const groupRef = doc(db, 'groups', groupId);
    await updateDoc(groupRef, {
      members: arrayUnion(userId),
      updatedAt: serverTimestamp(),
    });
    console.log('User successfully joined the group');
  } catch (error) {
    console.error('Error joining group: ', error);
  }
};

// Function to leave a group
export const leaveGroup = async (groupId: string, userId: string) => {
  try {
    const groupRef = doc(db, 'groups', groupId);
    await updateDoc(groupRef, {
      members: arrayRemove(userId),
      updatedAt: serverTimestamp(),
    });
    console.log('User successfully left the group');
  } catch (error) {
    console.error('Error leaving group: ', error);
  }
};

// Fetch community details, including creator information
export const getCommunityDetails = async (groupId: string) => {
  const groupRef = doc(db, 'groups', groupId);
  const groupSnap = await getDoc(groupRef);

  if (groupSnap.exists()) {
    return groupSnap.data();
  } else {
    throw new Error('Community not found');
  }
};