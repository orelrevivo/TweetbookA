import { MainHeader } from '@components/home/main-header';
import { HomeLayout, ProtectedLayout } from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import { MainContainer } from '@components/home/Support_User';
import { savePurchaseDetails } from '@lib/firebase/Support_User'; // Firebase save function
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

// Load Stripe with your publishable key
const stripePromise = loadStripe('your-publishable-key-here');

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState('');
  const [purchaseConfirmed, setPurchaseConfirmed] = useState(false);
  const [purchaseDetails, setPurchaseDetails] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);
    const cardExpiryElement = elements.getElement(CardExpiryElement);
    const cardCvcElement = elements.getElement(CardCvcElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardNumberElement,
    });

    if (error) {
      setError(error.message);
    } else {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentMethodId: paymentMethod.id }),
      });

      const paymentResponse = await response.json();

      if (paymentResponse.success) {
        setPurchaseConfirmed(true);
        setPurchaseDetails({
          orderId: paymentResponse.orderId,
          amount: paymentResponse.amount,
          purchaseDate: paymentResponse.purchaseDate,
        });
      } else {
        setError('Payment failed. Please try again.');
      }
    }
  };

  return (
    <MainContainer className="TweetbookHomee342">
      <form className='TweetbookHomee3424' onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
       <div className='Box21 border-light-border dark:border-dark-border border-1 xs:border'>
       <div style={{ marginBottom: '20px' }}>
          <label>Card information</label>
          <div className="card-container">
            <CardNumberElement
              className='CardNumberElement'
              options={{ style: { base: { fontSize: '16px' } } }}
            />
          </div>
        </div>
        <div style={{ marginBottom: '20px' }} card-container>
          <CardExpiryElement 
          className='CardNumberElement'
            options={{ style: { base: { fontSize: '16px' } } }} 
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <CardCvcElement 
          className='CardNumberElement'
            options={{ style: { base: { fontSize: '16px' } } }} 
          />
        </div>
        <button
          type="submit"
          disabled={!stripe}
          className='SubscribeSubmit224'
        >
          Purchase
        </button>
        <span className='spanYourAccount232141'>
          <span className='spanYourAccount2321412'>By confirming your subscription, you allow Tweetbook to charge you </span>
          for future payments in accordance with their terms. You can always cancel 
          your subscription.</span>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
       </div>
        {purchaseConfirmed && (
          <div style={{ marginTop: '20px' }}>
            <h2>Purchase Confirmed!</h2>
            <ul>
              <li>Order ID: {purchaseDetails?.orderId}</li>
              <li>Amount: ${purchaseDetails?.amount}</li>
              <li>Purchase Date: {purchaseDetails?.purchaseDate}</li>
            </ul>
          </div>
        )}
      </form>
    </MainContainer>
  );
};

export default function Support_User(): JSX.Element {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}

// import { MainHeader } from '@components/home/main-header';
// import { MainContainer } from '@components/home/main-container-home';
// import { useState } from 'react';

// export default function Support_User(): JSX.Element {
//   const [error, setError] = useState('');

//   const handleCheckout = async () => {
//     const response = await fetch('/api/create-checkout-session', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     const session = await response.json();

//     if (response.ok) {
//       // Redirect to Stripe Checkout
//       window.location.href = session.id; // Ensure this is the session URL
//     } else {
//       setError(session.error);
//     }
//   };

//   return (
//     <MainContainer className="TweetbookHome">
//       <MainHeader title="Support User subscriptions." />
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       <button onClick={handleCheckout} style={{
//         backgroundColor: '#007bff',
//         color: 'white',
//         padding: '10px 16px',
//         border: 'none',
//         borderRadius: '4px',
//         cursor: 'pointer',
//         fontSize: '16px',
//       }}>
//         Purchase
//       </button>
//     </MainContainer>
//   );
// }
