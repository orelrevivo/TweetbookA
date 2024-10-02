import {
  doc,
  query,
  where,
  limit,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  increment,
  writeBatch,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  getCountFromServer
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from './app';
import {
  usersCollection,
  tweetsCollection,
  userStatsCollection,
  userBookmarksCollection
} from './collections';
import type { WithFieldValue, Query } from 'firebase/firestore';
import type { EditableUserData } from '@lib/types/user';
import type { FilesWithId, ImagesPreview } from '@lib/types/file';
import type { Bookmark } from '@lib/types/bookmark';
import type { Theme, Accent } from '@lib/types/theme';
import { collection,} from 'firebase/firestore';
import Groups from 'pages/Groups';
import { addNotification } from '@lib/firebase/notifications';

export const getUsers = async () => {
  try {
    const usersCollection = collection(db, 'users'); // Reference to the 'users' collection
    const userSnapshot = await getDocs(usersCollection); // Fetch documents
    const usersList = userSnapshot.docs.map((doc) => ({
      id: doc.id, // Document ID
      ...doc.data(), // User data
    }));

    return usersList; // Return the list of users
  } catch (error) {
    console.error('Error fetching users: ', error);
    return []; // Return an empty array in case of error
  }
};

// Check if a username is available
export async function checkUsernameAvailability(username: string): Promise<boolean> {
  const { empty } = await getDocs(
    query(usersCollection, where('username', '==', username), limit(1))
  );
  return empty;
}

// Manage blocking/unblocking a user
export async function manageBlock(
  type: 'block' | 'unblock',
  userId: string,
  targetUserId: string
): Promise<void> {
  const batch = writeBatch(db);
  const userDocRef = doc(usersCollection, userId);
  const targetUserDocRef = doc(usersCollection, targetUserId);

  if (type === 'block') {
    batch.update(userDocRef, {
      blockedUsers: arrayUnion(targetUserId),
      updatedAt: serverTimestamp(),
    });
    batch.update(targetUserDocRef, {
      blockedBy: arrayUnion(userId),
      updatedAt: serverTimestamp(),
    });
  } else {
    batch.update(userDocRef, {
      blockedUsers: arrayRemove(targetUserId),
      updatedAt: serverTimestamp(),
    });
    batch.update(targetUserDocRef, {
      blockedBy: arrayRemove(userId),
      updatedAt: serverTimestamp(),
    });
  }

  await batch.commit();
}

// Get count of documents in a collection
export async function getCollectionCount<T>(
  collection: Query<T>
): Promise<number> {
  const snapshot = await getCountFromServer(collection);
  return snapshot.data().count;
}

// Update user data
export async function updateUserData(
  userId: string,
  userData: EditableUserData
): Promise<void> {
  const userRef = doc(usersCollection, userId);
  await updateDoc(userRef, {
    ...userData,
    updatedAt: serverTimestamp()
  });
}

// Update user theme
export async function updateUserTheme(
  userId: string,
  themeData: { theme?: Theme; accent?: Accent }
): Promise<void> {
  const userRef = doc(usersCollection, userId);
  await updateDoc(userRef, { ...themeData, updatedAt: serverTimestamp() });
}

// Update username
export async function updateUsername(
  userId: string,
  username?: string
): Promise<void> {
  const userRef = doc(usersCollection, userId);
  await updateDoc(userRef, {
    ...(username && { username }),
    updatedAt: serverTimestamp()
  });
}

// Manage pinned tweet
export async function managePinnedTweet(
  type: 'pin' | 'unpin',
  userId: string,
  tweetId: string
): Promise<void> {
  const userRef = doc(usersCollection, userId);
  await updateDoc(userRef, {
    updatedAt: serverTimestamp(),
    pinnedTweet: type === 'pin' ? tweetId : null
  });
}

// Manage following/unfollowing a user
export async function manageFollow(
  type: 'follow' | 'unfollow',
  userId: string,
  targetUserId: string
): Promise<void> {
  const batch = writeBatch(db);
  const userDocRef = doc(db, 'users', userId);
  const targetUserDocRef = doc(db, 'users', targetUserId);

  if (type === 'follow') {
    batch.update(userDocRef, {
      following: arrayUnion(targetUserId),
      updatedAt: serverTimestamp(),
    });
    batch.update(targetUserDocRef, {
      followers: arrayUnion(userId),
      updatedAt: serverTimestamp(),
    });

    // Add a notification for the followed user
    await addNotification(targetUserId, `${userId} has followed you.`);
  } else {
    batch.update(userDocRef, {
      following: arrayRemove(targetUserId),
      updatedAt: serverTimestamp(),
    });
    batch.update(targetUserDocRef, {
      followers: arrayRemove(userId),
      updatedAt: serverTimestamp(),
    });

    // Optionally, add a notification for unfollowing
    await addNotification(targetUserId, `${userId} has unfollowed you.`);
  }

  await batch.commit();
}

// Manage joining/unjoining a user or group
export async function manageJoin(
  type: 'join' | 'unjoin',
  userId: string,
  targetUserId: string
): Promise<void> {
  const batch = writeBatch(db);
  const userDocRef = doc(db, 'users', userId);
  const targetUserDocRef = doc(db, 'users', targetUserId);

  if (type === 'join') {
    batch.update(userDocRef, {
      joined: arrayUnion(targetUserId),
      updatedAt: serverTimestamp(),
    });
    batch.update(targetUserDocRef, {
      members: arrayUnion(userId),
      updatedAt: serverTimestamp(),
    });

    // Add a notification for the joined user/group
    await addNotification(targetUserId, `${userId} has joined you.`);
  } else {
    batch.update(userDocRef, {
      joined: arrayRemove(targetUserId),
      updatedAt: serverTimestamp(),
    });
    batch.update(targetUserDocRef, {
      members: arrayRemove(userId),
      updatedAt: serverTimestamp(),
    });

    // Optionally, add a notification for unjoining
    await addNotification(targetUserId, `${userId} has left you.`);
  }

  await batch.commit();
}

// Remove a tweet
export async function removeTweet(tweetId: string): Promise<void> {
  const tweetRef = doc(tweetsCollection, tweetId);
  await deleteDoc(tweetRef);
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

// Manage retweets
export function manageRetweet(
  type: 'retweet' | 'unretweet',
  userId: string,
  tweetId: string
) {
  return async (): Promise<void> => {
    const batch = writeBatch(db);
    const tweetRef = doc(tweetsCollection, tweetId);
    const userStatsRef = doc(userStatsCollection(userId), 'stats');

    if (type === 'retweet') {
      batch.update(tweetRef, {
        userRetweets: arrayUnion(userId),
        updatedAt: serverTimestamp()
      });
      batch.update(userStatsRef, {
        tweets: arrayUnion(tweetId),
        updatedAt: serverTimestamp()
      });
    } else {
      batch.update(tweetRef, {
        userRetweets: arrayRemove(userId),
        updatedAt: serverTimestamp()
      });
      batch.update(userStatsRef, {
        tweets: arrayRemove(tweetId),
        updatedAt: serverTimestamp()
      });
    }

    await batch.commit();
  };
}

// Manage likes
export function manageLike(
  type: 'like' | 'unlike',
  userId: string,
  tweetId: string
) {
  return async (): Promise<void> => {
    const batch = writeBatch(db);
    const userStatsRef = doc(userStatsCollection(userId), 'stats');
    const tweetRef = doc(tweetsCollection, tweetId);

    if (type === 'like') {
      batch.update(tweetRef, {
        userLikes: arrayUnion(userId),
        updatedAt: serverTimestamp()
      });
      batch.update(userStatsRef, {
        likes: arrayUnion(tweetId),
        updatedAt: serverTimestamp()
      });
    } else {
      batch.update(tweetRef, {
        userLikes: arrayRemove(userId),
        updatedAt: serverTimestamp()
      });
      batch.update(userStatsRef, {
        likes: arrayRemove(tweetId),
        updatedAt: serverTimestamp()
      });
    }

    await batch.commit();
  };
}

// Manage bookmarks
export async function manageBookmark(
  type: 'bookmark' | 'unbookmark',
  userId: string,
  tweetId: string
): Promise<void> {
  const bookmarkRef = doc(userBookmarksCollection(userId), tweetId);

  if (type === 'bookmark') {
    const bookmarkData: WithFieldValue<Bookmark> = {
      id: tweetId,
      createdAt: serverTimestamp()
    };
    await setDoc(bookmarkRef, bookmarkData);
  } else {
    await deleteDoc(bookmarkRef);
  }
}

// Clear all bookmarks
export async function clearAllBookmarks(userId: string): Promise<void> {
  const bookmarksRef = userBookmarksCollection(userId);
  const snapshot = await getDocs(bookmarksRef);
  const batch = writeBatch(db);

  snapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();
}
// Create or update a list
export async function createOrUpdateList(userId: string, listId: string, listName: string) {
  const listRef = doc(db, 'lists', listId);
  await setDoc(listRef, {
    userId,
    name: listName,
    createdAt: new Date(),
  });
}

// Get lists by user
export async function getListsByUser(userId: string) {
  const q = query(collection(db, 'lists'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  const lists: any[] = [];
  querySnapshot.forEach((doc) => {
    lists.push({ id: doc.id, ...doc.data() });
  });
  return lists;
}
// Handle survey data submission
export async function handleSurveyData(
  userId: string,
  surveyResponses: Record<string, string>
): Promise<void> {
  const surveyRef = doc(db, 'surveys', userId);
  await setDoc(surveyRef, {
    ...surveyResponses,
    submittedAt: serverTimestamp()
  });
}
// Manage close friends
export async function manageCloseFriends(
  type: 'add' | 'remove',
  userId: string,
  targetUserId: string
): Promise<void> {
  const userDocRef = doc(usersCollection, userId);
  if (type === 'add') {
    await updateDoc(userDocRef, {
      closeFriends: arrayUnion(targetUserId),
      updatedAt: serverTimestamp(),
    });
  } else {
    await updateDoc(userDocRef, {
      closeFriends: arrayRemove(targetUserId),
      updatedAt: serverTimestamp(),
    });
  }
}

// Manage favorites
export async function manageFavorite(
  type: 'add' | 'remove',
  userId: string,
  targetUserId: string
): Promise<void> {
  const userDocRef = doc(usersCollection, userId);
  if (type === 'add') {
    await updateDoc(userDocRef, {
      favorites: arrayUnion(targetUserId),
      updatedAt: serverTimestamp(),
    });
  } else {
    await updateDoc(userDocRef, {
      favorites: arrayRemove(targetUserId),
      updatedAt: serverTimestamp(),
    });
  }
}

// Manage restrict mode
export async function manageRestrict(
  type: 'restrict' | 'unrestrict',
  userId: string,
  targetUserId: string
): Promise<void> {
  const userDocRef = doc(usersCollection, userId);
  if (type === 'restrict') {
    await updateDoc(userDocRef, {
      restrictedUsers: arrayUnion(targetUserId),
      updatedAt: serverTimestamp(),
    });
  } else {
    await updateDoc(userDocRef, {
      restrictedUsers: arrayRemove(targetUserId),
      updatedAt: serverTimestamp(),
    });
  }
}
export async function manageMute(
  type: 'mute' | 'unmute',
  userId: string,
  targetUserId: string
): Promise<void> {
  const userDocRef = doc(usersCollection, userId);
  
  if (type === 'mute') {
    await updateDoc(userDocRef, {
      mutedUsers: arrayUnion(targetUserId),
      updatedAt: serverTimestamp(),
    });
  } else {
    await updateDoc(userDocRef, {
      mutedUsers: arrayRemove(targetUserId),
      updatedAt: serverTimestamp(),
    });
  }
}
// Manage views for a tweet
export async function manageView(tweetId: string, userId: string): Promise<void> {
  const tweetDocRef = doc(tweetsCollection, tweetId);

  await updateDoc(tweetDocRef, {
    views: arrayUnion(userId), // Store userId to ensure unique views
    updatedAt: serverTimestamp()
  });
}
export const createOrUpdateGroup = async (userId: string, groupName: string) => {
  if (!userId || !groupName) {
    throw new Error('Invalid parameters: userId and groupName are required.');
  }

  const groupId = generateGroupId(); // Generate a unique group ID

  const groupRef = doc(db, 'groups', groupId);
  await setDoc(groupRef, {
    userId: userId,
    name: groupName,
    createdAt: new Date(),
  });

  return groupId;
};

// Example function to generate a unique group ID
const generateGroupId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Fetch groups from the 'groups' collection
export const getGroups = async () => {
  const groupsRef = collection(db, 'groups');
  const groupsSnapshot = await getDocs(groupsRef);
  const groupsList = groupsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return groupsList;
};
// Fetch group messages
export const getGroupMessages = async (groupId: string) => {
  const messagesRef = collection(db, 'groups', groupId, 'messages');
  const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc')); // Order messages by timestamp
  const messagesSnapshot = await getDocs(messagesQuery);
  const messagesList = messagesSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
  return messagesList;
};

// Send a message to a group
export const sendMessage = async (groupId: string, userId: string, message: string, userName: string) => {
  const messagesRef = collection(db, 'groups', groupId, 'messages');
  await addDoc(messagesRef, {
    userId,
    userName, // Include user's name
    text: message,
    timestamp: new Date(),
  });
};

// Delete a group by its ID
export const deleteGroup = async (groupId: string) => {
  const groupRef = doc(db, 'groups', groupId);
  await deleteDoc(groupRef);
};
// Function to get member count for a group
export async function getGroupMembersCount(groupId: string) {
  const groupRef = doc(db, 'groups', groupId);
  const groupDoc = await getDoc(groupRef);
  const groupData = groupDoc.data();
  return groupData?.members?.length || 0;
}

// Function for a user to join a group
export async function joinGroup(userId: string, groupId: string) {
  const groupRef = doc(db, 'groups', groupId);
  await updateDoc(groupRef, {
    members: arrayUnion(userId),
  });
}

// Function for a user to leave a group
export async function leaveGroup(userId: string, groupId: string) {
  const groupRef = doc(db, 'groups', groupId);
  await updateDoc(groupRef, {
    members: arrayRemove(userId),
  });
}

export async function uploadImage(userId: string, file: File): Promise<{ id: string, src: string }[]> {
  const imageRef = ref(storage, `group-images/${userId}/${file.name}`);
  const uploadTask = uploadBytesResumable(imageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on('state_changed', 
      () => {},
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve([{ id: file.name, src: url }]);
      }
    );
  });
}


// Function to add a member to a group
export async function addMemberToGroup(groupId: string, userId: string) {
  const groupRef = doc(db, 'groups', groupId);
  await updateDoc(groupRef, {
    members: arrayUnion(userId),
  });
}

// Function to remove a member from a group
export async function removeMemberFromGroup(groupId: string, userId: string) {
  const groupRef = doc(db, 'groups', groupId);
  await updateDoc(groupRef, {
    members: arrayRemove(userId),
  });
}


