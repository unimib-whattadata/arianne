'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTRPC } from '@/trpc/react';

const diariesMap = (
  diaryType: string,
): { title: string; description: string; imgUrl: string; href: string } => {
  switch (diaryType) {
    case 'alimentare': {
      return {
        title: 'Diario Alimentare',
        description:
          'Ti consigliamo di compilare il diario alimentare ogni qualvolta consumi un pasto',
        imgUrl: '/images/illustrazione-diario-alimentare.png',
        href: '/diari/diario-alimentare',
      };
    }
    case 'cognitivo-comportamentale': {
      return {
        title: 'Diario Cognitivo-Comportamentale ',
        description:
          'Ti consigliamo di compilare il diario cognitivo-comportamentale quando te la senti',
        imgUrl: '/images/illustrazione-diario-cognitivo-comportamentale.png',
        href: '/diari/diario-cognitivo-comportamentale',
      };
    }
    case 'sonno-mattina': {
      return {
        title: 'Diario del sonno-mattina',
        description:
          'Il diario del sonno-mattina andrebbe compilato ogni mattina ',
        imgUrl: '/images/illustrazione-diario-sonno-mattina.png',
        href: '/diari/diario-sonno-mattina',
      };
    }
    case 'sonno-sera': {
      return {
        title: 'Diario del sonno-sera',
        description:
          'Il diario del sonno-sera andrebbe compilato ogni sera qualche ora prima di andare a letto ',
        imgUrl: '/images/illustrazione-diario-sonno-sera.png',
        href: '/diari/diario-sonno-sera',
      };
    }
    default: {
      return {
        title: 'Diario Alimentare',
        description:
          'Ti consigliamo di compilare il diario alimentare ogni qualvolta consumi un pasto',
        imgUrl: '/images/illustrazione-diario-alimentare.png',
        href: '/diari/diario-alimentare',
      };
    }
  }
};

export const Diaries = () => {
  const api = useTRPC();
  const pathname = usePathname();
  const { data: assignments } = useQuery(api.assignments.get.queryOptions());

  const diaryCount = useMemo(() => {
    return assignments?.filter((a) => a.type === 'diary');
  }, [assignments]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayDiary =
    diaryCount?.filter((diary) => {
      const eventDate = new Date(diary.date);
      eventDate.setHours(0, 0, 0, 0);

      return eventDate.getTime() === today.getTime();
    }) || [];

  return (
    <section className="grid grid-cols-1 gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold first:mt-0">
          I diari da compilare
        </h2>
        {pathname === '/' ? (
          <Link href="/diari">
            <Button variant="link" className="text-blue-waterTitle">
              Vai ai diari
            </Button>
          </Link>
        ) : null}
      </div>
      <div className="grid grid-cols-1 gap-2">
        {diaryCount && todayDiary.length == 0 && (
          <p className="mt-4 text-center">Nessun diario da compilare</p>
        )}
        {todayDiary.map((diary) => {
          const currentDiary = diariesMap(diary.name);
          return (
            <Card
              key={currentDiary.title}
              className="bg-blue-water flex items-center justify-between p-3 pr-4"
            >
              <div className="flex items-center gap-4">
                <Image
                  src={currentDiary.imgUrl}
                  alt={currentDiary.title}
                  width={64}
                  height={64}
                  priority
                />

                <div>
                  <h3 className="text-blue-waterTitle text-base font-semibold">
                    {currentDiary.title}
                  </h3>
                  <p className="text-xs">{currentDiary.description}</p>
                </div>
              </div>

              <Link href={currentDiary.href}>
                <Button className="border-secondary text-blue-waterTitle hover:bg-blue-waterTitle hover:text-white-900 bg-secondary/20 rounded-sm border font-normal">
                  Svolgi il compito
                </Button>
              </Link>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
