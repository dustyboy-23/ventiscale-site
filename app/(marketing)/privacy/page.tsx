import { Eyebrow } from "@/components/marketing/eyebrow";

export const metadata = {
  title: "Privacy Policy | Venti Scale",
  description: "How Venti Scale collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <article className="max-w-[720px] mx-auto px-6 lg:px-10 py-20 lg:py-28">
      <Eyebrow>LEGAL / PRIVACY</Eyebrow>
      <h1 className="font-display text-[40px] lg:text-[52px] leading-[1.05] tracking-[-0.02em] text-white mt-4 mb-3">
        Privacy Policy
      </h1>
      <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-white/45 mb-12">
        Last updated: 2026-04-29
      </p>

      <div className="prose-legal">
        <h2>1. Who we are</h2>
        <p>
          Venti Scale LLC (&quot;Venti Scale&quot;, &quot;we&quot;, &quot;us&quot;, &quot;I&quot;) is a Wyoming
          limited liability company operated by Dustin Gilmour. Contact:{" "}
          <a href="mailto:hello@ventiscale.com">hello@ventiscale.com</a>.
        </p>

        <h2>2. What we collect</h2>
        <p>When you submit the audit form on this website, we collect:</p>
        <ul>
          <li>Your name</li>
          <li>Your business name and type</li>
          <li>Your website URL</li>
          <li>Your email address</li>
          <li>Any notes or context you choose to share in the optional notes field</li>
        </ul>
        <p>
          We also fetch and analyze the public HTML of the website you submit, in order
          to produce the audit report you requested.
        </p>
        <p>When you use the Venti Scale client portal, we collect:</p>
        <ul>
          <li>Your email address (for authentication via Supabase Auth)</li>
          <li>Any files, reports, and brand assets you or we upload to your workspace</li>
        </ul>
        <p>
          We also collect standard server logs (IP address, user agent, timestamps) for
          security and operational purposes.
        </p>

        <h2>3. How we use it</h2>
        <ul>
          <li>To run the audit you requested and email you the resulting report and growth plan</li>
          <li>To follow up with you about that audit and the services we offer in connection with it</li>
          <li>To provide the services you have contracted us for</li>
          <li>To maintain your client portal and the assets inside it</li>
          <li>To communicate with you about your account and your work</li>
        </ul>
        <p>
          We do not sell your information. We do not rent it. We do not share it with
          third parties for their own marketing purposes. We share it only with the
          service providers we use to operate (see Section 4).
        </p>

        <h2>4. Commercial communications and your right to opt out</h2>
        <p>
          When you submit the audit form, you are expressly requesting that we send you
          the audit report and growth plan you asked for. The email we send in response
          contains both the audit findings and information about the services we
          provide. We treat this as a commercial electronic message under Canada&apos;s
          Anti-Spam Legislation (CASL) and the United States CAN-SPAM Act.
        </p>
        <p>You can opt out of any further commercial communications from us at any time:</p>
        <ul>
          <li>Reply to any of our emails with the word <strong>STOP</strong>, or</li>
          <li>Email <a href="mailto:hello@ventiscale.com">hello@ventiscale.com</a> and ask to be removed.</li>
        </ul>
        <p>
          We process opt-out requests within 10 business days. Once you opt out, we will
          not send you further commercial messages. Transactional or service-related
          messages required to operate your client account (if you become a client) may
          still be sent.
        </p>

        <h2>5. Third parties</h2>
        <p>Venti Scale uses the following services to run the website and portal:</p>
        <ul>
          <li>
            <strong>Vercel</strong>: website and application hosting
          </li>
          <li>
            <strong>Supabase</strong>: database, authentication, file storage
          </li>
          <li>
            <strong>Google Workspace</strong>: email (hello@ventiscale.com) and
            Google Drive for file delivery
          </li>
          <li>
            <strong>Meta, Google, and TikTok advertising platforms</strong>:
            where we run ads on your behalf, under accounts you own
          </li>
        </ul>
        <p>
          Each of these providers has their own privacy practices. Their use of your
          data is governed by their own policies.
        </p>

        <h2>6. Cookies</h2>
        <p>
          The Venti Scale website and portal use session cookies to keep you logged in
          and to remember demo mode state. We do not use third-party tracking cookies.
        </p>

        <h2>7. Your rights</h2>
        <p>You can:</p>
        <ul>
          <li>Request a copy of the data we hold about you</li>
          <li>Request correction of inaccurate data</li>
          <li>
            Request deletion of your data (see{" "}
            <a href="/data-deletion">/data-deletion</a> for instructions)
          </li>
          <li>Opt out of commercial communications (see Section 4)</li>
          <li>
            Withdraw consent at any time by emailing{" "}
            <a href="mailto:hello@ventiscale.com">hello@ventiscale.com</a>
          </li>
        </ul>

        <h2>8. Data retention</h2>
        <p>
          We keep client data for as long as you are an active client plus 90 days
          after cancellation. Audit submissions are kept for 12 months. After those
          periods, data is permanently deleted from our active systems.
        </p>

        <h2>9. Contact and mailing address</h2>
        <p>
          Questions about this policy, or any privacy or compliance matter? Email{" "}
          <a href="mailto:hello@ventiscale.com">hello@ventiscale.com</a>.
        </p>
        <p>
          Venti Scale LLC<br />
          {process.env.NEXT_PUBLIC_VS_BUSINESS_ADDRESS || "Mailing address available on request — email hello@ventiscale.com"}
        </p>
      </div>
    </article>
  );
}
