import { MoveRight, CheckCircle, Users, Globe, Headphones } from "lucide-react";
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
import { Badge } from "~/components/ui/badge";

const faqs = [
  {
    title: "Chi può iscriversi?",
    content: "Chi è iscritto all'albo degli psicologi o psicoterapeuti",
    icon: Users,
  },
  {
    title: "Serve la partita IVA?",
    content: "Sì, è necessaria per collaborare come libero professionista",
    icon: CheckCircle,
  },
  {
    title: "Dove funziona Arianne?",
    content: "Online, in tutta Europa",
    icon: Globe,
  },
  {
    title: "C'è assistenza?",
    content: "Sì, è previsto supporto tecnico e operativo",
    icon: Headphones,
  },
];

export const FaqSection = () => {
  return (
    <section
      id="info"
      className="scroll-mt-8 bg-gradient-to-br from-slate-50 to-blue-50 py-16 lg:py-24"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <Badge variant="secondary" className="mb-4 text-sm font-medium">
            FAQ
          </Badge>
          <h2 className="mb-4 text-3xl font-bold text-gray-900 lg:text-4xl">
            Informazioni utili
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Tutto quello che devi sapere per iniziare la tua collaborazione con
            Arianne
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-2">
          {/* FAQ Section */}
          <div className="space-y-6">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => {
                const IconComponent = faq.icon;
                return (
                  <AccordionItem
                    key={index}
                    value={String(index)}
                    className="rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
                  >
                    <AccordionTrigger className="group px-6 py-4 hover:no-underline">
                      <div className="flex items-center gap-4 text-left">
                        <div className="rounded-lg bg-blue-50 p-2 transition-colors group-hover:bg-blue-100">
                          <IconComponent className="text-secondary size-5" />
                        </div>
                        <span className="font-semibold text-gray-900">
                          {faq.title}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <div className="pl-12">
                        <p className="leading-relaxed text-gray-700">
                          {faq.content}
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>

          {/* CTA Card */}
          <div className="lg:sticky lg:top-8">
            <Card className="bg-secondary relative overflow-hidden border-0 text-white shadow-xl">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-white/10"></div>
              <div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-4 translate-y-4 rounded-full bg-white/5"></div>

              <CardHeader className="relative z-10 pb-4">
                <div className="mb-2 flex items-center gap-3">
                  <Badge
                    variant="secondary"
                    className="border-white/30 bg-white/20 text-white"
                  >
                    Inizia ora
                  </Badge>
                </div>
                <CardTitle className="text-secondary-foreground text-2xl font-bold">
                  Vuoi iscriverti?
                </CardTitle>
              </CardHeader>

              <CardContent className="relative z-10 space-y-4">
                <p className="text-secondary-foreground text-lg leading-relaxed">
                  Hai tutti i requisiti richiesti? Attiva il tuo profilo
                  professionale in pochi minuti.
                </p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-blue-100">
                    <CheckCircle className="size-4" />
                    <span className="text-secondary-foreground">
                      Processo di registrazione veloce
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-100">
                    <CheckCircle className="size-4" />
                    <span className="text-secondary-foreground">
                      Supporto dedicato incluso
                    </span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="relative z-10 pt-2">
                <Button variant={"outline"} className="w-full justify-center">
                  Iscriviti ora
                  <MoveRight className="ml-2 size-5" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
