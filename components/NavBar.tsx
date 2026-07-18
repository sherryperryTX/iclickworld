import Link from "next/link";

export default function NavBar() {
  return (
    <>
      <div className="util">
        <div className="container">
          <span>The Smartest Point in Real Estate · Bryan–College Station · Houston · Central &amp; East Texas</span>
          <span>
            <a href="mailto:sherry@iclickhomes.com">sherry@iclickhomes.com</a>
            <Link href="/agent-login">Agent Login</Link>
          </span>
        </div>
      </div>
      <header className="site-head">
        <div className="container">
          <nav className="nav">
            <Link href="/" className="logo" aria-label="iClickHomes.com home">
              <img className="mk" src="/clickpoint-logo.jpg" alt="CLICKpoint Realty" width={34} height={34} />
              <span className="wm">iClickHomes<b>.com</b></span>
            </Link>
            <div className="links">
              <Link href="/listings">Buy</Link>
              <Link href="/listings?type=Land">Land</Link>
              <Link href="/communities">Communities</Link>
              <Link href="/about">About Sherry</Link>
              <a href="https://reo.properties" target="_blank" rel="noopener noreferrer">REO ↗</a>
              <Link href="/contact">Contact</Link>
              <Link href="/listings" className="btn orange cta">Search Homes</Link>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
