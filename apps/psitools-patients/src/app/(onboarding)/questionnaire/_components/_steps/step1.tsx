export const Step1 = () => {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 md:gap-16 md:text-center">
      <div className="flex flex-col gap-2 md:items-center md:gap-6">
        <h1 className="text-3xl font-semibold md:text-5xl">
          Inizia il percorso
        </h1>
        <h2 className="text-2xl md:text-3xl">
          Scopri lo specialista più adatto a te
        </h2>
      </div>
      <p>
        Benvenuto/a. Questo breve questionario ci permetterà di comprendere
        meglio la tua situazione e le tue preferenze, in modo da abbinarti al
        terapeuta più adatto a te. <br />
        Alcune domande richiedono riflessione, altre sono semplici preferenze:
        prenditi il tuo tempo. Tutte le risposte saranno trattate con la massima
        riservatezza.
      </p>
    </div>
  );
};
