import { createClient } from "@/lib/supabase/server";
import { agentTools } from "@/lib/agent-tools";
import LogoutButton from "./LogoutButton";

// Actual access control happens in middleware.ts (redirects unapproved /
// logged-out visitors to /agent-login before this ever renders). This page
// just reads the profile for the greeting.
export default async function AgentDashboard() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("app_users")
    .select("full_name, email")
    .eq("id", user?.id)
    .single();

  return (
    <div className="container" style={{ padding: "48px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Agent Tools</h1>
        <LogoutButton />
      </div>
      <p style={{ color: "#555" }}>
        Welcome{profile?.full_name ? `, ${profile.full_name}` : ""}. Each tool below
        also runs as its own standalone site — this page is just a launcher.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginTop: 24 }}>
        {agentTools.map((tool) => (
          <div key={tool.name} className="card">
            <h3 style={{ marginTop: 0, marginBottom: 6 }}>{tool.name}</h3>
            <p style={{ color: "#555", fontSize: 14, minHeight: 42 }}>{tool.description}</p>
            {tool.status === "pending" ? (
              <span style={{ fontSize: 13, color: "#999" }}>Link coming soon</span>
            ) : (
              <a
                href={tool.url!}
                target="_blank"
                rel="noopener noreferrer"
                className="btn secondary"
                style={{ fontSize: 14 }}
              >
                Open {tool.status === "unverified" ? "(unverified link)" : ""}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
