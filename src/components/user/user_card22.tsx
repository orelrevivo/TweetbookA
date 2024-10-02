import { useState } from 'react';
import { UserAvatar } from '@components/user/user-avatar2';
import { UserName } from './user-name2';
import { UserUsername } from './user-username2';
import type { User } from '@lib/types/user';
import { ReportModal } from '@components/modal/ReportModal'; // Ensure the import path is correct
import { Popover } from '@headlessui/react';
import { HeroIcon } from '@components/ui/hero-icon';
import cn from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu } from '@headlessui/react';
import { useAuth } from '@lib/context/auth-context';
import { useModal } from '@lib/hooks/useModal';
import { Modal } from '@components/modal/modal';
import { ActionModal } from '@components/modal/action-modal';
import { Button } from '@components/ui/button';
import { useRouter } from 'next/router';
import { useWindow } from '@lib/context/window-context';
import { LoginMain } from '../login/Switch-accounts';
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
  const [isSwitchModalOpen, setSwitchModalOpen] = useState(false);
  const openSwitchModal = () => setSwitchModalOpen(true);
  const closeSwitchModal = () => {
    setSwitchModalOpen(false);
  };
  return (
   <div>
     <Button
    className={cn(
      'custom_dgsgedslgje custom-button accent-tab hover-card block w-full',
    )}
    onClick={openSwitchModal}
  >
    <p className="btnH12P">
      <HeroIcon iconName="ArrowsRightLeftIcon" />
    </p>
    <p className="fafwsfwfdsfw">Switch accounts</p>
  </Button>
    <div className='relative accent-tab34 hover-animation grid grid-cols-[auto,1fr] gap-3 px-4 py-3'>
      <UserAvatar src={photoURL} alt={name} username={username} />
      <div className='flex flex-col gap-1 truncate xs:overflow-visible'>
        <div className='flex flex-col justify-center truncate xs:overflow-visible xs:whitespace-normal'>
          <UserName
            className='-mb-1'
            name={name}
            username={username}
            verified={verified}
          />
          <p>@{username}</p>
                      <Modal
        modalClassName="max-w-xs bg-main-background w-full h-[120px] p-8 rounded-[10px]"
        open={isSwitchModalOpen}
        closeModal={closeSwitchModal}
      >
        <div className="report-modal">
          <LoginMain />
        </div>
      </Modal>

        </div>
      </div>
    </div>
   </div>
  );
}
