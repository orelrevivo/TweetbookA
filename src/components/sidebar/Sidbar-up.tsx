import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu } from '@headlessui/react';
import cn from 'clsx';
import { useAuth } from '@lib/context/auth-context';
import { useModal } from '@lib/hooks/useModal';
import { Modal } from '@components/modal/modal';
import { Button } from '@components/ui/button';
import { HeroIcon } from '@components/ui/hero-icon';
import { useRouter } from 'next/router';
import { updateUserToPremium, getPremiumStatusFromServer, cancelPremiumSubscription } from '@lib/firebase/Sidbarup';
import { ActionModal } from '@components/modal/action-modal';

export function Sidbarup(): JSX.Element {
  const { user, signOut } = useAuth();
  const { open, openModal, closeModal } = useModal();
  const router = useRouter();
  const { name, username, verified, photoURL } = user as User;

  const [isPremiumModalOpen, setPremiumModalOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  // Fetch premium status when component mounts
  useEffect(() => {
    async function checkPremiumStatus() {
      if (user?.uid) {
        const isUserPremium = await getPremiumStatusFromServer(user.uid);
        setIsPremium(isUserPremium);
      }
    }
    checkPremiumStatus();
  }, [user?.uid]);

  const openPremiumModal = () => setPremiumModalOpen(true);
  const closePremiumModal = () => setPremiumModalOpen(false);

  const handleUpgradeToPremium = async () => {
    setIsProcessingPayment(true);
    try {
      await updateUserToPremium(user.uid, { cardNumber, expiryDate, cvv });
      setIsPremium(true); // Update local state
    } catch (error) {
      console.error('Error upgrading to premium:', error);
    } finally {
      setIsProcessingPayment(false);
      closePremiumModal();
    }
  };

  const handleCancelPremium = async () => {
    setIsProcessingPayment(true);
    try {
      const isCancelled = await cancelPremiumSubscription(user.uid, { cardNumber, expiryDate, cvv });
      if (isCancelled) {
        setIsPremium(false); // Update local state
      } else {
        alert('Cannot cancel using the same details as used to purchase premium.');
      }
    } catch (error) {
      console.error('Error cancelling premium subscription:', error);
    } finally {
      setIsProcessingPayment(false);
      closePremiumModal();
    }
  };

  return (
    <>
      <Modal
        modalClassName="max-w-xs bg-main-background w-full p-8 rounded-2xl"
        open={open}
        closeModal={closeModal}
      >
        <ActionModal
          focusOnMainBtn
          title="Log out of Tweetbook?"
          description="You can always log back in at any time. If you just want to switch accounts, you can do that by adding an existing account."
          mainBtnLabel="Log out"
          action={signOut}
          closeModal={closeModal}
        />
      </Modal>
      {/* Premium Modal */}
      <Modal
        modalClassName="max-w-xs bg-main-background w-full rounded-2xl"
        open={isPremiumModalOpen}
        closeModal={closePremiumModal}
      >
        <div className="p-4">
          <h2 className='CancelPremium'>{isPremium ? 'Cancel Premium' : 'Enter Payment Details'}</h2>
          <input
            type="text"
            placeholder="Card Number"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Expiry Date (MM/YY)"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="input-field"
          />
          <input
            type="text"
            placeholder="CVV"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            className="input-field"
          />
          {isPremium ? (
            <Button className='ProcessingBuy' onClick={handleCancelPremium} disabled={isProcessingPayment}>
              {isProcessingPayment ? 'Processing...' : 'Cancel Premium'}
            </Button>
          ) : (
            <Button className='ProcessingBuy' onClick={handleUpgradeToPremium} disabled={isProcessingPayment}>
              {isProcessingPayment ? 'Processing...' : 'Buy'}
            </Button>
          )}
        </div>
      </Modal>

      <Menu className="relative" as="section">
        {({ open }): JSX.Element => (
          <>
            <Menu.Button className={cn(
              `custom-buttonhover2fawrwr custom-button main-tab dark-bg-tab flex w-full items-center
              justify-between active:bg-light-primary/20
              dark:hover:bg-dark-primary/10 dark:active:bg-dark-primary/20
              rounded-[15px] w-[84%]`,
              open && 'bg-light-primary/10 dark:bg-dark-primary/10'
            )}>
              <div className="flex gap-3 truncate">
                <div className="hidden truncate text-start leading-5 xl:block">
                  <h1 className='Upgrade'>Upgrade??</h1>
                  {isPremium && <span className="Shidroupgraded text-green-500">Shidro has been upgraded to premium</span>}
                </div>
                <HeroIcon
                className="hidden h-6 w-6 xl:block"
                iconName="EllipsisHorizontalIcon"
              />
              </div>
            </Menu.Button>
            <AnimatePresence>
              {open && (
                <Menu.Items className="borderbox42454 menu-container absolute w-60 xl:w-[240px]" as={motion.div} static>
                  <Menu.Item>
                    {({ active }): JSX.Element => (
                      <Button className={cn(
                        'btnH12 ReportaProblem flex w-full gap-3 rounded-md p-4',
                        active && 'bg-main-sidebar-background'
                      )} onClick={openPremiumModal}>
                        <p className="btnH12P">
                          <HeroIcon iconName="ArrowsRightLeftIcon" />
                        </p>
                        <p className="btnH12P">{isPremium ? 'Cancel Premium' : 'Switch To Premium'}</p>
                      </Button>
                    )}
                  </Menu.Item>
                   <Menu.Item>
                    {({ active }): JSX.Element => (
                      <Button
                        className={cn(
                          'btnH12 Logoutbtn1 flex w-full gap-3 rounded-md rounded-t-none p-4',
                          active && 'bg-main-sidebar-background'
                        )}
                        onClick={openModal}
                      >
                        <p className="btnH12P">
                          <HeroIcon iconName="ArrowRightOnRectangleIcon" />
                        </p>
                        <p className="btnH12P">Log out</p>
                      </Button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              )}
            </AnimatePresence>
          </>
        )}
      </Menu>
    </>
  );
}
