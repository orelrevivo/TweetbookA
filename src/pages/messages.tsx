
import { useState, useEffect, ReactElement, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { collection, query, where, getDocs, addDoc, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase/app';
import { Button } from '@components/ui/button';
import { StatsEmpty } from '@components/Post/stats-empty';
import debounce from 'lodash/debounce';
import { useAuth } from '@lib/context/auth-context';
import { MainLayout } from '@components/layout/main-layout';
import { ProtectedLayout , HomeLayout} from '@components/layout/common-layout';
import { MainContainer } from '@components/home/main-container-home';
import { HeroIcon } from '@components/ui/hero-icon';
import { UserCard } from '@components/user/user-card2';

export default function Messages(): JSX.Element {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async (term: string) => {
      const usersRef = collection(db, 'users');
      const lowerCaseTerm = term.toLowerCase();
      const q = query(usersRef, where('username', '>=', lowerCaseTerm), where('username', '<=', lowerCaseTerm + '\uf8ff'));
      const querySnapshot = await getDocs(q);
      const usersList = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        uid: doc.id,
      }));
      setUsers(usersList);
    };

    const debouncedFetchUsers = debounce((term: string) => {
      if (term.trim() !== '') {
        fetchUsers(term);
      }
    }, 300);

    debouncedFetchUsers(searchTerm);
    return () => debouncedFetchUsers.cancel();
  }, [searchTerm]);

  const handleUserSelect = (user: any) => {
    router.push(`/chat/${user.uid}`);
  };

  return (
    <MainContainer className='InputisMobile2'>
      <div className="w-full p-2 lg:p-4">
        <label className="group flex items-center gap-4 p-2 border rounded-md focus-within:ring-2 focus-within:ring-main-accent border-light-border dark:border-dark-border">
          <HeroIcon
            className="h-5 w-5 text-light-secondary group-focus-within:text-main-accent dark:text-dark-secondary"
            iconName="MagnifyingGlassIcon"
          />
          <input
            type="text"
            className="flex-1 bg-transparent outline-none placeholder:text-light-secondary dark:placeholder:text-dark-secondary"
            placeholder="Search Users"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>
        <ul className="mt-4">
          {users.length > 0 ? (
            users.map(user => (
              <li
                key={user.uid}
                className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => handleUserSelect(user)}
              >
                <UserCard
                  id={user.uid}
                  bio={user.bio}
                  name={user.name}
                  username={user.username}
                  verified={user.verified}
                  photoURL={user.photoURL}
                />
              </li>
            ))
          ) : (
            <li className="text-center text-gray-500 mt-4">
              Try searching for people or keywords
            </li>
          )}
        </ul>
      </div>
    </MainContainer>
  );
}

Messages.getLayout = (page: ReactElement): ReactNode => (
  <ProtectedLayout>
    <MainLayout>
      <HomeLayout>{page}</HomeLayout>
    </MainLayout>
  </ProtectedLayout>
);
// import { useState, useEffect, ReactElement, ReactNode } from 'react';
// import { useRouter } from 'next/router';
// import { collection, query, where, getDocs, addDoc, onSnapshot, orderBy } from 'firebase/firestore';
// import { db } from '../lib/firebase/app';
// import { Button } from '@components/ui/button';
// import { StatsEmpty } from '@components/Post/stats-empty';
// import debounce from 'lodash/debounce';
// import { useAuth } from '@lib/context/auth-context';
// import { MainLayout } from '@components/layout/main-layout';
// import { ProtectedLayout } from '@components/layout/common-layout';
// import { MainContainer } from '@components/home/main-container-me22';
// import { HeroIcon } from '@components/ui/hero-icon';
// import { UserCard } from '@components/user/user-card2';

// export default function Messages(): JSX.Element {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [users, setUsers] = useState<any[]>([]);
//   const [selectedUser, setSelectedUser] = useState<any | null>(null);
//   const [messages, setMessages] = useState<any[]>([]);
//   const [messageText, setMessageText] = useState('');
//   const [isBlocked, setIsBlocked] = useState(false);
//   const router = useRouter();
//   const { user } = useAuth();
//   const userId = user?.id as string;

