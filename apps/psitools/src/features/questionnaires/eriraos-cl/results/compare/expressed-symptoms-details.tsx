import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { SYMPTOMS } from '@/features/questionnaires/eriraos-cl/symptoms';
import { cn } from '@/utils/cn';

export interface ExpressedSymptoms {
  sì: {
    'last-six-months': string[];
    'all-life': string[];
  };
  no: {
    'last-six-months': string[];
    'all-life': string[];
  };
  uncertain: {
    'last-six-months': string[];
    'all-life': string[];
  };
}

interface StatedSymptoms {
  sì: {
    item: string;
    status: 'new' | 'disappeared' | 'not-changed';
    time: 'last-six-months' | 'all-life';
  }[];
  no: {
    item: string;
    status: 'new' | 'disappeared' | 'not-changed';
    time: 'last-six-months' | 'all-life';
  }[];
  uncertain: {
    item: string;
    status: 'new' | 'disappeared' | 'not-changed';
    time: 'last-six-months' | 'all-life';
  }[];
}

interface Props {
  prevExpressedSymptoms: ExpressedSymptoms;
  nextExpressedSymptoms: ExpressedSymptoms;
}

const extractIndex = (symptom: string) => {
  const index = parseInt(symptom.split('-')[1]) - 1;
  return index;
};

const makeRow = (
  symptoms: {
    item: string;
    status: 'new' | 'disappeared' | 'not-changed';
    time: 'last-six-months' | 'all-life';
  }[],
) => {
  return `repeat(${Math.ceil(symptoms.length / 2)}, 1fr)`;
};

const transformSymptoms = (
  prevExpressedSymptoms: ExpressedSymptoms,
  nextExpressedSymptoms: ExpressedSymptoms,
): StatedSymptoms => {
  const transformCategory = (
    prevCategory: { 'last-six-months': string[]; 'all-life': string[] },
    nextCategory: { 'last-six-months': string[]; 'all-life': string[] },
  ) => {
    const allItems = new Set([
      ...prevCategory['last-six-months'],
      ...prevCategory['all-life'],
      ...nextCategory['last-six-months'],
      ...nextCategory['all-life'],
    ]);

    const transformTimePeriod = (
      timePeriod: 'last-six-months' | 'all-life',
    ) => {
      return Array.from(allItems)
        .sort((a, b) => extractIndex(a) - extractIndex(b))
        .filter((item) => {
          if (timePeriod === 'last-six-months') {
            return (
              nextCategory['last-six-months'].includes(item) ||
              prevCategory['last-six-months'].includes(item)
            );
          } else {
            return (
              nextCategory['all-life'].includes(item) ||
              prevCategory['all-life'].includes(item)
            );
          }
        })
        .map((item) => {
          let status: 'new' | 'disappeared' | 'not-changed';
          if (
            nextCategory[timePeriod].includes(item) &&
            !prevCategory[timePeriod].includes(item)
          ) {
            status = 'new';
          } else if (
            nextCategory[timePeriod].includes(item) &&
            prevCategory[timePeriod].includes(item)
          ) {
            status = 'not-changed';
          } else {
            status = 'disappeared';
          }
          return { item, status, time: timePeriod };
        });
    };

    return [
      ...transformTimePeriod('last-six-months'),
      ...transformTimePeriod('all-life'),
    ];
  };

  return {
    sì: transformCategory(prevExpressedSymptoms.sì, nextExpressedSymptoms.sì),
    no: transformCategory(prevExpressedSymptoms.no, nextExpressedSymptoms.no),
    uncertain: transformCategory(
      prevExpressedSymptoms.uncertain,
      nextExpressedSymptoms.uncertain,
    ),
  };
};

