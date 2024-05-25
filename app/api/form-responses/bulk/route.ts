import { insertGoogleSheetRows } from "@/components/data_loading/data_loading";
import { responseToRow } from "@/components/data_loading/data_loading_helpers";
import { NextResponse } from "next/server";
import type { RawFormResponse } from "../helper";
import { processRawFormResponse } from "../helper";

export async function POST(request: Request) {
  // Parse the raw form data from the request
  const rawFormResponses: RawFormResponse[] = (await request.json()) as RawFormResponse[];

  // Process rawFormData into a Response objects
  const rows: (string | null)[][] = [];
  for (const rawFormResponse of rawFormResponses) {
    const response = processRawFormResponse(rawFormResponse);
    if (response == null) {
      return NextResponse.json({ message: "Error: Form response could not be processed." });
    }
    const row: (string | null)[] = responseToRow(response);
    rows.push(row);
  }

  const res = await insertGoogleSheetRows(rows);
  if (res !== null && res instanceof Error) {
    // Handle the error
    return NextResponse.json({ message: "Error: Form response could not be uploaded to Google Sheets.", res });
  }

  return NextResponse.json({ message: "Success! Form response has been uploaded to Google Sheets." });
}
