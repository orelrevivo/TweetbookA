import { db } from './app';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, where, doc, updateDoc, getDoc } from 'firebase/firestore';

// Add a notification for a user
export async function addNotification(userId: string, message: string, verified: boolean = false): Promise<void> {
  try {
    const notificationsRef = collection(db, `users/${userId}/notifications`);
    await addDoc(notificationsRef, {
      message,
      timestamp: serverTimestamp(),
      verified,
    });
    console.log(`Notification added for user ${userId}: ${message}`);
  } catch (error) {
    console.error(`Error adding notification for user ${userId}:`, error);
  }
}

// Get notifications for a user with category filtering
export async function getNotifications(userId: string, category: string = ''): Promise<any[]> {
  try {
    const notificationsRef = collection(db, `users/${userId}/notifications`);
    let notificationsQuery = query(notificationsRef, orderBy('timestamp', 'desc'));

    if (category === 'verified') {
      notificationsQuery = query(notificationsRef, where('verified', '==', true), orderBy('timestamp', 'desc'));
    } else if (category === 'filtered') {
      notificationsQuery = query(notificationsRef, where('filtered', '==', true), orderBy('timestamp', 'desc'));
    }

    const querySnapshot = await getDocs(notificationsQuery);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error(`Error fetching notifications for user ${userId}:`, error);
    return [];
  }
}

// Hide the default notification permanently for the user
export async function hideDefaultNotification(userId: string): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      showDefaultNotification: false,
    });
    console.log(`Default notification hidden for user ${userId}`);
  } catch (error) {
    console.error(`Error hiding default notification for user ${userId}:`, error);
  }
}

// Update filter status for the user
export async function updateNotificationFilter(userId: string, filterActive: boolean): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, { filterActive });
    console.log(`Notification filter updated to ${filterActive} for user ${userId}`);
  } catch (error) {
    console.error(`Error updating notification filter for user ${userId}:`, error);
  }
}

// Get notification settings for the user
export async function getNotificationSettings(userId: string): Promise<any> {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return {}; // Return default settings if no data found
  } catch (error) {
    console.error(`Error fetching notification settings for user ${userId}:`, error);
    return {};
  }
}

// Update notification settings for the user
export async function updateNotificationSettings(userId: string, settings: { muteNotifications?: boolean; followAlert?: boolean; joinAlert?: boolean }): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, settings);
    console.log(`Notification settings updated for user ${userId}`);
  } catch (error) {
    console.error(`Error updating notification settings for user ${userId}:`, error);
  }
}