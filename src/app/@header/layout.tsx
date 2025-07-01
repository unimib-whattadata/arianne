import Link from "next/link";
import { Logo } from "~/components/logo";
import { Button } from "~/components/ui/button";

export default function HeaderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <header className="border-secondary fixed top-4 right-4 left-4 z-10 flex items-center rounded-full border bg-white px-6 py-4">
      <Link href="/">
        <Logo className="text-primary h-6" />
      </Link>
      {children}
      <Button variant="ghost" className="mr-2">
        Accedi
      </Button>
      <Button>Chiedi una demo</Button>
    </header>
  );
}
