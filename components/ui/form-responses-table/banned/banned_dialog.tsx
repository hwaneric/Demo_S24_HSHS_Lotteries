import { Icons } from "@/components/icons";
import type { Response } from "@/components/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TypographyP } from "../../typography";
import { columns } from "../columns";
import NonBannedDialog from "../banned/nonbanned_button_dialog";
import { BannedTable } from "./banned_table";
import { getBannedData } from "@/components/data_loading/data_loading";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";



export function BannedDialog({ bannedID, bannedIDsList, data }: { bannedID: string, bannedIDsList: number[]; data: Response[]; }) {
  //Define dialog open/closed
  const [open, setOpen] = useState<boolean>(false);
  const [bannedData, setBannedData] = useState<Response[]>([]);

  useEffect(() => {
    const fetchBannedData = async () => {
      const data = await getBannedData();
      setBannedData(data);
    };

    fetchBannedData().catch((err: string) => {
      return (
        toast({
          title: "Error fetching data.",
          description: err,
          variant: "destructive"
        })
      );
    })}, []);

  const Warning = Icons.warning;
  const currentID = [parseInt(bannedID)];
  const currentPerson = data.find((person) => person.id === parseInt(bannedID));

  if (!currentPerson) {
    return (
      <TypographyP>
        Error fetching data for person with ID: {currentID}
      </TypographyP>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="mt-3 w-auto" variant="duplicate">
            <Warning color="#8a1313" size={20} />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[75%]">
          <DialogHeader>
            <DialogTitle>Possible banned similarities for ID: {bannedID}</DialogTitle>
            <DialogDescription>
              <p>Shows similar entries to current entry.</p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-start space-y-4">
            <TypographyP>This entry looks like a banned entry:</TypographyP>
            <BannedTable columns={columns} data={data} ids={currentID} />
            <TypographyP>Looks like these entries in the Google Sheet: {bannedIDsList}</TypographyP>
            <BannedTable columns={columns} data={bannedData} ids={bannedIDsList} />
          </div>
          <div className="flex flex-col items-start space-y-4">
            <div className="flex items-center space-x-2">
              <TypographyP>If not a banned person: </TypographyP>
              <NonBannedDialog selectedResponses={[currentPerson]} />
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
