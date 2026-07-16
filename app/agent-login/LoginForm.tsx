"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pending = searchParams.get("pending") === "1";

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [status, setStatus] = useState<{ type: "error" | "info"; text: string } | null>(
    pending ? { type: "info", text: "Your account is created but not yet approved. Check back once Sherry approves agent access." } : null
  );
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      setStatus({ type: "error", text: error.message });
      return;
    }
    router.push("/agent");
    router.refresh();
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setLoading(false);
      setStatus({ type: "error", text: error.message });
      return;
    }

    // Create the app_users profile row (role='agent', is_approved=false —
    // Sherry has to flip is_approved to true before this account can reach
    // anything under /agent). See README "Approving agents".
    if (data.user) {
      const { error: profileError } = await supabase.from("app_users").insert({
        id: data.user.id,
        email,
        full_name: fullName || null,
        role: "agent",
        is_approved: false,
      });
      if (profileError) {
        setLoading(false);
        setStatus({ type: "error", text: profileError.message });
        return;
      }
    }

    setLoading(false);
    setStatus({
      type: "info",
      text: "Account created. It needs Sherry's approval before you can access the agent tools — check back soon.",
    });
    setMode("login");
  }

  return (
    <>
      {status && (
        <div
          className="card"
          style={{
            marginBottom: 16,
            borderColor: status.type === "error" ? "#c0392b" : "var(--line)",
            color: status.type === "error" ? "#c0392b" : "inherit",
            fontSize: 14,
          }}
        >
          {status.text}
        </div>
      )}

      <form onSubmit={mode === "login" ? handleLogin : handleSignup}>
        {mode === "signup" && (
          <>
            <label htmlFor="fullName">Full name</label>
            <input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </>
        )}
        <label htmlFor="email">Email</label>
        <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="password">Password</label>
        <input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="btn" disabled={loading} style={{ width: "100%" }}>
          {loading ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
        </button>
      </form>

      <p style={{ fontSize: 14, marginTop: 16 }}>
        {mode === "login" ? (
          <>New agent? <button className="btn secondary" style={{ padding: "4px 10px", fontSize: 13 }} onClick={() => setMode("signup")}>Request access</button></>
        ) : (
          <>Already approved? <button className="btn secondary" style={{ padding: "4px 10px", fontSize: 13 }} onClick={() => setMode("login")}>Log in</button></>
        )}
      </p>
    </>
  );
}
