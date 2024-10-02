import { MainHeader } from '@components/home/main-header';
import { ReactElement, ReactNode, useState, useEffect } from 'react';
import { ProtectedLayout } from '@components/layout/common-layout-Settings';
import { useAuth } from '@lib/context/auth-context';
import { updateNotificationSettings, getNotificationSettings } from '@lib/firebase/notifications'; // Adjust path if necessary
import { MainLayout } from '@components/layout/main-layout';
import { useRouter } from 'next/router';
import { collection, query, where, getDocs, addDoc, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase/app';
import { Button } from '@components/ui/button';
import { StatsEmpty } from '@components/Post/stats-empty';
import { MainContainer } from '@components/home/main-container-me22'; 
import { HeroIcon } from '@components/ui/hero-icon';
import { UserCard } from '@components/user/user-card2';


const Preferences = () => {
  const { user } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean | null>(null);
  const router = useRouter();

  // Function to handle button navigation
  const handleNavigation = (page: string) => {
    router.push(page);
  };
  useEffect(() => {
    const fetchNotificationSettings = async () => {
      if (user?.id) {
        const settings = await getNotificationSettings(user.id);
        setNotificationsEnabled(settings.muteNotifications !== true);
      }
    };

    fetchNotificationSettings();
  }, [user]);

  const handleNotificationToggle = async (enable: boolean) => {
    if (user?.id) {
      await updateNotificationSettings(user.id, { muteNotifications: !enable });
      setNotificationsEnabled(enable);
    }
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
          <h1 className='YourAccount'>Preferences</h1>
          <span className='spanYourAccount'>Select your preferences by notification type. Learn more</span>
    </MainHeader>
    <div className='SettingsUScss'>
      <ul className='list-none'>
        <span className='informationAccountSettingsUScss'>Getting notifications from Tweetbook ensures you’re always up-to-date with the 
          <br />latest</span>
        <br />
        <span className='informationAccountSettingsUScss'>interactions on your posts, keeping you engaged with your community.</span>
        <br />
        <span className='informationAccountSettingsUScss'>You’ll never miss out on important updates or activities from friends and favorite accounts.</span>
        <br />
        <span className='informationAccountSettingsUScss'>With real-time alerts, you can stay connected and participate in trending
          <br /> discussions and events as they happen.</span>
        <br />
        <span className='informationAccountSettingsUScss2'>Consequences and the things that will happen when you cancel the notifications</span>
        <br />
        <span className='informationAccountSettingsUScss'>When you turn off the notifications, you will not receive notifications</span>
        <br />
        <span className='informationAccountSettingsUScss'>from the application, nor notifications from the people you follow or the</span>
        <br />
        <span className='informationAccountSettingsUScss'>new followers or the new additions. If you want to update specific</span>
        <br />
        <span className='informationAccountSettingsUScss'>things, you can go to the "Filters" page and do the following things there.</span>
        <br />
        <Button
        className="custom-button2hyeh custom-button accent-tab hover-card block w-full"
        style={{ borderRadius: '0' }} // Setting border-radius to zero
        onClick={() => handleNotificationToggle(true)} 
            >
              {notificationsEnabled === true ? 'Yes' : 'Enable Notifications'}
            </Button>
        <Button
        className="custom-button2hyeh custom-button accent-tab hover-card block w-full"
        style={{ borderRadius: '0' }} // Setting border-radius to zero
        onClick={() => handleNotificationToggle(false)} 
            >
                 {notificationsEnabled === false ? 'No' : 'Disable Notifications'}
            </Button>
      </ul>
    </div>
      </div>
    </div>
  </MainContainer>
  );
};

export default Preferences;

// Layout wrapper
Preferences.getLayout = function getLayout(page: ReactElement): ReactNode {
  return (
    <ProtectedLayout>
      <MainLayout>{page}</MainLayout>
    </ProtectedLayout>
  );
};
