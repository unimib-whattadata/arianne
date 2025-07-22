import { MoveRight, Plus } from "lucide-react";
import {
  Accordion,
  AccordionTrigger,
  AccordionContent,
  AccordionItem,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

const faqs = [
  {
    title: "Chi può iscriversi?",
    content: "Chi è iscritto all'albo degli piscologi o psicoterapeuti",
  },
  {
    title: "Serve la partita IVA?",
    content: "Sì, è necessaria per collaborare come libero professionista",
  },
  {
    title: "Dove funziona Arianne?",
    content: "Online, in tutta Europa",
  },
  {
    title: "C'è assistenza?",
    content: "Sì, è previsto supporto tecnico e operativo",
  },
];

export const FaqSection = () => {
  return (
    <section id="info" className="scroll-mt-8 py-12 lg:py-24">
      <div className="container mx-auto grid place-items-center gap-16 px-4 md:grid-cols-2">
        <div className="grid h-full w-full max-w-80 place-content-center">
          <h2 className="text-h2 mb-4 font-medium">Informazioni utili</h2>
          <Accordion
            type="multiple"
            className="w-80"
            defaultValue={Array.from({ length: faqs.length }, (_, i) =>
              String(i),
            )}
          >
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={String(index)}
                className="border-0"
              >
                <AccordionTrigger
                  className="text-h3! items-center font-medium [&[data-state=open]>svg]:rotate-45"
                  hideDefaultIcon
                >
                  <Plus className="pointer-events-none size-5 shrink-0 transition-transform duration-200" />
                  {faq.title}
                </AccordionTrigger>
                <AccordionContent className="pl-8">
                  {faq.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <div>
          <Card className="bg-secondary-light h-full max-h-80 w-full max-w-80 place-content-center border-0 shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MoveRight className="text-white" />
                Vuoi iscriverti?
              </CardTitle>
            </CardHeader>
            <CardContent>
              Hai tutti i requisiti richiesti?
              <br />
              Attiva il tuo profilo in pochi minuti
            </CardContent>
            <CardFooter>
              <Button variant="secondary" className="w-full">
                Iscriviti ora
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
};
