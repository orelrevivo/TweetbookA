import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { Popover } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import cn from 'clsx';
import { toast } from 'react-hot-toast';
import { useAuth } from '@lib/context/auth-context';
import { useModal } from '@lib/hooks/useModal';
import { tweetsCollection } from '@lib/firebase/collections';
import {
  removeTweet,
  manageReply,
  manageFollow,
  managePinnedTweet,
  manageTotalTweets,
  manageTotalPhotos
} from '@lib/firebase/utils';
import { delayScroll, preventBubbling, sleep } from '@lib/utils';
import { Modal } from '@components/modal/modal';
import { ActionModal } from '@components/modal/action-modal';
import { Button } from '@components/ui/button';
import { ToolTip } from '@components/ui/tooltip';
import { HeroIcon } from '@components/ui/hero-icon';
import { CustomIcon } from '@components/ui/custom-icon';
import type { Variants } from 'framer-motion';
import type { Tweet } from '@lib/types/tweet';
import type { User } from '@lib/types/user';
import { SpeakerXMarkIcon } from '@heroicons/react/24/outline';

export const variants: Variants = {
  initial: { opacity: 0, y: -25 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', duration: 0.4 }
  },
  exit: { opacity: 0, y: -25, transition: { duration: 0.2 } }
};

type TweetActionsProps = Pick<Tweet, 'createdBy'> & {
  isOwner: boolean;
  ownerId: string;
  tweetId: string;
  username: string;
  parentId?: string;
  hasImages: boolean;
  viewTweet?: boolean;
};

type PinModalData = Record<'title' | 'description' | 'mainBtnLabel', string>;

const pinModalData: Readonly<PinModalData[]> = [
  {
    title: 'Pin Post to from profile?',
    description:
      'This will appear at the top of your profile and replace any previously pinned Post.',
    mainBtnLabel: 'Pin'
  },
  {
    title: 'Unpin Post from profile?',
    description:
      'This will no longer appear automatically at the top of your profile.',
    mainBtnLabel: 'Unpin'
  }
];

