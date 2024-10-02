import Link from 'next/link';
import { useAuth } from '@lib/context/auth-context';
import { useWindow } from '@lib/context/window-context';
import { useModal } from '@lib/hooks/useModal';
import { Modal } from '@components/modal/modal';
import { Input } from '@components/input/input';
import { CustomIcon } from '@components/ui/custom-icon';
import { Button } from '@components/ui/button';
import { SidebarLink } from '../components/sidebar/sidebar-link-Settings';
import type { IconName } from '@components/ui/hero-icon';
import { HeroIcon } from '@components/ui/hero-icon';
import { useState, useEffect } from 'react'; // Import useEffect
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
    href: '/SubscriptionsY',
    linkName: 'Subscriptions',
    iconName: 'ArrowRightIcon'
  },
  {
    href: '/AdsSubscriptionsY',
    linkName: 'Ads revenue sharing',
    iconName: 'ArrowRightIcon',
  },
  {
    href: '/HelpCenter',
    linkName: 'Learn More',
    iconName: 'ArrowRightIcon',
  },
  {
    href: '/Settings',
    linkName: 'back?',
    iconName: 'ArrowRightIcon',
  }
];

export function MonetizationY(): JSX.Element {
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
          <div className="scrollable-container3 border-x-0 border-light-border pb-96 dark:border-dark-border xs:border-x">
            <nav className='displyrr flex items-center justify-around xs:flex-col xs:justify-center xl:block'>
              {navLinks.map(({ href, linkName, iconName, ...rest }) => (
                <SidebarLink key={href} href={href} linkName={linkName} iconName={iconName} {...rest} />
              ))}
            </nav>
            <br />
          </div>
        </section>
      </div>
    </header>
  );
}
export default MonetizationY;