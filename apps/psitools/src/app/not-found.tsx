import Link from 'next/link';

export default function NotFound() {
  return (
    <div>
      <h1>404 - Pagina non trovata</h1>
      <p>La pagina che stai cercando non esiste.</p>
      <p>
        Per favore, torna alla <Link href="/">home</Link>.
      </p>
    </div>
  );
}
