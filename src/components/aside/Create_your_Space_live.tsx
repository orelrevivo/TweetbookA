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


export function CreateyourSpacelive(): JSX.Element {
  const { randomSeed } = useAuth();

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
  return (
    <div>
<section className='ADTweetbook border-light-border dark:border-dark-border border-1 xs:border'>

    {adminLoading || suggestionsLoading ? (
        <Loading className='flex h-52 items-center justify-center p-4' />
      ) : suggestionsData ? (
        <motion.div className='inner:px-4 inner:py-3'>
          <h2 className='text-xl font-bold'>Live on Tweetbook</h2>
          <Link href='/Live/Create_your_Space_live'>
            <a
              className='custom-button accent-tab hover-card block w-full rounded-2xl
                         rounded-t-none text-center text-main-accent'
            >
              Create your Space live
            </a>
          </Link>
        </motion.div>
      ) : (
        <Error />
      )}
    </section>
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
//   documentId
// } from 'firebase/firestore';
// import { useAuth } from '@lib/context/auth-context';
// import { useCollection } from '@lib/hooks/useCollection';
// import { useDocument } from '@lib/hooks/useDocument';
// import { usersCollection } from '@lib/firebase/collections';
// import { UserCard } from '@components/user/user-card';
// import { Loading } from '@components/ui/loading';
// import { Error } from '@components/ui/error';
// import { useRouter } from 'next/router';


// export function CreateyourSpacelive(): JSX.Element {
//   const { randomSeed } = useAuth();

//   const { data: adminData, loading: adminLoading } = useDocument(
//     doc(usersCollection, 'Twt0A27bx9YcG4vu3RTsR7ifJzf2'),
//     { allowNull: true }
//   );
//   const router = useRouter();

//   // Function to handle button navigation
//   const handleNavigation = (page: string) => {
//     router.push(page);
//   };
//   const { data: suggestionsData, loading: suggestionsLoading } = useCollection(
//     query(
//       usersCollection,
//       where(documentId(), '>=', randomSeed),
//       orderBy(documentId()),
//       limit(3)
//     ),
//     { allowNull: true }
//   );
//   return (
//     <div>
// <section className='ADTweetbook2A23 border-light-border dark:border-dark-border border-1 xs:border'>

//     {adminLoading || suggestionsLoading ? (
//         <Loading className='flex h-52 items-center justify-center p-4' />
//       ) : suggestionsData ? (
//         <motion.div className='inner:px-4 inner:py-3'>
//           <span className='spanYourAccount2334'>Your personal Reddit frontpage, built for you.</span>
//        <button className='Creatingcommunitybutton'  onClick={() => handleNavigation('/community/verified-get-Communities')}><span className='CreatingcommunitybuttonSpan'>Creating a community</span></button>
//         </motion.div>
//       ) : (
//         <Error />
//       )}
//     </section>
//     </div>
//   );
// }