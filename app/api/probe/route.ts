import { debugProbe } from "@/lib/trestle";

export const dynamic = "force-dynamic";

// TEMP diagnostic endpoint — returns a plain-text summary of how Sherry's
// listings are tagged in the feed. Remove after we've located them all.
export async function GET() {
  try {
    const data = await debugProbe();
    const body = JSON.stringify(data, null, 2)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;");
    return new Response(
      `<!doctype html><meta charset="utf-8"><title>probe</title><pre style="font:13px monospace;white-space:pre-wrap;padding:16px">${body}</pre>`,
      { headers: { "content-type": "text/html; charset=utf-8" } }
    );
  } catch (e) {
    return new Response(
      `<!doctype html><pre>probe error: ${e instanceof Error ? e.message : "unknown"}</pre>`,
      { status: 500, headers: { "content-type": "text/html; charset=utf-8" } }
    );
  }
}
