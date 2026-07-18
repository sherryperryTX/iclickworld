import Link from "next/link";
import type { Metadata } from "next";
import { COMMUNITIES } from "@/lib/communities";

export const metadata: Metadata = {
  title: "Texas Communities We Serve | iClickHomes.com — Sherry Perry, CLICKpoint Realty",
  description:
    "Browse homes for sale by community across Bryan–College Station and Central & East Texas — Brazos, Burleson, Robertson, Madison, Leon, Grimes & Washington counties. Live MLS search with Sherry Perry, CLICKpoint Realty.",
  alternates: { canonical: "https://www.iclick.world/communities" },
};

// Group communities by county for a scannable, link-rich index (good for SEO).
function byCounty() {
  const map = new Map<string, typeof COMMUNITIES>();
  for (const c of COMMUNITIES) {
    const arr = map.get(c.county) || [];
    arr.push(c);
    map.set(c.county, arr);
  }
  return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
}

export default function CommunitiesIndex() {
  const groups = byCounty();

  return (
    <>
      <section className="about-hero">
        <div className="container">
          <p className="eyebrow">Communities</p>
          <h1 style={{ fontSize: 38, fontWeight: 800, margin: 0 }}>
            Texas communities we serve
          </h1>
          <p style={{ color: "var(--muted)", margin: "10px 0 0", fontSize: 17, maxWidth: 700 }}>
            Explore homes for sale across Bryan–College Station and Central &amp; East Texas. Pick a
            community for live MLS listings, market context, and local guidance from Sherry Perry,
            CLICKpoint Realty.
          </p>
        </div>
      </section>

      <div className="container" style={{ padding: "36px 0 60px" }}>
        {groups.map(([county, list]) => (
          <div key={county} style={{ marginBottom: 30 }}>
            <h2 className="sec" style={{ fontSize: 22, marginBottom: 14 }}>{county} County</h2>
            <div className="community-grid">
              {list.map((c) => (
                <Link key={c.slug} className="community-tile" href={`/communities/${c.slug}`}>
                  <b>{c.name}</b>
                  <span>Homes for sale · {c.county} County</span>
                </Link>
              ))}
            </div>
          </div>
        ))}

        <div className="band orange" style={{ marginTop: 20 }}>
          <div>
            <h3>Don&apos;t see your town?</h3>
            <p>Sherry works across all of Central &amp; East Texas. Tell her where you&apos;re looking and she&apos;ll help.</p>
          </div>
          <Link className="btn white lg" href="/contact">Contact Sherry →</Link>
        </div>
      </div>
    </>
  );
}
