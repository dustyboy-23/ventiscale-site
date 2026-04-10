import { Eyebrow } from "@/components/marketing/eyebrow";

export const metadata = {
  title: "Data Deletion | Venti Scale",
  description: "How to request deletion of your data from Venti Scale systems.",
};

export default function DataDeletionPage() {
  return (
    <article className="max-w-[720px] mx-auto px-6 lg:px-10 py-20 lg:py-28">
      <Eyebrow>LEGAL / DATA DELETION</Eyebrow>
      <h1 className="font-display text-[40px] lg:text-[52px] leading-[1.05] tracking-[-0.02em] text-white mt-4 mb-3">
        Data Deletion
      </h1>
      <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-white/45 mb-12">
        Last updated: 2026-04-10
      </p>

      <div className="prose-legal">
        <h2>How to delete your data</h2>
        <p>
          If you want your data removed from Venti Scale systems, email{" "}
          <a href="mailto:hello@ventiscale.com">hello@ventiscale.com</a> with the
          subject line &quot;Data deletion request&quot; and include:
        </p>
        <ul>
          <li>Your name</li>
          <li>
            The email address associated with your account or contact form
            submission
          </li>
          <li>A short note confirming you want your data deleted</li>
        </ul>

        <h2>What happens next</h2>
        <p>
          We will confirm receipt of your request within 24 hours. Within 30 days,
          we will:
        </p>
        <ul>
          <li>Delete your contact form submissions from our database</li>
          <li>
            Delete any client portal account and associated files (if applicable)
          </li>
          <li>Remove your information from our email and communication systems</li>
          <li>Confirm completion by email</li>
        </ul>

        <h2>Exceptions</h2>
        <p>
          We may retain certain information if required by law (for example,
          invoice records for tax purposes). Any retained information is kept in
          read-only archive storage and is not used for any other purpose.
        </p>

        <h2>Questions</h2>
        <p>
          Email <a href="mailto:hello@ventiscale.com">hello@ventiscale.com</a>.
        </p>
      </div>
    </article>
  );
}
