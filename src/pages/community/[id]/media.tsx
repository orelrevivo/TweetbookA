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
import PostCommunity from '../postcommunityMedia'; // The new component for posts

type UserHomeCoverProps = {
  coverData?: ImageData | null;
};

export default function media({ coverData }: UserHomeCoverProps): JSX.Element {
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
          <PostCommunity
      messages={messages}
      user={user}
      handleLikePost={handleLikePost}
      toggleComments={toggleComments}
      handleCommentTextChange={handleCommentTextChange}
      handleCommentSubmit={handleCommentSubmit}
      commentsState={commentsState}
    />
    </div>
    </div>
  );
}


// Wrapping the page with layouts
media.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <ProtectedLayout>
    <MainLayout>
      <HomeLayout>{page}</HomeLayout>
    </MainLayout>
  </ProtectedLayout>
  );
};






















// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import { useAuth } from '@lib/context/auth-context';
// import { MainContainer } from '@components/home/main-container-me2';
// import { SEO } from '@components/common/seo';
// import { MainHeader } from '@components/home/main-header';
// import { Button } from '@components/ui/button';
// import {
//   getGroupMessages,
//   addComment,
//   manageLike,
// } from '@lib/firebase/post';
// import { HomeLayout, ProtectedLayout } from '@components/layout/common-layout';
// import { MainLayout } from '@components/layout/main-layout';
// import { NextImage } from '@components/ui/next-image';
// import type { ImageData } from '@lib/types/file';
// import ModalReportCommunity from '../ModalReportCommunity'; // Import the new component
// import { UserNav } from '../user-nav';
// import PostCommunity from '../postcommunityMedia'; // The new component for posts

// type UserHomeCoverProps = {
//   coverData?: ImageData | null;
// };

// export default function media({ coverData }: UserHomeCoverProps): JSX.Element {
//   const router = useRouter();
//   const { id } = router.query;
//   const { user } = useAuth();
//   const [messages, setMessages] = useState<any[]>([]);
//   const [bio, setBio] = useState<string>(''); // State for bio

//   useEffect(() => {
//     async function fetchMessages() {
//       if (id) {
//         try {
//           const groupMessages = await getGroupMessages(id as string);
//           setMessages(groupMessages);
//         } catch (error) {
//           console.error('Error fetching group messages:', error);
//         }
//       }
//     }
//     fetchMessages();
//   }, [id]);



//   // State to manage comments visibility and text
//   const [commentsState, setCommentsState] = useState<{ [key: string]: { showComments: boolean; commentText: string } }>({});

//   useEffect(() => {
//     async function fetchMessages() {
//       if (id) {
//         try {
//           const groupMessages = await getGroupMessages(id as string);
//           setMessages(groupMessages);
//           // Initialize comments state for each message
//           const initialCommentsState = groupMessages.reduce((acc, post) => {
//             acc[post.id] = { showComments: false, commentText: '' };
//             return acc;
//           }, {} as { [key: string]: { showComments: boolean; commentText: string } });
//           setCommentsState(initialCommentsState);
//         } catch (error) {
//           console.error('Error fetching group messages:', error);
//         }
//       }
//     }
//     fetchMessages();
//   }, [id]);


//   const handleCommentSubmit = async (postId: string) => {
//     const { commentText } = commentsState[postId];
//     if (commentText.trim() && user?.username) {
//       try {
//         await addComment(id as string, postId, commentText, user.username);
//         const updatedMessages = await getGroupMessages(id as string);
//         setMessages(updatedMessages);
//         // Reset comment text after submission
//         setCommentsState((prev) => ({
//           ...prev,
//           [postId]: { ...prev[postId], commentText: '' },
//         }));
//       } catch (error) {
//         console.error('Error adding comment:', error);
//       }
//     }
//   };

//   const handleLikePost = async (postId: string, userId: string, tweetIsLiked: boolean) => {
//     if (userId) {
//       try {
//         const action = tweetIsLiked ? 'unlike' : 'like';
//         await manageLike(action, userId, postId)();
//         const updatedMessages = await getGroupMessages(id as string);
//         setMessages(updatedMessages);
//       } catch (error) {
//         console.error("Error liking post:", error);
//       }
//     } else {
//       console.error("User is not logged in or user ID is undefined.");
//     }
//   };

//   const toggleComments = (postId: string) => {
//     setCommentsState((prev) => ({
//       ...prev,
//       [postId]: { ...prev[postId], showComments: !prev[postId].showComments },
//     }));
//   };

//   const handleCommentTextChange = (postId: string, text: string) => {
//     setCommentsState((prev) => ({
//       ...prev,
//       [postId]: { ...prev[postId], commentText: text },
//     }));
//   };

//   return (
//     <MainContainer className='InputisMobile2'>
//       <SEO title={`Community ${id}`} />
//       <MainHeader className="betweenisGroupCreator flex items-center justify-between">
//         <div className="-mb-1 flex flex-col">
//           <h2 className="-mt-1 text-xl font-bold">{id}</h2>
//           <ModalReportCommunity />
//         </div>
//       </MainHeader>
//       <div className='mt-0.5 h-36 xs:h-48 sm:h-52 relative'>
//   {coverData ? (
//     <Button
//       className='accent-tab relative h-full w-full p-0 transition hover:brightness-75'
//       onClick={openModal}
//     >
//       <NextImage
//         useSkeleton
//         layout='fill'
//         imgClassName='object-cover'
//         src={coverData.src}
//         alt={coverData.alt}
//         key={coverData.src}
//       />
//     </Button>
//   ) : (
//     <div className='absolute inset-0 bg-light-line-reply dark:bg-dark-line-reply' />
//   )}
// </div>
//           <div className='UserNav123'>
//           <UserNav />
//           </div>
//           <PostCommunity
//       messages={messages}
//       user={user}
//       handleLikePost={handleLikePost}
//       toggleComments={toggleComments}
//       handleCommentTextChange={handleCommentTextChange}
//       handleCommentSubmit={handleCommentSubmit}
//       commentsState={commentsState}
//     />
    
//     </MainContainer>
//   );
// }


// // Wrapping the page with layouts
// media.getLayout = function getLayout(page: React.ReactElement) {
//   return (
//     <ProtectedLayout>
//     <MainLayout>
//       <HomeLayout>{page}</HomeLayout>
//     </MainLayout>
//   </ProtectedLayout>
//   );
// };
