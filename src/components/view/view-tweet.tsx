import Link from 'next/link';
import { motion } from 'framer-motion';
import cn from 'clsx';
import { useAuth } from '@lib/context/auth-context';
import { useModal } from '@lib/hooks/useModal';
import { Modal } from '@components/modal/modal';
import { TweetReplyModal } from '@components/modal/tweet-reply-modal';
import { ImagePreview } from '@components/input/image-preview';
import { UserAvatar } from '@components/user/user-avatar';
import { UserTooltip } from '@components/user/user-tooltip';
import { UserName } from '@components/user/user-name';
import { UserUsername } from '@components/user/user-username';
import { variants } from '@components/Post/tweet';
import { TweetActions } from '@components/Post/tweet-actions';
import { TweetStats } from '@components/Post/tweet-stats';
import { TweetDate } from '@components/Post/tweet-date';
import { Input } from '@components/input/input';
import React, { useState, RefObject, useEffect } from 'react';
import type { User } from '@lib/types/user';
import type { Tweet } from '@lib/types/tweet';
import { SubscribeModal } from '../modal/creator_subscriptions';
type ViewTweetProps = Tweet & {
  user: User;
  viewTweetRef?: RefObject<HTMLElement>;
};

export function ViewTweet(tweet: ViewTweetProps): JSX.Element {
  const {
    id: tweetId,
    text,
    images,
    parent,
    userLikes,
    createdBy,
    createdAt,
    userRetweets,
    userReplies,
    viewTweetRef,
    user: tweetUserData
  } = tweet;

  const { id: ownerId, name, username, verified, photoURL } = tweetUserData;
  const { user } = useAuth();
  const { open, openModal, closeModal } = useModal();
  const [isSubscribeModalOpen, setSubscribeModalOpen] = useState(false);

  const tweetLink = `/Post/${tweetId}`;
  const userId = user?.id as string;
  const isOwner = userId === createdBy;
  const reply = !!parent;
  const { id: parentId, username: parentUsername = username } = parent ?? {};

  const handleSubscribeClick = () => {
    setSubscribeModalOpen(true);
  };

  const closeSubscribeModal = () => {
    setSubscribeModalOpen(false);
  };

  // Make the Subscribe button more difficult to click
  const handleDifficultSubscribeClick = (event: React.MouseEvent) => {
    event.preventDefault();
    const isDifficult = Math.random() > 0.5;
    if (isDifficult) {
      console.log('Click blocked! Try again.');
      return;
    }
    handleSubscribeClick();
  };

  const renderTextWithHashtags = (text: string) => {
    const hashtagRegex = /#(\w+)/g;
    const parts = text.split(hashtagRegex);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        // This is a hashtag
        return (
          <Link key={index} href={`/Trends/Hashtag/${part}`}>
            <a className='custom-underline text-main-accent'>#{part}</a>
          </Link>
        );
      }
      return part; // Return regular text
    });
  };

  return (
    <motion.article
      className={cn(
        `accent-tab h- relative flex cursor-default flex-col gap-3 border-b
         border-light-border px-4 py-3 outline-none dark:border-dark-border`,
        reply && 'scroll-m-[3.25rem] pt-0'
      )}
      {...variants}
      animate={{ ...variants.animate, transition: { duration: 0.2 } }}
      exit={undefined}
      ref={viewTweetRef}
    >
      {/* Tweet reply modal */}
      <Modal
        className='flex items-start justify-center'
        modalClassName='bg-main-background rounded-2xl max-w-xl w-full mt-8 overflow-hidden'
        open={open}
        closeModal={closeModal}
      >
        <TweetReplyModal tweet={tweet} closeModal={closeModal} />
      </Modal>

      {/* Subscribe Modal */}
      <Modal
        className='flex items-start justify-center'
        modalClassName=''
        open={isSubscribeModalOpen}
        closeModal={closeSubscribeModal}
      >
        <SubscribeModal closeModal={closeModal} tweetUserData={tweetUserData} />
      </Modal>

      <div className='flex flex-col gap-2'>
        {reply && (
          <div className='flex w-12 items-center justify-center'>
            <i className='hover-animation h-2 w-0.5 bg-light-line-reply dark:bg-dark-line-reply' />
          </div>
        )}
        <div className='grid grid-cols-[auto,1fr] gap-3'>
          <UserTooltip avatar {...tweetUserData}>
            <UserAvatar src={photoURL} alt={name} username={username} />
          </UserTooltip>
          <div className='flex min-w-0 justify-between'>
            <div className='flex flex-col truncate xs:overflow-visible xs:whitespace-normal'>
              <UserTooltip {...tweetUserData}>
                <UserName
                  className='-mb-1'
                  name={name}
                  username={username}
                  verified={verified}
                />
              </UserTooltip>
              <UserTooltip {...tweetUserData}>
                <UserUsername username={username} />
              </UserTooltip>
            </div>
            <div className='px-4'>
              <TweetActions
                viewTweet
                isOwner={isOwner}
                ownerId={ownerId}
                tweetId={tweetId}
                parentId={parentId}
                username={username}
                hasImages={!!images}
                createdBy={createdBy}
              />
              <button
                className='Subscribebutton'
                onClick={handleDifficultSubscribeClick}
              >
                <span className='SubscribeSpan'>Subscribe</span>
              </button>
            </div>
          </div>
        </div>
      </div>
          <hr className='border-light-border dark:border-dark-border border-1 xs:border'/>
      {reply && (
        <p className='text-light-secondary dark:text-dark-secondary'>
          Replying to{' '}
          <Link href={`/user/${parentUsername}`}>
            <a className='custom-underline text-main-accent'>
              @{parentUsername}
            </a>
          </Link>
        </p>
      )}

      <div>
        {text && (
          <p className='whitespace-pre-line break-words text-2xl'>
            {renderTextWithHashtags(text)}
          </p>
        )}
        {images && (
          <ImagePreview
            viewTweet
            imagesPreview={images}
            previewCount={images.length}
          />
        )}

        <div
          className='inner:hover-animation inner:border-b inner:border-light-border
                     dark:inner:border-dark-border'
        >
          <TweetDate viewTweet tweetLink={tweetLink} createdAt={createdAt} />
          <TweetStats
            viewTweet
            reply={reply}
            userId={userId}
            isOwner={isOwner}
            tweetId={tweetId}
            userLikes={userLikes}
            userRetweets={userRetweets}
            userReplies={userReplies}
            openModal={openModal}
          />
        </div>
        <div className='Inputparent'>
        <Input reply parent={{ id: tweetId, username: username }} />
        </div>
      </div>
    </motion.article>
  );
}
