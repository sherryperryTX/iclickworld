import Link from "next/link";
import {
  type TrestleListing,
  primaryPhoto,
  formatPrice,
  listingAddress,
} from "@/lib/trestle";

export default function ListingCard({ listing }: { listing: TrestleListing }) {
  const photo = primaryPhoto(listing);
  const status = listing.StandardStatus ?? "";
  const showStatus = status && status !== "Active";

  return (
    <Link href={`/listings/${encodeURIComponent(listing.ListingKey)}`} className="listing-card">
      <div className="listing-photo">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt={listingAddress(listing)} loading="lazy" />
        ) : (
          <div className="listing-photo-placeholder">No photo</div>
        )}
        {showStatus && <span className="badge">{status}</span>}
      </div>
      <div className="listing-body">
        <p className="listing-price">{formatPrice(listing.ListPrice, listing.PropertyType)}</p>
        <p className="listing-address">{listingAddress(listing)}</p>
        <p className="listing-loc">
          {[listing.City, listing.StateOrProvince, listing.PostalCode].filter(Boolean).join(", ")}
        </p>
        <p className="listing-facts">
          {listing.BedroomsTotal ?? "–"} bd · {listing.BathroomsTotalInteger ?? "–"} ba
          {listing.LivingArea ? ` · ${listing.LivingArea.toLocaleString()} sqft` : ""}
        </p>
      </div>
    </Link>
  );
}
