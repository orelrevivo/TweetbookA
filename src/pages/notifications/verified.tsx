import { useEffect, useState, ReactElement, ReactNode } from 'react';
import { useAuth } from '@lib/context/auth-context';
import { getNotifications, hideDefaultNotification, shouldShowDefaultNotification, getNotificationSettings } from '@lib/firebase/notifications';
import { MainContainer } from '@components/home/main-container-me2';
import { SEO } from '@components/common/seo';
import { HomeLayout, ProtectedLayout } from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import { motion } from 'framer-motion';
import cn from 'clsx';
import { UserNavLink } from '../../components/user/user-nav-link-me';
import { Popover } from '@headlessui/react';
import { HeroIcon } from '@components/ui/hero-icon';
import { useRouter } from 'next/router';
import { UserNav } from './user_nav_Notifcations';
import { StatsEmpty } from '@components/Post/stats-empty';
import { MainHeader } from '@components/home/notifications_main';
import { AnimatePresence } from 'framer-motion';
import { where, orderBy } from 'firebase/firestore';
import { useWindow } from '@lib/context/window-context';
import { useInfiniteScroll } from '@lib/hooks/useInfiniteScroll';
import { tweetsCollection } from '@lib/firebase/collections';
import { Input } from '@components/input/input';
import { Tweet } from '@components/Post/tweet';
import { Loading } from '@components/ui/loading';
import { Error } from '@components/ui/error';
import { AsideSidbar } from '@components/aside/aside-Sidbar';
import { Ad } from '@components/aside/ad';

import { createAdPost, fetchAdPosts, deleteAdPost } from '@lib/firebase/AD';
import { addNotification } from '@lib/firebase/notifications'; // Import the addNotification function


export default function verified(): JSX.Element {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showDefaultNotification, setShowDefaultNotification] = useState(true);
  const [filterActive, setFilterActive] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean | null>(null);
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

  const handleSettingsClick = () => {
    router.push('/Settings/notifications'); // Navigate to the settings page
  };

  // New function to add notifications when a user follows someone
  const handleNewFollowerNotification = async (followedUserId: string) => {
    try {
      if (!user?.id) return;

      // Fetch the followed user's verification status
      const settings = await getNotificationSettings(followedUserId);
      if (settings?.verified) {
        // Add a notification only if the followed user is verified
        await addNotification(followedUserId, `${user.username} followed you`, true);
        console.log('Notification sent to verified user:', followedUserId);
      }
    } catch (error) {
      console.error('Error adding follower notification:', error);
    }
  };

  const [activeTab, setActiveTab] = useState<'ForYou' | 'Following'>('ForYou');
  const { data, loading, LoadMore } = useInfiniteScroll(
    tweetsCollection,
    [where('parent', '==', null), orderBy('createdAt', 'desc')],
    { includeUser: true, allowNull: true, preserve: true }
  );
  const [filteredData, setFilteredData] = useState<any[]>([]);



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
                {notifications.length > 0 ? (
        notifications.map((notification, index) => (
          <div className='notificationmessage border-light-border dark:border-dark-border border-1 xs:border accent-tab hover-card' key={index}>
            <span className='notificationmessageSpan'>
              <HeroIcon className='notificationmessageSpan2131' iconName='UserIcon' />
              {notification.message}
            </span>
          </div>
        ))
      ) : (
        <div>No notifications available.</div>
      )}
                </div>
            </AnimatePresence>
          ) : (
        <div>
                <StatsEmpty
      title="Nothing to see here — yet"
      description="Likes, mentions, reposts, and a whole lot more — when it comes from a verified account, you’ll find it here. Learn more"
      imageData={{ src: '/assets/no-verified.png', alt: 'No posts' }}
    />
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

verified.getLayout = (page: ReactElement): ReactNode => (
  <ProtectedLayout>
    <MainLayout>
      <HomeLayout>{page}</HomeLayout>
    </MainLayout>
  </ProtectedLayout>
);
