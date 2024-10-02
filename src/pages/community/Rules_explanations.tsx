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
               <div className='dgsgsesdgsgdsgsedge grid w-[50%] grid-cols-[1fr,auto,1fr] items-center gap-2'>
                  <i className='border-b border-light-border dark:border-dark-border' />
                  <p>Rules & explanations</p>
                  <i className='border-b border-light-border dark:border-dark-border' />
                </div>
                <h1 className='sdgsdgsgdsfgseg relative text-lg font-bold mb-2 left-[10px] top-[5px]'>Hate Speech and Harassment</h1>
                <span className='sdgsdgsgdsfgseg relative text-sm text-gray-600 mb-4 left-[10px]'>Any form of hate speech, bullying, or harassment targeting individuals
                  <br /> or groups based on race,</span>
                  <span className='sdgsdgsgdsfgseg relative text-sm text-gray-600 mb-4 left-[10px]'>ethnicity, nationality, religion, gender, sexual orientation, or disability is strictly prohibited on</span>
                  <span className='sdgsdgsgdsfgseg relative text-sm text-gray-600 mb-4 left-[10px]'>Tweetbook. This includes threats, personal attacks,
                    <br /> and any language that promotes violence or discrimination.</span>
                    
                    <h1 className='sdgsdgsgdsfgseg relative text-lg font-bold mb-2 left-[10px] top-[5px]'>Misinformation and False Claims</h1>
                    <span className='sdgsdgsgdsfgseg relative text-sm text-gray-600 mb-4 left-[10px]'>Sharing false information, including misleading news articles, fraudulent claims, or unfounded</span>
                    <span className='sdgsdgsgdsfgseg relative text-sm text-gray-600 mb-4 left-[10px]'>rumors, is not allowed on Tweetbook. Users must strive to verify the 
                      <br />authenticity of information</span>
                    <span className='sdgsdgsgdsfgseg relative text-sm text-gray-600 mb-4 left-[10px]'>before posting and avoid spreading unverified or harmful 
                      <br />content.</span>
                  
                      <h1 className='sdgsdgsgdsfgseg relative text-lg font-bold mb-2 left-[10px] top-[5px]'>Spam and Self-Promotion</h1>
                      <span className='sdgsdgsgdsfgseg relative text-sm text-gray-600 mb-4 left-[10px]'>Posting repetitive messages, unsolicited advertisements, or excessive self-promotion is</span>
                      <span className='sdgsdgsgdsfgseg relative text-sm text-gray-600 mb-4 left-[10px]'>prohibited on Tweetbook. Users should refrain from posting links or promoting products,</span>
                      <span className='sdgsdgsgdsfgseg relative text-sm text-gray-600 mb-4 left-[10px]'>services, or accounts without the community's permission or relevant context.</span>
   
                      <h1 className='sdgsdgsgdsfgseg relative text-lg font-bold mb-2 left-[10px] top-[5px]'>Invasion of Privacy</h1>
                      <span className='sdgsdgsgdsfgseg relative text-sm text-gray-600 mb-4 left-[10px]'>Sharing personal information about other individuals without their consent, including private</span>
                      <span className='sdgsdgsgdsfgseg relative text-sm text-gray-600 mb-4 left-[10px]'>messages, personal photos, or identifying details, is not allowed on Tweetbook. Respecting</span>
                      <span className='sdgsdgsgdsfgseg relative text-sm text-gray-600 mb-4 left-[10px]'>others' privacy is essential for maintaining a safe and welcoming community.</span>

                  
         
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
