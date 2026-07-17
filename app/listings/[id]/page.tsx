import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getListingByKey,
  isTrestleConfigured,
  listingPhotos,
  formatPrice,
  listingAddress,
  type TrestleListing,
} from "@/lib/trestle";

export const dynamic = "force-dynamic";

function Fact({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="fact">
      <span className="fact-label">{label}</span>
      <span className="fact-value">{value}</span>
    </div>
  );
}

export default async function ListingDetailPage({ params }: { params: { id: string } }) {
  if (!isTrestleConfigured()) notFound();

  const key = decodeURIComponent(params.id);
  let listing: TrestleListing | null = null;
  let error: string | null = null;
  try {
    listing = await getListingByKey(key);
  } catch (e) {
    error = e instanceof Error ? e.message : "Unknown error loading this listing.";
  }

  if (error) {
    return (
      <div className="container" style={{ padding: "48px 0" }}>
        <p>
          <Link href="/listings">← Back to search</Link>
        </p>
        <div className="card" style={{ borderColor: "#c0392b", color: "#c0392b" }}>
          Couldn&apos;t load this listing: {error}
        </div>
      </div>
    );
  }

  if (!listing) notFound();

  const photos = listingPhotos(listing);
  const loc = [listing.City, listing.StateOrProvince, listing.PostalCode].filter(Boolean).join(", ");

  return (
    <div className="container" style={{ padding: "24px 0 64px" }}>
      <p style={{ marginBottom: 16 }}>
        <Link href="/listings">← Back to search</Link>
      </p>

      {photos.length > 0 ? (
        <div className={`gallery gallery-${Math.min(photos.length, 5)}`}>
          {photos.slice(0, 5).map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt={`${listingAddress(listing!)} photo ${i + 1}`} loading={i === 0 ? "eager" : "lazy"} />
          ))}
        </div>
      ) : (
        <div className="listing-photo-placeholder" style={{ height: 280, borderRadius: 12 }}>
          No photos available
        </div>
      )}

      <div className="detail-head">
        <div>
          <h1 style={{ marginBottom: 4 }}>{listingAddress(listing)}</h1>
          <p style={{ color: "#5a655e", margin: 0 }}>{loc}</p>
        </div>
        <div className="detail-price">{formatPrice(listing.ListPrice, listing.PropertyType)}</div>
      </div>

      <div className="facts-grid">
        <Fact label="Beds" value={listing.BedroomsTotal} />
        <Fact label="Baths" value={listing.BathroomsTotalInteger} />
        <Fact
          label="Living area"
          value={listing.LivingArea ? `${listing.LivingArea.toLocaleString()} sqft` : undefined}
        />
        <Fact label="Year built" value={listing.YearBuilt} />
        <Fact label="Type" value={listing.PropertySubType ?? listing.PropertyType} />
        <Fact
          label="Lot"
          value={
            listing.LotSizeAcres
              ? `${listing.LotSizeAcres} ac`
              : listing.LotSizeSquareFeet
                ? `${listing.LotSizeSquareFeet.toLocaleString()} sqft`
                : undefined
          }
        />
        <Fact label="Garage" value={listing.GarageSpaces} />
        <Fact label="Status" value={listing.StandardStatus} />
        <Fact label="MLS #" value={listing.ListingId} />
        <Fact label="Subdivision" value={listing.SubdivisionName} />
      </div>

      {listing.PublicRemarks && (
        <section style={{ marginTop: 28 }}>
          <h2 style={{ fontSize: 20 }}>About this home</h2>
          <p style={{ lineHeight: 1.6, color: "#2b342f" }}>{listing.PublicRemarks}</p>
        </section>
      )}

      <div className="detail-cta card">
        <div>
          <strong>Interested in this property?</strong>
          <p style={{ margin: "4px 0 0", color: "#5a655e" }}>
            Sherry Perry — CLICKpoint Realty, LLC can get you in for a showing.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href="/contact" className="btn">Contact Sherry</Link>
          <a href="tel:+1" className="btn secondary" style={{ display: "none" }}>Call</a>
        </div>
      </div>

      <p className="idx-disclaimer">
        {listing.ListOfficeName ? `Listing courtesy of ${listing.ListOfficeName}. ` : ""}
        Listing data provided by the participating MLS via Trestle (CoreLogic). Information deemed
        reliable but not guaranteed.
      </p>
    </div>
  );
}
