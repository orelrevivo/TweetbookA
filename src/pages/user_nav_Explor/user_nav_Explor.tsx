import { motion } from 'framer-motion';
import cn from 'clsx';
import { variants } from '@components/user/user-header';
import { UserNavLink } from './user_nav_link_Explor';

type UserNavProps = {
  follow?: boolean;
};

const allNavs = [
  [
    { name: 'For You', path: '' },
    { name: 'Trending', path: 'trending' },
    { name: 'News', path: 'News' },
    { name: 'Sports', path: 'Sports' },
    { name: 'Entertainment', path: 'Entertainment' },
  ]
] as const;

export function UserNav({ follow }: UserNavProps): JSX.Element {
  const userNav = allNavs[+!!follow];

  return (
    <motion.nav
      className={cn(
        `w-full md:w-[100%] hover-animation flex justify-between overflow-y-auto
         border-b border-light-border dark:border-dark-border`,
        follow && 'mt-1 mb-0.5'
      )}
      {...variants}
      exit={undefined}
    >
      {userNav.map(({ name, path }) => (
        <UserNavLink name={name} path={path} key={name} />
      ))}
    </motion.nav>
  );
}
