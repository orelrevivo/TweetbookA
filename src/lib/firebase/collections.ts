import { collection } from 'firebase/firestore';
import { userConverter } from '@lib/types/user';
import { tweetConverter } from '@lib/types/tweet';
import { bookmarkConverter } from '@lib/types/bookmark';
import { statsConverter } from '@lib/types/stats';
import { db } from './app';
import type { CollectionReference } from 'firebase/firestore';
import type { Bookmark } from '@lib/types/bookmark';
import type { Stats } from '@lib/types/stats';

// Collection for users
export const usersCollection = collection(db, 'users').withConverter(
  userConverter
);

// Collection for tweets
export const tweetsCollection = collection(db, 'tweets').withConverter(
  tweetConverter
);

// Collection for group posts (group tweets)
export const groupsCollection = collection(db, 'groups').withConverter(
  tweetConverter
);

// Collection for communities
export const communitiesCollection = collection(db, 'communities').withConverter(
  // Add the appropriate converter for communities here
);

// Function to get a collection of bookmarks for a specific user
export function userBookmarksCollection(
  id: string
): CollectionReference<Bookmark> {
  return collection(db, `users/${id}/bookmarks`).withConverter(
    bookmarkConverter
  );
}

// Function to get a collection of stats for a specific user
export function userStatsCollection(id: string): CollectionReference<Stats> {
  return collection(db, `users/${id}/stats`).withConverter(statsConverter);
}
