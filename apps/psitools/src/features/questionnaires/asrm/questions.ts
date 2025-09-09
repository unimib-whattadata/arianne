export const INSTRUCTIONS_1 =
  'Nella Scala di valutazione dei sintomi trasversali di livello 1 che ha appena compilato, ha indicato che nelle ultime due settimane “ha dormito meno rispetto al solito ma ha avuto comunque molta energia” e/o “ha cominciato molti più progetti rispetto al solito o ha fatto cose più rischiose rispetto al solito” a un livello di gravità lieve o maggiore. I seguenti cinque gruppi di affermazioni indagano queste sensazioni nel dettaglio.';

export const INSTRUCTIONS_2 = `<ul>
            <li>
              Per favore, legga ciascun gruppo di affermazioni attentamente.
            </li>
            <li>
              Scelga per ogni gruppo l’affermazione che meglio descrive il modo
              in cui si è sentito nell’ultima settimana.
            </li>
          </ul>

            Nota: occasionalmente significa “una o due volte”; spesso significa
            “diverse volte o più”; frequentemente significa “la maggior parte
            del tempo”.`;

export const QUESTIONS = [
  {
    id: 1,
    text: 'Domanda 1',
    options: [
      'Non mi sono sentito/a più felice o allegro/a rispetto al solito.',
      'Occasionalmente mi sono sentito/a più felice o allegro/a rispetto al solito.',
      'Spesso mi sono sentito/a più felice o allegro/a rispetto al solito.',
      'Frequentemente mi sono sentito/a più felice o allegro/a rispetto al solito.',
      'Mi sono sentito/a sempre più felice o allegro/a rispetto al solito.',
    ],
  },
  {
    id: 2,
    text: 'Domanda 2',
    options: [
      'Non mi sono sentito/a più sicuro/a di me rispetto al solito.',
      'Occasionalmente mi sono sentito/a più sicuro/a di me rispetto al solito.',
      'Spesso mi sono sentito più sicuro/a di me rispetto al solito.',
      'Frequentemente mi sono sentito/a più sicuro/a di me rispetto al solito.',
      'Mi sono sentito/a sempre estremamente sicuro/a di me.',
    ],
  },
  {
    id: 3,
    text: 'Domanda 3',
    options: [
      'Non ho avuto bisogno di dormire meno rispetto al solito.',
      'Occasionalmente ho avuto bisogno di dormire meno rispetto al solito.',
      'Spesso ho avuto bisogno di dormire meno rispetto al solito.',
      'Frequentemente ho avuto bisogno di dormire meno rispetto al solito.',
      'Sono riuscito a stare tutto il giorno e tutta la notte senza dormire e senza sentirmi stanco.',
    ],
  },
  {
    id: 4,
    text: 'Domanda 4',
    options: [
      'Non ho parlato di più rispetto al solito.',
      'Occasionalmente ho parlato di più rispetto al solito.',
      'Spesso ho parlato di più rispetto al solito.',
      'Frequentemente ho parlato di più rispetto al solito.',
      'Ho parlato in continuazione e senza fermarmi.',
    ],
  },
  {
    id: 5,
    text: 'Domanda 5',
    options: [
      'Non sono stato più attivo/a rispetto al solito (socialmente, sessualmente, al lavoro, a casa o a scuola).',
      'Occasionalmente sono stato più attivo/a rispetto al solito.',
      'Spesso sono stato più attivo/a rispetto al solito.',
      'Frequentemente sono stato più attivo/a rispetto al solito.',
      'Sono stato sempre costantemente attivo/a e in movimento.',
    ],
  },
];
