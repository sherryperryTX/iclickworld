"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitLead, type LeadState } from "./actions";

const INITIAL: LeadState = { ok: false };

const INTERESTS = [
  "Buy a home",
  "Sell my home",
  "Home valuation",
  "Land & acreage",
  "Commercial",
  "REO / bank-owned",
  "General question",
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className="btn orange lg" type="submit" disabled={pending}>
      {pending ? "Sending…" : "Send message"}
    </button>
  );
}

export default function ContactForm({
  source = "contact",
  propertyRef,
  defaultInterest,
}: {
  source?: string;
  propertyRef?: string;
  defaultInterest?: string;
}) {
  const [state, formAction] = useFormState(submitLead, INITIAL);

  if (state.ok) {
    return (
      <div className="lead-ok" role="status">
        <div className="lead-ok-mark" aria-hidden="true">✓</div>
        <h3>Thank you — your message is on its way.</h3>
        <p>
          Sherry personally reviews every inquiry and will get back to you shortly.
          Need something sooner? Call or text and mention you reached out through
          iClickHomes.com.
        </p>
      </div>
    );
  }

  const preset =
    defaultInterest && INTERESTS.includes(defaultInterest)
      ? defaultInterest
      : "";

  return (
    <form action={formAction} className="lead-form" noValidate>
      <input type="hidden" name="source" value={source} />
      {propertyRef && <input type="hidden" name="property_ref" value={propertyRef} />}

      {/* Honeypot — visually hidden, off-screen; real users never fill it. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="field">
        <label htmlFor="lf-name">Name</label>
        <input id="lf-name" name="name" type="text" required placeholder="Your full name" autoComplete="name" />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="lf-email">Email</label>
          <input id="lf-email" name="email" type="email" placeholder="you@email.com" autoComplete="email" />
        </div>
        <div className="field">
          <label htmlFor="lf-phone">Phone</label>
          <input id="lf-phone" name="phone" type="tel" placeholder="(979) 555-0123" autoComplete="tel" />
        </div>
      </div>

      <div className="field">
        <label htmlFor="lf-interest">I&apos;m interested in</label>
        <select id="lf-interest" name="interest" defaultValue={preset}>
          <option value="">Select one…</option>
          {INTERESTS.map((i) => (
            <option key={i} value={i}>{i}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="lf-message">How can Sherry help?</label>
        <textarea id="lf-message" name="message" rows={5} placeholder="Tell Sherry a bit about what you're looking for, your timeline, or any questions." />
      </div>

      {state.error && <p className="lead-err" role="alert">{state.error}</p>}

      <div className="lead-actions">
        <SubmitButton />
        <span className="lead-note">Or email <a href="mailto:sherry@iclickhomes.com">sherry@iclickhomes.com</a></span>
      </div>
    </form>
  );
}
