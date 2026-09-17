import React from "react";
import { cn } from "@/lib/utils";

interface SeparatorProps {
  /** Tailwind background color class for the separator line (e.g., "bg-neutral-800", "bg-amber-200/30") */
  lineColor?: string;
  /** Tailwind background color class for the outer container wrapper (e.g., "bg-black", "bg-neutral-950") */
  bgColor?: string;
  /** Height of the line (defaults to 1px) */
  height?: string;
  /** Additional custom Tailwind styles for the wrapper */
  className?: string;
}

export const Separator = ({
  lineColor = "bg-neutral-800",
  bgColor = "bg-black",
  height = "h-[1px]",
  className,
}: SeparatorProps) => {
  return (
    <div className={cn("w-full overflow-hidden", bgColor, className)}>
      {/* Full-bleed line stretching 100vw regardless of parent padding */}
      <div
        className={cn(
          "relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen",
          height,
          lineColor
        )}
      />
    </div>
  );
};

export default Separator;