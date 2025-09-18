'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSubscription } from '@trpc/tanstack-react-query';
import { useEffect, useState } from 'react';

import { useTRPC } from '@/trpc/react';
import { cn } from '@/utils/cn';
import { useParams } from 'next/navigation';

interface ChatHeaderProps {
  fullName: string;
}

export const ChatHeader = (props: ChatHeaderProps) => {
  const { fullName } = props;
  const api = useTRPC();
  const { profileId } = useParams<{ profileId: string }>();
  const queryClient = useQueryClient();
  const setUserOnline = useMutation(api.chats.setUserOnline.mutationOptions());
  const setUserOffline = useMutation(
    api.chats.setUserOffline.mutationOptions(),
  );
  const { data } = useQuery(
    api.chats.isUserOnline.queryOptions({
      userId: profileId,
    }),
  );

  const [isPatientOnline, setIsPatientOnline] = useState<
    'online' | 'offline' | 'isTyping'
  >('offline');

  useEffect(() => {
    if (data) {
      setIsPatientOnline('online');
    }
  }, [data]);

  useEffect(() => {
    setUserOnline.mutate();

    return () => {
      setUserOffline.mutate();
      queryClient
        .invalidateQueries({
          queryKey: api.chats.isUserOnline.queryKey({
            userId: profileId,
          }),
        })
        .catch((error) => {
          console.error('Error invalidating queries:', error);
        });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useSubscription(
    api.chats.onUserStatus.subscriptionOptions(undefined, {
      onData: (data) => {
        if (data.userId === profileId) setIsPatientOnline(data.status);
      },
    }),
  );

  return (
    <div className="flex w-full flex-col justify-center px-4 pb-2">
      {fullName ? (
        <p className="text-lg font-semibold">{fullName}</p>
      ) : (
        'Undefined'
      )}
      <p
        className={cn(
          'text-xs',
          isPatientOnline === 'offline' ? 'text-space-gray' : 'text-primary',
        )}
      >
        {isPatientOnline === 'online'
          ? 'Online'
          : isPatientOnline === 'offline'
            ? 'Offline'
            : 'Sta scrivendo...'}
      </p>
    </div>
  );
};
