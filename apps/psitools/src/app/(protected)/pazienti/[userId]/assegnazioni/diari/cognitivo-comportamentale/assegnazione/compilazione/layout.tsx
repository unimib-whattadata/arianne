import { StepsProvider } from '@/features/diaries/context/step-context';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <StepsProvider steps={12}>{children}</StepsProvider>;
}
