import { MainHeader } from '@components/home/main-header';
import { ReactElement, ReactNode } from 'react';
import { ProtectedLayout } from '@components/layout/common-layout-Settings';
import { useEffect, useState } from 'react';
// Importing server functions for followers and user details
import { getFollowersForUser, getUserDetails } from '@lib/firebase/SubscriptionsY'; 
import { Menu } from '@headlessui/react';
import { Button } from '@components/ui/button';
import { useRouter } from 'next/router';
import cn from 'clsx';
import { MainLayout } from '@components/layout/main-layout';

import { collection, query, where, getDocs, addDoc, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase/app';
import { StatsEmpty } from '@components/Post/stats-empty';
import { useAuth } from '@lib/context/auth-context';
import { MainContainer } from '@components/home/main-container-me22'; 
import { HeroIcon } from '@components/ui/hero-icon';
import { UserCard } from '@components/user/user-card2';

const AdsSubscriptionsY = ({ userId, targetUserId }) => {
  const [followerCount, setFollowerCount] = useState<number | null>(null); // Initialize followerCount as null
  const router = useRouter();

  // Function to handle button navigation
  const handleNavigation = (page: string) => {
    router.push(page);
  };

  const [isVerified, setIsVerified] = useState(false);
  const PermissionStatusFGG = () => {
    router.push('AD')
  }
  // Function to fetch and update the follower count
  const updateFollowerCount = async () => {
    try {
      console.log(`Fetching followers for user ${targetUserId}...`); // Debugging log
      const followers = await getFollowersForUser(targetUserId); // Server logic for fetching followers
      console.log(`Follower count for user ${targetUserId}:`, followers.length); // Debugging log
      setFollowerCount(followers.length);
    } catch (error) {
      console.error('Error fetching follower count:', error);
    }
  };
  const yearsold = async () => {
    try {
      console.log(`Fetching followers for user ${targetUserId}...`); // Debugging log
      const followers = await getFollowersForUser(targetUserId); // Server logic for fetching followers
      console.log(`Follower count for user ${targetUserId}:`, followers.length); // Debugging log
    } catch (error) {
      console.error('Error fetching follower count:', error);
    }
  };
  useEffect(() => {
    // Fetch user data, including verification status and follower count
    const fetchUserData = async () => {
      try {
        console.log(`Fetching details for user ${userId}...`); // Debugging log
        const userData = await getUserDetails(userId); // Server function for fetching user details
        if (userData) {
          setIsVerified(userData.verified || false);
          await updateFollowerCount();
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId, targetUserId]); // Make sure to re-fetch when either userId or targetUserId changes

  return (
    <MainContainer className='gourggrgr_Settings'>
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
                onClick={() => handleNavigation('/Settings/Youraccount')}
              >
                <span className='ProfileTEct'>Your account</span>
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

                onClick={() => handleNavigation('/Settings/Monetization')}
              >
                <span className='ProfileTEct'>Monetization</span>
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
                onClick={() => handleNavigation('/premium')}
              >
                <span className='ProfileTEct'>Premium</span>
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
                onClick={() => handleNavigation('/Settings/security_and_account_access')}
              >
                <span className='ProfileTEct'>Security and account access</span>
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
                onClick={() => handleNavigation('/Settings/notifications')}
              >
                <span className='ProfileTEct'>Notifications</span>
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
                onClick={() => handleNavigation('/Settings/accessibility_display_and_languages')}
              >
                <span className='ProfileTEct'>Accessibility, display, and languages</span>
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
                onClick={() => handleNavigation('/HelpCenter/Tweetbook_for_good')}
              >
                <span className='ProfileTEct'>Help Center</span>
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
          <path d="M8 6h10v10h-2V9.41L5.957 19.46l-1.414-1.42L14.586 8H8V6z"></path>
          </g>
        </svg>
              </Button>
            </li>
        </ul>
      </div>

      {/* User Details */}
      <div className="w-3/4">
      <div className=''>
      <MainHeader>
            <h1 className='YourAccount'>Ads revenue sharing</h1>
            <span className='spanYourAccount2'>
            Unfortunately, you don’t meet our eligibility requirements for
            Subscriptions at this time.
            </span>
      </MainHeader>
      <ul className='list-none'>
        <li className='list-noneText h-[70px]'>
         <span className='gaopuagwg'>0 Followers</span>{' '}
          {followerCount !== null ? ( // Ensure that followerCount has been fetched
            followerCount >= 10 ? (
              <span className='gaopuagwg' style={{ color: 'green' }}>✔️</span>
            ) : (
              <span style={{ color: 'gray' }}>⚪</span>
            )
          ) : (
            <span>Loading...</span> // Show loading if followerCount is still being fetched
          )}
        </li>
        <div className='border-light-border dark:border-dark-border border-1 xs:border'></div>
        <Menu className="" as="section">
        <Menu.Item>
                    {({ active }): JSX.Element => (
                      <Button
                      className="custom-button2hyeh custom-button accent-tab hover-card block w-full"
                      style={{ borderRadius: '0' }} // Setting border-radius to zero
                      onClick={() => handleNavigation('/AD')}
                      >
                        <p className="btnH12P GetverifiedBtn">Create AD</p>
                      </Button>
                    )}
                  </Menu.Item>
                  </Menu>
      </ul>
    </div>
      </div>
    </div>
  </MainContainer>
  );
};

export default AdsSubscriptionsY;

AdsSubscriptionsY.getLayout = function getLayout(page: ReactElement): ReactNode {
  return (
    <ProtectedLayout>
      <MainLayout>{page}</MainLayout>
    </ProtectedLayout>
  );
};
