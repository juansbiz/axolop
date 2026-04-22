/**
 * Collapsible Component
 * Based on Radix UI Collapsible primitive
 * Used for organizing settings into expandable sections
 */

import * as React from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <CollapsiblePrimitive.Trigger
      ref={ref}
      className={cn(
        "flex w-full items-center justify-between py-3 px-4 text-sm font-medium transition-all",
        "hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg",
        "[&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </CollapsiblePrimitive.Trigger>
  )
);
CollapsibleTrigger.displayName = CollapsiblePrimitive.Trigger.displayName;

const CollapsibleContent = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <CollapsiblePrimitive.Content
      ref={ref}
      className={cn(
        "overflow-hidden transition-all",
        "data-[state=closed]:animate-collapse-up",
        "data-[state=open]:animate-collapse-down",
        className
      )}
      {...props}
    >
      <div className="pb-4 pt-2 px-4">{children}</div>
    </CollapsiblePrimitive.Content>
  )
);
CollapsibleContent.displayName = CollapsiblePrimitive.Content.displayName;

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
