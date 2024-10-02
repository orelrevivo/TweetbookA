import { useEffect, useState } from 'react';
import TextArea from 'react-textarea-autosize';
import { motion } from 'framer-motion';
import { useModal } from '@lib/hooks/useModal';
import { HeroIcon } from '@components/ui/hero-icon';
import { Button } from '@components/ui/button';
import { getGroups, getUsers } from '@lib/firebase/utils'; // Import your functions to fetch communities and users
import type {
  ReactNode,
  RefObject,
  ChangeEvent,
  KeyboardEvent,
  ClipboardEvent
} from 'react';
import type { Variants } from 'framer-motion';

type InputFormProps = {
  modal?: boolean;
  formId: string;
  loading: boolean;
  visited: boolean;
  reply?: boolean;
  children: ReactNode;
  inputRef: RefObject<HTMLTextAreaElement>;
  inputValue: string;
  replyModal?: boolean;
  isValidTweet: boolean;
  isUploadingImages: boolean;
  sendTweet: () => Promise<void>;
  handleFocus: () => void;
  discardTweet: () => void;
  handleChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleImageUpload: (e: ChangeEvent<HTMLInputElement> | ClipboardEvent<HTMLTextAreaElement>) => void;
};

const variants: Variants[] = [
  {
    initial: { y: -25, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { type: 'spring' } }
  },
  {
    initial: { x: 25, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { type: 'spring' } }
  }
];

export const [fromTop, fromBottom] = variants;

