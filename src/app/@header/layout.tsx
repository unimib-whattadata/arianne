import { Logo } from "~/components/logo";
import { Button } from "~/components/ui/button";

export default function DefaultHeader({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <header className="fixed top-4 right-4 left-4 z-10 flex items-center rounded-full bg-white px-6 py-4">
      <Logo className="text-primary h-10" />
      {children}
      <Button variant="ghost" className="mr-2">
        Accedi
      </Button>
      <Button>Chiedi una demo</Button>
    </header>
  );
}