//   useEffect(() => {
//     const fetchUsers = async (term: string) => {
//       const usersRef = collection(db, 'users');
//       const lowerCaseTerm = term.toLowerCase();

//       const q = query(usersRef, where('username', '>=', lowerCaseTerm), where('username', '<=', lowerCaseTerm + '\uf8ff'));
//       const querySnapshot = await getDocs(q);
//       const usersList = querySnapshot.docs.map(doc => ({
//         ...doc.data(),
//         uid: doc.id,
//       }));

//       // Fetch recent chats
//       const recentChatsRef = collection(db, 'recentChats');
//       const recentChatsQuery = query(recentChatsRef, where('userId', '==', userId));
//       const recentChatsSnapshot = await getDocs(recentChatsQuery);
//       const recentChatsList = recentChatsSnapshot.docs.map(doc => doc.data().recentUserId);

//       // Merge recent chats into the users list
//       const recentUsersList = usersList.filter(user => recentChatsList.includes(user.uid));
//       const uniqueUsersList = usersList.filter(user => !recentChatsList.includes(user.uid));
//       setUsers([...recentUsersList, ...uniqueUsersList]);
//     };

//     const debouncedFetchUsers = debounce((term: string) => {
//       if (term.trim() !== '') {
//         fetchUsers(term);
//       }
//     }, 300);

//     debouncedFetchUsers(searchTerm);

//     return () => debouncedFetchUsers.cancel();
//   }, [searchTerm]);

//   useEffect(() => {
//     if (selectedUser) {
//       const chatId = [userId, selectedUser.uid].sort().join('-');
//       const messagesRef = collection(db, 'chats', chatId, 'messages');
//       const q = query(messagesRef, orderBy('createdAt', 'asc'));

//       const unsubscribe = onSnapshot(q, (snapshot) => {
//         const msgs = snapshot.docs.map(doc => doc.data());
//         setMessages(msgs);
//       });

//       return () => unsubscribe();
//     }
//   }, [selectedUser, userId]);

//   useEffect(() => {
//     if (selectedUser) {
//       const checkIfBlocked = async () => {
//         const blockedUsersRef = collection(db, 'blockedUsers');
//         const q = query(blockedUsersRef, where('userId', '==', selectedUser.uid));
//         const querySnapshot = await getDocs(q);
//         setIsBlocked(!querySnapshot.empty);
//       };

//       checkIfBlocked();
//     }
//   }, [selectedUser]);

//   const handleUserSelect = (user: any) => {
//     setSelectedUser(user);
//     router.push(`/messages?user=${user.uid}`);  // Update the URL to reflect the selected user
//   };

//   const handleSendMessage = async () => {
//     if (!messageText.trim() || !selectedUser) return;

//     const chatId = [userId, selectedUser.uid].sort().join('-');
//     const messagesRef = collection(db, 'chats', chatId, 'messages');

//     await addDoc(messagesRef, {
//       senderId: userId,
//       receiverId: selectedUser.uid,
//       text: messageText,
//       createdAt: new Date(),
//     });

//     // Add to recentChats collection
//     const recentChatsRef = collection(db, 'recentChats');
//     await addDoc(recentChatsRef, {
//       userId: userId,
//       recentUserId: selectedUser.uid,
//       updatedAt: new Date(),
//     });

//     setMessageText('');
//   };

