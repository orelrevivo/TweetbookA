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
import { TweetOption } from '../../../components/CommunitiesPosts/tweet-option';
import { HeroIcon } from '@components/ui/hero-icon';
import { useModal } from '@lib/hooks/useModal';
import { NextImage } from '@components/ui/next-image';
import { Modal } from '@components/modal/modal';
import { ImageModal } from '@components/modal/image-modal';
import type { ImageData } from '@lib/types/file';
import ThreeDotsMenu from '../ThreeDotsMenu'; // Import the new component
import ModalReportCommunity from '../ModalReportCommunity'; // Import the new component
import { UserNav } from '../user-nav';
import cn from 'clsx';
import { Tweettip } from '../../../components/CommunitiesPosts/tweet-tip';

type UserHomeCoverProps = {
  coverData?: ImageData | null;
};

export default function about({ coverData }: UserHomeCoverProps): JSX.Element {
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
    <div className={cn(
      `hover-animation flex min-h-screen w-full max-w-xl flex-col`,
    )}>
      <div className='InputisMobile2'>
      <SEO title={`Community ${id}`} />
      <MainHeader className="betweenisGroupCreator flex items-center justify-between">
        <div className="-mb-1 flex flex-col">
          <h2 className="-mt-1 text-xl font-bold">{id}</h2>
          <ModalReportCommunity />
          {/* <Button
            className='bg-light-line-reply dark:bg-dark-line-reply PosthiddenButton  h-[30px]'
            onClick={() => setShowInput(!showInput)}
          >
            <p className='Posthidden2'><HeroIcon className='block h-6 w-6 xl:hidden' iconName='PlusIcon' /></p>
            <p className='Posthidden2 hidden xl:block'>Post</p>
          </Button> */}
        </div>
      </MainHeader>
      <div className='mt-0.5 h-36 xs:h-48 sm:h-52 relative'>
  <Modal open={open} closeModal={closeModal}>
    <ImageModal imageData={coverData as ImageData} previewCount={1} />
  </Modal>
  
  {coverData ? (
    <Button
      className='accent-tab relative h-full w-full p-0 transition hover:brightness-75'
      onClick={openModal}
    >
      <NextImage
        useSkeleton
        layout='fill'
        imgClassName='object-cover'
        src={coverData.src}
        alt={coverData.alt}
        key={coverData.src}
      />
    </Button>
  ) : (
    <div className='absolute inset-0 bg-light-line-reply dark:bg-dark-line-reply' />
  )}
</div>
          <div className='absolutemt12 mt-0.5 h-26 xs:h-28 sm:h-32 relative'>
          <h2 className="absolutemt123 -mt-1 text-xl font-bold">{id}</h2>
          <button 
          className='Message-button32et4 dark-bg-tab self-start border border-light-line-reply px-4 py-1.5 font-bold
          hover:bg-light-primary/10 active:bg-light-primary/20 dark:border-light-secondary
          dark:hover:bg-dark-primary/10 dark:active:bg-dark-primary/20'
          ><span className='NewsP'>News</span></button>
          <span className='JoinourcommunityBio'>Join our community</span>
          <span></span>
          </div>
          <div className='UserNav123'>
          <UserNav />
          </div>
      {showInput && (
        <div className="communityDev mt-4 p-4 border-t border-gray-200 bg-white">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Share your thoughts in the community group!"
            className="communitygroupTextarea w-full p-2"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="my-2"
          />
          {validationMessage && <p className="text-red-500">{validationMessage}</p>}
          <Button onClick={handleSendMessage} disabled={isUploading} className="w-full mt-2">
            {isUploading ? 'Uploading...' : 'Send'}
          </Button>
        </div>
      )}
      <h1>
        <div className='CommunityInfoDiv'>
        <span className='CommunityInfo'>Community Info</span>
        <span className='JoinourcommunityBio2'>Join our community</span>
        <Button
          className="custom-button2hyeh14 custom-button accent-tab hover-card block w-full h-[70px]"
          style={{ borderRadius: '0' }} // Setting border-radius to zero
              >
                <span className='ProfileTEct22'>Only members can post, like, or reply.</span>
                <svg
                className='svgclassName'
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{
            width: '20px',
            height: '20px',
            fill: 'rgb(15, 20, 25)',
            marginRight: '10px', // Adds space between icon and text
          }}
        >
          <g>
          <path d="M7.471 21H.472l.029-1.027c.184-6.618 3.736-8.977 7-8.977.963 0 1.95.212 2.87.672-1.608 1.732-2.762 4.389-2.869 8.248l-.03 1.083zM9.616 9.27C10.452 8.63 11 7.632 11 6.5 11 4.57 9.433 3 7.5 3S4 4.57 4 6.5c0 1.132.548 2.13 1.384 2.77.589.451 1.317.73 2.116.73s1.527-.279 2.116-.73zm6.884 1.726c-3.264 0-6.816 2.358-7 8.977L9.471 21h14.057l-.029-1.027c-.184-6.618-3.736-8.977-7-8.977zm2.116-1.726C19.452 8.63 20 7.632 20 6.5 20 4.57 18.433 3 16.5 3S13 4.57 13 6.5c0 1.132.548 2.13 1.384 2.77.589.451 1.317.73 2.116.73s1.527-.279 2.116-.73z"></path>          </g>
        </svg>
              </Button>
              <Button
          className="custom-button2hyeh14 custom-button accent-tab hover-card block w-full h-[70px]"
          style={{ borderRadius: '0' }} // Setting border-radius to zero
              >
                <span className='ProfileTEct22'>All Communities are publicly visible.</span>
                <span className='spanYourAccount2'>To join this Community, you must ask and be approved.</span>
                <svg
                className='svgclassName'
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{
            width: '20px',
            height: '20px',
            fill: 'rgb(15, 20, 25)',
            marginRight: '10px', // Adds space between icon and text
          }}
        >
          <g>
          <path d="M17.5 7H17v-.25c0-2.76-2.24-5-5-5s-5 2.24-5 5V7h-.5C5.12 7 4 8.12 4 9.5v9C4 19.88 5.12 21 6.5 21h11c1.39 0 2.5-1.12 2.5-2.5v-9C20 8.12 18.89 7 17.5 7zM13 14.73V17h-2v-2.27c-.59-.34-1-.99-1-1.73 0-1.1.9-2 2-2 1.11 0 2 .9 2 2 0 .74-.4 1.39-1 1.73zM15 7H9v-.25c0-1.66 1.35-3 3-3 1.66 0 3 1.34 3 3V7z"></path>
          </g>
        </svg>
              </Button>
              <Button
          className="custom-button2hyeh14 custom-button accent-tab hover-card block w-full h-[70px]"
          style={{ borderRadius: '0' }} // Setting border-radius to zero
              >
                <span className='ProfileTEct22'>Created By</span>
                <span className='spanYourAccount2'>{user?.username}</span>
                <svg
                className='svgclassName'
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{
            width: '20px',
            height: '20px',
            fill: 'rgb(15, 20, 25)',
            marginRight: '10px', // Adds space between icon and text
          }}
        >
          <g>
          <path d="M7 4V3h2v1h6V3h2v1h1.5C19.89 4 21 5.12 21 6.5v12c0 1.38-1.11 2.5-2.5 2.5h-13C4.12 21 3 19.88 3 18.5v-12C3 5.12 4.12 4 5.5 4H7zm0 2H5.5c-.27 0-.5.22-.5.5v12c0 .28.23.5.5.5h13c.28 0 .5-.22.5-.5v-12c0-.28-.22-.5-.5-.5H17v1h-2V6H9v1H7V6zm0 6h2v-2H7v2zm0 4h2v-2H7v2zm4-4h2v-2h-2v2zm0 4h2v-2h-2v2zm4-4h2v-2h-2v2z"></path>          </g>
        </svg>
              </Button>
        <div className='CommunityInfoDiv2 border-light-border dark:border-dark-border border-1 xs:border'></div>

        </div>



        <div className='CommunityInfoDiv'>
        <span className='CommunityInfo2'>Rules</span>
        <span className='JoinourcommunityBio22'>These are set and enforced by Community admins and are in addition to Tweetbook’s rules.</span>
        <div className='JoinourcommunityBio22Button'>
        <Button
          className="custom-button2hyeh14 custom-button accent-tab hover-card block w-full h-[70px]"
          style={{ borderRadius: '0' }} // Setting border-radius to zero
              >
                <span className='ProfileTEct22'>Be kind and respectful.</span>
            
              </Button>
              <Button
          className="custom-button2hyeh14 custom-button accent-tab hover-card block w-full h-[70px]"
          style={{ borderRadius: '0' }} // Setting border-radius to zero
              >
                <span className='ProfileTEct22'>Keep posts on topic.</span>
            
              </Button>
              <Button
          className="custom-button2hyeh14 custom-button accent-tab hover-card block w-full h-[70px]"
          style={{ borderRadius: '0' }} // Setting border-radius to zero
              >
                <span className='ProfileTEct22'>No over posting to group</span>
                <span className='spanYourAccount2'>Limit your posts to 4 at a time or 7 per day, spaced out to avoid crowding the group.</span>
              </Button>
        </div>
        <div className='CommunityInfoDiv2233 border-light-border dark:border-dark-border border-1 xs:border'></div>

        </div>
      </h1>
      </div>
      </div>
  );
}


// Wrapping the page with layouts
about.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <ProtectedLayout>
    <MainLayout>
      <HomeLayout>{page}</HomeLayout>
    </MainLayout>
  </ProtectedLayout>
  );
};
