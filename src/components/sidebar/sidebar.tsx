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
      

// import Link from 'next/link';
// import { useAuth } from '@lib/context/auth-context';
// import { useWindow } from '@lib/context/window-context';
// import { useModal } from '@lib/hooks/useModal';
// import { Modal } from '@components/modal/modal';
// import { Input } from '@components/input/input';
// import { CustomIcon } from '@components/ui/custom-icon';
// import { Button } from '@components/ui/button';
// import { SidebarLink } from './sidebar-link';
// import { SidebarProfile } from './sidebar-profile';
// import { HeroIcon, type IconName } from '@components/ui/hero-icon';
// import { SearchBar } from '../aside/search-bar';
// import { MainHeader } from '@components/home/main_header';

// export type NavLink = {
//   href: string;
//   linkName: string;
//   iconName: IconName;
//   disabled?: boolean;
//   canBeHidden?: boolean;
// };

// const navLinks: Readonly<NavLink[]> = [
//   {
//     href: '/home',
//     linkName: 'ForYou',
//     iconName: 'HomeIcon'
//   },
//   {
//     href: '/explore',
//     linkName: 'Explore',
//     iconName: 'MagnifyingGlassIcon',
//     disabled: false,
//   },
//   {
//     href: '/messages',
//     linkName: 'Messages',
//     iconName: 'EnvelopeIcon',
//     disabled: false,
//   },
//   {
//     href: '/Communities',
//     linkName: 'Communities',
//     iconName: 'UsersIcon',
//     disabled: false,
//   },
//   {
//     href: '/notifications',
//     linkName: 'Notifications',
//     iconName: 'BellIcon',
//     disabled: false
//   },
//   {
//     href: '/video',
//     linkName: 'ClipStream',
//     iconName: 'FireIcon',
//     canBeHidden: true
//   },
//   {
//     href: '/bookmarks',
//     linkName: 'Bookmarks',
//     iconName: 'BookmarkIcon',
//     canBeHidden: true
//   },
//   {
//     href: '/premium',
//     linkName: 'Premium',
//     iconName: 'StarIcon',
//     disabled: false,
//     canBeHidden: true
//   },
// ];

// export function Sidebar(): JSX.Element {
//   const { user } = useAuth();
//   const { isMobile } = useWindow();
//   const { open, openModal, closeModal } = useModal();
//   const username = user?.username as string;
//   const handleOpenModal = () => {
//     const originalUrl = window.location.href; // Save the current URL
//     window.history.pushState(null, '', ''); // Update URL without reloading
//     openModal();
  
//     const handlePopState = () => {
//       if (open) {
//         closeModal();
//         window.history.pushState(null, '', '/home'); // Change to '/home' when closing the modal
//       }
//     };
  
//     window.addEventListener('popstate', handlePopState);
//     return () => {
//       window.removeEventListener('popstate', handlePopState);
//     };
//   };
  

