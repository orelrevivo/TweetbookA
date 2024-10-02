import { MainHeader } from '@components/home/main-header';
import { ReactElement, ReactNode, useState, useEffect } from 'react';
import { MainLayout } from '@components/layout/main-layout-Settings';
import { ProtectedLayout } from '@components/layout/common-layout-Settings';

const Subscriptions = () => {
  const [showCardForm, setShowCardForm] = useState(false);
  const [premiumStatus, setPremiumStatus] = useState(false);
  const [showMoreInfo, setShowMoreInfo] = useState(false); // State for toggling "show more/less"

  // Load premium status from localStorage when the component mounts
  useEffect(() => {
    const isPremium = localStorage.getItem('premiumStatus') === 'true';
    setPremiumStatus(isPremium);
  }, []);

  // Handle button click to show the card input form
  const handleButtonClick = () => {
    setShowCardForm(true);
  };

  // Simulate the payment and update premium status
  const handleCardSubmission = () => {
    // Simulating payment success
    localStorage.setItem('premiumStatus', 'true');
    setPremiumStatus(true);
    setShowCardForm(false); // Hide the form after payment
  };

  // Handle subscription cancellation
  const handleCancelSubscription = () => {
    localStorage.removeItem('premiumStatus');
    setPremiumStatus(false);
  };

  // Toggle show more/less information
  const toggleMoreInfo = () => {
    setShowMoreInfo(!showMoreInfo);
  };

  return (
    <div className="SettingsUScss notificationSettingsBoxSettingsUScss">
      <MainHeader title="Creator Subscriptions" />
      <ul className="list-none">
        <button
          className="ViewandmanageSubscriptions22button bg-main-search-background px-4 py-2 transition bg-main-sidebar-background focus-within:ring-2 focus-within:ring-main-accent"
          onClick={handleButtonClick}
        >
          <h1 className="ViewandmanageSubscriptions22">Manage Creator Subscriptions</h1>
          <span className="ViewandmanageSubscriptions2">
            View and manage your subscriptions to creators below.
          </span>
          <br />
          <span className="ViewandmanageSubscriptions">
            Any active subscriptions you initiated can be managed here.
          </span>
        </button>
      </ul>

      {/* Show payment form if the user hasn't purchased premium yet */}
      {showCardForm && !premiumStatus && (
        <div className="ViewandmanageSubscriptions22button2 bg-main-search-background px-4 py-2 transition bg-main-sidebar-background">
          <h2>Enter Card Details</h2>
          <span>
            {showMoreInfo ? (
              <>
                          Premium
            <br />
            $0
            <br />
            / month
            <br />
            $0 billed annually
            <br />
                Everything in Basic, and
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
            className='input123 inputclassNamepassword group flex items-center justify-between gap-4 rounded-[10px]
                             bg-main-search-background px-4 py-2 transition bg-main-sidebar-background
                             focus-within:ring-2 focus-within:ring-main-accent'
            style={{ width: '95%', height: '50px' , transform: 'translateX(13px)' }}
          >
            <input
              type="text"
              placeholder="Enter Card Number"
              className="peer flex-1 bg-transparent outline-none 
                 placeholder:text-light-secondary dark:placeholder:text-dark-secondary"
            />
          </label>
          <button
            className="PremiumBuy text-white px-4 py-2 mt-2"
            onClick={handleCardSubmission}
          >
            Buy Premium
          </button>
        </div>
      )}

      {/* Show premium status if the user already bought it */}
      {premiumStatus && (
        <div className="ViewandmanageSubscriptions22button2 bg-main-search-background px-4 py-2 transition bg-main-sidebar-background">
          <h2>You have purchased Premium!</h2>
          <span>
            {showMoreInfo ? (
              <>
                          Premium
            <br />
            $0
            <br />
            / month
            <br />
            $0 billed annually
            <br />
                Everything in Basic, and
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
    </div>
  );
};

export default Subscriptions;

// Layout wrapper
Subscriptions.getLayout = function getLayout(page: ReactElement): ReactNode {
  return (
    <ProtectedLayout>
      <MainLayout>{page}</MainLayout>
    </ProtectedLayout>
  );
};
