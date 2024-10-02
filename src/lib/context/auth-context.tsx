import { useState, useEffect, useContext, createContext, useMemo } from 'react';
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut as signOutFirebase,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { auth } from '@lib/firebase/app';
import {
  usersCollection,
  userStatsCollection,
  userBookmarksCollection
} from '@lib/firebase/collections';
import { getRandomId, getRandomInt } from '@lib/random';
import { checkUsernameAvailability } from '@lib/firebase/utils';
import type { ReactNode } from 'react';
import type { User as AuthUser } from 'firebase/auth';
import type { WithFieldValue } from 'firebase/firestore';
import type { User } from '@lib/types/user';
import type { Bookmark } from '@lib/types/bookmark';
import type { Stats } from '@lib/types/stats';
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
export const deleteUserAccount = async () => {
  try {
    const response = await axios.delete('/api/delete-account'); // Adjust this endpoint to match your API
    if (response.status === 200) {
      // Successfully deleted account
      console.log('Account deleted successfully');
    } else {
      throw new Error('Failed to delete account');
    }
  } catch (error) {
    console.error('Error in deleteUserAccount:', error);
    throw error;
  }
};
// Function to reauthenticate the user
export const reauthenticateUser = async (email, currentPassword) => {
  const auth = getAuth();
  const user = auth.currentUser;
  
  const credential = EmailAuthProvider.credential(email, currentPassword);
  try {
    await reauthenticateWithCredential(user, credential);
  } catch (error) {
    throw new Error('Reauthentication failed: ' + error.message);
  }
};

// Function to update password
export const changePassword = async (newPassword) => {
  const auth = getAuth();
  const user = auth.currentUser;
  try {
    await updatePassword(user, newPassword);
  } catch (error) {
    throw new Error('Password update failed: ' + error.message);
  }
};
type AuthContext = {
  user: User | null;
  error: string | null;
  loading: boolean;
  isAdmin: boolean;
  randomSeed: string;
  userBookmarks: Bookmark[] | null;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
};

export const AuthContext = createContext<AuthContext | null>(null);

type AuthContextProviderProps = {
  children: ReactNode;
};

