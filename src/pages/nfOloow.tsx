import { useState, useEffect, ReactElement, ReactNode } from 'react';
import { Button } from '@components/ui/button';
import { Modal } from '@components/modal/modal';
import { Input } from '@components/input/input';
import { useModal } from '@lib/hooks/useModal';
import cn from 'clsx';
import { useWindow } from '@lib/context/window-context';
import { MainLayout } from '@components/layout/main-layout-U';
import { ProtectedLayout } from '@components/layout/common-layout-U';
import { MainContainer } from '@components/home/main-container-me2';

import { useAuth } from '@lib/context/auth-context';
import { getNotifications, hideDefaultNotification, shouldShowDefaultNotification } from '@lib/firebase/notifications'; // Adjust path if necessary
import { SEO } from '@components/common/seo';
import { HomeLayout } from '@components/layout/common-layout';
import { motion } from 'framer-motion';
import { UserNavLink } from '../components/user/user-nav-link-me';
import { Popover } from '@headlessui/react';
import { HeroIcon } from '@components/ui/hero-icon';
export default function Comments(): JSX.Element {
  const [selectedButton, setSelectedButton] = useState<'one' | 'two' | 'three' | null>(null);
  const { open, openModal, closeModal } = useModal(); // Hook for modal management
  const { isMobile } = useWindow();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showDefaultNotification, setShowDefaultNotification] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.id) return;

      try {
        const userNotifications = await getNotifications(user.id);
        setNotifications(userNotifications);

        // Check if default notification should be hidden
        const shouldShow = await shouldShowDefaultNotification(user.id);
        setShowDefaultNotification(shouldShow);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [user]);

  const handleHideNotification = async () => {
    if (user?.id) {
      await hideDefaultNotification(user.id);
      setShowDefaultNotification(false);
    }
  };
  // Function to handle button clicks and update the selected button
  const handleButtonClick = (button: 'one' | 'two' | 'three') => {
    setSelectedButton(button);
  };

  return (

             <MainContainer>
      <SEO title="Notifications / Tweetbook" />
      <div>
        <h1 className='NotificationsTweetbookH1'>Notification</h1>
        {showDefaultNotification && (
          <div className='notificationmessage'>
            <span className='notificationmessageSpan24'>These alerts will help you for future use and looking at alerts that people will alert you such as: followers, joins, likes, shares, basically everything. Will stay updated?</span>
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
        )}

        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <div className='notificationmessage' key={index}>
              <span className='notificationmessageSpan'><HeroIcon className='notificationmessageSpan2131234' iconName='HeartIcon' />{notification.message}</span>
            </div>
          ))
        ) : (
          <div>No notifications available.</div>
        )}
      </div>
    </MainContainer>
  );
}
Comments.getLayout = function getLayout(page: ReactElement): ReactNode {
    return (
      <ProtectedLayout>
        <MainLayout>{page}</MainLayout>
      </ProtectedLayout>
    );
  };