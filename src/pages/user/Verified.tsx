import { useUser } from '@lib/context/user-context';
import { UserLayout, ProtectedLayout } from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import { UserDataLayout } from '@components/layout/user-data-layout';
import { UserHomeLayout } from '@components/layout/user-home-layout';
import type { ReactElement, ReactNode } from 'react';


export default function Verified(): JSX.Element {
  const { user } = useUser();
  const { id, name, username } = user ?? {};

  return (
    <section>
    {/* This code should work soon Only authenticated users will be shown here */}
    </section>
  );
}

Verified.getLayout = (page: ReactElement): ReactNode => (
  <ProtectedLayout>
    <MainLayout>
      <UserLayout>
        <UserDataLayout>
          <UserHomeLayout>{page}</UserHomeLayout>
        </UserDataLayout>
      </UserLayout>
    </MainLayout>
  </ProtectedLayout>
);