//   return (
//     <MainContainer>
//       <div className="flex">
//         {/* Search Panel */}
//         <div className="borderMessages w-3/5 p-0 border-light-border dark:border-dark-border border-1 xs:border">
//         <label
//           className='search-bar1234 TweetbookSearch2 group flex items-center justify-between gap-4 rounded-[30px]
//                       px-4 py-2
//                      focus-within:ring-2 focus-within:ring-main-accent border-light-border dark:border-dark-border border-1 xs:border'
//         >
//           <i>
//             <HeroIcon
//               className='h-5 w-5 text-light-secondary transition-colors 
//                          group-focus-within:text-main-accent dark:text-dark-secondary'
//               iconName='MagnifyingGlassIcon'
//             />
//           </i>
//           <input
//             type="text"
//             className="peer flex-1 bg-transparent outline-none 
//             placeholder:text-light-secondary dark:placeholder:text-dark-secondary"
//             placeholder="Search Users"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//                   </label>
//           <ul className="mt-4">
//             {users.length > 0 ? (
//               users.map(user => (
//                 <li
//                   key={user.uid}
//                   className="borderMessagesinput4 p-2 border-light-border dark:border-dark-border border-1 xs:border cursor-pointer accent-tab hover-card"
//                   style={{
//                     borderTop: 'none', // Replace with actual color or variable
//                     borderLeft: 'none',
//                     borderRight: 'none',
//                   }}
//                   onClick={() => handleUserSelect(user)}
//                 >
//                   <UserCard
//                     id={user.uid}
//                     bio={user.bio}
//                     name={user.name}
//                     username={user.username}
//                     verified={user.verified}
//                     photoURL={user.photoURL}
//                   />
//                 </li>
//               ))
//             ) : (
//               <div>
//               <li className="text-center text-gray-500 mt-4">
//               Try searching for people, lists, or keywords
//               </li>
//               </div>
//             )}
//           </ul>
//         </div>

//         {/* User Details */}
//         <div className="w-2/3 p-4">
//           {selectedUser ? (
//             <div className="user-details">
//               <div className="flex items-center notificationSettingsBoxSettingsUScss border-light-border dark:border-dark-border border-1 xs:border">
//                 <img src={selectedUser.photoURL} alt={selectedUser.name} className="w-16 h-16 rounded-full" />
//                 <div className="ml-4">
//                   <p className="text-lg font-bold">{selectedUser.name}</p>
//                   <p>ID: {selectedUser.uid}</p>
//                   <p>{selectedUser.bio}</p>
//                 </div>
//               </div>
//               <div className="chat-window mt-4">
//                 {isBlocked ? (
//                   <div className="text-red-500 text-center">
//                     You cannot correspond with this user because you have blocked them.
//                   </div>
//                 ) : (
//                   <>
//                     <div className="messages mt-4 h-80 overflow-y-auto">
//                       {messages.map((msg, index) => (
//                         <p key={index} className="messagestext p-2 my-1">
//                           {msg.text}
//                         </p>
//                       ))}
//                     </div>
//                     <label
//           className=' group flex items-center justify-between gap-4 rounded-[30px]
//                       px-4 py-2 transition 
//                      focus-within:ring-2 focus-within:ring-main-accent border-light-border dark:border-dark-border border-1 xs:border'
//         >
//                       <input
//                       type="text"
//                       className="peer flex-1 bg-transparent outline-none 
//                       placeholder:text-light-secondary dark:placeholder:text-dark-secondary"
//                       placeholder="Start a new message"
//                       value={messageText}
//                       onChange={(e) => setMessageText(e.currentTarget.value)}
//                       onKeyDown={(e) => {
//                         if (e.key === 'Enter') {
//                           handleSendMessage();
//                         }
//                       }}
//                     />
//                   </label>
//                   </>
//                 )}
//               </div>
//             </div>
//           ) : (
//             <StatsEmpty
//               title='Tweetbook messages'
//               description='Using the search feature on Tweetbook is super helpful! Whether you
//               looking for a friend, following famous people, or discovering new 
//               content, the Tweetbook search makes it easy. It quickly shows you
//               users and posts, so you can find what you interested in right away.'
//               imageData={{ src: '/assets/no-media.png', alt: 'No bookmarks' }}
//             />
//           )}
//         </div>
//       </div>
//     </MainContainer>
//   );
// }

// Messages.getLayout = function getLayout(page: ReactElement): ReactNode {
//   return (
//     <ProtectedLayout>
//       <MainLayout>{page}</MainLayout>
//     </ProtectedLayout>
//   );
// };
