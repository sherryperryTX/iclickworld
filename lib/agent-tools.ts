// Config for the Agent Login launcher. Edit `url` values as apps get real
// domains — nothing else in the app needs to change.
//
// Status key:
//   "live"    — confirmed working URL
//   "unverified" — a URL was reported by the Replit agent but wasn't
//                  independently checked; confirm before trusting it
//   "pending" — no live URL yet (not deployed, or deployment URL unknown)
export type AgentTool = {
  name: string;
  description: string;
  url: string | null;
  status: "live" | "unverified" | "pending";
};

export const agentTools: AgentTool[] = [
  {
    name: "Combined Property Inspector",
    description:
      "AI-vision property inspection (merge of House Inspector + Property AI Inspector) with specialist electrician/plumber/HVAC/engineer/floorplan subagents. Merge work not started yet.",
    url: null,
    status: "pending",
  },
  {
    name: "agentiqhub",
    description: "Realtor training/courses. Already migrated off Replit onto Vercel.",
    url: "https://agentiqhub.vercel.app",
    status: "live",
  },
  {
    name: "RepairsEstimator",
    description: "Repair cost estimating.",
    url: null,
    status: "pending",
  },
  {
    name: "Receiptfiler",
    description: "Receipt capture, expense tracking, reimbursements.",
    url: "https://expense-reimbursement-tracker.replit.app",
    status: "unverified",
  },
  {
    name: "OurWorkHub",
    description: "Work/task hub. Already migrated off Replit onto Vercel.",
    url: "https://ourworkhub.vercel.app",
    status: "live",
  },
  {
    name: "toprealtytools",
    description: "Real estate tools. Already migrated off Replit — live on its own domain.",
    url: "https://toprealtytools.com",
    status: "live",
  },
  {
    name: "Property Expense Tracker",
    description: "Per-property expense tracking.",
    url: null,
    status: "pending",
  },
  {
    name: "Asset Valuation Board",
    description: "Asset valuation dashboard.",
    url: "https://assetpricingbot.ai",
    status: "unverified",
  },
];
