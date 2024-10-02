import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { where, orderBy } from 'firebase/firestore';
import { tweetsCollection } from '@lib/firebase/collections';
import { useInfiniteScroll } from '@lib/hooks/useInfiniteScroll';
import {
  TrendsLayout,
  ProtectedLayout,
  HomeLayout
} from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import { SEO } from '@components/common/seo';
import { MainHeader } from '@components/home/main-header';
import { MainContainer } from '@components/home/main-container-home';
import { AsideTrends } from '@components/aside/aside-trends';
import { Button } from '@components/ui/button';
import { ToolTip } from '@components/ui/tooltip';
import { HeroIcon } from '@components/ui/hero-icon';
import { Tweet } from '@components/Post/tweet'; 
import { Loading } from '@components/ui/loading';
import { StatsEmpty } from '@components/Post/stats-empty';

import type { ReactElement, ReactNode } from 'react';

export default function Trends(): JSX.Element {
  const { back } = useRouter();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [subModal, setSubModal] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  
  const { data, loading, LoadMore } = useInfiniteScroll(
    tweetsCollection,
    [where('parent', '==', null), orderBy('likes', 'desc')],
    { includeUser: true, allowNull: true, preserve: true }
  );

  useEffect(() => {
    if (data) {
      // Filter posts to only include those with more than 5 likes
      const trendingPosts = data.filter(post => post.likes > 10000);
      setFilteredData(trendingPosts);
    }
  }, [data]);

  const openModal = (modal: string) => {
    setActiveModal(modal);
    setSubModal(null);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSubModal(null);
  };

  const openSubModal = (modal: string) => setSubModal(modal);
  const closeSubModal = () => setSubModal(null);

  return (
    <div className='MainContainerTR2'>
      <MainContainer>
        <SEO title="Trends / Tweetbook" />
        <br /><br />
        {/* Display trending posts */}
        <section className="posts-section">
          {loading ? (
            <Loading className="mt-5" />
          ) : !filteredData.length ? (
            <div>
              <StatsEmpty
                title='No Trending Posts'
                description='There are currently no trending posts with more than 10000K likes.'
                imageData={{ src: '/assets/no-bookmarks.png', alt: 'No trending posts' }}
              />
            </div>
          ) : (
            <>
              {filteredData.map((tweet) => (
                <Tweet key={tweet.id} {...tweet} />
              ))}
              <LoadMore />
            </>
          )}
        </section>
      </MainContainer>
    </div>
  );
}

Trends.getLayout = (page: ReactElement): ReactNode => (
  <ProtectedLayout>
    <MainLayout>
      <HomeLayout>{page}</HomeLayout>
    </MainLayout>
  </ProtectedLayout>
);
