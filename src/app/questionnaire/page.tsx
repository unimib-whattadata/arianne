"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { Form } from "~/components/ui/form";
import { cn } from "~/lib/utils";

import { Step1 } from "./_components/_steps/step1";
import { Step2 } from "./_components/_steps/step2";
import { Step3 } from "./_components/_steps/step3";
import { Step4 } from "./_components/_steps/step4";
import { Step5 } from "./_components/_steps/step5";
import { Couple } from "./_components/_steps/stepCouple";
import { Family } from "./_components/_steps/stepFamily";
import { Individual } from "./_components/_steps/stepIndividual";
import Navbar from "./_components/navbar";
import { getDefaultFormValues } from "./_lib/get-default-values";
import FullSchema from "./_schema/therapy-form-schema";
import { IndividualDetail0 } from "./_components/_steps/_individualDetails/individualDetail0";

export default function QuestionnairePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [path] = useState<"individual" | "couple" | "family">(
    "individual",
  );

  const form = useForm<z.infer<typeof FullSchema>>({
    resolver: zodResolver(FullSchema),
    mode: "onChange",
    defaultValues: getDefaultFormValues(path),
  });

  const Steps = () => {
    switch (currentStep) {
      case 1:
        return <Step2 />;
      case 2:
        return <Step3 />;
      case 3:
        return <Step4 />;
      case 4:
        return <Step5 />;
      case 5:
        return <Individual />;
      case 6:
        return <Couple />;
      case 7:
        return <Family />;
      case 8:
        return <IndividualDetail0 />;
      default:
        return <Step1 />;
    }
  };

  return (
    <div
      className={cn(
        "flex h-[calc(100%_-_var(--footer-height))] flex-col items-center gap-6 p-6 md:p-10",
        currentStep === 0 ? "justify-center" : "justify-between",
      )}
    >
      <Form {...form}>
        <Steps />
        <Navbar
          currentStep={currentStep}
          handleNextStep={() => {
            setCurrentStep((prev) => Math.min(prev + 1, 12));
            console.log(form.getValues());
          }}
          handlePrevStep={() => {
            setCurrentStep((prev) => Math.max(prev - 1, 0));
            console.log(form.getValues());
          }}
        />
      </Form>
    </div>
  );
}