export function AuthContextProvider({
  children
}: AuthContextProviderProps): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [userBookmarks, setUserBookmarks] = useState<Bookmark[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const generateProfilePicture = (name: string): string => {
    const initial = name.charAt(0).toUpperCase();
    // Assuming you have a function to generate an image URL based on the initial
    // For simplicity, we'll use a placeholder for the initial profile picture
    return `/assets/profile-initials/${initial}.jpg`; // Adjust this path based on your setup
  };

  const manageUser = async (authUser: AuthUser, name?: string): Promise<void> => {
    const { uid, displayName, photoURL } = authUser;

    const userSnapshot = await getDoc(doc(usersCollection, uid));

    if (!userSnapshot.exists()) {
      let available = false;
      let randomUsername = '';

      while (!available) {
        const normalizeName = displayName?.replace(/\s/g, '').toLowerCase();
        const randomInt = getRandomInt(1, 10_000);

        randomUsername = `${normalizeName as string}${randomInt}`;

        const isUsernameAvailable = await checkUsernameAvailability(
          randomUsername
        );

        if (isUsernameAvailable) available = true;
      }

      const profileInitial = name ? generateProfilePicture(name) : '/assets/default-avatar.jpg';

      const userData: WithFieldValue<User> = {
        id: uid,
        bio: null,
        name: displayName as string,
        theme: null,
        accent: null,
        website: null,
        location: null,
        photoURL: photoURL ?? profileInitial,
        username: randomUsername,
        verified: false,
        following: [],
        followers: [],
        createdAt: serverTimestamp(),
        updatedAt: null,
        totalTweets: 0,
        totalPhotos: 0,
        pinnedTweet: null,
        coverPhotoURL: null
      };

      const userStatsData: WithFieldValue<Stats> = {
        likes: [],
        tweets: [],
        updatedAt: null
      };

      try {
        await Promise.all([
          setDoc(doc(usersCollection, uid), userData),
          setDoc(doc(userStatsCollection(uid), 'stats'), userStatsData)
        ]);

        const newUser = (await getDoc(doc(usersCollection, uid))).data();
        setUser(newUser as User);
      } catch (error) {
        setError('Error creating user account.');
      }
    } else {
      const userData = userSnapshot.data();
      setUser(userData);
    }

    setLoading(false);
  };

  const handleUserAuth = (authUser: AuthUser | null): void => {
    setLoading(true);

    if (authUser) void manageUser(authUser);
    else {
      setUser(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, handleUserAuth);
  }, []);

  useEffect(() => {
    if (!user) return;

    const { id } = user;

    const unsubscribeUser = onSnapshot(doc(usersCollection, id), (doc) => {
      setUser(doc.data() as User);
    });

    const unsubscribeBookmarks = onSnapshot(
      userBookmarksCollection(id),
      (snapshot) => {
        const bookmarks = snapshot.docs.map((doc) => doc.data());
        setUserBookmarks(bookmarks);
      }
    );

    return () => {
      unsubscribeUser();
      unsubscribeBookmarks();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const signInWithGoogle = async (): Promise<void> => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      setError('Error signing in with Google.');
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await signOutFirebase(auth);
    } catch (error) {
      setError('Error signing out.');
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const signUpWithEmail = async (email: string, password: string, name: string): Promise<void> => {
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        await manageUser(userCredential.user, name);
      }
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('The email address is already in use.');
      } else {
        setError('Error creating account with email.');
      }
    }
  };

  const signInWithEmail = async (email: string, password: string): Promise<void> => {
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError('Error signing in with email.');
    }
  };

  const isAdmin = user ? user.username === 'Tweetbook' : false;
  const randomSeed = useMemo(getRandomId, [user?.id]);

  const value: AuthContext = {
    user,
    error,
    loading,
    isAdmin,
    randomSeed,
    userBookmarks,
    signOut,
    signInWithGoogle,
    signUpWithEmail,
    signInWithEmail
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContext {
  const context = useContext(AuthContext);

  if (!context)
    throw new Error('useAuth must be used within an AuthContextProvider');

  return context;
}

// import { useState, useEffect, useContext, createContext, useMemo } from 'react';
// import {
//   signInWithPopup,
//   GoogleAuthProvider,
//   onAuthStateChanged,
//   signOut as signOutFirebase,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword
// } from 'firebase/auth';
// import {
//   doc,
//   getDoc,
//   setDoc,
//   onSnapshot,
//   serverTimestamp
// } from 'firebase/firestore';
// import { auth } from '@lib/firebase/app';
// import {
//   usersCollection,
//   userStatsCollection,
//   userBookmarksCollection
// } from '@lib/firebase/collections';
// import { getRandomId, getRandomInt } from '@lib/random';
// import { checkUsernameAvailability } from '@lib/firebase/utils';
// import type { ReactNode } from 'react';
// import type { User as AuthUser } from 'firebase/auth';
// import type { WithFieldValue } from 'firebase/firestore';
// import type { User } from '@lib/types/user';
// import type { Bookmark } from '@lib/types/bookmark';
// import type { Stats } from '@lib/types/stats';

// type AuthContext = {
//   user: User | null;
//   error: string | null;
//   loading: boolean;
//   isAdmin: boolean;
//   randomSeed: string;
//   userBookmarks: Bookmark[] | null;
//   signOut: () => Promise<void>;
//   signInWithGoogle: () => Promise<void>;
//   signUpWithEmail: (email: string, password: string) => Promise<void>;
//   signInWithEmail: (email: string, password: string) => Promise<void>;
// };

// export const AuthContext = createContext<AuthContext | null>(null);

// type AuthContextProviderProps = {
//   children: ReactNode;
// };

// export function AuthContextProvider({
//   children
// }: AuthContextProviderProps): JSX.Element {
//   const [user, setUser] = useState<User | null>(null);
//   const [userBookmarks, setUserBookmarks] = useState<Bookmark[] | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const manageUser = async (authUser: AuthUser): Promise<void> => {
//       const { uid, displayName, photoURL } = authUser;

//       const userSnapshot = await getDoc(doc(usersCollection, uid));

//       if (!userSnapshot.exists()) {
//         let available = false;
//         let randomUsername = '';

//         while (!available) {
//           const normalizeName = displayName?.replace(/\s/g, '').toLowerCase();
//           const randomInt = getRandomInt(1, 10_000);

//           randomUsername = `${normalizeName as string}${randomInt}`;

//           const isUsernameAvailable = await checkUsernameAvailability(
//             randomUsername
//           );

//           if (isUsernameAvailable) available = true;
//         }

//         const userData: WithFieldValue<User> = {
//           id: uid,
//           bio: null,
//           name: displayName as string,
//           theme: null,
//           accent: null,
//           website: null,
//           location: null,
//           photoURL: photoURL ?? '/assets/twitter-avatar.jpg',
//           username: randomUsername,
//           verified: false,
//           following: [],
//           followers: [],
//           createdAt: serverTimestamp(),
//           updatedAt: null,
//           totalTweets: 0,
//           totalPhotos: 0,
//           pinnedTweet: null,
//           coverPhotoURL: null
//         };

//         const userStatsData: WithFieldValue<Stats> = {
//           likes: [],
//           tweets: [],
//           updatedAt: null
//         };

//         try {
//           await Promise.all([
//             setDoc(doc(usersCollection, uid), userData),
//             setDoc(doc(userStatsCollection(uid), 'stats'), userStatsData)
//           ]);

//           const newUser = (await getDoc(doc(usersCollection, uid))).data();
//           setUser(newUser as User);
//         } catch (error) {
//           setError('Error creating user account.');
//         }
//       } else {
//         const userData = userSnapshot.data();
//         setUser(userData);
//       }

//       setLoading(false);
//     };

//     const handleUserAuth = (authUser: AuthUser | null): void => {
//       setLoading(true);

//       if (authUser) void manageUser(authUser);
//       else {
//         setUser(null);
//         setLoading(false);
//       }
//     };

//     onAuthStateChanged(auth, handleUserAuth);
//   }, []);

//   useEffect(() => {
//     if (!user) return;

//     const { id } = user;

//     const unsubscribeUser = onSnapshot(doc(usersCollection, id), (doc) => {
//       setUser(doc.data() as User);
//     });

//     const unsubscribeBookmarks = onSnapshot(
//       userBookmarksCollection(id),
//       (snapshot) => {
//         const bookmarks = snapshot.docs.map((doc) => doc.data());
//         setUserBookmarks(bookmarks);
//       }
//     );

//     return () => {
//       unsubscribeUser();
//       unsubscribeBookmarks();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [user?.id]);

//   const signInWithGoogle = async (): Promise<void> => {
//     try {
//       const provider = new GoogleAuthProvider();
//       await signInWithPopup(auth, provider);
//     } catch (error) {
//       setError('Error signing in with Google.');
//     }
//   };

//   const signOut = async (): Promise<void> => {
//     try {
//       await signOutFirebase(auth);
//     } catch (error) {
//       setError('Error signing out.');
//     }
//   };

//   const validateEmail = (email: string): boolean => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   const signUpWithEmail = async (email: string, password: string): Promise<void> => {
//     if (!validateEmail(email)) {
//       setError('Please enter a valid email address.');
//       return;
//     }

//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       if (userCredential.user) {
//         await manageUser(userCredential.user);
//       }
//     } catch (error) {
//       if (error.code === 'auth/email-already-in-use') {
//         setError('The email address is already in use.');
//       } else {
//         setError('Error creating account with email.');
//       }
//     }
//   };

//   const signInWithEmail = async (email: string, password: string): Promise<void> => {
//     if (!validateEmail(email)) {
//       setError('Please enter a valid email address.');
//       return;
//     }

//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//     } catch (error) {
//       setError('Error signing in with email.');
//     }
//   };

//   const isAdmin = user ? user.username === 'ccrsxx' : false;
//   const randomSeed = useMemo(getRandomId, [user?.id]);

//   const value: AuthContext = {
//     user,
//     error,
//     loading,
//     isAdmin,
//     randomSeed,
//     userBookmarks,
//     signOut,
//     signInWithGoogle,
//     signUpWithEmail,
//     signInWithEmail
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// export function useAuth(): AuthContext {
//   const context = useContext(AuthContext);

//   if (!context)
//     throw new Error('useAuth must be used within an AuthContextProvider');

//   return context;
// }

// import { useState, useEffect, useContext, createContext, useMemo } from 'react';
// import {
//   signInWithPopup,
//   GoogleAuthProvider,
//   onAuthStateChanged,
//   signOut as signOutFirebase
// } from 'firebase/auth';
// import {
//   doc,
//   getDoc,
//   setDoc,
//   onSnapshot,
//   serverTimestamp
// } from 'firebase/firestore';
// import { auth } from '@lib/firebase/app';
// import {
//   usersCollection,
//   userStatsCollection,
//   userBookmarksCollection
// } from '@lib/firebase/collections';
// import { getRandomId, getRandomInt } from '@lib/random';
// import { checkUsernameAvailability } from '@lib/firebase/utils';
// import type { ReactNode } from 'react';
// import type { User as AuthUser } from 'firebase/auth';
// import type { WithFieldValue } from 'firebase/firestore';
// import type { User } from '@lib/types/user';
// import type { Bookmark } from '@lib/types/bookmark';
// import type { Stats } from '@lib/types/stats';

// type AuthContext = {
//   user: User | null;
//   error: Error | null;
//   loading: boolean;
//   isAdmin: boolean;
//   randomSeed: string;
//   userBookmarks: Bookmark[] | null;
//   signOut: () => Promise<void>;
//   signInWithGoogle: () => Promise<void>;
// };

// export const AuthContext = createContext<AuthContext | null>(null);

// type AuthContextProviderProps = {
//   children: ReactNode;
// };

// export function AuthContextProvider({
//   children
// }: AuthContextProviderProps): JSX.Element {
//   const [user, setUser] = useState<User | null>(null);
//   const [userBookmarks, setUserBookmarks] = useState<Bookmark[] | null>(null);
//   const [error, setError] = useState<Error | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const manageUser = async (authUser: AuthUser): Promise<void> => {
//       const { uid, displayName, photoURL } = authUser;

//       const userSnapshot = await getDoc(doc(usersCollection, uid));

//       if (!userSnapshot.exists()) {
//         let available = false;
//         let randomUsername = '';

//         while (!available) {
//           const normalizeName = displayName?.replace(/\s/g, '').toLowerCase();
//           const randomInt = getRandomInt(1, 10_000);

//           randomUsername = `${normalizeName as string}${randomInt}`;

//           const isUsernameAvailable = await checkUsernameAvailability(
//             randomUsername
//           );

//           if (isUsernameAvailable) available = true;
//         }

//         const userData: WithFieldValue<User> = {
//           id: uid,
//           bio: null,
//           name: displayName as string,
//           theme: null,
//           accent: null,
//           website: null,
//           location: null,
//           photoURL: photoURL ?? '/assets/twitter-avatar.jpg',
//           username: randomUsername,
//           verified: false,
//           following: [],
//           followers: [],
//           createdAt: serverTimestamp(),
//           updatedAt: null,
//           totalTweets: 0,
//           totalPhotos: 0,
//           pinnedTweet: null,
//           coverPhotoURL: null
//         };

//         const userStatsData: WithFieldValue<Stats> = {
//           likes: [],
//           tweets: [],
//           updatedAt: null
//         };

//         try {
//           await Promise.all([
//             setDoc(doc(usersCollection, uid), userData),
//             setDoc(doc(userStatsCollection(uid), 'stats'), userStatsData)
//           ]);

//           const newUser = (await getDoc(doc(usersCollection, uid))).data();
//           setUser(newUser as User);
//         } catch (error) {
//           setError(error as Error);
//         }
//       } else {
//         const userData = userSnapshot.data();
//         setUser(userData);
//       }

//       setLoading(false);
//     };

//     const handleUserAuth = (authUser: AuthUser | null): void => {
//       setLoading(true);

//       if (authUser) void manageUser(authUser);
//       else {
//         setUser(null);
//         setLoading(false);
//       }
//     };

//     onAuthStateChanged(auth, handleUserAuth);
//   }, []);

//   useEffect(() => {
//     if (!user) return;

//     const { id } = user;

//     const unsubscribeUser = onSnapshot(doc(usersCollection, id), (doc) => {
//       setUser(doc.data() as User);
//     });

//     const unsubscribeBookmarks = onSnapshot(
//       userBookmarksCollection(id),
//       (snapshot) => {
//         const bookmarks = snapshot.docs.map((doc) => doc.data());
//         setUserBookmarks(bookmarks);
//       }
//     );

//     return () => {
//       unsubscribeUser();
//       unsubscribeBookmarks();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [user?.id]);

//   const signInWithGoogle = async (): Promise<void> => {
//     try {
//       const provider = new GoogleAuthProvider();
//       await signInWithPopup(auth, provider);
//     } catch (error) {
//       setError(error as Error);
//     }
//   };

//   const signOut = async (): Promise<void> => {
//     try {
//       await signOutFirebase(auth);
//     } catch (error) {
//       setError(error as Error);
//     }
//   };

//   const isAdmin = user ? user.username === 'ccrsxx' : false;
//   const randomSeed = useMemo(getRandomId, [user?.id]);

//   const value: AuthContext = {
//     user,
//     error,
//     loading,
//     isAdmin,
//     randomSeed,
//     userBookmarks,
//     signOut,
//     signInWithGoogle
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// export function useAuth(): AuthContext {
//   const context = useContext(AuthContext);

//   if (!context)
//     throw new Error('useAuth must be used within an AuthContextProvider');

//   return context;
// }
