import {
  DollarSign,
  TrendingUp,
  Activity,
  Users,
  AlertTriangle,
  Sparkles,
  Target,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardHeader } from "@/components/card";
import { KpiCard } from "@/components/kpi-card";
import {
  getSgWeeklyMetrics,
  getSgRecentAnomalies,
  getSgTopCampaigns,
  getSgLatestCohort,
  getSgLatestAttribution,
} from "@/lib/analytics-data";
import { getPortalSession } from "@/lib/current-client";
import { formatCurrency, formatNumber, cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function InsightsPage() {
  const session = await getPortalSession();

  // Only real-mode clients have warehouse data right now.
  // Demo + orphan modes get a placeholder card explaining what they'll see.
  if (!session || session.mode !== "real" || session.client?.slug !== "sprinkler-guard") {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Strategic Insights"
          description="Deep analytics — anomaly detection, customer lifetime value, attribution beyond last-click"
        />
        <Card>
          <CardHeader title="Coming soon for your account" />
          <div className="px-6 pb-6 text-sm text-[var(--color-ink-muted)]">
            <p>
              The Insights view shows what your weekly report can&apos;t:
              automated anomaly detection across 8 weeks of trends, predicted
              customer lifetime value by acquisition cohort, and the channels
              that are doing the real acquisition work that last-click metrics
              hide.
            </p>
            <p className="mt-3">
              We&apos;re activating this for accounts with at least 90 days of
              data in our analytics warehouse. Your account isn&apos;t there
              yet.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  const [windows, anomalies, topCampaigns, cohort, attribution] = await Promise.all([
    getSgWeeklyMetrics(8),
    getSgRecentAnomalies(30, 15),
    getSgTopCampaigns(5),
    getSgLatestCohort(),
    getSgLatestAttribution(),
  ]);

  // Compute MoM-style deltas from the trailing 28d windows
  const latest = windows[windows.length - 1];
  const prior = windows[windows.length - 2] ?? null;

  const pct = (current: number | null, previous: number | null) => {
    if (!current || !previous) return undefined;
    return ((current - previous) / previous) * 100;
  };

  const revenueDelta = pct(latest?.revenueNet ?? null, prior?.revenueNet ?? null);
  const spendDelta = pct(latest?.adSpendTotal ?? null, prior?.adSpendTotal ?? null);
  const roasDelta = pct(latest?.blendedRoas ?? null, prior?.blendedRoas ?? null);
  const aovDelta = pct(latest?.aov ?? null, prior?.aov ?? null);

  const sevCounts = anomalies.reduce(
    (acc, a) => {
      acc[a.severity] = (acc[a.severity] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Strategic Insights"
        description="Deep analytics beyond the weekly report — anomaly detection, lifetime-value forecasting, attribution beyond last-click"
      />

      {/* KPI tiles — latest trailing-28d window */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard
          label="Revenue (28d)"
          value={latest?.revenueNet ?? 0}
          format="currency"
          delta={revenueDelta}
          icon={DollarSign}
        />
        <KpiCard
          label="Ad spend (28d)"
          value={latest?.adSpendTotal ?? 0}
          format="currency"
          delta={spendDelta}
          icon={Target}
        />
        <KpiCard
          label="Blended ROAS"
          value={latest?.blendedRoas ?? 0}
          format="number"
          delta={roasDelta}
          icon={TrendingUp}
          hint={`Meta ${latest?.metaRoas?.toFixed(2) ?? "—"}x · Google ${latest?.googleRoas?.toFixed(2) ?? "—"}x`}
        />
        <KpiCard
          label="AOV (28d)"
          value={latest?.aov ?? 0}
          format="currency"
          delta={aovDelta}
          icon={Users}
        />
      </section>

      {/* Anomalies feed */}
      <section>
        <Card>
          <CardHeader
            title="What changed recently"
            description={`${sevCounts.critical ?? 0} critical · ${sevCounts.warn ?? 0} warn · ${sevCounts.info ?? 0} info — automated detections across the last 30 days`}
          />
          <div className="divide-y divide-[var(--color-border)]">
            {anomalies.length === 0 ? (
              <p className="px-6 py-6 text-sm text-[var(--color-ink-muted)]">
                No anomalies detected in the last 30 days. Trends within
                tolerance.
              </p>
            ) : (
              anomalies.map((a, i) => (
                <div key={i} className="px-6 py-4 flex items-start gap-4">
                  <SeverityBadge severity={a.severity} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-3">
                      <code className="text-xs text-[var(--color-ink-muted)] font-mono">
                        {a.pattern}
                      </code>
                      <time className="text-xs text-[var(--color-ink-muted)] shrink-0">
                        {new Date(a.detectedAt).toLocaleDateString()}
                      </time>
                    </div>
                    <p className="mt-1 text-sm text-[var(--color-ink)] leading-relaxed">
                      {a.message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </section>

      {/* Top campaigns this month */}
      <section>
        <Card>
          <CardHeader
            title="Top campaigns this month"
            description="Where the ad dollars are going (Meta + Google, ranked by spend)"
          />
          {topCampaigns.length === 0 ? (
            <p className="px-6 py-6 text-sm text-[var(--color-ink-muted)]">
              No campaign data yet this month.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-[var(--color-ink-muted)] uppercase tracking-wide">
                  <tr>
                    <th className="px-6 py-3 text-left">Campaign</th>
                    <th className="px-6 py-3 text-left">Platform</th>
                    <th className="px-6 py-3 text-right">Spend</th>
                    <th className="px-6 py-3 text-right">Revenue</th>
                    <th className="px-6 py-3 text-right">ROAS</th>
                    <th className="px-6 py-3 text-right">Purchases</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {topCampaigns.map((c, i) => (
                    <tr key={i}>
                      <td className="px-6 py-3 truncate max-w-xs">
                        {c.campaignName}
                      </td>
                      <td className="px-6 py-3 text-[var(--color-ink-muted)] capitalize">
                        {c.platform}
                      </td>
                      <td className="px-6 py-3 text-right tabular-nums">
                        {formatCurrency(c.spend)}
                      </td>
                      <td className="px-6 py-3 text-right tabular-nums">
                        {formatCurrency(c.revenue)}
                      </td>
                      <td className="px-6 py-3 text-right tabular-nums">
                        {c.roas !== null ? `${c.roas.toFixed(2)}x` : "—"}
                      </td>
                      <td className="px-6 py-3 text-right tabular-nums">
                        {formatNumber(c.purchases)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </section>

      {/* Attribution comparison — first-touch vs last-touch */}
      <section>
        <Card>
          <CardHeader
            title="Where the dollars are really working"
            description="First-touch vs last-touch revenue by channel. Last-click dashboards show only the right column — both are needed to see real channel value."
          />
          {attribution.length === 0 ? (
            <p className="px-6 py-6 text-sm text-[var(--color-ink-muted)]">
              Attribution data not yet available.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-[var(--color-ink-muted)] uppercase tracking-wide">
                  <tr>
                    <th className="px-6 py-3 text-left">Channel</th>
                    <th className="px-6 py-3 text-right">First-touch rev</th>
                    <th className="px-6 py-3 text-right">Last-touch rev</th>
                    <th className="px-6 py-3 text-right">Δ (pp)</th>
                    <th className="px-6 py-3 text-left">What it means</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {attribution.map((row) => (
                    <tr key={row.channel}>
                      <td className="px-6 py-3 font-medium">{row.channel}</td>
                      <td className="px-6 py-3 text-right tabular-nums">
                        {formatCurrency(row.firstTouchRev)}
                      </td>
                      <td className="px-6 py-3 text-right tabular-nums">
                        {formatCurrency(row.lastTouchRev)}
                      </td>
                      <td
                        className={cn(
                          "px-6 py-3 text-right tabular-nums font-medium",
                          row.deltaPct > 5 && "text-red-700",
                          row.deltaPct < -5 && "text-emerald-700"
                        )}
                      >
                        {row.deltaPct > 0 ? "+" : ""}
                        {row.deltaPct.toFixed(1)}
                      </td>
                      <td className="px-6 py-3 text-[var(--color-ink-muted)]">
                        {row.insight}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </section>

      {/* Cohort + predicted lifetime value */}
      <section>
        <Card>
          <CardHeader
            title="Customer lifetime value by acquisition month"
            description="Each row is the customers you acquired that month. Predicted LTV is what the model expects them to spend over the next 12 months, given how repeat behavior typically plays out."
          />
          {cohort.length === 0 ? (
            <p className="px-6 py-6 text-sm text-[var(--color-ink-muted)]">
              Cohort data not yet available.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-[var(--color-ink-muted)] uppercase tracking-wide">
                  <tr>
                    <th className="px-6 py-3 text-left">Acquired</th>
                    <th className="px-6 py-3 text-right">Customers</th>
                    <th className="px-6 py-3 text-right">Avg 1st order</th>
                    <th className="px-6 py-3 text-right">Observed so far</th>
                    <th className="px-6 py-3 text-right">Predicted +12mo</th>
                    <th className="px-6 py-3 text-right">Total predicted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {cohort.map((row) => (
                    <tr key={row.cohortMonth}>
                      <td className="px-6 py-3 font-medium tabular-nums">
                        {row.cohortMonth}
                      </td>
                      <td className="px-6 py-3 text-right tabular-nums">
                        {row.customers}
                      </td>
                      <td className="px-6 py-3 text-right tabular-nums">
                        {formatCurrency(row.avgFirstValue)}
                      </td>
                      <td className="px-6 py-3 text-right tabular-nums">
                        {formatCurrency(row.observedClv)}
                      </td>
                      <td className="px-6 py-3 text-right tabular-nums text-[var(--color-ink-muted)]">
                        {formatCurrency(row.predicted12mClv)}
                      </td>
                      <td className="px-6 py-3 text-right tabular-nums font-medium">
                        {formatCurrency(row.totalPredictedValue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </section>

      {/* 8-week trend table */}
      <section>
        <Card>
          <CardHeader
            title="Trailing 28-day windows"
            description="Rolling snapshots — overlapping windows show the trend, not just the latest number"
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-[var(--color-ink-muted)] uppercase tracking-wide">
                <tr>
                  <th className="px-6 py-3 text-left">Window start</th>
                  <th className="px-6 py-3 text-right">Revenue</th>
                  <th className="px-6 py-3 text-right">Spend</th>
                  <th className="px-6 py-3 text-right">Blended ROAS</th>
                  <th className="px-6 py-3 text-right">Orders</th>
                  <th className="px-6 py-3 text-right">AOV</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {windows.map((w) => (
                  <tr key={w.weekStart}>
                    <td className="px-6 py-3 tabular-nums">{w.weekStart}</td>
                    <td className="px-6 py-3 text-right tabular-nums">
                      {w.revenueNet ? formatCurrency(w.revenueNet) : "—"}
                    </td>
                    <td className="px-6 py-3 text-right tabular-nums">
                      {w.adSpendTotal ? formatCurrency(w.adSpendTotal) : "—"}
                    </td>
                    <td className="px-6 py-3 text-right tabular-nums">
                      {w.blendedRoas ? `${w.blendedRoas.toFixed(2)}x` : "—"}
                    </td>
                    <td className="px-6 py-3 text-right tabular-nums">
                      {w.orders ?? "—"}
                    </td>
                    <td className="px-6 py-3 text-right tabular-nums">
                      {w.aov ? formatCurrency(w.aov) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: "info" | "warn" | "critical" }) {
  const styles = {
    critical: {
      bg: "bg-red-50",
      text: "text-red-700",
      icon: AlertTriangle,
    },
    warn: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      icon: AlertTriangle,
    },
    info: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      icon: Sparkles,
    },
  } as const;
  const config = styles[severity];
  const Icon = config.icon;
  return (
    <div
      className={cn(
        "shrink-0 rounded-md p-2 flex items-center justify-center",
        config.bg,
        config.text
      )}
    >
      <Icon className="h-4 w-4" />
    </div>
  );
}
