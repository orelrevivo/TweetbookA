import React, { useState, useEffect } from 'react';
import { useAuth } from '@lib/context/auth-context';
import { CustomIcon } from '@components/ui/custom-icon';
import { Button } from '@components/ui/button';
import { Anewyear } from './Anewyear'; // Import the Anewyear component
import { HeroIcon } from '@components/ui/hero-icon';

export function LoginMain(): JSX.Element {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [ageVerified, setAgeVerified] = useState(false);

  const openModal = () => {
    setModalOpen(true);
    setShowLoading(true);

    setTimeout(() => {
      setShowLoading(false);
    }, 3000);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleAgeVerification = (dob: string) => {
    setAgeVerified(true);
    setShowAgeModal(false);
    handleRegister(); // Proceed with registration after age verification
  };

  const handleLogin = async () => {
    try {
      await signInWithEmail(email, password);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleRegister = async () => {
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email format');
      return;
    }

    if (password.length < 10) {
      setError('Password must be at least 10 characters');
      return;
    }

    if (!ageVerified) {
      setShowAgeModal(true);
      return;
    }

    try {
      await signUpWithEmail(email, password);
      const profileInitial = name.charAt(0).toUpperCase();
      const profilePicture = generateProfilePicture(profileInitial);
      console.log('Profile Picture:', profilePicture);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('Email is already in use');
      } else {
        setError(error.message);
      }
    }
  };

  const generateProfilePicture = (initial: string) => {
    return (
      <div
        style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          backgroundColor: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: '50px',
        }}
      >
        {initial}
      </div>
    );
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError(''); // Clear error on form toggle
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (modalOpen) {
      setShowLoading(true);
      setTimeout(() => {
        setShowLoading(false);
      }, 3000);
    }
  }, [modalOpen]);

  const styles = {
    inputField: {
      width: '100%',
      padding: '10px',
      border: '1px solid #e1e8ed',
      borderRadius: '4px',
      backgroundColor: '#ffffff',
      fontSize: '16px',
      color: '#14171a',
      boxSizing: 'border-box',
      transition: 'box-shadow 0.2s',
      outline: 'none',
    },
    inputFieldFocus: {
      boxShadow: '0 0 0 2px rgba(29, 161, 242, 0.2)',
    },
    placeholder: {
      color: '#657786',
    },
  };

  return (
    <main className='grid lg:grid-cols-[1fr,45vw]'>
      <div className='relative hidden items-center justify-center lg:flex'></div>

      <div className='flex flex-col items-center justify-between gap-6 p-8 lg:items-start lg:justify-center'>
        <div className='app-Essay-class'>
          <div className='box4'>
            <div className='flex max-w-xs flex-col gap-4 font-twitter-chirp-extended lg:max-w-none lg:gap-6'></div>

            <div className='flex max-w-xs flex-col gap-6 [&_button]:py-2'>
              <div className='grid gap-3 font-bold'>
                <Button
                  className='flex justify-center gap-2 border border-light-line-reply font-bold text-light-primary transition
                  active:bg-[#cccccc] dark:border-0 bg-main-background
                  dark:hover:brightness-90 dark:focus-visible:brightness-90 dark:active:brightness-75'
                  onClick={signInWithGoogle}
                >
                  <CustomIcon iconName='GoogleIcon' /> Sign up with Google
                </Button>
                <br />
                <div className='relative hidden items-center justify-center lg:flex'>
                  <i className='absolute cursor-pointer' onClick={openModal}>
                    <div>
                      <h1>
                        <Button
                          className='flex justify-center gap-2 border border-light-line-reply font-bold text-light-primary transition
                            active:bg-[#cccccc] dark:border-0 bg-main-background
                          dark:hover:brightness-90 dark:focus-visible:brightness-90 dark:active:brightness-75'
                          style={{ width: '270px' }}
                        >
                          Create an account with an email
                        </Button>
                      </h1>
                      <br />
                    </div>
                  </i>
                </div>
                <div className='grid w-full grid-cols-[1fr,auto,1fr] items-center gap-2'>
                  <i className='border-b border-light-border dark:border-dark-border' />
                  <p>or</p>
                  <i className='border-b border-light-border dark:border-dark-border' />
                </div>
              </div>

              <div className='flex flex-col gap-3'>
                <p className='font-bold'>Already have an account? </p>
                <Button
                  className='border border-light-line-reply font-bold text-accent-blue hover:bg-accent-blue/10
                  focus-visible:bg-accent-blue/10 focus-visible:!ring-accent-blue/80 active:bg-accent-blue/20
                  dark:border-light-secondary'
                  onClick={signInWithGoogle}
                >
                  Sign in
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg" style={{ width: '500px', height: '500px', overflow: 'hidden' }}>
            <div className='flex flex-col gap-3 h-full'>
              {showAgeModal ? (
                <Anewyear
                  onVerifyAge={handleAgeVerification}
                  onClose={() => setShowAgeModal(false)}
                />
              ) : (
                <>
                  {isLogin ? (
                    <div>
                                             <label
                  className='inputclassNamepassword group flex items-center justify-between gap-4 rounded-[10px]
                             bg-main-search-background px-4 py-2 transition bg-main-sidebar-background
                             focus-within:ring-2 focus-within:ring-main-accent'
                  style={{ width: '95%', height: '50px' , transform: 'translateX(13px)' }}
                >
                      <input
                        type='email'
                        placeholder='Email'
                        value={email}
                        onChange={handleEmailChange}
                      className='peer flex-1 bg-transparent outline-none 
               placeholder:text-light-secondary dark:placeholder:text-dark-secondary'
                      />
                       </label>
                      <div className='relative'>
                      <label
                  className='inputclassNamepassword group flex items-center justify-between gap-4 rounded-[10px]
                             bg-main-search-background px-4 py-2 transition bg-main-sidebar-background
                             focus-within:ring-2 focus-within:ring-main-accent'
                  style={{ width: '95%', height: '50px' , transform: 'translateX(13px)' }}
                >

                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder='Password'
                          value={password}
                          onChange={handlePasswordChange}
                      className='peer flex-1 bg-transparent outline-none 
               placeholder:text-light-secondary dark:placeholder:text-dark-secondary'
                        />
                               </label>
                        <button
                          type='button'
                          onClick={togglePasswordVisibility}
                          className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500'
                        >
                          show
                        </button>
                      </div>
                      <Button
                        className='border border-light-line-reply font-bold text-accent-blue hover:bg-accent-blue/10
                        focus-visible:bg-accent-blue/10 focus-visible:!ring-accent-blue/80 active:bg-accent-blue/20
                        dark:border-light-secondary'
                        onClick={handleLogin}
                      >
                        Sign In
                      </Button>
                      <Button
                        className='border border-light-line-reply font-bold text-accent-blue hover:bg-accent-blue/10
                        focus-visible:bg-accent-blue/10 focus-visible:!ring-accent-blue/80 active:bg-accent-blue/20
                        dark:border-light-secondary'
                        onClick={toggleForm}
                      >
                        Create an account
                      </Button>
                    </div>
                  ) : (
                    <div>
                       <label
                  className='inputclassNamepassword group flex items-center justify-between gap-4 rounded-[10px]
                             bg-main-search-background px-4 py-2 transition bg-main-sidebar-background
                             focus-within:ring-2 focus-within:ring-main-accent'
                  style={{ width: '95%', height: '50px' , transform: 'translateX(13px)' }}
                >
                      <input
                        type='text'
                        placeholder='Name'
                        value={name}
                        onChange={handleNameChange}
                        className='peer flex-1 bg-transparent outline-none 
               placeholder:text-light-secondary dark:placeholder:text-dark-secondary'
                      />
                        </label>
                        <label
                  className='inputclassNamepassword group flex items-center justify-between gap-4 rounded-[10px]
                             bg-main-search-background px-4 py-2 transition bg-main-sidebar-background
                             focus-within:ring-2 focus-within:ring-main-accent'
                  style={{ width: '95%', height: '50px' , transform: 'translateX(13px)' }}
                >
                      <input
                        type='email'
                        placeholder='Email'
                        value={email}
                        onChange={handleEmailChange}
                        className='peer flex-1 bg-transparent outline-none 
               placeholder:text-light-secondary dark:placeholder:text-dark-secondary'
                      />
                        </label>
                      <div className='relative'>
                      <label
                  className='inputclassNamepassword group flex items-center justify-between gap-4 rounded-[10px]
                             bg-main-search-background px-4 py-2 transition bg-main-sidebar-background
                             focus-within:ring-2 focus-within:ring-main-accent'
                  style={{ width: '95%', height: '50px' , transform: 'translateX(13px)' }}
                >
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder='Password'
                          value={password}
                          onChange={handlePasswordChange}
                        className='peer flex-1 bg-transparent outline-none 
               placeholder:text-light-secondary dark:placeholder:text-dark-secondary'
                        />
                        </label>
                        <button
                          type='button'
                          onClick={togglePasswordVisibility}
                          className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500'
                        >
                          show
                        </button>
                      </div>
                      <Button
                        className='border border-light-line-reply font-bold text-accent-blue hover:bg-accent-blue/10
                        focus-visible:bg-accent-blue/10 focus-visible:!ring-accent-blue/80 active:bg-accent-blue/20
                        dark:border-light-secondary'
                        onClick={handleRegister}
                      >
                        Register
                      </Button>
                      <Button
                        className='border border-light-line-reply font-bold text-accent-blue hover:bg-accent-blue/10
                        focus-visible:bg-accent-blue/10 focus-visible:!ring-accent-blue/80 active:bg-accent-blue/20
                        dark:border-light-secondary'
                        onClick={toggleForm}
                      >
                        Go back to login
                      </Button>
                    </div>
                  )}
                  <div className='mt-4'>
                    {error && <p className='text-red-500'>{error}</p>}
                  </div>
                  <div className='mt-4'>
                    {showLoading && <p>Loading...</p>}
                  </div>
                </>
              )}
              <Button
                className='border border-light-line-reply font-bold text-accent-blue hover:bg-accent-blue/10
                focus-visible:bg-accent-blue/10 focus-visible:!ring-accent-blue/80 active:bg-accent-blue/20
                dark:border-light-secondary'
                onClick={closeModal}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}



// import { useAuth } from '@lib/context/auth-context';
// import { NextImage } from '@components/ui/next-image';
// import { CustomIcon } from '@components/ui/custom-icon';
// import { Button } from '@components/ui/button';

// export function LoginMain(): JSX.Element {
//   const { signInWithGoogle } = useAuth();

//   return (
//     <main className='grid lg:grid-cols-[1fr,45vw]'>
//       <div className='relative hidden items-center justify-center  lg:flex'>
//         <NextImage
//           imgClassName='object-cover'
//           blurClassName='bg-accent-blue'
//           src='/assets/twitter-banner.png'
//           alt='Twitter banner'
//           layout='fill'
//           useSkeleton
//         />
//         <i className='absolute'>
//           <CustomIcon className='h-96 w-96 text-white' iconName='TwitterIcon' />
//         </i>
//       </div>
//       <div className='flex flex-col items-center justify-between gap-6 p-8 lg:items-start lg:justify-center'>
//         <i className='mb-0 self-center lg:mb-10 lg:self-auto'>
//           <CustomIcon
//             className='-mt-4 h-6 w-6 text-accent-blue lg:h-12 lg:w-12 dark:lg:text-twitter-icon'
//             iconName='TwitterIcon'
//           />
//         </i>
//         <div className='flex max-w-xs flex-col gap-4 font-twitter-chirp-extended lg:max-w-none lg:gap-16'>
//           <h1
//             className='text-3xl before:content-["See_what’s_happening_in_the_world_right_now."] 
//                        lg:text-6xl lg:before:content-["Happening_now"]'
//           />
//           <h2 className='hidden text-xl lg:block lg:text-3xl'>
//             Join Twitter today.
//           </h2>
//         </div>
//         <div className='flex max-w-xs flex-col gap-6 [&_button]:py-2'>
//           <div className='grid gap-3 font-bold'>
//             <Button
//               className='flex justify-center gap-2 border border-light-line-reply font-bold text-light-primary transition
//                          hover:bg-[#e6e6e6] focus-visible:bg-[#e6e6e6] active:bg-[#cccccc] dark:border-0 dark:bg-white
//                          dark:hover:brightness-90 dark:focus-visible:brightness-90 dark:active:brightness-75'
//               onClick={signInWithGoogle}
//             >
//               <CustomIcon iconName='GoogleIcon' /> Sign up with Google
//             </Button>
//             <Button
//               className='flex cursor-not-allowed justify-center gap-2 border border-light-line-reply font-bold text-light-primary
//                          transition hover:bg-[#e6e6e6] focus-visible:bg-[#e6e6e6] active:bg-[#cccccc] dark:border-0
//                          dark:bg-white dark:hover:brightness-90 dark:focus-visible:brightness-90 dark:active:brightness-75'
//             >
//               <CustomIcon iconName='AppleIcon' /> Sign up with Apple
//             </Button>
//             <div className='grid w-full grid-cols-[1fr,auto,1fr] items-center gap-2'>
//               <i className='border-b border-light-border dark:border-dark-border' />
//               <p>or</p>
//               <i className='border-b border-light-border dark:border-dark-border' />
//             </div>
//             <Button
//               className='cursor-not-allowed bg-accent-blue text-white transition hover:brightness-90
//                          focus-visible:!ring-accent-blue/80 focus-visible:brightness-90 active:brightness-75'
//             >
//               Sign up with phone or email
//             </Button>
//             <p
//               className='inner:custom-underline inner:custom-underline text-center text-xs
//                          text-light-secondary inner:text-accent-blue dark:text-dark-secondary'
//             >
//               By signing up, you agree to the{' '}
//               <a
//                 href='https://twitter.com/tos'
//                 target='_blank'
//                 rel='noreferrer'
//               >
//                 Terms of Service
//               </a>{' '}
//               and{' '}
//               <a
//                 href='https://twitter.com/privacy'
//                 target='_blank'
//                 rel='noreferrer'
//               >
//                 Privacy Policy
//               </a>
//               , including{' '}
//               <a
//                 href='https://help.twitter.com/rules-and-policies/twitter-cookies'
//                 target='_blank'
//                 rel='noreferrer'
//               >
//                 Cookie Use
//               </a>
//               .
//             </p>
//           </div>
//           <div className='flex flex-col gap-3'>
//             <p className='font-bold'>Already have an account? </p>
//             <Button
//               className='border border-light-line-reply font-bold text-accent-blue hover:bg-accent-blue/10
//                          focus-visible:bg-accent-blue/10 focus-visible:!ring-accent-blue/80 active:bg-accent-blue/20
//                          dark:border-light-secondary'
//               onClick={signInWithGoogle}
//             >
//               Sign in
//             </Button>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }
