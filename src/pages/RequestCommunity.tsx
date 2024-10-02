import { useState } from 'react';
import { useAuth } from '@lib/context/auth-context';
import { MainContainer } from '@components/home/main-container-me2';
import { SEO } from '@components/common/seo';
import { SpeakerXMarkIcon, PencilIcon, UsersIcon } from '@heroicons/react/24/outline';
import { HomeLayout, ProtectedLayout } from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import type { ReactElement, ReactNode } from 'react';

export default function RequestCommunity(): JSX.Element {
  const { user } = useAuth();
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const handleOpenErrorModal = () => {
    setIsErrorModalOpen(true);
  };

  const handleCloseErrorModal = () => {
    setIsErrorModalOpen(false);
  };

  return (
    <MainContainer>
      <br />
      <br />
      <br />
      <SEO title='Bookmarks / Tweetbook' />
      <h1>
        <span className='RequestaCommunityText'>Request a Community Note about</span>
        <span className='RequestaCommunityText'>this post</span>
      </h1>
      <h1>
        <span className='RequestaCommunityText2'>Think this post is potentially misleading? Request a </span>
        <br />
        <span className='RequestaCommunityText2'>Community Note.</span>
      </h1>
      <h1>
        <p className='SpeakerXMarkIcon'><SpeakerXMarkIcon className='h-5 w-5' /></p>
        <span className='SpeakerXMarkIconText2'>Contributors will see alerts on posts that get enough requests</span>
      </h1>
      <h1>
        <p className='SpeakerXMarkIcon'><PencilIcon className='h-5 w-5' /></p>
        <span className='SpeakerXMarkIconText23'>If a note is written and rated helpful by other contributors,</span>
        <br />
        <span className='SpeakerXMarkIconText23'>it will be shown on the post</span>
      </h1>
      <h1>
        <p className='SpeakerXMarkIcon'><UsersIcon className='h-5 w-5' /></p>
        <span className='SpeakerXMarkIconText2'>Tweetbook doesn’t choose which notes show – Community Notes</span>
        <br />
        <span className='SpeakerXMarkIconText23'>is by the people, for the people</span>
      </h1>
      <h1 className='RequestaCommunityText24'>
        Requests are anonymized and made available to the public for transparency
      </h1>
      <button className='RequestaCommunitybutton24' onClick={handleOpenErrorModal}>
        Agree & Request a note
      </button>

      {isErrorModalOpen && (
        <div className="error-modal">
          <div className="error-modal-content">
            <h2>Error</h2>
            <p>Sorry, we must have reached the page.</p>
            <button onClick={handleCloseErrorModal}>Agree & Exit</button>
          </div>
        </div>
      )}
    </MainContainer>
  );
}

RequestCommunity.getLayout = (page: ReactElement): ReactNode => (
  <ProtectedLayout>
    <MainLayout>
      <HomeLayout>{page}</HomeLayout>
    </MainLayout>
  </ProtectedLayout>
);
