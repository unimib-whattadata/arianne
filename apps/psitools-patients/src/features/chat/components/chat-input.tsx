'use client';

import { useMutation } from '@tanstack/react-query';
import { CornerDownLeft } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useTRPC } from '@/trpc/react';

interface ChatInputProps {
  patientProfileId: string;
  therapistProfileId: string;
}

export const ChatInput = (props: ChatInputProps) => {
  const { patientProfileId, therapistProfileId } = props;
  const formRef = useRef<HTMLFormElement>(null);
  const [text, setText] = useState<string>('');
  const api = useTRPC();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { mutate } = useMutation(api.chats.addMessage.mutationOptions());
  const { mutate: setTyping } = useMutation(
    api.chats.setUserTyping.mutationOptions(),
  );

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate({
      patientProfileId: patientProfileId,
      therapistProfileId: therapistProfileId,
      content: text,
      senderType: 'patient',
    });
    setText('');
  };

  const handleTextChange = useCallback((e: { target: { value: string } }) => {
    const newText = e.target.value;
    setText(newText);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      console.log('Debounce: Timer precedente cancellato.');
    }
    const isActuallyTyping = newText.length > 0 && newText !== '<p><br></p>';

    if (isActuallyTyping) {
      setTyping({
        typingStatus: 'isTyping',
        patientProfileId: patientProfileId,
        therapistProfileId: therapistProfileId,
        sender: 'patient',
      });

      typingTimeoutRef.current = setTimeout(() => {
        console.log('User stopped typing.');
        setTyping({
          typingStatus: 'stoppedTyping',
          patientProfileId: patientProfileId,
          therapistProfileId: therapistProfileId,
          sender: 'patient',
        });
        typingTimeoutRef.current = null;
      }, 1500);
    } else {
      console.log('User is not typing (input cleared or empty).');
      setTyping({
        patientProfileId: patientProfileId,
        therapistProfileId: therapistProfileId,
        sender: 'patient',
        typingStatus: 'stoppedTyping',
      });
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full px-4 pb-2">
      <form
        ref={formRef}
        onSubmit={onSubmit}
        className="bg-background focus-within:ring-ring relative w-full rounded-lg border px-4 pb-2 focus-within:ring-1"
      >
        <Textarea
          value={text}
          onChange={(e) => {
            handleTextChange(e);
          }}
          placeholder="Type your message here..."
          className="bg-background rounded-lg border-0 shadow-none"
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
