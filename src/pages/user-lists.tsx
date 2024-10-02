// pages/user-networks.tsx
import { useEffect } from 'react';
import { useAuth } from '@lib/context/auth-context';
import { HomeLayout, ProtectedLayout } from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import { SEO } from '@components/common/seo';
import { MainHeader } from '@components/home/main-header';
import { MainContainer } from '@components/home/main-container';
import { Button } from '@components/ui/button';
import { useRouter } from 'next/router';
import type { ReactElement, ReactNode } from 'react';

export default function UserNetworks(): JSX.Element {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/'); // Redirect to home or login if no user
    }
  }, [user, router]);

  return (
    <MainContainer>
      <SEO title="User Networks / Tweetbook" />
      <div className="flex-1 ml-4 md:ml-0">
        <MainHeader className="flex items-center justify-between">
          <div className="-mb-1 flex flex-col">
            <h2 className="-mt-1 text-xl font-bold">User Networks</h2>
            <p className="text-xs text-light-secondary dark:text-dark-secondary">Your profile details</p>
          </div>
        </MainHeader>
        <div className="flex flex-col items-center mt-6">
          {user ? (
            <div className="profile-details border border-gray-300 rounded-lg p-4">
              <h3 className="text-lg font-bold">Profile</h3>
              <img src={user.photoURL || '/default-avatar.png'} alt="User Avatar" className="w-32 h-32 object-cover rounded-full" />
              <p className="text-lg font-bold mt-2">{user?.username}</p>
              {/* <p className="text-sm text-gray-600">{user.email}</p> */}
              {/* Additional user details can be added here */}
            </div>
          ) : (
            <p className="text-red-500">User not found.</p>
          )}
        </div>
      </div>
    </MainContainer>
  );
}

UserNetworks.getLayout = function getLayout(page: ReactElement): ReactNode {
  return (
    <ProtectedLayout>

        <MainLayout>{page}</MainLayout>
     
    </ProtectedLayout>
  );
};
