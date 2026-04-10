import { Eyebrow } from "@/components/marketing/eyebrow";

export const metadata = {
  title: "Terms of Service | Venti Scale",
  description: "Terms governing use of the Venti Scale website and client portal.",
};

export default function TermsPage() {
  return (
    <article className="max-w-[720px] mx-auto px-6 lg:px-10 py-20 lg:py-28">
      <Eyebrow>LEGAL / TERMS</Eyebrow>
      <h1 className="font-display text-[40px] lg:text-[52px] leading-[1.05] tracking-[-0.02em] text-white mt-4 mb-3">
        Terms of Service
      </h1>
      <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-white/45 mb-12">
        Last updated: 2026-04-10
      </p>

      <div className="prose-legal">
        <h2>1. Who these terms apply to</h2>
        <p>
          These terms govern your use of the Venti Scale website (ventiscale.com)
          and client portal. If you are a paying client, additional terms in your
          service agreement also apply.
        </p>

        <h2>2. What Venti Scale is</h2>
        <p>
          Venti Scale is a marketing service operated by Dustin Gilmour. We provide
          content production, social media management, SEO, paid advertising
          management, and related services to small and local businesses. The
          service is delivered by one senior operator (Dustin) using a combination
          of direct work and AI tools.
        </p>

        <h2>3. Your responsibilities</h2>
        <p>If you are a client:</p>
        <ul>
          <li>
            You grant us access to the marketing accounts, assets, and brand
            materials we need to do the work
          </li>
          <li>
            You are responsible for the content of your own business, the accuracy
            of any claims you ask us to make on your behalf, and compliance with
            any laws that apply to your industry
          </li>
          <li>You agree to pay your invoices on time</li>
        </ul>

        <h2>4. What we do not do</h2>
        <ul>
          <li>
            We do not guarantee specific revenue, lead, or ranking outcomes.
            Marketing works over time, and no honest service can promise a number.
          </li>
          <li>
            We do not engage in black-hat SEO, fake reviews, or any tactic that
            violates the terms of the platforms we publish on.
          </li>
          <li>
            We do not work with clients in industries we are not a good fit for
            (we will tell you upfront if that applies to you).
          </li>
        </ul>

        <h2>5. Cancellation</h2>
        <p>
          You can cancel any time. There are no long-term contracts unless you
          explicitly opt into our founding client program, which has a 12-month
          lock in exchange for a discounted rate.
        </p>

        <h2>6. Intellectual property</h2>
        <p>
          Any original content, assets, or systems we create for you as part of
          your engagement belong to you. The Venti Scale name, logo, portal, and
          underlying systems belong to us.
        </p>

        <h2>7. Liability</h2>
        <p>
          Venti Scale is not liable for indirect, incidental, or consequential
          damages arising from your use of the service. Our total liability in any
          month is capped at the amount you paid us in that month.
        </p>

        <h2>8. Changes to these terms</h2>
        <p>
          We may update these terms from time to time. Significant changes will be
          communicated by email to active clients at least 14 days before taking
          effect.
        </p>

        <h2>9. Contact</h2>
        <p>
          Questions?{" "}
          <a href="mailto:hello@ventiscale.com">hello@ventiscale.com</a>.
        </p>
      </div>
    </article>
  );
}
