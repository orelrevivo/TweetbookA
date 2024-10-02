import { useEffect, useState, ReactElement, ReactNode } from 'react';
import { useAuth } from '@lib/context/auth-context';
import { getNotifications, hideDefaultNotification, shouldShowDefaultNotification, getNotificationSettings } from '@lib/firebase/notifications';
import { MainContainer } from '@components/home/main-container-me2';
import { SEO } from '@components/common/seo';
import { HomeLayout, ProtectedLayout } from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import { Popover } from '@headlessui/react';
import { HeroIcon } from '@components/ui/hero-icon';
import { useRouter } from 'next/router';
import { MainHeader } from '@components/home/notifications_main';
import { UserNav } from './notifications/user_nav_Notifcations';
import { StatsEmpty } from '@components/Post/stats-empty';

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

  return (
    <MainContainer className='InputisMobile2'>
      <MainHeader className='UserNav123'>
      <UserNav />
      </MainHeader>
      <SEO title="Notifications / Tweetbook" />
      {/* {showDefaultNotification && (
        <div className='notificationmessage border-light-border dark:border-dark-border border-1 xs:border accent-tab hover-card'>
          <span className='notificationmessageSpan24 '>Hello {user.username}</span>
          <Popover className="relative">
            <Popover.Button>
              <span className='threeDotsIcon'>...</span>
            </Popover.Button>
            <Popover.Panel className="absolute z-10 bg-white dark:bg-gray-800 p-2 rounded-md shadow-lg">
              <div className='flex flex-col'>
                <button
                  onClick={() => alert('Report functionality coming soon!')}
                  className='dropdownButton py-1 text-left'
                >
                  Report
                </button>
                <button
                  onClick={handleHideNotification}
                  className='dropdownButton py-1 text-left'
                >
                  Don't show me this again
                </button>
              </div>
            </Popover.Panel>
          </Popover>
        </div>
      )} */}

      {notifications.length > 0 ? (
        notifications.map((notification, index) => (
          <div className='notificationmessage border-light-border dark:border-dark-border border-1 xs:border accent-tab hover-card' key={index}>
            <span className='notificationmessageSpan'>
              <HeroIcon className='notificationmessageSpan2131' iconName='UserIcon' />
              <span className='notificationmessage2'>{notification.message}</span>
            </span>
          </div>
        ))
      ) : (
        <div>
           <StatsEmpty
      title="No notifications available."
      description="If there are no alerts here, there are no alerts here. Learn more"
    />
        </div>
      )}
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
