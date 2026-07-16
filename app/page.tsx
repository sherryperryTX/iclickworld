import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <section style={{ padding: "72px 0", background: "var(--brand-light)" }}>
        <div className="container">
          <h1 style={{ fontSize: 40, maxWidth: 640, lineHeight: 1.15 }}>
            Real estate in the Bryan/College Station area, done straight.
          </h1>
          <p style={{ fontSize: 18, maxWidth: 560, color: "#3a453f" }}>
            Sherry Perry — CLICKpoint Realty, LLC. Traditional listings, investment
            &amp; commercial property, and exclusive REO / bank-owned inventory.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <Link href="/listings" className="btn">Search Listings</Link>
            <a href="https://reo.properties" target="_blank" rel="noopener noreferrer" className="btn secondary">
              Browse REO Properties
            </a>
          </div>
        </div>
      </section>

      <section className="container" style={{ padding: "56px 0" }}>
        <h2 style={{ fontSize: 24, marginBottom: 20 }}>What Sherry works with</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Traditional Sales</h3>
            <p style={{ color: "#555", fontSize: 14 }}>
              Buying and selling homes throughout the Bryan/College Station area.
            </p>
          </div>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>REO &amp; Bank-Owned</h3>
            <p style={{ color: "#555", fontSize: 14 }}>
              Exclusive bank-owned listings — full detail at{" "}
              <a href="https://reo.properties" target="_blank" rel="noopener noreferrer">reo.properties</a>.
            </p>
          </div>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Investment &amp; Commercial</h3>
            <p style={{ color: "#555", fontSize: 14 }}>
              Investment property and commercial deals across the region.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
