'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSubscription } from '@trpc/tanstack-react-query';
import { useEffect, useState } from 'react';

import { useTherapist } from '@/hooks/use-therapist';
import { cn } from '@/lib/utils';
import { useTRPC } from '@/trpc/react';

interface ChatHeaderProps {
  fullName?: string;
  therapistId: string;
  chatId: string;
}

export const ChatHeader = (props: ChatHeaderProps) => {
  const { therapistId, chatId } = props;
  const { user } = useTherapist(therapistId);
  const queryClient = useQueryClient();
  const api = useTRPC();

  const setUserOnline = useMutation(api.chats.setUserOnline.mutationOptions());
  const setUserOffline = useMutation(
    api.chats.setUserOffline.mutationOptions(),
  );

  const { data } = useQuery(
    api.chats.isUserOnline.queryOptions({
      chatId: chatId,
      userId: therapistId,
    }),
  );

  const [isTherapistOnline, setIsTherapistOnline] = useState<
    'online' | 'offline' | 'isTyping'
  >('offline');

  useEffect(() => {
    if (data) {
      setIsTherapistOnline('online');
    }
  }, [data]);

  useEffect(() => {
    setUserOnline.mutate();

    return () => {
      setUserOffline.mutate();
      queryClient
        .invalidateQueries({
          queryKey: api.chats.isUserOnline.queryKey({
            chatId: chatId,
            userId: therapistId,
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
        if (data.userId === therapistId && data.chatId === chatId)
          setIsTherapistOnline(data.status);
      },
    }),
  );

  return (
    <div className="flex w-full flex-col justify-center px-4 pb-2">
      {user?.profile ? (
        <p className="text-lg font-semibold">{`${user.profile.firstName} ${user.profile.lastName}`}</p>
      ) : (
        'Undefined'
      )}
      <p
        className={cn(
          'text-xs',
          isTherapistOnline === 'offline' ? 'text-space-gray' : 'text-primary',
        )}
      >
        {isTherapistOnline === 'online'
          ? 'Online'
          : isTherapistOnline === 'offline'
            ? 'Offline'
            : 'Sta scrivendo...'}
      </p>
    </div>
  );
};
