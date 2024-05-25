import { z } from "zod";

const genderValues = ["man", "woman", "non-binary"] as const;
type Gender = (typeof genderValues)[number];
const genderZ = z.enum(genderValues);

const lotteryTypeValues = ["man", "woman"] as const;
type LotteryType = (typeof lotteryTypeValues)[number];
const lotteryTypeZ = z.enum(lotteryTypeValues);

interface EmailResponse {
  id: number;
  email: string;
}

const contactStatusValues = [
  "clear selection",
  "accepted",
  "awaiting response",
  "not contacted",
  "no response",
  "declined",
] as const;
type ContactStatus = (typeof contactStatusValues)[number];
const contactStatusZ = z
  .enum(contactStatusValues)
  .optional()

/*
This copy that includes an empty string is necessary because the empty string
should be a valid value for the contact status field. We cannot add an empty string
to the contactStatusValues above because it is used to define the items for the
select dropdown, and Radix UI does not allow its select dropdown items to have value ""
*/
const contactStatusValues_with_empty_str = [...contactStatusValues, ""] as const;
const contactStatusZ_with_empty_str = z
  .enum(contactStatusValues_with_empty_str)


interface Profile {
  biography: string | null;
  display_name: string;
  email: string;
  id: string;
}

interface Response {
  additional_info: string | null;
  contact_status: ContactStatus | null;
  dob: string | null;
  email: string | null;
  gender: Gender;
  id: number;
  is_duplicate: boolean;
  duplicate_ids: number[];
  is_processed: boolean;
  is_waitlisted: boolean;
  lottery_info: string | null;
  lottery_type: LotteryType | null;
  name: string;
  notes: string | null;
  other_contact: string | null;
  phone: string | null;
  submitted_at: string;
  unwaitlisted_at: string | null;
  uploaded_at: string;
  waitlisted_at: string | null;
  won_at: string | null;
  has_won: boolean;
  is_banned: boolean;
  banned_ids: number[];
}

// TODO: change this to include everything necessary
const responsesSchema = z.object({
  name: z.string().min(1).transform((val) => val.trim()),
  dob: z
    .string()
    .nullable()
    .transform((val) => (!val || val.trim() === "" ? null : val.trim())),
  phone: z
    .string()
    .nullable()
    .transform((val) => (!val || val.trim() === "" ? null : val.trim())),
  email: z
    .string()
    .nullable()
    .transform((val) => (!val || val.trim() === "" ? null : val.trim())),
  // these are all required
  gender: genderZ,
  lottery_type: lotteryTypeZ,
  contact_status: contactStatusZ_with_empty_str.optional(), // See comment above about why contactStatusZ_with_empty_str is necessary for validing form response
  notes: z
    .string()
    .nullable()
    .transform((val) => (!val || val.trim() === "" ? null : val.trim())),
});

// Unprocessed: HSHS hasn't made a decision about whether to put this person on the waitlist
// Processed: HSHS has made a decision about whether to put this person on the waitlist
// Waitlist: Person is on waitlist (processed)
// Not on waitlist: Person is NOT on waitlist (could be unprocessed or processed)
// Won lottery: has won

type Filters = "unprocessed" | "processed" | "waitlist" | "not on waitlist" | "won lottery" | "manual winner";

export { contactStatusZ, genderZ, lotteryTypeZ, responsesSchema };
export type { ContactStatus, EmailResponse, Filters, Gender, LotteryType, Profile, Response };
