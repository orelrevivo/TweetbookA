import { MainHeader } from '@components/home/main-header';
import { useState, ReactElement, ReactNode } from 'react';
import { MainLayout } from '@components/layout/main-layout';
import { ProtectedLayout } from '@components/layout/common-layout-Settings';
import { HeroIcon } from '@components/ui/hero-icon';
import { reauthenticateUser } from '../../lib/context/auth-context'; // Assuming this function is in auth file
import { useRouter } from 'next/router';
import { MainContainer } from '@components/home/main-container-me22';

export default function Login(): JSX.Element {
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleCurrentPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPassword(e.target.value);
  };

  const handleLogin = async () => {
    try {
      // Reauthenticate the user with their current password
      await reauthenticateUser(email, currentPassword);
      
      setSuccess(true);
      setError('');
      // Redirect to the connected accounts page
      router.push('/Settings/connected_accounts');
    } catch (error: any) {
      setError(error.message);
      setSuccess(false);
    }
  };

  return (
    <MainContainer className='gourggrgr_Settings'>
      <div className="flex">
        {/* Search Panel */}
        <div className="borderMessages w-3/5 p-0 border-light-border dark:border-dark-border border-1 xs:border">
          <label className="TweetbookSearch2 group flex items-center justify-between gap-4 rounded-[30px] h-[35px] px-4 py-2 focus-within:ring-2 focus-within:ring-main-accent border-light-border dark:border-dark-border border-1 xs:border">
            <i>
              <HeroIcon
                className="h-5 w-5 text-light-secondary transition-colors group-focus-within:text-main-accent dark:text-dark-secondary"
                iconName="MagnifyingGlassIcon"
              />
            </i>
            <input
              type="text"
              className="peer flex-1 bg-transparent outline-none placeholder:text-light-secondary dark:placeholder:text-dark-secondary"
              placeholder="Search Users"
            />
          </label>
        </div>

        {/* User Login */}
        <div className="w-3/4">
          <MainHeader>
            <h1 className="YourAccount">Verify your password</h1>
            <span className="spanYourAccount2">Re-enter your Tweetbook password to continue.</span>
          </MainHeader>
          <br />

          <label className="inputclassNamepassword group flex items-center justify-between gap-4 rounded-[10px] px-4 py-2 border-light-border dark:border-dark-border border-1 xs:border focus-within:ring-2 focus-within:ring-main-accent" style={{ width: '95%', height: '50px', transform: 'translateX(13px)' }}>
            <HeroIcon
              className="h-5 w-5 text-light-secondary transition-colors group-focus-within:text-main-accent dark:text-dark-secondary"
              iconName="EnvelopeIcon"
            />
            <input
              className="peer flex-1 bg-transparent outline-none placeholder:text-light-secondary dark:placeholder:text-dark-secondary"
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
            />
          </label>

          <label className="inputclassNamepassword group flex items-center justify-between gap-4 rounded-[10px] px-4 py-2 border-light-border dark:border-dark-border border-1 xs:border focus-within:ring-2 focus-within:ring-main-accent" style={{ width: '95%', height: '50px', transform: 'translateX(13px)' }}>
            <HeroIcon
              className="h-5 w-5 text-light-secondary transition-colors group-focus-within:text-main-accent dark:text-dark-secondary"
              iconName="EnvelopeIcon"
            />
            <input
              className="peer flex-1 bg-transparent outline-none placeholder:text-light-secondary dark:placeholder:text-dark-secondary"
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={handleCurrentPasswordChange}
            />
          </label>
            <div className='button2hyeh14'>
            <button
          className="custom-button2hyeh14 custom-button accent-tab hover-card block w-full h-[70px]"
          style={{ borderRadius: '0' }} // Setting border-radius to zero
            onClick={handleLogin}
          >
            <p className='ProfileTEct22'>Next</p>
            <span className='spanYourAccount2'>Continue with your verification</span>
          </button>
          <button
          className="custom-button2hyeh14 custom-button accent-tab hover-card block w-full h-[70px]"
          style={{ borderRadius: '0' }} // Setting border-radius to zero
          onClick={() => window.history.back()}
          >
            <p className='ProfileTEct22'>Cancel</p>
            <span className='spanYourAccount2'>Go back to the previous page</span>
          </button>
            </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>Logged in successfully!</p>}
        </div>
      </div>
    </MainContainer>
  );
}

// Layout wrapper
Login.getLayout = function getLayout(page: ReactElement): ReactNode {
  return (
    <ProtectedLayout>
      <MainLayout>{page}</MainLayout>
    </ProtectedLayout>
  );
};
