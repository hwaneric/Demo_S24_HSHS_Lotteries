"use client";

import { columns } from "@/app/settings/whitelist/columns";
import { type EmailResponse } from "@/components/types";
import { DataTable } from "@/components/ui/data-table";
import { EmailForm } from "./email-form";

export default function WhitelistTable({ emails }: { emails: EmailResponse[] }) {
  return (
    <div>
      <EmailForm />
      <div style={{ paddingTop: "20px" }}>
        <DataTable columns={columns} data={emails} />
      </div>
    </div>
  );
}
