import { cn } from "@/utils/tailwind";
import React, { type Dispatch, type SetStateAction } from "react";

export function FormIndicator({
  steps = 3,
  setStep,
  step,
}: {
  steps: number;
  setStep: Dispatch<SetStateAction<number>>;
  step: number;
}) {
  return (
    <div className="w-full flex items-center justify-between px-2">
      {Array.from({ length: steps }).map((_, index) => (
        <React.Fragment key={index}>
          <div
            key={index}
            className={cn(
              "rounded-full min-h-5 min-w-5 bg-white border-2 border-grey-4 cursor-pointer",
              index == step && "border-black"
            )}
          ></div>
          {index < steps - 1 && (
            <div
              className={cn(
                "w-full h-2 bg-grey-4",
                index < step && "bg-primary"
              )}
            ></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
