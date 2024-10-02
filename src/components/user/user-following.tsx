import { useAuth } from '@lib/context/auth-context';

type UserFollowingProps = {
  userTargetId: string;
};

export function UserFollowing({
  userTargetId
}: UserFollowingProps): JSX.Element | null {
  const { user } = useAuth();

  // Check if the userTargetId is following the current user (Follows you)
  const followsYou = user?.followers.includes(userTargetId);
  
  // Check if the current user is following the userTargetId
  const youFollow = user?.following.includes(userTargetId);

  // If neither condition is met, show the "not following" message
  if (!followsYou && !youFollow) {
    return (
      <p className='rounded bg-main-search-background px-1 text-xs'>
        Does not follow you
      </p>
    );
  }

  // If the userTargetId follows you, display the "Follows you" message
  if (followsYou) {
    return (
      <p className='rounded bg-main-search-background px-1 text-xs'>
        Follows you
      </p>
    );
  }

  // If you follow them but they don't follow you back, offer an option to follow
  return (
    <p className='rounded bg-main-search-background px-1 text-xs'>
    Does not follow you
  </p>
  );
}

// import { useAuth } from '@lib/context/auth-context';

// type UserFollowingProps = {
//   userTargetId: string;
// };

// export function UserFollowing({
//   userTargetId
// }: UserFollowingProps): JSX.Element | null {
//   const { user } = useAuth();

//   const isOwner =
//     user?.id !== userTargetId && user?.followers.includes(userTargetId);

//   if (!isOwner) return null;

//   return (
//     <p className='rounded bg-main-search-background px-1 text-xs'>
//       Follows you
//     </p>
//   );
// }
