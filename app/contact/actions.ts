"use server";

import { createClient } from "@/lib/supabase/server";

export type LeadState = { ok: boolean; error?: string };

export async function submitLead(
  _prev: LeadState,
  formData: FormData
): Promise<LeadState> {
  // Honeypot — bots fill hidden fields; humans never see this one.
  if (String(formData.get("company") || "").trim()) return { ok: true };

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const interest = String(formData.get("interest") || "").trim();
  const message = String(formData.get("message") || "").trim();
  const source = String(formData.get("source") || "contact").trim();
  const property_ref =
    String(formData.get("property_ref") || "").trim() || null;

  if (!name) return { ok: false, error: "Please enter your name." };
  if (!email && !phone)
    return { ok: false, error: "Please add an email or phone so Sherry can reach you." };
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { ok: false, error: "That email address doesn't look right." };

  try {
    const supabase = createClient();
    const { error } = await supabase.from("leads").insert({
      name,
      email: email || null,
      phone: phone || null,
      interest: interest || null,
      message: message || null,
      source,
      property_ref,
    });
    if (error) throw error;
  } catch {
    return {
      ok: false,
      error:
        "Something went wrong sending your message. Please try again, or email sherry@iclickhomes.com directly.",
    };
  }

  return { ok: true };
}