export function TweetActions({
  isOwner,
  ownerId,
  tweetId,
  parentId,
  username,
  hasImages,
  viewTweet,
  createdBy
}: TweetActionsProps): JSX.Element {
  const { user, isAdmin } = useAuth();
  const { push } = useRouter();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [reportCount, setReportCount] = useState<number>(0);
  const [showBlur, setShowBlur] = useState<boolean>(false);
  const handleButtonClick = () => {
    if (isInGroup) {
      setConfirmLeaveGroup(true);
    } else {
      setNotifications(true);
    }
  };

  const {
    open: removeOpen,
    openModal: removeOpenModal,
    closeModal: removeCloseModal
  } = useModal();

  const {
    open: pinOpen,
    openModal: pinOpenModal,
    closeModal: pinCloseModal
  } = useModal();
  const [notifications2, setNotifications2] = useState(false);

  const {
    open: reportOpen,
    openModal: reportOpenModal,
    closeModal: reportCloseModal
  } = useModal();
  const handleClose2 = () => {
    setNotifications2(false);
    setConfirmLeaveGroup2(false);
  };
  const [confirmLeaveGroup2, setConfirmLeaveGroup2] = useState(false);

  const {
    open: detailedReportOpen,
    openModal: detailedReportOpenModal,
    closeModal: detailedReportCloseModal
  } = useModal();
  const handleLeaveGroup = () => {
    setIsInGroup(false);
    localStorage.setItem('isInGroup', 'false');
    setConfirmLeaveGroup(false);
  };
  const {
    open: customReportOpen,
    openModal: customReportOpenModal,
    closeModal: customReportCloseModal
  } = useModal();
  const [confirmLeaveGroup, setConfirmLeaveGroup] = useState(false);

  const { id: userId, following, pinnedTweet } = user as User;
  const [isInGroup, setIsInGroup] = useState(false);

  const handleJoinGroup = () => {
    setIsInGroup(true);
    localStorage.setItem('isInGroup', 'true');
    setNotifications(false);
  };
  const isInAdminControl = isAdmin && !isOwner;
  const tweetIsPinned = pinnedTweet === tweetId;

  useEffect(() => {
    const fetchReportCount = async () => {
      const tweetRef = doc(tweetsCollection, tweetId);
      const tweetSnapshot = await getDoc(tweetRef);
      if (tweetSnapshot.exists()) {
        const tweetData = tweetSnapshot.data() as Tweet;
        setReportCount(tweetData.reportCount || 0);
        setShowBlur(tweetData.reportCount >= 5000 && !isOwner);
      }
    };

    fetchReportCount();
  }, [tweetId, isOwner]);
  const handleButtonClick2 = () => {
    if (isInGroup) {
      setConfirmLeaveGroup2(true);
    } else {
      setNotifications(true);
    }
  };
  const handleRemove = async (): Promise<void> => {
    if (viewTweet)
      if (parentId) {
        const parentSnapshot = await getDoc(doc(tweetsCollection, parentId));
        if (parentSnapshot.exists()) {
          await push(`/tweet/${parentId}`, undefined, { scroll: false });
          delayScroll(200)();
          await sleep(50);
        } else await push('/home');
      } else await push('/home');

    await Promise.all([
      removeTweet(tweetId),
      manageTotalTweets('decrement', ownerId),
      hasImages && manageTotalPhotos('decrement', createdBy),
      parentId && manageReply('decrement', parentId)
    ]);

    toast.success(
      `${isInAdminControl ? `@${username}'s` : 'Your'} Tweet was deleted`
    );

    removeCloseModal();
  };
  const handleClose = () => {
    setNotifications(false);
    setConfirmLeaveGroup(false);
  };
  const handlePin = async (): Promise<void> => {
    await managePinnedTweet(tweetIsPinned ? 'unpin' : 'pin', userId, tweetId);
    toast.success(
      `Your tweet was ${tweetIsPinned ? 'unpinned' : 'pinned'} to your profile`
    );
    pinCloseModal();
  };
  const [notifications, setNotifications] = useState(false);

  const handleFollow =
    (closeMenu: () => void, ...args: Parameters<typeof manageFollow>) =>
    async (): Promise<void> => {
      const [type] = args;

      closeMenu();
      await manageFollow(...args);

      toast.success(
        `You ${type === 'follow' ? 'followed' : 'unfollowed'} @${username}`
      );
    };

  const userIsFollowed = following.includes(createdBy);

  const currentPinModalData = useMemo(
    () => pinModalData[+tweetIsPinned],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pinOpen]
  );

  const reportOptions = [
    'It\'s spam',
    'Nudity or sexual activity',
    'Hate speech or symbols',
    'Violence or dangerous organizations',
    'Sale of illegal or regulated goods',
    'Bullying or harassment',
    'Intellectual property violation',
    'Suicide or self-injury',
    'Eating disorders',
    'Scam or fraud',
    'Drugs',
    'False information',
    'I just don\'t like it',
    'Other'
  ];

  const handleReportClick = (option: string) => {
    setSelectedReport(option);
    reportCloseModal();
    detailedReportOpenModal();
  };
  const RequestCommunityNote = () => {
    router.push('/RequestCommunity');
  };
  const router = useRouter();
  const { back } = router;
  const handleSendReport = async () => {
    const tweetRef = doc(tweetsCollection, tweetId);
    await updateDoc(tweetRef, {
      reportCount: increment(1)
    });

    const newReportCount = reportCount + 1;
    setReportCount(newReportCount);

    if (newReportCount >= 10) {
      // If the report count reaches 10, blur the tweet and show a message
      setShowBlur(true);
      toast.success('This Post has been reported too many times. It will now be blurred for all users.');
    } else {
      toast.success('Report submitted successfully!');
    }

    detailedReportCloseModal();
  };

  const handleCustomReport = () => {
    customReportOpenModal();
  };

  const handleReportGuidelines = () => {
    push('/trends');  // Navigate to the trends page
  };

  return (
    <>
      <Modal
        modalClassName='max-w-xs bg-main-background w-full p-8 rounded-2xl'
        open={removeOpen}
        closeModal={removeCloseModal}
      >
        <ActionModal
          title='Delete Tweetbook Post?'
          description={`This can’t be undone and it will be removed from ${
            isInAdminControl ? `@${username}'s` : 'your'
          } profile, the timeline of any accounts that follow ${
            isInAdminControl ? `@${username}` : 'you'
          }, and from Tweetbook search results.`}
          mainBtnClassName='bg-accent-red hover:bg-accent-red/90 active:bg-accent-red/75 accent-tab
                            focus-visible:bg-accent-red/90'
          mainBtnLabel='Delete'
          focusOnMainBtn
          action={handleRemove}
          closeModal={removeCloseModal}
        />
      </Modal>
      <Modal
        modalClassName='max-w-md bg-main-background w-full p-8 rounded-2xl'
        open={pinOpen}
        closeModal={pinCloseModal}
      >
        <ActionModal
          title={currentPinModalData.title}
          description={currentPinModalData.description}
          mainBtnClassName='bg-accent-blue hover:bg-accent-blue/90 active:bg-accent-blue/75 accent-tab
                            focus-visible:bg-accent-blue/90'
          mainBtnLabel={currentPinModalData.mainBtnLabel}
          focusOnMainBtn
          action={handlePin}
          closeModal={pinCloseModal}
        />
      </Modal>
      <Modal
        modalClassName='modaldd2'
        open={reportOpen}
        closeModal={reportCloseModal}
      >
        <div className="box">
          {/* <h2 className="text-xl font-semibold text-center">Report Tweet</h2> */}
          <div className="flex flex-col gap-2">
            {reportOptions.map((option) => (
              <Button
                key={option}
                onClick={() => handleReportClick(option)}
                className="option1  bg-main-background "
              >
                {option}
              </Button>
            ))}
            <Button
              onClick={handleCustomReport}
              className="other123"
            >
              Other
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        modalClassName='max-w-md bg-main-background w-full p-8 rounded-2xl'
        open={detailedReportOpen}
        closeModal={detailedReportCloseModal}
      >
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-center">Report Details</h2>
          <p className="text-center text-gray-600">Why are you reporting this tweet?</p>
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleSendReport}
              className="text-main-accent text-left p-2 border border-gray-300 rounded-md bg-main-background hover:bg-gray-100"
            >
              {selectedReport}
            </Button>
            <Button
              onClick={customReportOpenModal}
              className="text-main-accent text-left p-2 border border-gray-300 rounded-md bg-main-background hover:bg-gray-100"
            >
              Other
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        modalClassName='max-w-md bg-main-background w-full p-8 rounded-2xl'
        open={customReportOpen}
        closeModal={customReportCloseModal}
      >
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-center">Custom Report</h2>
          <textarea
            rows={4}
            placeholder="Describe your issue here..."
            className="w-full p-2 border border-gray-300 rounded-md bg-main-background"
          />
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleSendReport}
              className="text-main-accent bg-accent-blue text-white p-2 rounded-md hover:bg-accent-blue/90"
            >
              Submit Report
            </Button>
            <div className="flex flex-col text-sm text-gray-600">
              <p>By submitting, you agree to the</p>
              <button
                className="text-main-accent text-accent-blue"
                onClick={handleReportGuidelines}
              >
                Report Guidelines
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <Popover>
        {({ open, close }): JSX.Element => (
          <>
            <Popover.Button
              as={Button}
              className={cn(
                `main-tab group group absolute top-2 right-2 p-2 
                 hover:bg-accent-blue/10 focus-visible:bg-accent-blue/10
                 focus-visible:!ring-accent-blue/80 active:bg-accent-blue/20`,
                open && 'bg-accent-blue/10 [&>div>svg]:text-accent-blue'
              )}
            >
              <div className='group relative'>
                <HeroIcon
                  className='h-5 w-5 text-light-secondary group-hover:text-accent-blue
                             group-focus-visible:text-accent-blue dark:text-dark-secondary/80'
                  iconName='EllipsisHorizontalIcon'
                />
                {!open && <ToolTip tip='More' />}
              </div>
            </Popover.Button>
            {/* <Popover.Button
                    className='buttoncontainer32342522A'
                    as={Button}
                    onClick={handleButtonClick}
                  >
                 <p className='Join123'>Join</p>
                  </Popover.Button> */}
            <AnimatePresence>
              {open && (
                <Popover.Panel
                  className='menu-container323 group absolute top-[50px] right-2 whitespace-nowrap text-light-primary bg-main-background
                             dark:text-dark-primary'
                  as={motion.div}
                  {...variants}
                  static
                >
                     {(isAdmin || isOwner) && (
                    <Popover.Button
                      className='buttoncontainer3234 flex w-full gap-3 rounded-md rounded-b-none p-4 text-accent-red
                                 hover:bg-main-sidebar-background'
                      as={Button}
                      onClick={preventBubbling(removeOpenModal)}
                    >
                    <p className='buttoncontainer323331w51552'><HeroIcon iconName='TrashIcon' /></p>
                      <p className='buttoncontainer32553252353'>Delete</p>
                    </Popover.Button>
                  )}
                  {isOwner ? (
                    <Popover.Button
                      className='buttoncontainer3234 flex w-full gap-3 rounded-md rounded-t-none p-4 hover:bg-main-sidebar-background'
                      as={Button}
                      onClick={preventBubbling(pinOpenModal)}
                    >
                      {tweetIsPinned ? (
                        <>
                          
                    <p className='buttoncontainer32333'><CustomIcon iconName='PinOffIcon' /></p>

                          <p className='buttoncontainer323'>Unpin from profile</p>
                        </>
                      ) : (
                        <>
                      <p className='buttoncontainer32333'><CustomIcon iconName='PinIcon' /></p>
                      <p className='buttoncontainer323'> Pin to your profile</p>
                        </>
                      )}
                    </Popover.Button>
                  ) : userIsFollowed ? (
                    <Popover.Button
                      className='buttoncontainer3234 UnfollowFollow flex w-full gap-3 rounded-md rounded-t-none p-4 hover:bg-main-sidebar-background'
                      as={Button}
                      onClick={preventBubbling(
                        handleFollow(close, 'unfollow', userId, createdBy)
                      )}
                    >
                    <p className='buttoncontainer32333'>    <HeroIcon iconName='UserMinusIcon' /></p>
                      <p className='buttoncontainer323'>Unfollow @{username}</p>
                    </Popover.Button>
                  ) : (
                    <Popover.Button
                      className='buttoncontainer3234 UnfollowFollow flex w-full gap-3 rounded-md rounded-t-none p-4 hover:bg-main-sidebar-background'
                      as={Button}
                      onClick={preventBubbling(
                        handleFollow(close, 'follow', userId, createdBy)
                      )}
                    >
                      <p className='buttoncontainer32333'><HeroIcon iconName='UserPlusIcon' /></p>
                    <p className='buttoncontainer323'>Follow @{username}</p>
                    </Popover.Button>
                  )}
                  <Popover.Button
                    className='buttoncontainer3234 flex w-full gap-3 rounded-md rounded-t-none p-4 hover:bg-main-sidebar-background'
                    as={Button}
                    onClick={handleButtonClick}
                  >
                  <p className='buttoncontainer32333'><HeroIcon className='h-5 w-5' iconName='UserGroupIcon' /></p>
                  <p className='buttoncontainer323'>Group Membership</p>
                  </Popover.Button>
                  <Popover.Button
                    className='buttoncontainer3234 flex w-full gap-3 rounded-md rounded-t-none p-4 hover:bg-main-sidebar-background'
                    as={Button}
                    onClick={RequestCommunityNote}
                  >
                  <p className='buttoncontainer32333'><SpeakerXMarkIcon className='h-5 w-5' /></p>
                  <p className='buttoncontainer323'>RequestCommunity Note</p>
                  </Popover.Button>
                  <Popover.Button
                    className='buttoncontainer3234 flex w-full gap-3 rounded-md rounded-t-none p-4 hover:bg-main-sidebar-background'
                    as={Button}
                    onClick={preventBubbling(reportOpenModal)}
                  >
                    <p className='buttoncontainer32333'>   <HeroIcon iconName='FlagIcon' /></p>
                    <p className='buttoncontainer323'>Report</p>
                  </Popover.Button>
                </Popover.Panel>
              )} 

            </AnimatePresence>
          </>
        )}
      </Popover>
      <Modal
              modalClassName='relative bg-main-background rounded-2xl max-w-xl w-full h-[672px] overflow-hidden'
              open={notifications}
              closeModal={handleClose}
            >
              <div className='flex flex-col h-full p-4'>
                <h2 className='text-lg font-bold mb-4'>Join the Group</h2>
                <p>Do you want to join the group?</p>
                <Button className='joinButton-plus' onClick={handleJoinGroup}>Join</Button>
                <Button onClick={handleClose}  className='joinButton-plus-Cancel'>Cancel</Button>
              </div>
            </Modal>

            <Modal
              modalClassName='relative bg-main-background rounded-2xl max-w-xl w-full h-[672px] overflow-hidden'
              open={confirmLeaveGroup}
              closeModal={handleClose}
            >
              <div className='flex flex-col h-full p-4'>
                <h2 className='text-lg font-bold mb-4'>Leave Group</h2>
                <p>Are you sure you want to leave the group?</p>
                <br />
                <span className='Tweetbookbluespan2'>When you click on the leave button you can come back whenever you want and enter the group unless it is private and 
                  then you need the permission of the admin user. You can read everything in the rules of . <span onClick={handleButtonClick2} className='Tweetbookbluespan'>Tweetbook</span></span>
                <Button className='joinButton-plus' onClick={handleLeaveGroup}>Yes, Leave</Button>
                <Button onClick={handleClose} className='joinButton-plus-Cancel'>Cancel</Button>
              </div>
            </Modal>
            <Modal
              modalClassName='relative bg-main-background rounded-2xl max-w-xl w-full h-[672px] overflow-hidden'
              open={confirmLeaveGroup2}
              closeModal={handleClose}
            >
              <div className='flex flex-col h-full p-4'>
              <Button onClick={handleClose2} className='joinButton-plus-Cancel2'>X</Button>
                <h2 className='Regulations12'>Tweetbook Club Membership Guidelines</h2>
                <p className='Tweetbookbluespan23'>Welcome to Tweetbook! As a member of our exclusive club, you’re joining a vibrant community of like-minded individuals passionate about connecting, sharing, and engaging. To ensure a positive and respectful environment, please adhere to the following guidelines:                </p>
                <div className='scrollable-container'>
                <span className='Tweetbookbluespan2'>1.Respect and Courtesy: Always interact with fellow members respectfully and courteously. Discriminatory, offensive, or abusive behavior will not be tolerated. Treat others as you wish to be treated.</span>
                <br />
                <span className='Tweetbookbluespan2'>2.Privacy and Confidentiality: Respect the privacy of other members. Do not share personal information, messages, or content without permission. Use the privacy settings available to manage your own information and content.</span>
                <br />
                <span className='Tweetbookbluespan2'>3.
                Content Posting: When posting content, ensure it is appropriate for the audience. Avoid sharing content that is explicit, offensive, or misleading. Ensure your posts comply with Tweetbook’s content policies and guidelines.</span>
                <br />
                <span className='Tweetbookbluespan2'>4.Engagement Etiquette: Engage in discussions thoughtfully and constructively. Avoid spam, repetitive comments, or promotional content that does not add value to the conversation. Use hashtags and tags responsibly.</span>
                <br />
                <span className='Tweetbookbluespan2'>5.Account Security: Protect your account by using strong passwords and enabling two-factor authentication. Do not share your account credentials with others. Report any suspicious activity to our support team immediately.</span>
                <br />
                <span className='Tweetbookbluespan2'>6.Compliance with Laws: Ensure that all content and interactions comply with applicable laws and regulations. This includes respecting copyright and intellectual property rights, and not engaging in illegal activities.                </span>
                <br />
                <span className='Tweetbookbluespan2'>7.Respect for Moderators: Follow the instructions and decisions of club moderators and administrators. They are here to maintain a positive and orderly environment. If you have concerns or disagreements, address them respectfully and through the proper channels.</span>
                <br />
                <span className='Tweetbookbluespan2'>8.No Impersonation: Do not impersonate other members, celebrities, or public figures. Ensure that your profile accurately represents who you are and does not mislead others.</span>
                <br />
                <span className='Tweetbookbluespan2'>9.Handling Disputes: In case of disputes or conflicts with other members, resolve them amicably and privately. Utilize the reporting tools provided if you believe that a member has violated the rules.
                </span>
                <br />
                <span className='Tweetbookbluespan2'>10.Termination of Membership: Tweetbook reserves the right to terminate or suspend memberships that violate these guidelines. Continued violations may lead to permanent removal from the club.
                </span>
                <br />
                <br />
                <span className='Tweetbookbluespan2following'>By following these guidelines, you contribute to a welcoming and enjoyable community for everyone. Thank you for being a part of Tweetbook and helping us create a positive experience for all members!.</span>
                </div>
              </div>
            </Modal>
      {showBlur && (
  <div
    style={{
      position: 'absolute',       /* Position the overlay absolutely relative to the parent */
      inset: 0,                  /* Stretch the overlay to cover the entire parent element */
      display: 'flex',          /* Use flexbox to center the content */
      flexDirection: 'column',  /* Stack children vertically */
      alignItems: 'center',    /* Center content horizontally */
      justifyContent: 'center',/* Center content vertically */
      background: '#000000',   /* Completely black background */
      borderRadius: '12px',    /* Rounded corners */
      color: '#ffffff',       /* White text color */
      fontSize: '1rem',     /* Larger text size for emphasis */
      fontWeight: 600,         /* Bold text */
      pointerEvents: 'none',   /* Prevent any interactions with the content inside */
      zIndex: 10,              /* Ensure it is above other content */
      padding: '16px',        /* Add padding around the content */
      textAlign: 'center'     /* Center text horizontally */
    }}
  >
    <span>This post has been reported too many times.</span>
    <p
      style={{
        marginTop: '10px',  /* Space between the two texts */
        fontSize: '1rem',   /* Slightly smaller text size for the description */
        fontWeight: 400,    /* Regular text weight for the description */
      }}
    >
      This post was deleted because it received many reports or had inappropriate content
    </p>
    <p className='ddddd'>Will delete a few minutes after the report</p>
  </div>
)}

    </>
  );
}

// import { useMemo, useState, useEffect } from 'react';
// import { useRouter } from 'next/router';
// import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
// import { Popover } from '@headlessui/react';
// import { AnimatePresence, motion } from 'framer-motion';
// import cn from 'clsx';
// import { toast } from 'react-hot-toast';
// import { useAuth } from '@lib/context/auth-context';
// import { useModal } from '@lib/hooks/useModal';
// import { tweetsCollection } from '@lib/firebase/collections';
// import {
//   removeTweet,
//   manageReply,
//   manageFollow,
//   managePinnedTweet,
//   manageTotalTweets,
//   manageTotalPhotos
// } from '@lib/firebase/utils';
// import { delayScroll, preventBubbling, sleep } from '@lib/utils';
// import { Modal } from '@components/modal/modal';
// import { ActionModal } from '@components/modal/action-modal';
// import { Button } from '@components/ui/button';
// import { ToolTip } from '@components/ui/tooltip';
// import { HeroIcon } from '@components/ui/hero-icon';
// import { CustomIcon } from '@components/ui/custom-icon';
// import type { Variants } from 'framer-motion';
// import type { Tweet } from '@lib/types/tweet';
// import type { User } from '@lib/types/user';

// export const variants: Variants = {
//   initial: { opacity: 0, y: -25 },
//   animate: {
//     opacity: 1,
//     y: 0,
//     transition: { type: 'spring', duration: 0.4 }
//   },
//   exit: { opacity: 0, y: -25, transition: { duration: 0.2 } }
// };

// type TweetActionsProps = Pick<Tweet, 'createdBy'> & {
//   isOwner: boolean;
//   ownerId: string;
//   tweetId: string;
//   username: string;
//   parentId?: string;
//   hasImages: boolean;
//   viewTweet?: boolean;
// };

// type PinModalData = Record<'title' | 'description' | 'mainBtnLabel', string>;

// const pinModalData: Readonly<PinModalData[]> = [
//   {
//     title: 'Pin Tweet to from profile?',
//     description:
//       'This will appear at the top of your profile and replace any previously pinned Tweet.',
//     mainBtnLabel: 'Pin'
//   },
//   {
//     title: 'Unpin Tweet from profile?',
//     description:
//       'This will no longer appear automatically at the top of your profile.',
//     mainBtnLabel: 'Unpin'
//   }
// ];

// export function TweetActions({
//   isOwner,
//   ownerId,
//   tweetId,
//   parentId,
//   username,
//   hasImages,
//   viewTweet,
//   createdBy
// }: TweetActionsProps): JSX.Element {
//   const { user, isAdmin } = useAuth();
//   const { push } = useRouter();
//   const [selectedReport, setSelectedReport] = useState<string | null>(null);
//   const [reportCount, setReportCount] = useState<number>(0);

//   const {
//     open: removeOpen,
//     openModal: removeOpenModal,
//     closeModal: removeCloseModal
//   } = useModal();

//   const {
//     open: pinOpen,
//     openModal: pinOpenModal,
//     closeModal: pinCloseModal
//   } = useModal();

//   const {
//     open: reportOpen,
//     openModal: reportOpenModal,
//     closeModal: reportCloseModal
//   } = useModal();

//   const {
//     open: detailedReportOpen,
//     openModal: detailedReportOpenModal,
//     closeModal: detailedReportCloseModal
//   } = useModal();

//   const {
//     open: customReportOpen,
//     openModal: customReportOpenModal,
//     closeModal: customReportCloseModal
//   } = useModal();

//   const { id: userId, following, pinnedTweet } = user as User;

//   const isInAdminControl = isAdmin && !isOwner;
//   const tweetIsPinned = pinnedTweet === tweetId;

//   useEffect(() => {
//     const fetchReportCount = async () => {
//       const tweetRef = doc(tweetsCollection, tweetId);
//       const tweetSnapshot = await getDoc(tweetRef);
//       if (tweetSnapshot.exists()) {
//         const tweetData = tweetSnapshot.data() as Tweet;
//         setReportCount(tweetData.reportCount || 0);
//       }
//     };

//     fetchReportCount();
//   }, [tweetId]);

//   const handleRemove = async (): Promise<void> => {
//     if (viewTweet)
//       if (parentId) {
//         const parentSnapshot = await getDoc(doc(tweetsCollection, parentId));
//         if (parentSnapshot.exists()) {
//           await push(`/tweet/${parentId}`, undefined, { scroll: false });
//           delayScroll(200)();
//           await sleep(50);
//         } else await push('/home');
//       } else await push('/home');

//     await Promise.all([
//       removeTweet(tweetId),
//       manageTotalTweets('decrement', ownerId),
//       hasImages && manageTotalPhotos('decrement', createdBy),
//       parentId && manageReply('decrement', parentId)
//     ]);

//     toast.success(
//       `${isInAdminControl ? `@${username}'s` : 'Your'} Tweet was deleted`
//     );

//     removeCloseModal();
//   };

//   const handlePin = async (): Promise<void> => {
//     await managePinnedTweet(tweetIsPinned ? 'unpin' : 'pin', userId, tweetId);
//     toast.success(
//       `Your tweet was ${tweetIsPinned ? 'unpinned' : 'pinned'} to your profile`
//     );
//     pinCloseModal();
//   };

//   const handleFollow =
//     (closeMenu: () => void, ...args: Parameters<typeof manageFollow>) =>
//     async (): Promise<void> => {
//       const [type] = args;

//       closeMenu();
//       await manageFollow(...args);

//       toast.success(
//         `You ${type === 'follow' ? 'followed' : 'unfollowed'} @${username}`
//       );
//     };

//   const userIsFollowed = following.includes(createdBy);

//   const currentPinModalData = useMemo(
//     () => pinModalData[+tweetIsPinned],
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     [pinOpen]
//   );

//   const reportOptions = [
//     'It\'s spam',
//     'Nudity or sexual activity',
//     'Hate speech or symbols',
//     'Violence or dangerous organizations',
//     'Sale of illegal or regulated goods',
//     'Bullying or harassment',
//     'Intellectual property violation',
//     'Suicide or self-injury',
//     'Eating disorders',
//     'Scam or fraud',
//     'Drugs',
//     'False information',
//     'I just don\'t like it',
//     'Other'
//   ];

//   const handleReportClick = (option: string) => {
//     setSelectedReport(option);
//     reportCloseModal();
//     detailedReportOpenModal();
//   };

//   const handleSendReport = async () => {
//     const tweetRef = doc(tweetsCollection, tweetId);
//     await updateDoc(tweetRef, {
//       reportCount: increment(1)
//     });

//     const newReportCount = reportCount + 1;
//     setReportCount(newReportCount);

//     if (newReportCount >= 10) {
//       toast.success('This tweet has been reported 10 times.');
//       // Add any additional action if necessary, like flagging the tweet
//     } else {
//       toast.success('Report submitted successfully!');
//     }

//     detailedReportCloseModal();
//   };

//   const handleCustomReport = () => {
//     customReportOpenModal();
//   };

//   const handleReportGuidelines = () => {
//     push('/trends');  // Navigate to the trends page
//   };

//   return (
//     <>
//       <Modal
//         modalClassName='max-w-xs bg-main-background w-full p-8 rounded-2xl'
//         open={removeOpen}
//         closeModal={removeCloseModal}
//       >
//         <ActionModal
//           title='Delete Tweet?'
//           description={`This can’t be undone and it will be removed from ${
//             isInAdminControl ? `@${username}'s` : 'your'
//           } profile, the timeline of any accounts that follow ${
//             isInAdminControl ? `@${username}` : 'you'
//           }, and from Twitter search results.`}
//           mainBtnClassName='bg-accent-red hover:bg-accent-red/90 active:bg-accent-red/75 accent-tab
//                             focus-visible:bg-accent-red/90'
//           mainBtnLabel='Delete'
//           focusOnMainBtn
//           action={handleRemove}
//           closeModal={removeCloseModal}
//         />
//       </Modal>
//       <Modal
//         modalClassName='max-w-xs bg-main-background w-full p-8 rounded-2xl'
//         open={pinOpen}
//         closeModal={pinCloseModal}
//       >
//         <ActionModal
//           {...currentPinModalData}
//           mainBtnClassName='bg-accent-blue hover:bg-accent-blue/90 active:bg-accent-blue/75 accent-tab
//                             focus-visible:bg-accent-blue/90'
//           focusOnMainBtn
//           action={handlePin}
//           closeModal={pinCloseModal}
//         />
//       </Modal>
//       <Modal
//         modalClassName='max-w-md bg-main-background w-full p-8 rounded-2xl'
//         open={reportOpen}
//         closeModal={reportCloseModal}
//       >
//         <div className="space-y-4">
//           <h2 className="text-xl font-semibold text-center">Report Tweet</h2>
//           <div className="flex flex-col gap-2">
//             {reportOptions.map((option) => (
//               <Button
//                 key={option}
//                 onClick={() => handleReportClick(option)}
//                 className="text-left p-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100"
//               >
//                 {option}
//               </Button>
//             ))}
//             <Button
//               onClick={handleCustomReport}
//               className="text-left p-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100"
//             >
//               Other
//             </Button>
//           </div>
//         </div>
//       </Modal>
//       <Modal
//         modalClassName='max-w-md bg-main-background w-full p-8 rounded-2xl'
//         open={detailedReportOpen}
//         closeModal={detailedReportCloseModal}
//       >
//         <div className="space-y-4">
//           <h2 className="text-xl font-semibold text-center">Report Details</h2>
//           <p className="text-center text-gray-600">Why are you reporting this tweet?</p>
//           <div className="flex flex-col gap-2">
//             <Button
//               onClick={() => handleSendReport()}
//               className="text-left p-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100"
//             >
//               {selectedReport}
//             </Button>
//             <Button
//               onClick={customReportOpenModal}
//               className="text-left p-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100"
//             >
//               Other
//             </Button>
//           </div>
//         </div>
//       </Modal>
//       <Modal
//         modalClassName='max-w-md bg-main-background w-full p-8 rounded-2xl'
//         open={customReportOpen}
//         closeModal={customReportCloseModal}
//       >
//         <div className="space-y-4">
//           <h2 className="text-xl font-semibold text-center">Custom Report</h2>
//           <textarea
//             rows={4}
//             placeholder="Describe your issue here..."
//             className="w-full p-2 border border-gray-300 rounded-md bg-white"
//           />
//           <div className="flex flex-col gap-2">
//             <Button
//               onClick={handleSendReport}
//               className="bg-accent-blue text-white p-2 rounded-md hover:bg-accent-blue/90"
//             >
//               Submit Report
//             </Button>
//             <div className="flex flex-col text-sm text-gray-600">
//               <p>By submitting, you agree to the</p>
//               <button
//                 className="text-accent-blue"
//                 onClick={handleReportGuidelines}
//               >
//                 Report Guidelines
//               </button>
//             </div>
//           </div>
//         </div>
//       </Modal>
//       <Popover>
//         {({ open, close }): JSX.Element => (
//           <>
//             <Popover.Button
//               as={Button}
//               className={cn(
//                 `main-tab group group absolute top-2 right-2 p-2 
//                  hover:bg-accent-blue/10 focus-visible:bg-accent-blue/10
//                  focus-visible:!ring-accent-blue/80 active:bg-accent-blue/20`,
//                 open && 'bg-accent-blue/10 [&>div>svg]:text-accent-blue'
//               )}
//             >
//               <div className='group relative'>
//                 <HeroIcon
//                   className='h-5 w-5 text-light-secondary group-hover:text-accent-blue
//                              group-focus-visible:text-accent-blue dark:text-dark-secondary/80'
//                   iconName='EllipsisHorizontalIcon'
//                 />
//                 {!open && <ToolTip tip='More' />}
//               </div>
//             </Popover.Button>
//             <AnimatePresence>
//               {open && (
//                 <Popover.Panel
//                   className='menu-container group absolute top-[50px] right-2 whitespace-nowrap text-light-primary 
//                              dark:text-dark-primary'
//                   as={motion.div}
//                   {...variants}
//                   static
//                 >
//                   {(isAdmin || isOwner) && (
//                     <Popover.Button
//                       className='accent-tab flex w-full gap-3 rounded-md rounded-b-none p-4 text-accent-red
//                                  hover:bg-main-sidebar-background'
//                       as={Button}
//                       onClick={preventBubbling(removeOpenModal)}
//                     >
//                       <HeroIcon iconName='TrashIcon' />
//                       Delete
//                     </Popover.Button>
//                   )}
//                   {isOwner ? (
//                     <Popover.Button
//                       className='accent-tab flex w-full gap-3 rounded-md rounded-t-none p-4 hover:bg-main-sidebar-background'
//                       as={Button}
//                       onClick={preventBubbling(pinOpenModal)}
//                     >
//                       {tweetIsPinned ? (
//                         <>
//                           <CustomIcon iconName='PinOffIcon' />
//                           Unpin from profile
//                         </>
//                       ) : (
//                         <>
//                           <CustomIcon iconName='PinIcon' />
//                           Pin to your profile
//                         </>
//                       )}
//                     </Popover.Button>
//                   ) : userIsFollowed ? (
//                     <Popover.Button
//                       className='accent-tab flex w-full gap-3 rounded-md rounded-t-none p-4 hover:bg-main-sidebar-background'
//                       as={Button}
//                       onClick={preventBubbling(
//                         handleFollow(close, 'unfollow', userId, createdBy)
//                       )}
//                     >
//                       <HeroIcon iconName='UserMinusIcon' />
//                       Unfollow @{username}
//                     </Popover.Button>
//                   ) : (
//                     <Popover.Button
//                       className='accent-tab flex w-full gap-3 rounded-md rounded-t-none p-4 hover:bg-main-sidebar-background'
//                       as={Button}
//                       onClick={preventBubbling(
//                         handleFollow(close, 'follow', userId, createdBy)
//                       )}
//                     >
//                       <HeroIcon iconName='UserPlusIcon' />
//                       Follow @{username}
//                     </Popover.Button>
//                   )}
//                   <Popover.Button
//                     className='accent-tab flex w-full gap-3 rounded-md rounded-t-none p-4 hover:bg-main-sidebar-background'
//                     as={Button}
//                     onClick={preventBubbling(reportOpenModal)}
//                   >
//                     <HeroIcon iconName='FlagIcon' />
//                     Report
//                   </Popover.Button>
//                 </Popover.Panel>
//               )}
//             </AnimatePresence>
//           </>
//         )}
//       </Popover>
//     </>
//   );
// }











