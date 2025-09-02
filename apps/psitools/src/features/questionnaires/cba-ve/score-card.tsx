import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/utils/cn';

interface ScoreCardProps extends React.HTMLAttributes<HTMLDivElement> {
  patologia: string;
  punteggio: number;
  z: number;
  compare?: boolean;
}

export const ScoreCard = (props: ScoreCardProps) => {
  const { patologia, punteggio, z, compare = false } = props;
  return (
    <div className="w-48">
      <Card className="relative flex h-full w-full flex-col items-center transition-all duration-300">
        <CardHeader className="space-y-0 p-4 pb-0">
          <CardTitle className="font-h2 line-clamp-1 break-all pr-1 text-base">
            {patologia}
          </CardTitle>
        </CardHeader>
        <CardContent className={cn('p-4', !compare && 'pt-0')}>
          {compare && (
            <div
              className={cn(
                'flex h-16 w-16 items-center justify-center self-center rounded-full p-4',
                punteggio < 0 ? 'bg-emerald-400' : 'bg-red-500',
              )}
            >
              <span className={'relative -left-1 text-lg font-bold text-white'}>
                {punteggio > 0 ? `+${punteggio}` : punteggio}
              </span>
            </div>
          )}
          {!compare && (
            <p className="font-h2 py-2 text-center text-space-gray">
              {punteggio}
            </p>
          )}
          {!compare && <p className="text-center">z = {z}</p>}
        </CardContent>
      </Card>
    </div>
  );
};
