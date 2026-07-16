import Link from "next/link";

// Public site nav. Deliberately does not include Replit-hosted tool links —
// those live behind /agent (see AgentLauncher). reo.properties is public-facing
// (Sherry's REO buyer portal), so it's a top-level link, not gated.
export default function NavBar() {
  return (
    <header style={{ borderBottom: "1px solid var(--line)", background: "#fff" }}>
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 68,
        }}
      >
        <Link href="/" style={{ fontWeight: 800, fontSize: 20, textDecoration: "none" }}>
          iClickHomes<span style={{ color: "var(--brand)" }}>.com</span>
        </Link>
        <nav style={{ display: "flex", gap: 24, alignItems: "center", fontSize: 15 }}>
          <Link href="/listings" style={{ textDecoration: "none" }}>Listings</Link>
          <a href="https://reo.properties" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
            REO Properties ↗
          </a>
          <Link href="/about" style={{ textDecoration: "none" }}>About Sherry</Link>
          <Link href="/contact" style={{ textDecoration: "none" }}>Contact</Link>
          <Link href="/agent-login" className="btn secondary" style={{ padding: "8px 16px" }}>
            Agent Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
