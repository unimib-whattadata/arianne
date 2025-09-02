export const INSTRUCTIONS =
  'Per ognuna delle seguenti domande, rispondi indicando una fra le alternative che meglio descrive la tua esperienza.';

export const QUESTIONS = [
  {
    id: 1,
    text: ' Comportamenti distruttivi antisociali o aggressivi',
    description:
      'Valutare tutti i comportamenti di questo tipo indipendentemente dalla causa (ad esempio disturbo ipercinetico, depressione, autismo, dipendenza da alcool o da droghe). <ul> <strong> Considerare </strong>: <li>  <strong> a)  </strong>l’aggressività fisica o verbale (ad esempio spingere, colpire, commettere atti di vandalismo, prendere in giro) o l’abuso fisico o sessuale verso altri bambini.</li> <li> <strong> b)</strong> i comportamenti antisociali (ad esempio rubare, mentire, imbrogliare) o i comportamenti oppositivi (ad esempio provocare, opporsi frequentemente all’autorità, avere accessi di collera)</li> </ul>  <br>  Non considerare qui per l’attribuzione del punteggio l’iperattività, da valutare alla Scala 2, il marinare la scuola, da valutare alla Scala 13, i comportamenti autolesivi, da valutare alla Scala 3.',
    options: [
      'Nessun problema di questo tipo durante il periodo di riferimento.',
      'Piccoli litigi, capricci, eccessiva irritabilità, bugie, ecc.',
      'Comportamenti certamente distruttivi o antisociali, evidenti ma non gravi.',
      'Comportamenti aggressivi o antisociali abbastanza gravi.',
      'Distruttivo nella maggior parte delle attività, o almeno un grave attacco fisico verso altre persone o animali o una grave distruzione di cose.',
    ],
  },
  {
    id: 2,
    text: ' Iperattività o difficoltà di attenzione o di concentrazione',
    description:
      '<strong> Considerare</strong>: <br>  <ul> <strong>a)</strong> tutti i comportamenti iperattivi indipendentemente dalla causa (ad esempio disturbo ipercinetico, mania, o uso di droghe).</li> <li> <strong>b)</strong> i problemi di irrequietezza, agitazione, disattenzione o di scarsa concentrazione indipendentemente dalla causa (ad esempio anche la depressione).</li> </ul>',
    options: [
      'Nessun problema di questo tipo durante il periodo di riferimento.',
      'Leggera iperattività o irrequietezza.',
      'Problemi evidenti ma non gravi di iperattività e/o di attenzione, che possono ancora essere controllati.',
      'Problemi abbastanza gravi di iperattività e/o di attenzione, a volte incontrollabili.',
      'Problemi gravi di iperattività e/o attenzione che sono presenti nella maggior parte delle attività e non sono quasi mai controllabili.',
    ],
  },
  {
    id: 3,
    text: ' Gesti autolesivi non accidentali',
    description:
      'Considerare sia gesti autolesivi come ad esempio colpirsi o tagliarsi, sia i tentativi di suicidio (con farmaci, soffocamento, annegamento, ecc.).',
    options: [
      'Nessun problema di questo tipo durante il periodo di riferimento.',
      'Pensieri occasionali di morte o autolesivi che non vengono agiti. Nessun pensiero di suicidio o di autolesione.',
      'Gesti autolesivi senza gravi danni e vero pericolo, come ad esempio tagliuzzarsi i polsi, associati o meno a pensieri di tipo suicidario.',
      'Intenzione abbastanza grave di suicidarsi o tentativo di suicidio con limitato pericolo.',
      'Tentativo serio di suicidio o grave deliberato atto autolesivo.',
    ],
  },
  {
    id: 4,
    text: 'Uso di alcol e di droghe',
    description:
      'Considerare il consumo di alcool e l’uso di droghe/solventi, tenendo conto dell’età cronologica e delle norme sociali.',
    options: [
      'Nessun problema di questo tipo durante il periodo di riferimento.',
      'Uso limitato di alcool o di droghe, compatibile con le norme sociali relative all’età del soggetto.',
      'Uso superiore alle norme sociali di alcool o di droghe.',
      'Problemi abbastanza gravi di alcool o di droga.',
      'Problemi gravi di alcool o di droga che portano a dipendenza o a incapacità.',
    ],
  },
  {
    id: 5,
    text: ' Problemi di apprendimento o di linguaggio',
    description:
      'Considerare tutti i problemi di lettura, di scrittura, di aritmetica o di linguaggio indipendentemente dalla causa (ad esempio problema specifico di apprendimento o menomazioni fisiche quali deficit uditivi).',
    options: [
      'Nessun problema di questo tipo durante il periodo di riferimento.',
      'Lievi difficoltà, comprese all’interno delle variazioni della norma.',
      'Carenze evidenti ma non gravi, anche se di rilevanza clinica.',
      'Problemi abbastanza gravi, con un funzionamento al di sotto del livello atteso in base all’età mentale, alla prestazione passata o alla eventuale disabilità fisica presente.',
      'Problemi gravi, con un funzionamento nettamente al di sotto del livello atteso in base all’età mentale, alla prestazione passata o alla eventuale disabilità fisica presente.',
    ],
  },
  {
    id: 6,
    text: ' Malattie fisiche o disabilità fisiche',
    description:
      'Considerare le malattie fisiche o le menomazioni fisiche che limitano o impediscono i movimenti, peggiorano la vista o l’udito o limitano in qualche altro modo il funzionamento individuale.',
    options: [
      'Nessuna limitazione del funzionamento anche in presenza di eventuali problemi di salute fisica durante il periodo di riferimento.',
      'Leggera disabilità (conseguenza ad esempio di un raffreddore, di una caduta non grave, ecc.).',
      'Limitazioni evidenti ma non gravi del funzionamento dovuti a problemi di salute fisica.',
      'Limitazioni abbastanza gravi dell’attività dovute a un problema di salute fisica.',
      'Disabilità totale o quasi dovuta a problemi di salute fisica.',
    ],
  },
  {
    id: 7,
    text: 'Allucinazioni, deliri o percezioni anomale',
    description:
      'Considerare le allucinazioni e i deliri, indipendentemente dalla diagnosi, i comportamenti strani e bizzarri associati ad allucinazioni e deliri, la presenza e le conseguenze di idee di riferimento o di percezioni abnormi diverse dalle allucinazioni.',
    options: [
      'Nessun indizio di pensieri o percezioni abnormi durante il periodo di riferimento.',
      'Credenze piuttosto strane o eccentriche, difformi dalle credenze e dai valori culturalmente condivisi.',
      'Presenza di idee di riferimento e di percezioni abnormi con scarsa sofferenza o moderati comportamenti bizzarri.',
      'Soggetto abbastanza spesso in preda a deliri o percezioni abnormi con evidente sofferenza e/o comportamenti bizzarri.',
      'Stato mentale e comportamenti gravemente influenzati da deliri o percezioni abnormi con marcato impatto sul soggetto o su altri.',
    ],
  },
  {
    id: 8,
    text: ' Sintomi somatici non organici',
    description:
      'Considerare i sintomi fisici senza causa organica, come gastrointestinali, cardiovascolari, neurologici, disturbi del sonno, stanchezza cronica.',
    options: [
      'Nessun problema di questo tipo durante il periodo di riferimento.',
      'Problemi lievi (enuresi occasionale, difficoltà di sonno, mal di testa o mal di stomaco senza una base organica).',
      'Problemi moderati ma decisamente presenti.',
      'Sintomi abbastanza gravi da comportare una certa limitazione in alcune attività.',
      'Problemi gravi o molto gravi che interferiscono con la maggior parte delle attività e causano forte disagio.',
    ],
  },
  {
    id: 9,
    text: 'Disturbi e sintomi della sfera emotiva',
    description:
      'Valutare sintomi come depressione, ansia, preoccupazioni, paure, fobie, ossessioni o compulsioni, causati da qualsiasi condizione clinica, inclusi i disturbi alimentari.',
    options: [
      'Nessuna evidenza di depressione, ansia, paure o fobie nel periodo di riferimento.',
      'Lieve stato di ansia, demoralizzazione, tristezza o cambiamenti passeggeri di umore.',
      'Sintomi evidenti ma non gravi, non preoccupanti.',
      'Sintomi abbastanza gravi che interferiscono con alcune attività e sono talvolta incontrollabili dal soggetto.',
      'Sintomi gravi che interferiscono con tutte le attività e sono quasi sempre incontrollabili dal soggetto.',
    ],
  },
  {
    id: 10,
    text: 'Relazioni con i pari',
    description:
      'Considerare i problemi con i compagni di scuola e la rete sociale, legati sia al ritiro attivo o passivo dalle relazioni sociali, sia a eccessiva invadenza, sia a scarsa abilità nelle relazioni interpersonali, sia alle conseguenze dell’essere vittima di comportamenti aggressivi o di bullismo.',
    options: [
      'Nessun problema degno di nota durante il periodo di riferimento.',
      'Problemi lievi e transitori, ritiro sociale occasionale.',
      'Problemi evidenti ma non gravi nello stabilire o mantenere i rapporti con i pari, con un certo disagio.',
      'Problemi di media gravità dovuti al ritiro dalle relazioni sociali, eccessiva invadenza o relazioni problematiche.',
      'Grave isolamento sociale, assenza completa di amici dovuta a disabilità nella comunicazione sociale o a ritiro totale.',
    ],
  },
  {
    id: 11,
    text: ' Cura di sé e autonomia',
    description:
      'Valutare il livello generale di funzionamento nelle attività di base della cura di sé (mangiare, lavarsi, vestirsi, curare l’aspetto) e nelle attività strumentali (gestire il denaro, viaggiare da solo, fare compere, ecc.), considerando quanto ci si aspetta data l’età del soggetto.',
    options: [
      'Nessun problema durante il periodo considerato; buona abilità di funzionamento in tutte le aree.',
      'Solo problemi lievi, per esempio una certa trascuratezza o disorganizzazione.',
      'Cura di sé adeguata, ma evidenti difficoltà in una o più abilità strumentali.',
      'Problemi evidenti in una o più aree della cura di sé o incapacità in molte abilità strumentali.',
      'Grave disabilità in tutte o quasi tutte le aree della cura di sé e/o delle abilità strumentali.',
    ],
  },
  {
    id: 12,
    text: 'Vita familiare e di relazione',
    description:
      'Valutare i problemi di relazione con i genitori, anche adottivi, e con i fratelli, sia conviventi sia viventi altrove. Se il soggetto vive in una struttura residenziale, valutare le relazioni con operatori sociali e insegnanti.',
    options: [
      'Nessun problema durante il periodo di riferimento.',
      'Problemi lievi o transitori.',
      'Problemi evidenti ma non gravi, legati a episodi occasionali di trascuratezza o ostilità.',
      'Problemi abbastanza gravi: il soggetto è stato trascurato o è stato oggetto di ostilità o maltrattato.',
      'Problemi gravi o molto gravi: il soggetto si sente o è stato maltrattato, abusato o seriamente trascurato dalla famiglia o da chi ne dovrebbe avere cura.',
    ],
  },
  {
    id: 13,
    text: ' Frequenza della scuola',
    description:
      'Considerare il marinare la scuola, il rifiuto della scuola, ma anche il ritiro o la sospensione dalla scuola, per qualsiasi motivo.',
    options: [
      'Nessun problema di questo tipo durante il periodo di riferimento.',
      'Problemi lievi, per esempio arrivare in ritardo a due o più lezioni.',
      'Problemi evidenti ma non gravi, per esempio ha perso alcune lezioni perché ha marinato la scuola o si è rifiutato di andare a scuola.',
      'Problemi abbastanza gravi, ad esempio assenza per molti giorni da scuola nel periodo di riferimento.',
      'Problemi gravi, assenza per quasi tutti o tutti i giorni, sospensioni o espulsioni da scuola dovute a qualsiasi motivo, nel periodo di riferimento.',
    ],
  },
  {
    id: 14,
    text: ' Conoscenze sulla natura delle difficoltà',
    description:
      'Considerare la mancanza di informazioni comprensibili e utili sulla diagnosi, sulle cause o sulla prognosi della condizione.',
    options: [
      'Nessun problema durante il periodo di riferimento. I genitori o chi si prende cura sono stati adeguatamente informati sulla condizione del soggetto.',
      'Solo problemi lievi.',
      'Problemi evidenti ma non gravi.',
      'Problemi abbastanza gravi. I genitori o chi si prende cura hanno conoscenze molto scarse o scorrette sulla condizione, il che causa disagio o difficoltà.',
      'Problema molto grave. I genitori non comprendono la condizione del soggetto.',
    ],
  },
  {
    id: 15,
    text: 'Informazioni sui servizi disponibili',
    description:
      'Considerare se i genitori o chi si prende cura mancano di informazioni comprensibili e utili sui servizi disponibili (programmi di terapia, educazione, assistenza, in rapporto ai bisogni del soggetto).',
    options: [
      'Nessun problema durante il periodo di riferimento. Tutti i servizi di cui il soggetto ha bisogno sono noti.',
      'Solo problemi lievi.',
      'Problemi evidenti ma non gravi.',
      'Problemi abbastanza gravi. I genitori o chi si prende cura sono stati poco informati sui servizi disponibili e sulla loro appropriatezza.',
      'Problemi molto gravi. I genitori non hanno informazioni sulla appropriatezza dei trattamenti o hanno ricevuto indicazioni contraddittorie o molto confuse.',
    ],
  },
];
