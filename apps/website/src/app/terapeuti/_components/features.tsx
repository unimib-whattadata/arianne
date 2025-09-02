import {
  ChartSpline,
  ClipboardList,
  GlobeLock,
  NotebookPen,
  Smartphone,
  Video,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

const content = [
  {
    icon: Video,
    title: "Sedute video sicure",
    description:
      "Conduci le tue sessioni direttamente sulla piattaforma, in modo protetto e senza software esterni",
  },
  {
    icon: Smartphone,
    title: "App mobile per pazienti",
    description:
      "I tuoi pazienti possono registrare sintomi, pensieri ed emozioni, e comunicare con te facilmente",
  },
  {
    icon: ClipboardList,
    title: "Questionari digitali",
    description:
      "Somministra test e scale psicometriche in pochi clic, con analisi automatica dei risultati",
  },
  {
    icon: ChartSpline,
    title: "Monitoraggio terapeutico",
    description:
      "Tieni traccia dell'andamento dei tuoi pazienti e supporta decisioni più consapevoli",
  },
  {
    icon: GlobeLock,
    title: "Sicurezza e privacy",
    description:
      "Tutti i dati sono gestiti in conformità al GDPR e archiviati in modo sicuro",
  },
  {
    icon: NotebookPen,
    title: "Utilizzo versatile",
    description:
      "Arianne si adatta sia al lavoro clinico privato che alla ricerca, grazie a funzionalità di raccolta e analisi dati anche anonimi",
  },
];

export const FeaturesSection = () => {
  return (
    <section
      id="features"
      className="bg-secondary-light scroll-mt-8 px-4 py-12 md:py-24"
    >
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-h2 text-center font-semibold text-balance">
          Tutti gli strumenti, in un unica piattaforma
        </h2>
        <div className="mx-auto mt-8 grid w-full gap-10 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
          {content.map((item, index) => (
            <Card
              key={index}
              className="group bg-secondary-light gap-3 border-0 p-0 shadow-none"
            >
              <CardHeader className="p-0">
                <item.icon className="size-6 text-white" aria-hidden />

                <h3 className="font-medium">{item.title}</h3>
              </CardHeader>

              <CardContent className="p-0">
                <p>{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
