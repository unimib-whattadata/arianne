import { Button } from '@/components/ui/button';
import { lessons } from '@/features/exercises/_lessions';
import Link from 'next/link';
import { FileUp } from 'lucide-react';

export default async function Ansia({
  params,
}: {
  params: Promise<{ slug: (typeof lessons)[number]['slug'] }>;
}) {
  const { slug } = await params;
  const lesson = lessons.find((lesson) => lesson.slug === slug);
  if (!lesson) return <div>Lezione non trovata</div>;
  return (
    <div className="h-full-safe relative overflow-auto p-4 pt-0">
      <h1 className="mb-4 text-xl font-semibold">
        {' '}
        <lesson.Title />{' '}
      </h1>
      <div className="my-6 flex justify-end">
        <Button variant="outline" size="sm" className="w-fit" asChild>
          <Link href="#">
            <FileUp className="h-4 w-4 text-current" />
          </Link>
        </Button>
      </div>
      <div className="rounded-[4px] bg-white p-8">
        <lesson.Content />
      </div>
    </div>
  );
}
