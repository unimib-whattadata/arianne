"use client";

import { Brain, Link, Puzzle, Shell } from "lucide-react";
import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import type { FormValues } from "~/app/questionnaire/_schema/therapy-form-schema";
import { cn } from "~/lib/utils";

const OPTIONS = [
  {
    value: 0,
       title: "Cognitivo comportamentale",
    description: "È un approccio pratico e centrato sul presente. Aiuta a riconoscere pensieri e comportamenti che generano disagio e a sviluppare strategie per cambiarli. Il percorso è strutturato e mira a fornire strumenti concreti per affrontare le difficoltà quotidiane",
    icon: <Brain className="h-6 w-6 text-[#FF8C42]" />,
   
  },
  {
    value: 1,
    title: "Sistemico relazionale",
    description: "Considera l’individuo all’interno delle sue relazioni significative, come famiglia e coppia. Analizza le dinamiche interpersonali per comprendere come influenzano il benessere della persona. Il lavoro terapeutico si svolge osservando e trasformando queste connessioni",
    icon: <Link className="h-6 w-6 text-[#FF8C42]" />,
   
  },
  {
    value: 2,
 title: "Integrato",
    description: "Combina tecniche e strumenti provenienti da diversi approcci terapeutici. Il percorso viene personalizzato in base alle esigenze e alle caratteristiche della persona. È un modello flessibile che adatta il trattamento al singolo individuo",
    icon: <Puzzle className="h-6 w-6 text-[#FF8C42]" />,
  },
    {
    value: 3,
 title: "Psicodinamico",
    description: "Esplora i vissuti interiori e le emozioni profonde, spesso legate al passato. Mira a portare alla luce aspetti inconsci che influenzano il modo di vivere e relazionarsi. Il percorso favorisce una maggiore consapevolezza e comprensione di sé",
    icon: <Shell className="h-6 w-6 text-[#FF8C42]" />,
  },
    {
    value: 4,
 title: "",
    description: "È indifferente",
    icon: '',
  },
    
];

export const PreferredOrientation = () => {
  const { control, reset, getValues } = useFormContext<FormValues>();

  return (
    <div className="flex w-full flex-col gap-6 p-6 md:p-10">
      <FormField
        control={control}
        name="preferredOrientation"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-2xl font-semibold">
              CPreferisci un orientamento terapeutico specifico?

            </FormLabel>
            <FormDescription className="text-lg">Se non hai specifiche preferenze, il nostro team valuterà la scelta migliore in base alle risposte che hai fornito 
            </FormDescription>
            <FormControl>
              <div className="mt-10 flex flex-col gap-3">
                {OPTIONS.map((option) => {
                  const isSelected = field.value === option.value;

                  return (
                    <div
                      key={option.value}
                      role="button"
                      onClick={() => {
                      
                        const currentValues = getValues();

                        reset({
                          name: currentValues.name,
                          age: currentValues.age,
                          gender: currentValues.gender,
                        });
                      }}
                      className={cn(
                        "flex h-full flex-col justify-between rounded-lg border border-transparent p-6 text-left transition",
                        isSelected
                          ? "bg-[#FDE8DC]"
                          : "bg-[#DFEBEF] hover:bg-[#cae3e9]",
                      )}
                    >
                      <div className="flex flex-col gap-2">
                        <div className="text-[#006279]">{option.icon}</div>
                        <h3 className="text-xl font-semibold">
                          {option.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <p className="text-muted-foreground text-lg">
                            {option.description}
                          </p>
                         
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </FormControl>
          </FormItem>
        )}
      />

      
    </div>
  );
};
