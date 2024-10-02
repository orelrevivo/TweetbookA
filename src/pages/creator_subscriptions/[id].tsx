import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createHashtag, getHashtags } from '@lib/firebase/aside-trends'; // Import functions to get and create hashtags
import { MainHeader } from '@components/home/main-header';
import { HomeLayout, ProtectedLayout } from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import { MainContainer } from '@components/home/main-container-home';
import { StatsEmpty } from '@components/Post/stats-empty';


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
    <MainContainer className='TweetbookHome'>
      <MainHeader title="creator subscriptions" />
      <ul>
      
      </ul>

    </MainContainer>
  );
}

Trends.getLayout = (page: ReactElement): ReactNode => (
    <ProtectedLayout>
      <MainLayout>
        <HomeLayout>{page}</HomeLayout>
      </MainLayout>
    </ProtectedLayout>
  );