// Trestle (CoreLogic) IDX client — RESO Web API, OAuth2 client_credentials.
// Docs: https://trestle-documentation.corelogic.com/
//
// Needs three env vars (server-side only, never NEXT_PUBLIC_):
//   TRESTLE_CLIENT_ID
//   TRESTLE_CLIENT_SECRET
//   TRESTLE_API_BASE      e.g. https://api-trestle.corelogic.com/trestle/odata
// Token endpoint is fixed by Trestle: https://api-trestle.corelogic.com/trestle/oidc/connect/token
//
// If the env vars aren't set yet, isTrestleConfigured() returns false and
// callers should fall back to a "coming soon" placeholder instead of calling
// the query helpers.

const TOKEN_URL = "https://api-trestle.corelogic.com/trestle/oidc/connect/token";

let cachedToken: { value: string; expiresAt: number } | null = null;

export function isTrestleConfigured(): boolean {
  return Boolean(
    process.env.TRESTLE_CLIENT_ID &&
      process.env.TRESTLE_CLIENT_SECRET &&
      process.env.TRESTLE_API_BASE
  );
}

async function getToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) {
    return cachedToken.value;
  }

  const clientId = process.env.TRESTLE_CLIENT_ID;
  const clientSecret = process.env.TRESTLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("Trestle credentials are not configured (TRESTLE_CLIENT_ID / TRESTLE_CLIENT_SECRET).");
  }

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
      scope: "api",
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Trestle token request failed (${res.status}): ${body}`);
  }

  const json = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = {
    value: json.access_token,
    expiresAt: Date.now() + json.expires_in * 1000,
  };
  return cachedToken.value;
}

export type TrestleMedia = {
  MediaURL?: string;
  Order?: number;
  MediaCategory?: string;
  MediaType?: string;
  ShortDescription?: string;
};

export type TrestleListing = {
  ListingKey: string;
  ListingId?: string;
  UnparsedAddress?: string;
  StreetNumber?: string;
  StreetName?: string;
  City?: string;
  StateOrProvince?: string;
  PostalCode?: string;
  ListPrice?: number;
  BedroomsTotal?: number;
  BathroomsTotalInteger?: number;
  BathroomsFull?: number;
  BathroomsHalf?: number;
  LivingArea?: number;
  LotSizeAcres?: number;
  LotSizeArea?: number;
  LotSizeSquareFeet?: number;
  YearBuilt?: number;
  PropertyType?: string;
  PropertySubType?: string;
  StandardStatus?: string;
  MlsStatus?: string;
  PublicRemarks?: string;
  ListOfficeName?: string;
  ListAgentFullName?: string;
  SubdivisionName?: string;
  GarageSpaces?: number;
  ModificationTimestamp?: string;
  Media?: TrestleMedia[];
};

export type ListingSearch = {
  q?: string; // City name or 5-digit ZIP
  minPrice?: number;
  maxPrice?: number;
  beds?: number; // minimum
  baths?: number; // minimum
  propertyType?: string;
  status?: string; // defaults to Active
  sort?: string; // newest | price_asc | price_desc | beds_desc
  page?: number; // 1-based
  pageSize?: number;
};

export const PAGE_SIZE = 24;

// Property types offered in the search UI. Values must match the RESO
// Data Dictionary PropertyType enumeration used by Trestle.
export const PROPERTY_TYPES = [
  "Residential",
  "Residential Lease",
  "Residential Income",
  "Land",
  "Commercial Sale",
  "Commercial Lease",
  "Farm",
] as const;

function esc(v: string): string {
  return v.replace(/'/g, "''");
}

// MLS City values are stored title-cased ("College Station"). We title-case
// the user's input and use contains() WITHOUT tolower(), because some RESO
// Web API feeds reject tolower() in $filter. This matches the common casing
// while staying within widely-supported OData string functions.
function titleCase(v: string): string {
  return v
    .toLowerCase()
    .replace(/\b([a-z])/g, (m) => m.toUpperCase());
}

function buildFilter(s: ListingSearch): string {
  const clauses: string[] = [];

  const status = s.status && s.status !== "Any" ? s.status : "Active";
  clauses.push(`StandardStatus eq '${esc(status)}'`);

  if (s.q && s.q.trim()) {
    const q = s.q.trim();
    if (/^\d{5}$/.test(q)) {
      clauses.push(`PostalCode eq '${esc(q)}'`);
    } else {
      clauses.push(`contains(City,'${esc(titleCase(q))}')`);
    }
  }
  if (s.minPrice && s.minPrice > 0) clauses.push(`ListPrice ge ${Math.floor(s.minPrice)}`);
  if (s.maxPrice && s.maxPrice > 0) clauses.push(`ListPrice le ${Math.floor(s.maxPrice)}`);
  if (s.beds && s.beds > 0) clauses.push(`BedroomsTotal ge ${Math.floor(s.beds)}`);
  if (s.baths && s.baths > 0) clauses.push(`BathroomsTotalInteger ge ${Math.floor(s.baths)}`);
  if (s.propertyType && s.propertyType !== "Any") {
    clauses.push(`PropertyType eq '${esc(s.propertyType)}'`);
  }

  return clauses.join(" and ");
}

function buildOrderBy(sort?: string): string {
  switch (sort) {
    case "price_asc":
      return "ListPrice asc";
    case "price_desc":
      return "ListPrice desc";
    case "beds_desc":
      return "BedroomsTotal desc";
    case "newest":
    default:
      return "ModificationTimestamp desc";
  }
}

export type SearchResult = {
  listings: TrestleListing[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export async function searchListings(s: ListingSearch): Promise<SearchResult> {
  const base = process.env.TRESTLE_API_BASE;
  if (!base) throw new Error("TRESTLE_API_BASE is not configured.");

  const token = await getToken();
  const pageSize = s.pageSize ?? PAGE_SIZE;
  const page = Math.max(1, s.page ?? 1);

  const params = new URLSearchParams({
    $filter: buildFilter(s),
    $orderby: buildOrderBy(s.sort),
    $top: String(pageSize),
    $skip: String((page - 1) * pageSize),
    $count: "true",
    $expand: "Media",
  });

  const res = await fetch(`${base}/Property?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Trestle listings request failed (${res.status}): ${body}`);
  }

  const json = (await res.json()) as { value: TrestleListing[]; "@odata.count"?: number };
  const total = json["@odata.count"] ?? json.value.length;

  return {
    listings: json.value,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function getListingByKey(key: string): Promise<TrestleListing | null> {
  const base = process.env.TRESTLE_API_BASE;
  if (!base) throw new Error("TRESTLE_API_BASE is not configured.");

  const token = await getToken();
  const url = `${base}/Property('${esc(key)}')?$expand=Media`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 300 },
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Trestle listing lookup failed (${res.status}): ${body}`);
  }

  return (await res.json()) as TrestleListing;
}

