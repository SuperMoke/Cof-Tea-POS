"use client";

import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function PrintingModal({ isOpen, onOpenChange }) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Printing Receipt</DialogTitle>
          <DialogDescription>
            Please wait while your receipt is being printed...
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center items-center py-6">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
