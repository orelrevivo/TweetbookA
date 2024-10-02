import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Loading } from '@components/ui/loading'; // Import the Loading component

const SubscriptionPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium' | 'premiumPlus' | null>(null);
  const [billingCycle, setBillingCycle] = useState<'annual' | 'monthly'>('annual');
  const [loading, setLoading] = useState(false); // State to manage loading

  const planPrices = {
    basic: billingCycle === 'monthly' ? 9.52 : 9.52 * 12,
    premium: billingCycle === 'monthly' ? 25 : 25 * 12,
    premiumPlus: billingCycle === 'monthly' ? 50 : 50 * 12,
  };

  const handlePlanSelect = (plan: 'basic' | 'premium' | 'premiumPlus') => {
    setSelectedPlan(plan);
    setLoading(true); // Set loading to true when a plan is selected
    // Simulate a charge delay
    setTimeout(() => {
      setLoading(false); // Reset loading after 1 second
    }, 1000);
  };

  const handleBillingCycleChange = (cycle: 'annual' | 'monthly') => {
    setBillingCycle(cycle);
  };

  const router = useRouter();

  // Function to handle button navigation
  const handleNavigation = (page: string) => {
    router.push(page);
  };

  return (
    <div className="subscription-page">
      <button className='XButton123'  onClick={() => window.history.back()}>
        <svg
          className='XButton1232'
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
            <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
          </g>
        </svg>
      </button>

      <div>
        <h1 className='UpgradePremium'>Upgrade to Premium</h1>
        <p>Enjoy an enhanced experience, exclusive creator tools, top-tier verification and security.</p>
      </div>

      <div className='billingcycleUpgradePremium'>
        <div className="billing-cycle">
          <button 
            onClick={() => handleBillingCycleChange('annual')} 
            className={`cycle-button ${billingCycle === 'annual' ? 'active' : ''}`}
          >
            <span className='MonthlyAnnual'>Annual</span>
          </button>
          <button 
            onClick={() => handleBillingCycleChange('monthly')} 
            className={`cycle-button2 ${billingCycle === 'monthly' ? 'active' : ''}`}
          >
            <span className='MonthlyAnnual'>Monthly</span>
          </button>
        </div>

        <div className="plans">
          <div 
            className={`bg-main-search-background plan ${selectedPlan === 'basic' ? 'selected' : ''}`} 
            onClick={() => handlePlanSelect('basic')}
          >
              <button   onClick={() => handlePlanSelect('basic')} 
               className={`bg-main-search-background plan123 ${selectedPlan === 'basic' ? 'selected' : ''}`} 
               ></button>
            <h2 className='ulmonthPremium3'>Basic</h2>
            <p className='ulmonthPremium'>$9.52 / month</p>
            <ul>
              <li>
              <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '-5px',
            width: '24px',
            height: '24px',
            fill: 'rgb(15, 20, 25)',
            marginRight: '10px', // Adds space between icon and text
          }}
        >
          <g>
          <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
          </g>
        </svg>
                Small reply boost</li>
              <li>
              <svg
  viewBox="0 0 24 24"
  aria-hidden="true"
  style={{
    position: 'absolute',
    left: '-5px',
    width: '24px',
    height: '24px',
    fill: 'rgb(15, 20, 25)',
    marginRight: '0', // Remove or set to 0
  }}
>
  <g>
    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
  </g>
</svg>

                Encrypted messages</li>
              <li>
              <svg
  viewBox="0 0 24 24"
  aria-hidden="true"
  style={{
    position: 'absolute',
    left: '-5px',
    width: '24px',
    height: '24px',
    fill: 'rgb(15, 20, 25)',
    marginRight: '0', // Remove or set to 0
  }}
>
  <g>
    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
  </g>
</svg>

                Bookmark folders</li>
              <li>
              <svg
  viewBox="0 0 24 24"
  aria-hidden="true"
  style={{
    position: 'absolute',
    left: '-5px',
    width: '24px',
    height: '24px',
    fill: 'rgb(15, 20, 25)',
    marginRight: '0', // Remove or set to 0
  }}
>
  <g>
    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
  </g>
</svg>

                Highlights tab</li>
              <li>
              <svg
  viewBox="0 0 24 24"
  aria-hidden="true"
  style={{
    position: 'absolute',
    left: '-5px',
    width: '24px',
    height: '24px',
    fill: 'rgb(15, 20, 25)',
    marginRight: '0', // Remove or set to 0
  }}
>
  <g>
    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
  </g>
