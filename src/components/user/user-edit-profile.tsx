import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import cn from 'clsx';
import { useUser } from '@lib/context/user-context';
import { useModal } from '@lib/hooks/useModal';
import { updateUserData, uploadImages } from '@lib/firebase/utils';
import { sleep } from '@lib/utils';
import { getImagesData } from '@lib/validation';
import { Modal } from '@components/modal/modal';
import { EditProfileModal } from '@components/modal/edit-profile-modal';
import { Button } from '@components/ui/button';
import { InputField } from '@components/input/input-field';
import type { ChangeEvent, KeyboardEvent } from 'react';
import type { FilesWithId } from '@lib/types/file';
import type { User, EditableData, EditableUserData } from '@lib/types/user';
import type { InputFieldProps } from '@components/input/input-field';
import { ToolTip } from '@components/ui/tooltip';
import { HeroIcon } from '@components/ui/hero-icon';

import { UserName } from './user-name';

type RequiredInputFieldProps = Omit<InputFieldProps, 'handleChange'> & {
  inputId: EditableData;
};

type UserImages = Record<
  Extract<EditableData, 'photoURL' | 'coverPhotoURL'>,
  FilesWithId
>;

type TrimmedTexts = Pick<
  EditableUserData,
  Exclude<EditableData, 'photoURL' | 'coverPhotoURL'>
>;

type UserEditProfileProps = {
  hide?: boolean;
};

