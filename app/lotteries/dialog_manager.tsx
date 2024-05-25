"use client";

import type { Response } from "@/components/types";
import { useState } from "react";
import { BedFormDialog } from "./bed_form_dialog";
import { WinnerDialog } from "./winner_dialog";

export function DialogManager(data: { data: Response[] }) {
  const [hasWon, setWonOpen] = useState<boolean>(false);
  const [winnerArrFromChild, setWinnerArrInChild] = useState<Response[]>([]);

  const formProps = { setWonOpen: setWonOpen, setWinnerArr: setWinnerArrInChild, data: data.data };
  const wonProps = { setWonOpen: setWonOpen, winnerArr: winnerArrFromChild };

  return (
    <>
      <BedFormDialog {...formProps} />
      {hasWon && <WinnerDialog {...wonProps} />}
    </>
  );
}
