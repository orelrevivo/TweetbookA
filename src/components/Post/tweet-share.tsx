import Link from 'next/link';
import cn from 'clsx';
import { Popover } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import { HeroIcon } from '@components/ui/hero-icon';
import { ToolTip } from '@components/ui/tooltip';
import { variants } from './tweet-actions';
import { useAuth } from '@lib/context/auth-context';
import PaymentTweetbook from '../../../app/page';

type TweetShareProps = {
  userId: string;
  tweetId: string;
  viewTweet?: boolean;
};

export function TweetShare({
  userId,
  tweetId,
  viewTweet
}: TweetShareProps): JSX.Element {
  const [amount, setAmount] = useState(1500); // Default amount
  const [inputValue, setInputValue] = useState('Thanks!'); // Default input value
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [showLoading, setShowLoading] = useState(false); // For loading animation
  const [showCreditCardForm, setShowCreditCardForm] = useState(false); // To handle credit card form visibility
  const [formValid, setFormValid] = useState(false); // To validate form before submission
  const [showEmptySquare, setShowEmptySquare] = useState(false); // State to show the empty square
  const { user } = useAuth();

  const handleSend = () => {
    setShowLoading(true);
    setTimeout(() => {
      setShowLoading(false);
      setShowCreditCardForm(true);
    }, 3000); // Show loading for 3 seconds
  };

  const validateCardDetails = () => {
    const cardNumber = (document.getElementById('cardNumber') as HTMLInputElement).value;
    const cardName = (document.getElementById('cardName') as HTMLInputElement).value;
    const expirationDate = (document.getElementById('expirationDate') as HTMLInputElement).value;
    const cvc = (document.getElementById('cvc') as HTMLInputElement).value;

    const cardNumberValid = /^\d{16}$/.test(cardNumber);
    const cardNameValid = /^[a-zA-Z]+ [a-zA-Z]+$/.test(cardName);
    const expirationDateValid = /^(0[1-9]|1[0-2])\/\d{2}$/.test(expirationDate);
    const cvcValid = /^\d{3}$/.test(cvc);

    if (cardNumberValid && cardNameValid && expirationDateValid && cvcValid) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  };

  const handlePurchase = () => {
    validateCardDetails();
    if (formValid) {
      setConfirmationMessage('Thank you for your purchase!');
      setShowCreditCardForm(false); // Hide credit card form after purchase
    } else {
      toast.error('Please fill in all required fields correctly.');
    }
  };

  const handleLearnMoreClick = () => {
    setShowEmptySquare(true);
  };

  return (
    <Popover className='relative'>
      {({ open, close }): JSX.Element => (
        <>
          <Popover.Button
            className={cn(
              'group relative flex items-center gap-1 p-0 outline-none transition-none hover:text-accent-blue focus-visible:text-accent-blue',
              open && 'text-accent-blue inner:bg-accent-blue/10'
            )}
          >
            <i
              className='relative rounded-full p-2 not-italic duration-200 group-hover:bg-accent-blue/10 group-focus-visible:bg-accent-blue/10 group-focus-visible:ring-2 group-focus-visible:ring-accent-blue/80 group-active:bg-accent-blue/20'
            >
              <HeroIcon
                className={viewTweet ? 'h-6 w-6' : 'h-5 w-5'}
                iconName='InformationCircleIcon'
              />
              {!open && <ToolTip tip='Tip' />}
            </i>
          </Popover.Button>
          <AnimatePresence>
            {open && (
              <Popover.Panel
                className='menu-container234 bg-main-background group absolute top-11 whitespace-nowrap text-light-primary dark:text-dark-primary'
                as={motion.div}
                {...variants}
                static
              >
                <div className='fixed inset-0 flex items-center justify-center bg-gray-200/50'>
                  <div className=''>
                  {/* <button
                      className=' w-[20px] text-white'
                      onClick={close}
                    >
                      x
                    </button> */}
                  <PaymentTweetbook />
                </div>
                </div>
              </Popover.Panel>
            )}
          </AnimatePresence>

          {/* Conditionally render the empty square */}
          {showEmptySquare && (
            <div className='fixed inset-0 flex items-center justify-center bg-gray-200/50'>
              <div className='fixedsfgew2 w-[500px] h-[500px] bg-main-background border border-gray-300 rounded-md p-4'>
                <div className='fixedsfgew24'>
                  <p>Note: Some new Super Chat, Super Stickers, or Super Thanks purchases made on the Tweetbook Android app will be billed via Google Play. This change will not impact pricing or cost, only where the purchase is billed from.</p>
                  <p> You can go to pay.google.com to view new charges and check how you are billed.</p>
                </div>
                <div className='fixedsfgew243'>
                  <p>You can show your favorite creators extra gratitude for their content and stand out in their</p>
                  <p>comments section with Super Thanks. Super Thanks lets you buy a fun, one-time animation that</p>
                  <p>will only be shown to you over the top of the long-form video or Short. As an added bonus, you</p>
                  <p>get a distinct, colorful, and customizable comment in the comments section. Super Thanks is</p>
                  <p>available at different prices for you to choose from.</p>
                </div>
                <button
                      className='ContinuewBuy2 w-full text-white py-2 rounded-md transition'
                      onClick={close}
                    >
                      Continue & exit
                    </button>
              </div>
            </div>
          )}
        </>
      )}
    </Popover>
  );
}