export function UserEditProfile({ hide }: UserEditProfileProps): JSX.Element {
  const { user } = useUser();
  const { open: editProfileOpen, openModal: openEditProfileModal, closeModal: closeEditProfileModal } = useModal();
  const { open: emailModalOpen, openModal: openEmailModal, closeModal: closeEmailModal } = useModal();
  const { open: Notifications, openModal: openNotificationsModal, closeModal: closeENotificationsModal } = useModal();
  const { open: paymententry, openModal: openpaymententryModal, closeModal: closeEpaymententryModal } = useModal();
  const { open: paymententry2, openModal: openpaymententry2Modal, closeModal: closeEpaymententry2Modal } = useModal();
  const [selectedPlan, setSelectedPlan] = useState('Basic');

  const plans = {
    Basic: 'Content for Basic plan',
    Premium: 'Content for Premium plan',
    Plus: 'Content for Plus plan',
  };
  const [loading, setLoading] = useState(false);

  const { bio, name, website, location, photoURL, coverPhotoURL } = user as User;

  const [editUserData, setEditUserData] = useState<EditableUserData>({
    bio,
    name,
    website,
    photoURL,
    location,
    coverPhotoURL
  });

  const [userImages, setUserImages] = useState<UserImages>({
    photoURL: [],
    coverPhotoURL: []
  });

  const [emails, setEmails] = useState<string[]>([]); // Array to hold user emails
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null); // Currently selected email
  const [messages, setMessages] = useState<{ email: string; message: string }[]>([]); // Messages for selected email

  const [notificationIcon, setNotificationIcon] = useState('BellIcon'); // State to manage notification icon

  useEffect(() => cleanImage, []);

  const inputNameError = !editUserData.name?.trim()
    ? "Name can't be blank"
    : '';

  const updateData = async (): Promise<void> => {
    setLoading(true);

    const userId = user?.id as string;

    const { photoURL, coverPhotoURL: coverURL } = userImages;

    const [newPhotoURL, newCoverPhotoURL] = await Promise.all(
      [photoURL, coverURL].map((image) => uploadImages(userId, image))
    );

    const newImages: Partial<Pick<User, 'photoURL' | 'coverPhotoURL'>> = {
      coverPhotoURL:
        coverPhotoURL === editUserData.coverPhotoURL
          ? coverPhotoURL
          : newCoverPhotoURL?.[0].src ?? null,
      ...(newPhotoURL && { photoURL: newPhotoURL[0].src })
    };

    const trimmedKeys: Readonly<EditableData[]> = [
      'name',
      'bio',
      'location',
      'website'
    ];

    const trimmedTexts = trimmedKeys.reduce(
      (acc, curr) => ({ ...acc, [curr]: editUserData[curr]?.trim() ?? null }),
      {} as TrimmedTexts
    );

    const newUserData: Readonly<EditableUserData> = {
      ...editUserData,
      ...trimmedTexts,
      ...newImages
    };

    await sleep(500);

    await updateUserData(userId, newUserData);

    closeEditProfileModal();

    cleanImage();

    setLoading(false);
    setEditUserData(newUserData);

    toast.success('Profile updated successfully');
  };

  const editImage =
    (type: 'cover' | 'profile') =>
    ({ target: { files } }: ChangeEvent<HTMLInputElement>): void => {
      const imagesData = getImagesData(files);

      if (!imagesData) {
        toast.error('Please choose a valid GIF or Photo');
        return;
      }

      const { imagesPreviewData, selectedImagesData } = imagesData;

      const targetKey = type === 'cover' ? 'coverPhotoURL' : 'photoURL';
      const newImage = imagesPreviewData[0].src;

      setEditUserData({
        ...editUserData,
        [targetKey]: newImage
      });

      setUserImages({
        ...userImages,
        [targetKey]: selectedImagesData
      });
    };

  const removeCoverImage = (): void => {
    setEditUserData({
      ...editUserData,
      coverPhotoURL: null
    });

    setUserImages({
      ...userImages,
      coverPhotoURL: []
    });

    URL.revokeObjectURL(editUserData.coverPhotoURL ?? '');
  };

  const cleanImage = (): void => {
    const imagesKey: Readonly<Partial<EditableData>[]> = [
      'photoURL',
      'coverPhotoURL'
    ];

    imagesKey.forEach((image) =>
      URL.revokeObjectURL(editUserData[image] ?? '')
    );

    setUserImages({
      photoURL: [],
      coverPhotoURL: []
    });
  };

  const resetUserEditData = (): void =>
    setEditUserData({
      bio,
      name,
      website,
      photoURL,
      location,
      coverPhotoURL
    });

  const handleChange =
    (key: EditableData) =>
    ({
      target: { value }
    }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setEditUserData({ ...editUserData, [key]: value });

  const handleKeyboardShortcut = ({
    key,
    target,
    ctrlKey
  }: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    if (ctrlKey && key === 'Enter' && !inputNameError) {
      target.blur();
      void updateData();
    }
  };

  const inputFields: Readonly<RequiredInputFieldProps[]> = [
    {
      label: 'Name',
      inputId: 'name',
      inputValue: editUserData.name,
      inputLimit: 50,
      errorMessage: inputNameError
    },
    {
      label: 'Bio',
      inputId: 'bio',
      inputValue: editUserData.bio,
      inputLimit: 160,
      useTextArea: true
    },
    {
      label: 'Location',
      inputId: 'location',
      inputValue: editUserData.location,
      inputLimit: 30
    },
    {
      label: 'Website',
      inputId: 'website',
      inputValue: editUserData.website,
      inputLimit: 100
    }
  ];
// Define your function here
const handleButtonClick = () => {
  // Your logic to handle the button click
  // For example, updating some state or saving data
  console.log('Button clicked, and state should be saved or action performed.');
};

  return (
    <form className={cn(hide && 'hidden md:block')}>
      <Modal
        modalClassName='relative bg-main-background rounded-2xl max-w-xl w-full h-[672px] overflow-hidden'
        open={editProfileOpen}
        closeModal={closeEditProfileModal}
      >
        <EditProfileModal
          name={name}
          loading={loading}
          photoURL={editUserData.photoURL}
          coverPhotoURL={editUserData.coverPhotoURL}
          inputNameError={inputNameError}
          editImage={editImage}
          closeModal={closeEditProfileModal}
          updateData={updateData}
          removeCoverImage={removeCoverImage}
          resetUserEditData={resetUserEditData}
        >
          {inputFields.map((inputData) => (
            <InputField
              {...inputData}
              handleChange={handleChange(inputData.inputId)}
              handleKeyboardShortcut={handleKeyboardShortcut}
              key={inputData.inputId}
            />
          ))}
        </EditProfileModal>
      </Modal>
      <Modal
        modalClassName='relative bg-main-background rounded-2xl max-w-xl w-full h-[672px] overflow-hidden'
        open={emailModalOpen}
        closeModal={closeEmailModal}
      >
        <div className='flex'>
          <div className='w-1/2 p-4'>
            <h2 className='text-lg font-bold'>Users</h2>
            <ul className='list-disc pl-5'>
              {emails.map(email => (
                <li
                  key={email}
                  className='cursor-pointer hover:bg-gray-200 p-2'
                  onClick={() => {
                    setSelectedEmail(email);
                    // Fetch messages for the selected email
                    setMessages([{ email, message: 'Sample message' }]); // Replace with actual fetch logic
                  }}
                >
                  {email}
                </li>
              ))}
            </ul>
          </div>
          <div className='w-1/2 p-4'>
            {selectedEmail ? (
              <>
                <h2 className='text-lg font-bold'>Messages for {selectedEmail}</h2>
                <ul className='list-disc pl-5'>
                  {messages
                    .filter(message => message.email === selectedEmail)
                    .map((message, index) => (
                      <li key={index} className='p-2'>
                        {message.message}
                      </li>
                    ))}
                </ul>
              </>
            ) : (
              <p className='text-gray-600'>Select a user to view messages</p>
            )}
          </div>
        </div>
      </Modal>
      <Modal
        modalClassName='relative bg-main-background rounded-2xl max-w-xl w-full h-[672px] overflow-hidden'
        open={Notifications}
        closeModal={closeENotificationsModal}
      >
        <div className='flex flex-col h-full p-4'>
          <h2 className='text-lg font-bold mb-4'>Notifications</h2>
          {/* Notification content goes here */}
          <div className='flex items-center justify-between p-4 border-b'>
            <p>New notification received!</p>
            <button
        className='ml-4'
        onClick={() => {
          // Existing command
          setNotificationIcon('CheckIcon');

          // Additional save action or function call
          handleButtonClick(); // Call the defined function
        }}
      >
        <HeroIcon
          className='h-6 w-6 text-blue-500'
          iconName={notificationIcon}
        />
      </button>
          </div>
        </div>
      </Modal>
      <Modal
        modalClassName='relative bg-main-background rounded-2xl max-w-xl w-full h-[672px] overflow-hidden'
        open={paymententry}
        closeModal={closeEpaymententryModal}
      >
        <div className='flex flex-col h-full p-4'>
          <p className='Message-button3234'>  Do you want to register as a club member for the channel? 
            <br />
            <UserName
          className='-mb-1 text-xl'
          name={name}
          iconClassName='w-6 h-6'
         
        /></p>
        <Button
 className='Message-button323 dark-bg-tab group relative cursor-pointer border border-light-line-reply p-2
 hover:bg-light-primary/10 active:bg-light-primary/20 dark:border-light-secondary
 dark:hover:bg-dark-primary/10 dark:active:bg-dark-primary/20'
 style={{ marginLeft: '0px', marginTop: '4px' }}
 onClick={() => openpaymententry2Modal()}
>
<p className='Message-button3234'>Entering the group</p>
 <ToolTip tip='Entering the group' />
</Button>
        </div>
      </Modal>


      <Modal
      modalClassName='relative bg-main-background rounded-2xl max-w-xl w-full h-[672px] overflow-hidden'
      open={paymententry2}
      closeModal={closeEpaymententry2Modal}
    >
      <div className='flex h-full w-[538px]'>
        <div className='w-4/6 p-10 border-r'>
          <button
            className='BasicPremiumPlusButton'
            onClick={() => setSelectedPlan('Basic')}
          >
            club member
          </button>
          <button
            className='BasicPremiumPlusButton'
            onClick={() => setSelectedPlan('Premium')}
          >
           amazing member
          </button>
          <button
            className='BasicPremiumPlusButton'
            onClick={() => setSelectedPlan('Plus')}
          >
           Cool club member
          </button>
        </div>
        <div className='w-3/4 p-4'>
          <div>
            <h2 className='text-lg font-bold'>{selectedPlan} Plan</h2>
            <p>{plans[selectedPlan]}</p>
          </div>
        </div>
      </div>
    </Modal>
 {/* <Button
 className='Message-button32 dark-bg-tab group relative cursor-pointer border border-light-line-reply p-2
 hover:bg-light-primary/10 active:bg-light-primary/20 dark:border-light-secondary
 dark:hover:bg-dark-primary/10 dark:active:bg-dark-primary/20'
 style={{ marginLeft: '0px', marginTop: '4px' }}
 onClick={() => openEmailModal()}
>
 <HeroIcon className='h-5 w-5' iconName='EnvelopeIcon' />
 <ToolTip tip='Message' />
</Button> */}
 <Button
 className='Message-button32 dark-bg-tab self-start border border-light-line-reply px-4 py-1.5 font-bold
 hover:bg-light-primary/10 active:bg-light-primary/20 dark:border-light-secondary
 dark:hover:bg-dark-primary/10 dark:active:bg-dark-primary/20'
 onClick={() => openEditProfileModal()}
 >
  <span className='Settingsprofile'>Settings profile</span>
 </Button>

    </form>
  );
}
