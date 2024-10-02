import { AnimatePresence } from 'framer-motion';
import { query, where } from 'firebase/firestore';
import { useCollection } from '@lib/hooks/useCollection';
import { tweetsCollection } from '@lib/firebase/collections';
import { mergeData } from '@lib/merge';
import { HomeLayout, ProtectedLayout } from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import { SEO } from '@components/common/seo';
import { MainContainer } from '@components/home/main-container-home';
import { Tweet } from '@components/Post/tweet';
import { Loading } from '@components/ui/loading';
import { StatsEmpty } from '@components/Post/stats-empty';
import cn from 'clsx';
import { useState } from 'react';
import { useWindow } from '@lib/context/window-context';
import { Input } from '@components/input/input';
import type { ReactElement, ReactNode } from 'react';

export default function Video(): JSX.Element {
  const { data, loading } = useCollection(
    query(tweetsCollection, where('images', '!=', null)), // Fetch all media tweets
    { includeUser: true, allowNull: true }
  );

  const sortedTweets = mergeData(true, data);

  const [showMore, setShowMore] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const toggleShowMore = () => setShowMore(prev => !prev);
  const toggleModal = () => setShowModal(prev => !prev);
  const { isMobile } = useWindow();
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  return (
    <div className={cn(
      `InputisMobile2 hover-animation flex min-h-screen w-full max-w-xl flex-col border-x-0
       border-light-border pb-96`,
    )}>
      <SEO title="All Media / Tweetbook" />
      {/* <h1 className='ClipStreamText22'>A bit about ClipStream</h1>
      <h1 className='ClipStreamText'>
        <span className='ClipStreamText'>
          ClipStream is your go-to space for sharing and discovering short, dynamic videos. Whether you're
        </span>
        <br />
        <span className='ClipStreamText'>
          showcasing your latest creative project, sharing a quick tip, or just having fun, ClipStream lets you
        </span>
        <br />
        <span className='ClipStreamText'>
          connect with others through engaging and visually appealing clips.
          <span className='ClipStreamTextMore' onClick={toggleShowMore}>
            {showMore ? 'Less...' : 'Read more about the features...'}
          </span>
        </span>
      </h1> */}
      {showMore && (
        <div className='ClipStreamMoreText'>
          <p>Features:</p>
          <ul>
            <li className='ClipStreamText'>Video Uploads: Easily upload and share your short videos.</li>
            <li className='ClipStreamText'>Editing Tools: Use a variety of filters, effects, and music to enhance your clips.</li>
            <li className='ClipStreamText'>Discover: Browse trending clips and discover new creators.</li>
            <li className='ClipStreamText'>Engage: Like, comment, and share your favorite clips with your friends.</li>
          </ul>
          <p>Sample Tweetbook:</p>
          <blockquote className='ClipStreamText'>
            "🎥🚀 Dive into the world of short videos with #ClipStream! Share your creativity, explore new trends, and connect with a community of creators. Get started now and make your moments shine! ✨📲"
          </blockquote>
          <span className='ClipStreamTextMore' onClick={toggleModal}>#VideoMagic #ClipStream</span>
        </div>
      )}
      {loading ? (
        <Loading className="mt-5" />
      ) : !sortedTweets ? (
        <StatsEmpty
          title="No Media Found"
          description="No media tweets available at the moment."
          imageData={{ src: '/assets/no-media.png', alt: 'No media' }}
        />
      ) : (
        <AnimatePresence mode="popLayout">
          {sortedTweets.map((tweet) => (
            <Tweet {...tweet} key={tweet.id} />
          ))}
        </AnimatePresence>
      )}

      {/* Modal for Hashtag Info */}
      {showModal && (
  <div className='modal-overlay5262236' onClick={toggleModal}>
    <div className='modal-2326727473' onClick={e => e.stopPropagation()}>
      <h2>About Hashtags</h2>
      <ol>
        <li className='ClipStreamText2'>#VideoMagic: Showcases the magic and excitement of short videos.</li>
        <li className='ClipStreamText2'>#ClipStream: Represents our platform where creativity meets video.</li>
        <li className='ClipStreamText2'>#Shorts: Highlights short-form content that's quick to consume.</li>
        <li className='ClipStreamText2'>#TrendingClips: Focuses on the most popular and trending videos.</li>
        <li className='ClipStreamText2'>#CreativeProjects: Emphasizes unique and creative video projects shared by users.</li>
      </ol>
      <button className='ClipStreamTextMore' onClick={toggleModal}>Agree & continue</button>
    </div>
  </div>
)}
      <button
        onClick={scrollToTop}
        className="fixed bottom-4 right-4 p-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600"
      >
       Top ↑?
      </button>
    </div>
  );
}

Video.getLayout = (page: ReactElement): ReactNode => (
  <ProtectedLayout>
    <MainLayout>
      <HomeLayout>{page}</HomeLayout>
    </MainLayout>
  </ProtectedLayout>
);