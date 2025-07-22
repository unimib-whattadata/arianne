'use client';

import { useSteps } from '@/app/diari/_components/form-layout';
import {
  Step1,
  Step2,
  Step3,
  Step4,
  Step5,
  Step6,
  Step7,
  Step8,
  Step9,
  Step10,
  Step11,
  Step12,
} from '@/app/diari/diario-cognitivo-comportamentale/compilazione/_steps';

export default function Page() {
  const { currentStep } = useSteps();

  const Component = () => {
    switch (currentStep) {
      case 1:
        return <Step1 />;
      case 2:
        return <Step2 />;
      case 3:
        return <Step3 />;
      case 4:
        return <Step4 />;
      case 5:
        return <Step5 />;
      case 6:
        return <Step6 />;
      case 7:
        return <Step7 />;
      case 8:
        return <Step8 />;
      case 9:
        return <Step9 />;
      case 10:
        return <Step10 />;
      case 11:
        return <Step11 />;
      case 12:
        return <Step12 />;

      default:
        return null;
    }
  };
  return (
    <div className="px-4">
      <Component />
    </div>
  );
}
