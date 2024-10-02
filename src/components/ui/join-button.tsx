import { useAuth } from '@lib/context/auth-context';
import { useState } from 'react';
import { Button } from '@components/ui/button';
import { manageJoin } from '@lib/firebase/utils';  // Import the manageJoin function
import { addNotification } from '@lib/firebase/notifications'; // Import the addNotification function

type JoinButtonProps = {
  userTargetId: string;
  userTargetUsername: string;
};

export function JoinButton({
  userTargetId,
  userTargetUsername
}: JoinButtonProps): JSX.Element | null {
  const { user } = useAuth();
  const [hasJoined, setHasJoined] = useState(false);

  if (user?.id === userTargetId) return null; // Prevent user from joining themselves

  const handleJoin = async (): Promise<void> => {
    if (!user?.id) return; // Ensure the user is logged in

    // Perform join action
    await manageJoin('join', user.id, userTargetId);
    setHasJoined(true);

    // Add a notification after joining
    await addNotification(userTargetId, `${user.username} has joined.`);
  };

  const handleUnjoin = async (): Promise<void> => {
    if (!user?.id) return; // Ensure the user is logged in

    // Perform unjoin action
    await manageJoin('unjoin', user.id, userTargetId);
    setHasJoined(false);

    // Optional: Add a notification for unjoin if needed
    await addNotification(userTargetId, `${user.username} has unjoined.`);
  };

  return (
    <>
      {hasJoined ? (
        <Button
          className='text-main-accent dark-bg-tab min-w-[106px] self-start border border-light-line-reply px-4 py-1.5 
                     font-bold hover:border-accent-red hover:bg-accent-red/10 hover:text-accent-red
                     hover:before:content-["Joined"] inner:hover:hidden dark:border-light-secondary'
          onClick={handleUnjoin} // Unjoin action on click
        >
          <span>Joined</span>
        </Button>
      ) : (
        <Button
          className='self-start border bg-light-primary px-4 py-1.5 font-bold text-white hover:bg-light-primary/90 
                     focus-visible:bg-light-primary/90 active:bg-light-border/75 dark:bg-light-border 
                     dark:text-light-primary dark:hover:bg-light-border/90 dark:focus-visible:bg-light-border/90 
                     dark:active:bg-light-border/75'
          onClick={handleJoin} // Join action on click
        >
          Join
        </Button>
      )}
    </>
  );
}
