"use client";

import { updateResponse } from "@/components/data_loading/data_loading";
import type { Response } from "@/components/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { TypographyP } from "@/components/ui/typography";
import { toast } from "@/components/ui/use-toast";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ConfirmWinner({ selectedResponses }: { selectedResponses: Response[] }) {
  //Define dialog open/closed
  const [open, setOpen] = useState<boolean>(false);

  const router = useRouter();

  const handleAddSubmit = () => {
    // Update responses in GSheets DB
    selectedResponses.forEach( function (response) {
      response.has_won = true;
      response.is_waitlisted = false;

      const today = new Date();
      response.won_at = today.toISOString();
      response.unwaitlisted_at = today.toISOString();

      updateResponse(response).catch((err: string) => {
        return toast({
          title: "Error saving responses.",
          description: err,
        });
      })
    });

    router.refresh();
    setOpen(false);
    return toast({
      title: "Changes saved!",
      description: "Made responses past winners!",
    });
  };



  //TODO: if screen is too small, title and description disappear
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="float-right mx-2" variant="outline">
          Mark as Past Winner
        </Button>
      </DialogTrigger>
      {
        <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
          <DialogTitle> Mark as Winner - Confirmation </DialogTitle>
          <div className="grid w-full items-center gap-4">
            <TypographyP>
              Are you sure you want to mark {selectedResponses?.length || 0} entries as past winners?
            </TypographyP>
            <Button type="submit" onClick={() => handleAddSubmit()} className="ml-1 mr-1 flex-auto">
              Confirm
            </Button>
          </div>
        </DialogContent>
      }
    </Dialog>
  );
}
