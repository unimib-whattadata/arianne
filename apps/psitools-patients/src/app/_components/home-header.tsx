'use client';

import { useSession } from '@/hooks/use-session';

export const HomeHeader = () => {
  const { session } = useSession();
  return (
    <div>
      <h1 className="text-4xl font-semibold first:mt-0">
        Ciao, {session?.user?.firstName} !
      </h1>
    </div>
  );
};
