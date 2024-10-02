import { useState } from 'react';
import { StatsEmpty } from '@components/Post/stats-empty';
import { AnimatePresence } from 'framer-motion';
import { where, orderBy } from 'firebase/firestore';
import { useWindow } from '@lib/context/window-context';
import { useInfiniteScroll } from '@lib/hooks/useInfiniteScroll';
import { tweetsCollection } from '@lib/firebase/collections';
import { HomeLayout, ProtectedLayout } from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import { SEO } from '@components/common/seo';
import { MainContainer } from '@components/home/main-container-home';
import { Input } from '@components/input/input';
import { Tweet } from '@components/Post/tweet';
import { Loading } from '@components/ui/loading';
import { Error } from '@components/ui/error';
import { Ad } from '@components/aside/ad'; // This is the Ad component


import type { ReactElement, ReactNode } from 'react';
export function AsideSidbar(): JSX.Element {
  const [showMore, setShowMore] = useState(false);
  const [activeButton, setActiveButton] = useState<string | null>(null);

  // Function to handle button clicks
  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };
  const { data, loading, LoadMore } = useInfiniteScroll(
    tweetsCollection,
    [where('parent', '==', null), orderBy('createdAt', 'desc')],
    { includeUser: true, allowNull: true, preserve: true }
  );
  const { isMobile } = useWindow();
  const [filteredData, setFilteredData] = useState<any[]>([]);



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

  
  return (
    <div className="aside-sidebar">
      <section className="ADTweetbook bg-main-sidebar-background border border-gray-200 rounded-lg p-4">
        {/* Button row */}
        <div className="button-row">
          {!showMore ? (
            <>
              <button className="btn" onClick={() => handleButtonClick('All')}>All</button>
              <button className="btn" onClick={() => handleButtonClick('Gaming')}>Gaming</button>
              <button className="btn" onClick={() => handleButtonClick('Live')}>Live</button>
              <button className="btn" onClick={() => handleButtonClick('Mixes')}>Mixes</button>
              <button className="btn" onClick={() => handleButtonClick('Music')}>Music</button>
              <button className="btn" onClick={() => handleButtonClick('AI')}>AI</button>
              <button className="arrow-btn" onClick={() => setShowMore(true)}>→</button>
            </>
          ) : (
            <>
              <button className="btn" onClick={() => handleButtonClick('News')}>News</button>
              <button className="btn" onClick={() => handleButtonClick('Popular')}>Popular</button>
              <button className="btn" onClick={() => handleButtonClick('Laughs')}>Laughs</button>
              <button className="btn" onClick={() => handleButtonClick('Trends')}>Trends</button>
              <button className="arrow-btn" onClick={() => setShowMore(false)}>←</button>
            </>
          )}
        </div>

        {/* Active button content, only shown when activeButton is not null */}
        {activeButton && (
          <div className="">
            {/* Render different content based on activeButton */}
            {activeButton === 'All' && 
              <div>
           <div className="posts-section">
          {/* Display filtered data */}
          {loading ? (
            <Loading className="mt-5" />
          ) : !filteredData.length ? (
            <div>
              <StatsEmpty
                title='Errors in uploading posts'
                description='Probably no results were found, or you should check the internet'
                imageData={{ src: '/assets/no-bookmarks.png', alt: 'No bookmarks' }}
              />
            </div>
          ) : (
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
          )}
        </div>
              </div>}
            {activeButton === 'Gaming' && 
            <div>
              <StatsEmpty
                title='Errors in uploading posts{Gaming}'
                description='Probably no results were found, or you should check the internet'
                imageData={{ src: '/assets/no-bookmarks.png', alt: 'No bookmarks' }}
              />
            </div>}
            {activeButton === 'Live' && 
              <div>
              <StatsEmpty
                title='Errors in uploading posts{Live}'
                description='Probably no results were found, or you should check the internet'
                imageData={{ src: '/assets/no-bookmarks.png', alt: 'No bookmarks' }}
              />
              </div>}
            {activeButton === 'Mixes' && 
              <div>
               <StatsEmpty
                title='Errors in uploading posts{Mixes}'
                description='Probably no results were found, or you should check the internet'
                imageData={{ src: '/assets/no-bookmarks.png', alt: 'No bookmarks' }}
              />
              </div>}
            {activeButton === 'Music' && 
              <div>
                <StatsEmpty
                title='Errors in uploading posts{Music}'
                description='Probably no results were found, or you should check the internet'
                imageData={{ src: '/assets/no-bookmarks.png', alt: 'No bookmarks' }}
              />
              </div>}
            {activeButton === 'AI' && 
              <div>
                <StatsEmpty
                title='Errors in uploading posts{AI}'
                description='Probably no results were found, or you should check the internet'
                imageData={{ src: '/assets/no-bookmarks.png', alt: 'No bookmarks' }}
              />
              </div>}
            {activeButton === 'News' && 
              <div>
                <StatsEmpty
                title='Errors in uploading posts{News}'
                description='Probably no results were found, or you should check the internet'
                imageData={{ src: '/assets/no-bookmarks.png', alt: 'No bookmarks' }}
              />
              </div>}
            {activeButton === 'Popular' && 
              <div>
                <StatsEmpty
                title='Errors in uploading posts{Popular}'
                description='Probably no results were found, or you should check the internet'
                imageData={{ src: '/assets/no-bookmarks.png', alt: 'No bookmarks' }}
              />
              </div>}
            {activeButton === 'Laughs' && 
              <div>
                <StatsEmpty
                title='Errors in uploading posts{Laughs}'
                description='Probably no results were found, or you should check the internet'
                imageData={{ src: '/assets/no-bookmarks.png', alt: 'No bookmarks' }}
              />
              </div>}
            {activeButton === 'Trends' &&
              <div>
                <StatsEmpty
                title='Errors in uploading posts{Trends}'
                description='Probably no results were found, or you should check the internet'
                imageData={{ src: '/assets/no-bookmarks.png', alt: 'No bookmarks' }}
              />
              </div>}
          </div>
        )}
      </section>
    </div>
  );
}
