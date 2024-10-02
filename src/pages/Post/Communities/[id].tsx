import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@lib/context/auth-context';
import { getGroupMessages, addComment } from '@lib/firebase/post';
import { MainContainer } from '@components/home/main-container-me2';
import { HomeLayout, ProtectedLayout } from '@components/layout/common-layout';
import { Button } from '@components/ui/button';
import { MainLayout } from '@components/layout/main-layout';

export default function GroupPage(): JSX.Element {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [commentsState, setCommentsState] = useState<{ [key: string]: { commentText: string } }>({});

  useEffect(() => {
    async function fetchMessages() {
      if (id) {
        const groupMessages = await getGroupMessages(id as string);
        setMessages(groupMessages);
        const initialCommentsState = groupMessages.reduce((acc, post) => {
          acc[post.id] = { commentText: '' };
          return acc;
        }, {} as { [key: string]: { commentText: string } });
        setCommentsState(initialCommentsState);
      }
    }
    fetchMessages();
  }, [id]);

  const handleCommentSubmit = async (postId: string) => {
    const { commentText } = commentsState[postId];
    if (commentText.trim() && user?.username) {
      await addComment(id as string, postId, commentText, user.username);
      const updatedMessages = await getGroupMessages(id as string);
      setMessages(updatedMessages);
      setCommentsState((prev) => ({
        ...prev,
        [postId]: { commentText: '' },
      }));
    }
  };

  const handleCommentTextChange = (postId: string, text: string) => {
    setCommentsState((prev) => ({
      ...prev,
      [postId]: { commentText: text },
    }));
  };

  return (
    <MainContainer className='TweetbookHome'>
      {messages.map((post: any) => {
        const { commentText } = commentsState[post.id] || { commentText: '' };
        return (
          <div key={post.id} className="postItem p-4 border-light-border border-1">
            <p>{post.text}</p>
            {post.commentsList.map((comment: any) => (
              <div key={comment.id} className="commentItem">
                <strong>{comment.username}: </strong>{comment.text}
              </div>
            ))}
            <input
              type="text"
              value={commentText}
              onChange={(e) => handleCommentTextChange(post.id, e.target.value)}
              placeholder="Add a comment..."
              className="mt-2 w-full"
            />
            <Button onClick={() => handleCommentSubmit(post.id)} className="mt-2">
              Comment
            </Button>
          </div>
        );
      })}
    </MainContainer>
  );
}

// Wrapping the page with layouts
GroupPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <ProtectedLayout>
      <MainLayout>
        <HomeLayout>{page}</HomeLayout>
      </MainLayout>
    </ProtectedLayout>
  );
};
