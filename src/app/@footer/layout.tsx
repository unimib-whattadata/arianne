import { Logo } from "~/components/logo";

export default function FooterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <footer className="flex items-center gap-4 px-6 py-4">
      <Logo className="text-primary h-6" />
      <p>Copyright © {new Date().getFullYear()}</p>
      <div className="ml-auto">{children}</div>
    </footer>
  );
}
