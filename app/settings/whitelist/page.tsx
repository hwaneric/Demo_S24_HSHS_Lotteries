import { TypographyH3, TypographyP } from "@/components/ui/typography";
// import { fetchEmails } from "./whitelist-server-actions";
import { createServerSupabaseClient } from "@/lib/server-utils";
import WhitelistTable from "./whitelist-table";

interface item_interface {
  email: string;
}

// async function fetchEmails() {
//   const supabase = createServerSupabaseClient();
//   const { data, error } = await supabase.from("approved_emails").select("email");

//   if (error) {
//     throw new Error(error.message);
//   }

//   return data.map((item: item_interface) => item.email);
// }

export default async function WhitelistManager() {
  // Fetch data and store in emails
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from("approved_emails").select("*");
  const emails = data?.map((item: item_interface) => item.email);

  // Handle error or no whietlisted emails cases
  if (error) {
    return <TypographyP>Something went wrong fetching data.</TypographyP>;
  }
  if (!emails) {
    return <TypographyP>No whitelisted emails found.</TypographyP>;
  }

  return (
    <div>
      <TypographyH3>Whitelist Manager</TypographyH3>
      {/* Render the Whitelist component */}
      <WhitelistTable emails={data} />
    </div>
  );
}
