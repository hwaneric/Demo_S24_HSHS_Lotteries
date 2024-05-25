"use server";
import { createServerSupabaseClient } from "@/lib/server-utils";

async function addEmail(email: string) {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("approved_emails").insert([{ email: email }]);

  if (error) {
    throw new Error(error.message);
  }
}

async function deleteEmail(email: string) {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("approved_emails").delete().eq("email", email);
  if (error) {
    throw new Error(error.message);
  }
}

export { addEmail, deleteEmail };
