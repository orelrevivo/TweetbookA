
import { useRouter } from 'next/router';
import Link from 'next/link';
import cn from 'clsx';
import { useState, useEffect } from 'react';
import { preventBubbling } from '@lib/utils';
import { HeroIcon } from '@components/ui/hero-icon';
import type { NavLink22324 } from './sidebar';

type SidebarLinkProps = NavLink22324 & {
  username?: string;
};

export function SidebarLink({
  href,
  username,
  iconName,
  linkName,
  disabled,
  canBeHidden
}: SidebarLinkProps): JSX.Element {
  const { asPath } = useRouter();
  const isActive = username ? asPath.includes(username) : asPath === href;

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Listener for online/offline status
    const handleOnline = () => setIsLoading(false);
    const handleOffline = () => setIsLoading(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup listeners on component unmount
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleClick = () => {
    if (disabled) {
      preventBubbling();
      return;
    }

    if (!navigator.onLine) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  };

  return (
    <Link href={href}>
      <a
        className={cn(
          'group py-1 outline-none',
          canBeHidden ? 'hidden xs:flex' : 'flex',
          disabled && 'cursor-not-allowed'
        )}
        onClick={handleClick}
      >
        <div
          className={cn(
          `custom-button4 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700`, // Full width, border radius
            isActive && 'dfsedsedsedsfse font-bold bg-gray-50 bg-gray-100',// dfsedsedsedsfse1
            'flex items-center' // Align icon and text vertically
          )}
        > 
   <HeroIcon
            className={cn(
              'h-7 w-7',
              isActive &&
                ['Explore', 'Lists'].includes(linkName) &&
                'stroke-white'
            )}
            iconName={iconName}
            solid={isActive}
          />
   

          <p className={cn(
            'ml-2', // Add margin next to the text
            isLoading && 'ml-10', // Increase margin when loading
            'hidden xl:block'
          )}>
            {linkName}
          </p>
          {isLoading && (
            <div className="spinner ml-10"></div> // Position spinner 10 pixels to the right of the text
          )}
        </div>
      </a>
    </Link>
  );
}