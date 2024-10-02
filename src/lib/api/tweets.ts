
export async function getTweetById(id: string): Promise<Tweet> {
    const doc = await firestore.collection('tweets').doc(id).get();
    if (!doc.exists) {
      throw new Error('Post not found');
    }
    return doc.data() as Tweet;
  }
  