import Link from 'next/link';
import cn from 'clsx';
import { preventBubbling } from '@lib/utils';
import { HeroIcon } from '@components/ui/hero-icon';
import type { MobileNavLink } from '@components/modal/mobile-sidebar-modal';

type MobileSidebarLinkProps = MobileNavLink & {
  bottom?: boolean;
};

export function MobileSidebarLink({
  href,
  bottom,
  linkName,
  iconName,
  disabled
}: MobileSidebarLinkProps): JSX.Element {
  return (
    <Link href={href} key={href}>
      <a
        className={cn(
          ` accent-tab accent-bg-tab flex items-center font-bold 
         custom-button4322 hover:bg-gray-100 dark:hover:bg-gray-700`,
          bottom ? 'gap-2 p-1.5 text-base' : 'gap-4 p-2 text-xl',
          disabled && 'cursor-not-allowed'
        )}
        onClick={disabled ? preventBubbling() : undefined}
      >
        <HeroIcon
          className={bottom ? 'dfoisehfuisefe h-5 w-5' : 'h-7 w-7'}
          iconName={iconName}
        />
        {linkName}
      </a>
    </Link>
  );
}
