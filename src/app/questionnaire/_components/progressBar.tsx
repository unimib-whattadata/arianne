"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface CurvedProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function CurvedProgressBar({
  currentStep,
  totalSteps,
}: CurvedProgressBarProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);
function getNormalizedProgressRatio(currentStep: number, totalSteps: number): number {
  const fixedStartSteps = 6;
  const fixedEndSteps = 7;
  const totalAvailableSteps = 26;

  if (totalSteps > totalAvailableSteps) totalSteps = totalAvailableSteps;

  const variableSteps = totalSteps - fixedStartSteps - fixedEndSteps;

  if (variableSteps <= 0) {
    return currentStep / totalSteps;
  }

  if (currentStep <= fixedStartSteps) {
    return (currentStep / fixedStartSteps) * 0.2;
  }

  if (currentStep <= fixedStartSteps + variableSteps) {
    const currentVariableStep = currentStep - fixedStartSteps;
    return 0.2 + (currentVariableStep / variableSteps) * 0.6;
  }

  const currentFinalStep = currentStep - fixedStartSteps - variableSteps;
return 0.8 + (currentFinalStep / (fixedEndSteps - 1)) * 0.2;
}

const progressRatio = getNormalizedProgressRatio(currentStep, totalSteps);


  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      setPathLength(length);
    }
  }, []);

  return (
    <div className="w-full ">
      <svg
  viewBox="0 0 1230 127"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  className="w-full min-h-24"
  style={{ height: "auto" }}
>
  <path
d="M1 96.6759C1 96.6759 127.985 109.593 209.5 107.676C357.862 104.187 437.366 26.813 584.5 46.1759C629.121 52.0481 670.5 65.6756 697 71.1759C721.846 76.333 746.5 49.1702 746.5 29.6759C746.5 10.1816 723 4.67136 704 3.17135C685 1.67135 653 10.0344 653 27.6709C653 43.6699 660.003 53.7884 668 64.0834C677 75.6699 808 86.1699 947.5 106.176C1055.85 121.715 1227 127.176 1227 127.176"   stroke="#E2E8F0" strokeWidth={6}/>
  
  
  <motion.path
    ref={pathRef}
d="M1 96.6759C1 96.6759 127.985 109.593 209.5 107.676C357.862 104.187 437.366 26.813 584.5 46.1759C629.121 52.0481 670.5 65.6756 697 71.1759C721.846 76.333 746.5 49.1702 746.5 29.6759C746.5 10.1816 723 4.67136 704 3.17135C685 1.67135 653 10.0344 653 27.6709C653 43.6699 660.003 53.7884 668 64.0834C677 75.6699 808 86.1699 947.5 106.176C1055.85 121.715 1227 127.176 1227 127.176"  stroke="#ff8c42"   fill="none"
    strokeWidth={6}
    strokeDasharray={pathLength}
strokeDashoffset={pathLength * (1 - progressRatio)}
    style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
  />
</svg>

    </div>
  );
}
