
import cn from 'clsx';
import type { ReactNode } from 'react';

type MainContainerProps = {
  children: ReactNode;
  className?: string;
};

export function MainContainer({
  children,
  className
}: MainContainerProps): JSX.Element {
  return (
    <main
      className={cn(
        `hover-animation min-h-screen w-[50%]  flex-col border-x-0
         border-light-border pb-96 dark:border-dark-border xs:border-x`,
        className
      )}
    >
      {children}
    </main>
  );
}
