import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  doc,
  limit,
  query,
  where,
  orderBy,
  documentId,
} from 'firebase/firestore';
import { useAuth } from '@lib/context/auth-context';
import { useCollection } from '@lib/hooks/useCollection';
import { useDocument } from '@lib/hooks/useDocument';
import { usersCollection } from '@lib/firebase/collections';
import { UserCard } from '@components/user/user-card';
import { Loading } from '@components/ui/loading';
import { Error } from '@components/ui/error';
import { useState } from 'react';
import { HeroIcon } from '@components/ui/hero-icon';
import { useModal } from '@lib/hooks/useModal';
import { Modal } from '@components/modal/modal';
import { EditProfileModal } from '@components/modal/edit-profile-modal';
import { InputField } from '@components/input/input-field';

export function User_P_S(): JSX.Element {
  const { randomSeed } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);

  // New modal hook
  const { isOpen: editProfileOpen, openModal: openEditProfileModal, closeModal: closeEditProfileModal } = useModal();

  const tabs = [
    {
      title: "Which industry do you work in?",
      description: "Members who add an industry receive up to 2.5 times as many profile views.",
      buttonText: "Add industry",
    },
    {
      title: "Add a profile photo to help others recognize you",
      description: "Members with a profile photo receive up to 2.3 times as many profile views.",
      buttonText: "Add photo",
    },
  ];

  const { data: adminData, loading: adminLoading } = useDocument(
    doc(usersCollection, 'Twt0A27bx9YcG4vu3RTsR7ifJzf2'),
    { allowNull: true }
  );

  const { data: suggestionsData, loading: suggestionsLoading } = useCollection(
    query(
      usersCollection,
      where(documentId(), '>=', randomSeed),
      orderBy(documentId()),
      limit(2)
    ),
    { allowNull: true }
  );

  const handleNext = () => {
    if (currentTab < tabs.length - 1) {
      setCurrentTab(currentTab + 1);
    }
  };

  const handlePrevious = () => {
    if (currentTab > 0) {
      setCurrentTab(currentTab - 1);
    }
  };

  return (
    <div>
      <section className='ADTweetbook3232 border-light-border dark:border-dark-border border-1 xs:border'>
        {adminLoading || suggestionsLoading ? (
          <Loading className='flex h-52 items-center justify-center p-4' />
        ) : suggestionsData ? (
          <div className="flex flex-col items-center relative">
            <div className="">
              <button
                onClick={handlePrevious}
                disabled={currentTab === 0}
                className="dfaefdfsdfdsfe top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow"
              >
                <HeroIcon
                  className='h-5 w-5'
                  iconName={'ArrowLeftIcon'}
                />
              </button>

              <div className="tabs-content h-full flex flex-col justify-center items-center">
                <motion.div
                  key={currentTab}
                  className="p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h2 className="font-bold text-lg">{tabs[currentTab].title}</h2>
                  <p className="text-sm">{tabs[currentTab].description}</p>
                  
                  {/* Updated button to open the Edit Profile Modal */}
                  <button
  className="dssfsfsdfdsfe text-main-accent dark-bg-tab min-w-[106px] self-start border border-light-line-reply px-4 py-1.5 font-bold hover:border-accent-red hover:bg-accent-red/10 hover:text-accent-red dark:border-light-secondary"
  onClick={openEditProfileModal}
>
  {tabs[currentTab].buttonText}
</button>
                </motion.div>
              </div>

              <button
                onClick={handleNext}
                disabled={currentTab === tabs.length - 1}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow"
              >
                <HeroIcon
                  className='h-5 w-5'
                  iconName={'ArrowRightIcon'}
                />
              </button>
            </div>
          </div>
        ) : (
          <Error />
        )}
      </section>
      <Modal
  modalClassName='relative bg-main-background rounded-2xl max-w-xl w-full h-[672px] overflow-hidden'
  open={editProfileOpen} // Pass the boolean state for modal visibility
  closeModal={closeEditProfileModal} // This should close the modal
>
    
</Modal>
    </div>
  );
}
