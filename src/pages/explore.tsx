import { useAuth } from '@lib/context/auth-context';
import { HomeLayout, ProtectedLayout } from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import { SEO } from '@components/common/seo';
import { MainHeader } from '@components/home/notifications_main';
import { useState, useEffect, ReactElement, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { collection, query, where, getDocs, orderBy, startAt, endAt, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase/app';
import { HeroIcon } from '@components/ui/hero-icon';
import { StatsEmpty } from '@components/Post/stats-empty';
import { MainContainer } from '@components/home/main-container-home';
import { motion } from 'framer-motion';
import cn from 'clsx';
import { variants } from '@components/user/user-header';
import { UserNavLink } from '@components/user/user-nav-link';
import { AsideTrends } from '../components/aside/aside-trends2';
import { UserNav } from './user_nav_Explor/user_nav_Explor';
import { Suggestions } from '../components/aside/suggestionsSexplore';
import { Moresarch } from '../components/sidebar/MoreSearch';
import { UserCard } from '@components/user/user_card222'; // Import UserCard from Code 2

const saveSettingsToFirebase = async (settings: any) => {
  try {
    console.log('Saving settings to Firebase:', settings);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Settings saved successfully.');
  } catch (error) {
    console.error('Error saving settings:', error);
    throw error;
  }
};

export default function Search(): JSX.Element {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [userResults, setUserResults] = useState<any[]>([]);
  const [tweetResults, setTweetResults] = useState<any | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const router = useRouter();

  const handleSearch = async () => {
    if (!searchQuery) {
      setUserResults([]);
      setTweetResults(null);
      return;
    }

    const isTweetId = searchQuery.match(/^[a-zA-Z0-9]{20}$/);

    if (isTweetId) {
      const tweetDocRef = doc(db, 'tweets', searchQuery);
      const tweetDocSnapshot = await getDoc(tweetDocRef);
      if (tweetDocSnapshot.exists()) {
        setTweetResults({ id: tweetDocSnapshot.id, ...tweetDocSnapshot.data() });
      } else {
        setTweetResults(null);
      }
      setUserResults([]);
    } else {
      const usersRef = collection(db, 'users');
      const userQuery = query(
        usersRef,
        orderBy('username'),
        startAt(searchQuery.toLowerCase()),
        endAt(searchQuery.toLowerCase() + '\uf8ff')
      );

      const userSnapshot = await getDocs(userQuery);
      const usersList = userSnapshot.docs
        .map((doc) => ({
          ...doc.data(),
          uid: doc.id,
        }))
        .filter((user) => user.username.toLowerCase().startsWith(searchQuery.toLowerCase()));

      setUserResults(usersList);
      setTweetResults(null);
    }
  };

  const handleUserSelect = (user: any) => {
    router.push(`/user/${user.username}`);
  };

  const handleTweetSelect = (tweet: any) => {
    router.push(`/Post/${tweet.id}`);
  };

  const handleSettingsSave = async () => {
    try {
      const settings = {
        exploreSettings: true,
        location: true,
        personalization: {
          trendsForYou: true,
        },
      };
      await saveSettingsToFirebase(settings);
      setShowSettings(false);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    handleSearch();
  }, [searchQuery]);

  const {
    asPath,
    query: { id },
  } = useRouter();

  return (
    <>
      <MainContainer className="InputisMobile2">
        <SEO title="Explore / Tweetbook" />
        <div className="Search648949">
          <div className="flex-1 ml-4 md:ml-0">
            <div className="-mb-1 flex flex-col">
              <div className='Moresarch'>
                <Moresarch />
              </div>
              <label
                className='group flex items-center justify-between gap-4 rounded-full
                   bg-main-search-background px-4 py-2 focus-within:bg-main-background
                   focus-within:ring-2 focus-within:ring-main-accent'
                style={{ width: '90%', height: '40px', transform: 'translateX(13px)', marginTop: '10px' }}
              >
                <HeroIcon
                  className="h-5 w-5 text-light-secondary transition-colors group-focus-within:text-main-accent dark:text-dark-secondary"
                  iconName="MagnifyingGlassIcon"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users by username or Posts by ID"
                  className="peer flex-1 bg-transparent outline-none placeholder:text-light-secondary dark:placeholder:text-dark-secondary"
                />
              </label>
            </div>
            <MainHeader className="UserNav123 dsgseggdgsegeg">
              <UserNav />
            </MainHeader>
            <section className="mt-4">
              <div className="">
                <div className="mt-4 flex items-center"></div>
                {tweetResults && (
                  <div className="mt-4">
                    <h3 className="Posttextlg text-lg font-bold">Post</h3>
                    <div className="cursor-pointer accent-tab hover-card p-4" onClick={() => handleTweetSelect(tweetResults)}>
                      <p>{tweetResults.content}</p>
                      <p className="text-sm text-gray-500">- Click to see the post {tweetResults.authorUsername}</p>
                    </div>
                  </div>
                )}

                {userResults.length > 0 && (
                  <div className="mt-4">
                    <h3 className="Posttextlg text-lg font-bold">Users</h3>
                    <ul className="list-none p-0">
                      {userResults.map((user) => (
                        <li key={user.uid} className="cursor-pointer accent-tab hover-card p-4" onClick={() => handleUserSelect(user)}>
                          <UserCard
                            id={user.uid}
                            bio={user.bio}
                            name={user.name}
                            username={user.username}
                            verified={user.verified}
                            photoURL={user.photoURL}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
        {!searchQuery && (
          <>
            <AsideTrends />
            <Suggestions />
          </>
        )}
      </MainContainer>
    </>
  );
}

Search.getLayout = (page: ReactElement): ReactNode => (
  <ProtectedLayout>
    <MainLayout>
      <HomeLayout>{page}</HomeLayout>
    </MainLayout>
  </ProtectedLayout>
);
