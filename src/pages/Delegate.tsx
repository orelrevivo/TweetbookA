import { MainHeader } from '@components/home/main-header';
import { ReactElement, ReactNode } from 'react';
import { MainLayout } from '@components/layout/main-layout-S';
import { ProtectedLayout } from '@components/layout/common-layout-Settings';

const Delegate = () => {
  return (
    <div className='SettingsUScss'>
      <MainHeader title="Delegate" />
      <ul className='list-none'>
        
      </ul>
    </div>
  );
};

export default Delegate;
// Layout wrapper
Delegate.getLayout = function getLayout(page: ReactElement): ReactNode {
  return (
    <ProtectedLayout>
      <MainLayout>{page}</MainLayout>
    </ProtectedLayout>
  );
};
