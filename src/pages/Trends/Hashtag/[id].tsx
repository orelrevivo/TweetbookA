import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { HomeLayout, ProtectedLayout } from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import { MainContainer } from '@components/home/main-container-home';
import cn from 'clsx';

const HashtagPage = () => {
  const router = useRouter();
  const { id } = router.query; // Extract the dynamic id from the URL
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (router.isReady && id) {
      setLoading(false); // Stop loading when the id is ready
    }
  }, [router.isReady, id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className={cn(
      `hover-animation flex min-h-screen w-full max-w-xl flex-col`,
    )}>
      <div className='InputisMobile2'>
    <div className="p-4">
      <h1 className="text-2xl font-bold">Hashtag #{id}</h1>
      <p className='text-sm text-gray-600 mb-4'>Displaying posts related to the hashtag #{id}.</p>
    </div>
    </div>
     </div>
  );
};

export default HashtagPage;
HashtagPage.getLayout = (page: ReactElement): ReactNode => (
  <ProtectedLayout>
    <MainLayout>
      <HomeLayout>{page}</HomeLayout>
    </MainLayout>
  </ProtectedLayout>
);