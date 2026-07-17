import Link from "next/link";

export const metadata = {
  title: "About Sherry Perry | Broker/Owner, CLICKpoint Realty — iClickHomes.com",
  description:
    "Sherry Perry, Broker/Owner of CLICKpoint Realty, LLC — 25 years of Texas real estate across Bryan–College Station and Central & East Texas. TREC #0563194.",
};

export default function AboutPage() {
  return (
    <>
      <section className="about-hero">
        <div className="container">
          <p className="eyebrow">About</p>
          <h1 style={{ fontSize: 40, fontWeight: 800 }}>Sherry Perry</h1>
          <p style={{ color: "var(--muted)", margin: "6px 0 0", fontSize: 17 }}>
            Broker/Owner · CLICKpoint Realty, LLC · TREC #0563194
          </p>
        </div>
      </section>

      <div className="container">
        <div className="about-body">
          <div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div className="avatar" aria-hidden="true">SP</div>
            </div>
            <div className="creds" style={{ flexDirection: "column", marginTop: 18 }}>
              <div className="cred"><b>25 years</b> of Texas real estate</div>
              <div className="cred"><b>Specialties</b> · Residential · Land · Investment · REO</div>
              <div className="cred"><b>TREC License</b> · #0563194</div>
            </div>
            <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link className="btn blue" href="/contact">Contact Sherry</Link>
              <Link className="btn ghost" href="/listings">Search Homes</Link>
            </div>
          </div>

          <div>
            <p>
              With 25 years of real estate experience, I bring seasoned market knowledge, straightforward
              guidance, and hands-on service to every transaction. As Broker/Owner of CLICKpoint Realty,
              LLC, our agents assist buyers, sellers, investors, and financial institutions throughout
              Bryan–College Station, Dallas, Houston, Central and East Texas communities.
            </p>
            <p>
              My background includes traditional residential sales, land and acreage, investment
              properties, foreclosures, bank-owned homes, and complex transactions that require more than
              a cookie-cutter approach. I&apos;m known for analyzing the details, anticipating potential
              problems, and helping my clients make informed decisions—not simply pushing them toward the
              quickest closing.
            </p>
            <p>
              Whether you&apos;re purchasing your first home, selling a longtime property, building an
              investment portfolio, or navigating an REO transaction, I&apos;ll give you honest answers,
              practical strategies, and steady communication from beginning to end. My goal is to protect
              your interests, simplify the process, and help you move forward with confidence.
            </p>
            <div className="counties">
              <b>Proudly serving</b> Bryan–College Station and communities throughout{" "}
              <b>Brazos, Burleson, Robertson, Madison, Leon, Grimes, and Washington</b> counties.
            </div>
            <p style={{ marginTop: 18, fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--ink)" }}>
              Ready to make your next move? Let&apos;s talk about your goals and create a strategy that
              makes sense for you.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
