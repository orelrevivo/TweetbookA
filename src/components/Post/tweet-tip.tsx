import React, { useState } from 'react';
import Link from 'next/link';
import cn from 'clsx';
import { Popover } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuth } from '@lib/context/auth-context';
import { manageBookmark } from '@lib/firebase/utils';
import { preventBubbling } from '@lib/utils';
import { siteURL } from '@lib/env';
import { Button } from '@components/ui/button';
import { HeroIcon } from '@components/ui/hero-icon';
import { ToolTip } from '@components/ui/tooltip';
import { variants } from './tweet-actions';

type TweetShareProps = {
  userId: string;
  tweetId: string;
  viewTweet?: boolean;
};

export function Tweettip({
  userId,
  tweetId,
  viewTweet
}: TweetShareProps): JSX.Element {
  const { userBookmarks } = useAuth();
  const [showShareOptions, setShowShareOptions] = useState(false);

  const handleBookmark =
    (closeMenu: () => void, ...args: Parameters<typeof manageBookmark>) =>
    async (): Promise<void> => {
      const [type] = args;

      closeMenu();
      await manageBookmark(...args);

      toast.success(
        type === 'bookmark'
          ? (): JSX.Element => (
              <span className='flex gap-2'>
                Post added to your Bookmarks
                <Link href='/bookmarks'>
                  <a className='custom-underline font-bold'>View</a>
                </Link>
              </span>
            )
          : 'Post removed from your bookmarks'
      );
    };

  const handleCopy = (closeMenu: () => void) => async (): Promise<void> => {
    closeMenu();
    await navigator.clipboard.writeText(`${siteURL}/tweet/${tweetId}`);
    toast.success('Copied to clipboard');
  };

  const toggleShareOptions = () => {
    setShowShareOptions((prev) => !prev);
  };

  const tweetIsBookmarked = !!userBookmarks?.some(({ id }) => id === tweetId);

  return (
    <Popover className='relative'>
      {({ open, close }): JSX.Element => (
        <>
          <Popover.Button
            className={cn(
              `group relative flex items-center gap-1 p-0 outline-none 
               transition-none hover:text-accent-blue focus-visible:text-accent-blue`,
              open && 'text-accent-blue inner:bg-accent-blue/10'
            )}
          >
            <i
              className='relative rounded-full p-2 not-italic duration-200 group-hover:bg-accent-blue/10 
                         group-focus-visible:bg-accent-blue/10 group-focus-visible:ring-2 
                         group-focus-visible:ring-accent-blue/80 group-active:bg-accent-blue/20'
            >
              <HeroIcon
                className={viewTweet ? 'h-6 w-6' : 'h-5 w-5'}
                iconName='ArrowUpTrayIcon'
              />
              {!open && <ToolTip tip='Share' />}
            </i>
          </Popover.Button>
          <AnimatePresence>
            {open && (
              <Popover.Panel
                className='bg-main-background borderbox4 menu-container absolute w-60 xl:w-[240px]'
                as={motion.div}
                {...variants}
                static
              >
                {/* Existing Buttons */}
                <Popover.Button
                  className='accent-tab flex w-full gap-3 rounded-md rounded-b-none p-4 hover:bg-main-sidebar-background'
                  as={Button}
                  onClick={preventBubbling(handleCopy(close))}
                >
                  <HeroIcon iconName='LinkIcon' />
                  Copy link to Post
                </Popover.Button>
                {!tweetIsBookmarked ? (
                  <Popover.Button
                    className='accent-tab flex w-full gap-3 rounded-md rounded-t-none p-4 hover:bg-main-sidebar-background'
                    as={Button}
                    onClick={preventBubbling(
                      handleBookmark(close, 'bookmark', userId, tweetId)
                    )}
                  >
                    <HeroIcon iconName='BookmarkIcon' />
                    Bookmark
                  </Popover.Button>
                ) : (
                  <Popover.Button
                    className='accent-tab flex w-full gap-3 rounded-md rounded-t-none p-4 hover:bg-main-sidebar-background'
                    as={Button}
                    onClick={preventBubbling(
                      handleBookmark(close, 'unbookmark', userId, tweetId)
                    )}
                  >
                    <HeroIcon iconName='BookmarkSlashIcon' />
                    Remove Tweet from Bookmarks
                  </Popover.Button>
                )}

                {/* New Share Button */}
                <Popover.Button
                  className='accent-tab flex w-full gap-3 rounded-md rounded-t-none p-4 hover:bg-main-sidebar-background'
                  as={Button}
                  onClick={preventBubbling(toggleShareOptions)}
                >
                  <HeroIcon iconName='ShareIcon' />
                  Share
                </Popover.Button>

                {/* Social Media Share Options */}
                {showShareOptions && (
                  <div
                    className='ShareWhiteSociia fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                    w-42 h-92 bg-main-background p-4 rounded-md shadow-lg flex flex-col justify-center items-center space-y-2'
                  >
                    <a
                      href={`https://twitter.com/intent/tweet?url=${siteURL}/Post/${tweetId}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center gap-2 hover:bg-main-sidebar-background p-2 rounded-md'
                    >
                      Share with X
                    </a>
                    <a
                      href={`https://t.me/share/url?url=${siteURL}/Post/${tweetId}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center gap-2 hover:bg-main-sidebar-background p-2 rounded-md'
                    >
                      Share with Telegram
                    </a>
                    <a
                      href={`https://www.linkedin.com/shareArticle?mini=true&url=${siteURL}/Post/${tweetId}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center gap-2 hover:bg-main-sidebar-background p-2 rounded-md'
                    >
                      Share with LinkedIn
                    </a>
                    <a
                      href={`https://reddit.com/submit?url=${siteURL}/Post/${tweetId}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center gap-2 hover:bg-main-sidebar-background p-2 rounded-md'
                    >
                      Share with Reddit
                    </a>
                    <a
                      href={`https://pinterest.com/pin/create/button/?url=${siteURL}/Post/${tweetId}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center gap-2 hover:bg-main-sidebar-background p-2 rounded-md'
                    >
                      Share with Pinterest
                    </a>
                    <a
                      href={`https://line.me/R/msg/text/?${siteURL}/Post/${tweetId}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center gap-2 hover:bg-main-sidebar-background p-2 rounded-md'
                    >
                      Share with Line
                    </a>
                    <a
                      href={`mailto:?subject=Check out this tweet&body=${siteURL}/Post/${tweetId}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center gap-2 hover:bg-main-sidebar-background p-2 rounded-md'
                    >
                      Share with Email
                    </a>
                  </div>
                )}
              </Popover.Panel>
            )}
          </AnimatePresence>
        </>
      )}
    </Popover>
  );
}

// import Link from 'next/link';
// import cn from 'clsx';
// import { Popover } from '@headlessui/react';
// import { AnimatePresence, motion } from 'framer-motion';
// import { toast } from 'react-hot-toast';
// import { useAuth } from '@lib/context/auth-context';
// import { manageBookmark } from '@lib/firebase/utils';
// import { preventBubbling } from '@lib/utils';
// import { siteURL } from '@lib/env';
// import { Button } from '@components/ui/button';
// import { HeroIcon } from '@components/ui/hero-icon';
// import { ToolTip } from '@components/ui/tooltip';
// import { variants } from './tweet-actions';

// type TweetShareProps = {
//   userId: string;
//   tweetId: string;
//   viewTweet?: boolean;
// };

// export function Tweettip({
//   userId,
//   tweetId,
//   viewTweet
// }: TweetShareProps): JSX.Element {
//   const { userBookmarks } = useAuth();

//   const handleBookmark =
//     (closeMenu: () => void, ...args: Parameters<typeof manageBookmark>) =>
//     async (): Promise<void> => {
//       const [type] = args;

//       closeMenu();
//       await manageBookmark(...args);

//       toast.success(
//         type === 'bookmark'
//           ? (): JSX.Element => (
//               <span className='flex gap-2'>
//                 Tweet added to your Bookmarks
//                 <Link href='/bookmarks'>
//                   <a className='custom-underline font-bold'>View</a>
//                 </Link>
//               </span>
//             )
//           : 'Tweet removed from your bookmarks'
//       );
//     };

//   const handleCopy = (closeMenu: () => void) => async (): Promise<void> => {
//     closeMenu();
//     await navigator.clipboard.writeText(`${siteURL}/tweet/${tweetId}`);
//     toast.success('Copied to clipboard');
//   };

//   const tweetIsBookmarked = !!userBookmarks?.some(({ id }) => id === tweetId);

//   return (
//     <Popover className='relative'>
//       {({ open, close }): JSX.Element => (
//         <>
//           <Popover.Button
//             className={cn(
//               `group relative flex items-center gap-1 p-0 outline-none 
//                transition-none hover:text-accent-blue focus-visible:text-accent-blue`,
//               open && 'text-accent-blue inner:bg-accent-blue/10'
//             )}
//           >
//             <i
//               className='relative rounded-full p-2 not-italic duration-200 group-hover:bg-accent-blue/10 
//                          group-focus-visible:bg-accent-blue/10 group-focus-visible:ring-2 
//                          group-focus-visible:ring-accent-blue/80 group-active:bg-accent-blue/20'
//             >
//               <HeroIcon
//                 className={viewTweet ? 'h-6 w-6' : 'h-5 w-5'}
//                 iconName='ArrowUpTrayIcon'
//               />
//               {!open && <ToolTip tip='Share' />}
//             </i>
//           </Popover.Button>
//           <AnimatePresence>
//             {open && (
//               <Popover.Panel
//                 className='menu-container234  bg-main-background group absolute top-11 whitespace-nowrap text-light-primary dark:text-dark-primary'
//                 as={motion.div}
//                 {...variants}
//                 static
//               >
//                 <Popover.Button
//                   className='accent-tab flex w-full gap-3 rounded-md rounded-b-none p-4 hover:bg-main-sidebar-background'
//                   as={Button}
//                   onClick={preventBubbling(handleCopy(close))}
//                 >
//                   <HeroIcon iconName='LinkIcon' />
//                   Copy link to Tweet
//                 </Popover.Button>
//                 {!tweetIsBookmarked ? (
//                   <Popover.Button
//                     className='accent-tab flex w-full gap-3 rounded-md rounded-t-none p-4 hover:bg-main-sidebar-background'
//                     as={Button}
//                     onClick={preventBubbling(
//                       handleBookmark(close, 'bookmark', userId, tweetId)
//                     )}
//                   >
//                     <HeroIcon iconName='BookmarkIcon' />
//                     Bookmark
//                   </Popover.Button>
//                 ) : (
//                   <Popover.Button
//                     className='accent-tab flex w-full gap-3 rounded-md rounded-t-none p-4 hover:bg-main-sidebar-background'
//                     as={Button}
//                     onClick={preventBubbling(
//                       handleBookmark(close, 'unbookmark', userId, tweetId)
//                     )}
//                   >
//                     <HeroIcon iconName='BookmarkSlashIcon' />
//                     Remove Tweet from Bookmarks
//                   </Popover.Button>
//                 )}
//               </Popover.Panel>
//             )}
//           </AnimatePresence>
//         </>
//       )}
//     </Popover>
//   );
// }
