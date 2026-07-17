import Link from "next/link";
import {
  searchListings,
  isTrestleConfigured,
  type ListingSearch,
  type SearchResult,
} from "@/lib/trestle";
import SearchBar from "@/components/SearchBar";
import ListingCard from "@/components/ListingCard";

export const dynamic = "force-dynamic";

type SearchParams = { [key: string]: string | string[] | undefined };

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

function toInt(v: string | string[] | undefined): number | undefined {
  const s = first(v);
  if (!s) return undefined;
  const n = parseInt(s.replace(/[^0-9]/g, ""), 10);
  return Number.isFinite(n) ? n : undefined;
}

function parseSearch(sp: SearchParams): ListingSearch {
  return {
    q: first(sp.q),
    minPrice: toInt(sp.min),
    maxPrice: toInt(sp.max),
    beds: toInt(sp.beds),
    baths: toInt(sp.baths),
    propertyType: first(sp.type),
    sort: first(sp.sort),
    page: toInt(sp.page) ?? 1,
  };
}

function buildQuery(search: ListingSearch, page: number): string {
  const p = new URLSearchParams();
  if (search.q) p.set("q", search.q);
  if (search.minPrice) p.set("min", String(search.minPrice));
  if (search.maxPrice) p.set("max", String(search.maxPrice));
  if (search.beds) p.set("beds", String(search.beds));
  if (search.baths) p.set("baths", String(search.baths));
  if (search.propertyType && search.propertyType !== "Any") p.set("type", search.propertyType);
  if (search.sort) p.set("sort", search.sort);
  if (page > 1) p.set("page", String(page));
  const s = p.toString();
  return s ? `/listings?${s}` : "/listings";
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const search = parseSearch(searchParams);

  if (!isTrestleConfigured()) {
    return (
      <div className="container" style={{ padding: "48px 0" }}>
        <h1>Search Homes</h1>
        <div className="card" style={{ maxWidth: 560 }}>
          <p style={{ margin: 0 }}>
            MLS search (Trestle IDX) isn&apos;t connected yet — add
            <code> TRESTLE_CLIENT_ID</code>, <code>TRESTLE_CLIENT_SECRET</code>,
            and <code>TRESTLE_API_BASE</code> to the environment and this page
            will start pulling live listings automatically.
          </p>
        </div>
      </div>
    );
  }

  let result: SearchResult | null = null;
  let error: string | null = null;
  try {
    result = await searchListings(search);
  } catch (e) {
    error = e instanceof Error ? e.message : "Unknown error loading listings.";
  }

  const page = search.page ?? 1;

  return (
    <div className="container" style={{ padding: "32px 0 64px" }}>
      <h1 style={{ marginBottom: 8 }}>Search Homes</h1>
      <p style={{ color: "#5a655e", marginTop: 0 }}>
        Live MLS listings across Texas — Bryan/College Station and the DFW metro.
      </p>

      <SearchBar current={search} />

      {error && (
        <div className="card" style={{ borderColor: "#c0392b", color: "#c0392b", margin: "16px 0" }}>
          Couldn&apos;t load listings from Trestle: {error}
        </div>
      )}

      {result && (
        <>
          <div className="results-meta">
            <span>
              {result.total.toLocaleString()} {result.total === 1 ? "home" : "homes"} found
              {result.totalPages > 1 ? ` · page ${result.page} of ${result.totalPages}` : ""}
            </span>
          </div>

          {result.listings.length === 0 ? (
            <div className="card" style={{ marginTop: 16 }}>
              <p style={{ margin: 0 }}>
                No homes matched your search. Try widening the price range or clearing filters.
              </p>
            </div>
          ) : (
            <div className="listing-grid">
              {result.listings.map((l) => (
                <ListingCard key={l.ListingKey} listing={l} />
              ))}
            </div>
          )}

          {result.totalPages > 1 && (
            <nav className="pagination">
              {page > 1 ? (
                <Link className="btn secondary" href={buildQuery(search, page - 1)}>
                  ← Previous
                </Link>
              ) : (
                <span className="btn secondary disabled">← Previous</span>
              )}
              <span className="page-indicator">
                Page {page} of {result.totalPages}
              </span>
              {page < result.totalPages ? (
                <Link className="btn secondary" href={buildQuery(search, page + 1)}>
                  Next →
                </Link>
              ) : (
                <span className="btn secondary disabled">Next →</span>
              )}
            </nav>
          )}
        </>
      )}

      <p className="idx-disclaimer">
        Listing data courtesy of the participating MLS via Trestle (CoreLogic). Information is
        deemed reliable but not guaranteed. Sherry Perry — CLICKpoint Realty, LLC.
      </p>
    </div>
  );
}
