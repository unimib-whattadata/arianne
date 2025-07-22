export type ScoreKey =
  | 'affettivita'
  | 'anedonia'
  | 'angoscia'
  | 'ansia'
  | 'convinzioni'
  | 'depressivita'
  | 'disregolazione'
  | 'distraibilita'
  | 'eccentricita'
  | 'evitamento'
  | 'grandiosita'
  | 'impulsivita'
  | 'inganno'
  | 'insensibilita'
  | 'irresponsabilita'
  | 'labilita'
  | 'manipolatorieta'
  | 'ostilita'
  | 'perfezionismo'
  | 'preservazione'
  | 'ricerca'
  | 'ritiro'
  | 'sospettosita'
  | 'sottomissione'
  | 'tendenza';

const DOMAIN_MAP: Record<
  string,
  { label: string; scoreKey: ScoreKey; id: number[]; maxScore: number }[]
> = {
  domini: [
    {
      label: 'Affettività ridotta',
      scoreKey: 'affettivita',
      id: [28, 30, 73, 83],
      maxScore: 12,
    },
    {
      label: 'Anedonia',
      scoreKey: 'anedonia',
      id: [9, 11, 43, 65],
      maxScore: 12,
    },
    {
      label: 'Angoscia di separazione',
      scoreKey: 'angoscia',
      id: [17, 45, 58, 79],
      maxScore: 12,
    },
    {
      label: 'Ansia',
      scoreKey: 'ansia',
      id: [24, 36, 48, 78],
      maxScore: 12,
    },
    {
      label: 'Convinzioni ed esperienze inusuali',
      scoreKey: 'convinzioni',
      id: [34, 54, 59, 96],
      maxScore: 12,
    },
    {
      label: 'Depressività',
      scoreKey: 'depressivita',
      id: [26, 60, 70, 74],
      maxScore: 12,
    },
    {
      label: 'Disregolazione percettiva',
      scoreKey: 'disregolazione',
      id: [15, 63, 88, 98],
      maxScore: 12,
    },
    {
      label: 'Distraibilità',
      scoreKey: 'distraibilita',
      id: [39, 49, 55, 91],
      maxScore: 12,
    },
    {
      label: 'Eccentricità',
      scoreKey: 'eccentricita',
      id: [10, 22, 61, 94],
      maxScore: 12,
    },
    {
      label: "Evitamento dell'intimità",
      scoreKey: 'evitamento',
      id: [29, 40, 56, 93],
      maxScore: 12,
    },
    {
      label: 'Grandiosità',
      scoreKey: 'grandiosita',
      id: [14, 37, 85, 90],
      maxScore: 12,
    },
    {
      label: 'Impulsività',
      scoreKey: 'impulsivita',
      id: [2, 5, 6, 8],
      maxScore: 12,
    },
    {
      label: 'Inganno',
      scoreKey: 'inganno',
      id: [18, 51, 95, 99],
      maxScore: 12,
    },
    {
      label: 'Insensibilità',
      scoreKey: 'insensibilita',
      id: [7, 62, 72, 82],
      maxScore: 12,
    },
    {
      label: 'Irresponsabilità',
      scoreKey: 'irresponsabilita',
      id: [47, 64, 68, 76],
      maxScore: 12,
    },
    {
      label: 'Labilità emotiva',
      scoreKey: 'labilita',
      id: [41, 53, 71, 81],
      maxScore: 12,
    },
    {
      label: 'Manipolatorietà',
      scoreKey: 'manipolatorieta',
      id: [35, 44, 69, 100],
      maxScore: 12,
    },
    {
      label: 'Ostilità',
      scoreKey: 'ostilita',
      id: [12, 31, 66, 75],
      maxScore: 12,
    },
    {
      label: 'Perfezionismo rigido',
      scoreKey: 'perfezionismo',
      id: [33, 42, 80, 89],
      maxScore: 12,
    },
    {
      label: 'Preservazione',
      scoreKey: 'preservazione',
      id: [19, 25, 32, 46],
      maxScore: 12,
    },
    {
      label: 'Ricerca di attenzione',
      scoreKey: 'ricerca',
      id: [23, 77, 87, 97],
      maxScore: 12,
    },
    {
      label: 'Ritiro',
      scoreKey: 'ritiro',
      id: [27, 52, 57, 84],
      maxScore: 12,
    },
    {
      label: 'Sospettosità',
      scoreKey: 'sospettosita',
      id: [1, 38, 50, 86],
      maxScore: 12,
    },
    {
      label: 'Sottomissione',
      scoreKey: 'sottomissione',
      id: [3, 4, 20, 92],
      maxScore: 12,
    },
    {
      label: 'Tendenza a correre rischi',
      scoreKey: 'tendenza',
      id: [13, 16, 21, 67],
      maxScore: 12,
    },
  ],
  affettivita: [
    {
      label: 'Labilità emotiva',
      scoreKey: 'labilita',
      id: [41, 53, 71, 81],
      maxScore: 12,
    },
    {
      label: 'Ansia',
      scoreKey: 'ansia',
      id: [24, 36, 48, 78],
      maxScore: 12,
    },
    {
      label: 'Angoscia di separazione',
      scoreKey: 'angoscia',
      id: [17, 45, 58, 79],
      maxScore: 12,
    },
  ],
  distacco: [
    {
      label: 'Ritiro',
      scoreKey: 'ritiro',
      id: [27, 52, 57, 84],
      maxScore: 12,
    },
    {
      label: "Evitamento dell'intimità",
      scoreKey: 'evitamento',
      id: [29, 40, 56, 93],
      maxScore: 12,
    },
    {
      label: 'Anedonia',
      scoreKey: 'anedonia',
      id: [9, 11, 43, 65],
      maxScore: 12,
    },
  ],

  antagonismo: [
    {
      label: 'Manipolatorietà',
      scoreKey: 'manipolatorieta',
      id: [35, 44, 69, 100],
      maxScore: 12,
    },
    {
      label: 'Inganno',
      scoreKey: 'inganno',
      id: [18, 51, 95, 99],
      maxScore: 12,
    },
    {
      label: 'Grandiosità',
      scoreKey: 'grandiosita',
      id: [14, 37, 85, 90],
      maxScore: 12,
    },
  ],
  disinibizione: [
    {
      label: 'Irresponsabilità',
      scoreKey: 'irresponsabilita',
      id: [47, 64, 68, 76],
      maxScore: 12,
    },
    {
      label: 'Impulsività',
      scoreKey: 'impulsivita',
      id: [2, 5, 6, 8],
      maxScore: 12,
    },

    {
      label: 'Distraibilità',
      scoreKey: 'distraibilita',
      id: [39, 49, 55, 91],
      maxScore: 12,
    },
  ],
  psicoticismo: [
    {
      label: 'Eccentricità',
      scoreKey: 'eccentricita',
      id: [10, 22, 61, 94],
      maxScore: 12,
    },
    {
      label: 'Convinzioni ed esperienze inusuali',
      scoreKey: 'convinzioni',
      id: [34, 54, 59, 96],
      maxScore: 12,
    },

    {
      label: 'Disregolazione percettiva',
      scoreKey: 'disregolazione',
      id: [15, 63, 88, 98],
      maxScore: 12,
    },
  ],
  altro: [
    {
      label: 'Affettività ridotta',
      scoreKey: 'affettivita',
      id: [28, 30, 73, 83],
      maxScore: 12,
    },
    {
      label: 'Depressività',
      scoreKey: 'depressivita',
      id: [26, 60, 70, 74],
      maxScore: 12,
    },
    {
      label: 'Insensibilità',
      scoreKey: 'insensibilita',
      id: [7, 62, 72, 82],
      maxScore: 12,
    },
    {
      label: 'Ostilità',
      scoreKey: 'ostilita',
      id: [12, 31, 66, 75],
      maxScore: 12,
    },
    {
      label: 'Perfezionismo rigido',
      scoreKey: 'perfezionismo',
      id: [33, 42, 80, 89],
      maxScore: 12,
    },
    {
      label: 'Preservazione',
      scoreKey: 'preservazione',
      id: [19, 25, 32, 46],
      maxScore: 12,
    },
    {
      label: 'Ricerca di attenzione',
      scoreKey: 'ricerca',
      id: [23, 77, 87, 97],
      maxScore: 12,
    },
    {
      label: 'Sospettosità',
      scoreKey: 'sospettosita',
      id: [1, 38, 50, 86],
      maxScore: 12,
    },
    {
      label: 'Sottomissione',
      scoreKey: 'sottomissione',
      id: [3, 4, 20, 92],
      maxScore: 12,
    },
    {
      label: 'Tendenza a correre rischi',
      scoreKey: 'tendenza',
      id: [13, 16, 21, 67],
      maxScore: 12,
    },
  ],
};

export default DOMAIN_MAP;
