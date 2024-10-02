import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { where, orderBy } from 'firebase/firestore';
import { useWindow } from '@lib/context/window-context';
import { useInfiniteScroll } from '@lib/hooks/useInfiniteScroll';
import { tweetsCollection } from '@lib/firebase/collections';
import { HomeLayout, ProtectedLayout } from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import { SEO } from '@components/common/seo';
import { MainContainer } from '@components/home/main-container-home';
import { Input } from '@components/input/input';
import { Tweet } from '@components/Post/tweet';
import { Loading } from '@components/ui/loading';
import { StatsEmpty } from '@components/Post/stats-empty';
import PostAD from './PostAD/postAD';
import { fetchAdPosts, deleteAdPost } from '@lib/firebase/AD';
import { MainHeader } from '@components/home/main-header';
import cn from 'clsx';
import  Story  from '@components/story/story';

export default function Home(): JSX.Element {
  const [activeTab, setActiveTab] = useState<'ForYou' | 'Following'>('ForYou');
  const { data, loading, LoadMore } = useInfiniteScroll(
    tweetsCollection,
    [where('parent', '==', null), orderBy('createdAt', 'desc')],
    { includeUser: true, allowNull: true, preserve: true }
  );
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [newPosts, setNewPosts] = useState<any[]>([]); // Holds the new posts
  const [ads, setAds] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [newPostCount, setNewPostCount] = useState(0); // State to track new post count
  const [lastFetchedPostTime, setLastFetchedPostTime] = useState<number | null>(null); // Track last post time
  const [showSeePostsButton, setShowSeePostsButton] = useState(false); // To control button visibility

  useEffect(() => {
    setFilteredData(data); // Set initial loaded data
  }, [data]);

  const { isMobile } = useWindow();

  // Handle Ad fetching and user simulation
  useEffect(() => {
    const fetchAds = async () => {
      const fetchedAds = await fetchAdPosts();
      setAds(fetchedAds);
    };
    fetchAds();
    setCurrentUserId('currentUser123'); // Replace with real user ID fetching
  }, []);

  // Handle detecting new posts without showing them immediately
  useEffect(() => {
    if (data && data.length > 0) {
      const latestPostTime = data[0].createdAt.toMillis();

      // If this is the first load, just set the last fetched post time
      if (!lastFetchedPostTime) {
        setLastFetchedPostTime(latestPostTime);
      } else if (latestPostTime > lastFetchedPostTime) {
        const newFetchedPosts = data.filter(
          (post) => post.createdAt.toMillis() > lastFetchedPostTime
        );
        setNewPosts(newFetchedPosts); // Store new posts in a separate array
        setNewPostCount(newFetchedPosts.length); // Set new post count
        setShowSeePostsButton(true); // Show "See Posts" button
      }
    }
  }, [data, lastFetchedPostTime]);

  // Handle tab switching
  const handleTabClick = (tab: 'ForYou' | 'Following') => {
    setActiveTab(tab);
  };

  // Handle "See Posts" button click
  const handleSeePostsClick = () => {
    setFilteredData((prevData) => [...newPosts, ...prevData]); // Merge new posts with existing posts
    setShowSeePostsButton(false); // Hide button after clicking
    setNewPostCount(0); // Reset new post count
    setLastFetchedPostTime(newPosts[0]?.createdAt.toMillis() || lastFetchedPostTime); // Update last fetched time
    setNewPosts([]); // Clear the new posts array
  };

  return (
    <div className={cn(
      `hover-animation flex min-h-screen w-full max-w-xl flex-col`,
    )}>
      <SEO title="Home / Tweetbook" />
      {/* <div className='fixed-top-bar3 fixed top-0 left-0 right-0 z-10 h-1 bg-main-background border-light-border dark:border-dark-border border-1 xs:border'>
        <h1 className='tweetbook2'>Tweetbook <span className='studiotext'>Studio</span></h1>
        <div className="flex justify-center items-center relative">
    
        </div>
      </div> */}
        {/* <MainHeader
        useMobileSidebar
        title='Home'
        className='flex items-center justify-between'
      >
      </MainHeader> */}
        {/* <MainHeader className='ForyouFollowingdgojes flex items-center justify-between'>
        <div className='hide-on-mobile '>
          <button className="ForyouFollowing accent-tab hover-card block" onClick={() => handleTabClick('ForYou')}>
            <span className="Foryou font-bold">For You</span>
          </button>
          <button className="ForyouFollowing2 accent-tab hover-card block" onClick={() => handleTabClick('Following')}>
            <span className='font-bold'>Following</span>
          </button>
        </div>
      </MainHeader> */}
     <div className='InputisMobile2'>
     {!isMobile && <Story />}
     {!isMobile && <Input />}
      
      {/* "See Posts" Button - Appears only when there are new posts */}
      {/* {showSeePostsButton && newPostCount > 0 && (
        <button className='seeposts' onClick={handleSeePostsClick}>
          See {newPostCount} new posts
        </button>
      )} */}

      {/* Conditional Rendering based on the selected tab */}
      <section className="flex flex-col">
        {loading ? (
          <Loading className="mt-5" />
        ) : activeTab === 'ForYou' ? (
          filteredData && filteredData.length > 0 ? (
            <AnimatePresence mode="popLayout">
              {filteredData.map((tweet, index) => (
                <div key={tweet.id}>
                  <Tweet {...tweet} />
                  {(index + 1) % 40 === 0 && <PostAD key={`ad-${index}`} />}
                </div>
              ))}
              {ads.map((ad) => (
                <PostAD
                  key={ad.id}
                  ad={ad}
                  onDelete={() => deleteAdPost(ad.id)}
                  showDeleteButton={ad.creatorId === currentUserId} 
                />
              ))}
            </AnimatePresence>
          ) : (
            <StatsEmpty
              title="No posts available"
              description="Try following more accounts or creating your own content."
              imageData={{ src: '/assets/no-bookmarks.png', alt: 'No posts' }}
            />
          )
        ) : (
          <div className="flex justify-center items-center h-full">
          </div>
        )}

        {/* Load more button */}
        {activeTab === 'ForYou' && <LoadMore />}
      </section>
     </div>
     </div>
  );
}

Home.getLayout = (page: ReactElement): ReactNode => (
  <ProtectedLayout>
    <MainLayout>
      <HomeLayout>{page}</HomeLayout>
    </MainLayout>
  </ProtectedLayout>
);