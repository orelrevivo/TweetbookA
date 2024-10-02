import { useState, useEffect, ReactElement, ReactNode } from 'react';
import { UserAvatar } from '@components/user/user-avatar';
import { UserName } from '@components/user/user-name';
import { InputThemeRadio } from '@components/input/input-theme-radio';
import { Button } from '@components/ui/button';
import { InputAccentRadio } from '@components/input/input-accent-radio';
import type { Theme, Accent } from '@lib/types/theme';
import { HomeLayout, ProtectedLayout } from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
type DisplayModalProps = {
  closeModal: () => void;
};

const themes: Readonly<[Theme, string][]> = [
  ['light', 'Default'],
  ['dark', 'Lights out'],
  ['dim', 'Dim']
];

const accentsColor: Readonly<Accent[]> = [
  'blue',
  'yellow',
  'pink',
  'purple',
  'orange',
  'green'
];

export function DisplayModal({ closeModal }: DisplayModalProps): JSX.Element {
  return (
    <div className='csacacvasvasf212 flex flex-col items-center gap-6 border-x-0 border-light-border dark:border-dark-border xs:border-x'>
      <div className='flex flex-col gap-3 text-center'>
        <h2 className='text-2xl font-bold'>Customize your view</h2>
        <p className='text-light-secondary dark:text-dark-secondary'>
          These settings affect all the Tweetbook accounts on this browser.
        </p>
      </div>
      <article
        className='hover-animation mx-8 rounded-2xl border 
                   border-light-border px-4 py-3 dark:border-dark-border'
      >
        <div className='grid grid-cols-[auto,1fr] gap-3'>
          <UserAvatar src='/brunch.png' alt='Tweetbook' />
          <div>
            <div className='flex gap-1'>
              <UserName verified name='Tweetbook' />
              <p className='text-light-secondary dark:text-dark-secondary'>
                @tweetbook
              </p>
              <div className='flex gap-1 text-light-secondary dark:text-dark-secondary'>
                <i>·</i>
                <p>No invited</p>
              </div>
            </div>
            <p className='whitespace-pre-line break-words'>
              At the heart of Tweetbook are short messages called Tweets — just
              like this one — which can include photos, videos, links, text,
              hashtags, and mentions like{' '}
              <span className='text-main-accent'>@tweetbook</span>.
            </p>
          </div>
        </div>
      </article>
      <div className='csacacvasvasf2123 flex w-full flex-col gap-1'>
        <p className='text-sm font-bold text-light-secondary dark:text-dark-secondary'>
          Color
        </p>
        <div
          className='hover-animation grid grid-cols-3 grid-rows-2 justify-items-center gap-3 
                     rounded-2xl bg-main-sidebar-background py-3 xs:grid-cols-6 xs:grid-rows-none'
        >
          {accentsColor.map((accentColor) => (
            <InputAccentRadio type={accentColor} key={accentColor} />
          ))}
        </div>
      </div>
      <div className='csacacvasvasf2123 flex w-full flex-col gap-1'>
        <p className='text-sm font-bold text-light-secondary dark:text-dark-secondary'>
          Background
        </p>
        <div
          className='hover-animation grid grid-rows-3 gap-3 rounded-2xl bg-main-sidebar-background
                     px-4 py-3 xs:grid-cols-3 xs:grid-rows-none'
        >
          {themes.map(([themeType, label]) => (
            <InputThemeRadio type={themeType} label={label} key={themeType} />
          ))}
        </div>
      </div>
    </div>
  );
}


// DisplayModal.getLayout = function getLayout(page: ReactElement): ReactNode {
//   return (
//     <ProtectedLayout>
//       <MainLayout>{page}</MainLayout>
//     </ProtectedLayout>
//   );
// };
// Exporting DisplayModal as the default export
export default DisplayModal;
