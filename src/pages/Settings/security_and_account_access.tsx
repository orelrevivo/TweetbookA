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

const notifications = () => {
  const router = useRouter();

  // Function to handle button navigation
  const handleNavigation = (page: string) => {
    router.push(page);
  };
  // State to toggle the visibility of the square
  const [showSquare, setShowSquare] = useState(false);


  // Function to toggle the square on button click
  const toggleSquare = () => {
    setShowSquare(!showSquare);
  };

  // Function to navigate to the Premium page
  const navigateToPremium = () => {
    router.push('/premium');
  };
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
        <MainHeader>
            <h1 className='YourAccount'>Security and account access</h1>
            <span className='spanYourAccount'>Manage your account’s security and keep track of your account’s usage including apps that you have connected to your account.</span>
      </MainHeader>
            <div className='SettingsUScss '>
      <ul className='dsrgdgsedsgsgegd list-none'>
      <Button
          className="custom-button2hyeh14 custom-button accent-tab hover-card block w-full h-[70px]"
          style={{ borderRadius: '0' }} // Setting border-radius to zero
                onClick={() => handleNavigation('/Settings/verify_account_ownership')}
              >
                <span className='ProfileTEct22'>Connected accounts</span>
                <span className='spanYourAccount2'>Manage Google or Apple accounts connected to Tweetbook to log in.</span>
                <svg
                className='svgclassName'
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{
            width: '20px',
            height: '20px',
            fill: 'rgb(15, 20, 25)',
            marginRight: '10px', // Adds space between icon and text
          }}
        >
          <g>
          <path d="M15.96 1.54L21.41 7l-5.45 5.46-1.42-1.42L17.59 8H3V6h14.59l-3.05-3.04 1.42-1.42zM6.41 18l3.05 3.04-1.42 1.42L2.59 17l5.45-5.46 1.42 1.42L6.41 16H21v2H6.41z"></path>
          </g>
        </svg>
              </Button>
              <Button
          className="custom-button2hyeh14 custom-button accent-tab hover-card block w-full h-[70px]"
          style={{ borderRadius: '0' }} // Setting border-radius to zero
                onClick={() => handleNavigation('/Settings/verify_account_ownership_Security')}
              >
                <span className='ProfileTEct22'>Security</span>
                <span className='spanYourAccount2'>Manage your account’s security.</span>
                <svg
                className='svgclassName'
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{
            width: '20px',
            height: '20px',
            fill: 'rgb(15, 20, 25)',
            marginRight: '10px', // Adds space between icon and text
          }}
        >
          <g>
          <path d="M14 13c0 .74-.4 1.39-1 1.73V17h-2v-2.27c-.59-.34-1-.99-1-1.73 0-1.1.9-2 2-2 1.11 0 2 .9 2 2zm3.5-6H17v-.25c0-2.76-2.24-5-5-5s-5 2.24-5 5V7h-.5C5.12 7 4 8.12 4 9.5v9C4 19.88 5.12 21 6.5 21h11c1.38 0 2.5-1.12 2.5-2.5v-9C20 8.12 18.88 7 17.5 7zM9 6.75c0-1.66 1.34-3 3-3s3 1.34 3 3V7H9v-.25zm9 11.75c0 .28-.22.5-.5.5h-11c-.28 0-.5-.22-.5-.5v-9c0-.28.22-.5.5-.5h11c.28 0 .5.22.5.5v9z"></path>    
                </g>
        </svg>
              </Button>
      </ul>
    </div>
        </div>
      </div>
    </MainContainer>
  );
};

// Make sure to properly export YourAccount as default
export default notifications;

// Layout wrapper
notifications.getLayout = function getLayout(page: ReactElement): ReactNode {
  return (
    <ProtectedLayout>
      <MainLayout>{page}</MainLayout>
    </ProtectedLayout>
  );
};





// <MainHeader title="Two-factor authentication" />
// <span>
//   <span className='informationAccountSettingsUScss'>
//     Help protect your account from unauthorized access by requiring a second authentication method in addition to your Tweetbook password. 
//   </span>
//   <br />
//   <span className='informationAccountSettingsUScss'>
//     You can choose a text message, authentication app, or security key.
//   </span>
//   <MainHeader title="ID verification" />
//   <Button
//  className="custom-button2hyeh custom-button accent-tab hover-card block w-full"
//  style={{ borderRadius: '0' }} // Setting border-radius to zero
//        onClick={() => handleNavigation('/HelpCenter')}
//      >
//        <span className='ProfileTEct'>Two-factor authentication</span>
//      </Button>
//   <Button
//  className="custom-button2hyeh custom-button accent-tab hover-card block w-full"
//  style={{ borderRadius: '0' }} // Setting border-radius to zero
//  onClick={toggleSquare}
//      >
//        <span className='ProfileTEct'>ID verification</span>
//      </Button>
//     <div className=' px-4 py-2 transition '>
//     <span>
//     <span className='informationAccountSettingsUScss'>Upload an approved form of identification to confirm the authenticity of your account. </span>
//     <br />
//     <span className='informationAccountSettingsUScss'>Your information will only be used to validate your identity and will be handled safely and securely. </span>
//     </span>
//    </div>

// {showSquare && (
//    <div className='ViewandmanageSubscriptions22button2 bg-main-search-background px-4 py-2 transition bg-main-sidebar-background '>
//      <span className='informationAccountSettingsUScss'>Want to have an ID verified label in your profile?</span>
//      <br />
//      <button className='informationAccountSettingsUScss224' onClick={navigateToPremium}>
//        Upgrade to Premium?
//      </button>
//    </div>
//  )}
// </span>