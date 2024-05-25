import { createServerSupabaseClient } from "@/lib/server-utils";
import { redirect } from "next/navigation";
import ResponsesPage from "../../components/ui/form-responses-table/responses-page";

export default async function NewPage() {
  // Create supabase server component client and obtain user session from Supabase Auth
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // this is a protected route - only users who are signed in can view this route
    redirect("/");
  }

  return <ResponsesPage page="unprocessed" />;
}
