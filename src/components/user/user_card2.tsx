import { useState } from 'react';
import { UserAvatar } from '@components/user/user-avatar2';
import { UserName } from './user-name2';
import { UserUsername } from './user-username2';
import type { User } from '@lib/types/user';
import { ReportModal } from '@components/modal/ReportModal'; // Ensure the import path is correct
import { Popover } from '@headlessui/react';
import { HeroIcon } from '@components/ui/hero-icon';
import cn from 'clsx';
import Link from 'next/link';

type UserCardProps = User & {
  // No need for onClick handler if using navigation
};

export function UserCard({ id, bio, name, username, verified, photoURL }: UserCardProps): JSX.Element {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const handleReportClick = () => {
    setIsReportModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsReportModalOpen(false);
  };

  return (
    <Link href={`/user/${username}`}>
        <a
        className=''
      >
    <div className='pogiuijsepiougjoudgie relative accent-tab34 hover-animation grid grid-cols-[auto,1fr] gap-3 px-4 py-3'>
      <UserAvatar src={photoURL} alt={name} username={username} className='dojfgoawfwfwsfw'/>
      <div className='flex flex-col gap-1 truncate xs:overflow-visible'>
        <div className='fawfasfawadsfawfasw flex flex-col justify-center truncate xs:overflow-visible xs:whitespace-normal'>
          <UserName
            className='fafwfaswfawasfawf -mb-1'
            name={name}
            username={username}
            verified={verified}
          />
          <p>{id}</p>
          {bio && <p className='whitespace-normal'>{bio}</p>}
        </div>
      </div>
      {/* Report Button */}
      {/* <div className='absolute top-2 right-2'>
        <Popover>
          <Popover.Button
            onClick={handleReportClick}
            className={cn(
              `main-tabdsgasgaweg group p-2 
               hover:bg-accent-blue/10 focus-visible:bg-accent-blue/10
               focus-visible:!ring-accent-blue/80 active:bg-accent-blue/20`,
            )}
          >
            <div className='relative'>
              <HeroIcon
                className='h-5 w-5 text-light-secondary group-hover:text-accent-blue
                           group-focus-visible:text-accent-blue dark:text-dark-secondary/80'
                iconName='EllipsisHorizontalIcon'
              />
            </div>
          </Popover.Button>
        </Popover>
        {isReportModalOpen && <ReportModal onClose={handleCloseModal} userId={id} />}
      </div> */}
    </div>
    </a>
    </Link>
  );
}
