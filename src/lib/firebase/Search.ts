import {
    doc,
    collection,
    setDoc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    getDoc,
    getDocs,
    query,
    orderBy
  } from 'firebase/firestore';
  import { db } from './app';
  
  // Fetch recent searches for a user
  export async function fetchRecentSearches(userId: string) {
    const userDoc = doc(db, 'users', userId);
    const userSnapshot = await getDoc(userDoc);
  
    if (userSnapshot.exists()) {
      const data = userSnapshot.data();
      return data.recentSearches || [];
    } else {
      return [];
    }
  }
  
  // Save a new recent search for a user
  export async function addRecentSearch(userId: string, searchQuery: string) {
    const userDoc = doc(db, 'users', userId);
    const userSnapshot = await getDoc(userDoc);
    
    if (userSnapshot.exists()) {
      const data = userSnapshot.data();
      const recentSearches = data.recentSearches || [];
      if (!recentSearches.includes(searchQuery)) {
        await updateDoc(userDoc, {
          recentSearches: arrayUnion(searchQuery)
        });
      }
    } else {
      await setDoc(userDoc, {
        recentSearches: [searchQuery]
      });
    }
  }
  
  // Remove a specific recent search for a user
  export async function removeRecentSearch(userId: string, searchQuery: string) {
    const userDoc = doc(db, 'users', userId);
    await updateDoc(userDoc, {
      recentSearches: arrayRemove(searchQuery)
    });
  }
  // Save settings to Firestore
export const saveSettingsToFirebase = async (userId: string, settings: any) => {
    try {
      const settingsRef = doc(db, 'userSettings', userId);
      await setDoc(settingsRef, settings, { merge: true });
    } catch (error) {
      console.error('Error saving settings to Firestore:', error);
    }
  };
  
  // Fetch settings from Firestore
  export const fetchUserSettings = async (userId: string) => {
    try {
      const settingsRef = doc(db, 'userSettings', userId);
      const settingsSnapshot = await getDoc(settingsRef);
      return settingsSnapshot.exists() ? settingsSnapshot.data() : null;
    } catch (error) {
      console.error('Error fetching settings from Firestore:', error);
      return null;
    }
  };