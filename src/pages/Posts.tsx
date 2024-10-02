import { AnimatePresence } from 'framer-motion';
import { where, orderBy } from 'firebase/firestore';
import { useWindow } from '@lib/context/window-context';
import { useInfiniteScroll } from '@lib/hooks/useInfiniteScroll';
import { tweetsCollection } from '@lib/firebase/collections';
import { HomeLayout } from '@components/layout/common-layout';
import { ProtectedLayout } from '@components/layout/common-layout-U';
import { MainLayout } from '@components/layout/main-layout-U';
import { SEO } from '@components/common/seo';
import { MainContainer } from '@components/home/main-container-me22';
import { Input } from '@components/input/input';
import { Tweet } from '@components/Post/tweet';
import { Loading } from '@components/ui/loading';
import { Error } from '@components/ui/error';
import { useState, useEffect } from 'react';
import { AsideSidbar } from '@components/aside/aside-Sidbar';
import { Ad } from '@components/aside/ad'; // This is the Ad component
import { StatsEmpty } from '@components/Post/stats-empty';

import type { ReactElement, ReactNode } from 'react';

export default function Posts(): JSX.Element {
  const { isMobile } = useWindow();
  const [activeButton, setActiveButton] = useState<string | null>('All'); // Default to 'All'
  const [showMore, setShowMore] = useState(false);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const { data, loading, LoadMore } = useInfiniteScroll(
    tweetsCollection,
    [where('parent', '==', null), orderBy('createdAt', 'desc')],
    { includeUser: true, allowNull: true, preserve: true }
  );

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
    filterData(buttonName);
  };

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  // Function to filter data based on the selected category
  const filterData = (category: string) => {
    if (data) {
      let filtered = data;

      if (category === 'Popular') {
        filtered = filtered.sort((a, b) => b.likes - a.likes);
      } else if (category === 'Trends') {
        filtered = filtered.sort((a, b) => b.likes - a.likes);
      } else if (category === 'New') {
        filtered = filtered.sort((a, b) => b.createdAt - a.createdAt);
      } else {
        filtered = filtered.filter(item => item.category === category || category === 'All');
      }

      setFilteredData(filtered);
    }
  };

  useEffect(() => {
    if (activeButton) {
      filterData(activeButton);
    } else {
      setFilteredData([]);
    }
  }, [data, activeButton]);

  return (
    <MainContainer>
      <br />
      <br />
      <br />
      <SEO title="Home / Tweetbook" />

      <section className="flex flex-col">
        {/* Posts section */}
        <div className="posts-section">
            <>
              <AnimatePresence mode="popLayout">
                {filteredData.map((tweet, index) => (
                  <div key={tweet.id}>
                    <Tweet {...tweet} />
                    {(index + 1) % 40 === 0 && <Ad key={`ad-${index}`} />}
                  </div>
                ))}
              </AnimatePresence>
              <LoadMore />
            </>
        </div>
      </section>
    </MainContainer>
  );
}

Posts.getLayout = function getLayout(page: ReactElement): ReactNode {
    return (
      <ProtectedLayout>
        <MainLayout>{page}</MainLayout>
      </ProtectedLayout>
    );
  };