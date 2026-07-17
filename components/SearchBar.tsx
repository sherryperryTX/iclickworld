import { PROPERTY_TYPES, type ListingSearch } from "@/lib/trestle";

// Plain GET form — works without client-side JS. Submitting navigates to
// /listings?q=...&min=...&max=... and the server component re-queries Trestle.
export default function SearchBar({
  current,
  compact = false,
}: {
  current?: ListingSearch;
  compact?: boolean;
}) {
  const c = current ?? {};
  return (
    <form action="/listings" method="get" className={`searchbar${compact ? " compact" : ""}`}>
      <div className="searchbar-row">
        <input
          type="text"
          name="q"
          placeholder="City or ZIP (e.g. College Station or 77840)"
          defaultValue={c.q ?? ""}
          aria-label="City or ZIP"
          className="sb-grow"
        />
        <select name="type" defaultValue={c.propertyType ?? "Any"} aria-label="Property type">
          <option value="Any">Any type</option>
          {PROPERTY_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <button type="submit" className="btn">Search</button>
      </div>

      <div className="searchbar-row filters">
        <select name="min" defaultValue={c.minPrice ? String(c.minPrice) : ""} aria-label="Min price">
          <option value="">No min</option>
          <option value="50000">$50k</option>
          <option value="100000">$100k</option>
          <option value="150000">$150k</option>
          <option value="200000">$200k</option>
          <option value="300000">$300k</option>
          <option value="400000">$400k</option>
          <option value="500000">$500k</option>
          <option value="750000">$750k</option>
          <option value="1000000">$1M</option>
        </select>
        <select name="max" defaultValue={c.maxPrice ? String(c.maxPrice) : ""} aria-label="Max price">
          <option value="">No max</option>
          <option value="150000">$150k</option>
          <option value="200000">$200k</option>
          <option value="300000">$300k</option>
          <option value="400000">$400k</option>
          <option value="500000">$500k</option>
          <option value="750000">$750k</option>
          <option value="1000000">$1M</option>
          <option value="2000000">$2M</option>
          <option value="5000000">$5M+</option>
        </select>
        <select name="beds" defaultValue={c.beds ? String(c.beds) : ""} aria-label="Minimum beds">
          <option value="">Beds</option>
          <option value="1">1+ bd</option>
          <option value="2">2+ bd</option>
          <option value="3">3+ bd</option>
          <option value="4">4+ bd</option>
          <option value="5">5+ bd</option>
        </select>
        <select name="baths" defaultValue={c.baths ? String(c.baths) : ""} aria-label="Minimum baths">
          <option value="">Baths</option>
          <option value="1">1+ ba</option>
          <option value="2">2+ ba</option>
          <option value="3">3+ ba</option>
          <option value="4">4+ ba</option>
        </select>
        <select name="sort" defaultValue={c.sort ?? "newest"} aria-label="Sort">
          <option value="newest">Newest</option>
          <option value="price_asc">Price ↑</option>
          <option value="price_desc">Price ↓</option>
          <option value="beds_desc">Most beds</option>
        </select>
      </div>
    </form>
  );
}
