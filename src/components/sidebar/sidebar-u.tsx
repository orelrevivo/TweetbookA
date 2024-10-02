import Link from 'next/link';
import { useAuth } from '@lib/context/auth-context';
import { useWindow } from '@lib/context/window-context';
import { useModal } from '@lib/hooks/useModal';
import { Modal } from '@components/modal/modal';
import { Input } from '@components/input/input';
import { CustomIcon } from '@components/ui/custom-icon';
import { Button } from '@components/ui/button';
import { SidebarLink } from './sidebar-link-2';
import { MoreSettings } from './more-settings';
import { SidebarProfile } from './sidebar-profile';
import { AsideFooter3 } from '../aside/aside-footer3';
import type { IconName } from '@components/ui/hero-icon';
import { HeroIcon } from '@components/ui/hero-icon';
import { useState, useEffect } from 'react'; // Import useEffect
import Notifications from '../../pages/notifications';
import { getNotifications } from '@lib/firebase/notifications'; // Import getNotifications
import { Menu } from '@headlessui/react';
import cn from 'clsx';
import { useRouter } from 'next/router';

export type NavLink22324 = {
  href: string;
  linkName: string;
  iconName: IconName;
  disabled?: boolean;
  canBeHidden?: boolean;
};

const navLinks: Readonly<NavLink22324[]> = [
  {
    href: '/Uploadapost',
    linkName: 'Home',
    iconName: 'HomeIcon'
  },
  {
    href: '/Posts',
    linkName: 'Posts',
    iconName: 'Bars3BottomLeftIcon',
    disabled: false,
    canBeHidden: true
  },
  {
    href: '/nfOloow',
    linkName: 'Notifications',
    iconName: 'ChatBubbleOvalLeftIcon',
    disabled: false
  },
    {
    href: '/AD',
    linkName: 'AD',
    iconName: 'ArrowPathRoundedSquareIcon',
    disabled: false,
    canBeHidden: true
  },
  // {
  //   href: '/Analytics',
  //   linkName: 'Analytics',
  //   iconName: 'ArrowPathRoundedSquareIcon',
  //   disabled: false,
  //   canBeHidden: true
  // },
  // {
  //   href: '/Inspirations',
  //   linkName: 'Inspirations',
  //   iconName: 'BellIcon',
  //   disabled: false
  // },
  {
    href: '/Feedback',
    linkName: 'Feedback',
    iconName: 'HeartIcon'
  },
  {
    href: '/bookmarks',
    linkName: 'Bookmarks',
    iconName: 'BookmarkIcon',
    canBeHidden: true
  },
  {
    href: '/premium',
    linkName: 'premium',
    iconName: 'FireIcon'
  },
  // {
  //   href: '/home',
  //   linkName: 'Return to Tweetbook?',
  //   iconName: 'FireIcon'
  // }
];

const navLinks2: Readonly<NavLink22324[]> = [
  {
    href: '/Trending',
    linkName: 'Trending',
    iconName: 'FireIcon'
  },
  {
    href: '/notifications',
    linkName: 'Notifications',
    iconName: 'BellIcon',
    disabled: false
  },
  {
    href: '/premium',
    linkName: 'Premium',
    iconName: 'StarIcon',
    disabled: false,
    canBeHidden: true
  },
  {
    href: '/messages',
    linkName: 'Messages',
    iconName: 'EnvelopeIcon',
    disabled: false,
    canBeHidden: true
  },
  {
    href: '/bookmarks',
    linkName: 'Bookmarks',
    iconName: 'BookmarkIcon',
    canBeHidden: true
  },
  {
    href: '/tweetbookAi',
    linkName: 'TweetbookAI',
    iconName: 'FireIcon',
    disabled: false
  }
];

export function Sidebar(): JSX.Element {
  const { user } = useAuth();
  const { isMobile } = useWindow();
  const { open, openModal, closeModal } = useModal();
  const username = user?.username as string;
  const router = useRouter();

  // State for the square and notifications count
  const [isSquareVisible, setIsSquareVisible] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState<number>(0);

  const toggleSquareVisibility = () => setIsSquareVisible(!isSquareVisible);
  const handleDisplaySettingsClickCogIcon = () => {
    router.push('home')
  }
  useEffect(() => {
    // Fetch notifications count
    const fetchNotificationsCount = async () => {
      if (!user?.id) return;
      try {
        const userNotifications = await getNotifications(user.id);
        setNotificationsCount(userNotifications.length);
      } catch (error) {
        console.error('Error fetching notifications count:', error);
      }
    };

    fetchNotificationsCount();
  }, [user]);

  return (
    <header
      id='sidebar'
      className='flex w-0 shrink-0 transition-opacity duration-200 xs:w-20 md:w-24
      lg:max-w-none xl:-mr-4 xl:w-full xl:max-w-xs xl:justify-end'
    >
      <div className='fixed-top-bar3 fixed top-0 left-0 right-0 z-10 h-1 bg-main-background'>
        <h1 className='tweetbook2'>Tweetbook <span className='studiotext'>Studio</span></h1>
        <div className="flex justify-center items-center relative">
        {/* <Button
  className='ButtonBellIcon'
  onClick={toggleSquareVisibility}
>
  <HeroIcon className='h-6 w-6' iconName='BellIcon' />
  {notificationsCount > 0 && (
    <div className='notification-count'>
      <span className='notification-count2'>
        {notificationsCount > 9 ? '9+' : notificationsCount}
      </span>
    </div>
  )}
</Button> */}
        </div>
      </div>
      
      <Modal
        className='flex items-start justify-center'
        modalClassName='bg-main-background rounded-2xl max-w-xl w-full mt-8 overflow-hidden'
        open={open}
        closeModal={closeModal}
      >
        <Input modal closeModal={closeModal} />
      </Modal>
      <div
        className='rhfhderhfdhdrfh fixed bottom-0 z-10 flex w-full flex-col justify-between border-t border-light-border
        py-0 dark:border-dark-border xs:top-0 xs:h-full xs:w-auto xs:border-0
        xs:bg-transparent xs:px-2 xs:py-3 xs:pt-2 md:px-4 xl:w-72'
      >
        <section className='flex flex-col justify-center gap-2 xs:items-center xl:items-stretch'>
          <div className="scrollable-container22 border-x-0 border-light-border pb-96 dark:border-dark-border xs:border-x">
            <nav className='displyrr flex items-center justify-around xs:flex-col xs:justify-center xl:block'>
              {navLinks.map(({ href, linkName, iconName, ...rest }) => (
                <SidebarLink key={href} href={href} linkName={linkName} iconName={iconName} {...rest} />
              ))}
            </nav>
          {!isMobile && 
           <button
      className={cn(
        'btnH1223523safeaw flex w-full gap-3 p-4')}
        onClick={handleDisplaySettingsClickCogIcon}
         >
           Back to Tweetbook?
         </button>
          }
          <div className='AsideFooter13'>
          {!isMobile && <AsideFooter3 />}
          </div>
          </div>
        </section>
      </div>
    </header>
  );
}