//   return (
//     <header
//       id='sidebar'
//       className='flex w-0 shrink-0 transition-opacity duration-200 xs:w-20 md:w-24 lg:max-w-none xl:-mr-4 xl:w-full xl:max-w-xs xl:justify-end'
//     >
//             <div className='fixed-top-bar3 fixed top-0 left-0 right-0 z-10 h-1 bg-main-background border-light-border dark:border-dark-border border-1 xs:border'>
//             <MainHeader
//         useMobileSidebar
//         title='Home'
//         className='flex items-center justify-between'
//       >
//       </MainHeader>
//         <div className="flex justify-center items-center relative">
//         </div>
//       </div>
//       <Modal
//         className='flex items-start justify-center'
//         modalClassName='bg-main-background rounded-2xl max-w-xl w-full mt-8 overflow-hidden'
//         open={open}
//         closeModal={closeModal}
//       >
//         <Input modal closeModal={closeModal} />
//       </Modal>
//       <div
//         className='fixed bottom-0 z-10 flex w-full flex-col justify-between border-t border-light-border 
//                    bg-main-background py-0 dark:border-dark-border xs:top-0 xs:h-full xs:w-auto xs:border-0 
//                    xs:bg-transparent xs:px-2 xs:py-3 xs:pt-2 md:px-4 xl:w-72'
//       >
//         <section className='fgdrgdfgdfgdgfgr flex flex-col justify-center gap-2 xs:items-center xl:items-stretch'>
//           {/* <h1 className='hidden xs:flex'>
//             <Link href='/home'>
//               <a
//                 className='custom-button flex items-center justify-center gap-4 self-start p-2 text-xl transition 
//              accent-tab hover-card
//              dark:group-focus-visible:ring-white xs:p-3 xl:pr-5'
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
//                 <g><g clip-path="url(#18-clip0_2592_269)" clip-rule="evenodd"><path d="M18 4.1H6c-1.05 0-1.9.85-1.9 1.9v12c0 1.05.85 1.9 1.9 1.9h12c1.05 0 1.9-.85 1.9-1.9V6c0-1.05-.85-1.9-1.9-1.9zM6 2h12c2.21 0 4 1.79 4 4v12c0 2.21-1.79 4-4 4H6c-2.21 0-4-1.79-4-4V6c0-2.21 1.79-4 4-4z"></path><path d="M6.68 17.8l8.108-11.58h2.532L9.21 17.8H6.68z"></path></g><defs><clipPath id="18-clip0_2592_269"><rect height="20" rx="1" width="20" x="2" y="2"></rect></clipPath></defs></g>                </svg>
//               </a>
//             </Link>
//           </h1>
//          */}
//           <nav className='flex items-center justify-around xs:flex-col xs:justify-center xl:block'>
//             {navLinks.map(({ ...linkData }) => (
//               <SidebarLink {...linkData} key={linkData.href} />
//             ))}
//             <SidebarLink
//               href={`/user/${username}`}
//               username={username}
//               linkName='Profile'
//               iconName='UserIcon'
//             />
//           </nav>
//           <Button
//           className='accent-tab absolute right-4 -translate-y-[72px] bg-main-accent text-lg font-bold text-white
//           outline-none transition hover:brightness-90 active:brightness-75 xs:static xs:translate-y-0
//            xs:hover:bg-main-accent/90 xs:active:bg-main-accent/75 xl:hidden'
//            onClick={openModal}
//           >
//            <CustomIcon
//            className='block h-6 w-6'
//             iconName='FeatherIcon'
//            />
//            <p className='hidden xl:block'>Tweet</p>
//           </Button>
//           {/* <Button
//             className='accent-tab absolute right-4 -translate-y-[72px] bg-main-accent text-lg font-bold text-white outline-none transition hover:brightness-90 active:brightness-75 xs:static xs:translate-y-0 xs:hover:bg-main-accent/90 xs:active:bg-main-accent/75 xl:w-11/12 h-[45px]'
//             onClick={handleOpenModal}
//           >
//             <HeroIcon className='block h-6 w-6 xl:hidden' iconName='PlusIcon' />
//             <p className='Posthidden hidden xl:block'>Post</p>
//           </Button> */}
//         </section>
//         {!isMobile && <SidebarProfile />}
//       </div>
//     </header>
//   );
// }


// import React, { useState } from 'react';
// import { useRouter } from 'next/router';
// import { Button } from '@components/ui/button';

// export function Sidebar(): JSX.Element {
//   const router = useRouter();

//   // State to manage active button and its corresponding SVG
//   const [activeButton, setActiveButton] = useState<string>('');

//   // Function to handle button navigation and toggle icon
//   const handleNavigation = (page: string, buttonName: string) => {
//     router.push(page);
//     setActiveButton(buttonName);
//   };