export const ExpressedSymptomsDetails = (props: Props) => {
  const { prevExpressedSymptoms, nextExpressedSymptoms } = props;

  const symptoms = transformSymptoms(
    prevExpressedSymptoms,
    nextExpressedSymptoms,
  );

  return (
    <div className="mt-6 w-full space-y-4">
      <Card className="w-full overflow-hidden border-none bg-red-200">
        <CardHeader className="bg-red-300 text-center">SÌ</CardHeader>
        <CardContent className="grid grid-flow-col grid-cols-2 pt-6">
          <div>
            {symptoms.sì.map((symptom) => {
              if (symptom.time === 'last-six-months') {
                return (
                  <p
                    key={symptom.item}
                    className={cn(
                      symptom.status === 'disappeared' &&
                        'text-gray-400 line-through',
                    )}
                  >
                    <span className="font-bold">
                      {extractIndex(symptom.item) >= 9
                        ? extractIndex(symptom.item) + 1
                        : `0${extractIndex(symptom.item) + 1}`}
                    </span>{' '}
                    {SYMPTOMS[extractIndex(symptom.item)]}
                    {symptom.status === 'new' && (
                      <span className="ml-2 rounded-md bg-red-500 px-2 py-1 text-sm">
                        New
                      </span>
                    )}
                  </p>
                );
              }
            })}
          </div>
          <div className="relative rounded-md border-2 border-gray-400 p-4">
            <span className="absolute -top-3 left-2 bg-red-200 px-2 text-gray-400">
              In qualche momento della vita
            </span>
            {symptoms.sì.map((symptom) => {
              if (symptom.time === 'all-life') {
                return (
                  <p
                    key={symptom.item}
                    className={cn(
                      symptom.status === 'disappeared' &&
                        'text-gray-400 line-through',
                    )}
                  >
                    <span className="font-bold">
                      {extractIndex(symptom.item) >= 9
                        ? extractIndex(symptom.item) + 1
                        : `0${extractIndex(symptom.item) + 1}`}
                    </span>{' '}
                    {SYMPTOMS[extractIndex(symptom.item)]}
                    {symptom.status === 'new' && (
                      <span className="ml-2 rounded-md bg-red-500 px-2 py-1 text-sm">
                        New
                      </span>
                    )}
                  </p>
                );
              }
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="w-full overflow-hidden border-none bg-yellow-100">
        <CardHeader className="bg-yellow-200 text-center">?</CardHeader>
        <CardContent
          style={{
            gridTemplateRows: makeRow(symptoms.uncertain),
          }}
          className="grid grid-flow-col grid-cols-2 pt-6"
        >
          {symptoms.uncertain.map((symptom) => (
            <p
              key={symptom.item}
              className={cn(
                symptom.status === 'disappeared' &&
                  'text-gray-400 line-through',
              )}
            >
              <span className="font-bold">
                {extractIndex(symptom.item) >= 9
                  ? extractIndex(symptom.item) + 1
                  : `0${extractIndex(symptom.item) + 1}`}
              </span>{' '}
              {SYMPTOMS[extractIndex(symptom.item)]}
              {symptom.status === 'new' && (
                <span className="ml-2 rounded-md bg-yellow-500 px-2 py-1 text-sm">
                  New
                </span>
              )}
            </p>
          ))}
        </CardContent>
      </Card>

      <Card className="w-full overflow-hidden border-none bg-green-100">
        <CardHeader className="bg-green-200 text-center">NO</CardHeader>
        <CardContent
          style={{
            gridTemplateRows: makeRow(symptoms.no),
          }}
          className="grid grid-flow-col grid-cols-2 pt-6"
        >
          {symptoms.no.map((symptom) => (
            <p
              key={symptom.item}
              className={cn(
                symptom.status === 'disappeared' &&
                  'text-gray-400 line-through',
              )}
            >
              <span className="font-bold">
                {extractIndex(symptom.item) >= 9
                  ? extractIndex(symptom.item) + 1
                  : `0${extractIndex(symptom.item) + 1}`}
              </span>{' '}
              {SYMPTOMS[extractIndex(symptom.item)]}
              {symptom.status === 'new' && (
                <span className="ml-2 rounded-md bg-green-500 px-2 py-1 text-sm">
                  New
                </span>
              )}
            </p>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