</svg>

                Edit post</li>
              <li>
              <svg
  viewBox="0 0 24 24"
  aria-hidden="true"
  style={{
    position: 'absolute',
    left: '-5px',
    width: '24px',
    height: '24px',
    fill: 'rgb(15, 20, 25)',
    marginRight: '0', // Remove or set to 0
  }}
>
  <g>
    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
  </g>
</svg>

                Post longer videos</li>
              <li>
              <svg
  viewBox="0 0 24 24"
  aria-hidden="true"
  style={{
    position: 'absolute',
    left: '-5px',
    width: '24px',
    height: '24px',
    fill: 'rgb(15, 20, 25)',
    marginRight: '0', // Remove or set to 0
  }}
>
  <g>
    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
  </g>
</svg>

                Longer posts</li>
            </ul>
          </div>

          <div 
            className={`bg-main-search-background plan ${selectedPlan === 'premium' ? 'selected' : ''}`} 
            onClick={() => handlePlanSelect('premium')}
          >
              <button   onClick={() => handlePlanSelect('basic')} 
               className={`bg-main-search-background plan1234 ${selectedPlan === 'premium' ? 'selected' : ''}`} 
               ></button>
            <h2 className='ulmonthPremium4'>Premium</h2>
            <p className='ulmonthPremium'>$25 / month</p>
            <ul>
              <li>
              <svg
  viewBox="0 0 24 24"
  aria-hidden="true"
  style={{
    position: 'absolute',
    left: '-5px',
    width: '24px',
    height: '24px',
    fill: 'rgb(15, 20, 25)',
    marginRight: '0', // Remove or set to 0
  }}
>
  <g>
    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
  </g>
</svg>

                Everything in Basic</li>
              <li>
              <svg
  viewBox="0 0 24 24"
  aria-hidden="true"
  style={{
    position: 'absolute',
    left: '-5px',
    width: '24px',
    height: '24px',
    fill: 'rgb(15, 20, 25)',
    marginRight: '0', // Remove or set to 0
  }}
>
  <g>
    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
  </g>
</svg>

                Half Ads in For You and Following</li>
              <li>
              <svg
  viewBox="0 0 24 24"
  aria-hidden="true"
  style={{
    position: 'absolute',
    left: '-5px',
    width: '24px',
    height: '24px',
    fill: 'rgb(15, 20, 25)',
    marginRight: '0', // Remove or set to 0
  }}
>
  <g>
    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
  </g>
</svg>

                Larger reply boost</li>
              <li>
              <svg
  viewBox="0 0 24 24"
  aria-hidden="true"
  style={{
    position: 'absolute',
    left: '-5px',
    width: '24px',
    height: '24px',
    fill: 'rgb(15, 20, 25)',
    marginRight: '0', // Remove or set to 0
  }}
>
  <g>
    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
  </g>
</svg>

                Get paid to post</li>
              <li>
              <svg
  viewBox="0 0 24 24"
  aria-hidden="true"
  style={{
    position: 'absolute',
    left: '-5px',
    width: '24px',
    height: '24px',
    fill: 'rgb(15, 20, 25)',
    marginRight: '0', // Remove or set to 0
  }}
>
  <g>
    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
  </g>
</svg>

                Checkmark</li>
              <li>
              <svg
  viewBox="0 0 24 24"
  aria-hidden="true"
  style={{
    position: 'absolute',
    left: '-5px',
    width: '24px',
    height: '24px',
    fill: 'rgb(15, 20, 25)',
    marginRight: '0', // Remove or set to 0
  }}
>
  <g>
    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
  </g>
</svg>

                TweetBot 2 AI Assistant</li>
              <li>
              <svg
  viewBox="0 0 24 24"
  aria-hidden="true"
  style={{
    position: 'absolute',
    left: '-5px',
    width: '24px',
    height: '24px',
    fill: 'rgb(15, 20, 25)',
    marginRight: '0', // Remove or set to 0
  }}
>
  <g>
    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
  </g>
</svg>

                Tweetbook Pro, Analytics, Media Studio</li>
              <li>
              <svg
  viewBox="0 0 24 24"
  aria-hidden="true"
  style={{
    position: 'absolute',
    left: '-5px',
    width: '24px',
    height: '24px',
    fill: 'rgb(15, 20, 25)',
    marginRight: '0', // Remove or set to 0
  }}
>
  <g>
    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
  </g>