//   // SVG icons mapping with black icons
//   const icons = {
//     Home: activeButton === 'Home' ? (
//       <svg className="ProfileTEctHomesvg2" viewBox="0 0 24 24" aria-hidden="true" style={{ width: '30px', height: '30px', fill: 'black', marginRight: '10px' }}>
//         <path d="M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913H9.14c.51 0 .929-.41.929-.913v-7.075h3.909v7.075c0 .502.417.913.928.913h6.165c.511 0 .929-.41.929-.913V7.904c0-.301-.158-.584-.408-.758z"></path>     
//       </svg>
//     ) : (
//       <svg className="ProfileTEctHomesvg2" viewBox="0 0 24 24" aria-hidden="true" style={{ width: '30px', height: '30px', fill: 'black', marginRight: '10px' }}>
// <path d="M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913h6.638c.511 0 .929-.41.929-.913v-7.075h3.008v7.075c0 .502.418.913.929.913h6.639c.51 0 .928-.41.928-.913V7.904c0-.301-.158-.584-.408-.758zM20 20l-4.5.01.011-7.097c0-.502-.418-.913-.928-.913H9.44c-.511 0-.929.41-.929.913L8.5 20H4V8.773l8.011-5.342L20 8.764z"></path>
//       </svg>
//     ),
//     Explore: activeButton === 'Explore' ? (
//       <svg className="ProfileTEctHomesvg2" viewBox="0 0 24 24" aria-hidden="true" style={{ width: '30px', height: '30px', fill: 'black', marginRight: '10px' }}>
//         <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"></path>
//       </svg>
//     ) : (
//       <svg className="ProfileTEctHomesvg2" viewBox="0 0 24 24" aria-hidden="true" style={{ width: '30px', height: '30px', fill: 'black', marginRight: '10px' }}>
// <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"></path>
//       </svg>
//     ),
//     notifications: activeButton === 'notifications' ? (
//       <svg className="ProfileTEctHomesvg2" viewBox="0 0 24 24" aria-hidden="true" style={{ width: '30px', height: '30px', fill: 'black', marginRight: '10px' }}>
//         <path d="M11.996 2c-4.062 0-7.49 3.021-7.999 7.051L2.866 18H7.1c.463 2.282 2.481 4 4.9 4s4.437-1.718 4.9-4h4.236l-1.143-8.958C19.48 5.017 16.054 2 11.996 2zM9.171 18h5.658c-.412 1.165-1.523 2-2.829 2s-2.417-.835-2.829-2z"></path>
//       </svg>
//     ) : (
//       <svg className="ProfileTEctHomesvg2" viewBox="0 0 24 24" aria-hidden="true" style={{ width: '30px', height: '30px', fill: 'black', marginRight: '10px' }}>
//         <path d="M19.993 9.042C19.48 5.017 16.054 2 11.996 2s-7.49 3.021-7.999 7.051L2.866 18H7.1c.463 2.282 2.481 4 4.9 4s4.437-1.718 4.9-4h4.236l-1.143-8.958zM12 20c-1.306 0-2.417-.835-2.829-2h5.658c-.412 1.165-1.523 2-2.829 2zm-6.866-4l.847-6.698C6.364 6.272 8.941 4 11.996 4s5.627 2.268 6.013 5.295L18.864 16H5.134z"></path>
//       </svg>
//     ),
//     messages: activeButton === 'messages' ? (
//       <svg className="ProfileTEctHomesvg2" viewBox="0 0 24 24" aria-hidden="true" style={{ width: '30px', height: '30px', fill: 'black', marginRight: '10px' }}>
// <path d="M1.998 4.499c0-.828.671-1.499 1.5-1.499h17c.828 0 1.5.671 1.5 1.499v2.858l-10 4.545-10-4.547V4.499zm0 5.053V19.5c0 .828.671 1.5 1.5 1.5h17c.828 0 1.5-.672 1.5-1.5V9.554l-10 4.545-10-4.547z"></path>
//       </svg>
//     ) : (
//       <svg className="ProfileTEctHomesvg2" viewBox="0 0 24 24" aria-hidden="true" style={{ width: '30px', height: '30px', fill: 'black', marginRight: '10px' }}>
// <path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5c-.276 0-.5.224-.5.5v2.764l8 3.638 8-3.636V5.5c0-.276-.224-.5-.5-.5h-15zm15.5 5.463l-8 3.636-8-3.638V18.5c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-8.037z"></path>
//       </svg>
//     ),
//     bookmarks: activeButton === 'bookmarks' ? (
//       <svg className="ProfileTEctHomesvg2" viewBox="0 0 24 24" aria-hidden="true" style={{ width: '30px', height: '30px', fill: 'black', marginRight: '10px' }}>
//         <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5z"></path>
//       </svg>
//     ) : (
//       <svg className="ProfileTEctHomesvg2" viewBox="0 0 24 24" aria-hidden="true" style={{ width: '30px', height: '30px', fill: 'black', marginRight: '10px' }}>
// <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z"></path>
//       </svg>
//     ),
//     communities: activeButton === 'communities' ? (
//       <svg className="ProfileTEctHomesvg2" viewBox="0 0 24 24" aria-hidden="true" style={{ width: '30px', height: '30px', fill: 'black', marginRight: '10px' }}>
// <path d="M7.471 21H.472l.029-1.027c.184-6.618 3.736-8.977 7-8.977.963 0 1.95.212 2.87.672-1.608 1.732-2.762 4.389-2.869 8.248l-.03 1.083zM9.616 9.27C10.452 8.63 11 7.632 11 6.5 11 4.57 9.433 3 7.5 3S4 4.57 4 6.5c0 1.132.548 2.13 1.384 2.77.589.451 1.317.73 2.116.73s1.527-.279 2.116-.73zm6.884 1.726c-3.264 0-6.816 2.358-7 8.977L9.471 21h14.057l-.029-1.027c-.184-6.618-3.736-8.977-7-8.977zm2.116-1.726C19.452 8.63 20 7.632 20 6.5 20 4.57 18.433 3 16.5 3S13 4.57 13 6.5c0 1.132.548 2.13 1.384 2.77.589.451 1.317.73 2.116.73s1.527-.279 2.116-.73z"></path>      </svg>
//     ) : (
//       <svg className="ProfileTEctHomesvg2" viewBox="0 0 24 24" aria-hidden="true" style={{ width: '30px', height: '30px', fill: 'black', marginRight: '10px' }}>
// <path d="M7.501 19.917L7.471 21H.472l.029-1.027c.184-6.618 3.736-8.977 7-8.977.963 0 1.95.212 2.87.672-.444.478-.851 1.03-1.212 1.656-.507-.204-1.054-.329-1.658-.329-2.767 0-4.57 2.223-4.938 6.004H7.56c-.023.302-.05.599-.059.917zm15.998.056L23.528 21H9.472l.029-1.027c.184-6.618 3.736-8.977 7-8.977s6.816 2.358 7 8.977zM21.437 19c-.367-3.781-2.17-6.004-4.938-6.004s-4.57 2.223-4.938 6.004h9.875zm-4.938-9c-.799 0-1.527-.279-2.116-.73-.836-.64-1.384-1.638-1.384-2.77 0-1.93 1.567-3.5 3.5-3.5s3.5 1.57 3.5 3.5c0 1.132-.548 2.13-1.384 2.77-.589.451-1.317.73-2.116.73zm-1.5-3.5c0 .827.673 1.5 1.5 1.5s1.5-.673 1.5-1.5-.673-1.5-1.5-1.5-1.5.673-1.5 1.5zM7.5 3C9.433 3 11 4.57 11 6.5S9.433 10 7.5 10 4 8.43 4 6.5 5.567 3 7.5 3zm0 2C6.673 5 6 5.673 6 6.5S6.673 8 7.5 8 9 7.327 9 6.5 8.327 5 7.5 5z"></path>
//       </svg>
//     ),
//     premium: activeButton === 'premium' ? (
//       <svg className="ProfileTEctHomesvg2" viewBox="0 0 24 24" aria-hidden="true" style={{ width: '30px', height: '30px', fill: 'black', marginRight: '10px' }}>
// <path d="M7.323 2h11.443l-3 5h6.648L6.586 22.83 7.847 14H2.523l4.8-12zm1.354 2l-3.2 8h4.676l-.739 5.17L17.586 9h-5.352l3-5H8.677z"></path>
//   </svg>
//     ) : (
//       <svg className="ProfileTEctHomesvg2" viewBox="0 0 24 24" aria-hidden="true" style={{ width: '30px', height: '30px', fill: 'black', marginRight: '10px' }}>
//         <path d="M7.323 2h11.443l-3 5h6.648L6.586 22.83 7.847 14H2.523l4.8-12zm1.354 2l-3.2 8h4.676l-.739 5.17L17.586 9h-5.352l3-5H8.677z"></path>
//       </svg>
//     ),
//     // Add similar SVG icon toggling logic for the rest of the buttons below
//     // Notifications, Messages, Bookmarks, Communities, and other buttons
//   };

