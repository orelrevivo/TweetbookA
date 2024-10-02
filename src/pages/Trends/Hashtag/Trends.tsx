import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createHashtag, getHashtags } from '@lib/firebase/aside-trends'; // Import functions to get and create hashtags
import { MainHeader } from '@components/home/main-header';
import { HomeLayout, ProtectedLayout } from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import { MainContainer } from '@components/home/main-container-home';
import { StatsEmpty } from '@components/Post/stats-empty';
import cn from 'clsx';


export default function Trends(): JSX.Element {
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [newHashtag, setNewHashtag] = useState('');
  const [lastHashtag, setLastHashtag] = useState<string | null>(null);
  const [lastHashtagIndex, setLastHashtagIndex] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false); // State to manage form visibility
  const [error, setError] = useState<string | null>(null); // State to manage error messages
  const [showAll, setShowAll] = useState(false); // State to manage showing all hashtags

  const MAX_HASHTAGS = 6;

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

  const handleUndo = () => {
    if (lastHashtag && lastHashtagIndex !== null) {
      setHashtags(hashtags.filter((_, index) => index !== lastHashtagIndex));
      setLastHashtag(null);
      setLastHashtagIndex(null);
    }
  };

  const toggleFormVisibility = () => {
    setShowForm(prevShowForm => !prevShowForm); // Toggle form visibility
  };

  const displayedHashtags = showAll ? hashtags : hashtags.slice(0, MAX_HASHTAGS);

  return (
    <div className={cn(
      `hover-animation flex min-h-screen w-full max-w-xl flex-col`,
    )}>
      <div className='InputisMobile2'>
    <section className="">
      <MainHeader title="Trending Hashtags" />
      <ul>
        {displayedHashtags.map((hashtag, index) => (
          <li key={index} className="mb-2">
           <Link href={`/Trends/Hashtag/${encodeURIComponent(hashtag)}`} passHref>
                <div>
                  <button className="informationAccountSettingsUScssbutton">
                    <span className="informationAccountSettingsUScsset0362902">
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
            {/* Button to toggle the hashtag creation form */}
            <button 
      onClick={toggleFormVisibility} 
      className="custom-button accent-tab hover-card block w-full text-center text-main-accent"
      style={{ borderRadius: '0' }} // Setting border-radius to zero
      >
        {showForm ? 'Close Creation?' : 'Create Hashtag?'}
      </button>
      {/* Show 'See More' button if there are more than 6 hashtags */}
      {hashtags.length > MAX_HASHTAGS && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="custom-button accent-tab hover-card block w-full text-center text-main-accent"
          style={{ borderRadius: '0' }} // Setting border-radius to zero
        >
          See More Trends
        </button>
      )}
      {/* Hide 'See More' if all hashtags are shown */}
      {showAll && (
        <button
          onClick={() => setShowAll(false)}
          className="custom-button accent-tab hover-card block w-full text-center text-main-accent"
          style={{ borderRadius: '0' }} // Setting border-radius to zero
        >
          Show Less
        </button>
      )}


      {/* Hashtag creation form */}
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
          {error && <p className="text-red-500">{error}</p>} {/* Display error message */}
        </div>
      )}
    </section>
    </div>
     </div>
  );
}

Trends.getLayout = (page: ReactElement): ReactNode => (
    <ProtectedLayout>
      <MainLayout>
        <HomeLayout>{page}</HomeLayout>
      </MainLayout>
    </ProtectedLayout>
  );