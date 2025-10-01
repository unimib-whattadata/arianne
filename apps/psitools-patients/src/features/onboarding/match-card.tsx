'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Fragment } from 'react';
import type { FC } from 'react';
import Image from 'next/image';

export interface Therapist {
  id: string;
  name: string;
  orientation: string;
  //   picture: string;
  bio: string;
  feePerSession: number;
  areasOfCompetence: string[];
  availability: { day: string; time: string[] }[];
}

export interface TherapistCardProps {
  therapist: Therapist;
  selected: boolean;
  onSelect: (therapistId: string, selected: boolean) => void;
}

export const TherapistCard: FC<TherapistCardProps> = ({
  therapist,
  selected,
  onSelect,
}) => {
  return (
    <Card className="bg-secondary-light flex max-w-3xl flex-col justify-between rounded-2xl p-4 md:px-8 md:py-6">
      <CardContent className="p-0">
        <div className="md:grid md:grid-cols-3 md:grid-rows-[auto,1fr,1fr] md:gap-6">
          <h2 className="row-span-1 w-full text-lg font-semibold">
            {therapist.name}
          </h2>
          <div className="flex flex-col gap-4 md:col-span-1 md:row-span-2 md:row-start-2">
            <Image
              src={'/therapist-placeholder.png'}
              alt={therapist.name}
              className="bg-primary/15 rounded-md"
              width={250}
              height={250}
            />
            <p className="text-md mb-4">{therapist.bio}</p>
          </div>
          <div className="flex flex-col gap-4 md:row-span-2 md:row-start-2">
            <div className="flex flex-col gap-2">
              <h3 className="text-md font-semibold">Ambiti di interesse</h3>
              {therapist.areasOfCompetence.map((area) => (
                <div
                  key={area}
                  className="bg-primary/50 inline-block w-fit rounded-sm px-2 py-1 text-center text-sm text-slate-900 uppercase"
                >
                  #{area}
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-md font-semibold">Orientamento</h3>
              <p className="mb-2 text-sm text-slate-600">
                {therapist.orientation}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-md font-semibold">Costo a seduta</h3>
              <p className="text-secondary mb-2 text-sm font-semibold">
                {therapist.feePerSession} euro*
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-4 md:col-span-1 md:row-span-2 md:row-start-2">
            <div className="flex flex-col gap-2">
              <h3 className="text-md font-semibold">Disponibilità</h3>
              <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm text-slate-600">
                {therapist.availability.map((slot) => (
                  <Fragment key={slot.day}>
                    <div>{slot.day}:</div>
                    <div className="flex flex-col pb-2">
                      {slot.time.map((time) => (
                        <span key={time} className="pb-1">
                          {time}
                        </span>
                      ))}
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <Button
        variant={selected ? 'default' : 'secondary'}
        className={`mt-2 w-max self-end ${selected ? 'bg-primary text-white' : ''}`}
        onClick={() => onSelect(therapist.id, !selected)}
      >
        {selected ? 'Già scelto' : 'Scegli'}
      </Button>
    </Card>
  );
};
