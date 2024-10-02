import { MainHeader } from '@components/home/main-header';
import { useState, useEffect, ReactElement, ReactNode } from 'react';
import { MainLayout } from '@components/layout/main-layout';
import { ProtectedLayout } from '@components/layout/common-layout-Settings';
import { useRouter } from 'next/router';
import { collection, query, where, getDocs, addDoc, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase/app';
import { Button } from '@components/ui/button';
import { StatsEmpty } from '@components/Post/stats-empty';
import { useAuth } from '@lib/context/auth-context';
import { MainContainer } from '@components/home/main-container-me22'; 
import { HeroIcon } from '@components/ui/hero-icon';
import { UserCard } from '@components/user/user-card2';

const HelpCenter = () => {
  const router = useRouter();

  // Function to handle button navigation
  const handleNavigation = (page: string) => {
    router.push(page);
  };

  return (
    <MainContainer>
      <div className="flex">
        {/* Search Panel */}
        <div className="borderMessages w-3/5 p-0 border-light-border dark:border-dark-border border-1 xs:border">
          <label
            className="TweetbookSearch2 group flex items-center justify-between gap-4 rounded-[30px] h-[35px]
                       px-4 py-2 
                       focus-within:ring-2 focus-within:ring-main-accent border-light-border dark:border-dark-border border-1 xs:border"
          >
            <i>
              <HeroIcon
                className="h-5 w-5 text-light-secondary transition-colors 
                           group-focus-within:text-main-accent dark:text-dark-secondary"
                iconName="MagnifyingGlassIcon"
              />
            </i>
            <input
             onClick={() => handleNavigation('/Settings/Search')}
              type="text"
              className="peer flex-1 bg-transparent outline-none 
              placeholder:text-light-secondary dark:placeholder:text-dark-secondary"
              placeholder="Search Users"
            />
          </label>

          {/* Navigation buttons */}
          <ul className="ButtonProfileSettings mt-4 space-y-2">
            <li>
              <Button
          className="custom-button2hyeh custom-button accent-tab hover-card block w-full"
          style={{ borderRadius: '0' }} // Setting border-radius to zero
                onClick={() => handleNavigation('/HelpCenter/Tweetbook_for_good')}
              >
                <span className='ProfileTEct'>Tweetbook for good</span>
                <svg
                className='svgclassName'
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{
            width: '24px',
            height: '24px',
            fill: 'rgb(15, 20, 25)',
            marginRight: '10px', // Adds space between icon and text
          }}
        >
          <g>
            <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
          </g>
        </svg>
              </Button>
            </li>
            <li>
              <Button
          className="custom-button2hyeh custom-button accent-tab hover-card block w-full"
          style={{ borderRadius: '0' }} // Setting border-radius to zero

                onClick={() => handleNavigation('/HelpCenter/investors')}
              >
                <span className='ProfileTEct'>investors</span>
                <svg
                className='svgclassName2'
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{
            width: '24px',
            height: '24px',
            fill: 'rgb(15, 20, 25)',
            marginRight: '10px', // Adds space between icon and text
          }}
        >
          <g>
            <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
          </g>
        </svg>
              </Button>
            </li>
            <li>
              <Button
          className="custom-button2hyeh custom-button accent-tab hover-card block w-full"
          style={{ borderRadius: '0' }} // Setting border-radius to zero
                onClick={() => handleNavigation('/HelpCenter/blog')}
              >
                <span className='ProfileTEct'>Blog</span>
                <svg
                className='svgclassName3'
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{
            width: '24px',
            height: '24px',
            fill: 'rgb(15, 20, 25)',
            marginRight: '10px', // Adds space between icon and text
          }}
        >
          <g>
            <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
          </g>
        </svg>
              </Button>
            </li>
            {/* <li>
              <Button
          className="custom-button2hyeh custom-button accent-tab hover-card block w-full  text-main-accent"
          style={{ borderRadius: '0' }} // Setting border-radius to zero
                onClick={() => handleNavigation('/Settings/Subscriptions')}
              >
                <span className='ProfileTEct'>Creator Subscriptions</span>
              </Button>
            </li> */}
            <li>
              <Button
          className="custom-button2hyeh custom-button accent-tab hover-card block w-full"
          style={{ borderRadius: '0' }} // Setting border-radius to zero
                onClick={() => handleNavigation('/HelpCenter/transparency')}
              >
                <span className='ProfileTEct'>transparency</span>
                <svg
                className='svgclassName4'
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{
            width: '24px',
            height: '24px',
            fill: 'rgb(15, 20, 25)',
            marginRight: '10px', // Adds space between icon and text
          }}
        >
          <g>
            <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
          </g>
        </svg>
              </Button>
            </li>
            <li>
              <Button
          className="custom-button2hyeh custom-button accent-tab hover-card block w-full"
          style={{ borderRadius: '0' }} // Setting border-radius to zero
                onClick={() => handleNavigation('/HelpCenter/careers')}
              >
                <span className='ProfileTEct'>careers</span>
                <svg
                className='svgclassName5'
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{
            width: '24px',
            height: '24px',
            fill: 'rgb(15, 20, 25)',
            marginRight: '10px', // Adds space between icon and text
          }}
        >
          <g>
            <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
          </g>
        </svg>
              </Button>
            </li>
            <li>
              <Button
          className="custom-button2hyeh custom-button accent-tab hover-card block w-full"
          style={{ borderRadius: '0' }} // Setting border-radius to zero
                onClick={() => handleNavigation('/HelpCenter/about')}
              >
                <span className='ProfileTEct'>about</span>
                <svg
                className='svgclassName6'
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{
            width: '24px',
            height: '24px',
            fill: 'rgb(15, 20, 25)',
            marginRight: '10px', // Adds space between icon and text
          }}
        >
          <g>
            <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
          </g>
        </svg>
              </Button>
            </li>
            <li>
              <Button
          className="custom-button2hyeh custom-button accent-tab hover-card block w-full"
          style={{ borderRadius: '0' }} // Setting border-radius to zero
                onClick={() => handleNavigation('/HelpCenter/press')}
              >
                <span className='ProfileTEct'>press</span>
                <svg
                className='svgclassName7'
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{
            width: '24px',
            height: '24px',
            fill: 'rgb(15, 20, 25)',
            marginRight: '10px', // Adds space between icon and text
          }}
        >
          <g>
            <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
          </g>
        </svg>
              </Button>
            </li>
          </ul>
        </div>

        {/* User Details */}
        <div className="w-2/3 p-4">
        <div className="page-container">
      <h1 className='Anything2Dive'>Join the Conversation</h1>
      <div className='boxV2Anything'>
        <span>
        At Tweetbook, you’ll help build something that encourages
        </span>
        <br />
        <span>
        millions around the world to think more,
        </span>
        <br />
        <span>
        do more, learn more, feel more–and 
        </span>
        <br />
        <span>
        maybe even laugh more.
        </span>
        <br />
      </div>
    </div>

        </div>
      </div>
    </MainContainer>
  );
};

// Make sure to properly export YourAccount as default
export default HelpCenter;


// Layout wrapper
HelpCenter.getLayout = function getLayout(page: ReactElement): ReactNode {
  return (
    <ProtectedLayout>
      <MainLayout>{page}</MainLayout>
    </ProtectedLayout>
  );
};