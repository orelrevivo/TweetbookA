import {
    doc,
    setDoc,
    serverTimestamp,
  } from 'firebase/firestore';
  import { db } from './app'; // Adjust this import based on your setup
  
  export const purchaseSubscription = async (userId: string, plan: 'basic' | 'premium' | 'premiumPlus') => {
    try {
      const userRef = doc(db, 'users', userId);
      const subscriptionData = {
        subscriptionPlan: plan,
        verified: true, // Set verification status
        updatedAt: serverTimestamp(),
      };
  
      // Update user document with subscription plan and verification status
      await setDoc(userRef, subscriptionData, { merge: true });
  
      return { success: true, message: 'Subscription purchased successfully and verification badge added!' };
    } catch (error) {
      console.error("Error purchasing subscription:", error);
      return { success: false, message: 'Failed to purchase subscription. Please try again.' };
    }
  };
  