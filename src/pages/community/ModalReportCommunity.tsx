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
import { MainHeader } from '@components/home/main-header';
import { useTheme } from '@lib/context/theme-context';

export function ThreeDotsMenu(): JSX.Element {
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
  const {
    asPath,
    query: { id }
  } = useRouter();

  const handleDisplaySettingsClick = () => {
    router.push('/HelpCenter/');
  };
  const handleDisplaySettingsClickinvestors = () => {
    router.push('/community/${id}/about');
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
  const { theme, changeTheme } = useTheme();

  return (
    <>
       <Modal
        modalClassName="bg-main-background w-[35%] h-[620px] p-8 rounded-[10px]"
        open={isSwitchModalOpen}
        closeModal={closeSwitchModal}
      >
        <div className='dgsegdggdge bg-main-background'>
          <h1 className='reportingWhat'>
            What type of issue are you reporting?
          </h1>
          <span className='reportingWhatspanText'>Why are we asking this?</span>

          <button className="custom-button2hyeh2dfege custom-button accent-tab hover-card block w-full" onClick={() => setReportsModalOpen(true)}>
            <div className='jbkcsadfilhdioud hover-animation flex h-0 w-10 items-center justify-center rounded-full'>
              <input
                className='peer absolute h-0 w-0 opacity-0'
                type='radio'
                name='theme'
              />
              <i
                className={cn(
                  `flex h-5 w-5 items-center justify-center rounded-full 
                  border-2 border-[#B9CAD3] text-white transition
                  duration-200 peer-checked:border-transparent
                  peer-checked:bg-main-accent peer-checked:inner:opacity-100`,
                )}
              >
                <HeroIcon
                  className='h-full w-full p-0.5 opacity-0 transition-opacity duration-200'
                  iconName='CheckIcon'
                />
              </i>
            </div>
            <span className='HateButton'>Hate</span>
            <br />
            <span className='HateSlurs'>
              <span className='dsgsgdgsdgsegsdg'>Slurs, Racist or sexist stereotypes, Dehumanization,</span>
              <br />
              <span className='dsgsgdgsdgsegsdg2'>Incitement of fear or discrimination, Hateful references,</span>
              <br />
              <span className='dsgsgdgsdgsegsdg3'>Hateful symbols & logos</span>
            </span>
          </button>

          <button className="custom-button2hyeh2dfege custom-button accent-tab hover-card block w-full" onClick={() => setReportsModalOpen(true)}>
            <div className='jbkcsadfilhdioud hover-animation flex h-0 w-10 items-center justify-center rounded-full'>
              <input
                className='peer absolute h-0 w-0 opacity-0'
                type='radio'
                name='theme'
              />
              <i
                className={cn(
                  `flex h-5 w-5 items-center justify-center rounded-full 
                  border-2 border-[#B9CAD3] text-white transition
                  duration-200 peer-checked:border-transparent
                  peer-checked:bg-main-accent peer-checked:inner:opacity-100`,
                )}
              >
                <HeroIcon
                  className='h-full w-full p-0.5 opacity-0 transition-opacity duration-200'
                  iconName='CheckIcon'
                />
              </i>
            </div>
            <span className='HateButton2'>Abuse & Harassment</span>
            <br />
            <span className='HateSlurs'>
              <span className='dsgsgdgsdgsegsdg24'>Insults, Unwanted Sexual Content & Graphic </span>
              <br />
              <span className='dsgsgdgsdgsegsdg245'>Objectification, Unwanted NSFW & Graphic Content,</span>
              <br />
              <span className='dsgsgdgsdgsegsdg32'>Violent Event Denial, Targeted Harassment and Inciting Harassment</span>
            </span>
          </button>

          <button className="custom-button2hyeh2dfege custom-button accent-tab hover-card block w-full" onClick={() => setReportsModalOpen(true)}>
          <div className='jbkcsadfilhdioud hover-animation flex h-0 w-10 items-center justify-center rounded-full'>
        <input
          className='peer absolute h-0 w-0 opacity-0'
          type='radio'
          name='theme'
        />
        <i
          className={cn(
            `flex h-5 w-5 items-center justify-center rounded-full 
             border-2 border-[#B9CAD3] text-white transition
             duration-200 peer-checked:border-transparent
             peer-checked:bg-main-accent peer-checked:inner:opacity-100`,
          )}
        >
          <HeroIcon
            className='h-full w-full p-0.5 opacity-0 transition-opacity duration-200'
            iconName='CheckIcon'
          />
        </i>
      </div>
            <span className='HateButton3'>Violent Speech</span>
            <br />
            <span className='HateSlurs'>
              <span className='dsgsgdgsdgsegsdg242'>Violent Threats, Wish of Harm, Glorification of Violence, </span>
              <br />
               <span className='dsgsgdgsdgsegsdg2452'>Incitement of Violence, Coded Incitement of Violence</span>
                </span>
          </button>
          <div className='fixed-top-bar3222 fixed top-0 left-0 right-0 z-10 h-1 bg-main-background'>
        <div className="flex justify-center items-center relative">
          <button className='ButtonNext'>Next</button>
        </div>
      </div>
        </div>
      </Modal>

      {/* New Reports Modal */}
      <Modal
        modalClassName="bg-main-background w-[35%] h-[620px] p-8 rounded-[10px]"
        open={isReportsModalOpen}
        closeModal={closeReportsModal}
      >
        <h1 className='reportingWhat'>Please provide details about your report</h1>
        <textarea
          className='w-full h-40 border rounded p-2'
          value={reportText}
          onChange={(e) => setReportText(e.target.value)}
          placeholder='Type your report here...'
        />
        <div className='mt-4'>
          <input type='file' onChange={handleFileUpload} multiple />
          <Button onClick={handleSendReport} disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Report'}
          </Button>
        </div>
      </Modal>

      <AnimatePresence>
        {open && (
          <ActionModal
            onClose={closeModal}
            title="Menu"
            body={
              <>
                <Menu.Item>
                  <Button onClick={openReportModal}>
                    Report
                  </Button>
                </Menu.Item>
                <Menu.Item>
                  <Button onClick={openSwitchModal}>
                    Switch to Professional
                  </Button>
                </Menu.Item>
                <Menu.Item>
                  <Button onClick={handleStartNowClick}>
                    Start Now
                  </Button>
                </Menu.Item>
                <Menu.Item>
                  <Button onClick={signOut}>
                    Sign Out
                  </Button>
                </Menu.Item>
              </>
            }
          />
        )}
      </AnimatePresence>

      <Menu className="relative" as="section">
        {({ open }): JSX.Element => (
          <>
            <Menu.Button
             className={cn(
              `toggleMenu1312 dark-bg-tab  border border-light-line-reply p-2
               hover:bg-light-primary/10 active:bg-light-primary/20 dark:border-light-secondary
               dark:hover:bg-dark-primary/10 dark:active:bg-dark-primary/20`,
            )}
            >
              <div className="custom-underline cursor-pointer flex gap-3 truncate">
      <HeroIcon className='HeroIconEllipsisHorizontalIcon h-5 w-5' iconName='EllipsisHorizontalIcon' />
              </div>
            </Menu.Button>
            <AnimatePresence>
              {open && (
                <Menu.Items
                  className="toggleMenu1312A borderbox4335 menu-container absolute w-60 xl:w-[200px]"
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
                        onClick={openSwitchModal}
                      >
                        <p className="btnH12P222222">Report</p>
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
                        onClick={handleDisplaySettingsClick}
                      >
                        <p className="btnH12P222222">Block</p>
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
                        onClick={handleDisplaySettingsClickinvestors}
                      >
                        <p className="btnH12P222222">About</p>
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
export default ThreeDotsMenu;