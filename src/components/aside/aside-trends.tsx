import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createHashtag, getHashtags, deleteHashtag } from '@lib/firebase/aside-trends'; // Updated import
import { MainHeader } from '@components/home/main-header';

type AsideTrendsProps = {
  inTrendsPage?: boolean;
};

export function AsideTrends({ inTrendsPage }: AsideTrendsProps): JSX.Element {
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [newHashtag, setNewHashtag] = useState('');
  const [lastHashtag, setLastHashtag] = useState<string | null>(null);
  const [lastHashtagIndex, setLastHashtagIndex] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false); // State to manage form visibility
  const [error, setError] = useState<string | null>(null); // State to manage error messages

  useEffect(() => {
    // Fetch existing hashtags when the component mounts
    async function fetchHashtags() {
      const fetchedHashtags = await getHashtags();
      setHashtags(fetchedHashtags);
    }
    fetchHashtags();
  }, []);

  const handleCreateHashtag = async () => {
    if (newHashtag.trim() !== '') {
      try {
        await createHashtag(newHashtag);
        setHashtags([...hashtags, newHashtag]);
        setLastHashtag(newHashtag);
        setLastHashtagIndex(hashtags.length); // Save the index for potential undo
        setNewHashtag(''); // Clear the input
        setError(null); // Clear any previous errors
      } catch (error) {
        setError('Failed to create hashtag: ' + error.message); // Display error message
      }
    }
  };

  const handleDeleteHashtag = async (hashtag: string) => {
    try {
      await deleteHashtag(hashtag); // Delete hashtag from Firebase
      setHashtags(hashtags.filter((tag) => tag !== hashtag)); // Remove it from the state
    } catch (error) {
      setError('Failed to delete hashtag: ' + error.message);
    }
  };

  const handleUndo = async () => {
    if (lastHashtag && lastHashtagIndex !== null) {
      // Your undo logic here
      setHashtags(hashtags.filter((_, index) => index !== lastHashtagIndex));
      setLastHashtag(null);
      setLastHashtagIndex(null);
    }
  };

  const toggleFormVisibility = () => {
    setShowForm((prevShowForm) => !prevShowForm); // Toggle form visibility
  };

  const maxHashtagsToShow = 6;
  const displayHashtags = hashtags.slice(0, maxHashtagsToShow);

  return (
        <div>
          {/* <section className='ADTweetbook border-light-border dark:border-dark-border border-1 xs:border'>

<div>

  <ul>
  <h2 className='relative text-lg font-bold mb-2 left-[10px] top-[5px]'>Trends for you</h2>
    {displayHashtags.map((hashtag, index) => (
      <li key={index}>
        <Link href={`/Trends/Hashtag/${encodeURIComponent(hashtag)}`} passHref>
          <div>
            <button className="custom-button accent-tab hover-card block w-full rounded-2xl
                   rounded-t-none text-center text-main-accent"
                   style={{ borderRadius: '0' }} // Setting border-radius to zero
                   >
              <span className="informationAccountSettingsUScsset036290">
                {hashtag} · Trending
              </span>
              <button className="hashtagclassNamea2 informationAccountSettingsUScss">
                <a>
                  <span className="hashtagspan">#{hashtag}</span>
                </a>
              </button>
            </button>
          </div>
        </Link>
      </li>
    ))}
  </ul>
  {hashtags.length > maxHashtagsToShow && (
    <Link href="/Trends/Hashtag/Trends" passHref>
      <a
        className='custom-button accent-tab hover-card block w-full rounded-2xl
                   rounded-t-none text-center text-main-accent'
      >
      <button className="">See More</button>
      </a>
    </Link>
  )}
</div>

{showForm && (
  <div className="mt-4">
    <input
      type="text"
      value={newHashtag}
      onChange={(e) => setNewHashtag(e.target.value)}
      placeholder="Create a new hashtag"
      className="border p-2 rounded"
    />
    <button
      onClick={handleCreateHashtag}
      className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
    >
      Create
    </button>
    {lastHashtag && (
      <button
        onClick={handleUndo}
        className="ml-2 bg-red-500 text-white px-4 py-2 rounded"
      >
        Undo
      </button>
    )}
    {error && <p className="text-red-500">{error}</p>} 
  </div>
)}
</section> */}
        </div>
  );
}
