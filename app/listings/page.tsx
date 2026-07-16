import { getListings, isTrestleConfigured, type TrestleListing } from "@/lib/trestle";

export const dynamic = "force-dynamic";

export default async function ListingsPage() {
  if (!isTrestleConfigured()) {
    return (
      <div className="container" style={{ padding: "56px 0" }}>
        <h1>Listings</h1>
        <div className="card" style={{ maxWidth: 560 }}>
          <p style={{ margin: 0 }}>
            MLS search (Trestle IDX) isn&apos;t connected yet — add
            <code> TRESTLE_CLIENT_ID</code>, <code>TRESTLE_CLIENT_SECRET</code>,
            and <code>TRESTLE_API_BASE</code> to your environment and this page
            will start pulling live listings automatically.
          </p>
        </div>
      </div>
    );
  }

  let listings: TrestleListing[] = [];
  let error: string | null = null;
  try {
    listings = await getListings({ top: 24 });
  } catch (e) {
    error = e instanceof Error ? e.message : "Unknown error loading listings.";
  }

  return (
    <div className="container" style={{ padding: "56px 0" }}>
      <h1>Listings</h1>

      {error && (
        <div className="card" style={{ borderColor: "#c0392b", color: "#c0392b", marginBottom: 24 }}>
          Couldn&apos;t load listings from Trestle: {error}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
        {listings.map((listing) => (
          <div key={listing.ListingKey} className="card">
            <h3 style={{ marginTop: 0, marginBottom: 4 }}>
              {listing.UnparsedAddress ?? "Address unavailable"}
            </h3>
            <p style={{ color: "#555", fontSize: 14, margin: "0 0 8px" }}>
              {[listing.City, listing.StateOrProvince, listing.PostalCode].filter(Boolean).join(", ")}
            </p>
            <p style={{ fontWeight: 700, fontSize: 18, margin: "0 0 8px" }}>
              {listing.ListPrice ? `$${listing.ListPrice.toLocaleString()}` : "Price on request"}
            </p>
            <p style={{ color: "#555", fontSize: 13 }}>
              {listing.BedroomsTotal ?? "–"} bd · {listing.BathroomsTotalInteger ?? "–"} ba
              {listing.LivingArea ? ` · ${listing.LivingArea.toLocaleString()} sqft` : ""}
            </p>
          </div>
        ))}
        {!error && listings.length === 0 && <p>No active listings returned.</p>}
      </div>
    </div>
  );
}
