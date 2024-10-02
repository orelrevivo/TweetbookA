import { useState, useEffect, ReactElement, ReactNode } from 'react';
import { Button } from '@components/ui/button';
import { Modal } from '@components/modal/modal';
import { Input } from '@components/input/input';
import { useModal } from '@lib/hooks/useModal';
import cn from 'clsx';
import { useWindow } from '@lib/context/window-context';
import { MainLayout } from '@components/layout/main-layout-U';
import { ProtectedLayout } from '@components/layout/common-layout-U';
import { MainContainer } from '@components/home/main-container-me';

export default function Inspirations(): JSX.Element {
  const [selectedButton, setSelectedButton] = useState<'one' | 'two' | 'three' | null>(null);
  const { open, openModal, closeModal } = useModal(); // Hook for modal management
  const { isMobile } = useWindow();

  // Function to handle button clicks and update the selected button
  const handleButtonClick = (button: 'one' | 'two' | 'three') => {
    setSelectedButton(button);
  };

  return (
    <section className='InputU'>
         {/* {!isMobile && <Input />} */}
    </section>
  );
}
Inspirations.getLayout = function getLayout(page: ReactElement): ReactNode {
    return (
      <ProtectedLayout>
        <MainLayout>{page}</MainLayout>
      </ProtectedLayout>
    );
  };