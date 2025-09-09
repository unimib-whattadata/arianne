import { createClient } from '@arianne/supabase/server';
import { cookies } from 'next/headers';

export const HomeHeader = async () => {
  const supabase = await createClient(cookies());
  const { data } = await supabase.auth.getUser();

  return (
    <div>
      <h1 className="text-4xl font-semibold first:mt-0">
        Ciao, {data.user?.user_metadata?.firstName} !
      </h1>
    </div>
  );
};