export function InputForm({
  modal,
  reply,
  formId,
  loading,
  visited,
  children,
  inputRef,
  replyModal,
  inputValue,
  isValidTweet,
  isUploadingImages,
  sendTweet,
  handleFocus,
  discardTweet,
  handleChange,
  handleImageUpload
}: InputFormProps): JSX.Element {
  const { open, openModal, closeModal } = useModal();
  const [visibility, setVisibility] = useState<'everyone' | 'followed' | 'verified' | 'mentioned'>('everyone');
  const [buttonPosition, setButtonPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [communities, setCommunities] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]); // State to store users
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null); // Store selected community
  const [userMentioned, setUserMentioned] = useState<string | null>(null); // Store user mentioned

  useEffect(() => {
    async function fetchCommunities() {
      const fetchedGroups = await getGroups();
      setCommunities(fetchedGroups);
    }
    
    async function fetchUsers() {
      const fetchedUsers = await getUsers(); // Fetch users
      setUsers(fetchedUsers);
    }
    
    fetchCommunities();
    fetchUsers();
  }, []);

  const handleKeyboardShortcut = ({ key, ctrlKey }: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (!modal && key === 'Escape') {
      if (isValidTweet) {
        inputRef.current?.blur();
        openModal();
      } else {
        discardTweet();
      }
    } else if (ctrlKey && key === 'Enter' && isValidTweet) {
      void sendTweet();
    } else if (key === '@') {
      openModal(); // Open the user mention modal on typing '@'
    }
  };

  const handleFormFocus = (): void => {
    handleFocus();
  };

  const handleClose = (): void => {
    discardTweet();
    closeModal();
    setUserMentioned(null); // Clear mentioned user on close
  };

  const handleVisibilityChange = (option: 'everyone' | 'followed' | 'verified' | 'mentioned'): void => {
    setVisibility(option);
    closeModal();
  };

  const isVisibilityShown = visited && !reply && !replyModal && !loading;

  const handleOpenModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setButtonPosition({ top: rect.bottom + window.scrollY, left: rect.left + (rect.width / 2) });
    openModal();
  };

  const handleCommunitySelect = (communityId: string) => {
    setSelectedCommunity(communityId); // Set selected community
    // Logic to upload the post to the selected community can go here
    closeModal(); // Close the modal after selecting the community
  };

  const handleUserSelect = (userId: string) => {
    setUserMentioned(userId); // Set mentioned user
    closeModal(); // Close the modal after selecting the user
    // Logic to insert user mention into the TextArea can go here
    // For example, you might want to insert '@username' into the inputValue
  };

  return (
    <div className='flex min-h-[48px] w-full flex-col justify-center gap-4'>
      {/* Modal for community selection */}
      {open && (
        <div
          className='gfdfhdhfhdrhfhr borderbox4 menu-container absolute w-60 xl:w-[240px]'
          style={{
            width: 290,
            height: 300,
            top: buttonPosition.top - (0 / 2),
            left: buttonPosition.left - (480 / 2),
            transform: 'translateY(8px)',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          <div className='flex flex-col'>
            <h3 className='fhddfhdrhdfghrh text-xl font-bold' style={{ fontSize: '14px' }}>
              Select a Community
            </h3>
            <div className='mt-2'>
              {communities.length > 0 ? (
                communities.map((community) => (
                  <button
                    key={community.id}
                    className='dfewgsgegdgsege custom-button accent-tab hover-card block w-full text-left px-4 py-2'
                    onClick={() => handleCommunitySelect(community.id)}
                  >
                    {community.name}
                  </button>
                ))
              ) : (
                <p className='text-center text-gray-500'>No communities available</p>
              )}
            </div>
            <h3 className='fhddfhdrhdfghrh text-xl font-bold' style={{ fontSize: '14px' }}>
              Mention a User
            </h3>
            <div className='mt-2'>
              {users.length > 0 ? (
                users.map((user) => (
                  <button
                    key={user.id}
                    className='dfewgsgegdgsege custom-button accent-tab hover-card block w-full text-left px-4 py-2'
                    onClick={() => handleUserSelect(user.id)} // Call the user selection handler
                  >
                    {user.username} {/* Display the user's username */}
                  </button>
                ))
              ) : (
                <p className='text-center text-gray-500'>No users available</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className='flex flex-col gap-6'>
        {isVisibilityShown && (
          <button 
            type='button'
            className='custom-button accent-tab accent-bg-tab flex items-center gap-1
            self-start border border-light-line-reply py-0 px-3 text-main-accent
            hover:bg-main-accent/10 active:bg-main-accent/20 dark:border-light-secondary'
            {...fromTop}
            onClick={handleOpenModal}
          >
            <p className='font-bold'>{visibility.charAt(0).toUpperCase() + visibility.slice(1)}</p>
            <HeroIcon className='h-4 w-4' iconName='ChevronDownIcon' />
          </button>
        )}
        <div className='flex items-center gap-3'>
          <TextArea
            id={formId}
            className='w-full min-w-0 resize-none bg-transparent text-xl outline-none placeholder:text-light-secondary dark:placeholder:text-dark-secondary'
            value={inputValue}
            placeholder={reply || replyModal ? 'By the way, something nice to post?' : "Got something to share? Let us know!"}
            onBlur={handleFormFocus}
            minRows={loading ? 1 : modal && !isUploadingImages ? 3 : 1}
            maxRows={isUploadingImages ? 5 : 15}
            onFocus={handleFormFocus}
            onPaste={handleImageUpload}
            onKeyUp={handleKeyboardShortcut}
            onChange={handleChange}
            ref={inputRef}
          />
          {reply && !visited && (
            <Button
              className='accent-tab bg-main-accent px-4 py-1.5 font-bold text-white
                         enabled:hover:bg-main-accent/90
                         enabled:active:bg-main-accent/75'
              disabled={!isValidTweet || loading}
              onClick={async () => {
                await sendTweet();
                closeModal();
              }}
            >
              {loading ? 'Loading...' : 'Reply'}
            </Button>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

// import { useEffect, useState } from 'react';
// import TextArea from 'react-textarea-autosize';
// import { motion } from 'framer-motion';
// import { useModal } from '@lib/hooks/useModal';
// import { Modal } from '@components/modal/modal';
// import { ActionModal } from '@components/modal/action-modal';
// import { HeroIcon } from '@components/ui/hero-icon';
// import { Button } from '@components/ui/button';
// import { getGroups } from '@lib/firebase/utils'; // Import your function to fetch communities
// import type {
//   ReactNode,
//   RefObject,
//   ChangeEvent,
//   KeyboardEvent,
//   ClipboardEvent
// } from 'react';
// import type { Variants } from 'framer-motion';

// type InputFormProps = {
//   modal?: boolean;
//   formId: string;
//   loading: boolean;
//   visited: boolean;
//   reply?: boolean;
//   children: ReactNode;
//   inputRef: RefObject<HTMLTextAreaElement>;
//   inputValue: string;
//   replyModal?: boolean;
//   isValidTweet: boolean;
//   isUploadingImages: boolean;
//   sendTweet: () => Promise<void>;
//   handleFocus: () => void;
//   discardTweet: () => void;
//   handleChange: ({
//     target: { value }
//   }: ChangeEvent<HTMLTextAreaElement>) => void;
//   handleImageUpload: (
//     e: ChangeEvent<HTMLInputElement> | ClipboardEvent<HTMLTextAreaElement>
//   ) => void;
// };

// const variants: Variants[] = [
//   {
//     initial: { y: -25, opacity: 0 },
//     animate: { y: 0, opacity: 1, transition: { type: 'spring' } }
//   },
//   {
//     initial: { x: 25, opacity: 0 },
//     animate: { x: 0, opacity: 1, transition: { type: 'spring' } }
//   }
// ];

// export const [fromTop, fromBottom] = variants;

// export function InputForm({
//   modal,
//   reply,
//   formId,
//   loading,
//   visited,
//   children,
//   inputRef,
//   replyModal,
//   inputValue,
//   isValidTweet,
//   isUploadingImages,
//   sendTweet,
//   handleFocus,
//   discardTweet,
//   handleChange,
//   handleImageUpload
// }: InputFormProps): JSX.Element {
//   const { open, openModal, closeModal } = useModal();
//   const [visibility, setVisibility] = useState<'everyone' | 'followed' | 'verified' | 'mentioned'>('everyone');
//   const [buttonPosition, setButtonPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
//   const [communities, setCommunities] = useState<any[]>([]);
//   const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null); // Store selected community

//   useEffect(() => {
//     async function fetchCommunities() {
//       const fetchedGroups = await getGroups();
//       setCommunities(fetchedGroups);
//     }
//     fetchCommunities();
//   }, []);

//   useEffect(() => handleShowHideNav(true), []);

//   const handleKeyboardShortcut = ({
//     key,
//     ctrlKey
//   }: KeyboardEvent<HTMLTextAreaElement>): void => {
//     if (!modal && key === 'Escape')
//       if (isValidTweet) {
//         inputRef.current?.blur();
//         openModal();
//       } else discardTweet();
//     else if (ctrlKey && key === 'Enter' && isValidTweet) void sendTweet();
//   };

//   const handleShowHideNav = (blur?: boolean) => (): void => {
//     const sidebar = document.getElementById('sidebar') as HTMLElement;

//     if (!sidebar) return;

//     if (blur) {
//       setTimeout(() => (sidebar.style.opacity = ''), 200);
//       return;
//     }

//     if (window.innerWidth < 500) sidebar.style.opacity = '0';
//   };

//   const handleFormFocus = (): void => {
//     handleShowHideNav()();
//     handleFocus();
//   };

//   const handleClose = (): void => {
//     discardTweet();
//     closeModal();
//   };

//   const handleVisibilityChange = (option: 'everyone' | 'followed' | 'verified' | 'mentioned'): void => {
//     setVisibility(option);
//     closeModal();
//   };

//   const isVisibilityShown = visited && !reply && !replyModal && !loading;

//   const handleOpenModal = (e: React.MouseEvent<HTMLButtonElement>) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     setButtonPosition({ top: rect.bottom + window.scrollY, left: rect.left + (rect.width / 2) });
//     openModal();
//   };

//   const handleCommunitySelect = (communityId: string) => {
//     setSelectedCommunity(communityId); // Set selected community
//     // Logic to upload the post to the selected community can go here
//     closeModal(); // Close the modal after selecting the community
//   };

//   return (
//     <div className='flex min-h-[48px] w-full flex-col justify-center gap-4'>
//       {/* Modal for community selection */}
//       {open && (
//   <div
//     className='borderbox4 menu-container absolute w-60 xl:w-[240px]'
//     style={{
//       width: 290,
//       height: 300, // Set height to 200px
//       top: buttonPosition.top - (0 / 2),
//       left: buttonPosition.left - (480 / 2),
//       transform: 'translateY(8px)', // Adjust vertical centering
//       overflowY: 'auto', // Enable vertical scrolling
//       overflowX: 'hidden', // Disable horizontal scrolling
//     }}
//   >
//     <div className='flex flex-col'>
//     <div className='flex items-center justify-between'>
//         <button
//           type='button'
//            className='fhddfhdrhdffafwghrh2 custom-button accent-tab hover-card block w-full'
//           onClick={handleClose}
//         >
//           Everyone
//         </button>
//       </div>
//       <div className='flex items-center justify-between'>
//         <h3 className='fhddfhdrhdfghrh text-xl font-bold' style={{ fontSize: '14px' }}>
//           Select a Community
//         </h3>
//       </div>
//       <div className='mt-2'>
//         {communities.map((community) => (
//           <button
//             key={community.id}
//             className='dfewgsgegdgsege custom-button accent-tab hover-card block w-full text-left px-4 py-2'
//             onClick={() => handleCommunitySelect(community.id)}
//           >
//             {community.name}
//           </button>
//         ))}
//       </div>
//     </div>
//   </div>
// )}

//       <div className='flex flex-col gap-6'>
//         {isVisibilityShown && (
//         <button 
//         type='button'
//         className='custom-button accent-tab accent-bg-tab flex items-center gap-1
//         self-start border border-light-line-reply py-0 px-3 text-main-accent
//         hover:bg-main-accent/10 active:bg-main-accent/20 dark:border-light-secondary'
//         {...fromTop}
//         onClick={handleOpenModal}
//       >
//        <p className='font-bold'>{visibility.charAt(0).toUpperCase() + visibility.slice(1)}</p>
//        <HeroIcon className='h-4 w-4' iconName='ChevronDownIcon' />
//       </button>
//         )}
//         <div className='flex items-center gap-3'>
//           <TextArea
//             id={formId}
//             className='w-full min-w-0 resize-none bg-transparent text-xl outline-none placeholder:text-light-secondary dark:placeholder:text-dark-secondary'
//             value={inputValue}
//             placeholder={
//               reply || replyModal ? 'By the way, something nice to post?' : "Got something to share? Let us know!"
//             }
//             onBlur={handleShowHideNav(true)}
//             minRows={loading ? 1 : modal && !isUploadingImages ? 3 : 1}
//             maxRows={isUploadingImages ? 5 : 15}
//             onFocus={handleFormFocus}
//             onPaste={handleImageUpload}
//             onKeyUp={handleKeyboardShortcut}
//             onChange={handleChange}
//             ref={inputRef}
//           />
//           {reply && !visited && (
//             <Button
//               className='accent-tab bg-main-accent px-4 py-1.5 font-bold text-white
//                        enabled:hover:bg-main-accent/90
//                        enabled:active:bg-main-accent/75'
//               disabled={!isValidTweet || loading}
//               onClick={sendTweet}
//             >
//               {loading ? 'Sending...' : 'Reply'}
//             </Button>
//           )}
//         </div>
//         {children}
//       </div>
//     </div>
//   );
// }
