import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { SYMPTOMS } from '@/features/questionnaires/eriraos-cl/symptoms';

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
interface Props {
  expressedSymptoms: ExpressedSymptoms;
}

export const ExpressedSymptomsDetails = (props: Props) => {
  const { expressedSymptoms } = props;

  const { sì, no, uncertain } = expressedSymptoms;

  const extractIndex = (symptom: string) => {
    const index = parseInt(symptom.split('-')[1]) - 1;
    return index;
  };

  const makeRow = (obj: {
    'last-six-months': string[];
    'all-life': string[];
  }) => {
    return `repeat(${Math.ceil(
      (obj['last-six-months'].length + obj['all-life'].length) / 2,
    )}, 1fr)`;
  };

  return (
    <div className="mt-6 w-full space-y-4">
      <Card className="w-full overflow-hidden border-none bg-red-200">
        <CardHeader className="bg-red-300 text-center">SÌ</CardHeader>
        <CardContent className="grid grid-flow-col grid-cols-2 pt-6">
          <div>
            {sì['last-six-months'].map((symptom, index) => (
              <p key={index}>
                <span className="font-bold">
                  {extractIndex(symptom) >= 9
                    ? extractIndex(symptom) + 1
                    : `0${extractIndex(symptom) + 1}`}
                </span>{' '}
                {SYMPTOMS[extractIndex(symptom)]}
              </p>
            ))}
          </div>
          <div className="relative rounded-md border-2 border-gray-400 p-4">
            <span className="absolute -top-3 left-2 bg-red-200 px-2 text-gray-400">
              In qualche momento della vita
            </span>
            {sì['all-life'].map((symptom, index) => (
              <p key={index}>
                <span className="font-bold">
                  {extractIndex(symptom) >= 9
                    ? extractIndex(symptom) + 1
                    : `0${extractIndex(symptom) + 1}`}
                </span>{' '}
                {SYMPTOMS[extractIndex(symptom)]}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="w-full overflow-hidden border-none bg-yellow-100">
        <CardHeader className="bg-yellow-200 text-center">?</CardHeader>
        <CardContent
          style={{
            gridTemplateRows: makeRow(uncertain), // non funzionaaaaaaaaa
          }}
          className="grid grid-flow-col grid-cols-2 pt-6"
        >
          {uncertain['last-six-months'].map((symptom, index) => (
            <p key={index}>
              <span className="font-bold">
                {extractIndex(symptom) >= 9
                  ? extractIndex(symptom) + 1
                  : `0${extractIndex(symptom) + 1}`}
              </span>{' '}
              {SYMPTOMS[extractIndex(symptom)]}
            </p>
          ))}
          {uncertain['all-life'].map((symptom, index) => (
            <p key={index}>
              <span className="font-bold">
                {extractIndex(symptom) >= 9
                  ? extractIndex(symptom) + 1
                  : `0${extractIndex(symptom) + 1}`}
              </span>{' '}
              {SYMPTOMS[extractIndex(symptom)]}
            </p>
          ))}
        </CardContent>
      </Card>

      <Card className="w-full overflow-hidden border-none bg-green-100">
        <CardHeader className="bg-green-200 text-center">NO</CardHeader>
        <CardContent
          style={{
            gridTemplateRows: makeRow(no),
          }}
          className="grid grid-flow-col grid-cols-2 pt-6"
        >
          {no['last-six-months'].map((symptom) => (
            <p key={symptom}>
              <span className="font-bold">
                {extractIndex(symptom) >= 9
                  ? extractIndex(symptom) + 1
                  : `0${extractIndex(symptom) + 1}`}
              </span>{' '}
              {SYMPTOMS[extractIndex(symptom)]}
            </p>
          ))}
          {no['all-life'].map((symptom) => (
            <p key={symptom}>
              <span className="font-bold">
                {extractIndex(symptom) >= 9
                  ? extractIndex(symptom) + 1
                  : `0${extractIndex(symptom) + 1}`}
              </span>{' '}
              {SYMPTOMS[extractIndex(symptom)]}
            </p>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
