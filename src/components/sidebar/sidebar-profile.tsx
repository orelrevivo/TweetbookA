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

export function SidebarProfile(): JSX.Element {
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
    router.push('/Live/Create_your_Space_live');
  };

  const handleDisplaySettingsClickCogIcon = () => {
    router.push('/Settings/Youraccount'); // Updated path to the correct destination
  }
  
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

      <Modal
        modalClassName="modalClassNameCreate bg-main-background"
        open={isReportModalOpen}
        closeModal={closeReportModal}
      >
        <div className="p-4">
          <h3>Create Your Space</h3>
          {/* Dropdown for "Who can speak?" */}
          <label className="font-bold mt-4">Who can speak?</label>
          <select
            className="border rounded p-2 mt-2 w-full"
            value={whoCanSpeak}
            onChange={(e) => setWhoCanSpeak(e.target.value)}
          >
            <option>Only people you invite to speak</option>
            <option>People you follow</option>
            <option>Everyone</option>
          </select>

          {/* Text input for the topic */}
          <input
            type="text"
            placeholder="What do you want to talk about?"
            className="border rounded p-2 mt-4 w-full"
          />

          {/* Start Now Button */}
          <Button className="mt-4 w-full" onClick={handleStartNowClick} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Start Now'}
          </Button>
        </div>
      </Modal>

      {/* Reports Modal */}
      <Modal
        modalClassName="max-w-xs bg-main-background w-full rounded-2xl"
        open={isReportsModalOpen}
        closeModal={closeReportsModal}
      >
        <div className="CloseBtn2ddsModal">
          <p className='Reportsections'>Eror 404, Server is not Loading.</p>
          <Button className="CloseBtn2dds" onClick={closeReportsModal}>
            Close
          </Button>
        </div>
      </Modal>

      <Modal
        modalClassName="bg-main-background w-[35%] h-[620px] p-8 rounded-[10px]"
        open={isSwitchModalOpen}
        closeModal={closeSwitchModal}
      >
        <div className="report-modal">
          <LoginMain />
          <Button className="XButton1233" onClick={closeSwitchModal}>
          <svg
          className='XButton1232egeg3'
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{
            width: '24px',
            height: '24px',
            fill: 'rgb(15, 20, 25)',
            marginRight: '10px', // Adds space between icon and text
          }}
        >
          <g>
            <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
          </g>
        </svg>
          </Button>
        </div>
      </Modal>
      <Menu className="relative" as="section">
        {({ open }): JSX.Element => (
          <>
            <Menu.Button
              className={cn(
                `custom-buttonhover custom-button main-tab dark-bg-tab flex w-full items-center
                justify-between active:bg-light-primary/20
                dark:hover:bg-dark-primary/10 dark:active:bg-dark-primary/20
                rounded-[15px] w-[84%]
              `,
                open && 'bg-light-primary/10 dark:bg-dark-primary/10'
              )}
            >
              <div className="flex gap-3 truncate">
                <UserAvatar src={photoURL} alt={name} size={40} />
                <div className="hidden truncate text-start leading-5 xl:block">
                  <UserName name={name} className="start" verified={verified} />
                  <UserUsername username={username} disableLink />
                </div>
              </div>
              <HeroIcon
                className="hidden h-6 w-6 xl:block"
                iconName="EllipsisHorizontalIcon"
              />
            </Menu.Button>
            <AnimatePresence>
              {open && (
                <Menu.Items
                  className="borderbox4 menu-container absolute w-60 xl:w-[240px]"
                  as={motion.div}
                  static
                >
                  <Menu.Item>
                    {({ active }): JSX.Element => (
                      <Button
                        className={cn(
                          'btnH12 Logoutbtn1 flex w-full gap-3 rounded-md rounded-t-none p-4',
                          active && 'bg-main-sidebar-background'
                        )}
                        onClick={openModal}
                      >
                        <p className="btnH12P">
                          <HeroIcon iconName="ArrowRightOnRectangleIcon" />
                        </p>
                        <p className="btnH12P">Log out <UserUsername username={username} disableLink />?</p>
                      </Button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }): JSX.Element => (
                      <Button
                        className={cn(
                          'btnH12 flex w-full gap-3 rounded-md p-4',
                          active && 'bg-main-sidebar-background'
                        )}
                        onClick={handleDisplaySettingsClickCogIcon}
                      >
                        <p className="btnH12P">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
</svg>
                        </p>
                        <p className="btnH12P">Settings</p>
                      </Button>
                    )}
                  </Menu.Item>
                  {/* <Menu.Item>
                    {({ active }): JSX.Element => (
                      <Button
                        className={cn(
                          'btnH12 flex w-full gap-3 rounded-md p-4',
                          active && 'bg-main-sidebar-background'
                        )}
                        onClick={handleDisplayFeedbackClickCogIcon}
                      >
                        <p className="btnH12P">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 4.5-15 15m0 0h11.25m-11.25 0V8.25" />
</svg>

                        </p>
                        <p className="btnH12P">Feedback</p>
                      </Button>
                    )}
                  </Menu.Item> */}
                  <Menu.Item>
                    {({ active }): JSX.Element => (
                      <Button
                        className={cn(
                          'btnH12 flex w-full gap-3 rounded-md p-4',
                          active && 'bg-main-sidebar-background'
                        )}
                        onClick={handleDisplaySettingsClick}
                      >
                        <p className="btnH12P222">
                        <svg
                className='svgclassName'
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{
            width: '20px',
            height: '20px',
            fill: 'rgb(15, 20, 25)',
            marginRight: '10px', // Adds space between icon and text
          }}
        >
          <g>
         <g><path d="M12 22.25c-4.99 0-9.18-3.393-10.39-7.994l1.93-.512c.99 3.746 4.4 6.506 8.46 6.506s7.47-2.76 8.46-6.506l1.93.512c-1.21 4.601-5.4 7.994-10.39 7.994zM5 11.5c0 3.866 3.13 7 7 7s7-3.134 7-7V8.75c0-3.866-3.13-7-7-7s-7 3.134-7 7v2.75zm12-2.75v2.75c0 2.761-2.24 5-5 5s-5-2.239-5-5V8.75c0-2.761 2.24-5 5-5s5 2.239 5 5zM11.25 8v4.25c0 .414.34.75.75.75s.75-.336.75-.75V8c0-.414-.34-.75-.75-.75s-.75.336-.75.75zm-3 1v2.25c0 .414.34.75.75.75s.75-.336.75-.75V9c0-.414-.34-.75-.75-.75s-.75.336-.75.75zm7.5 0c0-.414-.34-.75-.75-.75s-.75.336-.75.75v2.25c0 .414.34.75.75.75s.75-.336.75-.75V9z"></path></g>
          </g>
        </svg>                        </p>
                        <p className="btnH12P22">Create your live</p>
                      </Button>
                    )}
                  </Menu.Item>
                  {/* <Menu.Item>
                    {({ active }): JSX.Element => (
                      <Button
                        className={cn(
                          'btnH12 ReportaProblem flex w-full gap-3 rounded-md p-4',
                          active && 'bg-main-sidebar-background'
                        )}
                        onClick={openReportModal}
                      >
                        <p className="btnH12P">
                          <HeroIcon iconName="StarIcon" />
                        </p>
                        <p className="btnH12P">Create your Space</p>
                      </Button>
                    )}
                  </Menu.Item> */}
                  <Menu.Item>
                    {({ active }): JSX.Element => (
                      <Button
                        className={cn(
                          'btnH12 ReportaProblem flex w-full gap-3 rounded-md p-4',
                          active && 'bg-main-sidebar-background'
                        )}
                        onClick={openSwitchModal}
                      >
                        <p className="btnH12P">
                          <HeroIcon iconName="ArrowsRightLeftIcon" />
                        </p>
                        <p className="btnH12P">Add an existing account</p>
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


// import { AnimatePresence, motion } from 'framer-motion';
// import { Menu } from '@headlessui/react';
// import cn from 'clsx';
// import { useAuth } from '@lib/context/auth-context';
// import { useModal } from '@lib/hooks/useModal';
// import { Modal } from '@components/modal/modal';
// import { ActionModal } from '@components/modal/action-modal';
// import { Button } from '@components/ui/button';
// import { HeroIcon } from '@components/ui/hero-icon';
// import { CustomIcon } from '@components/ui/custom-icon';
// import { UserAvatar } from '@components/user/user-avatar';
// import { UserName } from '@components/user/user-name';
// import { UserUsername } from '@components/user/user-username';
// import { variants } from './more-settings';
// import type { User } from '@lib/types/user';
// import { useRouter } from 'next/router'; // Import useRouter for navigation

// export function SidebarProfile(): JSX.Element {
//   const { user, signOut } = useAuth();
//   const { open, openModal, closeModal } = useModal();
//   const router = useRouter(); // Initialize useRouter

//   const { name, username, verified, photoURL } = user as User;

//   return (
//     <>
//       <Modal
//         modalClassName='max-w-xs bg-main-background w-full p-8 rounded-2xl'
//         open={open}
//         closeModal={closeModal}
//       >
//         <ActionModal
//           focusOnMainBtn
//           title='Log out of Tweetbook?'
//           description='You can always log back in at any time. If you just want to switch accounts, you can do that by adding an existing account.'
//           mainBtnLabel='Log out'
//           action={signOut}
//           closeModal={closeModal}
//         />
//       </Modal>
//       <Menu className='relative' as='section'>
//         {({ open }): JSX.Element => (
//           <>
//             <Menu.Button
//               className={cn(
//                 `custom-buttonhover custom-button main-tab dark-bg-tab flex w-full items-center
//                   justify-between active:bg-light-primary/20
//                   dark:hover:bg-dark-primary/10 dark:active:bg-dark-primary/20
//                  rounded-[15px] w-[84%]
//                 `,
//                 open && 'bg-light-primary/10 dark:bg-dark-primary/10'
//               )}
//             >
//               <div className='flex gap-3 truncate'>
//                 <UserAvatar src={photoURL} alt={name} size={40} />
//                 <div className='hidden truncate text-start leading-5 xl:block'>
//                   <UserName name={name} className='start' verified={verified} />
//                   <UserUsername username={username} disableLink />
//                 </div>
//               </div>
//               <HeroIcon
//                 className='hidden h-6 w-6 xl:block'
//                 iconName='EllipsisHorizontalIcon'
//               />
//             </Menu.Button>
//                       <Button
//                       className={cn(
//                         `custom-buttonhover2 custom-button main-tab dark-bg-tab flex w-full items-center
//                           justify-between active:bg-light-primary/20
//                           dark:hover:bg-dark-primary/10 dark:active:bg-dark-primary/20
//                          rounded-[15px] w-[84%]
//                         `,
//                         open && 'bg-light-primary/10 dark:bg-dark-primary/10'
//                       )}
//                         onClick={openModal}
//                       >
//                         <HeroIcon iconName='ArrowRightOnRectangleIcon' />
//                         Log out @{username}
//                       </Button>
//                       <Button
//                          className={cn(
//                           `custom-buttonhover3 custom-button main-tab dark-bg-tab flex w-full items-center
//                             justify-between active:bg-light-primary/20
//                             dark:hover:bg-dark-primary/10 dark:active:bg-dark-primary/20
//                            rounded-[15px] w-[84%]
//                           `,
//                           open && 'bg-light-primary/10 dark:bg-dark-primary/10'
//                         )}
//                         onClick={() => router.push('/Settings')} // Navigate to trends page
//                       >
//                         <HeroIcon iconName='CogIcon' /> {/* Replace with actual settings icon */}
//                         Settings
//                       </Button>
//             <AnimatePresence>
//               {open && (
//                 <Menu.Items
//                   className='borderbox4 ' // Adjusted top value
//                   as={motion.div}
//                   {...variants}
//                   static
//                 >
//                   <Menu.Item
//                     className='flex items-center justify-between gap-4 border-b 
//                                border-light-border px-4 py-3 dark:border-dark-border'
//                     as='div'
//                     disabled
//                   >
//                     <div className='flex items-center gap-3 truncate'>
//                       <UserAvatar src={photoURL} alt={name} />
//                       <div className='truncate'>
//                         <UserName name={name} verified={verified} />
//                         <UserUsername username={username} disableLink />
//                       </div>
//                     </div>
//                     <i>
//                       <HeroIcon
//                         className='h-5 w-5 text-main-accent'
//                         iconName='CheckIcon'
//                       />
//                     </i>
//                   </Menu.Item>
//                   {/* Settings Button */}
//                   <i
//                     className='absolute -bottom-[10px] left-2 translate-x-1/2 rotate-180
//                                [filter:drop-shadow(#cfd9de_1px_-1px_1px)] 
//                                dark:[filter:drop-shadow(#333639_1px_-1px_1px)]
//                                xl:left-1/2 xl:-translate-x-1/2'
//                   >
//                     <CustomIcon
//                       className='h-4 w-6 fill-main-background'
//                       iconName='TriangleIcon'
//                     />
//                   </i>
//                 </Menu.Items>
//               )}
//             </AnimatePresence>
//           </>
//         )}
//       </Menu>
//     </>
//   );
// }






// import { AnimatePresence, motion } from 'framer-motion';
// import { Menu } from '@headlessui/react';
// import cn from 'clsx';
// import { useAuth } from '@lib/context/auth-context';
// import { useModal } from '@lib/hooks/useModal';
// import { Modal } from '@components/modal/modal';
// import { ActionModal } from '@components/modal/action-modal';
// import { Button } from '@components/ui/button';
// import { HeroIcon } from '@components/ui/hero-icon';
// import { CustomIcon } from '@components/ui/custom-icon';
// import { UserAvatar } from '@components/user/user-avatar';
// import { UserName } from '@components/user/user-name';
// import { UserUsername } from '@components/user/user-username';
// import { variants } from './more-settings';
// import type { User } from '@lib/types/user';
// import { useRouter } from 'next/router'; // Import useRouter for navigation

// export function SidebarProfile(): JSX.Element {
//   const { user, signOut } = useAuth();
//   const { open, openModal, closeModal } = useModal();
//   const router = useRouter(); // Initialize useRouter

//   const { name, username, verified, photoURL } = user as User;

//   return (
//     <>
//       <Modal
//         modalClassName='max-w-xs bg-main-background w-full p-8 rounded-2xl'
//         open={open}
//         closeModal={closeModal}
//       >
//         <ActionModal
//           focusOnMainBtn
//           title='Log out of Tweetbook?'
//           description='You can always log back in at any time. If you just want to switch accounts, you can do that by adding an existing account.'
//           mainBtnLabel='Log out'
//           action={signOut}
//           closeModal={closeModal}
//         />
//       </Modal>
//       <Menu className='relative' as='section'>
//         {({ open }): JSX.Element => (
//           <>
//             <Menu.Button
//               className={cn(
//                 `custom-buttonhover custom-button main-tab dark-bg-tab flex w-full items-center
//                  rounded-[15px] w-[84%]
//                 `,
//                 open && 'bg-light-primary/10 dark:bg-dark-primary/10'
//               )}
//             >
//               <div className='flex gap-3 truncate'>
//                 <UserAvatar src={photoURL} alt={name} size={40} />
//                 {/* <div className='hidden truncate text-start leading-5 xl:block'>
//                   <UserName name={name} className='start' verified={verified} />
//                   <UserUsername username={username} disableLink />
//                 </div> */}
//               </div>
//               {/* <HeroIcon
//                 className='hidden h-6 w-6 xl:block'
//                 iconName='EllipsisHorizontalIcon'
//               /> */}
//             </Menu.Button>
//             <AnimatePresence>
//               {open && (
//                 <Menu.Items
//                   className='borderbox4 menu-container absolute w-60 xl:w-[240px]' // Adjusted top value
//                   as={motion.div}
//                   {...variants}
//                   static
//                 >
//                   <Menu.Item
//                     className='flex items-center justify-between gap-4 border-b 
//                                border-light-border px-4 py-3 dark:border-dark-border'
//                     as='div'
//                     disabled
//                   >
//                     <div className='flex items-center gap-3 truncate'>
//                       <UserAvatar src={photoURL} alt={name} />
//                       <div className='truncate'>
//                         <UserName name={name} verified={verified} />
//                         <UserUsername username={username} disableLink />
//                       </div>
//                     </div>
//                     <i>
//                       <HeroIcon
//                         className='h-5 w-5 text-main-accent'
//                         iconName='CheckIcon'
//                       />
//                     </i>
//                   </Menu.Item>
//                   <Menu.Item>
//                     {({ active }): JSX.Element => (
//                       <Button
//                         className={cn(
//                           'flex w-full gap-3 rounded-md rounded-t-none p-4',
//                           active && 'bg-main-sidebar-background'
//                         )}
//                         onClick={openModal}
//                       >
//                         <HeroIcon iconName='ArrowRightOnRectangleIcon' />
//                         Log out @{username}
//                       </Button>
//                     )}
//                   </Menu.Item>
//                   {/* Settings Button */}
//                   <Menu.Item>
//                     {({ active }): JSX.Element => (
//                       <Button
//                         className={cn(
//                           'flex w-full gap-3 rounded-md p-4',
//                           active && 'bg-main-sidebar-background'
//                         )}
//                         onClick={() => router.push('/Settings')} // Navigate to trends page
//                       >
//                         <HeroIcon iconName='CogIcon' /> {/* Replace with actual settings icon */}
//                         Settings
//                       </Button>
//                     )}
//                   </Menu.Item>
//                   <i
//                     className='absolute -bottom-[10px] left-2 translate-x-1/2 rotate-180
//                                [filter:drop-shadow(#cfd9de_1px_-1px_1px)] 
//                                dark:[filter:drop-shadow(#333639_1px_-1px_1px)]
//                                xl:left-1/2 xl:-translate-x-1/2'
//                   >
//                     <CustomIcon
//                       className='h-4 w-6 fill-main-background'
//                       iconName='TriangleIcon'
//                     />
//                   </i>
//                 </Menu.Items>
//               )}
//             </AnimatePresence>
//           </>
//         )}
//       </Menu>
//     </>
//   );
// }
