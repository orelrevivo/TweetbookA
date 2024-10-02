import { MainHeader } from '@components/home/main-header';
import { ReactElement, ReactNode } from 'react';
import { MainLayout } from '@components/layout/main-layout-SettingsY';
import { ProtectedLayout } from '@components/layout/common-layout-Settings';

const Accountinformation = () => {
  return (
    <div className='SettingsUScss'>
      <MainHeader title="Account information" />
        
      <ul className="list-none">
      </ul>
    </div>
  );
};

// Make sure to properly export YourAccount as default
export default Accountinformation;

// Layout wrapper
Accountinformation.getLayout = function getLayout(page: ReactElement): ReactNode {
  return (
    <ProtectedLayout>
      <MainLayout>{page}</MainLayout>
    </ProtectedLayout>
  );
};
