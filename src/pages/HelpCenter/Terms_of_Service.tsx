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
        <div className="page-container">
      <h1 className='Anything2Dive'>Join the Conversation</h1>
      <div className='boxV2Anything'>
        <span className='dsgseswiudhgiusge'>
        Summary of our terms Terms of Service: These govern the use of tweetbook, forming a legal contract. Advertising: tweetbook and partners may display ads as part of accessing services. Content Usage: Users must comply with the User Agreement and applicable laws. Acceptable Use: Services must be accessed via provided interfaces; scraping is prohibited. Enforcement: tweetbook can enforce terms by removing content, limiting access, or legal action. Intellectual Property: Users retain ownership of content but grant broad rights; use of tweetbook software is licensed. Risk Disclaimer: Services are provided "AS IS"; tweetbook disclaims warranties and liabilities. Remedies: Users can terminate their agreement; tweetbook limits liability for damages. Privacy Policy: Terms include a Privacy Policy and other applicable terms. Age Requirement: Users must be at least 13 years old to use tweetbook. Liability Limitation: tweetbook's liability is capped at $100 USD or recent service fees. Copyright Protection: Procedures for reporting copyright infringement are outlined in the terms.
        </span>
        <br />
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