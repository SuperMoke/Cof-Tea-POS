// components/ui/loading-spinner.js
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming you have a utility for class names

export function LoadingSpinner({ className, text }) {
  return (
    <div
      className={cn(
        "flex flex-col flex-1 items-center justify-center p-4",
        className
      )}
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      {text && <p className="mt-2 text-muted-foreground">{text}</p>}
    </div>
  );
}
