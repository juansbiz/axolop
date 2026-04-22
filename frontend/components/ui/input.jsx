import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 md:h-12 w-full rounded-lg border-0 bg-gray-50 px-5 py-2.5 text-sm text-gray-900",
          "dark:bg-[#1a1d23] dark:text-white",
          "ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          "placeholder:text-gray-400 dark:placeholder:text-gray-500",
          "transition-all duration-200 ease-out",
          "hover:bg-gray-100 dark:hover:bg-[#232830]",
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 focus-visible:scale-[1.01]",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-[#1a1d23]",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export { Input };