</svg>

                Creator Subscriptions</li>
            </ul>
          </div>

          <div 
            className={`bg-main-search-background plan  ${selectedPlan === 'premiumPlus' ? 'selected' : ''}`} 
            onClick={() => handlePlanSelect('premiumPlus')}
          >
          <button   onClick={() => handlePlanSelect('basic')} 
               className={`bg-main-search-background plan12345 ${selectedPlan === 'premiumPlus' ? 'selected' : ''}`} 
               ></button>
            <h2 className='ulmonthPremium2'>Premium+</h2>
            <p className='ulmonthPremium'>$50 / month</p>
            <ul>
              <li>
              <svg
  viewBox="0 0 24 24"
  aria-hidden="true"
  style={{
    position: 'absolute',
    left: '-5px',
    width: '24px',
    height: '24px',
    fill: 'rgb(15, 20, 25)',
    marginRight: '0', // Remove or set to 0
  }}
>
  <g>
    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
  </g>
</svg>

                Everything in Premium</li>
              <li>
              <svg
  viewBox="0 0 24 24"
  aria-hidden="true"
  style={{
    position: 'absolute',
    left: '-5px',
    width: '24px',
    height: '24px',
    fill: 'rgb(15, 20, 25)',
    marginRight: '0', // Remove or set to 0
  }}
>
  <g>
    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
  </g>
</svg>

                Fully ad-free</li>
              <li>
              <svg
  viewBox="0 0 24 24"
  aria-hidden="true"
  style={{
    position: 'absolute',
    left: '-5px',
    width: '24px',
    height: '24px',
    fill: 'rgb(15, 20, 25)',
    marginRight: '0', // Remove or set to 0
  }}
>
  <g>
    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
  </g>
</svg>

                Largest reply boost</li>
              <li>
              <svg
  viewBox="0 0 24 24"
  aria-hidden="true"
  style={{
    position: 'absolute',
    left: '-5px',
    width: '24px',
    height: '24px',
    fill: 'rgb(15, 20, 25)',
    marginRight: '0', // Remove or set to 0
  }}
>
  <g>
    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
  </g>
</svg>

                Write Articles</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-light-border dark:border-dark-border border-1 xs:border bg-main-background fixed-top-bar333">
        {loading ? (
          <Loading className='LoadingclassName flex h-52 items-center justify-center p-4' />
        ) : (
          <>
            <div className="selected-details">
              <h3 className='Billedbutton13131'>{selectedPlan ? selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1) : 'No plan selected'}</h3>
              <p className='Billedbutton131312'>Billed {billingCycle}</p>
              {selectedPlan && (
                <p className='BilledPrice Billedbutton1313122'>
                  Price: ${planPrices[selectedPlan].toFixed(2)} {billingCycle === 'monthly' ? '/ month' : '/ year'}
                </p>
              )}
              <span className='Billedbutton13131222' onClick={() => handleNavigation('/Settings/Monetization')} >Settings Monetization</span>
            </div>
            <button onClick={() => handleNavigation('/i/premium_sign_up')} className="subscribe-button13131 bg-main-accent">
              <span className='SubscribePay'>Subscribe & Pay</span>
            </button>
            <span className='spanYourAccount2spanYourAccount2 border-light-border dark:border-dark-border border-1 xs:border hidden md:block'>
            By subscribing, you agree to our Purchaser Terms of Service. Subscriptions auto-
            <br />
            renew until canceled, as described in the Terms. Cancel anytime. Cancel at least 24
            <br />
            hours prior to renewal to avoid additional charges. A verified phone number is
            <br />
            required to subscribe. If you've subscribed on another platform, manage your
            <br />
            subscription through that platform.
           </span>

          </>
        )}
      </div>

      <img className='premium_Plus_immg' src="premiums.png" alt="premium" />
      <style jsx>{`
        .subscription-page {
          background: radial-gradient(56.1514% 56.1514% at 49.972% 38.959%, rgba(52, 147, 239, 0.3) 0%, rgb(255, 255, 255) 100%);
          min-height: 100vh;
          padding: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* Header */
        .header h1 {
          font-size: 32px;
          color: white;
          text-align: center;
          margin-bottom: 10px;
        }

        .header p {
          font-size: 18px;
          color: white;
          text-align: center;
          margin-bottom: 20px;
        }

        /* Grid layout for plan cards */
        .plans {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          width: 100%;
          max-width: 800px;
        }

        .plan {
          background-color: none;
          padding: 20px;
          width: 300px;
          height: 404px;
          border-radius: 10px;
          text-align: center;
          cursor: pointer;
          border: 2px solid #eff3f4;
        }

        .plan.selected {
          border-color: #007bff;
          border: 2px solid #1d9bf0;
        }

        .plan h2 {
          font-size: 20px;
          margin-bottom: 10px;
        }

        .plan p {
          font-size: 16px;
          margin-bottom: 15px;
        }

       .plan ul {
  list-style: none; /* Removes default bullets */
  padding-left: 0; /* No padding */
}

.plan ul li {
  position: relative;
  padding-left: 40px; /* Adds space for the custom bullet */
  margin-bottom: 10px;
  font-size: 13px;
}


.plan ul li {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  text-indent: -20px; /* Brings the text in line with bullets */
  line-height: 1.5; /* Spacing between lines */
  word-break: break-word; /* Ensures long words break correctly */
}

        /* Adjust list for alignment */
        ul {
          padding-left: 0;
          list-style-position: inside;
        }

        li {
          padding-left: 20px;
          text-indent: -20px;
          line-height: 1.8;
        }

        .selected-details {
          margin-top: 20px;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .plans {
            grid-template-columns: 1fr;
          }
        }

        .subscribe-button:hover {
          background-color: #1d9bf0;
        }
      `}</style>
    </div>
  );
};

