import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type WindowSize = {
  width: number;
  height: number;
};

type WindowContext = WindowSize & {
  isMobile: boolean;
};

export const WindowContext = createContext<WindowContext | null>(null);

type WindowContextProviderProps = {
  children: ReactNode;
};

export function WindowContextProvider({
  children
}: WindowContextProviderProps): JSX.Element {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0, // Set initial values
    height: 0
  });

  useEffect(() => {
    // Only run this code on the client-side
    const handleResize = (): void =>
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });

    // Set initial window size
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const value: WindowContext = {
    ...windowSize,
    isMobile: windowSize.width < 500
  };

  return (
    <WindowContext.Provider value={value}>{children}</WindowContext.Provider>
  );
}

export function useWindow(): WindowContext {
  const context = useContext(WindowContext);

  if (!context)
    throw new Error('useWindow must be used within an WindowContextProvider');

  return context;
}

// import { createContext, useContext, useState, useEffect } from 'react';
// import type { ReactNode } from 'react';

// type WindowSize = {
//   width: number;
//   height: number;
// };

// type WindowContext = WindowSize & {
//   isMobile: boolean;
// };

// export const WindowContext = createContext<WindowContext | null>(null);

// type WindowContextProviderProps = {
//   children: ReactNode;
// };

// export function WindowContextProvider({
//   children
// }: WindowContextProviderProps): JSX.Element {
//   const [windowSize, setWindowSize] = useState<WindowSize>({
//     width: window.innerWidth,
//     height: window.innerHeight
//   });

//   useEffect(() => {
//     const handleResize = (): void =>
//       setWindowSize({
//         width: window.innerWidth,
//         height: window.innerHeight
//       });

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const value: WindowContext = {
//     ...windowSize,
//     isMobile: windowSize.width < 500
//   };

//   return (
//     <WindowContext.Provider value={value}>{children}</WindowContext.Provider>
//   );
// }

// export function useWindow(): WindowContext {
//   const context = useContext(WindowContext);

//   if (!context)
//     throw new Error('useWindow must be used within an WindowContextProvider');

//   return context;
// }
