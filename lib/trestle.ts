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
// getListings/getToken.

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
    // Token calls should never be cached by Next's fetch cache.
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

export type TrestleListing = {
  ListingKey: string;
  UnparsedAddress?: string;
  City?: string;
  StateOrProvince?: string;
  PostalCode?: string;
  ListPrice?: number;
  BedroomsTotal?: number;
  BathroomsTotalInteger?: number;
  LivingArea?: number;
  StandardStatus?: string;
  PublicRemarks?: string;
  Media?: { MediaURL: string }[];
};

// Pulls active listings. `filter` is a raw OData $filter string — keep it
// simple to start (e.g. county/MLS scoping) and expand once real data is
// flowing. See RESO Data Dictionary for the Property resource's field names.
export async function getListings(options?: { top?: number; filter?: string }): Promise<TrestleListing[]> {
  const base = process.env.TRESTLE_API_BASE;
  if (!base) {
    throw new Error("TRESTLE_API_BASE is not configured.");
  }

  const token = await getToken();
  const params = new URLSearchParams({
    $top: String(options?.top ?? 24),
    $filter: options?.filter ?? "StandardStatus eq 'Active'",
    $expand: "Media",
  });

  const res = await fetch(`${base}/Property?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
    // Listings change often but not every second — 5 min cache is a
    // reasonable start; tune once this is live.
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Trestle listings request failed (${res.status}): ${body}`);
  }

  const json = (await res.json()) as { value: TrestleListing[] };
  return json.value;
}
