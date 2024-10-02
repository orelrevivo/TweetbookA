import { useState, useEffect, ReactElement, ReactNode } from 'react';
import { MainHeader } from '@components/home/main-header';
import { ProtectedLayout } from '@components/layout/common-layout-Settings';
import { updateNotificationFilter, getNotificationSettings, updateNotificationSettings } from '@lib/firebase/notifications'; // Adjust path if necessary
import { MainLayout } from '@components/layout/main-layout';
import { useRouter } from 'next/router';
import { collection, query, where, getDocs, addDoc, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase/app';
import { Button } from '@components/ui/button';
import { StatsEmpty } from '@components/Post/stats-empty';
import { useAuth } from '@lib/context/auth-context';
import { MainContainer } from '@components/home/main-container-me22'; 
import { HeroIcon } from '@components/ui/hero-icon';
import { UserCard } from '@components/user/user-card2';
const Filters = () => {
  const [filterActive, setFilterActive] = useState(false);
  const [muteNotifications, setMuteNotifications] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    followAlert: true,
    joinAlert: true
  });
  const router = useRouter();

  // Function to handle button navigation
  const handleNavigation = (page: string) => {
    router.push(page);
  };
  useEffect(() => {
    const fetchFilterStatus = async () => {
      try {
        const userId = 'user-id'; // Replace with actual user ID
        const settings = await getNotificationSettings(userId);
        setFilterActive(settings.filterActive || false);
        setMuteNotifications(settings.muteNotifications || false);
        setNotificationSettings({
          followAlert: settings.followAlert || true,
          joinAlert: settings.joinAlert || true
        });
      } catch (error) {
        console.error('Error fetching filter status:', error);
      }
    };

    fetchFilterStatus();
  }, []);

  const handleFilterToggle = async () => {
    try {
      const userId = 'user-id'; // Replace with actual user ID
      await updateNotificationFilter(userId, !filterActive);
      setFilterActive(prevState => !prevState);
      alert(`Notifications filter is now ${filterActive ? 'inactive' : 'active'}`);
    } catch (error) {
      console.error('Error updating notification filter:', error);
    }
  };

  const handleMuteToggle = async () => {
    try {
      const userId = 'user-id'; // Replace with actual user ID
      const newMuteStatus = !muteNotifications;
      await updateNotificationSettings(userId, { muteNotifications: newMuteStatus });
      setMuteNotifications(newMuteStatus);
      alert(`Mute notifications is now ${newMuteStatus ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error updating mute notifications status:', error);
    }
  };

  const handleAlertToggle = async (type: 'follow' | 'join') => {
    const newSettings = { ...notificationSettings, [`${type}Alert`]: !notificationSettings[`${type}Alert`] };
    try {
      const userId = 'user-id'; // Replace with actual user ID
      await updateNotificationSettings(userId, newSettings);
      setNotificationSettings(newSettings);
      alert(`${type.charAt(0).toUpperCase() + type.slice(1)} notifications are now ${newSettings[`${type}Alert`] ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error(`Error updating ${type} notification settings:`, error);
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
            <h1 className='YourAccount'>Filters</h1>
            <span className='spanYourAccount'>Choose the notifications you’d like to see — and those you don’t.</span>
      </MainHeader>
      <div className='SettingsUScss '>
      <ul className='list-none'>
       <div className='BoxQualityfilter22'>
       <MainHeader title="Quality filter" />
       {/* <Button
          className="custom-button2hyeh custom-button accent-tab hover-card block w-full"
          style={{ borderRadius: '0' }} // Setting border-radius to zero
          onClick={handleFilterToggle}
              >
                {filterActive ? 'Filter is Active' : 'Filter is Inactive'}
              </Button> */}
        <div className='filterStatusBox'>
          <span className='filterStatus'>{filterActive ? 'Notifications filter is currently ON' : 'Notifications filter is currently OFF'}</span>
        </div>
       </div>
        <MainHeader title="Notifications Settings" />
        <Button
          className="custom-button2hyeh custom-button accent-tab hover-card block w-full"
          style={{ borderRadius: '0' }} // Setting border-radius to zero
          onClick={handleMuteToggle}
              >
                {muteNotifications ? 'Unmute Notifications (All)' : 'Mute Notifications (All)'}
              </Button>

          <div className='notificationSettingsBox'>
            <div className='notificationSetting'>
              <Button
          className="custom-button2hyeh custom-button accent-tab hover-card block w-full"
          style={{ borderRadius: '0' }} // Setting border-radius to zero
          onClick={() => handleAlertToggle('follow')}
              >
               <span className='notificationSettings'>{notificationSettings.followAlert ? 'Do Not Alert on Follows' : 'Alert on Follows'}</span>
              </Button>
            </div>
            <div className='notificationSetting'>
              <Button
          className="custom-button2hyeh custom-button accent-tab hover-card block w-full"
          style={{ borderRadius: '0' }} // Setting border-radius to zero
          onClick={() => handleAlertToggle('join')} 
              >
             <span className='notificationSettings2'>{notificationSettings.joinAlert ? 'Do Not Alert on Joins' : 'Alert on Joins'}</span>
              </Button>
            </div>
          </div>
      </ul>
    </div>
        </div>
      </div>
    </MainContainer>
  );
};

export default Filters;

// Layout wrapper
Filters.getLayout = function getLayout(page: ReactElement): ReactNode {
  return (
    <ProtectedLayout>
      <MainLayout>{page}</MainLayout>
    </ProtectedLayout>
  );
};
