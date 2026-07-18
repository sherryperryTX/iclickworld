import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-foot">
      <div className="container">
        <div className="cols">
          <div>
            <Link href="/" className="logo" style={{ marginBottom: 12 }}>
              <img className="mk" src="/clickpoint-logo.jpg" alt="CLICKpoint Realty" width={34} height={34} />
              <span className="wm" style={{ color: "#fff" }}>iClickHomes<b>.com</b></span>
            </Link>
            <p style={{ color: "#aeb6bf", fontSize: 13.5, maxWidth: 300 }}>
              The Smartest Point in Real Estate. Sherry Perry, CLICKpoint Realty, LLC — live Texas MLS
              search, REO, investment &amp; commercial.
            </p>
          </div>
          <div>
            <h5>Search</h5>
            <Link href="/listings">Buy</Link>
            <Link href="/listings?type=Land">Land</Link>
            <Link href="/listings?type=Commercial Sale">Commercial</Link>
            <Link href="/listings">All listings</Link>
          </div>
          <div>
            <h5>Company</h5>
            <Link href="/about">About Sherry</Link>
            <Link href="/contact">Contact</Link>
            <a href="https://reo.properties" target="_blank" rel="noopener noreferrer">REO.properties ↗</a>
          </div>
          <div>
            <h5>Ecosystem</h5>
            <a href="https://reo.properties" target="_blank" rel="noopener noreferrer">REO.properties ↗</a>
            <Link href="/agent-login">Agent Login</Link>
          </div>
        </div>
        <div className="foot-legal">
          Listing data courtesy of the participating MLS via Trestle (CoreLogic). Information deemed
          reliable but not guaranteed. Sherry Perry, Broker · TREC #0563194 · © 2026 CLICKpoint Realty,
          LLC. Equal Housing Opportunity.
        </div>
      </div>
    </footer>
  );
}
