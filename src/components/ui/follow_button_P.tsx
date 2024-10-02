import { useState } from 'react';
import { useAuth } from '@lib/context/auth-context';
import { useModal } from '@lib/hooks/useModal';
import { manageFollow, manageBlock, manageCloseFriends, manageFavorite, manageRestrict } from '@lib/firebase/utils';
import { preventBubbling } from '@lib/utils';
import { Modal } from '@components/modal/modal';
import { ActionModal } from '@components/modal/action-modal';
import { Button } from '@components/ui/button';
import { ToolTip } from '@components/ui/tooltip';
import { HiBan } from 'react-icons/hi';
import cn from 'clsx';
import { SubscribeModal } from '../modal/creator_subscriptions';

type FollowButtonProps = {
  userTargetId: string;
  userTargetUsername: string;
  secondaryBtnClassName?: string;
};

export function FollowButton({
  userTargetId,
  userTargetUsername,
  secondaryBtnClassName,
}: FollowButtonProps): JSX.Element | null {
  const { user } = useAuth();
  const { open: openFollowModal, openModal: openFollow, closeModal: closeFollow } = useModal();
  const { open: openBlockModal, openModal: openBlock, closeModal: closeBlock } = useModal();
  const { open: openSubscribeModal, openModal: openSubscribe, closeModal: closeSubscribe } = useModal();
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  if (user?.id === userTargetId) return null;

  const { id: userId, following, blockedUsers, closeFriends, favorites, restrictedUsers } = user ?? {};

  const handleFollow = (): Promise<void> =>
    manageFollow('follow', userId as string, userTargetId);

  const handleUnfollow = async (): Promise<void> => {
    await manageFollow('unfollow', userId as string, userTargetId);
    closeFollow();
  };

  const handleBlock = async (): Promise<void> => {
    await manageBlock('block', userId as string, userTargetId);
    closeBlock();
  };

  const handleUnblock = async (): Promise<void> => {
    await manageBlock('unblock', userId as string, userTargetId);
    closeBlock();
  };

  const handleAddToCloseFriends = async (): Promise<void> => {
    await manageCloseFriends('add', userId as string, userTargetId);
  };

  const handleRemoveFromCloseFriends = async (): Promise<void> => {
    await manageCloseFriends('remove', userId as string, userTargetId);
  };

  const handleAddToFavorite = async (): Promise<void> => {
    await manageFavorite('add', userId as string, userTargetId);
  };

  const handleRemoveFromFavorite = async (): Promise<void> => {
    await manageFavorite('remove', userId as string, userTargetId);
  };

  const handleRestrict = async (): Promise<void> => {
    await manageRestrict('restrict', userId as string, userTargetId);
  };

  const handleUnrestrict = async (): Promise<void> => {
    await manageRestrict('unrestrict', userId as string, userTargetId);
  };

  const userIsFollowed = !!following?.includes(userTargetId ?? '');
  const userIsBlocked = !!blockedUsers?.includes(userTargetId ?? '');
  const userIsCloseFriend = !!closeFriends?.includes(userTargetId ?? '');
  const userIsFavorite = !!favorites?.includes(userTargetId ?? '');
  const userIsRestricted = !!restrictedUsers?.includes(userTargetId ?? '');

  return (
    <>
      <Modal
        modalClassName='flex flex-col gap-6 max-w-xs bg-main-background w-full p-8 rounded-2xl'
        open={openFollowModal}
        closeModal={closeFollow}
      >
        <ActionModal
          title={`@${userTargetUsername}?`}
          mainBtnLabel='Unfollow'
          action={handleUnfollow}
          closeModal={closeFollow}
        />
        <div className='flex flex-col gap-4'>
          {showMoreOptions ? (
            <>
              <Button
                className={cn(
                  'border border-light-line-reply dark:border-light-secondary dark:text-light-border',
                  secondaryBtnClassName ??
                    `hover:bg-light-primary/10 focus-visible:bg-light-primary/10 active:bg-light-primary/20
                     dark:hover:bg-light-border/10 dark:focus-visible:bg-light-border/10 dark:active:bg-light-border/20`
                )}
                onClick={userIsCloseFriend ? handleRemoveFromCloseFriends : handleAddToCloseFriends}
              >
                {userIsCloseFriend ? 'Remove from close friends' : 'Add to close friends list'}
              </Button>
              <Button
                className={cn(
                  'border border-light-line-reply dark:border-light-secondary dark:text-light-border',
                  secondaryBtnClassName ??
                    `hover:bg-light-primary/10 focus-visible:bg-light-primary/10 active:bg-light-primary/20
                     dark:hover:bg-light-border/10 dark:focus-visible:bg-light-border/10 dark:active:bg-light-border/20`
                )}
                onClick={userIsFavorite ? handleRemoveFromFavorite : handleAddToFavorite}
              >
                {userIsFavorite ? 'Remove from favorites' : 'Add to favorite'}
              </Button>
              <Button
                className={cn(
                  'border border-light-line-reply dark:border-light-secondary dark:text-light-border',
                  secondaryBtnClassName ??
                    `hover:bg-light-primary/10 focus-visible:bg-light-primary/10 active:bg-light-primary/20
                     dark:hover:bg-light-border/10 dark:focus-visible:bg-light-border/10 dark:active:bg-light-border/20`
                )}
                onClick={userIsRestricted ? handleUnrestrict : handleRestrict}
              >
                {userIsRestricted ? 'Unrestrict' : 'Restrict'}
              </Button>
              <Button
                className={cn(
                  'border border-light-line-reply dark:border-light-secondary dark:text-light-border',
                  secondaryBtnClassName ??
                    `hover:bg-light-primary/10 focus-visible:bg-light-primary/10 active:bg-light-primary/20
                     dark:hover:bg-light-border/10 dark:focus-visible:bg-light-border/10 dark:active:bg-light-border/20`
                )}
                onClick={() => setShowMoreOptions(false)}
              >
                Close
              </Button>
            </>
          ) : (
            <div>
              <Button
                className='openBlockHiBa dark-bg-tab group relative cursor-pointer border border-light-line-reply p-2 hover:bg-light-primary/10 active:bg-light-primary/20 dark:border-light-secondary dark:hover:bg-dark-primary/10 dark:active:bg-dark-primary/20'
                onClick={preventBubbling(openBlock)}
              >
                Block User
              </Button>
              <br />
              <Button
                className='openBlockHiBa dark-bg-tab group relative cursor-pointer border border-light-line-reply p-2 hover:bg-light-primary/10 active:bg-light-primary/20 dark:border-light-secondary dark:hover:bg-dark-primary/10 dark:active:bg-dark-primary/20'
                onClick={() => setShowMoreOptions(true)}
              >
                See More
              </Button>
            </div>
          )}
        </div>
      </Modal>

      <Modal
        modalClassName='flex flex-col gap-6 max-w-xs bg-main-background w-full p-8 rounded-2xl'
        open={openBlockModal}
        closeModal={closeBlock}
      >
        <ActionModal
          title={`Block @${userTargetUsername}?`}
          description='They will not be able to see your Tweets, follow you, or message you. You will not see their Tweets, replies, or messages.'
          mainBtnLabel='Block'
          action={handleBlock}
          closeModal={closeBlock}
        />
      </Modal>

      <Modal
        modalClassName='flex items-start justify-center'
        open={openSubscribeModal}
        closeModal={closeSubscribe}
      >
        <SubscribeModal closeModal={closeSubscribe} tweetUserData={{ userTargetId, userTargetUsername }} />
      </Modal>

      {userIsBlocked ? (
        <Button
          className='self-start border bg-light-primary px-4 py-1.5 font-bold text-white hover:bg-light-primary/90 focus-visible:bg-light-primary/90 active:bg-light-border/75 dark:bg-light-border dark:text-light-primary dark:hover:bg-light-border/90 dark:focus-visible:bg-light-border/90 dark:active:bg-light-border/75'
          onClick={preventBubbling(handleUnblock)}
        >
          Unblock
        </Button>
      ) : (
        <>
          {userIsFollowed ? (
            <div className="flex items-center">
              <Button
                className='SubscribeButtoUnblockn12 text-main-accent dark-bg-tab min-w-[36px] self-start border border-light-line-reply px-4 py-1.5 font-bold hover:border-accent focus-visible:border-accent dark:border-light-secondary dark:text-light-border
                dark-bg-tab group relative border border-light-line-reply p-2
                                 hover:bg-light-primary/10 active:bg-light-primary/20 dark:border-light-secondary 
                                 dark:hover:bg-dark-primary/10 dark:active:bg-dark-primary/20'
                onClick={preventBubbling(openFollow)}
              >
                  <svg
          className='SubscribeButtoUnblockn12svg'
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
          <path d="M14 6c0 2.21-1.791 4-4 4S6 8.21 6 6s1.791-4 4-4 4 1.79 4 4zm-4 5c-2.352 0-4.373.85-5.863 2.44-1.477 1.58-2.366 3.8-2.632 6.46l-.11 1.1h17.21l-.11-1.1c-.266-2.66-1.155-4.88-2.632-6.46C14.373 11.85 12.352 11 10 11zm12.223-5.89l-2.969 4.46L17.3 8.1l-1.2 1.6 3.646 2.73 4.141-6.21-1.664-1.11z"></path>
          </g>
        </svg>
              </Button>
              <Button
                className='SubscribeButton12 text-main-accent dark-bg-tab min-w-[106px] self-start border border-light-line-reply px-4 py-1.5 font-bold hover:border-accent focus-visible:border-accent dark:border-light-secondary dark:text-light-border'
                onClick={preventBubbling(openSubscribe)}
              >
                Subscribe
              </Button>
            </div>
          ) : (
            <Button
              className='self-start border bg-light-primary px-4 py-1.5 font-bold text-white hover:bg-light-primary/90 focus-visible:bg-light-primary/90 active:bg-light-border/75 dark:bg-light-border dark:text-light-primary dark:hover:bg-light-border/90 dark:focus-visible:bg-light-border/90 dark:active:bg-light-border/75'
              onClick={preventBubbling(handleFollow)}
            >
              Follow
            </Button>
          )}
        </>
      )}
    </>
  );
}
