"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const ALLOWED = ["new", "contacted", "closed"];

// Update a lead's status. Called as a <form> action (progressive enhancement).
// RLS allows this only for signed-in agents; middleware already gates /agent/*.
export async function updateLeadStatus(formData: FormData) {
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  if (!id || !ALLOWED.includes(status)) return;

  const supabase = createClient();
  await supabase.from("leads").update({ status }).eq("id", id);
  revalidatePath("/agent/leads");
}