// Backwards-compatible helper (returns just the array of active listings).
export async function getListings(options?: { top?: number; filter?: string }): Promise<TrestleListing[]> {
  const result = await searchListings({ pageSize: options?.top ?? PAGE_SIZE });
  return result.listings;
}

// Returns photo URLs for a listing, ordered, photos first.
export function listingPhotos(l: TrestleListing): string[] {
  if (!l.Media || l.Media.length === 0) return [];
  const withUrl = l.Media.filter((m) => m.MediaURL);
  const photos = withUrl.filter((m) => !m.MediaCategory || /photo|image/i.test(m.MediaCategory || ""));
  const pool = photos.length ? photos : withUrl;
  return pool
    .slice()
    .sort((a, b) => (a.Order ?? 0) - (b.Order ?? 0))
    .map((m) => m.MediaURL as string);
}

export function primaryPhoto(l: TrestleListing): string | null {
  return listingPhotos(l)[0] ?? null;
}

export function formatPrice(price?: number, propertyType?: string): string {
  if (!price) return "Price on request";
  const isLease = /lease/i.test(propertyType ?? "") || price < 10000;
  return isLease ? `$${price.toLocaleString()}/mo` : `$${price.toLocaleString()}`;
}

export function listingAddress(l: TrestleListing): string {
  if (l.UnparsedAddress) return l.UnparsedAddress;
  const street = [l.StreetNumber, l.StreetName].filter(Boolean).join(" ");
  return street || "Address available on request";
}
