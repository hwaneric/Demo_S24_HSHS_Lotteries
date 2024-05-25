import type { Response, ContactStatus, Gender, LotteryType } from '../types';


// Converts a row from the Google Sheet into a Response object
export function rowToResponse(id: number, row: (string | null)[]): Response {
  // Process rawFormData into a Response object
  // Destructure the current row. The , , at the end ignores the last "email" column
  const [
    name,
    dob,
    gender,
    lottery_type,
    lottery_info,
    email,
    phone,
    other_contact,
    additional_info,
    notes,
    is_duplicate,
    duplicate_ids,
    is_processed,
    is_waitlisted,
    waitlisted_at,
    unwaitlisted_at,
    has_won,
    won_at,
    contact_status,
    submitted_at,
    uploaded_at,
    is_banned,
    banned_ids,
  ] = row;

  // Format data
  const response: Response = {
    contact_status: contact_status as ContactStatus | null,
    dob: dob as string | null,
    email: email as string | null,
    gender: gender?.toLowerCase() as Gender,
    id: id,
    is_duplicate: is_duplicate == "TRUE",
    duplicate_ids: duplicate_ids ? duplicate_ids.split(",").map((id) => parseInt(id)) : [],
    is_processed: is_processed == "TRUE",
    is_waitlisted: is_waitlisted == "TRUE",
    lottery_info: lottery_info as string | null,
    lottery_type: lottery_type as LotteryType | null,
    name: name!,
    additional_info: additional_info as string | null,
    notes: notes as string | null,
    other_contact: other_contact as string | null,
    phone: phone as string | null,
    submitted_at: submitted_at!, // Exclamation point at end ensures sub_date is not null
    unwaitlisted_at: unwaitlisted_at as string | null,
    uploaded_at: uploaded_at!,
    waitlisted_at: waitlisted_at as string | null,
    has_won: has_won == "TRUE",
    won_at: won_at as string | null,
    is_banned: is_banned == "TRUE",
    banned_ids: banned_ids ? banned_ids.split(",").map((id) => parseInt(id)) : [],
  };

  return response;
}


// Converts a Response object into a row for the Google Sheet
export function responseToRow(response: Response): (string | null)[] {
  const stringDuplicateIds: string[] = response.duplicate_ids ? response.duplicate_ids.map((id) => id.toString()) : [];
  const duplicateIdsString: string | null = stringDuplicateIds ? stringDuplicateIds.join(",") : null;

  const stringBannedIds: string[] = response.banned_ids ? response.banned_ids.map((id) => id.toString()) : [];
  const bannedIdsString: string | null = stringBannedIds ? stringBannedIds.join(",") : null;

  return [
    response.name,
    response.dob ? response.dob : "",
    response.gender,
    response.lottery_type,
    response.lottery_info ? response.lottery_info : "",
    response.email ? response.email : "",
    response.phone ? response.phone : "",
    response.other_contact ? response.other_contact : "",
    response.additional_info ? response.additional_info : "",
    response.notes ? response.notes : "",
    response.is_duplicate ? "TRUE" : "FALSE",
    duplicateIdsString,
    response.is_processed ? "TRUE" : "FALSE",
    response.is_waitlisted ? "TRUE" : "FALSE",
    response.waitlisted_at,
    response.unwaitlisted_at,
    response.has_won ? "TRUE" : "FALSE",
    response.won_at,
    response.contact_status ?? "",
    response.submitted_at,
    response.uploaded_at,
    response.is_banned ? "TRUE" : "FALSE",
    bannedIdsString,
  ];
}
