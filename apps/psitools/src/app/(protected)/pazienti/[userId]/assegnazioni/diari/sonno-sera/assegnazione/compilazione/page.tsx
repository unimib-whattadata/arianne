'use client';
import { useSteps } from '@/features/diaries/components/form-layout';
import {
  Step1,
  Step2,
  Step3,
  Step4,
  Step5,
} from '@/features/diaries/sleep-evening/steps';

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
