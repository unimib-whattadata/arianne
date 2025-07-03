"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import type { z } from "zod";

import { Form } from "~/components/ui/form";
import { cn } from "~/lib/utils";

import { stepsMap, getStepFlow } from "./_lib/step-flow";
import Navbar from "./_components/navbar";
import { getDefaultFormValues } from "./_lib/get-default-values";
import FullSchema from "./_schema/therapy-form-schema";

export default function QuestionnairePage() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [submittedData, setSubmittedData] = useState<z.infer<
    typeof FullSchema
  > | null>(null);

  const form = useForm<z.infer<typeof FullSchema>>({
    resolver: zodResolver(FullSchema),
    mode: "onChange",
    defaultValues: getDefaultFormValues("individual"),
  });

  const formValues = useWatch({ control: form.control });
  const flow = getStepFlow(formValues as z.infer<typeof FullSchema>);
  const currentStepKey = flow[currentStepIndex];
  const StepComponent = currentStepKey
    ? (stepsMap[currentStepKey] as React.FC<{ form: typeof form }>)
    : null;

  const handleNextStep = () => {
    setCurrentStepIndex((prev) =>
      flow.length ? Math.min(prev + 1, flow.length - 1) : 0,
    );
  };

  const handlePrevStep = () => {
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = () => {
    setSubmittedData(formValues as z.infer<typeof FullSchema>);
  };

  return (
    <div
      className={cn(
        "flex h-dvh flex-col items-center gap-6 p-6 md:p-10",
        currentStepIndex === 0 ? "justify-center" : "justify-between",
      )}
    >
      <Form {...form}>
        {StepComponent ? <StepComponent form={form} /> : null}

        <Navbar
          currentStep={currentStepIndex}
          totalSteps={flow.length}
          handleNextStep={handleNextStep}
          handlePrevStep={handlePrevStep}
          handleOnSubmit={onSubmit}
        />
      </Form>
      {submittedData && (
        <p className="mt-6 w-full max-w-4xl rounded bg-gray-100 p-4 text-sm">
          {JSON.stringify(formValues, null, 2)}
        </p>
      )}
    </div>
  );
}
