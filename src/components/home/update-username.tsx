/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { checkUsernameAvailability, updateUsername } from '@lib/firebase/utils';
import { useAuth } from '@lib/context/auth-context';
import { useModal } from '@lib/hooks/useModal';
import { isValidUsername } from '@lib/validation';
import { sleep } from '@lib/utils';
import { Button } from '@components/ui/button';
import { HeroIcon } from '@components/ui/hero-icon';
import { ToolTip } from '@components/ui/tooltip';
import { Modal } from '@components/modal/modal';
import { UsernameModal } from '@components/modal/username-modal';
import { InputField } from '@components/input/input-field';
import type { FormEvent, ChangeEvent } from 'react';

export function UpdateUsername(): JSX.Element {
  const [alreadySet, setAlreadySet] = useState(false);
  const [available, setAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visited, setVisited] = useState(false);
  const [searching, setSearching] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);

  const { user } = useAuth();
  const { open, openModal, closeModal } = useModal();

  useEffect(() => {
    const checkAvailability = async (value: string): Promise<void> => {
      setSearching(true);

      const empty = await checkUsernameAvailability(value);

      if (empty) setAvailable(true);
      else {
        setAvailable(false);
        setErrorMessage('This username has been taken. Please choose another.');
      }

      setSearching(false);
    };

    if (!visited && inputValue.length > 0) setVisited(true);

    if (visited) {
      if (errorMessage) setErrorMessage('');

      const error = isValidUsername(user?.username as string, inputValue);

      if (error) {
        setAvailable(false);
        setErrorMessage(error);
      } else void checkAvailability(inputValue);
    }
  }, [inputValue]);

  useEffect(() => {
    if (!user?.updatedAt) openModal();
    else setAlreadySet(true);
  }, []);

  const changeUsername = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!available) return;

    if (searching) return;

    setLoading(true);

    await sleep(500);

    await updateUsername(user?.id as string, inputValue);

    closeModalHandler();

    setLoading(false);

    setInputValue('');
    setVisited(false);
    setAvailable(false);

    toast.success('Username updated successfully');
  };

  const openModalHandler = (): void => {
    setOriginalUrl(window.location.href); // Save the current URL
    openModal();
    window.history.pushState(null, '', '/'); // Update URL without reloading
  };

  const closeModalHandler = (): void => {
    closeModal();
    if (originalUrl) {
      window.history.pushState(null, '', originalUrl); // Restore original URL when modal closes
    }
  };

  const handleChange = ({
    target: { value }
  }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void =>
    setInputValue(value);

  return (
    <>
      <Modal
        modalClassName='flex flex-col gap-6 max-w-xl bg-main-background w-full p-8 rounded-2xl h-[576px]'
        open={open}
        closeModal={closeModalHandler}
      >
        <UsernameModal
          loading={loading}
          available={available}
          alreadySet={alreadySet}
          changeUsername={changeUsername}
          cancelUpdateUsername={closeModalHandler}
        >
          <InputField
            label='Username'
            inputId='username'
            inputValue={inputValue}
            errorMessage={errorMessage}
            handleChange={handleChange}
          />
        </UsernameModal>
      </Modal>
      <Button
        className="custom-button2hyeh14 custom-button accent-tab hover-card block w-full h-[70px]"
        style={{ borderRadius: '0' }} // Setting border-radius to zero
        onClick={openModalHandler}
      >
        <span className='ProfileTEct22'>Change your username</span>
        <span className='spanYourAccount2'>Update your username for better privacy, security, and identity.</span>
        <svg
          className='svgclassName'
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{
            width: '20px',
            height: '20px',
            fill: 'rgb(15, 20, 25)',
            marginRight: '10px', // Adds space between icon and text
          }}
        >
          <g>
            <g>
              <path d="M16 6c0 2.21-1.79 4-4 4S8 8.21 8 6s1.79-4 4-4 4 1.79 4 4zm-.76 8.57l-3.95.58 2.86 2.78-.68 3.92L17 20l3.53 1.85-.68-3.92 2.86-2.78-3.95-.58L17 11l-1.76 3.57zm-.45-3.09c-.89-.32-1.86-.48-2.89-.48-2.35 0-4.37.85-5.86 2.44-1.48 1.57-2.36 3.8-2.63 6.46l-.11 1.09h8.58l.52-2.49-4.05-4.3 5.59-.99.85-1.73z"></path>
            </g>
          </g>
        </svg>
      </Button>
    </>
  );
}
