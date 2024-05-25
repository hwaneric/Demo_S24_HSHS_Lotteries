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

export default function NonBannedDialog({ selectedResponses }: { selectedResponses: Response[] }) {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  // Event handler for adding to waitlist
  const handleSubmit = () => {
    // Update responses in GSheets DB

    selectedResponses.forEach(
      function (response) {
        response.is_banned = false;
        response.banned_ids = [];
        updateResponse(response).catch((error: ErrorMsg) => {
          return toast({
            title: "Error saving changes.",
            description: error.message,
          });
        });;
      }
    )

    router.refresh();
    setOpen(false);
    return toast({
      title: "Changes saved!",
      description: "Marked as non-banned!",
    });
  };



  const toggleOpen = () => {
    setOpen(!open);
  };

  return (
    <Dialog open={open} onOpenChange={toggleOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Mark as Not Banned</Button>
      </DialogTrigger>
      {<DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
        <DialogTitle> Mark as Not Banned - Confirmation </DialogTitle>
            <div className="grid w-full items-center gap-4">
              <TypographyP>Are you sure you want to mark {selectedResponses?.length || 0} entry as not banned?</TypographyP>
              <Button type="submit" onClick={() => handleSubmit()} className="ml-1 mr-1 flex-auto">
                Confirm
              </Button>
            </div>
      </DialogContent>}
    </Dialog>
  );
}
