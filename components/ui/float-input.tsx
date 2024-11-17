import React, { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface FloatInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function FloatInput({ label, className, ...props }: FloatInputProps) {
  return (
    <div className="relative">
      <input
        {...props}
        placeholder=" "
        className={cn(
          "block w-full rounded-md border bg-background px-3 pt-3 pb-2 text-base ring-offset-background",
          "text-gray-950 dark:text-gray-100 dark:placeholder:text-zinc-300 focus-visible:outline-none",
          "peer", // Important for sibling selection
          className
        )}
      />
      <label
        className={cn(
          "absolute left-3 top-3 z-10 origin-[0] -translate-y-5 scale-75",
          "transform px-2 text-sm duration-200 bg-background",
          "peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100",
          "peer-focus:-translate-y-5 peer-focus:scale-75",
          "text-gray-800 dark:text-zinc-300"
        )}
      >
        {label}
      </label>
    </div>
  );
}