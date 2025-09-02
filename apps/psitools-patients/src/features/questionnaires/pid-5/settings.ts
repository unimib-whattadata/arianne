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
      id: [8, 45, 48, 91, 101, 167, 184],
      maxScore: 21,
    },
    {
      label: 'Anedonia',
      scoreKey: 'anedonia',
      id: [1, 23, 26, 30, 125, 155, 157, 189],
      maxScore: 24,
    },
    {
      label: 'Angoscia di separazione',
      scoreKey: 'angoscia',
      id: [12, 50, 57, 64, 127, 149, 175],
      maxScore: 21,
    },
    {
      label: 'Ansia',
      scoreKey: 'ansia',
      id: [79, 93, 95, 96, 109, 110, 130, 141, 174],
      maxScore: 27,
    },
    {
      label: 'Convinzioni ed esperienze inusuali',
      scoreKey: 'convinzioni',
      id: [94, 99, 106, 139, 143, 150, 150, 194, 209],
      maxScore: 27,
    },
    {
      label: 'Depressività',
      scoreKey: 'depressivita',
      id: [27, 61, 66, 81, 86, 104, 119, 148, 151, 163, 168, 169, 178, 212],
      maxScore: 42,
    },
    {
      label: 'Disregolazione percettiva',
      scoreKey: 'disregolazione',
      id: [36, 37, 42, 44, 59, 77, 83, 154, 192, 193, 213, 217],
      maxScore: 36,
    },
    {
      label: 'Distraibilità',
      scoreKey: 'distraibilita',
      id: [6, 29, 47, 68, 88, 118, 132, 144, 199],
      maxScore: 27,
    },
    {
      label: 'Eccentricità',
      scoreKey: 'eccentricita',
      id: [5, 21, 24, 25, 33, 52, 55, 70, 71, 152, 172, 185, 205],
      maxScore: 39,
    },
    {
      label: "Evitamento dell'intimità",
      scoreKey: 'evitamento',
      id: [89, 97, 108, 120, 145, 203],
      maxScore: 18,
    },
    {
      label: 'Grandiosità',
      scoreKey: 'grandiosita',
      id: [40, 65, 114, 179, 187, 197],
      maxScore: 18,
    },
    {
      label: 'Impulsività',
      scoreKey: 'impulsivita',
      id: [4, 16, 17, 22, 58, 204],
      maxScore: 18,
    },
    {
      label: 'Inganno',
      scoreKey: 'inganno',
      id: [41, 53, 56, 76, 126, 134, 142, 206, 214, 218],
      maxScore: 30,
    },
    {
      label: 'Insensibilità',
      scoreKey: 'insensibilita',
      id: [11, 13, 19, 54, 72, 73, 90, 153, 166, 183, 198, 200, 207, 208],
      maxScore: 42,
    },
    {
      label: 'Irresponsabilità',
      scoreKey: 'irresponsabilita',
      id: [31, 129, 156, 160, 171, 201, 210],
      maxScore: 21,
    },
    {
      label: 'Labilità emotiva',
      scoreKey: 'labilita',
      id: [18, 62, 102, 122, 138, 165, 181],
      maxScore: 21,
    },
    {
      label: 'Manipolatorietà',
      scoreKey: 'manipolatorieta',
      id: [107, 125, 162, 180, 219],
      maxScore: 15,
    },
    {
      label: 'Ostilità',
      scoreKey: 'ostilita',
      id: [28, 32, 38, 85, 92, 116, 158, 170, 188, 216],
      maxScore: 30,
    },
    {
      label: 'Perfezionismo rigido',
      scoreKey: 'perfezionismo',
      id: [34, 49, 105, 115, 123, 135, 140, 176, 196, 220],
      maxScore: 30,
    },
    {
      label: 'Preservazione',
      scoreKey: 'preservazione',
      id: [46, 51, 60, 78, 80, 100, 121, 128, 137],
      maxScore: 27,
    },
    {
      label: 'Ricerca di attenzione',
      scoreKey: 'ricerca',
      id: [14, 43, 74, 111, 113, 173, 191, 211],
      maxScore: 24,
    },
    {
      label: 'Ritiro',
      scoreKey: 'ritiro',
      id: [10, 20, 75, 82, 136, 146, 147, 161, 182, 186],
      maxScore: 30,
    },
    {
      label: 'Sospettosità',
      scoreKey: 'sospettosita',
      id: [2, 103, 117, 131, 133, 177, 190],
      maxScore: 21,
    },
    {
      label: 'Sottomissione',
      scoreKey: 'sottomissione',
      id: [9, 15, 63, 202],
      maxScore: 12,
    },
    {
      label: 'Tendenza a correre rischi',
      scoreKey: 'tendenza',
      id: [3, 7, 35, 39, 48, 67, 69, 87, 98, 112, 159, 164, 195, 215],
      maxScore: 42,
    },
  ],
  affettivita: [
    {
      label: 'Labilità emotiva',
      scoreKey: 'labilita',
      id: [18, 62, 102, 122, 138, 165, 181],
      maxScore: 21,
    },
    {
      label: 'Ansia',
      scoreKey: 'ansia',
      id: [79, 93, 95, 96, 109, 110, 130, 141, 174],
      maxScore: 27,
    },
    {
      label: 'Angoscia di separazione',
      scoreKey: 'angoscia',
      id: [12, 50, 57, 64, 127, 149, 175],
      maxScore: 21,
    },
  ],
  distacco: [
    {
      label: 'Ritiro',
      scoreKey: 'ritiro',
      id: [10, 20, 75, 82, 136, 146, 147, 161, 182, 186],
      maxScore: 30,
    },
    {
      label: 'Anedonia',
      scoreKey: 'anedonia',
      id: [1, 23, 26, 30, 125, 155, 157, 189],
      maxScore: 24,
    },
    {
      label: "Evitamento dell'intimità",
      scoreKey: 'evitamento',
      id: [89, 97, 108, 120, 145, 203],
      maxScore: 18,
    },
  ],
  antagonismo: [
    {
      label: 'Manipolatorietà',
      scoreKey: 'manipolatorieta',
      id: [107, 125, 162, 180, 219],
      maxScore: 15,
    },
    {
      label: 'Inganno',
      scoreKey: 'inganno',
      id: [41, 53, 56, 76, 126, 134, 142, 206, 214, 218],
      maxScore: 30,
    },
    {
      label: 'Grandiosità',
      scoreKey: 'grandiosita',
      id: [40, 65, 114, 179, 187, 197],
      maxScore: 18,
    },
  ],
  disinibizione: [
    {
      label: 'Irresponsabilità',
      scoreKey: 'irresponsabilita',
      id: [31, 129, 156, 160, 171, 201, 210],
      maxScore: 21,
    },
    {
      label: 'Impulsività',
      scoreKey: 'impulsivita',
      id: [4, 16, 17, 22, 58, 204],
      maxScore: 18,
    },
    {
      label: 'Distraibilità',
      scoreKey: 'distraibilita',
      id: [6, 29, 47, 68, 88, 118, 132, 144, 199],
      maxScore: 27,
    },
  ],
  psicoticismo: [
    {
      label: 'Convinzioni ed esperienze inusuali',
      scoreKey: 'convinzioni',
      id: [94, 99, 106, 139, 143, 150, 150, 194, 209],
      maxScore: 27,
    },
    {
      label: 'Eccentricità',
      scoreKey: 'eccentricita',
      id: [5, 21, 24, 25, 33, 52, 55, 70, 71, 152, 172, 185, 205],
      maxScore: 39,
    },
    {
      label: 'Disregolazione percettiva',
      scoreKey: 'disregolazione',
      id: [36, 37, 42, 44, 59, 77, 83, 154, 192, 193, 213, 217],
      maxScore: 36,
    },
  ],
  altro: [
    {
      label: 'Affettività ridotta',
      scoreKey: 'affettivita',
      id: [8, 45, 48, 91, 101, 167, 184],
      maxScore: 21,
    },
    {
      label: 'Depressività',
      scoreKey: 'depressivita',
      id: [27, 61, 66, 81, 86, 104, 119, 148, 151, 163, 168, 169, 178, 212],
      maxScore: 42,
    },
    {
      label: 'Insensibilità',
      scoreKey: 'insensibilita',
      id: [11, 13, 19, 54, 72, 73, 90, 153, 166, 183, 198, 200, 207, 208],
      maxScore: 42,
    },
    {
      label: 'Ostilità',
      scoreKey: 'ostilita',
      id: [28, 32, 38, 85, 92, 116, 158, 170, 188, 216],
      maxScore: 30,
    },
    {
      label: 'Perfezionismo rigido',
      scoreKey: 'perfezionismo',
      id: [34, 49, 105, 115, 123, 135, 140, 176, 196, 220],
      maxScore: 30,
    },
    {
      label: 'Preservazione',
      scoreKey: 'preservazione',
      id: [46, 51, 60, 78, 80, 100, 121, 128, 137],
      maxScore: 27,
    },
    {
      label: 'Ricerca di attenzione',
      scoreKey: 'ricerca',
      id: [14, 43, 74, 111, 113, 173, 191, 211],
      maxScore: 24,
    },
    {
      label: 'Sospettosità',
      scoreKey: 'sospettosita',
      id: [2, 103, 117, 131, 133, 177, 190],
      maxScore: 21,
    },
    {
      label: 'Sottomissione',
      scoreKey: 'sottomissione',
      id: [9, 15, 63, 202],
      maxScore: 12,
    },
    {
      label: 'Tendenza a correre rischi',
      scoreKey: 'tendenza',
      id: [3, 7, 35, 39, 48, 67, 69, 87, 98, 112, 159, 164, 195, 215],
      maxScore: 42,
    },
  ],
};

export default DOMAIN_MAP;
