import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu } from '@headlessui/react';
import cn from 'clsx';
import { useAuth } from '@lib/context/auth-context';
import { useModal } from '@lib/hooks/useModal';
import { Modal } from '@components/modal/modal';
import { ActionModal } from '@components/modal/action-modal';
import { Button } from '@components/ui/button';
import { HeroIcon } from '@components/ui/hero-icon';
import { UserAvatar } from '@components/user/user-avatar';
import { UserName } from '@components/user/user-name';
import { UserUsername } from '@components/user/user-username';
import { useRouter } from 'next/router';
import { useWindow } from '@lib/context/window-context';
import { LoginMain } from '../login/Switch-accounts';
import { MainHeader } from '@components/home/main-header';

export function More(): JSX.Element {
  const { user, signOut } = useAuth();
  const { open, openModal, closeModal } = useModal();
  const router = useRouter();
  const { isMobile } = useWindow();
  const { name, username, verified, photoURL } = user as User;

  const [isReportModalOpen, setReportModalOpen] = useState(false);
  const [isSwitchModalOpen, setSwitchModalOpen] = useState(false);
  const [reportText, setReportText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [whoCanSpeak, setWhoCanSpeak] = useState('Only people you invite to speak');
  const [isScheduling, setIsScheduling] = useState(false);
  const [isReportsModalOpen, setReportsModalOpen] = useState(false); // New state for the reports modal

  const openReportModal = () => setReportModalOpen(true);
  const openSwitchModal = () => setSwitchModalOpen(true);
  const toggleScheduling = () => setIsScheduling((prev) => !prev);

  const closeReportModal = () => {
    setReportModalOpen(false);
    setReportText('');
    setUploadedFiles([]);
    setIsLoading(false);
  };

  const closeSwitchModal = () => {
    setSwitchModalOpen(false);
  };

  const closeReportsModal = () => {
    setReportsModalOpen(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setUploadedFiles(Array.from(files));
    }
  };

  const handleSendReport = async () => {
    if (!reportText && uploadedFiles.length === 0) return;

    setIsLoading(true);
    setTimeout(async () => {
      try {
        console.log('Report sent:', reportText, uploadedFiles);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Error sending report:', error);
      } finally {
        setIsLoading(false);
        closeReportModal();
      }
    }, 1500);
  };

  const handleSens = async () => {
    if (!reportText && uploadedFiles.length === 0) return;

    setIsLoading(true);
    setTimeout(async () => {
      try {
        console.log('Report sent:', reportText, uploadedFiles);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Error sending report:', error);
      } finally {
        setIsLoading(false);
        closeSwitchModal();
      }
    }, 1500);
  };

  const handleDisplaySettingsClick = () => {
    router.push('/HelpCenter/about');
  };
  const handleDisplaySettingsClickinvestors = () => {
    router.push('/HelpCenter/investors');
  };
  const handleDisplayFeedbackClickCogIcon = () => {
    router.push('Feedback')
  }

  const handleStartNowClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setReportsModalOpen(true); // Open the reports modal after loading
    }, 2000);
  };

  return (
    <>
      <Modal
        modalClassName="max-w-xs bg-main-background w-full h-[220px] p-8 rounded-[10px]"
        open={isSwitchModalOpen}
        closeModal={closeSwitchModal}
      >
        <div className="report-modal">
        <MainHeader title="Developers" />
        <span className='informationAccountSettingsUScss'>Developers: </span>
        <br />
        <span className='informationAccountSettingsUScss'>Orel revivo</span>
        </div>
      </Modal>

      <Menu className="relative" as="section">
        {({ open }): JSX.Element => (
          <>
            <Menu.Button
            >
              <div className="custom-underline cursor-pointer flex gap-3 truncate">
              More <HeroIcon
                className="customdggse hidden h-6 w-6 xl:block"
                iconName="EllipsisHorizontalIcon"
              />
              </div>
            </Menu.Button>
            <AnimatePresence>
              {open && (
                <Menu.Items
                  className="borderbox4335 menu-container absolute w-60 xl:w-[200px]"
                  as={motion.div}
                  static
                >
                  <Menu.Item>
                    {({ active }): JSX.Element => (
                      <Button
                        className={cn(
                          'gagagw2 gagagw btnH1242 flex w-full gap-3 rounded-md p-4',
                          active && 'bg-main-sidebar-background'
                        )}
                        onClick={handleDisplaySettingsClick}
                      >
                        <p className="btnH12P222222">About</p>
                      </Button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }): JSX.Element => (
                      <Button
                        className={cn(
                          ' gagagw btnH1242 flex w-full gap-3 rounded-md p-4',
                          active && 'bg-main-sidebar-background'
                        )}
                        onClick={handleDisplaySettingsClickinvestors}
                      >
                        <p className="btnH12P222222">Tweetbook for Business</p>
                      </Button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }): JSX.Element => (
                      <Button
                        className={cn(
                          'gagagw btnH12 ReportaProblem flex w-full gap-3 rounded-md p-4',
                          active && 'bg-main-sidebar-background'
                        )}
                        onClick={openSwitchModal}
                      >
                        <p className="btnH12P222222">Developers</p>
                      </Button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              )}
            </AnimatePresence>
          </>
        )}
      </Menu>
    </>
  );
}
