import Link from "next/link";
import SearchBar from "@/components/SearchBar";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">
            Find your next home in the Bryan/College Station area.
          </h1>
          <p className="hero-sub">
            Sherry Perry — CLICKpoint Realty, LLC. Search live MLS listings, plus exclusive
            REO / bank-owned inventory and investment &amp; commercial property.
          </p>
          <div className="hero-search">
            <SearchBar />
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
            <Link href="/listings" className="btn">Browse all listings</Link>
            <a
              href="https://reo.properties"
              target="_blank"
              rel="noopener noreferrer"
              className="btn secondary"
            >
              REO / Bank-Owned ↗
            </a>
          </div>
        </div>
      </section>

      <section className="container" style={{ padding: "56px 0" }}>
        <h2 style={{ fontSize: 24, marginBottom: 20 }}>What Sherry works with</h2>
        <div className="feature-grid">
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Traditional Sales</h3>
            <p style={{ color: "#555", fontSize: 14 }}>
              Buying and selling homes throughout the Bryan/College Station area, backed by live
              MLS search.
            </p>
          </div>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>REO &amp; Bank-Owned</h3>
            <p style={{ color: "#555", fontSize: 14 }}>
              Exclusive bank-owned listings — full detail at{" "}
              <a href="https://reo.properties" target="_blank" rel="noopener noreferrer">
                reo.properties
              </a>
              .
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
