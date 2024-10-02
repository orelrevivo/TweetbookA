import { useEffect, useState, ReactElement, ReactNode } from 'react';
import { useAuth } from '@lib/context/auth-context';
import { getNotifications, hideDefaultNotification, shouldShowDefaultNotification, getNotificationSettings } from '@lib/firebase/notifications';
import { MainContainer } from '@components/home/main-container-me2';
import { SEO } from '@components/common/seo';
import { HomeLayout, ProtectedLayout } from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import { useRouter } from 'next/router';
import { MainHeader } from '@components/home/notifications_main';
import { UserNav } from './user_nav_Notifcations';
import { StatsEmpty } from '@components/Post/stats-empty';
import { AnimatePresence } from 'framer-motion';
import { where, orderBy } from 'firebase/firestore';
import { useWindow } from '@lib/context/window-context';
import { useInfiniteScroll } from '@lib/hooks/useInfiniteScroll';
import { tweetsCollection } from '@lib/firebase/collections';
import { Loading } from '@components/ui/loading';

import { createAdPost, fetchAdPosts, deleteAdPost } from '@lib/firebase/AD';
const allNavs = [
  [
    { name: 'All', path: '' }
  ]
] as const;

export default function Notifications({ follow }): JSX.Element {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showDefaultNotification, setShowDefaultNotification] = useState(true);
  const [filterActive, setFilterActive] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean | null>(null);
  const userNav = allNavs[+!!follow];
  const router = useRouter(); // Add router for navigation

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.id) return;

      try {
        const settings = await getNotificationSettings(user.id);
        setNotificationsEnabled(settings.muteNotifications !== true);

        if (notificationsEnabled) {
          const userNotifications = await getNotifications(user.id, filterActive ? 'filtered' : '');
          setNotifications(userNotifications);
        }

        const shouldShow = await shouldShowDefaultNotification(user.id);
        setShowDefaultNotification(shouldShow);

        setFilterActive(settings.filterActive);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [user, filterActive, notificationsEnabled]);

  const handleHideNotification = async () => {
    if (user?.id) {
      await hideDefaultNotification(user.id);
      setShowDefaultNotification(false);
    }
  };

  const handleSettingsClick = () => {
    router.push('/Settings/notifications'); // Navigate to the settings page
  };
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
    <MainContainer className='InputisMobile2'>
      <MainHeader className='UserNav123'>
      <UserNav />
      </MainHeader>
      <SEO title="Notifications / Tweetbook" />
      <section className="flex flex-col">
      {loading ? (
          <Loading className="mt-5" />
        ) : activeTab === 'ForYou' ? (
          filteredData && filteredData.length > 0 ? (
            <AnimatePresence mode="popLayout">
                <div>
                <StatsEmpty
      title="Nothing to see here — yet"
      description="When someone mentions you, you’ll find it here."
    />
                </div>
            </AnimatePresence>
          ) : (
        <div>

        </div>
          )
        ) : (
          <div className="flex justify-center items-center h-full">
          </div>
        )}
      </section>
    </MainContainer>
  );
}

Notifications.getLayout = (page: ReactElement): ReactNode => (
  <ProtectedLayout>
    <MainLayout>
      <HomeLayout>{page}</HomeLayout>
    </MainLayout>
  </ProtectedLayout>
);

