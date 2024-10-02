import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from '@headlessui/react';
import cn from 'clsx';
import { useModal } from '@lib/hooks/useModal';
import { Modal } from '@components/modal/modal';
import { DisplayModal } from '@components/modal/display-modal'; // This remains since you want the square to open
import { HeroIcon } from '@components/ui/hero-icon';
import type { Variants } from 'framer-motion';

export const variants: Variants = {
  initial: { opacity: 0, y: 50 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', duration: 0.4 }
  },
  exit: { opacity: 0, y: 50, transition: { duration: 0.2 } }
};

export function MoreSettings(): JSX.Element {
  const { open, openModal, closeModal } = useModal();

  return (
    <>
      <Modal
        modalClassName='max-w-xl bg-main-background w-full p-8 rounded-2xl hover-animation'
        open={open}
        closeModal={closeModal}
      >
        <DisplayModal closeModal={closeModal} /> {/* This opens the square */}
      </Modal>
      <Menu className='relative' as='div'>
        {({ open }): JSX.Element => (
          <>
            <Menu.Item>
              {({ active }): JSX.Element => (
                <Menu.Button
                  className='group relative flex w-full py-1 outline-none'
                  onClick={openModal} // This now opens the square directly
                >
                  <div
                    className={cn(
                      'flex w-full gap-3 rounded-md p-4',
                      active && 'bg-main-sidebar-background'
                    )}
                  >
                    <HeroIcon
                      className='h-7 w-7'
                      iconName='EllipsisHorizontalCircleIcon'
                    />
                    <p className='hidden xl:block'>Switch appearance</p>
                  </div>
                </Menu.Button>
              )}
            </Menu.Item>
            {/* Removed the Menu.Items section that contained the "Display" button */}
          </>
        )}
      </Menu>
    </>
  );
}
