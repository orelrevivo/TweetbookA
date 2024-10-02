import { query, where } from 'firebase/firestore';
import { useUser } from '@lib/context/user-context';
import { useCollection } from '@lib/hooks/useCollection';
import { usersCollection } from '@lib/firebase/collections';
import { SEO } from '@components/common/seo';
import { UserCards } from '@components/user/user-cards';
import type { User } from '@lib/types/user';

type UserFollowProps = {
  type: 'join'; // Change type to 'join' as per your requirement
};

export function UserFollow({ type }: UserFollowProps): JSX.Element {
  const { user } = useUser();
  const { name, username } = user as User;

  // Update the query to match the new "join" logic
  const { data, loading } = useCollection(
    query(
      usersCollection,
      where('join', 'array-contains', user?.id) // Assuming you're using 'join' to filter users who have 'joined'
    ),
    { allowNull: true }
  );

  return (
    <>
      <SEO
        title={`People joined by ${name} (@${username}) / Tweetbook`} // Update the SEO title as per the 'Join' context
      />
      <UserCards join data={data} type={type} loading={loading} /> {/* Pass the new props for 'join' */}
    </>
  );
}
