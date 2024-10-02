// Define the type for a group post
export interface GroupPost {
    id: string; // Unique identifier for the post
    authorId: string; // ID of the user who created the post
    groupId: string; // ID of the group where the post is made
    content: string; // Text content of the post
    imageUrls?: string[]; // Optional array of image URLs associated with the post
    createdAt: Date; // Timestamp when the post was created
    userReplies: number; // Number of replies to the post
    likes: number; // Number of likes on the post
    likedBy?: string[]; // Optional array of user IDs who liked the post
    totalPhotos: number; // Number of photos in the post
  }
  