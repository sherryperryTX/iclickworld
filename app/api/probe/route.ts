import { debugProbe } from "@/lib/trestle";

export const dynamic = "force-dynamic";

// TEMP diagnostic endpoint — returns a plain-text summary of how Sherry's
// listings are tagged in the feed. Remove after we've located them all.
export async function GET() {
  try {
    const data = await debugProbe();
    return new Response(JSON.stringify(data, null, 2), {
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  } catch (e) {
    return new Response(
      "probe error: " + (e instanceof Error ? e.message : "unknown"),
      { status: 500, headers: { "content-type": "text/plain; charset=utf-8" } }
    );
  }
}
