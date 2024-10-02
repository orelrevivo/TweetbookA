import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@lib/context/auth-context';
import { getGroupMessages } from '@lib/firebase/post';
import { Loading } from '@components/ui/loading';
import { StatsEmpty } from '@components/Post/stats-empty';

export default function Postcommunity(): JSX.Element {
  const router = useRouter();
  const { id } = router.query; // Get the group ID
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    async function fetchMessages() {
      if (id) {
        try {
          const groupMessages = await getGroupMessages(id as string);
          // Filter out posts that do not have an image
          const imagePosts = groupMessages.filter((post) => post.image);
          setMessages(imagePosts);
        } catch (error) {
          console.error('Error fetching group messages:', error);
        } finally {
          setLoading(false); // Stop loading when fetch is done
        }
      }
    }
    fetchMessages();
  }, [id]);

  if (loading) {
    return <Loading className="mt-5" />; // Show loading indicator
  }

  return (
    <div className="grid grid-cols-4">
      {messages.length === 0 ? (
        // If no media posts exist, show StatsEmpty component
       <div className='StatsEmpty13'>
         <StatsEmpty
          title={`@${id ?? 'User'} hasn't Posted Media`} // Replaced `user.username` with `id`
          description="Once they do, those Posts will show up here."
          imageData={{ src: '/assets/no-media.png', alt: 'No media' }}
        />
       </div>
      ) : (
        // Render posts with images
        messages.map((post: any) => (
          <div key={post.id} className="postItem">
            {post.image && (
              <img
                src={post.image}
                alt="Post"
                className="PostImges1" // Style for the image
              />
            )}
          </div>
        ))
      )}
    </div>
  );
}
