import { api } from '@/trpc/server';

export const HomeHeader = async () => {
  const profile = await api.profiles.get();

  return (
    <div>
      <h1 className="text-4xl font-semibold first:mt-0">
        Ciao, {profile?.firstName} !
      </h1>
    </div>
  );
};
