import React from 'react';

interface DiarylayoutProps {
  type: 'cognitive_behavioral' | 'food' | 'sleep_morning' | 'sleep_evening';
  content: Record<string, string | number | boolean>;
}

const labelMappings: Record<string, Record<string, string>> = {
  cognitive_behavioral: {
    bheavior: 'Comportamento',
    bodyFeeling: 'Sensazione corporea',
    company: 'Compagnia',
    companyPerson: 'Con chi eri',
    context: 'Contesto',
    description: 'Descrizione',
    emotion: 'Emozione',
    intensity: 'Intensità',
    momentDay: 'Momento della giornata',
    place: 'Luogo',
    thought: 'Pensiero',
    unpleasant: 'Esperienza spiacevole',
    note: 'Note',
  },
  food: {
    timeConsumation: 'Tempo di consumo',
    typeConsumation: 'Tipologia di consumo',
    momentDay: 'Momento del Giorno',
    placeConsumption: 'Luogo del consumo',
    place: 'Luogo',
    company: 'Compagnia',
    companyPerson: 'Con chi eri',
    activitycompany: 'Stavi facendo altro durante la consumazione',
    whatActivitycompany: 'Cosa stavi facendo',
    mealConsideration: 'Considerazioni Pasto',
    excessiveQuantity: 'Quantità Eccessiva',
    relevanceConsumption: 'Rilevanza Consumo',
    bodilysensation: 'Sensazione corporea',
    influenceConsumption: 'Influenza consumo',
    reasonInfluence: 'Motivo Influenza',
    PostConsumerBehaviors: 'Comportamenti post consumo',
    physicalActivity: 'Attività fisica',
    PostConsumerEmotions: 'Provato emozioni post consumo',
    durationPhysicalActivity: 'Durata attività fisica',
    typeActivityPhysics: 'Tipo di attività fisica',
    intensity: 'Intensità',
    note: 'Note',
  },
  sleep_evening: {
    tense: 'Livello di tensione ',
    sad: 'Tristezza percepita ',
    difficulty: 'Difficoltà della giornata ',
    tired: 'Livello di stanchezza ',
  },
  sleep_morning: {
    nap: 'Hai fatto un pisolino?',
    napDuration: 'Durata del pisolino',
    tense: 'Tensione ',
    exercise: 'Hai fatto attività fisica?',
    caffeine: 'Hai assunto caffeina?',
    caffeineQuantity: 'Quantità di caffeina',
    caffeineTime: 'Orario di assunzione della caffeina',
    alcohol: 'Hai assunto alcol?',
    alcoholQuantity: 'Quantità di alcol',
    alcoholTime: "Orario di assunzione dell'alcol",
    sleepMedications: 'Hai assunto farmaci per dormire?',
    sleepMedicationsQuantity: 'Quantità di farmaci per dormire',
    sleepMedicationsTime: 'Orario di assunzione dei farmaci',
    bedtime: 'Orario in cui sei andato a letto',
    lightsOffTime: 'Orario in cui hai spento la luce',
    sleepLatency: 'Tempo impiegato per addormentarti',
    wakeUpPlanned: 'Esistenza orario in cui avevi pianificato di svegliarti',
    wakeUpTime: 'Orario effettivo di risveglio',
    finalNap: "Orario dell'ultimo risveglio notturno",
    outBed: 'Orario in cui sei uscito dal letto',
    awakening: 'Tempo totale sveglio durante la notte',
    nightawake: 'Numero di risvegli notturni',
    timetoWake: 'Tempo impiegato per svegliarti completamente',
    disturbe: 'Disturbi notturni ',
    qualitySleep: 'Qualità del sonno ',
    rest: 'Sensazione di riposo ',
    tired: 'Stanchezza al risveglio ',
    drowsiness: 'Sonnolenza al risveglio ',
    note: 'Note aggiuntive',
  },
};

const Diarylayout: React.FC<DiarylayoutProps> = ({ type, content }) => {
  const labels = labelMappings[type];

  const mainContent = Object.fromEntries(
    Object.entries(content).filter(([key]) => key !== 'note'),
  );

  return (
    <div className="scrollbar-blue w-full px-4 pb-4">
      {Object.entries(mainContent).map(([key, value]) =>
        labels[key] && value ? (
          <EntryField key={key} label={labels[key]} value={String(value)} />
        ) : null,
      )}

      {content.note && <EntryField label="Note" value={String(content.note)} />}
    </div>
  );
};

const EntryField: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="flex h-full flex-col justify-between pb-3">
    <div className="mb-1">
      <label className="text-[14px] font-medium text-muted-foreground">
        {label}
      </label>
    </div>
    <div
      className="break-words text-base"
      dangerouslySetInnerHTML={{ __html: value }}
    />
  </div>
);

export default Diarylayout;