export default SubscriptionPage;






// import React, { useState } from 'react';
// import { useRouter } from 'next/router';
// import { Loading } from '@components/ui/loading'; // Import the Loading component
// import {  } from '@lib/firebase/premium';

// const SubscriptionPage = () => {
//   const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium' | 'premiumPlus' | null>(null);
//   const [billingCycle, setBillingCycle] = useState<'annual' | 'monthly'>('annual');
//   const [loading, setLoading] = useState(false); // State to manage loading

//   const planPrices = {
//     basic: billingCycle === 'monthly' ? 9.52 : 9.52 * 12,
//     premium: billingCycle === 'monthly' ? 25 : 25 * 12,
//     premiumPlus: billingCycle === 'monthly' ? 50 : 50 * 12,
//   };

//   const handlePlanSelect = (plan: 'basic' | 'premium' | 'premiumPlus') => {
//     setSelectedPlan(plan);
//     setLoading(true); // Set loading to true when a plan is selected
//     // Simulate a charge delay
//     setTimeout(() => {
//       setLoading(false); // Reset loading after 1 second
//     }, 1000);
//   };

//   const handleBillingCycleChange = (cycle: 'annual' | 'monthly') => {
//     setBillingCycle(cycle);
//   };

//   const router = useRouter();

//   // Function to handle button navigation
//   const handleNavigation = (page: string) => {
//     router.push(page);
//   };

//   return (
//     <div className="subscription-page">
//       <button className='XButton123' onClick={() => handleNavigation('/home')} >
//         <svg
//           className='XButton1232'
//           viewBox="0 0 24 24"
//           aria-hidden="true"
//           style={{
//             width: '24px',
//             height: '24px',
//             fill: 'rgb(15, 20, 25)',
//             marginRight: '10px', // Adds space between icon and text
//           }}
//         >
//           <g>
//             <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
//           </g>
//         </svg>
//       </button>

//       <div>
//         <h1 className='UpgradePremium'>Upgrade to Premium</h1>
//         <p>Enjoy an enhanced experience, exclusive creator tools, top-tier verification and security.</p>
//       </div>

//       <div className='billingcycleUpgradePremium'>
//         <div className="billing-cycle">
//           <button 
//             onClick={() => handleBillingCycleChange('annual')} 
//             className={`cycle-button ${billingCycle === 'annual' ? 'active' : ''}`}
//           >
//             <span className='MonthlyAnnual'>Annual</span>
//           </button>
//           <button 
//             onClick={() => handleBillingCycleChange('monthly')} 
//             className={`cycle-button2 ${billingCycle === 'monthly' ? 'active' : ''}`}
//           >
//             <span className='MonthlyAnnual'>Monthly</span>
//           </button>
//         </div>

//         <div className="plans">
//           <div 
//             className={`bg-main-search-background plan ${selectedPlan === 'basic' ? 'selected' : ''}`} 
//             onClick={() => handlePlanSelect('basic')}
//           >
//             <h2 className='ulmonthPremium3'>Basic</h2>
//             <p className='ulmonthPremium'>$9.52 / month</p>
//             <ul>
//               <li>
//                 Small reply boost</li>
//               <li>Encrypted messages</li>
//               <li>Bookmark folders</li>
//               <li>Highlights tab</li>
//               <li>Edit post</li>
//               <li>Post longer videos</li>
//               <li>Longer posts</li>
//             </ul>
//           </div>

//           <div 
//             className={`bg-main-search-background plan ${selectedPlan === 'premium' ? 'selected' : ''}`} 
//             onClick={() => handlePlanSelect('premium')}
//           >
//             <h2 className='ulmonthPremium4'>Premium</h2>
//             <p className='ulmonthPremium'>$25 / month</p>
//             <ul>
//               <li>Everything in Basic</li>
//               <li>Half Ads in For You and Following</li>
//               <li>Larger reply boost</li>
//               <li>Get paid to post</li>
//               <li>Checkmark</li>
//               <li>TweetBot 2 AI Assistant</li>
//               <li>Tweetbook Pro, Analytics, Media Studio</li>
//               <li>Creator Subscriptions</li>
//             </ul>
//           </div>

