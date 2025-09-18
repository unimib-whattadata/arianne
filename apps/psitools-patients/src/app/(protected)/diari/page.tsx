import { Diaries } from '@/app/(protected)/_components/home-diaries';

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <Diaries />
    </div>
  );
}
