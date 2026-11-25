import type { ReactNode } from 'react';

interface GamesGridProps {
  children: ReactNode;
}

export const GamesGrid = ({ children }: GamesGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6">
      {children}
    </div>
  );
};
