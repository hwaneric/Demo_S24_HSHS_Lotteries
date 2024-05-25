"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SecondaryDataTable } from "@/components/ui/form-responses-table/secondary-data-table";
import { TypographyHTable } from "@/components/ui/typography";
import { DialogTrigger } from "@radix-ui/react-dialog";
import type { ColumnDef } from "@tanstack/table-core";
import { useState } from "react";

interface AddWinnerProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function AddWinner<TData, TValue>({ columns, data }: AddWinnerProps<TData, TValue>) {
  //Define dialog open/closed
  const [open, setOpen] = useState<boolean>(false);

  //TODO: if screen is too small, title and description disappear
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div>
          <TypographyHTable className="float-left">Past Winners</TypographyHTable>
          <Button variant="outline" className="float-right">
            Add Lottery Winner
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="max-h-most w-3/4 max-w-[75%]">
        <DialogHeader className="flex flex-row">
          <div className="justify-start">
            <DialogTitle>Add Winner</DialogTitle>
            <DialogDescription>
              <p>Select who you would like to add.</p>
            </DialogDescription>
          </div>
        </DialogHeader>
        <div className="max-width-3/4 max-h-[90%] overflow-scroll px-0 py-0">
          <SecondaryDataTable columns={columns} data={data} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
