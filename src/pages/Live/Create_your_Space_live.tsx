import { useRef, useState, useEffect } from 'react';
import { ReactElement, ReactNode } from 'react';
import { ProtectedLayout , HomeLayout } from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import { MainContainer } from '@components/home/main-container-me2';
import { CreateyourSpaceliveChat } from '../../components/aside/Create_your_Space_live_Chat';
import Hls from 'hls.js'; // Import Hls.js
import { MainHeader } from '@components/home/main-header';

export default function Create_your_Space_live(): JSX.Element {
  const [streamCode, setStreamCode] = useState<string | null>(null);
  const [bearerToken, setBearerToken] = useState<string | null>(null); // Bearer token state
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Function to create a stream URL with a token
  const handleCreateStream = () => {
    const code = `http://your-server-url/live/${new Date().getTime()}.m3u8`; // Update to HLS URL
    const token = `BearerToken_${Math.random().toString(36).substr(2, 12)}`; // Generate a random token
    setStreamCode(code);
    setBearerToken(token);
  };

  useEffect(() => {
    if (videoRef.current && streamCode) {
      const video = videoRef.current;
  
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(streamCode);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play();
        });
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS error: ', data);
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamCode; // For Safari
        video.addEventListener('loadedmetadata', () => {
          video.play();
        });
      }
    }
  }, [streamCode]);
  

  return (
    <>
      {/* Main content area */}
      <MainContainer className='InputisMobile2 !pb-[1280px]'>
        <section>
          <MainHeader className=''>
            <button 
              className="custom-button2hyeh custom-button accent-tab hover-card block w-full"
              style={{ borderRadius: '0' }} // Setting border-radius to zero
              onClick={handleCreateStream}
            >
              Create Live Stream
            </button>
          </MainHeader>

          {streamCode && (
            <div className="ADTweetbook23522 border-light-border dark:border-dark-border border-1 xs:border p-4 mt-4">
              <p>Use this information in OBS:</p>
              <div>
                <p><strong>Server:</strong> {streamCode}</p>
                <p><strong>Bearer Token:</strong> {bearerToken}</p>
              </div>
            </div>
          )}

          {/* Video Player */}
          <div className="mt-4" style={{ width: '100%', height: '70%', backgroundColor: '#000' }}>
            <video 
              ref={videoRef} 
              controls 
              style={{ width: '100%', height: '100%' }}
            />
          </div>

          <CreateyourSpaceliveChat />
        </section>
      </MainContainer>
    </>
  );
}

Create_your_Space_live.getLayout = (page: ReactElement): ReactNode => (
  <ProtectedLayout>
    <MainLayout>
      <HomeLayout>{page}</HomeLayout>
    </MainLayout>
  </ProtectedLayout>
);
