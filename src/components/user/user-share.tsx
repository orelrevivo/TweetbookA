import cn from 'clsx';
import { Popover } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { preventBubbling } from '@lib/utils';
import { siteURL } from '@lib/env';
import { Button } from '@components/ui/button';
import { HeroIcon } from '@components/ui/hero-icon';
import { ToolTip } from '@components/ui/tooltip';
import { variants } from '@components/Post/tweet-actions';
import { useState } from 'react';
import { UserName } from './user-name';
import { SpeakerXMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import { doc } from 'firebase/firestore';
import { useDocument } from '@lib/hooks/useDocument';
import { useUser } from '@lib/context/user-context';
import { isPlural } from '@lib/utils';
import { userStatsCollection } from '@lib/firebase/collections';
import type { Variants } from 'framer-motion';
import { UserEditProfile } from './user-edit-profile';
import { FollowButton } from '@components/ui/follow-button';
// Define the reasons for reporting
const reportReasons = [
  'Spam',
  'Abuse',
  'Harassment',
  'Hate Speech',
  'Misleading Information',
  'Inappropriate Content',
  'Violent Content',
  'Self-Harm',
  'Impersonation',
  'Other'
];

type UserShareProps = {
  username: string;
};

export function UserShare({ username }: UserShareProps): JSX.Element {
  const [isReportModalOpen, setReportModalOpen] = useState(false);
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [isShareModalOpsen, setShareModalOpen4] = useState(false);
  const [isSharedModalOpsen, setShareModalOpen45] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [reporting, setReporting] = useState(false);
    // Determine if the current profile being viewed is the logged-in user's profile
    const isCurrentUserProfile = user && user.id === id;

  const {
    pathname,
    query: { id }
  } = useRouter();

  const { user, loading } = useUser();
  const userId = user ? user.id : null;

  const { data: statsData, loading: statsLoading } = useDocument(
    doc(userStatsCollection(userId ?? 'null'), 'stats'),
    {
      allowNull: true,
      disabled: !userId
    }
  );

  const { tweets, likes } = statsData ?? {};

  const [totalTweets, totalPhotos, totalLikes] = [
    (user?.totalTweets ?? 0) + (tweets?.length ?? 0),
    user?.totalPhotos,
    likes?.length
  ];

  const handleCopy = (closeMenu: () => void) => async (): Promise<void> => {
    closeMenu();
    await navigator.clipboard.writeText(`${siteURL}/user/${username}`);
    toast.success('Copied to clipboard');
  };

  const handleReport = (reason: string) => {
    setSelectedReason(reason);
    setReportModalOpen(true);
  };

  const submitReport = async () => {
    setReporting(true);
    // Simulate sending report to server
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast.success('Report submitted successfully');
    setReportModalOpen(false);
    setReporting(false);
  };

  const handleShare = (platform: string) => {
    // Implement share functionality here
    let shareURL = '';
    switch (platform) {
      case 'Instagram':
        shareURL = ``;
        break;
      case 'WhatsApp':
        shareURL = `https://wa.me/?text=${siteURL}/user/${username}`;
        break;
      case 'TikTok':
        shareURL = `https://www.tiktok.com/share?url=${siteURL}/user/${username}`;
        break;
      // Add more cases as needed
    }
    window.open(shareURL, '_blank');
  };

  return (
    <>
      <Popover className='relative'>
        {({ open, close }): JSX.Element => (
          <>
            <Popover.Button
              as={Button}
              className={cn(
                `Message-button323334344 dark-bg-tab  border border-light-line-reply p-2
                 hover:bg-light-primary/10 active:bg-light-primary/20 dark:border-light-secondary
                 dark:hover:bg-dark-primary/10 dark:active:bg-dark-primary/20`,
                open && 'bg-light-primary/10 dark:bg-dark-primary/10'
              )}
            >
              <HeroIcon className='h-5 w-5' iconName='EllipsisHorizontalIcon' />
              {!open && <ToolTip tip='More' />}
            </Popover.Button>
            <AnimatePresence>
              {open && (
                <Popover.Panel
                  className='bg-main-background borderbox44 menu-container absolute w-60 xl:w-[240px] group absolute right-50  whitespace-nowrap
                             text-light-primary dark:text-dark-primary'
                  {...variants}
                  static
                >
                  <Popover.Button
                    className='menu-container42 flex w-full gap-3 rounded-md rounded-b-none p-4 hover:bg-main-sidebar-background'
                    as={Button}
                    onClick={preventBubbling(handleCopy(close))}
                  >
                    <span className='container423'>
                    <HeroIcon iconName='LinkIcon' className='ChatBubbleOvalLeftIcon h-4 w-4' />
                    </span>
                    <span className='container42'>
                    <span className='Profilelink'>Copy link to Profile</span>
                    </span>
                  </Popover.Button>
                  <Popover.Button
                    className='menu-container42 flex w-full gap-3 rounded-md rounded-b-none p-4 hover:bg-main-sidebar-background'
                    as={Button}
                    onClick={() => handleReport('')}
                  >
                    <span className='container423'>
                       <HeroIcon iconName='FlagIcon' className='ChatBubbleOvalLeftIcon h-4 w-4' />
                    </span>
                    <span className='container42'>
                    <span className='Profilelink'>Report User</span>
                    </span>
                  </Popover.Button>
                  <Popover.Button
                    className='menu-container42 flex w-full gap-3 rounded-md rounded-b-none p-4 hover:bg-main-sidebar-background'
                    as={Button}
                    onClick={() => setShareModalOpen(true)}
                  >
                   <span className='container423'>
                   <HeroIcon iconName='ShareIcon' className='ChatBubbleOvalLeftIcon h-4 w-4' />
                    </span>
                    <span className='container42'>
                    <span className='Profilelink'>Share Profile</span>
                    </span>
                  </Popover.Button>
                  <Popover.Button
                    className='menu-container42 flex w-full gap-3 rounded-md rounded-b-none p-4 hover:bg-main-sidebar-background'
                    as={Button}
                    onClick={() => setShareModalOpen4(true)}
                  >
                   <span className='container423'>
                   <HeroIcon iconName='ChatBubbleOvalLeftIcon' className='ChatBubbleOvalLeftIcon h-4 w-4' />
                    </span>
                    <span className='container42'>
                    <span className='Profilelink'>View Topics</span>
                    </span>
                  </Popover.Button>
                  <Popover.Button
                    className='menu-container42 flex w-full gap-3 rounded-md rounded-b-none p-4 hover:bg-main-sidebar-background'
                    as={Button}
                    onClick={() => setShareModalOpen45(true)}
                  >
                   <span className='container423'>
                   <HeroIcon iconName='Bars3BottomLeftIcon' className='ChatBubbleOvalLeftIcon h-4 w-4' />
                    </span>
                    <span className='container42'>
                    <span className='Profilelink'>View Lists</span>
                    </span>
                  </Popover.Button>
                  {/* <Popover.Button
                    className='menu-container42 flex w-full gap-3 rounded-md rounded-b-none p-4 hover:bg-main-sidebar-background'
                    as={Button}
                  >
                   <span className='container423'>
                   <SpeakerXMarkIcon className='h-5 w-5' className='ChatBubbleOvalLeftIcon h-4 w-4' />
                    </span>
                    <span className='container42'>
                    <span className='Profilelink'>Mute @
                    <UserName
                     tag='h2'
                     name={user.name}
                     className='ChatBubbleOvalLeftIcon2'
                     iconClassName='w-6 h-6'
                     verified={user.verified}
                     />
                    </span>
                    </span>
                  </Popover.Button>
                  <Popover.Button
                    className='menu-container42 bofeggegChatBubbleOvalLeftIcon bofeggegChatBubbleOvalLeftIcon flex w-full gap-3 p-4 hover:bg-main-sidebar-background'
                    as={Button}
                    onClick={() => setShareModalOpen(false)}
                  >
                   <span className='container423'>
                   <span className='ChatBubbleOvalLeftIcon24 h-4 w-4'>x</span>
                    </span>
                    <span className='container42'>
                    <span className='Profilelink'>Close</span>
                    </span>
                  </Popover.Button> */}
                </Popover.Panel>
              )}
            </AnimatePresence>
          </>
        )}
      </Popover>

      {/* Report Modal */}
      <AnimatePresence>
        {isReportModalOpen && (
          <motion.div
            className='fixed inset-0 flex items-center z-50' // Add semi-transparent overlay
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className='menu-container4Top relative bg-white dark:bg-dark-primary  shadow-lg p-6 w-80'>
              <h3 className='text-lg font-semibold mb-4'>Report User</h3>
              <p className='mb-4'>Please select a reason for reporting:</p>
              <div className='space-y-2'>
                {reportReasons.map(reason => (
                  <button
                    key={reason}
                    className='handleShareplatform text-left p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700'
                    onClick={() => handleReport(reason)}
                  >
                    {reason}
                  </button>
                ))}
              </div>
              {selectedReason && (
                <div className='handleShareplatform2 mt-4'>
                  <p className='mb-2'>Selected Reason: {selectedReason}</p>
                  <Button
                    className='w-full rounded-md hover:bg-gray-100 dark:hover:bg-gray-700'
                    onClick={submitReport}
                    disabled={reporting}
                  >
                    {reporting ? 'Submitting...' : 'Submit Report'}
                  </Button>
                </div>
              )}
              <div className='absolute top-2 right-2 flex gap-2'>
                <Button
                  className='setShareModalOpen2 p-2'
                  onClick={() => setReportModalOpen(false)}
                >
                  x 
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {isShareModalOpen && (
          <motion.div
            className='fixed inset-0 flex items-center z-50' // Add semi-transparent overlay
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className='menu-container4Top3 relative bg-white dark:bg-dark-primary shadow-lg p-6 w-96'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold'>Share Profile</h3>
                <div className='flex gap-2'>
                <Button
                  className='setShareModalOpen p-2'
                  onClick={() => setShareModalOpen(false)}
                >
                  x 
                </Button>
                  <Button
                    className='p-2'
                    onClick={() => setShareModalOpen(false)}
                  >
                   
                  </Button>
                </div>
              </div>
              <p className='mb-4'>Select where you want to share:</p>
              <div className='space-y-2'>
                {['Instagram', 'WhatsApp', 'TikTok'].map(platform => (
                  <button
                    key={platform}
                    className='w-full text-left p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700'
                    onClick={() => handleShare(platform)}
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isShareModalOpsen && (
          <motion.div
            className='fixed inset-0 flex items-center z-50' // Add semi-transparent overlay
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className='menu-container4Top34 relative bg-white dark:bg-dark-primary shadow-lg p-6 w-96'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold'>View Topics</h3>
                <div className='flex gap-2'>
                <Button
                  className='setShareModalOpen2 p-2'
                  onClick={() => setShareModalOpen4(false)}
                >
                  x 
                </Button>
                </div>
              </div>
              <span className='followingTopics'>
              <UserName
                     tag='h2'
                     name={user.name}
                     className='ChatBubbleOvalLeftIcon2'
                     iconClassName='w-6 h-6'
                     verified={user.verified}
                     />
                 isn’t following any Topics. When they do, it will be listed here.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isSharedModalOpsen && (
          <motion.div
            className='fixed inset-0 flex items-center z-50' // Add semi-transparent overlay
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className='menu-container4Top34 relative bg-white dark:bg-dark-primary shadow-lg p-6 w-96'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold'>View Lists</h3>
                <div className='flex gap-2'>
                <Button
                  className='setShareModalOpen2 p-2'
                  onClick={() => setShareModalOpen45(false)}
                >
                  x 
                </Button>
                </div>
              </div>
              <span className='followingTopics'>
              <UserName
                     tag='h2'
                     name={user.name}
                     className='ChatBubbleOvalLeftIcon2'
                     iconClassName='w-6 h-6'
                     verified={user.verified}
                     /> isn’t following any Lists. When they do, it will be listed here.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
