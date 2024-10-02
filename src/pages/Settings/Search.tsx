import { MainHeader } from '@components/home/main-header';
import { useState, ReactElement, ReactNode } from 'react';
import { MainLayout } from '@components/layout/main-layout';
import { ProtectedLayout } from '@components/layout/common-layout-Settings';
import { useRouter } from 'next/router';
import { Button } from '@components/ui/button';
import { MainContainer } from '@components/home/main-container-me22';
import { HeroIcon } from '@components/ui/hero-icon';

const Settings = () => {
  const router = useRouter();

  // Function to handle button navigation
  const handleNavigation = (page: string) => {
    router.push(page);
  };

  const [searchInput, setSearchInput] = useState('');
  
  // Buttons data for filtering
  const buttonsData = [
    { label: 'Your account', page: '/Settings/Youraccount', svgClass: 'svgclassName' },
    { label: 'Monetization', page: '/Settings/Monetization', svgClass: 'svgclassName2' },
    { label: 'Premium', page: '/premium', svgClass: 'svgclassName3' },
    { label: 'Security and account access', page: '/Settings/security_and_account_access', svgClass: 'svgclassName4' },
    { label: 'Notifications', page: '/Settings/notifications', svgClass: 'svgclassName5' },
    { label: 'Accessibility, display, and languages', page: '/Settings/accessibility_display_and_languages', svgClass: 'svgclassName6' },
    { label: 'Help Center', page: '/HelpCenter', svgClass: 'svgclassName7' },
    { label: 'Display', page: '/Settings/display', svgClass: 'svgclassName7' },
    { label: 'Languages', page: '/Settings/languages', svgClass: 'svgclassName7' },
    { label: 'Filters', page: '/Settings/Filters', svgClass: 'svgclassName7' },
    { label: 'Preferences', page: '/Settings/Preferences', svgClass: 'svgclassName7' },
    { label: 'Deactivate', page: '/Settings/Deactivate', svgClass: 'svgclassName5' },
    { label: 'Change password', page: '/Settings/passwordChange', svgClass: 'svgclassName5' },
    { label: 'Ads Subscriptions', page: '/Settings/AdsSubscriptionsY', svgClass: 'svgclassName5' },
    { label: 'Notifications', page: '/Settings/notifications', svgClass: 'svgclassName5' },
  ];

  // Filtered buttons based on search input
  const filteredButtons = buttonsData.filter(button =>
    button.label.toLowerCase().includes(searchInput.toLowerCase())
  );

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
              placeholder="Search Settings"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </label>

          {/* Navigation buttons */}
          <ul className="ButtonProfileSettings mt-4 space-y-2">
            {filteredButtons.length > 0 ? (
              filteredButtons.map((button, index) => (
                <li key={index}>
                  <Button
                    className="custom-button2hyeh custom-button accent-tab hover-card block w-full"
                    style={{ borderRadius: '0' }} // Setting border-radius to zero
                    onClick={() => handleNavigation(button.page)}
                  >
                    <span className='ProfileTEct'>{button.label}</span>
                  </Button>
                </li>
              ))
            ) : (
              <li className="text-center text-gray-500 mt-4">
                Try searching for notifications, privacy, etc.
              </li>
            )}
          </ul>
        </div>

        {/* User Details */}
        <div className="w-2/3 p-4"></div>
      </div>
    </MainContainer>
  );
};

// Make sure to properly export Settings as default
export default Settings;

// Layout wrapper
Settings.getLayout = function getLayout(page: ReactElement): ReactNode {
  return (
    <ProtectedLayout>
      <MainLayout>{page}</MainLayout>
    </ProtectedLayout>
  );
};
