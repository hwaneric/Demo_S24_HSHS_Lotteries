import type { Gender, Response } from "@/components/types";

export interface RawFormResponse {
  name: string;
  dob: string;
  gender: string;
  lottery_info: string;
  email: string;
  phone: string;
  other_contact: string;
  additional_info: string;
  submitted_at: string;
}

export function processRawFormResponse(rawFormResponse: RawFormResponse): Response | null {
  // Process rawFormData into a Response object

  const gender = parseGender(rawFormResponse.gender);
  if (gender === null) {
    return null;
  }
  const response = {
    id: -1,
    name: rawFormResponse.name,
    dob: rawFormResponse.dob,
    gender: gender as Gender,
    lottery_type: gender != "non-binary" ? gender : null,
    email: rawFormResponse.email,
    phone: rawFormResponse.phone,
    other_contact: rawFormResponse.other_contact,
    lottery_info: rawFormResponse.lottery_info,
    additional_info: rawFormResponse.additional_info,
    notes: null,
    submitted_at: rawFormResponse.submitted_at,
    is_duplicate: false,
    duplicate_ids: [],
    is_processed: false,
    is_waitlisted: false,
    waitlisted_at: null,
    unwaitlisted_at: null,
    has_won: false,
    won_at: null,
    contact_status: null,
    uploaded_at: new Date().toISOString(),
    is_banned: false,
    banned_ids: [],
  };

  return response;
}

export function parseGender(value: string): Gender | null {
  value = value.toLowerCase();
  if (value != "man" && value != "woman" && value != "non-binary") {
    // SOMETHING IS WRONG!!!
    //console.error(value + " is not okay");
    return null;
  }
  return value as Gender;
}

export function parseDateString(dateString: string): string | null {
  if (typeof dateString !== "string") {
    //// console.error("Invalid date format: Input is not a string");
    return null;
  }

  const parts = dateString.split("-");
  if (parts.length !== 3) {
    //// console.error("Invalid date format");
    return null;
  }

  const year = parseInt(parts[0]!);
  const month = parseInt(parts[1]!) - 1; // Months are zero-based in Date objects
  const day = parseInt(parts[2]!);

  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    //// console.error("Invalid date format");
    return null;
  }

  const date = new Date(year, month, day);
  if (isNaN(date.getTime())) {
    //// console.error("Invalid date");
    return null;
  }

  return date.toISOString();
}
