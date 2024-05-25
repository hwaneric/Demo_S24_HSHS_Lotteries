import { insertGoogleSheetRows } from "@/components/data_loading/data_loading";
import { responseToRow } from "@/components/data_loading/data_loading_helpers";
import type { Response } from "@/components/types";
import { NextResponse } from "next/server";
import type { RawFormResponse } from "../helper";
import { processRawFormResponse } from "../helper";

export async function POST(request: Request) {
  // Parse the raw form data from the request
  const rawFormResponse: RawFormResponse = (await request.json()) as RawFormResponse;

  // Process rawFormResponse into a Response objects
  const response: Response | null = processRawFormResponse(rawFormResponse);


  if (response === null) {
    return NextResponse.json({ message: "Error: Form response could not be processed." });
  }

  const row: (string | null)[] = responseToRow(response);

  // Insert the row into the Google Sheet
  const res = await insertGoogleSheetRows([row]);
  if (res !== null && res instanceof Error) {
    // Handle the error
    return NextResponse.json({ message: "Error: Form response could not be uploaded to Google Sheets.", res });
  }



  return NextResponse.json({ message: "Success! Form response has been uploaded to Google Sheets." });
}
