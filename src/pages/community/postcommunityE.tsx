import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@lib/context/auth-context';
import { MainContainer } from '@components/home/main-container-me2';
import { SEO } from '@components/common/seo';
import { MainHeader } from '@components/home/main-header';
import { Button } from '@components/ui/button';
import {
  getGroupMessages,
  uploadImage,
  createPost,
  addComment,
  manageLike,
  updateBio,
  manageFollow 
} from '@lib/firebase/post';
import { HomeLayout, ProtectedLayout } from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import { useWindow } from '@lib/context/window-context';
import { TweetOption } from '../../components/CommunitiesPosts/tweet-option';
import { HeroIcon } from '@components/ui/hero-icon';
import { useModal } from '@lib/hooks/useModal';
import { NextImage } from '@components/ui/next-image';
import { Modal } from '@components/modal/modal';
import { ImageModal } from '@components/modal/image-modal';
import type { ImageData } from '@lib/types/file';
import ThreeDotsMenu from './ThreeDotsMenu'; // Import the new component
import ModalReportCommunity from './ModalReportCommunity'; // Import the new component
import { UserNav } from './user-nav';
import cn from 'clsx';
import { Tweettip } from '../../components/CommunitiesPosts/tweet-tip';

type UserHomeCoverProps = {
  coverData?: ImageData | null;
};

