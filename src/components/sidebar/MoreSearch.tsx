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

export function Moresarch(): JSX.Element {
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
  const [buttonPosition, setButtonPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  return (
    <>
        <Modal
        modalClassName="bg-main-background w-[35%] h-[620px] p-8 rounded-[10px]"
        open={isSwitchModalOpen}
        closeModal={closeSwitchModal}
      >
        <div className='dgsegdggdge bg-main-background'>
          <h1 className='reportingWhat'>
          Explore settings
          </h1>
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
            <span className='HateButton'>Location</span>
            <br />
            <span className='HateSlurs'>
              <span className='dsgsgdgsdgsegsdg'>Show content in this location</span>
              <br />
              <span className='dsgsgdgsdgsegsdg2'>When this is on, you’ll see what’s happening around you right now.</span>
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
            <span className='HateButton2'>Personalization</span>
            <br />
            <span className='HateSlurs'>
              <span className='dsgsgdgsdgsegsdg24'>Trends for you</span>
              <br />
              <span className='dsgsgdgsdgsegsdg245'>You can personalize trends based on your location and who you follow.</span>
            </span>
          </button>
          <div className='fixed-top-bar3222 fixed top-0 left-0 right-0 z-10 h-1 bg-main-background'>
        <div className="flex justify-center items-center relative">
          <button className='ButtonNext'>Next</button>
        </div>
      </div>
        </div>
      </Modal>

      <Menu className="relative" as="section">
        {({ open }): JSX.Element => (
          <>
            <Menu.Button
             className={cn(
                `csdgrsgdfsggssgeg main-tab group group absolute top-2 right-2 p-2 
                 hover:bg-accent-blue/10 focus-visible:bg-accent-blue/10
                 focus-visible:!ring-accent-blue/80 active:bg-accent-blue/20`,
                open && 'bg-accent-blue/10 [&>div>svg]:text-accent-blue'
              )}
            >
              <div className="custom-underline cursor-pointer flex gap-3 ">
               <HeroIcon
                className="gsgsehsghdheshe hidden h-6 w-6 xl:block"
                iconName="EllipsisHorizontalIcon"
              />
              </div>
            </Menu.Button>
            <AnimatePresence>
              {open && (
                <Menu.Items
                  className="borderbox433522 menu-container absolute w-60 xl:w-[200px]"
                  as={motion.div}
                  static
                >
                  {/* <Menu.Item>
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
                  </Menu.Item> */}
                  <Menu.Item>
                    {({ active }): JSX.Element => (
                      <Button
                        className={cn(
                          'gdfsgegagagw gagagw btnH12 ReportaProblem flex w-full gap-3 rounded-md p-4',
                          active && 'bg-main-sidebar-background'
                        )}
                        onClick={openSwitchModal}
                      >
                        <p className="btnH12P222222235"> Search settings</p>
                        <svg
                        className='gkkpsjgmpekhs'
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{
            width: '19px',
            height: '19px',
            fill: 'rgb(15, 20, 25)',
            marginRight: '10px', // Adds space between icon and text
          }}
        >
          <g>
          <path d="M10.54 1.75h2.92l1.57 2.36c.11.17.32.25.53.21l2.53-.59 2.17 2.17-.58 2.54c-.05.2.04.41.21.53l2.36 1.57v2.92l-2.36 1.57c-.17.12-.26.33-.21.53l.58 2.54-2.17 2.17-2.53-.59c-.21-.04-.42.04-.53.21l-1.57 2.36h-2.92l-1.58-2.36c-.11-.17-.32-.25-.52-.21l-2.54.59-2.17-2.17.58-2.54c.05-.2-.03-.41-.21-.53l-2.35-1.57v-2.92L4.1 8.97c.18-.12.26-.33.21-.53L3.73 5.9 5.9 3.73l2.54.59c.2.04.41-.04.52-.21l1.58-2.36zm1.07 2l-.98 1.47C10.05 6.08 9 6.5 7.99 6.27l-1.46-.34-.6.6.33 1.46c.24 1.01-.18 2.07-1.05 2.64l-1.46.98v.78l1.46.98c.87.57 1.29 1.63 1.05 2.64l-.33 1.46.6.6 1.46-.34c1.01-.23 2.06.19 2.64 1.05l.98 1.47h.78l.97-1.47c.58-.86 1.63-1.28 2.65-1.05l1.45.34.61-.6-.34-1.46c-.23-1.01.18-2.07 1.05-2.64l1.47-.98v-.78l-1.47-.98c-.87-.57-1.28-1.63-1.05-2.64l.34-1.46-.61-.6-1.45.34c-1.02.23-2.07-.19-2.65-1.05l-.97-1.47h-.78zM12 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5c.82 0 1.5-.67 1.5-1.5s-.68-1.5-1.5-1.5zM8.5 12c0-1.93 1.56-3.5 3.5-3.5 1.93 0 3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5c-1.94 0-3.5-1.57-3.5-3.5z"></path>
          </g>
        </svg>
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
