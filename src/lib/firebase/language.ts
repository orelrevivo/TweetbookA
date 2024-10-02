import {
    doc,
    collection,
    setDoc,
    updateDoc,
    arrayUnion,
    increment,
    serverTimestamp,
    getDocs,
    query,
    orderBy,
    deleteDoc // Import deleteDoc function
  } from 'firebase/firestore';
  import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
  import { db, storage } from './app';
  