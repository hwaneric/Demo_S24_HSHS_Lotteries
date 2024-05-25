"use client";

import { updateResponse } from "@/components/data_loading/data_loading";
import type { Response } from "@/components/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TypographyP } from "@/components/ui/typography";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ErrorMsg {
  message: string;
}

export default function SeenDialog({ selectedResponses, resetSelection }: { selectedResponses: Response[], resetSelection: (defaultState?: boolean) => void }) {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  // Event handler for adding to waitlist
  const handleAddSubmit = () => {
    // Update responses in GSheets DB

    if (selectedResponses.some((response) => response.is_processed === true)) {
      setOpen(false);
      throw "All entries must be unseen in order to add.";
    }

    selectedResponses.forEach(function (response) {
      response.is_processed = true;
      updateResponse(response).catch((err: ErrorMsg) => {
        return toast({
          title: "Error saving responses.",
          description: err.message,
        });
      });;
    });

    router.refresh();
    resetSelection();
    setOpen(false);
    return toast({
      title: "Changes saved!",
      description: "Marked as seen!",
    });
  };



  const toggleOpen = () => {
    setOpen(!open);
  };

  return (
    <Dialog open={open} onOpenChange={toggleOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Mark as Seen</Button>
      </DialogTrigger>
      {
        <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
          <DialogTitle> Mark as Seen - Confirmation </DialogTitle>
          <div className="grid w-full items-center gap-4">
            <TypographyP>Are you sure you want to mark {selectedResponses?.length || 0} entries as seen?</TypographyP>
            <Button type="submit" onClick={() => handleAddSubmit()} className="ml-1 mr-1 flex-auto">
              Confirm
            </Button>
          </div>
        </DialogContent>
      }
    </Dialog>
  );
}
