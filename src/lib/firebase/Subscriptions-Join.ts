import { collection, getDocs, getDoc , doc , updateDoc , arrayUnion , arrayRemove ,query, where, orderBy } from 'firebase/firestore';
import { db } from './app'; // Adjust the path if necessary

export async function fetchUsers(queryText: string) {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('username', '>=', queryText), where('username', '<=', queryText + '\uf8ff'), orderBy('username'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id }));
}

  // Fetch users that a user has joined
  export async function fetchJoinedUsers(userId: string) {
    const userDoc = doc(db, 'users', userId);
    const userSnapshot = await getDoc(userDoc);
  
    if (userSnapshot.exists()) {
      const data = userSnapshot.data();
      return data.joinedUsers || [];
    } else {
      return [];
    }
  }
  
  // Add a user to the joined list
  export async function joinUser(userId: string, targetUserId: string) {
    const userDoc = doc(db, 'users', userId);
    await updateDoc(userDoc, {
      joinedUsers: arrayUnion(targetUserId)
    });
  }
  
  // Remove a user from the joined list
  export async function leaveUser(userId: string, targetUserId: string) {
    const userDoc = doc(db, 'users', userId);
    await updateDoc(userDoc, {
      joinedUsers: arrayRemove(targetUserId)
    });
  }
  