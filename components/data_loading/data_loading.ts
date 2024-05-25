"use server";

import { env } from "@/env.mjs";
import levenshtein from "damerau-levenshtein";
import { GoogleAuth } from "google-auth-library";
import { google } from "googleapis";
import { rowToResponse, responseToRow } from "./data_loading_helpers";
import type { Response } from "../types";

const MIN_SIMILARITY = 0.7;
// Can get entire sheet using '{Sheet name}!A2:{last row here}'
const sheetName = "current_season";
const sheetRange = "A2:W";
const bannedSheetName = "Banned_Sheet";

// Google Authentication
const auth = new GoogleAuth({
  credentials: {
    client_id: env.GOOGLE_CLIENT_ID,
    client_email: env.GOOGLE_CLIENT_EMAIL,
    project_id: env.GOOGLE_PROJECT_ID,
    private_key: env.GOOGLE_PRIVATE_KEY,
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const sheets = google.sheets({ version: "v4", auth });

export async function getData(): Promise<Response[]> {
  // Google Authentication

  // Google Sheets Data Fetching
  let sheet;
  try {
    sheet = await sheets.spreadsheets.values.get({
      spreadsheetId: env.SHEET_ID,
      range: sheetName + "!" + sheetRange,
    });
  } catch {
    //console.log("error fetching data");
    return [];
  }

  const raw_form_responses = sheet.data.values;

  if (!raw_form_responses) {
    //console.log("No data to fetch");
    return [];
  }

  // Formatting Google Sheets Data
  const formatted_responses = [];

  // Format all responses and add to formatted response array
  for (let i = 0; i < raw_form_responses.length; i++) {
    const cur_row: (string | null)[] | undefined = raw_form_responses[i];

    if (!cur_row) {
      //console.log("Less data than expected");
      break;
    }

    // Format data
    const cur_response: Response = rowToResponse(i + 1, cur_row);

    formatted_responses.push(cur_response);
  }

  return formatted_responses;
}

export async function getBannedData(): Promise<Response[]> {
  // Google Sheets Data Fetching
  let sheet;
  try {
    sheet = await sheets.spreadsheets.values.get({
      spreadsheetId: env.SHEET_ID,
      range: bannedSheetName + "!" + sheetRange,
    });
  } catch {
    //console.log("error fetching data");
    return [];
  }

  const raw_form_responses = sheet.data.values;

  if (!raw_form_responses) {
    //console.log("No data to fetch");
    return [];
  }

  // Formatting Google Sheets Data
  const formatted_responses = [];

  // Format all responses and add to formatted response array
  for (let i = 0; i < raw_form_responses.length; i++) {
    const cur_row: (string | null)[] | undefined = raw_form_responses[i];

    if (!cur_row) {
      //console.log("Less data than expected");
      break;
    }

    // Format data
    const cur_response: Response = rowToResponse(i + 1, cur_row);

    formatted_responses.push(cur_response);
  }

  return formatted_responses;
}


// Checks if a row is a duplicate
function checkForDuplicates(
  name: string,
  dob: string,
  email: string,
  phone: string,
  current_entries: (string | number)[][],
): string {
  const duplicateRowNumbers: number[] = [];
  current_entries.forEach((row, index) => {
    let duplicate = false;

    // NOTE: IF GOOGLE SHEETS DATABASE COLUMN ORDER IS CHANGED, THIS FUNCTION WILL BE WRONG

    // Check for similarities
    if (row[0] != "") {
      const rowName = row[0]!.toString().toLowerCase();
      name = name.toLowerCase();

      // Check overall name similarity
      const nameSimilarity: number = levenshtein(name, rowName).similarity;
      if (nameSimilarity > MIN_SIMILARITY) {
        duplicate = true;
      }

      // Check last name similarity
      const rowTrimmedName = rowName.trim();
      const rowNameSplit = rowTrimmedName.split(/\s+/);
      const rowLastName = rowNameSplit[rowNameSplit.length - 1];

      const trimmedName = name.trim();
      const nameSplit = trimmedName.split(/\s+/);
      const lastName = nameSplit[nameSplit.length - 1];

      const lastNameSimilarity: number = levenshtein(lastName!, rowLastName!).similarity;
      if (lastNameSimilarity > MIN_SIMILARITY) {
        duplicate = true;
      }
    }
    if ((row[5] == email && email) || (row[6] == phone && phone)) {
      duplicate = true;
    }

    if (duplicate) {
      duplicateRowNumbers.push(index + 1); // add 1 because Sheets is 1-based index
    }
  });
  const stringDuplicateIds: string[] = duplicateRowNumbers.map((id) => id.toString());
  const duplicateIdsString: string = stringDuplicateIds.join(",");
  return duplicateIdsString;
}

// Checks if a row is banned
function checkForBanned(
  name: string,
  dob: string,
  email: string,
  phone: string,
  bannedEntries: (string | number)[][],
): string {
  const bannedRowNumbers: number[] = [];
  bannedEntries.forEach((row, index) => {
    let banned = false;

    // NOTE: IF GOOGLE SHEETS DATABASE COLUMN ORDER IS CHANGED, THIS FUNCTION WILL BE WRONG

    // Check for similarities
    if (row[0] != "") {
      const rowName = row[0]!.toString().toLowerCase();
      name = name.toLowerCase();

      // Check overall name similarity
      const nameSimilarity: number = levenshtein(name, rowName).similarity;
      if (nameSimilarity > MIN_SIMILARITY) {
        banned = true;
      }

      // Check last name similarity
      const rowTrimmedName = rowName.trim();
      const rowNameSplit = rowTrimmedName.split(/\s+/);
      const rowLastName = rowNameSplit[rowNameSplit.length - 1];

      const trimmedName = name.trim();
      const nameSplit = trimmedName.split(/\s+/);
      const lastName = nameSplit[nameSplit.length - 1];

      const lastNameSimilarity: number = levenshtein(lastName!, rowLastName!).similarity;
      if (lastNameSimilarity > MIN_SIMILARITY) {
        banned = true;
      }
    }
    if ((row[1] == dob && dob) || (row[5] == email && email) || (row[6] == phone && phone)) {
      banned = true;
    }

    if (banned) {
      bannedRowNumbers.push(index + 1); // add 1 because Sheets is 1-based index
    }
  });
  const stringBannedIds: string[] = bannedRowNumbers.map((id) => id.toString());
  const bannedIdsString: string = stringBannedIds.join(",");
  return bannedIdsString;
}

// Inserts a Response object into the Google Sheet
export async function insertResponse(response: Response): Promise<Error | null> {
  "use server";
  const row = responseToRow(response);
  return insertGoogleSheetRows([row]);
}

// Inserts multiple rows into the Google Sheet
export async function insertGoogleSheetRows(rows: (string | null)[][]): Promise<Error | null> {
  try {
    // Google Sheets Data Fetching

    const currentEntriesResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: env.SHEET_ID,
      range: sheetName + "!A:G",
    });

    const bannedEntriesResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: env.SHEET_ID,
      range: bannedSheetName + "!A:G",
    });

    const currentEntries: unknown[][] = currentEntriesResponse.data.values ?? [];
    const bannedEntries: unknown[][] = bannedEntriesResponse.data.values ?? [];

    for (const row of rows) {
      // TODO: any way to stop converting rowToResponse and then responseToRow? might be slow
      const response = rowToResponse(0, row);
      // console.log(response)

      const duplicateIDsString = checkForDuplicates(
        response.name ?? "",
        response.dob ?? "",
        response.email ?? "",
        response.phone ?? "",
        currentEntries as (string | number)[][],
      );

      if (duplicateIDsString) {
        response.is_duplicate = true;
        response.duplicate_ids = duplicateIDsString.split(",").map(Number);
      }

      const bannedIDsString = checkForBanned(
        response.name ?? "",
        response.dob ?? "",
        response.email ?? "",
        response.phone ?? "",
        bannedEntries as (string | number)[][],
      );

      if (bannedIDsString) {
        response.is_banned = true;
        response.banned_ids = bannedIDsString.split(",").map(Number);
      }

      const rowToInsert = responseToRow(response);

      await sheets.spreadsheets.values.append({
        spreadsheetId: env.SHEET_ID,
        range: sheetName + "!A1",
        valueInputOption: "RAW",
        requestBody: {
          values: [rowToInsert],
        },
      });
    }

    // Return null to indicate success
    return null;
  } catch (error) {
    // Return an error object
    const err = error as Error;
    return err;
  }
}

// Updates a Response object in the Google Sheet
export async function updateResponse(response: Response): Promise<Error | null> {
  "use server";
  const row = responseToRow(response);
  return updateGoogleSheetRow(row, response.id + 1);
}

// Updates a row in the Google Sheet
export async function updateGoogleSheetRow(row: (string | null)[], rowIndex: number): Promise<Error | null> {
  try {
    // Google Sheets Data Updating
    await sheets.spreadsheets.values.update({
      spreadsheetId: env.SHEET_ID,
      range: sheetName + "!A" + rowIndex.toString(),
      valueInputOption: "RAW",
      requestBody: {
        values: [row], // Wrap the row in an array
      },
    });

    // Return null to indicate success
    return null;
  } catch (error) {
    // Return an error object
    const err = error as Error;
    return err;
  }
}
