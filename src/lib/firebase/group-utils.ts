import { doc, updateDoc, increment, arrayUnion, arrayRemove } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from './app';
import { tweetsCollection, groupsCollection } from './collections';

// Utility to upload images to Firebase Storage
export const uploadImages = async (
  userId: string,
  images: Array<{ file: File; id: string }>
): Promise<string[] | null> => {
  if (!images.length) return null;

  const imageUrls = await Promise.all(
    images.map(async ({ file }) => {
      const storageRef = ref(storage, `groups/${userId}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise<string>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          () => {},
          (error) => reject(error),
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      });
    })
  );

  return imageUrls;
};

// Utility to manage the number of replies to a group post
export const manageReply = async (
  action: 'increment' | 'decrement',
  postId: string
): Promise<void> => {
  const postRef = doc(tweetsCollection, postId);
  await updateDoc(postRef, {
    userReplies: increment(action === 'increment' ? 1 : -1)
  });
};

// Utility to manage the total number of posts in a group
export const manageTotalTweets = async (
  action: 'increment' | 'decrement',
  groupId: string
): Promise<void> => {
  const groupRef = doc(groupsCollection, groupId);
  await updateDoc(groupRef, {
    totalPosts: increment(action === 'increment' ? 1 : -1)
  });
};

// Utility to manage the total number of photos in a group
export const manageTotalPhotos = async (
  action: 'increment' | 'decrement',
  groupId: string
): Promise<void> => {
  const groupRef = doc(groupsCollection, groupId);
  await updateDoc(groupRef, {
    totalPhotos: increment(action === 'increment' ? 1 : -1)
  });
};

// Utility to manage members in a group
export const manageGroupMembers = async (
  action: 'add' | 'remove',
  groupId: string,
  userId: string
): Promise<void> => {
  const groupRef = doc(groupsCollection, groupId);
  const updateData =
    action === 'add'
      ? { members: arrayUnion(userId) }
      : { members: arrayRemove(userId) };

  await updateDoc(groupRef, updateData);
};

// Add any additional existing functions here
