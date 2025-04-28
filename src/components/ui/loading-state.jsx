import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p>Loading product data...</p>
      </div>
    </div>
  );
}
