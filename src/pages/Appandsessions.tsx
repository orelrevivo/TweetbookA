import { MainHeader } from '@components/home/main-header';
import { ReactElement, ReactNode } from 'react';
import { MainLayout } from '@components/layout/main-layout-S';
import { ProtectedLayout } from '@components/layout/common-layout-Settings';

const Appandsessions = () => {
  return (
    <div className='SettingsUScss'>
      <MainHeader title="Appandsessions" />
      <ul className='list-none'>
        
      </ul>
    </div>
  );
};

export default Appandsessions;
// Layout wrapper
Appandsessions.getLayout = function getLayout(page: ReactElement): ReactNode {
  return (
    <ProtectedLayout>
      <MainLayout>{page}</MainLayout>
    </ProtectedLayout>
  );
};