export default function Postcommunity({ coverData }: UserHomeCoverProps): JSX.Element {
    // Your component logic
    const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [showInput, setShowInput] = useState<boolean>(false);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [bio, setBio] = useState<string>(''); // State for bio
  const [isEditingBio, setIsEditingBio] = useState<boolean>(false); // State for editing bio
  const { isMobile } = useWindow();
  const { open, openModal, closeModal } = useModal();

  useEffect(() => {
    async function fetchMessages() {
      if (id) {
        try {
          const groupMessages = await getGroupMessages(id as string);
          setMessages(groupMessages);
        } catch (error) {
          console.error('Error fetching group messages:', error);
        }
      }
    }
    fetchMessages();
  }, [id]);


  

  const handleBioUpdate = async () => {
    if (bio.trim()) {
      await updateBio(id as string, bio); // Call the updateBio function
      setIsEditingBio(false);
    }
  };
  // Fetch messages and other functions...
  const [isFollowing, setIsFollowing] = useState<boolean>(false); // State for following status

  const handleFollowToggle = async () => {
    if (user) {
      try {
        await manageFollow(user.uid, id as string, isFollowing);
        setIsFollowing(!isFollowing);
      } catch (error) {
        console.error('Error managing follow:', error);
      }
    }
  };


  const handleNavigation = (postId) => {
    if (postId) {
      router.push(`/Post/Communities/${postId}`);
    } else {
      console.error("Post ID is undefined.");
    }
  };

  // State to manage comments visibility and text
  const [commentsState, setCommentsState] = useState<{ [key: string]: { showComments: boolean; commentText: string } }>({});

  useEffect(() => {
    async function fetchMessages() {
      if (id) {
        try {
          const groupMessages = await getGroupMessages(id as string);
          setMessages(groupMessages);
          // Initialize comments state for each message
          const initialCommentsState = groupMessages.reduce((acc, post) => {
            acc[post.id] = { showComments: false, commentText: '' };
            return acc;
          }, {} as { [key: string]: { showComments: boolean; commentText: string } });
          setCommentsState(initialCommentsState);
        } catch (error) {
          console.error('Error fetching group messages:', error);
        }
      }
    }
    fetchMessages();
  }, [id]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() || image) {
      setIsUploading(true);
      setValidationMessage(null);
      try {
        let imageUrl = '';
        if (image) {
          imageUrl = await uploadImage(image);
        }
        await createPost(id as string, newMessage, imageUrl);
        setNewMessage('');
        setImage(null);
        const updatedMessages = await getGroupMessages(id as string);
        setMessages(updatedMessages);
      } catch (error) {
        console.error('Error sending message:', error);
      } finally {
        setIsUploading(false);
      }
    } else {
      setValidationMessage('You must enter text or upload an image to create a post.');
    }
  };

  const handleCommentSubmit = async (postId: string) => {
    const { commentText } = commentsState[postId];
    if (commentText.trim() && user?.username) {
      try {
        await addComment(id as string, postId, commentText, user.username);
        const updatedMessages = await getGroupMessages(id as string);
        setMessages(updatedMessages);
        // Reset comment text after submission
        setCommentsState((prev) => ({
          ...prev,
          [postId]: { ...prev[postId], commentText: '' },
        }));
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  const handleLikePost = async (postId: string, userId: string, tweetIsLiked: boolean) => {
    if (userId) {
      try {
        const action = tweetIsLiked ? 'unlike' : 'like';
        await manageLike(action, userId, postId)();
        const updatedMessages = await getGroupMessages(id as string);
        setMessages(updatedMessages);
      } catch (error) {
        console.error("Error liking post:", error);
      }
    } else {
      console.error("User is not logged in or user ID is undefined.");
    }
  };

  const toggleComments = (postId: string) => {
    setCommentsState((prev) => ({
      ...prev,
      [postId]: { ...prev[postId], showComments: !prev[postId].showComments },
    }));
  };

  const handleCommentTextChange = (postId: string, text: string) => {
    setCommentsState((prev) => ({
      ...prev,
      [postId]: { ...prev[postId], commentText: text },
    }));
  };
  return (
    <>
      {messages.map((post: any) => {
        const userLikes = post.userLikes || [];
        const tweetIsLiked = userLikes.includes(user?.uid);
        const currentLikes = userLikes.length;
        const { showComments, commentText } = commentsState[post.id] || { showComments: false, commentText: '' };

        return (
          <div key={post.id} className="classNamekeyDev1415 classNamekeyDev postItem p-4 border-light-border dark:border-dark-border border-1 xs:border transition accent-tab hover-card">
            {/* Post Content */}
            <ThreeDotsMenu />
            <p>{post.text}</p>
            {post.image && <img src={post.image} alt="Post" className="my-2" />}
            
            {/* Post Actions */}
            <div className="postActions">
              <TweetOption
                className={`HeroIconButtonLike hover:text-accent-pink focus-visible:text-accent-pink ${tweetIsLiked ? 'text-accent-pink' : ''}`}
                iconClassName='group-hover:bg-accent-pink/10 group-active:bg-accent-pink/20 group-focus-visible:bg-accent-pink/10 group-focus-visible:ring-accent-pink/80'
                tip={tweetIsLiked ? 'Unlike' : 'Like'}
                stats={currentLikes}
                iconName='HeartIcon'
                onClick={() => handleLikePost(post.id, user?.uid, tweetIsLiked)}
              />
              <TweetOption
                className='HeroIconButton hover:text-accent-blue focus-visible:text-accent-blue'
                iconClassName='group-hover:bg-accent-blue/10 group-active:bg-accent-blue/20 group-focus-visible:bg-accent-blue/10 group-focus-visible:ring-accent-blue/80'
                tip='Reply'
                onClick={() => toggleComments(post.id)}
                iconName='ChatBubbleOvalLeftIcon'
              />
              <TweetOption
                className='HeroIconButton2 hover:text-accent-green focus-visible:text-accent-green'
                iconClassName='group-hover:bg-accent-green/10 group-active:bg-accent-green/20 group-focus-visible:bg-accent-green/10 group-focus-visible:ring-accent-green/80'
                iconName='ArrowPathRoundedSquareIcon'
              />
              <div className='HeroIconButton23'>
                <Tweettip userId={post.id} tweetId={post.id} />
              </div>
            </div>

            {/* Comments Section */}
            {showComments && (
              <>
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => handleCommentTextChange(post.id, e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full min-w-0 resize-none bg-transparent text-xl outline-none placeholder:text-light-secondary dark:placeholder:text-dark-secondary"
                />
                <Button onClick={() => handleCommentSubmit(post.id)} className="Commentaccent-tab accent-tab bg-main-accent px-4 py-1.5 font-bold text-white enabled:hover:bg-main-accent/90 enabled:active:bg-main-accent/75">
                  Reply
                </Button>
                <div className="commentsList mt-2">
                  {post.commentsList.map((comment: any) => (
                    <div key={comment.id} className="commentItem">
                      <strong>{comment.username}: </strong>{comment.text}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        );
      })}
    </>
  );
};

