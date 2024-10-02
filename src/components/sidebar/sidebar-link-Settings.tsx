import { useRouter } from 'next/router';
import Link from 'next/link';
import cn from 'clsx';
import { preventBubbling } from '@lib/utils';
import { HeroIcon } from '@components/ui/hero-icon';
import type { NavLink } from './sidebar';

type SidebarLinkProps = NavLink & {
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

  return (
    <Link href={href}>
      <a
        className={cn(
          'group py-1 outline-none',
          canBeHidden ? 'hidden xs:flex' : 'flex',
          disabled && 'cursor-not-allowed'
        )}
        onClick={disabled ? preventBubbling() : undefined}
      >
        <div
          className={cn(
            `YouraccountSettings flex items-center justify-center gap-4 self-start p-2 text-xl 
             group-focus-visible:ring-2 group-focus-visible:ring-[#878a8c] 
             dark:group-hover:bg-dark-primary/10 dark:group-focus-visible:ring-white 
             xs:p-3 xl:pr-5`,
            isActive && 'font-bold'
          )}
        >
          <HeroIcon
            className={cn(
              'YouraccountSettingsclassName h-7 w-7',
              isActive &&
                ['Explore', 'Lists'].includes(linkName) &&
                'stroke-white'
            )}
            iconName={iconName}
            solid={isActive}
          />
          <p className='YouraccountSettingsclassName2 hidden xl:block'>{linkName}</p>
        </div>
      </a>
    </Link>
  );
}