//   return (
//     <header id="sidebar" className="flex w-0 shrink-0 transition-opacity duration-200 xs:w-20 md:w-24 lg:max-w-none xl:-mr-4 xl:w-full xl:max-w-xs xl:justify-end">
//       <div className="fixed-top-bar3 fixed top-0 left-0 right-0 z-10 h-1 bg-main-background border-light-border dark:border-dark-border border-1 xs:border">
//         <div className="flex justify-center items-center relative">
//           <Button className="HomeButton rounded-md hover:bg-gray-50 dark:hover:bg-gray-700" style={{ borderRadius: '0' }} onClick={() => handleNavigation('/home', 'Home')}>
//             <span className="ProfileTEctHome">Home</span>
//             {icons.Home}
//           </Button>
//           <Button className="HomeButton2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700" style={{ borderRadius: '0' }} onClick={() => handleNavigation('/explore', 'Explore')}>
//             <span className="ProfileTEctHome">Explore</span>
//             {icons.Explore}
//           </Button>
//           <Button className="HomeButton3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700" style={{ borderRadius: '0' }} onClick={() => handleNavigation('/notifications', 'notifications')}>
//             <span className="ProfileTEctHome">Notifications</span>
//             {icons.notifications}
//           </Button>
//           <Button className="HomeButton4 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700" style={{ borderRadius: '0' }} onClick={() => handleNavigation('/messages', 'messages')}>
//             <span className="ProfileTEctHome">Messages</span>
//             {icons.messages}
//           </Button>
//           <Button className="HomeButton5 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700" style={{ borderRadius: '0' }} onClick={() => handleNavigation('/bookmarks', 'bookmarks')}>
//             <span className="ProfileTEctHome">Bookmarks</span>
//             {icons.bookmarks}
//           </Button>
//           <Button className="HomeButton6 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700" style={{ borderRadius: '0' }} onClick={() => handleNavigation('/Communities', 'communities')}>
//             <span className="ProfileTEctHome">Communities</span>
//             {icons.communities}
//           </Button>
//           <Button className="HomeButton7 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700" style={{ borderRadius: '0' }} onClick={() => handleNavigation('/premium', 'premium')}>
//             <span className="ProfileTEctHome">Premium</span>
//             {icons.premium}
//           </Button>
//           {/* Add similar buttons for Messages, Bookmarks, and other functionalities */}
//         </div>
//       </div>
//     </header>
//   );
// }

// export default Sidebar;
 