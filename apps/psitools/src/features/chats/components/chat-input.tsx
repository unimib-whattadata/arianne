'use client';
import { useMutation } from '@tanstack/react-query';
import { CornerDownLeft } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useTRPC } from '@/trpc/react';

interface ChatInputProps {
  chatId: string;
}

export const ChatInput = (props: ChatInputProps) => {
  const { chatId } = props;
  const formRef = useRef<HTMLFormElement>(null);
  const [text, setText] = useState<string>('');
  const api = useTRPC();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { mutate } = useMutation(api.chat.addMessage.mutationOptions());

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate({
      chatId: chatId,
      content: text,
      senderType: 'therapist',
    });
    setText('');
  };

  const { mutate: setTyping } = useMutation(
    api.chat.setUserTyping.mutationOptions({
      onSuccess: () => {
        console.log('User typing status updated successfully.');
      },
      onError: (error) => {
        console.error('Error updating user typing status:', error);
      },
    }),
  );

  const handleTextChange = useCallback((e: { target: { value: string } }) => {
    const newText = e.target.value;
    setText(newText);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      console.log('Debounce: Timer precedente cancellato.');
    }
    const isActuallyTyping = newText.length > 0 && newText !== '<p><br></p>';

    if (isActuallyTyping) {
      console.log('User is typing...');
      setTyping({
        chatId: chatId,
        typingStatus: 'isTyping',
      });

      typingTimeoutRef.current = setTimeout(() => {
        console.log('User stopped typing.');
        setTyping({
          chatId: chatId,
          typingStatus: 'stoppedTyping',
        });
        typingTimeoutRef.current = null;
      }, 1500);
    } else {
      console.log('User is not typing (input cleared or empty).');
      setTyping({
        chatId: chatId,
        typingStatus: 'stoppedTyping',
      });
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    }
  }, []);

  return (
    <div className="w-full px-4 pb-2">
      <form
        ref={formRef}
        onSubmit={onSubmit}
        className="relative w-full rounded-lg border bg-background px-4 pb-2 focus-within:ring-1 focus-within:ring-ring"
      >
        <Textarea
          value={text}
          onChange={(e) => {
            handleTextChange(e);
          }}
          placeholder="Type your message here..."
          className="rounded-lg border-0 bg-background shadow-none"
        />
        <div className="flex items-center p-3 pt-0">
          <Button type="submit" size="lg" className="ml-auto gap-1.5">
            Invia Messaggio
            <CornerDownLeft className="size-3.5" />
          </Button>
        </div>
      </form>
    </div>
  );
};
