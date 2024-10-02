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
    const handleOnline = () => setIsLoading(false);
    const handleOffline = () => setIsLoading(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

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
            'custom-button44 rounded-md flex items-center transition-colors duration-200',
            isActive ? 'bg-red-50 text-red-500' : '', // Styles for active and hover states

          )}
        >
          <HeroIcon
            className={cn(
              'HeroIcon135 h-6 w-6 transition-transform duration-200 ease-in-out transform',
              isActive && ['Explore', 'Lists'].includes(linkName) && 'stroke-white',
              '' // Slightly scale the icon and rotate it on hover
            )}
            iconName={iconName}
            solid={isActive}
          />
          <p
            className={cn(
              'ml-2', // Add margin next to the text
              isLoading && 'ml-10', // Increase margin when loading
              'hidden xl:block'
            )}
          >
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
