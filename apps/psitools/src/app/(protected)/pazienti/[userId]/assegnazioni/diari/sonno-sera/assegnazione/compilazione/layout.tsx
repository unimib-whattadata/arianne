import { StepsProvider } from '@/features/diaries/context/step-context';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <StepsProvider steps={5}>{children}</StepsProvider>;
}
