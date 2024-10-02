import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirebaseConfig } from './firebase/config'; // Import the function from your config file

// Initialize Firebase with the configuration
const firebaseConfig = getFirebaseConfig();
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp); // Initialize Firebase Storage

// Type definition for a list
export interface List {
  id: string;
  name: string;
  userId: string;
  imageUrl?: string; // Add imageUrl if you plan to handle list images
  bio?: string; // Added bio field
}

// Function to create or update a list
export const createOrUpdateList = async (
  listId: string, 
  listName: string, 
  userId: string, 
  imageFile?: File,
  bio?: string // Added bio parameter
): Promise<void> => {
  try {
    const listRef = doc(db, 'lists', listId);
    
    let imageUrl: string | undefined;
    if (imageFile) {
      const storageRef = ref(storage, `list-images/${listId}`);
      await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(storageRef);
    }
    
    await setDoc(listRef, {
      name: listName,
      userId,
      ...(imageUrl ? { imageUrl } : {}),
      ...(bio ? { bio } : {}), // Conditionally add bio if it's available
    }, { merge: true }); // Merge with existing data if the list already exists
    
    console.log('List created or updated successfully');
  } catch (error) {
    console.error('Error creating or updating list:', error);
    throw new Error('Failed to create or update list');
  }
};

// Function to get lists by user ID
export const getListsByUser = async (userId: string): Promise<List[]> => {
  try {
    const listsRef = collection(db, 'lists');
    const q = query(listsRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return [];
    }

    const lists: List[] = [];
    snapshot.forEach(doc => {
      lists.push({
        id: doc.id,
        ...(doc.data() as Omit<List, 'id'>),
      });
    });
    return lists;
  } catch (error) {
    console.error('Error fetching lists:', error);
    throw new Error('Failed to fetch lists');
  }
};

// Function to search lists by name
export const searchListsByName = async (nameQuery: string): Promise<List[]> => {
  try {
    const listsRef = collection(db, 'lists');
    const q = query(listsRef, where('name', '>=', nameQuery), where('name', '<=', nameQuery + '\uf8ff'));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return [];
    }

    const lists: List[] = [];
    snapshot.forEach(doc => {
      lists.push({
        id: doc.id,
        ...(doc.data() as Omit<List, 'id'>),
      });
    });
    return lists;
  } catch (error) {
    console.error('Error searching lists:', error);
    throw new Error('Failed to search lists');
  }
};

// Function to get all lists
export const getAllLists = async (): Promise<List[]> => {
  try {
    const listsRef = collection(db, 'lists');
    const snapshot = await getDocs(listsRef);
    
    if (snapshot.empty) {
      return [];
    }

    const lists: List[] = [];
    snapshot.forEach(doc => {
      lists.push({
        id: doc.id,
        ...(doc.data() as Omit<List, 'id'>),
      });
    });
    return lists;
  } catch (error) {
    console.error('Error fetching all lists:', error);
    throw new Error('Failed to fetch all lists');
  }
};

// Function to delete a list by ID
export const deleteList = async (listId: string): Promise<void> => {
  try {
    const listRef = doc(db, 'lists', listId);
    await deleteDoc(listRef);
    console.log('List deleted successfully');
  } catch (error) {
    console.error('Error deleting list:', error);
    throw new Error('Failed to delete list');
  }
};



// // lib/firebaseService.ts
// import { initializeApp } from 'firebase/app';
// import { getFirestore, doc, setDoc, collection, query, where, getDocs, getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';
// import { getFirebaseConfig } from './firebase/config'; // Import the function from your config file

// // Initialize Firebase with the configuration
// const firebaseConfig = getFirebaseConfig();
// const firebaseApp = initializeApp(firebaseConfig);
// const db = getFirestore(firebaseApp);
// const storage = getStorage(firebaseApp);

// interface List {
//   id: string;
//   name: string;
//   userId: string;
//   imageUrl?: string;
// }

// // Function to create or update a list
// export const createOrUpdateList = async (listId: string, listName: string, userId: string, imageFile?: File): Promise<void> => {
//   try {
//     const listRef = doc(db, 'lists', listId);
//     let imageUrl;

//     if (imageFile) {
//       const storageRef = ref(storage, `list-images/${listId}`);
//       await uploadBytes(storageRef, imageFile);
//       imageUrl = await getDownloadURL(storageRef);
//     }

//     await setDoc(listRef, {
//       name: listName,
//       userId,
//       imageUrl,
//     }, { merge: true }); // Merge with existing data if the list already exists
//     console.log('List created or updated successfully');
//   } catch (error) {
//     console.error('Error creating or updating list:', error);
//     throw new Error('Failed to create or update list');
//   }
// };

// // Function to get lists by user ID
// export const getListsByUser = async (userId: string): Promise<List[]> => {
//   try {
//     const listsRef = collection(db, 'lists');
//     const q = query(listsRef, where('userId', '==', userId));
//     const snapshot = await getDocs(q);
    
//     if (snapshot.empty) {
//       return [];
//     }

//     const lists: List[] = [];
//     snapshot.forEach(doc => {
//       lists.push({
//         id: doc.id,
//         ...(doc.data() as Omit<List, 'id'>),
//       });
//     });
//     return lists;
//   } catch (error) {
//     console.error('Error fetching lists:', error);
//     throw new Error('Failed to fetch lists');
//   }
// };
