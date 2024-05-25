"use client";

import type { Response } from "@/components/types";
import { BannedDialog } from "./banned_dialog";

export function BannedDialogManager({
  bannedID,
  bannedIDsList,
  data,
}: {
  bannedID: string;
  bannedIDsList: number[];
  data: Response[];
}) {
  return (
    <>
      <BannedDialog bannedID={bannedID} bannedIDsList={bannedIDsList} data={data} />
    </>
  );
}
