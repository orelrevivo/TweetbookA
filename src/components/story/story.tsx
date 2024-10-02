
import { useState } from 'react';
import { useRouter } from 'next/router';
import { uploadStory, deleteStoryAfterTime } from '@lib/firebase/story'; // Import story functions
import { useAuth } from '@lib/context/auth-context'; // Assume you're using some kind of auth to get the current user
import cn from 'clsx';

const Story = () => {
  const router = useRouter();
  const { user } = useAuth(); // Get the current user
  const [image, setImage] = useState<File | null>(null);
  const [duration, setDuration] = useState(1); // Default to 1 day
  const [showModal, setShowModal] = useState(false);

  // Upload the story to Firebase
  const handleStoryUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (image && user) {
      try {
        const userId = user.uid; // Assuming you're getting the user ID from auth
        await uploadStory(userId, image, duration, user.photoURL); // Upload the story
        await deleteStoryAfterTime(userId, duration); // Schedule deletion
        setShowModal(false); // Close the modal after uploading
        router.push(`/story/${userId}`); // Redirect to the user's story page after upload
      } catch (error) {
        console.error("Error uploading story:", error);
      }
    }
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className='dpsiofuhsewiyfdesfuy8o2 gap-y-4 px-4 py-3 outline-none duration-200  border-light-border dark:border-dark-border border-1 xs:border flex flex-col'>
      <div className="flex items-center space-x-4">
        {/* Button to open upload modal */}
        <button
          onClick={() => setShowModal(true)}
          className="dfgdsgesdgseggsdges w-12 h-12 rounded-full border-light-border dark:border-dark-border border-1 xs:border"
        >
          <span className="text-2xl">+</span>
        </button>

        {/* User's Profile Picture */}
        {user && user.photoURL && (
          <img
            src={user.photoURL}
            alt="Profile"
            className="w-12 h-12 rounded-full cursor-pointer"
            onClick={() => router.push(`/story/${user.uid}`)} // Redirect to the story page
          />
        )}
      </div>

      {/* Modal to upload a story */}
      {showModal && (
        <div className="inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-4">Upload Story</h3>
            <form onSubmit={handleStoryUpload} className="flex flex-col gap-4">
              <input type="file" accept="image/*" onChange={handleImageChange} required />
              <div className="flex items-center space-x-2">
                <label>
                  <input
                    type="radio"
                    value={1}
                    checked={duration === 1}
                    onChange={() => setDuration(1)}
                  />
                  1 Day
                </label>
                <label>
                  <input
                    type="radio"
                    value={2}
                    checked={duration === 2}
                    onChange={() => setDuration(2)}
                  />
                  2 Days
                </label>
              </div>
              <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg">
                Upload
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="mt-2 text-red-500"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Story;
