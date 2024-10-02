import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@lib/firebase/app'; // Firebase configuration import
import { uploadStory, deleteStoryAfterTime } from '@lib/firebase/story'; // Import story functions

const StoryModal = () => {
  const router = useRouter();
  const { id } = router.query; // Get 'id' from URL instead of 'userId'
  const [story, setStory] = useState<any>(null); // Initialize story as null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStory = async () => {
      if (id) {
        try {
          // Fetch the story from Firestore using the 'id'
          const storyDoc = await getDoc(doc(db, 'stories', id as string));
          if (storyDoc.exists()) {
            const storyData = storyDoc.data();
            console.log('Fetched story:', storyData); // Log the fetched story data
            setStory(storyData);
          } else {
            console.error('Story not found');
            setStory(null); // Explicitly set story to null
          }
        } catch (error) {
          console.error('Error fetching story:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchStory();
  }, [id]);

  // Function to handle story upload
  const handleUploadStory = async () => {
    try {
      const newStory = await uploadStory(); // Call uploadStory from Firebase functions
      setStory(newStory); // Update state with the new story
    } catch (error) {
      console.error('Error uploading story:', error);
    }
  };

  // Automatically delete story after a certain time
  useEffect(() => {
    if (story) {
      const timeout = setTimeout(() => {
        deleteStoryAfterTime(id as string); // Delete story from Firebase after time
        setStory(null); // Remove story from state
      }, 24 * 60 * 60 * 1000); // Example: delete after 24 hours
      return () => clearTimeout(timeout); // Clear timeout on component unmount
    }
  }, [story, id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!story) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
        <div className="relative text-white text-center">
          <p>No story available</p>
          <button
            onClick={handleUploadStory}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
          >
            Upload Story
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
      <div className="relative">
        <img
          src={story.imageUrl || ''} // Safely access the imageUrl property
          alt="Story"
          className="w-full h-auto max-w-lg"
        />
        <button
          onClick={() => router.back()} // Close modal and go back
          className="absolute top-2 right-2 text-white bg-black rounded-full p-2"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default StoryModal;
