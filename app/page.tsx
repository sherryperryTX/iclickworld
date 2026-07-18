import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import ListingCard from "@/components/ListingCard";
import { getMyListings, isTrestleConfigured, type TrestleListing } from "@/lib/trestle";

export const dynamic = "force-dynamic";

const TABS = ["Buy", "Sell", "Land", "Commercial", "REO"];

export default async function HomePage() {
  let mine: TrestleListing[] = [];
  if (isTrestleConfigured()) {
    try {
      mine = await getMyListings(8);
    } catch {
      mine = [];
    }
  }

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container">
          <p className="tagline">The Smartest Point in Real Estate.</p>
          <h1>
            Find your next home across <span className="b">Texas</span>.
          </h1>
          <p className="sub">
            Live MLS search for Bryan/College Station, Houston, and Central &amp; East Texas — plus
            exclusive REO &amp; bank-owned inventory from Sherry Perry, CLICKpoint Realty.
          </p>
          <div className="tabs">
            {TABS.map((t, i) => (
              <div key={t} className={`tab${i === 0 ? " active" : ""}`}>
                {t}
              </div>
            ))}
          </div>
          <SearchBar />
          <div className="quick">
            Popular:{" "}
            <Link className="chip" href="/listings?q=College Station">College Station</Link>
            <Link className="chip" href="/listings?q=Bryan">Bryan</Link>
            <Link className="chip" href="/listings?q=Brenham">Brenham</Link>
            <Link className="chip" href="/listings?type=Land">Land &amp; Acreage</Link>
            <a className="chip" href="https://reo.properties" target="_blank" rel="noopener noreferrer">REO / Bank-Owned</a>
          </div>
        </div>
      </section>

      {/* FEATURED — Sherry's listings */}
      {mine.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="sec-head">
              <div>
                <p className="eyebrow">Sherry&apos;s Listings</p>
                <h2 className="sec">Featured homes</h2>
                <p className="sec-sub">
                  Sherry Perry&apos;s active listings — updated live from the MLS.
                </p>
              </div>
              <Link className="link-more" href="/listings">View all listings →</Link>
            </div>
            <div className="rail">
              {mine.slice(0, 4).map((l) => (
                <ListingCard key={l.ListingKey} listing={l} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* MARKET PULSE */}
      <section className="section gray">
        <div className="container">
          <p className="eyebrow" style={{ textAlign: "center" }}>Texas market pulse</p>
          <h2 className="sec" style={{ textAlign: "center", marginBottom: 26 }}>
            Know the market before you move
          </h2>
          <div className="stats">
            <div className="stat"><div className="num">86,000+</div><div className="lbl">Active listings searchable</div></div>
            <div className="stat"><div className="num">25</div><div className="lbl">Years of experience</div></div>
            <div className="stat"><div className="num">7</div><div className="lbl">Counties served</div></div>
            <div className="stat"><div className="num">100%</div><div className="lbl">Live MLS accuracy</div></div>
          </div>
        </div>
      </section>

      {/* SELLER VALUATION CTA */}
      <section className="section">
        <div className="container">
          <div className="band orange">
            <div>
              <h3>What&apos;s your home worth in today&apos;s market?</h3>
              <p>Get a straightforward valuation from Sherry — backed by live comparable sales, not a generic algorithm.</p>
            </div>
            <Link className="btn white lg" href="/contact">Get a Home Valuation →</Link>
          </div>
        </div>
      </section>

      {/* AUTHORITY */}
      <section className="section gray">
        <div className="container">
          <div className="auth">
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img className="avatar" src="/sherry-perry.jpg" alt="Sherry Perry, Broker/Owner of CLICKpoint Realty" width={180} height={180} />
            </div>
            <div>
              <p className="eyebrow">Your Texas broker</p>
              <h2 className="sec">Sherry Perry — Broker/Owner, CLICKpoint Realty</h2>
              <p className="sec-sub" style={{ maxWidth: 640 }}>
                25 years of seasoned market knowledge and straightforward guidance — traditional
                residential, land &amp; acreage, investment property, and REO / bank-owned transactions
                across Bryan–College Station and Central &amp; East Texas.
              </p>
              <div className="creds">
                <div className="cred"><b>Broker/Owner</b> · CLICKpoint Realty, LLC</div>
                <div className="cred"><b>TREC License</b> · #0563194</div>
                <div className="cred"><b>Experience</b> · 25 years</div>
              </div>
              <div style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Link className="btn blue" href="/about">About Sherry</Link>
                <Link className="btn ghost" href="/contact">Contact Agent</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REO GATEWAY */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="reo">
            <div>
              <h3>Exclusive <span>REO &amp; bank-owned</span> inventory</h3>
              <p>Sherry&apos;s dedicated REO portal — full foreclosure and bank-owned detail lives at reo.properties, connected to this site.</p>
            </div>
            <a className="btn orange lg" href="https://reo.properties" target="_blank" rel="noopener noreferrer">
              Visit REO.properties ↗
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
