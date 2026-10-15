"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  KPI,
  MONTHLY_REVENUE,
  REVENUE_BY_PRODUCT,
  FUNNEL,
  MEMBERSHIP_COUNTS,
  PRODUCT_BY_ID,
} from "@/lib/mock-data";
import { formatGBP, formatGBPExact } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-forest-100/80 ${className ?? ""}`}
    />
  );
}

const revenueChartData = MONTHLY_REVENUE.map((m) => ({
  month: m.month.slice(5),
  label: new Date(m.month + "-01").toLocaleDateString("en-GB", {
    month: "short",
  }),
  revenue: m.revenuePence / 100,
  members: m.members,
  trials: m.trials,
}));

const funnelData = FUNNEL.map((f) => ({
  ...f,
  pct: Math.round((f.count / FUNNEL[0].count) * 100),
}));

const productChartData = REVENUE_BY_PRODUCT.map((r) => ({
  name: r.product.replace(" membership", "").replace("5-week ", ""),
  fullName: r.product,
  revenue: r.revenuePence / 100,
}));

export function AdminOverview() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 450);
    return () => clearTimeout(t);
  }, []);

  const conversionPct = Math.round(KPI.trialConversion * 100);

  if (!ready) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  const kpis = [
    {
      label: "Active members",
      value: String(KPI.activeMembers),
      hint: `${MEMBERSHIP_COUNTS.gold} Gold · ${MEMBERSHIP_COUNTS.platinum} Platinum`,
    },
    {
      label: "MRR",
      value: formatGBP(KPI.mrrPence),
      hint: `Gold ${formatGBP(PRODUCT_BY_ID.gold.pricePence)} + Platinum ${formatGBP(PRODUCT_BY_ID.platinum.pricePence)}`,
    },
    {
      label: "Trial → member",
      value: `${conversionPct}%`,
      hint: `${FUNNEL[3].count} of ${FUNNEL[0].count} trials converted`,
    },
    {
      label: "Classes this week",
      value: String(KPI.classesThisWeek),
      hint: "Across 23 venues",
    },
    {
      label: "Avg attendance",
      value: `${Math.round(KPI.avgAttendance * 100)}%`,
      hint: "Last 4 weeks",
    },
    {
      label: "Revenue this month",
      value: formatGBP(KPI.revenueThisMonthPence),
      hint: `${KPI.trialsSoldThisMonth} trials @ ${formatGBP(PRODUCT_BY_ID.trial.pricePence)}`,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          Overview
        </h1>
        <p className="mt-1 text-sm text-charcoal/60">
          Sample data priced from live Bro-ga plans (GBP).
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {kpis.map((k) => (
          <Card key={k.label}>
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-charcoal/50">
                {k.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-2xl font-extrabold text-forest-800">{k.value}</p>
              <p className="mt-1 text-xs text-charcoal/50">{k.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue · last 12 months</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData}>
                <defs>
                  <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1F5340" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#1F5340" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#D8EDE2" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="#78716c" />
                <YAxis
                  tick={{ fontSize: 12 }}
                  stroke="#78716c"
                  tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value) => [
                    formatGBPExact(Number(value) * 100),
                    "Revenue",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#1F5340"
                  fill="url(#revFill)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Trial → member conversion</CardTitle>
            <Badge variant="accent">{conversionPct}% convert</Badge>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D8EDE2" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="#78716c" />
                <YAxis
                  type="category"
                  dataKey="stage"
                  width={120}
                  tick={{ fontSize: 11 }}
                  stroke="#78716c"
                />
                <Tooltip
                  formatter={(value, _n, item) => [
                    `${value} people (${item.payload.pct}%)`,
                    "Count",
                  ]}
                />
                <Bar dataKey="count" fill="#C2410C" radius={[0, 6, 6, 0]} barSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue by product (this month)</CardTitle>
          <p className="text-sm text-charcoal/60">
            Gold {formatGBP(PRODUCT_BY_ID.gold.pricePence)}/mo · Platinum{" "}
            {formatGBP(PRODUCT_BY_ID.platinum.pricePence)}/mo · Trial{" "}
            {formatGBP(PRODUCT_BY_ID.trial.pricePence)} · 10-pack{" "}
            {formatGBP(PRODUCT_BY_ID.pack10.pricePence)} · PAYG{" "}
            {formatGBP(PRODUCT_BY_ID.dropin.pricePence)}
          </p>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={productChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D8EDE2" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#78716c" />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="#78716c"
                tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value, _n, item) => [
                  formatGBPExact(Number(value) * 100),
                  item.payload.fullName,
                ]}
              />
              <Bar dataKey="revenue" fill="#26684C" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
