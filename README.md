# iclickhomes.com

Next.js 14 (App Router) site replacing the sherryperry.com template redirect.
Hosted off Replit — no Replit branding. Backend is the existing "iClickHomes"
Supabase project (already provisioned with a real schema: brands, app_users,
properties, contacts, expenses, work_orders, etc.).

## Run it locally
```
npm install
cp .env.local.example .env.local   # already has real Supabase URL + anon key
npm run dev
```

## What's built
- Public site: home, `/listings` (Trestle IDX placeholder), `/about`, `/contact`, and a `/agent-login` link out to reo.properties.
- **Agent Login** (`/agent-login`, `/agent`): Supabase Auth email/password. New signups create an `app_users` row with `role = 'agent'`, `is_approved = false`. `middleware.ts` blocks `/agent/*` for anyone not logged in AND approved.
- Agent launcher (`/agent`): cards linking out to the tool suite, config lives in `lib/agent-tools.ts`.

## Approving an agent
New agent accounts start unapproved. To approve one, run in the Supabase SQL editor (project `iClickHomes`, id `lxozitwdasbsnbsgcltk`):
```sql
update app_users set is_approved = true where email = 'someone@example.com';
```
To make yourself the first approved agent, sign up at `/agent-login` once the site is running, then run the query above with your own email.

## Tool launcher links — needs your input
`lib/agent-tools.ts` has each tool's status. I could only get real deployment URLs for two of the eight, and one of those doesn't match the app name I expected — please confirm before trusting it:
- **Asset Valuation Board** → reported as `https://assetpricingbot.ai` (unverified — different name than the Repl title, confirm this is right)
- **Receiptfiler** → reported as `https://expense-reimbursement-tracker.replit.app` (unverified — note `receiptfiler.com` already exists separately as a live domain/app on your machine; confirm whether that's the same product or a different one)
- **toprealtytools** → not deployed yet per the Replit agent
- **agentiqhub, OurWorkHub, RepairsEstimator, Property Expense Tracker** → deployment URL unknown; the Replit agent couldn't report it. Check each app's Deployments tab in Replit and send me the URLs, or I can keep digging.
- **Combined Property Inspector** → doesn't exist yet; this is the House Inspector + Property AI Inspector merge, not started.

## Trestle IDX
Not wired up. When ready, add `TRESTLE_CLIENT_ID` / `TRESTLE_CLIENT_SECRET` (or whatever Trestle issues) to `.env.local` and to your hosting provider's environment variables — never commit them. Tell me when you have them and I'll build the `/listings` search against them.

## Deploying
Not deployed anywhere yet. Two ways to do that:
1. **Vercel** (recommended for Next.js) — connect a GitHub repo, import into Vercel, add the Supabase env vars from `.env.local`, then point iclickhomes.com's DNS at Vercel.
2. I can also use a Netlify or Vercel connector from this workspace if you want me to drive more of that setup directly — say the word and I'll connect it.

## Build check
`npm run build` passed a full production build during development (one real bug was caught and fixed: a missing Suspense boundary around `/agent-login`'s search-params usage). Re-run `npm run build` once more before deploying as a final check — my sandbox hit resource limits confirming the rebuild after the fix, so treat that as unverified until you or I re-run it clean.
