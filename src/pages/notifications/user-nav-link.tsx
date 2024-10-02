import { useRouter } from 'next/router';
import Link from 'next/link';
import cn from 'clsx';

type UserNavLinkProps = {
  name: string;
  path: string;
};

export function UserNavLink({ name, path }: UserNavLinkProps): JSX.Element {
  const {
    asPath,
    query: { id }
  } = useRouter();

  const userPath = `/notifications/${path ? `/${path}` : ''}`;

  return (
    <Link href={userPath} scroll={false}>
      <a
        className='hover-animation main-tab dark-bg-tab flex flex-1 justify-center
                   hover:bg-light-primary/10 dark:hover:bg-dark-primary/10'
      >
        <div className='px-2 md:px-3.4'> {/* Adjust padding for consistent button width */}
          <p
            className={cn(
              'flex flex-col items-center justify-center whitespace-nowrap py-2 font-bold transition-colors duration-200', // Adjusted padding for height and vertical centering
              asPath === userPath
                ? 'text-light-primary dark:text-dark-primary'
                : 'gdsgsegseg text-light-secondary dark:text-dark-secondary'
            )}
          >
            {name}
            <i className={cn(
              'h-1 w-full rounded-full bg-main-accent transition duration-200',
              asPath === userPath ? 'opacity-100' : 'opacity-0'
            )} />
          </p>
        </div>
      </a>
    </Link>
  );
}