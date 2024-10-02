import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './app';


  // Function to get premium status from the server
  export async function getPremiumStatusFromServer(userId: string): Promise<boolean> {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      return userDoc.exists() && userDoc.data()?.isPremium;
    } catch (error) {
      console.error('Error fetching premium status:', error);
      return false; // Default to false if there is an error
    }
  }
  
  // Function to upgrade the user to premium
  export async function updateUserToPremium(userId: string, paymentDetails: any): Promise<void> {
    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, {
        isPremium: true,
        paymentDetails,
      });
      console.log('User upgraded to premium');
    } catch (error) {
      console.error('Error upgrading user to premium:', error);
    }
  }
  
  // Function to cancel the premium subscription
  export async function cancelPremiumSubscription(userId: string, paymentDetails: any): Promise<boolean> {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
  
      if (userDoc.exists() && userDoc.data()?.isPremium) {
        const storedPaymentDetails = userDoc.data()?.paymentDetails;
        
        // Validate that the cancellation details are different from the original payment details
        if (
          storedPaymentDetails.cardNumber !== paymentDetails.cardNumber ||
          storedPaymentDetails.expiryDate !== paymentDetails.expiryDate ||
          storedPaymentDetails.cvv !== paymentDetails.cvv
        ) {
          await updateDoc(userDocRef, {
            isPremium: false,
            paymentDetails: null, // Clear payment details on cancellation
          });
          console.log('Premium subscription canceled');
          return true; // Successfully canceled
        }
      }
      
      console.error('Cannot cancel using the same details');
      return false; // Return false if cancellation fails
    } catch (error) {
      console.error('Error canceling premium subscription:', error);
      return false; // Return false if there is an error
    }
  }
  