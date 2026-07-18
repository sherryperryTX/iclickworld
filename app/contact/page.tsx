import ContactForm from "./ContactForm";

export const metadata = {
  title: "Contact Sherry Perry | iClickHomes.com — CLICKpoint Realty",
  description:
    "Reach Sherry Perry, Broker/Owner of CLICKpoint Realty. Buying, selling, land, commercial, or REO across Bryan–College Station and Central & East Texas. TREC #0563194.",
};

// Map CTA query params to a preselected interest.
const INTEREST_MAP: Record<string, string> = {
  valuation: "Home valuation",
  sell: "Sell my home",
  buy: "Buy a home",
  land: "Land & acreage",
  commercial: "Commercial",
  reo: "REO / bank-owned",
};

export default function ContactPage({
  searchParams,
}: {
  searchParams?: { interest?: string; ref?: string; source?: string };
}) {
  const key = (searchParams?.interest || "").toLowerCase();
  const defaultInterest = INTEREST_MAP[key];
  const propertyRef = searchParams?.ref;
  const source = searchParams?.source || (propertyRef ? "listing" : "contact");

  return (
    <>
      <section className="about-hero">
        <div className="container">
          <p className="eyebrow">Contact</p>
          <h1 style={{ fontSize: 40, fontWeight: 800 }}>Let&apos;s talk about your move</h1>
          <p style={{ color: "var(--muted)", margin: "6px 0 0", fontSize: 17, maxWidth: 620 }}>
            Tell Sherry what you&apos;re looking for and she&apos;ll follow up personally — no
            call center, no auto-responders, no pressure.
          </p>
        </div>
      </section>

      <div className="container">
        <div className="contact-grid">
          <div className="contact-card">
            <ContactForm source={source} propertyRef={propertyRef} defaultInterest={defaultInterest} />
          </div>

          <aside className="contact-side">
            <h4>Sherry Perry</h4>
            <p className="contact-role">Broker/Owner · CLICKpoint Realty, LLC</p>
            <div className="contact-lines">
              <a href="mailto:sherry@iclickhomes.com">sherry@iclickhomes.com</a>
              <span className="contact-meta">The Smartest Point in Real Estate</span>
            </div>
            <div className="contact-block">
              <b>Serving</b>
              <p>Bryan–College Station, Houston, and Central &amp; East Texas — Brazos, Burleson, Robertson, Madison, Leon, Grimes &amp; Washington counties.</p>
            </div>
            <div className="contact-block">
              <b>Specialties</b>
              <p>Residential · Land &amp; acreage · Investment · REO / bank-owned · Commercial</p>
            </div>
            <div className="contact-block">
              <b>License</b>
              <p>TREC #0563194</p>
            </div>
            <a className="btn ghost" href="https://reo.properties" target="_blank" rel="noopener noreferrer">
              Visit REO.properties ↗
            </a>
          </aside>
        </div>
      </div>
    </>
  );
}
