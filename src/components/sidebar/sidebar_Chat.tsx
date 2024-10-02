import Link from 'next/link';
import { useAuth } from '@lib/context/auth-context';
import { useWindow } from '@lib/context/window-context';
import { useModal } from '@lib/hooks/useModal';
import { Modal } from '@components/modal/modal';
import { Input } from '@components/input/input';
import { CustomIcon } from '@components/ui/custom-icon';
import { Button } from '@components/ui/button';
import { SidebarLink } from './sidebar-link';
import { MoreSettings } from './more-settings';
import { SidebarProfile } from './sidebar-profile';
import { Sidbarup } from './Sidbar-up';
import { AsideFooter } from '../aside/aside-footer';
import type { IconName } from '@components/ui/hero-icon';
import { HeroIcon } from '@components/ui/hero-icon';
import { useState, useEffect } from 'react'; // Import useEffect
import Notifications from '../../pages/notifications';
import { getNotifications } from '@lib/firebase/notifications'; // Import getNotifications

export type NavLink22324 = {
  href: string;
  linkName: string;
  iconName: IconName;
  disabled?: boolean;
  canBeHidden?: boolean;
};

const navLinks: Readonly<NavLink22324[]> = [
  {
    href: '/home',
    linkName: 'ForYou',
    iconName: 'HomeIcon'
  },
  {
    href: '/explore',
    linkName: 'Explore',
    iconName: 'MagnifyingGlassIcon',
    disabled: false,
  },
  {
    href: '/messages',
    linkName: 'Messages',
    iconName: 'EnvelopeIcon',
    disabled: false,
  },
  {
    href: '/Communities',
    linkName: 'Communities',
    iconName: 'UsersIcon',
    disabled: false,
  },
  {
    href: '/notifications',
    linkName: 'Notifications',
    iconName: 'BellIcon',
    disabled: false
  },
  {
    href: '/video',
    linkName: 'ClipStream',
    iconName: 'FireIcon',
    canBeHidden: true
  },
  {
    href: '/bookmarks',
    linkName: 'Bookmarks',
    iconName: 'BookmarkIcon',
    canBeHidden: true
  },
  {
    href: '/premium',
    linkName: 'Premium',
    iconName: 'StarIcon',
    disabled: false,
    canBeHidden: true
  },
];
export function Sidebar(): JSX.Element {
  const { user } = useAuth();
  const { isMobile } = useWindow();
  const { open, openModal, closeModal } = useModal();
  const username = user?.username as string;

  // State for the square and notifications count
  const [isSquareVisible, setIsSquareVisible] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState<number>(0);

  const toggleSquareVisibility = () => setIsSquareVisible(!isSquareVisible);

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
           <div className='border-light-border dark:border-dark-border border-1 xs:border fixed-top-bar3 fixed top-0 left-0 right-0 z-10 h-1 bg-main-background'>
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
        className='fixed z-10 flex w-full flex-col justify-between border-t border-light-border
        py-0 dark:border-dark-border xs:top-0 xs:h-full xs:w-auto xs:border-0
        xs:bg-transparent xs:px-2 xs:py-3 xs:pt-2 md:px-4 xl:w-72'
      >
        <section className='flex flex-col justify-center gap-2 xs:items-center xl:items-stretch'>
          <div className="scrollable-container2 border-x-0 border-light-border pb-96 dark:border-dark-border xs:border-x">
          <div className='tweetbookdiv2'>
        </div>
        <h1 className=''>
        <Link href='/home'>
              <a
                className=''
              >
               <div className="logo">
        <span className="color-text">T</span>
        <span className="color-text">w</span>
        <span className="color-text">e</span>
        <span className="color-text">e</span>
        <span className="color-text">t</span>
        <span className="color-text">b</span>
        <span className="color-text">o</span>
        <span className="color-text">o</span>
        <span className="color-text">k</span>
        </div>
              </a>
            </Link>
        </h1>
            <nav className='displyrr flex items-center justify-around xs:flex-col xs:justify-center xl:block'>
              {navLinks.map(({ href, linkName, iconName, ...rest }) => (
                <SidebarLink key={href} href={href} linkName={linkName} iconName={iconName} {...rest} />
              ))}
              <SidebarLink href={`/user/${username}`} username={username} linkName='Profile' iconName='UserIcon' />
              {!isMobile && <SidebarProfile />}
              {/* {!isMobile && <Sidbarup />} */}
            </nav>
            <br />
            {/* <Button
              className='accent-tab accent-tabPost absolute right-4 -translate-y-[72px] bg-main-accent text-lg custom-button4 hover:bg-gray-100 dark:hover:bg-gray-700 outline-none transition xs:translate-y-0 xl:w-11/12'
              onClick={openModal}
            >
              <CustomIcon className='FlagIconfdsghsh block h-9 w-9 xl:hidden' iconName='FeatherIcon' />
              <HeroIcon className='h-6 w-6 hidden xl:block' iconName='FlagIcon' />
              <p className='hidden xl:block'>Post</p>
            </Button> */}
            <Button
  className='accent-tab absolute right-4 -translate-y-[72px] bg-main-accent text-lg font-bold text-white
  outline-none transition hover:brightness-90 active:brightness-75 xs:static xs:translate-y-0
  xs:hover:bg-main-accent/90 xs:active:bg-main-accent/75 xl:hidden'
  onClick={openModal}
>
  <CustomIcon
    className='block h-6 w-6'
    iconName='FeatherIcon'
  />
  <p className='hidden xl:block'>Tweet</p>
</Button>

          </div>
        </section>
      </div>
    </header>
  );
}
      
