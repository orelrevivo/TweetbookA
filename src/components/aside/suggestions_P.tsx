

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  doc,
  limit,
  query,
  where,
  orderBy,
  documentId
} from 'firebase/firestore';
import { useAuth } from '@lib/context/auth-context';
import { useCollection } from '@lib/hooks/useCollection';
import { useDocument } from '@lib/hooks/useDocument';
import { usersCollection } from '@lib/firebase/collections';
import { UserCard } from '@components/user/user-card';
import { Loading } from '@components/ui/loading';
import { Error } from '@components/ui/error';
import { variants } from './aside-trends';
import { useEffect, useState } from 'react';

export function Suggestions(): JSX.Element {
  const { randomSeed } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [showUndo, setShowUndo] = useState(false);
  const [timer, setTimer] = useState(10);

  useEffect(() => {
    // Check localStorage for the visibility state
    const visibilityState = localStorage.getItem('suggestionsVisible');
    if (visibilityState === 'false') {
      setIsVisible(false);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('suggestionsVisible', 'false'); // Save state to localStorage
    setShowUndo(true);
    setTimer(10);
  };

  // Effect to handle the timer for undo notification
  useEffect(() => {
    if (showUndo) {
      const countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            setShowUndo(false); // Hide the undo notification after countdown
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [showUndo]);

  const { data: adminData, loading: adminLoading } = useDocument(
    doc(usersCollection, 'Twt0A27bx9YcG4vu3RTsR7ifJzf2'),
    { allowNull: true }
  );

  const { data: suggestionsData, loading: suggestionsLoading } = useCollection(
    query(
      usersCollection,
      where(documentId(), '>=', randomSeed),
      orderBy(documentId()),
      limit(3)
    ),
    { allowNull: true }
  );

  if (!isVisible) return null; // Do not render if not visible

  return (
    <div>
      <section className='ADTweetbookfsafwf border-light-border dark:border-dark-border border-1 xs:border relative'>
        <button onClick={handleClose} className="absolute top-2 right-2 text-xl">
          &times; {/* X button */}
        </button>
        {adminLoading || suggestionsLoading ? (
          <Loading className='flex h-52 items-center justify-center p-4' />
        ) : suggestionsData ? (
          <motion.div className='inner:px-4 inner:py-3' {...variants}>
            <h2 className='text-xl font-bold'>You might like</h2>
            {adminData && <UserCard {...adminData} />}
            {suggestionsData?.map((userData) => (
              <UserCard {...userData} key={userData.id} />
            ))}
            <Link href='/people'>
              <a
                className='custom-button accent-tab hover-card block w-full rounded-2xl
                           rounded-t-none text-center text-main-accent'
              >
                Show more
              </a>
            </Link>
          </motion.div>
        ) : (
          <Error />
        )}
      </section>

      {showUndo && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded shadow-md">
          <p>
            Suggestions hidden! Undo in {timer} seconds.
          </p>
        </div>
      )}
    </div>
  );
}



// import Link from 'next/link';
// import { motion } from 'framer-motion';
// import {
//   doc,
//   limit,
//   query,
//   where,
//   orderBy,
//   documentId,
//   setDoc,
//   getDoc
// } from 'firebase/firestore';
// import { useAuth } from '@lib/context/auth-context';
// import { useCollection } from '@lib/hooks/useCollection';
// import { useDocument } from '@lib/hooks/useDocument';
// import { usersCollection } from '@lib/firebase/collections';
// import { UserCard } from '@components/user/user-card';
// import { Loading } from '@components/ui/loading';
// import { Error } from '@components/ui/error';
// import { variants } from './aside-trends';
// import { useEffect, useState } from 'react';

// export function Suggestions(): JSX.Element {
//   const { user, randomSeed } = useAuth(); // Ensure you have access to the user object
//   const [isVisible, setIsVisible] = useState(true);
//   const [showUndo, setShowUndo] = useState(false);
//   const [timer, setTimer] = useState(10);

//   useEffect(() => {
//     const checkVisibility = async () => {
//       if (!user || !user.uid) return; // Check if user and uid are available
//       const visibilityDoc = await getDoc(doc(usersCollection, user.uid));
//       if (visibilityDoc.exists() && visibilityDoc.data().suggestionsVisible === false) {
//         setIsVisible(false);
//       }
//     };
//     checkVisibility();
//   }, [user]);

//   const handleClose = async () => {
//     if (!user || !user.uid) return; // Ensure user and uid are defined
//     setIsVisible(false);
//     await setDoc(doc(usersCollection, user.uid), { suggestionsVisible: false }, { merge: true });
//     setShowUndo(true);
//     setTimer(10);
//   };

//   // Effect to handle the timer for undo notification
//   useEffect(() => {
//     if (showUndo) {
//       const countdown = setInterval(() => {
//         setTimer((prev) => {
//           if (prev <= 1) {
//             clearInterval(countdown);
//             setShowUndo(false); // Hide the undo notification after countdown
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//       return () => clearInterval(countdown);
//     }
//   }, [showUndo]);

//   const { data: adminData, loading: adminLoading } = useDocument(
//     doc(usersCollection, 'Twt0A27bx9YcG4vu3RTsR7ifJzf2'),
//     { allowNull: true }
//   );

//   const { data: suggestionsData, loading: suggestionsLoading } = useCollection(
//     query(
//       usersCollection,
//       where(documentId(), '>=', randomSeed),
//       orderBy(documentId()),
//       limit(3)
//     ),
//     { allowNull: true }
//   );

//   if (!isVisible) return null; // Do not render if not visible

//   return (
//     <div>
//       <section className='ADTweetbookfsafwf border-light-border dark:border-dark-border border-1 xs:border relative'>
//         <button className='XButton123'  onClick={handleClose}>
//         <svg
//           className='XButton1232'
//           viewBox="0 0 24 24"
//           aria-hidden="true"
//           style={{
//             width: '24px',
//             height: '24px',
//             fill: 'rgb(15, 20, 25)',
//             marginRight: '10px', // Adds space between icon and text
//           }}
//         >
//           <g>
//             <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
//           </g>
//         </svg>
//       </button>
//         {adminLoading || suggestionsLoading ? (
//           <Loading className='flex h-52 items-center justify-center p-4' />
//         ) : suggestionsData ? (
//           <motion.div className='inner:px-4 inner:py-3' {...variants}>
//             <h2 className='text-xl font-bold Youmight'>You might like</h2>
//             {adminData && <UserCard {...adminData} />}
//             {suggestionsData?.map((userData) => (
//               <UserCard {...userData} key={userData.id} />
//             ))}
//             <Link href='/people'>
//               <a
//                 className='moredbsbesdesb custom-button accent-tab hover-card block w-full rounded-2xl
//                            rounded-t-none text-center text-main-accent'
//               >
//                 Show more
//               </a>
//             </Link>
//           </motion.div>
//         ) : (
//           <Error />
//         )}
//       </section>

//       {showUndo && (
//         <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded shadow-md">
//           <p>
//             Suggestions hidden! Undo in {timer} seconds.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }
