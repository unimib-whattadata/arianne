export default function BreadcrumbLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-50 flex w-full items-center bg-background px-4">
      <div className="flex h-[var(--header-height)] w-full items-center gap-2">
        {children}
      </div>
    </header>
  );
}
