import { useRef, useState, ChangeEvent, useEffect } from 'react';
import cn from 'clsx';
import { MainHeader } from '@components/home/main-header';
import { Button } from '@components/ui/button';
import { HeroIcon } from '@components/ui/hero-icon';
import { NextImage } from '@components/ui/next-image';
import { ToolTip } from '@components/ui/tooltip';
import type { ReactNode } from 'react';
import type { User } from '@lib/types/user';

type EditProfileModalProps = Pick<
  User,
  'name' | 'photoURL' | 'coverPhotoURL'
> & {
  loading: boolean;
  children: ReactNode;
  inputNameError: string;
  editImage: (
    type: 'cover' | 'profile'
  ) => ({ target: { files } }: ChangeEvent<HTMLInputElement>) => void;
  closeModal: () => void;
  updateData: () => Promise<void>;
  removeCoverImage: () => void;
  resetUserEditData: () => void;
};

export function EditProfileModal({
  name,
  loading,
  photoURL,
  children,
  coverPhotoURL,
  inputNameError,
  editImage,
  closeModal,
  updateData,
  removeCoverImage,
  resetUserEditData
}: EditProfileModalProps): JSX.Element {
  const coverInputFileRef = useRef<HTMLInputElement>(null);
  const profileInputFileRef = useRef<HTMLInputElement>(null);

  const handleClick = (type: 'cover' | 'profile') => (): void => {
    if (type === 'cover') coverInputFileRef.current?.click();
    else profileInputFileRef.current?.click();
  };

  // Modal state management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [profileType, setProfileType] = useState<string>('');

  useEffect(() => {
    // Fetch profile type from local storage on component mount
    const savedProfileTypes = localStorage.getItem('profileTypes');
    if (savedProfileTypes) {
      setProfileType(savedProfileTypes);
    }
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModalInternal = () => {
    setIsModalOpen(false);
    closeModal();
  };

  const handleProfileTypeSelection = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((item) => item !== type)
        : prev.length < 2
        ? [...prev, type]
        : prev
    );
  };

  const handleContinue = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirm = async () => {
    setProfileType(selectedTypes.join(', '));
    localStorage.setItem('profileTypes', selectedTypes.join(', ')); // Save to local storage
    setIsModalOpen(false);
    setIsConfirmModalOpen(false);
  };

  const handleCancel = () => {
    setIsConfirmModalOpen(false);
  };

  const renderProfileType = () => {
    if (profileType) {
      return `You are a ${profileType}`;
    }
    return 'Switch to professional';
  };

  return (
    <>
      <MainHeader
        useActionButton
        disableSticky
        iconName='XMarkIcon'
        tip='Close'
        className='absolute flex w-full items-center gap-6 rounded-tl-2xl'
        title='Settings profile'
        action={closeModalInternal}
      >
        <div className='ml-auto flex items-center gap-3'>
          <Button
            className='dark-bg-tab group relative p-2 hover:bg-light-primary/10 active:bg-light-primary/20'
            onClick={resetUserEditData}
            disabled={loading}
          >
            <HeroIcon className='h-5 w-5' iconName={'ArrowPathIcon'} />
            <ToolTip tip='Reset' />
          </Button>
          <Button
            className='bg-light-primary py-1 px-4 font-bold text-white focus-visible:bg-light-primary/90 enabled:hover:bg-light-primary/90 enabled:active:bg-light-primary/80 disabled:brightness-75 dark:bg-light-border dark:text-light-primary dark:focus-visible:bg-light-border/90 dark:enabled:hover:bg-light-border/90 dark:enabled:active:bg-light-border/75'
            onClick={updateData}
            disabled={!!inputNameError}
            loading={loading}
          >
            Save
          </Button>
        </div>
      </MainHeader>
      <section
        className={cn(
          'h-full overflow-y-auto transition-opacity',
          loading && 'pointer-events-none opacity-50'
        )}
      >
        <div className='group relative mt-[52px] h-36 xs:h-44 sm:h-48'>
          <input
            className='hidden'
            type='file'
            accept='image/*'
            ref={coverInputFileRef}
            onChange={editImage('cover')}
          />
          {coverPhotoURL ? (
            <NextImage
              useSkeleton
              className='relative h-full'
              imgClassName='object-cover transition group-hover:brightness-75 duration-200 group-focus-within:brightness-75'
              src={coverPhotoURL}
              alt={name}
              layout='fill'
            />
          ) : (
            <div className='h-full bg-light-line-reply dark:bg-dark-line-reply' />
          )}
          <div className='absolute left-1/2 top-1/2 flex -translate-y-1/2 -translate-x-1/2 gap-4'>
            <Button
              className='group/inner relative bg-light-primary/60 p-2 hover:bg-image-preview-hover/50 focus-visible:bg-image-preview-hover/50'
              onClick={handleClick('cover')}
            >
              <HeroIcon
                className='hover-animation h-6 w-6 text-dark-primary group-hover:text-white'
                iconName='CameraIcon'
              />
              <ToolTip groupInner tip='Add photo' />
            </Button>
            {coverPhotoURL && (
              <Button
                className='group/inner relative bg-light-primary/60 p-2 hover:bg-image-preview-hover/50 focus-visible:bg-image-preview-hover/50'
                onClick={removeCoverImage}
              >
                <HeroIcon
                  className='hover-animation h-6 w-6 text-dark-primary group-hover:text-white'
                  iconName='XMarkIcon'
                />
                <ToolTip groupInner tip='Remove photo' />
              </Button>
            )}
          </div>
        </div>
        <div className='relative flex flex-col gap-6 px-4 py-3'>
          <div className='mb-8 xs:mb-12 sm:mb-14'>
            <input
              className='hidden'
              type='file'
              accept='image/*'
              ref={profileInputFileRef}
              onChange={editImage('profile')}
            />
            <div
              className='group absolute aspect-square w-24 -translate-y-1/2 overflow-hidden rounded-full xs:w-32 sm:w-36'
            >
              <NextImage
                useSkeleton
                className='h-full w-full bg-main-background inner:!m-1 inner:rounded-full'
                imgClassName='rounded-full transition group-hover:brightness-75 duration-200 group-focus-within:brightness-75'
                src={photoURL}
                alt={name}
                layout='fill'
              />
              <Button
                className='group/inner absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-light-primary/60 p-2 hover:bg-image-preview-hover/50 focus-visible:bg-image-preview-hover/50'
                onClick={handleClick('profile')}
              >
                <HeroIcon
                  className='hover-animation h-6 w-6 text-dark-primary group-hover:text-white'
                  iconName='CameraIcon'
                />
                <ToolTip groupInner tip='Add photo' />
              </Button>
            </div>
          </div>
          {children}
          <Button
            className='accent-tab -mx-4 mb-4 flex cursor-pointer items-center justify-between rounded-none py-2 hover:bg-light-primary/10 active:bg-light-primary/20'
            onClick={openModal}
          >
            <span className='mx-2 text-xl'>{renderProfileType()}</span>
            <i>
              <HeroIcon
                className='h-6 w-6 text-light-secondary dark:text-dark-secondary'
                iconName='ChevronRightIcon'
              />
            </i>
          </Button>
        </div>
      </section>

      { isModalOpen && (
  <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
    <div className='relative w-[575px] h-[670px] bg-white p-4 rounded-lg shadow-lg'>
      <button
        className='absolute top-2 right-2 text-gray-500 hover:text-gray-700'
        onClick={closeModalInternal}
      >
        <HeroIcon className='h-5 w-5' iconName='XMarkIcon' />
      </button>
      <h2 className='text-lg font-bold mb-4'>Select Profile Types</h2>
      <div className='flex flex-wrap gap-4'>
  {[
    'Blogger', 'Programmer', 'Designer', 'Artist', 'Developer',
    'Writer', 'Photographer', 'Musician', 'Entrepreneur', 'Marketer',
    'Content Creator', 'Social Media Manager', 'Consultant', 'Analyst', 'Engineer',
    'Architect', 'Data Scientist', 'UX/UI Designer', 'Project Manager', 'Sales Representative',
    'Educator', 'Researcher', 'Influencer', 'Business Owner',
    'Health Coach', 'Nutritionist', 'Financial Advisor', 'Recruiter', 'Public Speaker',
  ].map((type) => (
    <Button
      key={type}
      className={cn(
        'px-4 py-2 rounded-full border border-gray-300 text-sm font-semibold transition-colors duration-200',
        selectedTypes.includes(type)
          ? 'bg-blue-500 text-white border-blue-500'
          : 'bg-white text-gray-800 hover:bg-gray-100'
      )}
      onClick={() => handleProfileTypeSelection(type)}
    >
      {type}
    </Button>
  ))}
</div>

      <div className='mt-4'>
      <Button
  className='bg-blue-500 text-white px-4 py-2 rounded-full'
  style={{ borderRadius: '105px' }}
  onClick={handleContinue}
  disabled={selectedTypes.length === 0}
>
  Continue
</Button>

      </div>
    </div>
  </div>
)}


      {isConfirmModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='relative w-500 bg-white p-4 rounded-lg shadow-lg'>
            <button
              className='absolute top-2 right-2 text-gray-500 hover:text-gray-700'
              onClick={handleCancel}
            >
              <HeroIcon className='h-5 w-5' iconName='XMarkIcon' />
            </button>
            <h2 className='text-lg font-bold mb-4'>
              Are you sure you want to continue with these selections?
            </h2>
            <div className='mb-4'>
              <p>Selected types: {selectedTypes.join(', ')}</p>
            </div>
            <div className='flex justify-between'>
              <Button
                className='bg-blue-500 text-white px-4 py-2 rounded'
                onClick={handleConfirm}
              >
                Confirm
              </Button>
              <Button
                className='bg-red-500 text-white px-4 py-2 rounded'
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
