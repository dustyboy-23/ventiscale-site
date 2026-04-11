import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Receipt,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  AlertTriangle,
  Target,
  FileText,
  PenLine,
  Mail,
  Activity,
  Zap,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardHeader } from "@/components/card";
import { KpiCard } from "@/components/kpi-card";
import {
  getClientKpis,
  getReports,
  getContentDrafts,
  getActivityFeed,
  getClientMeta,
  getMetricsSnapshotAt,
  type ActivityItem,
} from "@/lib/portal-data";
import { resolvePeriod } from "@/lib/sg-data";
import { formatCurrency, formatNumber, relativeTime, cn } from "@/lib/utils";

const ACTIVITY_META: Record<
  ActivityItem["type"],
  { icon: typeof FileText; bg: string; fg: string }
> = {
  report: { icon: FileText, bg: "bg-blue-50", fg: "text-blue-600" },
  draft: { icon: PenLine, bg: "bg-violet-50", fg: "text-violet-600" },
  campaign: { icon: Mail, bg: "bg-amber-50", fg: "text-amber-600" },
  post: { icon: Zap, bg: "bg-emerald-50", fg: "text-emerald-600" },
  system: { icon: Activity, bg: "bg-slate-100", fg: "text-slate-600" },
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ period?: string }>;
}) {
  const params = (await searchParams) || {};
  const period = resolvePeriod(params.period);
  const [kpis, reports, drafts, activity, client, snapshotAt] = await Promise.all([
    getClientKpis(period),
    getReports(),
    getContentDrafts(),
    getActivityFeed(6),
    getClientMeta(),
    getMetricsSnapshotAt(period),
  ]);

  const latestClient = reports.find((r) => r.type === "client");
  const upcomingDrafts = drafts.slice(0, 4);
  const hasRevenueData = kpis.revenue > 0 || kpis.orders > 0;
  const hasTrafficData = kpis.channels.length > 0 || kpis.devices.length > 0;
  const hasSeoData =
    kpis.seo.clicks > 0 || kpis.seo.impressions > 0 || kpis.topQueries.length > 0;

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();

  const freshness = snapshotAt ? `Updated ${relativeTime(snapshotAt)}` : null;

  return (
    <>
      <PageHeader
        eyebrow={client.tagline}
        title={`${greeting}, ${client.ownerName}`}
        description={
          hasRevenueData
            ? `Here's how ${client.name} is performing over the ${kpis.periodLabel.toLowerCase()}.${freshness ? ` ${freshness}.` : ""}`
            : `Welcome to ${client.name}. Your data feeds are connecting. Metrics will populate here as soon as they're live.`
        }
        actions={
          latestClient && (
            <Link
              href={`/reports/${latestClient.id}`}
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--color-ink)] bg-white border border-[var(--color-border-strong)] hover:border-[var(--color-ink)] px-3.5 py-2 rounded-lg transition-colors"
            >
              View latest report
              <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.5} />
            </Link>
          )
        }
      />

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-in">
        <KpiCard
          label="Revenue"
          value={kpis.revenue}
          format="currency"
          icon={DollarSign}
          highlight
          hint={kpis.periodLabel}
        />
        <KpiCard
          label="Orders"
          value={kpis.orders}
          icon={ShoppingBag}
          hint={`${formatNumber(kpis.customers)} customers`}
        />
        <KpiCard
          label="AOV"
          value={kpis.aov}
          format="currency"
          icon={Receipt}
          hint={`${kpis.repeatRate.toFixed(1)}% repeat`}
        />
        <KpiCard
          label="Conversion"
          value={kpis.traffic.conversionRate}
          format="percent"
          icon={TrendingUp}
          hint={`${formatNumber(kpis.traffic.sessions)} sessions`}
        />
      </div>

      {/* Two-column body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — main content */}
        <div className="lg:col-span-2 space-y-6">
          {!hasRevenueData && (
            <Card padding="lg">
              <div className="py-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--color-accent-soft)] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-[var(--color-accent)]" strokeWidth={2.25} />
                  </div>
                  <h3 className="text-[15px] font-semibold text-[var(--color-ink)]">
                    Your dashboard is ready
                  </h3>
                </div>
                <p className="text-[14px] text-[var(--color-ink-muted)] leading-relaxed max-w-[540px]">
                  Once your ad accounts, analytics, and storefront are connected, this
                  page will show live revenue, traffic, product performance, and the
                  insights Jarvis spots for you, updated every morning.
                </p>
                <ul className="mt-5 space-y-2 text-[13px] text-[var(--color-ink-muted)]">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-ink-subtle)]" />
                    Meta Ads · Google Ads · Google Analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-ink-subtle)]" />
                    Search Console · Shopify / WooCommerce
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-ink-subtle)]" />
                    Weekly reports · proactive campaign drafts
                  </li>
                </ul>
              </div>
            </Card>
          )}

          {/* Product Performance */}
          {hasRevenueData && kpis.productBreakdown.length > 0 && (
          <Card>
            <CardHeader
              title="Product Performance"
              description={`Top sellers · ${kpis.periodLabel}`}
            />
            <div className="space-y-2">
              {kpis.productBreakdown.map((p, i) => {
                const max = Math.max(...kpis.productBreakdown.map((x) => x.revenue));
                const pct = (p.revenue / max) * 100;
                return (
                  <div key={p.name} className="group">
                    <div className="flex items-baseline justify-between mb-1.5">
                      <div className="flex items-center gap-2.5">
                        <span className="text-[11px] tabular text-[var(--color-ink-subtle)] font-medium w-4">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-[14px] font-medium text-[var(--color-ink)]">
                          {p.name}
                        </span>
                        <span className="text-[12px] text-[var(--color-ink-subtle)]">
                          · {p.orders} orders
                        </span>
                      </div>
                      <span className="text-[14px] tabular font-semibold text-[var(--color-ink)]">
                        {formatCurrency(p.revenue)}
                      </span>
                    </div>
                    <div className="h-1.5 bg-[var(--color-surface-muted)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--color-accent)] rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
          )}

          {/* Traffic Sources */}
          {hasTrafficData && kpis.channels.length > 0 && (
          <Card>
            <CardHeader
              title="Traffic Sources"
              description="Where your customers are coming from"
            />
            <div className="overflow-x-auto -mx-2">
              <table className="w-full">
                <thead>
                  <tr className="text-[11px] font-medium text-[var(--color-ink-subtle)] uppercase tracking-wider">
                    <th className="text-left px-2 pb-3">Channel</th>
                    <th className="text-right px-2 pb-3">Sessions</th>
                    <th className="text-right px-2 pb-3">Orders</th>
                    <th className="text-right px-2 pb-3">Revenue</th>
                    <th className="text-right px-2 pb-3">Conv</th>
                  </tr>
                </thead>
                <tbody>
                  {kpis.channels.map((c) => (
                    <tr
                      key={c.name}
                      className="border-t border-[var(--color-border)] text-[14px]"
                    >
                      <td className="px-2 py-3 text-[var(--color-ink)] font-medium">{c.name}</td>
                      <td className="px-2 py-3 text-right tabular text-[var(--color-ink-muted)]">
                        {formatNumber(c.sessions)}
                      </td>
                      <td className="px-2 py-3 text-right tabular text-[var(--color-ink-muted)]">
                        {c.purchases}
                      </td>
                      <td className="px-2 py-3 text-right tabular text-[var(--color-ink)] font-semibold">
                        {formatCurrency(c.revenue)}
                      </td>
                      <td className="px-2 py-3 text-right tabular text-[var(--color-ink-muted)]">
                        {c.convRate.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          )}

          {/* Devices + Top pages */}
          {hasTrafficData && (kpis.devices.length > 0 || kpis.topPages.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card padding="md">
              <CardHeader title="Devices" description={kpis.periodLabel} />
              <div className="space-y-3">
                {kpis.devices.map((d) => {
                  const max = Math.max(...kpis.devices.map((x) => x.revenue));
                  const pct = (d.revenue / max) * 100;
                  return (
                    <div key={d.name}>
                      <div className="flex items-baseline justify-between mb-1">
                        <span className="text-[13px] font-medium text-[var(--color-ink)]">
                          {d.name}
                        </span>
                        <span className="text-[12px] tabular text-[var(--color-ink-muted)]">
                          {formatCurrency(d.revenue)}{" "}
                          <span className="text-[var(--color-ink-subtle)]">
                            · {d.convRate.toFixed(2)}%
                          </span>
                        </span>
                      </div>
                      <div className="h-1 bg-[var(--color-surface-muted)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--color-ink)] rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card padding="md">
              <CardHeader title="Top pages" description="Highest-traffic URLs" />
              <ul className="space-y-2.5">
                {kpis.topPages.map((p) => (
                  <li key={p.page} className="flex items-baseline justify-between gap-3">
                    <span className="text-[13px] font-mono text-[var(--color-ink)] truncate min-w-0">
                      {p.page}
                    </span>
                    <span className="text-[12px] tabular text-[var(--color-ink-muted)] shrink-0">
                      {formatNumber(p.sessions)}{" "}
                      <span className="text-[var(--color-ink-subtle)]">
                        · {p.purchases} orders
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
          )}

          {/* Insights — 3 columns: working / leaking / actions */}
          {(kpis.insights.working.length > 0 ||
            kpis.insights.leaking.length > 0 ||
            kpis.insights.actions.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {kpis.insights.working.length > 0 && (
                <Card padding="md">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-emerald-600" strokeWidth={2} />
                    </div>
                    <h3 className="text-[14px] font-semibold text-[var(--color-ink)]">
                      What&apos;s working
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {kpis.insights.working.slice(0, 3).map((item, i) => (
                      <li
                        key={i}
                        className="text-[13px] text-[var(--color-ink-muted)] leading-relaxed pl-3 border-l-2 border-emerald-100"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {kpis.insights.leaking.length > 0 && (
                <Card padding="md">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-red-600" strokeWidth={2} />
                    </div>
                    <h3 className="text-[14px] font-semibold text-[var(--color-ink)]">
                      Where you&apos;re leaking
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {kpis.insights.leaking.slice(0, 3).map((item, i) => (
                      <li
                        key={i}
                        className="text-[13px] text-[var(--color-ink-muted)] leading-relaxed pl-3 border-l-2 border-red-100"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {kpis.insights.actions.length > 0 && (
                <Card padding="md">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                      <Target className="w-4 h-4 text-amber-600" strokeWidth={2} />
                    </div>
                    <h3 className="text-[14px] font-semibold text-[var(--color-ink)]">
                      Priority actions
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {kpis.insights.actions.slice(0, 3).map((item, i) => (
                      <li
                        key={i}
                        className="text-[13px] text-[var(--color-ink-muted)] leading-relaxed pl-3 border-l-2 border-amber-100"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Right column — sidebar */}
        <div className="space-y-6">
          {/* SEO Snapshot */}
          {hasSeoData && (
          <Card padding="md">
            <CardHeader title="SEO Snapshot" description="Last 28 days" />
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-[var(--color-surface-muted)] p-3.5">
                <div className="text-[11px] text-[var(--color-ink-subtle)] uppercase tracking-wider font-medium">
                  Clicks
                </div>
                <div className="text-[22px] font-bold tabular text-[var(--color-ink)] mt-1">
                  {formatNumber(kpis.seo.clicks)}
                </div>
              </div>
              <div className="rounded-xl bg-[var(--color-surface-muted)] p-3.5">
                <div className="text-[11px] text-[var(--color-ink-subtle)] uppercase tracking-wider font-medium">
                  Impressions
                </div>
                <div className="text-[22px] font-bold tabular text-[var(--color-ink)] mt-1">
                  {formatNumber(kpis.seo.impressions)}
                </div>
              </div>
              <div className="rounded-xl bg-[var(--color-surface-muted)] p-3.5">
                <div className="text-[11px] text-[var(--color-ink-subtle)] uppercase tracking-wider font-medium">
                  Avg CTR
                </div>
                <div className="text-[22px] font-bold tabular text-[var(--color-ink)] mt-1">
                  {kpis.seo.ctr.toFixed(1)}%
                </div>
              </div>
              <div className="rounded-xl bg-[var(--color-surface-muted)] p-3.5">
                <div className="text-[11px] text-[var(--color-ink-subtle)] uppercase tracking-wider font-medium">
                  Avg Position
                </div>
                <div className="text-[22px] font-bold tabular text-[var(--color-ink)] mt-1">
                  {kpis.seo.position.toFixed(1)}
                </div>
              </div>
            </div>
            {kpis.topQueries.length > 0 && (
              <div className="mt-5 pt-5 border-t border-[var(--color-border)]">
                <div className="text-[11px] font-medium text-[var(--color-ink-subtle)] uppercase tracking-wider mb-3">
                  Top search queries
                </div>
                <ul className="space-y-2.5">
                  {kpis.topQueries.slice(0, 4).map((q) => (
                    <li key={q.query} className="text-[13px]">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-[var(--color-ink)] font-medium truncate min-w-0">
                          {q.query}
                        </span>
                        <span className="text-[11px] tabular text-[var(--color-ink-subtle)] shrink-0">
                          pos {q.position.toFixed(1)}
                        </span>
                      </div>
                      <div className="text-[11px] tabular text-[var(--color-ink-muted)] mt-0.5">
                        {formatNumber(q.clicks)} clicks · {q.ctr.toFixed(1)}% CTR
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <Link
              href="/seo"
              className="mt-5 inline-flex items-center gap-1 text-[13px] font-medium text-[var(--color-ink)] hover:text-[var(--color-accent)] transition-colors"
            >
              View full SEO plan
              <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.5} />
            </Link>
          </Card>
          )}

          {/* Upcoming content */}
          <Card padding="md">
            <CardHeader
              title="Upcoming Content"
              description={`${upcomingDrafts.length} posts queued`}
              action={
                <Link
                  href="/content"
                  className="text-[12px] font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                >
                  All →
                </Link>
              }
            />
            <div className="space-y-3">
              {upcomingDrafts.length === 0 && (
                <p className="text-[13px] text-[var(--color-ink-subtle)]">No drafts queued.</p>
              )}
              {upcomingDrafts.map((d) => (
                <Link
                  key={d.id}
                  href="/content"
                  className="block group rounded-xl border border-[var(--color-border)] hover:border-[var(--color-ink)] p-3 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-accent)] bg-[var(--color-accent-soft)] px-1.5 py-0.5 rounded">
                      {d.platform}
                    </span>
                    <span className="text-[11px] text-[var(--color-ink-subtle)]">
                      {d.date} · {d.slot}
                    </span>
                  </div>
                  <p className="text-[13px] text-[var(--color-ink)] leading-snug font-medium line-clamp-2">
                    {d.topic}
                  </p>
                </Link>
              ))}
            </div>
          </Card>

          {/* Activity feed — what Jarvis did */}
          <Card padding="md">
            <CardHeader
              title="Recent activity"
              description="What Jarvis has been working on"
            />
            <ol className="relative space-y-4">
              {activity.length === 0 && (
                <p className="text-[13px] text-[var(--color-ink-subtle)]">
                  No activity yet. Check back soon.
                </p>
              )}
              {activity.map((item, i) => {
                const meta = ACTIVITY_META[item.type];
                const Icon = meta.icon;
                const isLast = i === activity.length - 1;
                return (
                  <li key={item.id} className="relative flex gap-3">
                    {!isLast && (
                      <span
                        className="absolute left-[15px] top-8 bottom-[-16px] w-px bg-[var(--color-border)]"
                        aria-hidden
                      />
                    )}
                    <div
                      className={cn(
                        "shrink-0 w-8 h-8 rounded-lg flex items-center justify-center relative z-10 ring-4 ring-white",
                        meta.bg,
                      )}
                    >
                      <Icon className={cn("w-4 h-4", meta.fg)} strokeWidth={2} />
                    </div>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <p className="text-[13px] font-medium text-[var(--color-ink)] leading-snug">
                        {item.title}
                      </p>
                      {item.description && (
                        <p className="text-[12px] text-[var(--color-ink-muted)] mt-0.5 leading-snug">
                          {item.description}
                        </p>
                      )}
                      <p className="text-[11px] text-[var(--color-ink-subtle)] mt-1 tabular">
                        {relativeTime(item.timestamp)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </Card>

          {/* Top States */}
          {kpis.topStates.length > 0 && (
            <Card padding="md">
              <CardHeader title="Where customers buy" description="Top markets" />
              <div className="flex flex-wrap gap-1.5">
                {kpis.topStates.map((s) => (
                  <span
                    key={s}
                    className="text-[12px] font-medium text-[var(--color-ink-muted)] bg-[var(--color-surface-muted)] px-2.5 py-1 rounded-md"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Card>
          )}

        </div>
      </div>
    </>
  );
}
