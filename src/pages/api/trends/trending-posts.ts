// pages/api/trending-posts.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { getDocs, query, where } from 'firebase/firestore';
import { postsCollection } from '../../../lib/firebase/collections'; // Adjust path based on your project structure

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Fetch posts with 5 or more likes
    const q = query(postsCollection, where('likes', '>=', 5));
    const querySnapshot = await getDocs(q);
    const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(posts);
  } catch (error) {
    console.error('Failed to fetch trending posts:', error);
    res.status(500).json({ message: 'Failed to fetch trending posts' });
  }
}
