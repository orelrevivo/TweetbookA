import { MainHeader } from '@components/home/main-header';
import { useState } from 'react';
import { MainLayout } from '@components/layout/main-layout';
import { ProtectedLayout } from '@components/layout/common-layout-Settings';
import { useRouter } from 'next/router';
import { useAuth } from '@lib/context/auth-context';
import { MainContainer } from '@components/home/main-container-me22';
import { HeroIcon } from '@components/ui/hero-icon';

const notifications = () => {
  const router = useRouter();
  const { user } = useAuth(); // Get the current authenticated user

  // Function to handle button navigation
  const handleNavigation = (page: string) => {
    router.push(page);
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
        </div>

        {/* User Details */}
        <div className="w-3/4">
          <MainHeader>
            <h1 className='YourAccount'>Connected accounts</h1>
            <span className='spanYourAccount'>
              These are the social accounts you connected to your Tweetbook account to log in. You can disable access here.
            </span>
          </MainHeader>
          <div className='SettingsUScss'>
            <ul className='dsrgdgsedsgsgegd list-none'>
              {/* Safely check if the user exists before displaying the email */}
              {user?.email ? (
                <li className='email-item'>
                  <span className='font-bold'>Email:</span> {user.email}
                </li>
              ) : (
                <li>No email connected</li>
              )}
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
