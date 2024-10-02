// pages/trends.tsx

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tweet } from '../components/Post/tweet'; // Adjust import path
import { MainLayout } from '../components/layout/main-layout'; // Adjust import path
import { SEO } from '../components/common/seo'; // Adjust import path
import { MainHeader } from '../components/home/main-header'; // Adjust import path
import { MainContainer } from '../components/home/main-container-home'; // Adjust import path
import { Loading } from '../components/ui/loading'; // Adjust import path
import { Error } from '../components/ui/error'; // Adjust import path
import { useAuth } from '@lib/context/auth-context';
import { HomeLayout, ProtectedLayout } from '@components/layout/common-layout';


interface Post {
  id: string;
  text: string;
  likes: number;
  // Add other relevant fields from your tweet data
}

const Trends = () => {
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrendingPosts = async () => {
      try {
        const response = await fetch('/api/trending-posts');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: Post[] = await response.json();
        setTrendingPosts(data);
      } catch (error) {
        console.error('Failed to fetch trending posts:', error);
        setError('Check your internet, working on your app issues..');
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingPosts();
  }, []);

  return (
    <MainContainer  className='TweetbookHome'>
            <br />
            <br />
      <SEO title='Trending / YourAppName' />
      <MainHeader useActionButton title='Trending Posts' action={() => {}} />
      <section>
        {loading ? (
          <Loading className='mt-5' />
        ) : error ? (
          <Error message={error} />
        ) : (
          <motion.div className='mt-0.5'>
            {trendingPosts.length > 0 ? (
              trendingPosts.map((post) => (
                <Tweet key={post.id} {...post} />
              ))
            ) : (
              <p>No trending posts available.</p>
            )}
          </motion.div>
        )}
      </section>
    </MainContainer>
  );
};

export default Trends;
Trends.getLayout = (page: ReactElement): ReactNode => (
    <ProtectedLayout>
      <MainLayout>
        <HomeLayout>{page}</HomeLayout>
      </MainLayout>
    </ProtectedLayout>
  );
  