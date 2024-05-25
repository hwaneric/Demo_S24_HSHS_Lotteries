import { updateResponse } from "@/components/data_loading/data_loading";
import type { Response } from "@/components/types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { columns } from "@/components/ui/form-responses-table/columns";
import { LotteryTable } from "@/components/ui/form-responses-table/lottery-winning-table";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { toast } from "../../components/ui/use-toast";

export function WinnerDialog(wonProps: {
  setWonOpen: React.Dispatch<React.SetStateAction<boolean>>;
  winnerArr: Response[];
}) {
  //Define dialog open/closed
  const [open, setOpen] = useState<boolean>(true);

  const router = useRouter();

  const handleConfirm = () => {
    // Update responses in GSheets DB
    wonProps.winnerArr.forEach(function (winner) {
      winner.is_waitlisted = false;
      const now = new Date().toISOString();
      winner.unwaitlisted_at = now;
      winner.won_at = now;
      winner.has_won = true;
      updateResponse(winner).catch((err: string) => {
        return toast({
          title: "Error saving responses.",
          description: err,
        });
      });
    });

    router.refresh();
    wonProps.setWonOpen(false);
    setOpen(false);
    return toast({
      title: "Lottery winners confirmed!",
      description: "Marked as won.",
    });
  };



  const onCancel = () => {
    if (window.confirm("Are you sure you want to cancel?")) {
      wonProps.setWonOpen(!open);
      setOpen(!open);
      return toast({
        title: "Lottery Canceled.",
        description: "These lottery winners have been forgotten.",
      });
    }
  };

  //TODO: if screen is too small, title and description disappear
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="max-h-most w-3/4 max-w-[75%]">
        <DialogHeader>
          <DialogTitle>Winners</DialogTitle>
          <DialogDescription>
            <p>These are the lottery winners.</p>
          </DialogDescription>
        </DialogHeader>
        <div className="container mx-auto overflow-auto px-0">
          <LotteryTable columns={columns} data={wonProps.winnerArr} />
        </div>
        <Button type="submit" onClick={() => handleConfirm()} className="ml-1 mr-1 flex-auto">
          Confirm
        </Button>
        <Button variant="destructive" onClick={() => onCancel()} className="ml-1 mr-1 flex-auto">
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
}