//           <div 
//             className={`bg-main-search-background plan ${selectedPlan === 'premiumPlus' ? 'selected' : ''}`} 
//             onClick={() => handlePlanSelect('premiumPlus')}
//           >
//             <h2 className='ulmonthPremium2'>Premium+</h2>
//             <p className='ulmonthPremium'>$50 / month</p>
//             <ul>
//               <li>Everything in Premium</li>
//               <li>Fully ad-free</li>
//               <li>Largest reply boost</li>
//               <li>Write Articles</li>
//             </ul>
//           </div>
//         </div>
//       </div>

//       <div className="bg-main-background fixed-top-bar333">
//         {loading ? (
//           <Loading className='LoadingclassName flex h-52 items-center justify-center p-4' />
//         ) : (
//           <>
//             <div className="selected-details">
//               <h3 className='Billedbutton13131'>{selectedPlan ? selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1) : 'No plan selected'}</h3>
//               <p className='Billedbutton131312'>Billed {billingCycle}</p>
//               {selectedPlan && (
//                 <p className='BilledPrice Billedbutton1313122'>
//                   Price: ${planPrices[selectedPlan].toFixed(2)} {billingCycle === 'monthly' ? '/ month' : '/ year'}
//                 </p>
//               )}
//               <span className='Billedbutton13131222' onClick={() => handleNavigation('/Settings/Monetization')} >Settings Monetization</span>
//             </div>
//             <button onClick={() => handleNavigation('/i/premium_sign_up')} className="subscribe-button13131">
//               <span className='SubscribePay'>Subscribe & Pay</span>
//             </button>
//             <span className='spanYourAccount2spanYourAccount2 border-light-border dark:border-dark-border border-1 xs:border'>
//               By subscribing, you agree to our Purchaser Terms of Service. Subscriptions auto-
//               <br />
//               renew until canceled, as described in the Terms. Cancel anytime. Cancel at least 24 
//               <br />
//               hours prior to renewal to avoid additional charges. A verified phone number is 
//               <br />
//               required to subscribe. If you've subscribed on another platform, manage your 
//               <br />
//               subscription through that platform.
//             </span>
//           </>
//         )}
//       </div>

//       <img className='premium_Plus_immg' src="premiums.png" alt="premium" />
//       <style jsx>{`
//         .subscription-page {
//           background: radial-gradient(56.1514% 56.1514% at 49.972% 38.959%, rgba(52, 147, 239, 0.3) 0%, rgb(255, 255, 255) 100%);
//           min-height: 100vh;
//           padding: 40px;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//         }

//         /* Header */
//         .header h1 {
//           font-size: 32px;
//           color: white;
//           text-align: center;
//           margin-bottom: 10px;
//         }

//         .header p {
//           font-size: 18px;
//           color: white;
//           text-align: center;
//           margin-bottom: 20px;
//         }

//         /* Grid layout for plan cards */
//         .plans {
//           display: grid;
//           grid-template-columns: repeat(3, 1fr);
//           gap: 20px;
//           width: 100%;
//           max-width: 800px;
//         }

//         .plan {
//           background-color: none;
//           padding: 20px;
//           width: 300px;
//           height: 404px;
//           border-radius: 10px;
//           text-align: center;
//           cursor: pointer;
//           border: 2px solid #eff3f4;
//         }

//         .plan.selected {
//           border-color: #007bff;
//           border: 2px solid #1d9bf0;
//         }

//         .plan h2 {
//           font-size: 20px;
//           margin-bottom: 10px;
//         }

//         .plan p {
//           font-size: 16px;
//           margin-bottom: 15px;
//         }

//        .plan ul {
//   list-style: none; /* Removes default bullets */
//   padding-left: 0; /* No padding */
// }

// .plan ul li {
//   position: relative;
//   padding-left: 40px; /* Adds space for the custom bullet */
//   margin-bottom: 10px;
//   font-size: 13px;
// }


// .plan ul li {
//   display: flex;
//   justify-content: flex-start;
//   align-items: center;
//   text-indent: -20px; /* Brings the text in line with bullets */
//   line-height: 1.5; /* Spacing between lines */
//   word-break: break-word; /* Ensures long words break correctly */
// }

//         /* Adjust list for alignment */
//         ul {
//           padding-left: 0;
//           list-style-position: inside;
//         }

//         li {
//           padding-left: 20px;
//           text-indent: -20px;
//           line-height: 1.8;
//         }

