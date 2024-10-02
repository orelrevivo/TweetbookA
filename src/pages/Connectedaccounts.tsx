import { MainHeader } from '@components/home/main-header';
import { ReactElement, ReactNode } from 'react';
import { MainLayout } from '@components/layout/main-layout-S';
import { ProtectedLayout } from '@components/layout/common-layout-Settings';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@components/ui/button';
import cn from 'clsx';
import { useModal } from '@lib/hooks/useModal';
import { HeroIcon } from '@components/ui/hero-icon';
import { Modal } from '@components/modal/modal';
import { ActionModal } from '@components/modal/action-modal';
import { useAuth } from '@lib/context/auth-context';

const Connectedaccounts = () => {
  const { open, openModal, closeModal } = useModal();
  const { signOut } = useAuth();

  return (
    <div className='SettingsUScss notificationSettingsBoxSettingsUScss'>
      <MainHeader title="Connected accounts" />
       <div className='ViewandmanageSubscriptions22button2 bg-main-search-background px-4 py-2 transition bg-main-sidebar-background'>
          <span className='informationAccountSettingsUScss'>These are the social accounts you connected to your Tweetbook account to log in.</span>
          <br />
           <span className='informationAccountSettingsUScss'>You can disable access here.</span>
           </div>
           <br />
      <Button
        className="btnH12sfafw Logoutbtn1 flex w-full gap-3 rounded-md rounded-t-none p-4 ViewandmanageSubscriptions22button2 bg-main-search-background px-4 py-2 transition bg-main-sidebar-background"
        onClick={openModal}
      >
        <p className="btnH12P">
          <HeroIcon iconName="ArrowRightOnRectangleIcon" />
        </p>
        <p className="btnH12P">Disconnect account ??</p>
      </Button>

      <Modal
        modalClassName="max-w-xs bg-main-background w-full p-8 rounded-2xl"
        open={open}
        closeModal={closeModal}
      >
        <ActionModal
          focusOnMainBtn
          title="Log out of Tweetbook?"
          description="You can always log back in at any time. If you just want to switch accounts, you can do that by adding an existing account."
          mainBtnLabel="Log out"
          action={signOut}
          closeModal={closeModal}
        />
      </Modal>
    </div>
  );
};

export default Connectedaccounts;

// Layout wrapper
Connectedaccounts.getLayout = function getLayout(page: ReactElement): ReactNode {
  return (
    <ProtectedLayout>
      <MainLayout>{page}</MainLayout>
    </ProtectedLayout>
  );
};
