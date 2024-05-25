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
import { useState } from "react";
import { TypographyP } from "../../typography";
import { columns } from "../columns";
import NonDuplicateDialog from "./nonduplicate_button_dialog";
import { DuplicatesTable } from "./duplicates_table";

// The two tables take in a list of IDs, and they filter the data and only show the rows with the
// given IDs. The idea is that the first table should take in a list with only the duplicate person's ID,
// and the second table should take in a list with their duplicates' IDs.

// Currently, both current_id and duplicates_ids are being set to a list of one ID (the duplicate person's ID).

export function DuplicatesDialog({
  duplicateID,
  duplicateIDsList,
  data,
}: {
  duplicateID: string;
  duplicateIDsList: number[];
  data: Response[];
}) {
  //Define dialog open/closed
  const [open, setOpen] = useState<boolean>(false);

  const Warning = Icons.warning;
  const currentID = [parseInt(duplicateID)];
  const currentPerson = data.find((person) => person.id === parseInt(duplicateID));

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
            <Warning aria-label="warning button" color="#8a1313" size={20} />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[75%]">
          <DialogHeader>
            <DialogTitle>Duplicates for ID: {duplicateID}</DialogTitle>
            <DialogDescription>
              <p>Shows similar entries to current entry.</p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-start space-y-4">
            <TypographyP>This entry:</TypographyP>
            <DuplicatesTable columns={columns} data={data} ids={currentID} />
            <TypographyP>Looks like these entries:</TypographyP>
            <DuplicatesTable columns={columns} data={data} ids={duplicateIDsList} />
          </div>
          <div className="flex flex-col items-start space-y-4">
            <div className="flex items-center space-x-2">
              <TypographyP>If not a duplicate: </TypographyP>
              <NonDuplicateDialog selectedResponses={[currentPerson]} />
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
