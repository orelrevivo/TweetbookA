import Link from 'next/link';
import { useAuth } from '@lib/context/auth-context';
import { useModal } from '@lib/hooks/useModal';
import { Button } from '@components/ui/button';
import { UserAvatar } from '@components/user/user-avatar';
import { NextImage } from '@components/ui/next-image';
import { UserName } from '@components/user/user-name';
import { UserUsername } from '@components/user/user-username';
import { MainHeader } from '@components/home/main-header';
import { MobileSidebarLink } from '@components/sidebar/mobile-sidebar-link';
import { HeroIcon } from '@components/ui/hero-icon';
import { Modal } from './modal';
import { ActionModal } from './action-modal';
import { DisplayModal } from './display-modal';
import type { NavLink } from '@components/sidebar/sidebar';
import type { User } from '@lib/types/user';
import cn from 'clsx';
import { useRouter } from 'next/router';

export type MobileNavLink = Omit<NavLink, 'canBeHidden'>;

const topNavLinks: Readonly<MobileNavLink[]> = [
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
  },
  {
    href: '/bookmarks',
    linkName: 'Bookmarks',
    iconName: 'BookmarkIcon',
  },
  {
    href: '/premium',
    linkName: 'Premium',
    iconName: 'StarIcon',
    disabled: false,
  },
];

const bottomNavLinks: Readonly<MobileNavLink[]> = [
  {
    href: '/Settings',
    linkName: 'Settings and privacy',
    iconName: 'Cog8ToothIcon',
    disabled: false
  },
  {
    href: '/HelpCenter',
    linkName: 'Help center',
    iconName: 'QuestionMarkCircleIcon',
    disabled: false
  }
];

type Stats = [string, string, number];

type MobileSidebarModalProps = Pick<
  User,
  | 'name'
  | 'username'
  | 'verified'
  | 'photoURL'
  | 'following'
  | 'followers'
  | 'coverPhotoURL'
> & {
  closeModal: () => void;
};

export function MobileSidebarModal({
  name,
  username,
  verified,
  photoURL,
  following,
  followers,
  coverPhotoURL,
  closeModal
}: MobileSidebarModalProps): JSX.Element {
  const { signOut } = useAuth();

  const {
    open: displayOpen,
    openModal: displayOpenModal,
    closeModal: displayCloseModal
  } = useModal();

  const {
    open: logOutOpen,
    openModal: logOutOpenModal,
    closeModal: logOutCloseModal
  } = useModal();

  const allStats: Readonly<Stats[]> = [
    ['following', 'Following', following.length],
    ['followers', 'Followers', followers.length]
  ];

  const userLink = `/user/${username}`;
  const router = useRouter();

  // Function to handle button navigation
  const handleNavigation = (page: string) => {
    router.push(page);
  };

  return (
    <>
      <Modal
        className='items-center justify-center xs:flex'
        modalClassName='max-w-xl bg-main-background w-full p-8 rounded-2xl hover-animation'
        open={displayOpen}
        closeModal={displayCloseModal}
      >
        <DisplayModal closeModal={displayCloseModal} />
      </Modal>
      <Modal
        modalClassName='max-w-xs bg-main-background w-full p-8 rounded-2xl'
        open={logOutOpen}
        closeModal={logOutCloseModal}
      >
        <ActionModal
          focusOnMainBtn
          title='Log out of Tweetbook?'
          description='You can always log back in at any time. If you just want to switch accounts, you can do that by adding an existing account.'
          mainBtnLabel='Log out'
          action={signOut}
          closeModal={logOutCloseModal}
        />
      </Modal>
      <Button
          className="dfsfdssedfssedsfes dark-bg-tab group relative border border-light-line-reply p-2
                                 hover:bg-light-primary/10 active:bg-light-primary/20 dark:border-light-secondary 
                                 dark:hover:bg-dark-primary/10 dark:active:bg-dark-primary/20 w-[30px]"
          style={{ borderRadius: '0' }} // Setting border-radius to zero
          onClick={() => handleNavigation('/account/switch')}
              >
                <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{
            width: '14px',
            height: '14px',
            fill: 'rgb(15, 20, 25)',
            marginRight: '10px', // Adds space between icon and text
          }}
        >
          <g>
          <path d="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7z"></path>
          </g>
        </svg>
              </Button>
      <section className='dfjosefosufefe mt-0.5 flex flex-col gap-2 '>
        <div className='mb-8 ml-2 -mt-4'>
          <UserAvatar
            className='dfjosefosufefeUserAvatar absolute -translate-y-1/2 bg-main-background p-1 hover:brightness-100
                       [&>figure>span]:[transition:200ms]
                       [&:hover>figure>span]:brightness-75'
            username={username}
            src={photoURL}
            alt={name}
            size={40}
          />
        </div>
        <div className='dfjosefosufefeUserAvatar2 flex flex-col'>
            <UserName
              name={name}
              username={username}
              verified={verified}
              className='-mb-1'
            />
            <UserUsername username={username} />
          </div>
          <div className='dfjosefosufefeUserAvatar2 text-secondary flex gap-4'>
            {allStats.map(([id, label, stat]) => (
              <Link href={`${userLink}/${id}`} key={id}>
                <a
                  className='hover-animation flex h-4 items-center gap-1 border-b border-b-transparent 
                             outline-none hover:border-b-light-primary focus-visible:border-b-light-primary
                             dark:hover:border-b-dark-primary dark:focus-visible:border-b-dark-primary'
                >
                  <p className='font-bold'>{stat}</p>
                  <p className='text-light-secondary dark:text-dark-secondary'>
                    {label}
                  </p>
                </a>
              </Link>
            ))}
          </div>
        <div className=''>
          
          
          <i className='h-0.5 bg-light-line-reply dark:bg-dark-line-reply' />
          <nav className='ghffhjfthfghftt flex flex-col'>
            <MobileSidebarLink
              href={`/user/${username}`}
              iconName='UserIcon'
              linkName='Profile'
            />
            {topNavLinks.map((linkData) => (
              <MobileSidebarLink {...linkData} key={linkData.href} />
            ))}
          </nav>
          {/* <i className='h-0.5 bg-light-line-reply dark:bg-dark-line-reply' />
          <nav className='flex flex-col'>
            <Button
              className={cn(
                ` accent-tab accent-bg-tab flex items-center font-bold 
                custom-button4322 hover:bg-gray-100 dark:hover:bg-gray-700`,
              )}
              onClick={displayOpenModal}
            >
              <HeroIcon className='dfoisehfuisefe h-5 w-5' iconName='PaintBrushIcon' />
              Display
            </Button>
            {bottomNavLinks.map((linkData) => (
              <MobileSidebarLink bottom {...linkData} key={linkData.href} />
            ))}
              <Button
              className={cn(
                ` accent-tab accent-bg-tab flex items-center font-bold 
                custom-button4322 hover:bg-gray-100 dark:hover:bg-gray-700`,
              )}
              onClick={logOutOpenModal}
            >
              <HeroIcon
                className='dfoisehfuisefe h-5 w-5'
                iconName='ArrowRightOnRectangleIcon'
              />
              Log out
            </Button>
          </nav> */}
        </div>
      </section>
    </>
  );
}
