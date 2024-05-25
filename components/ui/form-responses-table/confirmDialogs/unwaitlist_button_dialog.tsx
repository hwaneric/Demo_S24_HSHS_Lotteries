"use client";

import { updateResponse } from "@/components/data_loading/data_loading";
import type { Response } from "@/components/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { TypographyP } from "@/components/ui/typography";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ErrorMsg {
  message: string;
}

export default function UnwaitlistDialog({ selectedResponses, resetSelection }: { selectedResponses: Response[], resetSelection: (defaultState?: boolean) => void }) {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  // Event handler for adding to waitlist
  const handleRemoveSubmit = () => {
    // Update responses in GSheets DB

    if (selectedResponses.some(response => response.is_waitlisted === false)) {
      setOpen(false);
      throw "All entries must be on waitlist in order to remove."
    }

    selectedResponses.forEach(
      function (response) {
        response.is_waitlisted = false;
        response.unwaitlisted_at = new Date().toISOString();
        updateResponse(response).catch((err: ErrorMsg) => {
          return toast({
            title: "Error saving responses.",
            description: err.message,
          });
        });;
      }
    )

    router.refresh();
    resetSelection();
    setOpen(false);
    return toast({
      title: "Changes saved!",
      description: "Removed from waitlist!",
    });
  };



  const toggleOpen = () => {
    setOpen(!open);
  };

  return (
    <Dialog open={open} onOpenChange={toggleOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Remove from Waitlist</Button>
      </DialogTrigger>
      {<DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
        <DialogTitle> Remove from Waitlist - Confirmation </DialogTitle>
            <div className="grid w-full items-center gap-4">
              <TypographyP>Are you sure you want to remove {selectedResponses?.length || 0} entries from the waitlist?</TypographyP>
              <Button type="submit" onClick={() => handleRemoveSubmit()} className="ml-1 mr-1 flex-auto">
                Remove
              </Button>
            </div>
      </DialogContent>}
    </Dialog>
  );
}
