import '@styles/globals.scss';

import { AuthContextProvider } from '@lib/context/auth-context';
import { ThemeContextProvider } from '@lib/context/theme-context';
import { WindowContextProvider } from '@lib/context/window-context'; // Import WindowContextProvider
import { UserContextProvider } from '@lib/context/user-context'; // Import UserContextProvider
import { AppHead } from '@components/common/app-head';
import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({
  Component,
  pageProps
}: AppPropsWithLayout): ReactNode {
  const getLayout = Component.getLayout ?? ((page): ReactNode => page);

  return (
    <>
      <AppHead />
      <AuthContextProvider>
        <ThemeContextProvider>
          <WindowContextProvider> {/* Wrap with WindowContextProvider */}
            <UserContextProvider value={{ user: null, loading: true }}> {/* Wrap with UserContextProvider */}
              {getLayout(<Component {...pageProps} />)}
            </UserContextProvider>
          </WindowContextProvider>
        </ThemeContextProvider>
      </AuthContextProvider>
    </>
  );
}

// import '@styles/globals.scss';

// import { AuthContextProvider } from '@lib/context/auth-context';
// import { ThemeContextProvider } from '@lib/context/theme-context';
// import { WindowContextProvider } from '@lib/context/window-context'; // Import WindowContextProvider
// import { AppHead } from '@components/common/app-head';
// import type { ReactElement, ReactNode } from 'react';
// import type { NextPage } from 'next';
// import type { AppProps } from 'next/app';

// type NextPageWithLayout = NextPage & {
//   getLayout?: (page: ReactElement) => ReactNode;
// };

// type AppPropsWithLayout = AppProps & {
//   Component: NextPageWithLayout;
// };

// export default function App({
//   Component,
//   pageProps
// }: AppPropsWithLayout): ReactNode {
//   const getLayout = Component.getLayout ?? ((page): ReactNode => page);

//   return (
//     <>
//       <AppHead />
//       <AuthContextProvider>
//         <ThemeContextProvider>
//           <WindowContextProvider> {/* Wrap with WindowContextProvider */}
//             {getLayout(<Component {...pageProps} />)}
//           </WindowContextProvider>
//         </ThemeContextProvider>
//       </AuthContextProvider>
//     </>
//   );
// }

// import '@styles/globals.scss';

// import { AuthContextProvider } from '@lib/context/auth-context';
// import { ThemeContextProvider } from '@lib/context/theme-context';
// import { AppHead } from '@components/common/app-head';
// import type { ReactElement, ReactNode } from 'react';
// import type { NextPage } from 'next';
// import type { AppProps } from 'next/app';

// type NextPageWithLayout = NextPage & {
//   getLayout?: (page: ReactElement) => ReactNode;
// };

// type AppPropsWithLayout = AppProps & {
//   Component: NextPageWithLayout;
// };

// export default function App({
//   Component,
//   pageProps
// }: AppPropsWithLayout): ReactNode {
//   const getLayout = Component.getLayout ?? ((page): ReactNode => page);

//   return (
//     <>
//       <AppHead />
//       <AuthContextProvider>
//         <ThemeContextProvider>
//           {getLayout(<Component {...pageProps} />)}
//         </ThemeContextProvider>
//       </AuthContextProvider>
//     </>
//   );
// }
