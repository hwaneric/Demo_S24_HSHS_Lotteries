import DeleteFromWhitelistButton from "@/app/settings/whitelist/delete-from-whitelist-button";
import type { EmailResponse } from "@/components/types";
import type { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<EmailResponse>[] = [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "delete",
    header: "Delete",
    cell: ({ row }) => <DeleteFromWhitelistButton email={row.original.email} />,
  },
];
