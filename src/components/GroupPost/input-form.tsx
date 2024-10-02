import { useEffect, useState } from 'react';
import TextArea from 'react-textarea-autosize';
import { motion } from 'framer-motion';
import { useModal } from '@lib/hooks/useModal';
import { HeroIcon } from '@components/ui/hero-icon';
import { Button } from '@components/ui/button';
import type {
  ReactNode,
  RefObject,
  ChangeEvent,
  KeyboardEvent,
  ClipboardEvent
} from 'react';
import type { Variants } from 'framer-motion';

type InputFormProps = {
  modal?: boolean;
  formId: string;
  loading: boolean;
  visited: boolean;
  reply?: boolean;
  children: ReactNode;
  inputRef: RefObject<HTMLTextAreaElement>;
  inputValue: string;
  replyModal?: boolean;
  isValidTweet: boolean;
  isUploadingImages: boolean;
  sendTweet: () => Promise<void>;
  handleFocus: () => void;
  discardTweet: () => void;
  handleChange: ({
    target: { value }
  }: ChangeEvent<HTMLTextAreaElement>) => void;
  handleImageUpload: (
    e: ChangeEvent<HTMLInputElement> | ClipboardEvent<HTMLTextAreaElement>
  ) => void;
};

const variants: Variants[] = [
  {
    initial: { y: -25, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { type: 'spring' } }
  },
  {
    initial: { x: 25, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { type: 'spring' } }
  }
];

export const [fromTop, fromBottom] = variants;

export function InputForm({
  modal,
  reply,
  formId,
  loading,
  visited,
  children,
  inputRef,
  replyModal,
  inputValue,
  isValidTweet,
  isUploadingImages,
  sendTweet,
  handleFocus,
  discardTweet,
  handleChange,
  handleImageUpload
}: InputFormProps): JSX.Element {
  const { open, openModal, closeModal } = useModal();
  const [visibility, setVisibility] = useState<'everyone' | 'followed' | 'verified' | 'mentioned'>('everyone');
  const [buttonPosition, setButtonPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  useEffect(() => handleShowHideNav(true), []);

  const handleKeyboardShortcut = ({
    key,
    ctrlKey
  }: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (!modal && key === 'Escape')
      if (isValidTweet) {
        inputRef.current?.blur();
        openModal();
      } else discardTweet();
    else if (ctrlKey && key === 'Enter' && isValidTweet) void sendTweet();
  };

  const handleShowHideNav = (blur?: boolean) => (): void => {
    const sidebar = document.getElementById('sidebar') as HTMLElement;

    if (!sidebar) return;

    if (blur) {
      setTimeout(() => (sidebar.style.opacity = ''), 200);
      return;
    }

    if (window.innerWidth < 500) sidebar.style.opacity = '0';
  };

  const handleFormFocus = (): void => {
    handleShowHideNav()();
    handleFocus();
  };

  const handleClose = (): void => {
    discardTweet();
    closeModal();
  };

  const handleVisibilityChange = (option: 'everyone' | 'followed' | 'verified' | 'mentioned'): void => {
    setVisibility(option);
    closeModal();
  };

  const isVisibilityShown = visited && !reply && !replyModal && !loading;

  const handleOpenModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setButtonPosition({ top: rect.bottom + window.scrollY, left: rect.left + (rect.width / 2) });
    openModal();
  };

  return (
    <div className='flex min-h-[48px] w-full flex-col justify-center gap-4'>
      {open && (
        <div
          className='VEveryone absolute z-10 bg-white max-w-xs p-4 rounded-2xl'
          style={{
            width: 290,
            top: buttonPosition.top - (0 / 2),
            left: buttonPosition.left - (480 / 2),
            transform: 'translateY(8px)', 
          }}
        >
          <div className='flex flex-col'>
            <div className='flex items-center justify-between'>
              <h3 className='text-xl font-bold' style={{ fontSize: '14px' }}>
                Who can reply?
              </h3>
              <button
                type='button'
                className='p-2 text-gray-500 hover:text-gray-900'
                onClick={handleClose}
                style={{ borderRadius: '50%', cursor: 'pointer' }}
              >
                X
              </button>
            </div>
            <p style={{ fontSize: '14px', marginBottom: '10px' }} className='text-light-secondary dark:text-dark-secondary'>
              Choose who can reply to this post. Anyone mentioned can always reply.
            </p>
            <button
              type='button'
              className={`buttonLeft2 flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${visibility === 'everyone' ? 'bg-gray-100' : ''}`}
              onClick={() => handleVisibilityChange('everyone')}
              style={{ width: '112.3%', borderRadius: '0px', marginBottom: '0' }}
            >
              <HeroIcon className='h-5 w-5' iconName='GlobeAmericasIcon' />
              <p>Everyone</p>
            </button>
            <button
              type='button'
              className={`buttonLeft2 flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${visibility === 'followed' ? 'bg-gray-100' : ''}`}
              onClick={() => handleVisibilityChange('followed')}
              style={{ width: '112.3%', borderRadius: '0px', marginBottom: '0' }}
            >
              <HeroIcon className='h-5 w-5' iconName='UserGroupIcon' />
              <p>Accounts you follow</p>
            </button>
            <button
              type='button'
              className={`buttonLeft2 flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${visibility === 'verified' ? 'bg-gray-100' : ''}`}
              onClick={() => handleVisibilityChange('verified')}
              style={{ width: '112.3%', borderRadius: '0px', marginBottom: '0' }}
            >
              <p>Verified accounts</p>
            </button>
            <button
              type='button'
              className={`buttonLeft23 flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${visibility === 'mentioned' ? 'bg-gray-100' : ''}`}
              onClick={() => handleVisibilityChange('mentioned')}
              style={{ width: '112.3%', borderRadius: '0px 0px 17px 17px', marginBottom: '0' }}
            >
              <HeroIcon className='h-5 w-5' iconName='AtSymbolIcon' />
              <p>Only accounts you mention</p>
            </button>
          </div>
        </div>
      )}
      <div className='flex flex-col gap-6'>
        <div className='flex items-center gap-3'>
          <TextArea
            id={formId}
            className='w-full min-w-0 resize-none bg-transparent text-xl outline-none placeholder:text-light-secondary dark:placeholder:text-dark-secondary'
            value={inputValue}
            placeholder={
              reply || replyModal ? 'Reply to this post' : "Share your thoughts in the community group!"
            }
            onBlur={handleShowHideNav(true)}
            minRows={loading ? 1 : modal && !isUploadingImages ? 3 : 1}
            maxRows={isUploadingImages ? 5 : 15}
            onFocus={handleFormFocus}
            onPaste={handleImageUpload}
            onKeyUp={handleKeyboardShortcut}
            onChange={handleChange}
            ref={inputRef}
          />
          {reply && !visited && (
            <Button
              className='!ml-4 bg-blue-500 text-white hover:bg-blue-600'
              disabled={!isValidTweet || loading}
              onClick={sendTweet}
            >
              Post
            </Button>
          )}
        </div>
        {/* {isVisibilityShown && (
          <motion.button
            type='button'
            className='buttonLeft2 relative flex w-max items-center gap-1 self-start rounded-full border px-3 py-1 text-light-secondary transition dark:text-dark-secondary'
            onClick={handleOpenModal}
            variants={fromBottom}
            initial='initial'
            animate='animate'
          >
            <HeroIcon className='h-4 w-4' iconName='GlobeAmericasIcon' />
            <p className='text-xs font-bold text-blue-500'>Everyone can reply</p>
          </motion.button>
        )} */}
      </div>
      {children}
    </div>
  );
}
