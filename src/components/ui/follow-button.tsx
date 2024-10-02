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
              onClick={userIsCloseFriend ? handleRemoveFromCloseFriends : handleAddToCloseFriends}>
             {userIsCloseFriend ? 'Remove from close friends' : 'Add to close friends list'}
              </Button>
              <Button
               className={cn(
               'border border-light-line-reply dark:border-light-secondary dark:text-light-border',
               secondaryBtnClassName ??
               `hover:bg-light-primary/10 focus-visible:bg-light-primary/10 active:bg-light-primary/20
                 dark:hover:bg-light-border/10 dark:focus-visible:bg-light-border/10 dark:active:bg-light-border/20`
                  )}
              onClick={userIsFavorite ? handleRemoveFromFavorite : handleAddToFavorite}>
                {userIsFavorite ? 'Remove from favorites' : 'Add to favorite'}
              </Button>
              {/* <Button className='ActionModalButoonmodal'>
                <p className='ActionModalButoonmodalText'>Mute</p>
              </Button> */}
              <Button
                             className={cn(
                'border border-light-line-reply dark:border-light-secondary dark:text-light-border',
                secondaryBtnClassName ??
                  `hover:bg-light-primary/10 focus-visible:bg-light-primary/10 active:bg-light-primary/20
                   dark:hover:bg-light-border/10 dark:focus-visible:bg-light-border/10 dark:active:bg-light-border/20`
              )}
              onClick={userIsRestricted ? handleUnrestrict : handleRestrict}>
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
            Block {userTargetUsername}?
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
            <Button
              className='text-main-accent dark-bg-tab min-w-[106px] self-start border border-light-line-reply px-4 py-1.5 font-bold hover:border-accent-red hover:bg-accent-red/10 hover:text-accent-red hover:before:content-["Unfollow"] inner:hover:hidden dark:border-light-secondary'
              onClick={preventBubbling(openFollow)}
            >
              <span>Following</span>
            </Button>
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
