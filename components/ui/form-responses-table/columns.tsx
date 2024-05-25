"use client";

import { Icons } from "@/components/icons";
import type { Response } from "@/components/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import ResponsesDetailsDialog from "@/components/ui/form-responses-table/edit_button_dialog";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import type { Gender } from "../../types";
import { BannedDialogManager } from "./banned/dialog_manager";
import { DialogManager } from "./duplicates/dialog_manager";
import { TypographyP } from "../typography";

// TODO: make rows more compact (could have hundreds of rows)
export const columns: ColumnDef<Response>[] = [
  {
    id: "select",
    size: 100,
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    size: 50,
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Lottery Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "gender",
    header: "Gender",
  },
  {
    accessorKey: "lottery_type",
    header: "Lottery Type",
    cell: ({ row }) => {
      const lottery_type: Gender | null = row.getValue("lottery_type");
      if (lottery_type == "non-binary" || lottery_type == null) {
        const Warning = Icons.warning;
        return (
          <>
            {/* <p className="sr-only">Warning</p> */}
            <Warning aria-label="warning button" color="#8a1313" size={20} />
          </>
        );
      } else {
        return <p>{lottery_type}</p>;
      }
    },
  },
  {
    accessorKey: "dob",
    header: "DOB",
    cell: ({ row }) => {
      const dob: string = row.getValue("dob");
      if (dob) {
        const [year, month, day] = dob.split("-");
        // Create a new Date object using the parsed year, month, and day
        const date = new Date(parseInt(year!), parseInt(month!) - 1, parseInt(day!));
        // Format the date as "M/D/YYYY"
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
      }
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone Number",
  },
  {
    accessorKey: "other_contact",
    header: "Other Contact",
  },
  {
    accessorKey: "submitted_at",
    header: "Submission Date",
    cell: ({ row }) => {
      const ISO: string = row.getValue("submitted_at");
      if (ISO) {
        const date: Date = new Date(ISO);
        const formattedDate = date.toLocaleDateString("en-US", {
          month: "2-digit", // Two-digit month
          day: "2-digit", // Two-digit day
          year: "numeric", // Full year
        });
        return formattedDate;
      }
    },
  },
  // todo: make notes column wider
  // test edit
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => {
      const notes: string = row.getValue("notes");

      // Function to toggle truncation
      const handleToggleTruncation = (event: React.MouseEvent<HTMLParagraphElement, MouseEvent>) => {
        const element = event.currentTarget;
        element.classList.toggle("truncate");
      };

      return (
        <p className="min-w-52 max-w-52 cursor-pointer truncate" onClick={handleToggleTruncation}>
          {notes}
        </p>
      );
    },
  },
  {
    accessorKey: "is_waitlisted",
    header: "On Waitlist",
    cell: ({ row }) => {
      const waitlist: boolean = row.getValue("is_waitlisted");
      if (waitlist) {
        const Checkmark = Icons.check;
        return <Checkmark color="#0b6609" size={20} />;
      } else {
        const X = Icons.close;
        return <X color="#8a1313" size={20} />;
      }
    },
  },
  {
    accessorKey: "contact_status",
    header: "Contact Status",
    cell: ({ row }) => {
      const status: string = row.getValue("contact_status") !== "clear selection" ? row.getValue("contact_status") : "";
      return (
        <TypographyP>{status}</TypographyP>
      )
    },
  },
  {
    accessorKey: "edit",
    header: "Edit",
    cell: ({ row }) => {
      return <ResponsesDetailsDialog response={row.original} />;
    },
  },
  {
    accessorKey: "waitlisted_at",
    header: "Date Added to Waitlist",
    cell: ({ row }) => {
      const ISO: string = row.getValue("waitlisted_at");
      if (ISO) {
        const date: Date = new Date(ISO);
        const formattedDate = date.toLocaleDateString("en-US", {
          month: "2-digit", // Two-digit month
          day: "2-digit", // Two-digit day
          year: "numeric", // Full year
        });
        return formattedDate;
      }
    },
  },
  {
    accessorKey: "unwaitlisted_at",
    header: "Date Removed From Waitlist",
    cell: ({ row }) => {
      const ISO: string = row.getValue("unwaitlisted_at");
      if (ISO) {
        const date: Date = new Date(ISO);
        const formattedDate = date.toLocaleDateString("en-US", {
          month: "2-digit", // Two-digit month
          day: "2-digit", // Two-digit day
          year: "numeric", // Full year
        });
        return formattedDate;
      }
    },
  },
  {
    accessorKey: "has_won",
    header: "Has Won",
    cell: ({ row }) => {
      const won: boolean = row.getValue("has_won");
      if (won) {
        const Checkmark = Icons.check;
        return <Checkmark color="#0b6609" size={20} />;
      } else {
        const X = Icons.close;
        return <X color="#8a1313" size={20} />;
      }
    },
  },
  {
    accessorKey: "won_at",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Won Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const ISO: string = row.getValue("won_at");
      if (ISO) {
        const date: Date = new Date(ISO);
        const formattedDate = date.toLocaleDateString("en-US", {
          month: "2-digit", // Two-digit month
          day: "2-digit", // Two-digit day
          year: "numeric", // Full year
        });
        return formattedDate;
      }
    },
  },
  {
    accessorKey: "is_processed",
  },
  {
    accessorKey: "is_duplicate",
    header: "Duplicate",
    cell: ({ row, table }) => {
      const duplicate: boolean = row.getValue("is_duplicate");
      const duplicateID: string = row.getValue("id");
      const duplicateIDsList: number[] = row.getValue("duplicate_ids");
      const adjustedDuplicateIDsList = duplicateIDsList.map((id) => id - 1);

      if (duplicate) {
        const currentTableData: Response[] = table.getCoreRowModel().rows.map((row) => row.original);
        return (
          <>
            <DialogManager
              duplicateID={duplicateID}
              duplicateIDsList={adjustedDuplicateIDsList}
              data={currentTableData}
            />
          </>
        );
      } else {
        return <></>;
      }
    },
  },
  {
    accessorKey: "duplicate_ids",
    header: "Duplicate IDs",
  },
  {
    accessorKey: "is_banned",
    header: "Banned",
    cell: ({ row, table }) => {
      const banned: boolean = row.getValue("is_banned");
      const bannedID: string = row.getValue("id");
      const bannedIDsList: number[] = row.getValue("banned_ids");
      const adjustedBannedIDsList = bannedIDsList.map((id) => id - 1);

      if (banned) {
        const currentTableData: Response[] = table.getCoreRowModel().rows.map((row) => row.original);
        return (
          <>
            <BannedDialogManager bannedID={bannedID} bannedIDsList={adjustedBannedIDsList} data={currentTableData} />
          </>
        );
      } else {
        return <></>;
      }
    },
  },
  {
    accessorKey: "banned_ids",
    header: "Banned IDs",
  },
  {
    accessorKey: "additional_info",
    header: "Additional Info",
  },
  // dropdown extra commands
  // {
  //   id: "actions"
  //   cell: ({ row }) => {
  //     const response = row.original

  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <MoreHorizontal className="h-4 w-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //           <DropdownMenuItem
  //             onClick={() => navigator.clipboard.writeText(response.id)}
  //           >
  //             Copy response ID
  //           </DropdownMenuItem>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem>View customer</DropdownMenuItem>
  //           <DropdownMenuItem>View response details</DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     )
  //   },
  // },
];
