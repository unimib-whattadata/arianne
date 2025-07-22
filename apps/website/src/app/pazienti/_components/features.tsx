import {
  BrainCircuit,
  ChartSpline,
  LayoutDashboard,
  NotebookPen,
  SquareActivity,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

const content = [
  {
    icon: SquareActivity,
    title: "Monitoraggio smart",
    description:
      "Tieni traccia di come ti senti ogni giorno. L'app ti permette di registrare i tuoi pensieri, emozioni e sintomi in modo semplice e sicuro",
  },
  {
    icon: LayoutDashboard,
    title: "Gestione del percorso",
    description:
      "Il tuo terapeuta ha una visione completa dei tuoi progressi, così può seguirti meglio e adattare il percorso alle tue esigenze",
  },
  {
    icon: BrainCircuit,
    title: "Supporto intelligente",
    description:
      "Grazie alla tecnologia, il tuo benessere viene seguito con attenzione, per offrirti un supporto più personalizzato e tempestivo",
  },
  {
    icon: ChartSpline,
    title: "Dati chiari e utili",
    description:
      "Rispondere a brevi questionari ti aiuta a comprendere meglio come stai e a condividere queste informazioni con chi ti segue",
  },
  {
    icon: Users,
    title: "Condivisione sicura",
    description:
      "Tutti i dati che condividi sono protetti e utilizzati solo per migliorare il tuo percorso di benessere",
  },
  {
    icon: NotebookPen,
    title: "Utilizzo versatile",
    description:
      "Puoi usare l'app dove e quando vuoi, per rimanere sempre in contatto con il tuo terapeuta e ricevere supporto costante",
  },
];

export const FeaturesSection = () => {
  return (
    <section
      id="features"
      className="bg-primary-light scroll-mt-8 px-4 py-12 md:py-24"
    >
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-h2 text-center font-semibold text-balance">
          Funzionalità pensate per te
        </h2>
        <div className="mx-auto mt-8 grid w-full gap-10 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
          {content.map((item, index) => (
            <Card
              key={index}
              className="group bg-primary-light gap-3 border-0 p-0 shadow-none"
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
