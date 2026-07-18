import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { COMMUNITIES, getCommunity } from "@/lib/communities";
import { searchListings, isTrestleConfigured, type TrestleListing } from "@/lib/trestle";
import ListingCard from "@/components/ListingCard";

export const revalidate = 600;

export function generateStaticParams() {
  return COMMUNITIES.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const c = getCommunity(params.slug);
  if (!c) return { title: "Community not found | iClickHomes.com" };
  const title = `Homes for Sale in ${c.name}, TX | ${c.county} County Real Estate`;
  const description = `Search live MLS listings for ${c.name}, Texas (${c.county} County). ${c.intro} Homes, land & acreage with Sherry Perry, CLICKpoint Realty. TREC #0563194.`;
  return {
    title,
    description,
    alternates: { canonical: `https://www.iclick.world/communities/${c.slug}` },
    openGraph: {
      title,
      description,
      url: `https://www.iclick.world/communities/${c.slug}`,
      type: "website",
    },
  };
}

const fmt = (n: number) => n.toLocaleString("en-US");

export default async function CommunityPage({ params }: { params: { slug: string } }) {
  const c = getCommunity(params.slug);
  if (!c) notFound();

  let total = 0;
  let featured: TrestleListing[] = [];
  if (isTrestleConfigured()) {
    try {
      const res = await searchListings({ q: c.name, pageSize: 6, sort: "newest" });
      total = res.total;
      featured = res.listings;
    } catch {
      total = 0;
      featured = [];
    }
  }

  const q = encodeURIComponent(c.name);
  const nearby = c.nearby.map(getCommunity).filter(Boolean) as typeof COMMUNITIES;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://www.iclick.world/" },
          { "@type": "ListItem", position: 2, name: "Communities", item: "https://www.iclick.world/communities" },
          { "@type": "ListItem", position: 3, name: c.name, item: `https://www.iclick.world/communities/${c.slug}` },
        ],
      },
      {
        "@type": "Place",
        name: `${c.name}, Texas`,
        address: { "@type": "PostalAddress", addressLocality: c.name, addressRegion: "TX", addressCountry: "US" },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="about-hero">
        <div className="container">
          <p className="eyebrow" style={{ marginBottom: 6 }}>
            <Link href="/communities" style={{ color: "var(--orange)" }}>Communities</Link> · {c.county} County
          </p>
          <h1 style={{ fontSize: 38, fontWeight: 800, margin: 0 }}>
            Homes for sale in {c.name}, Texas
          </h1>
          <p style={{ color: "var(--muted)", margin: "10px 0 0", fontSize: 17, maxWidth: 680 }}>
            {isTrestleConfigured() && total > 0
              ? `${fmt(total)} active MLS listings in and around ${c.name} right now — updated live.`
              : `Live MLS listings for ${c.name} and ${c.county} County.`}
          </p>
          <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link className="btn orange lg" href={`/listings?q=${q}`}>Search all {c.name} homes →</Link>
            <Link className="btn ghost" href={`/contact?source=community-${c.slug}`}>Ask Sherry about {c.name}</Link>
          </div>
        </div>
      </section>

      <div className="container" style={{ padding: "36px 0 10px" }}>
        <div className="community-quicklinks">
          <Link className="ql" href={`/listings?q=${q}&max=300000`}>Under $300k</Link>
          <Link className="ql" href={`/listings?q=${q}&min=300000&max=500000`}>$300k–$500k</Link>
          <Link className="ql" href={`/listings?q=${q}&min=500000`}>$500k+</Link>
          <Link className="ql" href={`/listings?q=${q}&type=Land`}>Land &amp; acreage</Link>
          <Link className="ql" href={`/listings?q=${q}&beds=3`}>3+ bedrooms</Link>
        </div>
      </div>

      {featured.length > 0 && (
        <section className="section" style={{ paddingTop: 18 }}>
          <div className="container">
            <div className="sec-head">
              <div>
                <p className="eyebrow">Now on the market</p>
                <h2 className="sec">Featured {c.name} listings</h2>
              </div>
              <Link className="link-more" href={`/listings?q=${q}`}>View all {c.name} homes →</Link>
            </div>
            <div className="rail">
              {featured.slice(0, 6).map((l) => (
                <ListingCard key={l.ListingKey} listing={l} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section gray">
        <div className="container community-copy">
          <h2 className="sec" style={{ marginBottom: 12 }}>Living in {c.name}</h2>
          <p>{c.intro}</p>
          <p>
            Whether you&apos;re buying your first home, selling, searching for land and acreage, or
            looking at investment and REO opportunities in {c.county} County, Sherry Perry brings 25
            years of local market knowledge to your {c.name} transaction. Reach out for a straightforward,
            no-pressure conversation about your goals.
          </p>
          {c.zips.length > 0 && (
            <p style={{ color: "var(--muted)", fontSize: 14 }}>
              <b>{c.name} ZIP codes:</b> {c.zips.join(", ")}
            </p>
          )}
          <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link className="btn blue" href={`/contact?source=community-${c.slug}`}>Contact Sherry</Link>
            <Link className="btn ghost" href={`/contact?interest=valuation&source=community-${c.slug}`}>Get a home valuation</Link>
          </div>
        </div>
      </section>

      {nearby.length > 0 && (
        <section className="section">
          <div className="container">
            <p className="eyebrow">Explore nearby</p>
            <h2 className="sec" style={{ marginBottom: 18 }}>Communities near {c.name}</h2>
            <div className="community-grid">
              {nearby.map((n) => (
                <Link key={n.slug} className="community-tile" href={`/communities/${n.slug}`}>
                  <b>{n.name}</b>
                  <span>{n.county} County</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
