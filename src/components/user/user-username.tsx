import Link from 'next/link';
import cn from 'clsx';

type UserUsernameProps = {
  username: string;
  className?: string;
  disableLink?: boolean;
};

export function UserUsername({
  username,
  className,
  disableLink
}: UserUsernameProps): JSX.Element {
  return disableLink ? (
    <span
      className={cn(
        'truncate text-light-secondary dark:text-dark-secondary',
        className
      )}
      tabIndex={-1}
    >
      @{username}
    </span>
  ) : (
    <Link href={`/user/${username}`} passHref>
      <a
        className={cn(
          'truncate text-light-secondary dark:text-dark-secondary',
          className
        )}
        tabIndex={-1}
      >
        @{username}
      </a>
    </Link>
  );
}
