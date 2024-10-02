import { useAuth } from '@lib/context/auth-context';
import { useModal } from '@lib/hooks/useModal';
import { manageFollow, manageBlock } from '@lib/firebase/utils';
import { preventBubbling } from '@lib/utils';
import { Modal } from '@components/modal/modal';
import { ActionModal } from '@components/modal/action-modal';
import { Button } from '@components/ui/button';

type blockButtonProps = {
  userTargetId: string;
  userTargetUsername: string;
};

export function blockButton({
  userTargetId,
  userTargetUsername
}: blockButtonProps): JSX.Element | null {
  const { user } = useAuth();

  const { open: openBlockModal, openModal: openBlock, closeModal: closeBlock } = useModal();

  if (user?.id === userTargetId) return null;

  const { id: userId,  blockedUsers } = user ?? {};

  
  const handleBlock = async (): Promise<void> => {
    await manageBlock('block', userId as string, userTargetId);
    closeBlock();
  };

  const handleUnblock = async (): Promise<void> => {
    await manageBlock('unblock', userId as string, userTargetId);
    closeBlock();
  };

  const userIsBlocked = !!blockedUsers?.includes(userTargetId ?? '');

  return (
    <>
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
          className='self-start border bg-light-primary px-4 py-1.5 font-bold text-white hover:bg-light-primary/90 
                     focus-visible:bg-light-primary/90 active:bg-light-border/75 dark:bg-light-border 
                     dark:text-light-primary dark:hover:bg-light-border/90 dark:focus-visible:bg-light-border/90 
                     dark:active:bg-light-border/75'
          onClick={preventBubbling(handleUnblock)}
        >
          Unblock
        </Button>
      ) : (
        <>
          <Button
            className='ml-2 self-start border bg-light-primary px-4 py-1.5 font-bold text-white hover:bg-light-primary/90 
                       focus-visible:bg-light-primary/90 active:bg-light-border/75 dark:bg-light-border 
                       dark:text-light-primary dark:hover:bg-light-border/90 dark:focus-visible:bg-light-border/90 
                       dark:active:bg-light-border/75'
            onClick={preventBubbling(openBlock)}
          >
            Block
          </Button>
        </>
      )}
    </>
  );
}
