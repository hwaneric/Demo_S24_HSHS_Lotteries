"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { TypographyHTable } from "@/components/ui/typography";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../dropdown-menu";

import AddResponseDialog from "@/components/ui/form-responses-table/add_row_dialog";
import UnwaitlistDialog from "@/components/ui/form-responses-table/confirmDialogs/unwaitlist_button_dialog";
import WaitlistDialog from "@/components/ui/form-responses-table/confirmDialogs/waitlist_button_dialog";
import SeenDialog from "./confirmDialogs/seen_button_dialog";

import { AddWinner } from "@/app/lotteries/add_winner_dialog";
import type { Filters, Response } from "@/components/types";
import { type ColumnDef } from "@tanstack/table-core";

interface ButtonControlProps<TData, TValue> {
  handleFilter: (filter: Filters) => void;
  page: Filters;
  selectedResponses: Response[];
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  resetSelection: (defaultState?: boolean) => void;
}

export function ButtonControl<TData, TValue>({
  handleFilter,
  page,
  selectedResponses,
  data,
  columns,
  resetSelection,
}: ButtonControlProps<TData, TValue>) {
  const [filter, setFilter] = useState<Filters>(page); //can change to boolean if not adding any more states

  function toTitleCase(string: string): string {
    return string
      .split(" ")
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(" ");
  }

  if (page == "unprocessed") {
    return (
      <div className="flex-row px-5 py-2 align-middle">
        <TypographyHTable className="float-left">Unprocessed</TypographyHTable>
        <div className="float-right space-x-1">
          <WaitlistDialog selectedResponses={selectedResponses} resetSelection={resetSelection} />
          <SeenDialog selectedResponses={selectedResponses} resetSelection={resetSelection} />
        </div>
      </div>
    );
  } else if (page == "processed") {
    return (
      <div className="mt-2 flex-row px-5 align-middle">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-fit w-fit p-0">
              <TypographyHTable className="scroll-m-20 no-underline">{toTitleCase(filter)}</TypographyHTable>
              <Icons.chevronDown className="ml-3 align-middle" />
              <span className="sr-only">Dropdown</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full" align="start" forceMount>
            <DropdownMenuItem
              asChild
              onSelect={() => {
                handleFilter("processed");
                setFilter("processed");
              }}
            >
              <span>Processed</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              asChild
              onSelect={() => {
                handleFilter("waitlist");
                setFilter("waitlist");
              }}
            >
              <span>Waitlist</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              asChild
              onSelect={() => {
                handleFilter("not on waitlist");
                setFilter("not on waitlist");
              }}
            >
              <span>Not On Waitlist</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="float-right space-x-1 space-y-1">
          {filter != "waitlist" && <WaitlistDialog selectedResponses={selectedResponses} resetSelection={resetSelection} />}
          {filter != "not on waitlist" && <UnwaitlistDialog selectedResponses={selectedResponses} resetSelection={resetSelection} />}
          {filter != "not on waitlist" && filter != "waitlist" && <AddResponseDialog />}
           {/* <UnseenDialog selectedResponses={selectedResponses} resetSelection={resetSelection} /> */}
          {/* <UnseenDialog selectedResponses={selectedResponses} /> */}
        </div>
      </div>
    );
  } else if (page == "won lottery") {
    return (
      <div className="flex-row px-5 py-2">
        <AddWinner data={data} columns={columns} />
      </div>
    );
  }
}
