import {
  Mail,
  Users,
  TrendingUp,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardHeader } from "@/components/card";
import { getCampaigns, type Campaign } from "@/lib/sg-data";
import { formatCurrency, formatNumber, cn } from "@/lib/utils";

const TYPE_LABEL: Record<string, string> = {
  automation: "Automation",
  newsletter: "Newsletter",
  broadcast: "Broadcast",
};

const STATUS_STYLE: Record<string, string> = {
  ready_for_approval: "bg-amber-50 text-amber-700",
  draft: "bg-slate-100 text-slate-600",
  live: "bg-emerald-50 text-emerald-700",
  scheduled: "bg-blue-50 text-blue-700",
  sent: "bg-slate-100 text-slate-600",
};

const STATUS_LABEL: Record<string, string> = {
  ready_for_approval: "Awaiting approval",
  draft: "Draft",
  live: "Live",
  scheduled: "Scheduled",
  sent: "Sent",
};

function CampaignCard({ campaign }: { campaign: Campaign }) {
  const totalProjected = campaign.projectedImpact.revenue;

  return (
    <Card padding="none" className="overflow-hidden hover:border-[var(--color-border-strong)] transition-colors">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-[var(--color-surface-muted)] text-[var(--color-ink-muted)] px-2 py-1 rounded">
                {TYPE_LABEL[campaign.type]}
              </span>
              <span
                className={cn(
                  "text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded",
                  STATUS_STYLE[campaign.status],
                )}
              >
                {STATUS_LABEL[campaign.status]}
              </span>
            </div>
            <h3 className="text-[17px] font-semibold text-[var(--color-ink)] tracking-tight leading-tight">
              {campaign.name}
            </h3>
          </div>
          <div className="shrink-0 text-right">
            <div className="text-[11px] text-[var(--color-ink-subtle)] uppercase tracking-wider font-medium">
              Projected
            </div>
            <div className="text-[20px] font-bold tabular text-[var(--color-accent)] leading-none mt-1">
              {formatCurrency(totalProjected)}
            </div>
            <div className="text-[10px] text-[var(--color-ink-subtle)] mt-0.5">
              {campaign.projectedImpact.label}
            </div>
          </div>
        </div>

        <p className="text-[13px] text-[var(--color-ink-muted)] leading-relaxed mb-5">
          {campaign.rationale}
        </p>

        <div className="flex items-center gap-4 text-[12px] text-[var(--color-ink-subtle)] mb-5">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" strokeWidth={2} />
            <span className="tabular">{formatNumber(campaign.audienceSize)}</span>
            <span>· {campaign.audience}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5" strokeWidth={2} />
            <span>{campaign.sequence.length} {campaign.sequence.length === 1 ? "email" : "emails"}</span>
          </div>
        </div>
      </div>

      {/* Sequence preview */}
      <div className="bg-[var(--color-surface-muted)] border-t border-[var(--color-border)] px-6 py-5">
        <div className="text-[11px] font-medium text-[var(--color-ink-subtle)] uppercase tracking-wider mb-3">
          Sequence
        </div>
        <ol className="space-y-2.5">
          {campaign.sequence.map((step) => (
            <li key={step.step} className="flex gap-3">
              <div className="shrink-0 w-5 h-5 rounded-full bg-white border border-[var(--color-border-strong)] flex items-center justify-center text-[10px] font-bold text-[var(--color-ink)] tabular mt-0.5">
                {step.step}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-medium text-[var(--color-ink)] leading-snug">
                  {step.subject}
                </div>
                <div className="text-[11px] text-[var(--color-ink-subtle)] mt-0.5 flex items-center gap-1.5">
                  <Clock className="w-3 h-3" strokeWidth={2} />
                  {step.delay}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Action footer */}
      {campaign.status === "ready_for_approval" && (
        <div className="px-6 py-4 border-t border-[var(--color-border)] flex items-center justify-between bg-white">
          <span className="text-[12px] text-[var(--color-ink-muted)]">
            Drafted by Jarvis · Ready when you are
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled
              title="Disabled in demo mode"
              className="text-[12px] font-medium text-[var(--color-ink-subtle)] px-3 py-1.5 cursor-not-allowed"
            >
              Edit
            </button>
            <button
              type="button"
              disabled
              title="Disabled in demo mode"
              className="text-[12px] font-semibold text-white bg-[var(--color-ink)]/50 px-3.5 py-1.5 rounded-lg inline-flex items-center gap-1.5 cursor-not-allowed"
            >
              Approve & launch
              <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}

export default async function CampaignsPage() {
  const data = await getCampaigns();
  const totalProjected = data.proposed.reduce((sum, c) => sum + c.projectedImpact.revenue, 0);
  const awaitingCount = data.proposed.filter((c) => c.status === "ready_for_approval").length;

  return (
    <>
      <PageHeader
        eyebrow="Email"
        title="Email Campaigns"
        description="Automated sequences and broadcasts that turn subscribers into repeat customers."
      />

      {/* Summary row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card padding="md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-medium text-[var(--color-ink-subtle)] uppercase tracking-wider">
              Subscribers
            </span>
            <Users className="w-4 h-4 text-[var(--color-ink-subtle)]" strokeWidth={2} />
          </div>
          <div className="text-[28px] font-bold tabular text-[var(--color-ink)] leading-none">
            {formatNumber(data.stats.totalSubscribers)}
          </div>
          <div className="text-[12px] text-emerald-700 font-medium mt-2">
            +{data.stats.monthlyGrowth}% this month
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-medium text-[var(--color-ink-subtle)] uppercase tracking-wider">
              Awaiting approval
            </span>
            <Sparkles className="w-4 h-4 text-amber-600" strokeWidth={2} />
          </div>
          <div className="text-[28px] font-bold tabular text-[var(--color-ink)] leading-none">
            {awaitingCount}
          </div>
          <div className="text-[12px] text-[var(--color-ink-subtle)] font-medium mt-2">
            {awaitingCount === 1 ? "campaign drafted by Jarvis" : "campaigns drafted by Jarvis"}
          </div>
        </Card>

        <Card padding="md" className="bg-[var(--color-ink)] border-[var(--color-ink)] text-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-medium text-white/60 uppercase tracking-wider">
              Projected impact
            </span>
            <TrendingUp className="w-4 h-4 text-white/60" strokeWidth={2} />
          </div>
          <div className="text-[28px] font-bold tabular leading-none">
            +{formatCurrency(totalProjected)}
          </div>
          <div className="text-[12px] text-white/60 font-medium mt-2">added per month if approved</div>
        </Card>
      </div>

      {/* Proposed campaigns */}
      {data.proposed.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-[18px] font-bold text-[var(--color-ink)] tracking-tight">
                Drafted by Jarvis
              </h2>
              <p className="text-[13px] text-[var(--color-ink-muted)] mt-0.5">
                Campaigns ready for your review
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {data.proposed.map((c) => (
              <CampaignCard key={c.id} campaign={c} />
            ))}
          </div>
        </section>
      )}

      {/* Live campaigns */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-[18px] font-bold text-[var(--color-ink)] tracking-tight">
              Live campaigns
            </h2>
            <p className="text-[13px] text-[var(--color-ink-muted)] mt-0.5">
              Currently sending or scheduled
            </p>
          </div>
        </div>
        {data.live.length === 0 ? (
          <Card padding="lg">
            <div className="text-center py-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--color-surface-muted)] flex items-center justify-center">
                <Mail className="w-5 h-5 text-[var(--color-ink-subtle)]" strokeWidth={2} />
              </div>
              <h3 className="text-[15px] font-semibold text-[var(--color-ink)]">
                No live campaigns yet
              </h3>
              <p className="text-[13px] text-[var(--color-ink-muted)] mt-1 max-w-sm mx-auto">
                Approve a draft above to launch your first campaign and start recovering revenue.
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {data.live.map((c) => (
              <CampaignCard key={c.id} campaign={c} />
            ))}
          </div>
        )}
      </section>

      {/* History */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-[18px] font-bold text-[var(--color-ink)] tracking-tight">
              Campaign history
            </h2>
            <p className="text-[13px] text-[var(--color-ink-muted)] mt-0.5">
              Previously sent campaigns and their results
            </p>
          </div>
        </div>
        <Card padding="lg">
          <div className="text-center py-6">
            <CheckCircle2
              className="w-8 h-8 text-[var(--color-ink-subtle)] mx-auto mb-3"
              strokeWidth={1.5}
            />
            <p className="text-[13px] text-[var(--color-ink-muted)]">
              Sent campaign history will appear here once you launch your first one.
            </p>
          </div>
        </Card>
      </section>
    </>
  );
}
