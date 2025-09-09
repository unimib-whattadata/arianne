export const INSTRUCTIONS = `<p>
Nel questionario che segue si utilizza la definizione di attacco di
panico come un&apos;improvvisa ondata di paura o disagio
accompagnata da almeno quattro dei sintomi &ldquo;ondata
improvvisa&rdquo; è necessario che i sintomi raggiungano il loro
massimo nei primi dieci minuti. Di seguito si trovano elencati i
sintomi da prendere in considerazione:
</p>
<ul className="ml-4 list-disc">
<li>
  battito cardiaco accelerato o martellante dolore o fastidio al
  petto
</li>
<li>brividi o vampate di calore tremori</li>
<li>sudore</li>
<li>nausea</li>
<li>paura di perdere il controllo o di impazzire</li>
<li>vertigini o debolezza</li>
<li>affanno allucinazioni</li>
<li>senso di soffocamento</li>
<li>formicolio</li>
</ul>
Per ognuna delle seguenti domande, rispondi indicando una fra le alternative che meglio descrive la tua esperienza.`;

export const QUESTIONS = [
  {
    id: 1,
    text: 'Quanti attacchi di panico si sono presentati durante la settimana?',
    options: [
      'Nessun attacco o episodio di sintomi limitati',
      'Lieve: nessun attacco di panico vero e proprio e non più di un attacco di sintomi limitati al giorno',
      'Moderato: 1 o 2 attacchi di panico veri e proprio e/o attacchi di sintomi limitati multipli per giorno',
      'Severo: più di 2 attacchi veri e propri ma non più di uno al giorno',
      'Estremo: si presntano attacchi di panico veri e propri più di una volta al giorno, nella maggior parte dei giorni',
    ],
  },
  {
    id: 2,
    text: 'Se hai sofferto di attacchi di panico durante la settimana appena trascorsa, quando sono stati dolorosi o spaventosi nel momento in cui si verificavano? (Qualora abbia sofferto di più di un attacco, dai una risposta basata sulla media dei vari attacchi)',
    options: [
      'Per nulla doloroso, oppure nessun attacco di panico o sintomi limitati nel corso della setimana passata',
      'Leggermente doloroso (non troppo intenso)',
      'Moderatamente doloroso (intenso ma gestibile)',
      'Gravemente doloroso (molto intenso)',
      'Estremamente doloroso (dolore intenso durante tutti gli attacchi)',
    ],
  },
  {
    id: 3,
    text: 'Durante la settimana appena TherapistCountOutputTypeArgsSchema, quanto ti sei preoccupato/a o hai provato ansia pensando a quando si sarebbe potuto presentare il prossimo attacco di panico? (Per esempio, pensando di avere problemi legati alla salute fisica o mentale che potrebbero causarti imbarazzo a livello sociale)',
    options: [
      'Per nulla',
      'Occasionalmente o in maniera lieve',
      'Spesso o moderatamente',
      'molto spesso o ad un livello preoccupante',
      'Quasi ininterrottamente e ad un livello invalidante',
    ],
  },
  {
    id: 4,
    text: 'Nel corso della settimana appena trascorsa, hai evitato determinati luoghi o situazioni (ad esempio cinema, luoghi affollati, trasporti pubblici, tunnel, ponti, centri commerciali, solitudine) o ne hai avuto paura (vi siete sentiti a disagio o avete cercato di evitarli o abbandonarli) per il timore di poter avere un attacco di panico? Vi sono altre situazioni che avresti voluto evitare o di cui avresti avuto paura per il timore di poter avere un attacco di panico? Se la risposta ad entrambe le domande è sì, per favore indica quanto hai evitato e temuto queste situazioni nel corso della settimana appena trascorsa.',
    options: [
      'Nullo: nessuna paura o situazione evitata',
      'Lieve: paura e situazioni evitate con frequenza occasionale ma ancora gestibili e sopportabili senza che si siano verificati dei cambiamenti importanti per quanto riguarda il mio stile di vita.',
      'Moderato: paura e situazioni evitate si manifestano in modo più evidente ma comunque gestibile. Ho evitato alcune situazioni ma sarei stato in grado di affrontarle in compagnia di un amico. Nonostante vi siano stati alcuni cambiamenti nel mio stile di vita, sono stato comunque in grado di cavarmela nelle situazioni quotidiane.',
      'Severo: ho evitato un gran numero di situazioni. Evitare queste situazioni ha richiesto un cambiamento sostanziale del mio stile di vita rendendo così difficile il gestire le attività abituali.',
      'Estremo: Paura e situazioni evitate a livelli invalidanti. Il mio stile di vita ha richiesto cambiamenti radicali al punto da non poter svolgere alcuni compiti importanti.',
    ],
  },
  {
    id: 5,
    text: "Nel corso della settimana appena trascorsa hai evitato determinate attività (quali esercizio fisico, rapporti sessuali, docce o bagni caldi, prendere il caffè, guardare un film d'avventura o horror), ne hai avuto paura, ti sei è sentita/o a disagio o hai cercato di evitarli o abbandonarli perché ti hanno causato delle sensazioni simili a quelle di un attacco di panico o perché temevi che avrebbero causato un attacco di panico? Vi sono altre attività che avresti evitato o di cui avresti avuto paura per lo stesso motivo se si fossero presentate nel corso della settimana? Se la risposta ad entrambe le domande è sì, per favore indica quanto hai evitato e temuto queste situazioni nel corso della settimana appena trascorsa.",
    options: [
      'Nessuna paura o situazione o attività evitate a causa di sensazioni fisiche dolorose.',
      'Lieve: paura e/o situazioni evitate con frequenza occasionale. Nella maggior parte dei casi, però, sono stato in grado di confrontarmi o sopportare senza grandi difficoltà delle attività che mi causano sensazioni fisiche riuscendo a condurre il mio stile di vita abituale senza grandi cambiamenti.',
      "Moderato: situazioni evitate in modo più evidente ma comunque gestibile. Il mio stile di vita ha subito dei cambiamenti comunque limitati così da poter svolgere le attività quotidiane come d'abitudine.",
      'Severo: ho evitato un gran numero di situazioni, arrivando a modificare in modo sostanziale il mio stile di vita interferendo con le attività quotidiane',
      'Estremo: situazioni evitate a livelli invalidanti. Il mio stile di vita ha richiesto cambiamenti radicali al punto da non poter svolgere alcuni compiti importanti.',
    ],
  },
  {
    id: 6,
    text: 'Nel corso della settimana appena trascorsa, i sintomi elencati in precedenza (panico, preoccupazione e paura di situazioni e attività) quanto hanno interferito con la tua abilità di lavorare o di gestire le responsabilità in ambito domestico (qualora il vostro lavoro o le responsabilità domestiche avessero subito una riduzione nel corso della settimana trascorsa, rispondete spiegando in che modo vi sareste comportati qualora le responsabilità fossero rimaste invariate).',
    options: [
      'Nessuna interferenza nel lavoro o nelle responsabilità domestiche',
      'Lievi differenze riscontrate nel lavoro o nelle responsabilità domestiche, ma sono stato comunque in grado di fare quasi tutto quello che avrei fatto se non avessi avuto questi problemi.',
      'Interferenze significative riscontrate nel lavoro o nelle responsabilità domestiche, ma sono stato comunque in grado di fare tutto quello che avevo bisogno di fare.',
      'Grande disagio nel lavoro o nelle responsabilità domestiche: non ho potuto svolgere molti compiti importanti a causa di questi problemi.',
      'Disagio estremo ed invalidante che mi ha reso incapace di gestire alcun tipo di lavoro o di responsabilità domestica.',
    ],
  },
  {
    id: 7,
    text: "Nel corso della settimana appena trascorsa, quanto hanno interferito con la tua vita sociale gli attacchi di panico, la preoccupazione dovuta agli attacchi e la paura di situazioni ed attività? (Se non hai avuto occasione di socializzare nel corso della settimana passata rispondi indicando come ti saresti comportata/o qualora ne avessi avuto l'opportunità.)",
    options: [
      'Nessuna interferenza',
      'Lievi interferenze con le attività di tipo sociale ma sono stato comunque in grado di cavarmela come se non avessi avuto alcun tipo di problema.',
      'Interferenze significative con le attività di tipo sociale, ma sono stato comunque in grado di cavarmela nella maggior parte dei casi facendo uno sforzo',
      'Disagio sostanziale nelle attività di tipo sociale: mi è stato spesso impossibile svolgere attività di tipo sociale a causa di questi problemi.',
      'Disagio estremo ed invalidante al punto da impedirmi di svolgere qualsiasi attività di tipo sociale.',
    ],
  },
];
