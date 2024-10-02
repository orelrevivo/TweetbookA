
import { useRef } from 'react';
import { useRouter } from 'next/router';
import { AnimatePresence } from 'framer-motion';
import { doc, query, where, orderBy } from 'firebase/firestore';
import { tweetsCollection } from '@lib/firebase/collections';
import { useCollection } from '@lib/hooks/useCollection';
import { useDocument } from '@lib/hooks/useDocument';
import { isPlural } from '@lib/utils';
import { HomeLayout, ProtectedLayout } from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import { MainContainer } from '@components/home/main-container-me2';
import { MainHeader } from '@components/home/main-header';
import { Tweet } from '@components/Post/tweet';
import { ViewTweet } from '@components/view/view-tweet';
import { SEO } from '@components/common/seo';
import { Loading } from '@components/ui/loading';
import { Error } from '@components/ui/error';
import { ViewParentTweet } from '@components/view/view-parent-tweet';
import type { ReactElement, ReactNode } from 'react';
import cn from 'clsx';

export default function TweetId(): JSX.Element {
  const {
    query: { id },
    back
  } = useRouter();

  const { data: tweetData, loading: tweetLoading } = useDocument(
    doc(tweetsCollection, id as string),
    { includeUser: true, allowNull: true }
  );

  const viewTweetRef = useRef<HTMLElement>(null);

  const { data: repliesData, loading: repliesLoading } = useCollection(
    query(
      tweetsCollection,
      where('parent.id', '==', id),
      orderBy('createdAt', 'desc')
    ),
    { includeUser: true, allowNull: true }
  );

  const { text, images } = tweetData ?? {};

  const imagesLength = images?.length ?? 0;
  const parentId = tweetData?.parent?.id;

  const pageTitle = tweetData
    ? `${tweetData.user.name} on Tweetbook: "${text ?? ''}${
        images ? ` (${imagesLength} image${isPlural(imagesLength)})` : ''
      }" / Tweetbook`
    : null;

  return (
    <div className={cn(
      `hover-animation flex min-h-screen w-full max-w-xl flex-col`,
    )}>
    <div className='InputisMobile2 dssdawsdawsd !pb-[1280px]'>
      <MainHeader
        useActionButton
        title={parentId ? 'Thread' : 'Post'}
        action={back}
      />
      <section>
        {tweetLoading ? (
          <Loading className='mt-5' />
        ) : !tweetData ? (
          <>
            <SEO title='Post not found / Tweetbook' />
            <Error message='Post not found' />
          </>
        ) : (
          <>
            {pageTitle && <SEO title={pageTitle} />}
            {parentId && (
              <ViewParentTweet
                parentId={parentId}
                viewTweetRef={viewTweetRef}
              />
            )}
            <ViewTweet viewTweetRef={viewTweetRef} {...tweetData} />
            {tweetData &&
              (repliesLoading ? (
                <Loading className='mt-5' />
              ) : (
                <AnimatePresence mode='popLayout'>
                  {repliesData?.map((tweet) => (
                    <Tweet {...tweet} key={tweet.id} />
                  ))}
                </AnimatePresence>
              ))}
          </>
        )}
      </section>
      </div>
      </div>
  );
}

TweetId.getLayout = (page: ReactElement): ReactNode => (
  <ProtectedLayout>
    <MainLayout>
      <HomeLayout>{page}</HomeLayout>
    </MainLayout>
  </ProtectedLayout>
);

// import { useRef } from 'react';
// import { useRouter } from 'next/router';
// import { AnimatePresence } from 'framer-motion';
// import { doc, query, where, orderBy } from 'firebase/firestore';
// import { tweetsCollection } from '@lib/firebase/collections';
// import { useCollection } from '@lib/hooks/useCollection';
// import { useDocument } from '@lib/hooks/useDocument';
// import { isPlural } from '@lib/utils';
// import { HomeLayout, ProtectedLayout } from '@components/layout/common-layout';
// import { MainLayout } from '@components/layout/main-layout';
// import { MainContainer } from '@components/home/main-container-me2';
// import { MainHeader } from '@components/home/main-header';
// import { Tweet } from '@components/tweet/tweet';
// import { ViewTweet } from '@components/view/view-tweet';
// import { SEO } from '@components/common/seo';
// import { Loading } from '@components/ui/loading';
// import { Error } from '@components/ui/error';
// import { ViewParentTweet } from '@components/view/view-parent-tweet';
// import type { ReactElement, ReactNode } from 'react';
// import { AsideSidbar } from '../../components/aside/aside-Sidbar';
// import  Video  from '../../pages/video';

// export default function TweetId(): JSX.Element {
//   const {
//     query: { id },
//     back
//   } = useRouter();

//   const { data: tweetData, loading: tweetLoading } = useDocument(
//     doc(tweetsCollection, id as string),
//     { includeUser: true, allowNull: true }
//   );

//   const viewTweetRef = useRef<HTMLElement>(null);

//   const { data: repliesData, loading: repliesLoading } = useCollection(
//     query(
//       tweetsCollection,
//       where('parent.id', '==', id),
//       orderBy('createdAt', 'desc')
//     ),
//     { includeUser: true, allowNull: true }
//   );

//   const { text, images } = tweetData ?? {};

//   const imagesLength = images?.length ?? 0;
//   const parentId = tweetData?.parent?.id;

//   const pageTitle = tweetData
//     ? `${tweetData.user.name} on Tweetbook: "${text ?? ''}${
//         images ? ` (${imagesLength} image${isPlural(imagesLength)})` : ''
//       }" / Tweetbook`
//     : null;

//   return (
//     <>
//       {/* Main content area */}
//       <MainContainer className='!pb-[1280px]'>
//         <MainHeader
//           useActionButton
//           title={parentId ? 'Thread' : 'Post'}
//           action={back}
//         />
//         <section>
//           {tweetLoading ? (
//             <Loading className='mt-5' />
//           ) : !tweetData ? (
//             <>
//               <SEO title='Post not found / Tweetbook' />
//               <Error message='Post not found' />
//             </>
//           ) : (
//             <>
//               {pageTitle && <SEO title={pageTitle} />}
//               {parentId && (
//                 <ViewParentTweet
//                   parentId={parentId}
//                   viewTweetRef={viewTweetRef}
//                 />
//               )}
//               <ViewTweet viewTweetRef={viewTweetRef} {...tweetData} />
//               {tweetData &&
//                 (repliesLoading ? (
//                   <Loading className='mt-5' />
//                 ) : (
//                   <AnimatePresence mode='popLayout'>
//                     {repliesData?.map((tweet) => (
//                       <Tweet {...tweet} key={tweet.id} />
//                     ))}
//                   </AnimatePresence>
//                 ))}
//             </>
//           )}
//         </section>
//       </MainContainer>

//       {/* Sidebar on the right side of the page, hidden on mobile */}
//       <div className='fixed-square'>
//         <AsideSidbar />
//         <div className='scrollable-container bg-main-sidebar-background border border-gray-200 rounded-lg p-4'>
//         <Video />
//         </div>
//       </div>
//     </>
//   );
// }

// TweetId.getLayout = function getLayout(page: ReactElement): ReactNode {
//   return (
//     <ProtectedLayout>
//       <MainLayout>{page}</MainLayout>
//     </ProtectedLayout>
//   );
// };
