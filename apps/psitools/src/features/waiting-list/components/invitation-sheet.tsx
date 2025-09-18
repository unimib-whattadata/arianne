'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { useForm } from 'react-hook-form';

interface InvitationForm {
  patientName: string;
  patientEmail: string;
}

interface InvitationSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: InvitationForm) => void;
}

const InvitationSheet: React.FC<InvitationSheetProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const { register, handleSubmit, watch } = useForm<InvitationForm>({
    defaultValues: {
      patientName: '',
      patientEmail: '',
    },
  });

  const onSubmit = (data: InvitationForm) => {
    onSave(data);
  };

  // 🔥 osserva il valore del campo in tempo reale
  const patientNameValue = watch('patientName');

  return (
    <Sheet open={isOpen} onOpenChange={onClose} modal={false}>
      <SheetContent className="overflow-y-auto py-0">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mb-4 flex flex-col gap-4"
        >
          <div className="sticky top-0 z-10 flex items-end justify-between bg-white py-4">
            <SheetTitle>Nuovo Invito</SheetTitle>
          </div>

          <div className="w-full">
            <label className="block text-[14px]">Nome e cognome</label>
            <Input
              type="text"
              {...register('patientName', { required: true })}
              className="focus:border-forest-green-700 w-full rounded-md border border-[#ccdbef] p-2 placeholder:text-[#94a3b8] focus:outline-none md:text-base"
              placeholder="Inserisci nome e cognome"
            />
          </div>

          <div className="w-full">
            <label className="block text-[14px]">Email</label>
            <Input
              type="email"
              {...register('patientEmail', { required: true })}
              className="focus:border-forest-green-700 w-full rounded-md border border-[#ccdbef] p-2 placeholder:text-[#94a3b8] focus:outline-none md:text-base"
              placeholder="Inserisci Email"
            />
          </div>

          <p>
            Il paziente <strong>{patientNameValue || ''}</strong> riceverà
            l’invito e potrà accettarlo via email. Potrai visualizzare lo{' '}
            <strong>stato</strong> dell’invito nella sezione{' '}
            <strong>“Inviti inviati”</strong>.
          </p>

          <Button type="submit" variant="default">
            Invia Invito
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default InvitationSheet;
