import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { updateLeadStatus } from "./actions";

export const dynamic = "force-dynamic";

export const metadata = { title: "Leads Inbox | iClickHomes Agent" };

type Lead = {
  id: string;
  created_at: string;
  name: string;
  email: string | null;
  phone: string | null;
  interest: string | null;
  message: string | null;
  source: string | null;
  property_ref: string | null;
  status: string;
};

const FILTERS: [string, string][] = [
  ["all", "All"],
  ["new", "New"],
  ["contacted", "Contacted"],
  ["closed", "Closed"],
];

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }) + " · " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export default async function LeadsInbox({
  searchParams,
}: {
  searchParams?: { status?: string };
}) {
  const status = searchParams?.status || "all";
  const supabase = createClient();

  let query = supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });
  if (status !== "all") query = query.eq("status", status);

  const { data: leads } = await query;
  const list = (leads || []) as Lead[];

  // Counts per status for the filter tabs.
  const { data: allRows } = await supabase.from("leads").select("status");
  const counts: Record<string, number> = { all: allRows?.length || 0, new: 0, contacted: 0, closed: 0 };
  (allRows || []).forEach((r: { status: string }) => {
    counts[r.status] = (counts[r.status] || 0) + 1;
  });

  return (
    <div className="container" style={{ padding: "40px 0 60px" }}>
      <div className="inbox-head">
        <div>
          <p className="eyebrow" style={{ marginBottom: 4 }}>Agent</p>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0 }}>Leads inbox</h1>
        </div>
        <Link className="btn ghost" href="/agent">← Agent tools</Link>
      </div>

      <div className="inbox-filters">
        {FILTERS.map(([key, label]) => (
          <Link
            key={key}
            href={key === "all" ? "/agent/leads" : `/agent/leads?status=${key}`}
            className={`inbox-tab${status === key ? " active" : ""}`}
          >
            {label}
            <span className="inbox-count">{counts[key] ?? 0}</span>
          </Link>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="inbox-empty">
          <div className="inbox-empty-mark" aria-hidden="true">✦</div>
          <h3>No {status === "all" ? "" : status} leads yet</h3>
          <p>
            New inquiries from the{" "}
            <Link href="/contact" style={{ color: "var(--blue)", fontWeight: 600 }}>contact form</Link>{" "}
            will appear here the moment they come in.
          </p>
        </div>
      ) : (
        <div className="inbox-list">
          {list.map((lead) => (
            <div key={lead.id} className={`lead-item status-${lead.status}`}>
              <div className="lead-item-top">
                <div>
                  <span className="lead-name">{lead.name}</span>
                  {lead.interest && <span className="lead-badge">{lead.interest}</span>}
                  <span className={`status-pill sp-${lead.status}`}>{lead.status.toUpperCase()}</span>
                </div>
                <span className="lead-date">{fmtDate(lead.created_at)}</span>
              </div>

              <div className="lead-contact">
                {lead.email && <a href={`mailto:${lead.email}`}>{lead.email}</a>}
                {lead.phone && <a href={`tel:${lead.phone.replace(/[^0-9+]/g, "")}`}>{lead.phone}</a>}
                {lead.source && <span className="lead-src">via {lead.source}{lead.property_ref ? ` · ${lead.property_ref}` : ""}</span>}
              </div>

              {lead.message && <p className="lead-msg">{lead.message}</p>}

              <div className="lead-item-actions">
                {(["new", "contacted", "closed"] as const).map((s) => (
                  <form key={s} action={updateLeadStatus}>
                    <input type="hidden" name="id" value={lead.id} />
                    <input type="hidden" name="status" value={s} />
                    <button
                      type="submit"
                      className={`status-btn${lead.status === s ? " current" : ""}`}
                      disabled={lead.status === s}
                    >
                      {s === "new" ? "Mark new" : s === "contacted" ? "Mark contacted" : "Close"}
                    </button>
                  </form>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
