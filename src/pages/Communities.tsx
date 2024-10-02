import React, { useState, useEffect } from 'react';
import { useAuth } from '@lib/context/auth-context';
import { HomeLayout, ProtectedLayout } from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import { SEO } from '@components/common/seo';
import { MainHeader } from '@components/home/main-header';
import { HeroIcon } from '@components/ui/hero-icon';
import { useRouter } from 'next/router';
import { MainContainer } from '@components/home/main-container-home';
import { Loading } from '@components/ui/loading';
import { Tweet } from '@components/Post/tweet';
import { useInfiniteScroll } from '@lib/hooks/useInfiniteScroll';
import { tweetsCollection } from '@lib/firebase/collections';
import { where, orderBy } from 'firebase/firestore';
import cn from 'clsx';

export default function Groups(): JSX.Element {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'home' | 'explore'>('home'); // Track the active tab
  const [messages, setMessages] = useState<any[]>([]); // State for messages
  const [loading, setLoading] = useState(true); // Loading state for tweets
  const router = useRouter();

  // Fetching tweets for the explore tab
  const { data, loading: tweetsLoading } = useInfiniteScroll(
    tweetsCollection,
    [where('parent', '==', null), orderBy('createdAt', 'desc')],
    { includeUser: true, allowNull: true, preserve: true }
  );

  useEffect(() => {
    if (!tweetsLoading) {
      setLoading(false);
    }
  }, [tweetsLoading]);

  const handleLikePost = (postId: string, userId: string, tweetIsLiked: boolean) => {
    // Handle liking a post
  };

  return (
    <MainContainer>
      <div className={cn('hover-animation flex min-h-screen w-full max-w-xl flex-col')}>
        <div className="InputisMobile2">
          <SEO title="User Lists / Tweetbook" />

          {/* Main Header - Always visible */}
          <MainHeader className="flex items-center justify-between">
            <div className="-mb-1 flex flex-col">
              <button
                className="CreateBtnPost222 group flex items-center justify-between gap-4 rounded-full
                       bg-main-search-background px-4 py-2 focus-within:bg-main-background
                       focus-within:ring-2 focus-within:ring-main-accent"
                onClick={() => router.push('/community/verified-get-Communities')}
              >
                <HeroIcon
                  className="h-5 w-5 text-light-secondary transition-colors group-focus-within:text-main-accent dark:text-dark-secondary"
                  iconName="UsersIcon"
                />
              </button>
              <label
                className="CreateBtnPost22 group flex items-center justify-between gap-4 rounded-full
                       bg-main-search-background px-4 py-2 focus-within:bg-main-background
                       focus-within:ring-2 focus-within:ring-main-accent"
                style={{ width: '70%', height: '40px', transform: 'translateX(13px)', marginTop: '10px' }}
                onClick={() => router.push('/community/Search')}
              >
                <i>
                  <HeroIcon
                    className="h-5 w-5 text-light-secondary transition-colors 
                             group-focus-within:text-main-accent dark:text-dark-secondary"
                    iconName="MagnifyingGlassIcon"
                  />
                </i>
                <input
                  className="TweetbookSearchinput peer flex-1 bg-transparent outline-none 
                           placeholder:text-light-secondary dark:placeholder:text-dark-secondary"
                  type="text"
                  placeholder="Click here to search for more communities"
                />
              </label>
            </div>
          </MainHeader>

          {/* Buttons - Always visible */}
          <div className="MainHeaderButtom" style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
            <button
              className={cn(
                'gfdegesgdsgsegsg hover-animation main-tab dark-bg-tab flex flex-1 justify-center hover:bg-light-primary/10 dark:hover:bg-dark-primary/10',
                { 'active-tab': activeTab === 'home' }
              )}
              onClick={() => setActiveTab('home')}
            >
              <p className="dgsgsgsdgsedsgsdgsege flex flex-col gap-3 whitespace-nowrap pt-3 font-bold transition-colors duration-200">
                Home
              </p>
            </button>
            <button
              className={cn(
                'gfdegesgdsgsegsg hover-animation main-tab dark-bg-tab flex flex-1 justify-center hover:bg-light-primary/10 dark:hover:bg-dark-primary/10',
                { 'active-tab': activeTab === 'explore' }
              )}
              onClick={() => setActiveTab('explore')}
            >
              <p className="dgsgsgsdgsedsgsdgsege flex flex-col gap-3 whitespace-nowrap pt-3 font-bold transition-colors duration-200">
                Explore
              </p>
            </button>
          </div>

          {/* Content Area - This changes based on the active tab */}
          <div className="dfgukshygehjkgdiluysde9iopui">
            {activeTab === 'home' ? (
              <div>
                {loading ? (
                <Loading />
              ) : (
              <>
              <div className='dgsdsdghsdhsghee'>
                {/* Home Content */}
                <p className='relative text-sm text-gray-600 mb-4 left-[10px]'>Welcome! To view our communities</p>
                <button className='communitiesbutton' onClick={() => router.push('/community/Search')}>
                  communities
                </button>
                <div className='dgsgsesdgsgdsgsedge grid w-[50%] grid-cols-[1fr,auto,1fr] items-center gap-2'>
                  <i className='border-b border-light-border dark:border-dark-border' />
                  <p>or</p>
                  <i className='border-b border-light-border dark:border-dark-border' />
                </div>
               <div className='dstgagdsgsegdge'>
               <p className='relative text-sm text-gray-600 mb-4 left-[10px]'>Welcome! Creating your own community You can upload posts in your 
                <br />community, develop your community and create your own world</p>
                <button className='communitiesbutton2' onClick={() => router.push('/community/verified-get-Communities')}>
                Create your own community
                </button>
               </div>
               <div className='dgsgsesdgsgdsgsedge grid w-[50%] grid-cols-[1fr,auto,1fr] items-center gap-2'>
                  <i className='border-b border-light-border dark:border-dark-border' />
                  <p>Rules & explanations</p>
                  <i className='border-b border-light-border dark:border-dark-border' />
                </div>
                <p className='relative text-sm text-gray-600 mb-4 left-[10px]'>Viewing the rules of the communities</p>
                <button className='communitiesbutton3' onClick={() => router.push('/community/Rules_explanations')}>
                Rules & explanations
                </button>
              </div>
              </>
            )}
              </div>
            ) : (
              <div>
                {/* Explore Content */}
                {loading ? (
                  <Loading />
                ) : (
                  <>
                    <div className='sdgfagdsgdgsgdge'>
                      {data.map((tweet) => (
                        <Tweet key={tweet.id} {...tweet} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainContainer>
  );
}

Groups.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <ProtectedLayout>
      <MainLayout>
        <HomeLayout>{page}</HomeLayout>
      </MainLayout>
    </ProtectedLayout>
  );
};
