"use client";

import type { Response } from "@/components/types";
import { DuplicatesDialog } from "./duplicates_dialog";

export function DialogManager({
  duplicateID,
  duplicateIDsList,
  data,
}: {
  duplicateID: string;
  duplicateIDsList: number[];
  data: Response[];
}) {
  return (
    <>
      <DuplicatesDialog duplicateID={duplicateID} duplicateIDsList={duplicateIDsList} data={data} />
    </>
  );
}
