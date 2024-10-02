import { doc, query, where } from 'firebase/firestore';
import { AnimatePresence } from 'framer-motion';
import { useUser } from '@lib/context/user-context';
import { useCollection } from '@lib/hooks/useCollection';
import { useDocument } from '@lib/hooks/useDocument';
import { tweetsCollection } from '@lib/firebase/collections';
import { mergeData } from '@lib/merge';
import { UserLayout, ProtectedLayout } from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import { UserDataLayout } from '@components/layout/user-data-layout';
import { UserHomeLayout } from '@components/layout/user-home-layout';
import { StatsEmpty } from '@components/Post/stats-empty';
import { Loading } from '@components/ui/loading';
import { Tweet } from '@components/Post/tweet';
import { ReactElement, ReactNode, useState, useEffect } from 'react';
import { MainHeader } from '@components/home/main-header';

const Highlight = () => {
  const [showCardForm, setShowCardForm] = useState(false);
  const [premiumStatus, setPremiumStatus] = useState(false);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isPremium = localStorage.getItem('premiumStatus') === 'true';
    setPremiumStatus(isPremium);
    setLoading(false); // Assume data fetching is done after setting premium status
  }, []);

  const handleButtonClick = () => {
    setShowCardForm(true);
  };

  const handleCardSubmission = () => {
    localStorage.setItem('premiumStatus', 'true');
    setPremiumStatus(true);
    setShowCardForm(false);
  };

  const handleCancelSubscription = () => {
    localStorage.removeItem('premiumStatus');
    setPremiumStatus(false);
  };

  const toggleMoreInfo = () => {
    setShowMoreInfo(!showMoreInfo);
  };

  return (
    <div>
      <div className="SettingsUScss14151 notificationSettingsBoxSettingsUScss2">
      <MainHeader title="Highlight on your profile" className='Highlight' />
      
      {loading ? (
        <Loading className='mt-5' />
      ) : !premiumStatus ? (
        // Display this when the user is not subscribed to Premium
        <ul className="list-none">
          <span className="ViewandmanageSubscriptions">
            You must be subscribed to Premium to highlight posts
          </span>
          <br />
          <span className="ViewandmanageSubscriptions">
            on your profile.
          </span>
          <br />
          <br />
          <button
            className="glow-on-hover2 self-start border bg-light-primary px-4 py-1.5 font-bold text-white hover:bg-light-primary/90 focus-visible:bg-light-primary/90 active:bg-light-border/75 dark:bg-light-border dark:text-light-primary dark:hover:bg-light-border/90 dark:focus-visible:bg-light-border/90 dark:active:bg-light-border/75"
            onClick={handleButtonClick}
          >
            Subscribe to Premium
          </button>
        </ul>
      ) : (
        // Display this when the user is subscribed to Premium
        <div className="ViewandmanageSubscriptions22button2 bg-main-search-background px-4 py-2 transition bg-main-sidebar-background">
          <h2>You have purchased Premium!</h2>
          <span>
            {showMoreInfo ? (
              <>
                Premium
                <br />
                $0 / month
                <br />
                $0 billed annually
                <br />
                Everything in Basic
                <br />
                Half Ads in For You and Following
                <br />
                Larger response boost
                <br />
                Get paid to post
                <br />
                Checkmark
                <br />
                Tweetbook AI Assistant
                <br />
                Tweetbook Pro, Analytics, Media Studio
                <br />
                Creator Subscriptions
                <br />
              </>
            ) : (
              "Show more information"
            )}
          </span>
          <button className="text-blue-500 underline mt-2" onClick={toggleMoreInfo}>
            {showMoreInfo ? "Show less information" : "Show more information"}
          </button>
          <button
            className="PremiumBuy2 bg-red-500 text-white px-4 py-2 mt-2"
            onClick={handleCancelSubscription}
          >
            Cancel Premium Subscription
          </button>
        </div>
      )}

      {showCardForm && !premiumStatus && (
        <div className="ViewandmanageSubscriptions22button2 bg-main-search-background px-4 py-2 transition bg-main-sidebar-background">
          <h2>Enter Card Details</h2>
          <span>
            {showMoreInfo ? (
              <>
                Premium
                <br />
                $0 / month
                <br />
                $0 billed annually
                <br />
                Everything in Basic
                <br />
                Half Ads in For You and Following
                <br />
                Larger response boost
                <br />
                Get paid to post
                <br />
                Checkmark
                <br />
                Tweetbook AI Assistant
                <br />
                Tweetbook Pro, Analytics, Media Studio
                <br />
                Creator Subscriptions
                <br />
              </>
            ) : (
              "Show more information"
            )}
          </span>
          <button className="text-blue-500 underline mt-2" onClick={toggleMoreInfo}>
            {showMoreInfo ? "Show less information" : "Show more information"}
          </button>
          <label
            className="input123 inputclassNamepassword group flex items-center justify-between gap-4 rounded-[10px] bg-main-search-background px-4 py-2 transition bg-main-sidebar-background focus-within:ring-2 focus-within:ring-main-accent"
            style={{ width: '95%', height: '50px', transform: 'translateX(13px)' }}
          >
            <input
              type="text"
              placeholder="Enter Card Number"
              className="peer flex-1 bg-transparent outline-none placeholder:text-light-secondary dark:placeholder:text-dark-secondary"
            />
          </label>
          <button className="PremiumBuy text-white px-4 py-2 mt-2" onClick={handleCardSubmission}>
            Buy Premium
          </button>
        </div>
      )}
    </div>
    <hr />
    </div>
  );
};

// Export the Highlight component as default
export default Highlight;

Highlight.getLayout = (page: ReactElement): ReactNode => (
  <ProtectedLayout>
    <MainLayout>
      <UserLayout>
        <UserDataLayout>
          <UserHomeLayout>{page}</UserHomeLayout>
        </UserDataLayout>
      </UserLayout>
    </MainLayout>
  </ProtectedLayout>
);
