'use client';

import Image from 'next/image';

export default function DrivePage() {
  return (
    <>
      <main className="grid h-full">
        <h1 className="font-h1">Pagina dei materiali</h1>
        <p>
          L&apos;immagine che segue è un esempio di come sarà la pagina
          materiali una volta completata.
        </p>
        <Image
          className="border-primary mt-4 rounded-xl border-2"
          src="/images/drive-example-placeholder.png"
          alt="Pagina dei materiali"
          width={1466}
          height={758}
        />
      </main>
    </>
  );
}