//         .selected-details {
//           margin-top: 20px;
//         }

//         /* Mobile responsiveness */
//         @media (max-width: 768px) {
//           .plans {
//             grid-template-columns: 1fr;
//           }
//         }

//         .subscribe-button:hover {
//           background-color: #1d9bf0; 
//         }
//       `}</style>
//     </div>
//   );
// };

// export default SubscriptionPage;

// import React, { useState } from 'react';
// import { useRouter } from 'next/router';
// import { Loading } from '@components/ui/loading'; 
// import { purchaseSubscription } from '@lib/firebase/premium'; // Importing purchaseSubscription

// const SubscriptionPage = () => {
//   const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium' | 'premiumPlus' | null>(null);
//   const [billingCycle, setBillingCycle] = useState<'annual' | 'monthly'>('annual');
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const planPrices = {
//     basic: billingCycle === 'monthly' ? 9.52 : 9.52 * 12,
//     premium: billingCycle === 'monthly' ? 25 : 25 * 12,
//     premiumPlus: billingCycle === 'monthly' ? 50 : 50 * 12,
//   };

//   const handlePlanSelect = (plan: 'basic' | 'premium' | 'premiumPlus') => {
//     setSelectedPlan(plan);
//   };

//   const handleBillingCycleChange = (cycle: 'annual' | 'monthly') => {
//     setBillingCycle(cycle);
//   };

//   const handlePurchase = async () => {
//     if (!selectedPlan) return;

//     setLoading(true);
//     const userId = 'userIdFromAuth'; // Replace with actual user ID from authentication context
//     const result = await purchaseSubscription(userId, selectedPlan);
//     setLoading(false);

//     if (result.success) {
//       alert(result.message);
//       router.push('/home');
//     } else {
//       alert(result.message);
//     }
//   };

//   return (
//     <div className="subscription-page">
//       <button className='XButton123' onClick={() => router.push('/home')}>
//         {/* Back button SVG */}
//       </button>

//       <div>
//         <h1 className='UpgradePremium'>Upgrade to Premium</h1>
//         <p>Enjoy an enhanced experience, exclusive creator tools, top-tier verification and security.</p>
//       </div>

//       <div className='billingcycleUpgradePremium'>
//         <div className="billing-cycle">
//           <button onClick={() => handleBillingCycleChange('annual')} className={`cycle-button ${billingCycle === 'annual' ? 'active' : ''}`}>
//             <span className='MonthlyAnnual'>Annual</span>
//           </button>
//           <button onClick={() => handleBillingCycleChange('monthly')} className={`cycle-button2 ${billingCycle === 'monthly' ? 'active' : ''}`}>
//             <span className='MonthlyAnnual'>Monthly</span>
//           </button>
//         </div>

//         <div className="plans">
//           <div onClick={() => handlePlanSelect('basic')} className={`plan ${selectedPlan === 'basic' ? 'selected' : ''}`}>
//             <h2>Basic</h2>
//             <p>${planPrices.basic.toFixed(2)} / {billingCycle}</p>
//           </div>
//           <div onClick={() => handlePlanSelect('premium')} className={`plan ${selectedPlan === 'premium' ? 'selected' : ''}`}>
//             <h2>Premium</h2>
//             <p>${planPrices.premium.toFixed(2)} / {billingCycle}</p>
//           </div>
//           <div onClick={() => handlePlanSelect('premiumPlus')} className={`plan ${selectedPlan === 'premiumPlus' ? 'selected' : ''}`}>
//             <h2>Premium+</h2>
//             <p>${planPrices.premiumPlus.toFixed(2)} / {billingCycle}</p>
//           </div>
//         </div>
//       </div>

//       <div>
//         {loading ? <Loading /> : (
//           <>
//             <button onClick={handlePurchase} className="subscribe-button">
//               Subscribe & Pay
//             </button>
//           </>
//         )}
//       </div>

//       <img src="premiums.png" alt="premium" />
//       <style jsx>{`
//         .subscription-page {
//           background: radial-gradient(56.1514% 56.1514% at 49.972% 38.959%, rgba(52, 147, 239, 0.3) 0%, rgb(255, 255, 255) 100%);
//           min-height: 100vh;
//           padding: 40px;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//         }

//         .billing-cycle {
//           display: flex;
//           margin-bottom: 20px;
//         }

//         .cycle-button, .cycle-button2 {
//           margin-right: 10px;
//           padding: 10px;
//         }

//         .plans {
//           display: grid;
//           grid-template-columns: repeat(3, 1fr);
//           gap: 20px;
//           width: 100%;
//           max-width: 800px;
//         }

//         .plan {
//           cursor: pointer;
//           border: 2px solid #eff3f4;
//           border-radius: 10px;
//           padding: 20px;
//           text-align: center;
//         }

//         .plan.selected {
//           border-color: #1d9bf0;
//         }

//         .subscribe-button {
//           padding: 10px 20px;
//           background-color: #1d9bf0;
//           color: white;
//           border: none;
//           border-radius: 5px;
//           cursor: pointer;
//         }

//         .subscribe-button:hover {
//           background-color: #0d7ac0;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default SubscriptionPage;

// import React, { useState } from 'react';
// import { useRouter } from 'next/router';
// import { Loading } from '@components/ui/loading'; // Import the Loading component

// const SubscriptionPage = () => {
//   const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium' | 'premiumPlus' | null>(null);
//   const [billingCycle, setBillingCycle] = useState<'annual' | 'monthly'>('annual');
//   const [loading, setLoading] = useState(false); // State to manage loading

//   const planPrices = {
//     basic: billingCycle === 'monthly' ? 9.52 : 9.52 * 12,
//     premium: billingCycle === 'monthly' ? 25 : 25 * 12,
//     premiumPlus: billingCycle === 'monthly' ? 50 : 50 * 12,
//   };

//   const handlePlanSelect = (plan: 'basic' | 'premium' | 'premiumPlus') => {
//     setSelectedPlan(plan);
//     setLoading(true); // Set loading to true when a plan is selected
//     // Simulate a charge delay
//     setTimeout(() => {
//       setLoading(false); // Reset loading after 1 second
//     }, 1000);
//   };

//   const handleBillingCycleChange = (cycle: 'annual' | 'monthly') => {
//     setBillingCycle(cycle);
//   };

//   const router = useRouter();

//   // Function to handle button navigation
//   const handleNavigation = (page: string) => {
//     router.push(page);
//   };

//   return (
//     <div className="subscription-page">
//       <button className='XButton123' onClick={() => handleNavigation('/home')} >
//         <svg
//           className='XButton1232'
//           viewBox="0 0 24 24"
//           aria-hidden="true"
//           style={{
//             width: '24px',
//             height: '24px',
//             fill: 'rgb(15, 20, 25)',
//             marginRight: '10px', // Adds space between icon and text
//           }}
//         >
//           <g>
//             <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
//           </g>
//         </svg>
//       </button>

//       <div>
//         <h1 className='UpgradePremium'>Upgrade to Premium</h1>
//         <p>Enjoy an enhanced experience, exclusive creator tools, top-tier verification and security.</p>
//       </div>

//       <div className='billingcycleUpgradePremium'>
//         <div className="billing-cycle">
//           <button 
//             onClick={() => handleBillingCycleChange('annual')} 
//             className={`cycle-button ${billingCycle === 'annual' ? 'active' : ''}`}
//           >
//             <span className='MonthlyAnnual'>Annual</span>
//           </button>
//           <button 
//             onClick={() => handleBillingCycleChange('monthly')} 
//             className={`cycle-button2 ${billingCycle === 'monthly' ? 'active' : ''}`}
//           >
//             <span className='MonthlyAnnual'>Monthly</span>
//           </button>
//         </div>

//         <div className="plans">
//           <div 
//             className={`bg-main-search-background plan ${selectedPlan === 'basic' ? 'selected' : ''}`} 
//             onClick={() => handlePlanSelect('basic')}
//           >
//             <h2 className='ulmonthPremium3'>Basic</h2>
//             <p className='ulmonthPremium'>$9.52 / month</p>
//             <ul>
//               <li>
//                 Small reply boost</li>
//               <li>Encrypted messages</li>
//               <li>Bookmark folders</li>
//               <li>Highlights tab</li>
//               <li>Edit post</li>
//               <li>Post longer videos</li>
//               <li>Longer posts</li>
//             </ul>
//           </div>

//           <div 
//             className={`bg-main-search-background plan ${selectedPlan === 'premium' ? 'selected' : ''}`} 
//             onClick={() => handlePlanSelect('premium')}
//           >
//             <h2 className='ulmonthPremium4'>Premium</h2>
//             <p className='ulmonthPremium'>$25 / month</p>
//             <ul>
//               <li>Everything in Basic</li>
//               <li>Half Ads in For You and Following</li>
//               <li>Larger reply boost</li>
//               <li>Get paid to post</li>
//               <li>Checkmark</li>
//               <li>TweetBot 2 AI Assistant</li>
//               <li>Tweetbook Pro, Analytics, Media Studio</li>
//               <li>Creator Subscriptions</li>
//             </ul>
//           </div>

//           <div 
//             className={`bg-main-search-background plan ${selectedPlan === 'premiumPlus' ? 'selected' : ''}`} 
//             onClick={() => handlePlanSelect('premiumPlus')}
//           >
//             <h2 className='ulmonthPremium2'>Premium+</h2>
//             <p className='ulmonthPremium'>$50 / month</p>
//             <ul>
//               <li>Everything in Premium</li>
//               <li>Fully ad-free</li>
//               <li>Largest reply boost</li>
//               <li>Write Articles</li>
//             </ul>
//           </div>
//         </div>
//       </div>

//       <div className="bg-main-background fixed-top-bar333">
//         {loading ? (
//           <Loading className='LoadingclassName flex h-52 items-center justify-center p-4' />
//         ) : (
//           <>
//             <div className="selected-details">
//               <h3 className='Billedbutton13131'>{selectedPlan ? selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1) : 'No plan selected'}</h3>
//               <p className='Billedbutton131312'>Billed {billingCycle}</p>
//               {selectedPlan && (
//                 <p className='BilledPrice Billedbutton1313122'>
//                   Price: ${planPrices[selectedPlan].toFixed(2)} {billingCycle === 'monthly' ? '/ month' : '/ year'}
//                 </p>
//               )}
//               <span className='Billedbutton13131222' onClick={() => handleNavigation('/Settings/Monetization')} >Settings Monetization</span>
//             </div>
//             <button onClick={() => handleNavigation('/i/premium_sign_up')} className="subscribe-button13131">
//               <span className='SubscribePay'>Subscribe & Pay</span>
//             </button>
//             <span className='spanYourAccount2spanYourAccount2 border-light-border dark:border-dark-border border-1 xs:border'>
//               By subscribing, you agree to our Purchaser Terms of Service. Subscriptions auto-
//               <br />
//               renew until canceled, as described in the Terms. Cancel anytime. Cancel at least 24 
//               <br />
//               hours prior to renewal to avoid additional charges. A verified phone number is 
//               <br />
//               required to subscribe. If you've subscribed on another platform, manage your 
//               <br />
//               subscription through that platform.
//             </span>
//           </>
//         )}
//       </div>

//       <img className='premium_Plus_immg' src="premiums.png" alt="premium" />
//       <style jsx>{`
//         .subscription-page {
//           background: radial-gradient(56.1514% 56.1514% at 49.972% 38.959%, rgba(52, 147, 239, 0.3) 0%, rgb(255, 255, 255) 100%);
//           min-height: 100vh;
//           padding: 40px;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//         }

//         /* Header */
//         .header h1 {
//           font-size: 32px;
//           color: white;
//           text-align: center;
//           margin-bottom: 10px;
//         }

//         .header p {
//           font-size: 18px;
//           color: white;
//           text-align: center;
//           margin-bottom: 20px;
//         }

//         /* Grid layout for plan cards */
//         .plans {
//           display: grid;
//           grid-template-columns: repeat(3, 1fr);
//           gap: 20px;
//           width: 100%;
//           max-width: 800px;
//         }

//         .plan {
//           background-color: none;
//           padding: 20px;
//           width: 300px;
//           height: 404px;
//           border-radius: 10px;
//           text-align: center;
//           cursor: pointer;
//           border: 2px solid #eff3f4;
//         }

//         .plan.selected {
//           border-color: #007bff;
//           border: 2px solid #1d9bf0;
//         }

//         .plan h2 {
//           font-size: 20px;
//           margin-bottom: 10px;
//         }

//         .plan p {
//           font-size: 16px;
//           margin-bottom: 15px;
//         }

//        .plan ul {
//   list-style: none; /* Removes default bullets */
//   padding-left: 0; /* No padding */
// }

// .plan ul li {
//   position: relative;
//   padding-left: 40px; /* Adds space for the custom bullet */
//   margin-bottom: 10px;
//   font-size: 13px;
// }


// .plan ul li {
//   display: flex;
//   justify-content: flex-start;
//   align-items: center;
//   text-indent: -20px; /* Brings the text in line with bullets */
//   line-height: 1.5; /* Spacing between lines */
//   word-break: break-word; /* Ensures long words break correctly */
// }

//         /* Adjust list for alignment */
//         ul {
//           padding-left: 0;
//           list-style-position: inside;
//         }

//         li {
//           padding-left: 20px;
//           text-indent: -20px;
//           line-height: 1.8;
//         }

//         .selected-details {
//           margin-top: 20px;
//         }

//         /* Mobile responsiveness */
//         @media (max-width: 768px) {
//           .plans {
//             grid-template-columns: 1fr;
//           }
//         }

//         .subscribe-button:hover {
//           background-color: #1d9bf0;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default SubscriptionPage;
