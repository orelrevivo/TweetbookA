import { useState } from 'react';
import { Button } from '@components/ui/button';
import { Modal } from '@components/modal/modal';
import { Input } from '@components/input/input';
import { useModal } from '@lib/hooks/useModal';
import cn from 'clsx';

export default function TweetbookStudio(): JSX.Element {
  const [selectedButton, setSelectedButton] = useState<'one' | 'two' | 'three' | null>(null);
  const { open, openModal, closeModal } = useModal(); // Hook for modal management

  // Function to handle button clicks and update the selected button
  const handleButtonClick = (button: 'one' | 'two' | 'three') => {
    setSelectedButton(button);
  };

  return (
    <div className={cn(
      'hover-animation flex min-h-screen w-full max-w-xl flex-col border-x-0 border-light-border pb-96'
    )}>
       <div className="scrollable-container2 border-x-0
         border-light-border pb-96 dark:border-dark-border xs:border-x"></div>
      {/* Existing Buttons */}
      <Button
        className='TweetbookStudio bg-main-sidebar-background'
        onClick={openModal}
      >
        TweetbookStudio
      </Button>


     

      {/* Additional Buttons */}
      <div className='flex flex-col gap-4'>
        {/* Button One */}
        <div>
          <Button
            className='TweetbookStudi2o bg-main-sidebar-background'
            onClick={() => handleButtonClick('one')}
          >
            Dashboard
          </Button>
          {selectedButton === 'one' && (
            <div className='TweetbookStudi2o42 bg-main-sidebar-background mt-2 p-4 bg-gray-100  rounded-lg'>
              Dashboard
            </div>
          )}
        </div>

        {/* Button Two */}
        <div>
          <Button
            className='TweetbookStudi2o3 bg-main-sidebar-background'
            onClick={() => handleButtonClick('two')}
          >
            Analytics
          </Button>
          {selectedButton === 'two' && (
            <div className='TweetbookStudi2o42 bg-main-sidebar-background mt-2 p-4 bg-gray-100  rounded-lg'>
              Analytics
            </div>
          )}
        </div>

        {/* Button Three */}
        <div>
          <Button
            className='TweetbookStudi2o4 bg-main-sidebar-background'
            onClick={() => handleButtonClick('three')}
          >
            Comments
          </Button>
          {selectedButton === 'three' && (
            <div className='TweetbookStudi2o42 bg-main-sidebar-background mt-2 p-4 bg-gray-100  rounded-lg'>
              Comments
            </div>
          )}
        </div>
      </div>
      <h1 className='tweetbook23'>TweetbookStudio</h1>
      {/* Buttons that need to be added!!!!! */}
      {/* Content
      Subtitles
      Copyright
      Earn
      Customization
      Audio library */}

      {/* Modal */}
      <Modal
        className='flex items-start justify-center'
        modalClassName='bg-main-background rounded-2xl max-w-xl w-full mt-8 overflow-hidden'
        open={open}
        closeModal={closeModal}
      >
        <Input modal closeModal={closeModal} />
      </Modal>

      <div className='flex flex-col flex-grow'>
        {/* Your content goes here */}
      </div>
    </div>
  );
}
