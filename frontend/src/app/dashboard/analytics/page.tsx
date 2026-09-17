'use client';

import { useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import DownloadPdfButton from '@/components/DownloadPdfButton';


interface RiskTrendPoint {
  month: string;
  riskScore: number;
  evaluations: number;
}

interface Metric {
  label: string;
  value: string;
  detail: string;
  trend?: string;
  tone: 'teal' | 'blue' | 'violet';
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ value?: number; payload?: RiskTrendPoint }>;
  label?: string;
}

const RISK_TREND: readonly RiskTrendPoint[] = [
  { month: 'Jan', riskScore: 68, evaluations: 184 },
  { month: 'Feb', riskScore: 63, evaluations: 216 },
  { month: 'Mar', riskScore: 59, evaluations: 248 },
  { month: 'Apr', riskScore: 54, evaluations: 291 },
  { month: 'May', riskScore: 49, evaluations: 326 },
  { month: 'Jun', riskScore: 44, evaluations: 372 },
];

const INITIAL_METRICS: readonly Metric[] = [
  {
    label: 'Total Evaluations',
    value: '1,637',
    detail: 'Across all patient cohorts',
    trend: '+18.6%',
    tone: 'teal',
  },
  {
    label: 'ML Model Accuracy',
    value: '96.4%',
    detail: 'Validated against latest set',
    trend: '+2.1%',
    tone: 'blue',
  },
  {
    label: 'Avg. API Response Time',
    value: '45ms',
    detail: 'FastAPI p95 latency',
    trend: '-12.4%',
    tone: 'violet',
  },
];

const TONE_STYLES: Record<Metric['tone'], { icon: string; iconBg: string; value: string }> = {
  teal: {
    icon: '↗',
    iconBg: 'bg-teal-50 text-teal-700 ring-teal-100',
    value: 'text-teal-700',
  },
  blue: {
    icon: '✦',
    iconBg: 'bg-blue-50 text-blue-700 ring-blue-100',
    value: 'text-blue-700',
  },
  violet: {
    icon: '⌁',
    iconBg: 'bg-violet-50 text-violet-700 ring-violet-100',
    value: 'text-violet-700',
  },
};

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const point = payload[0]?.payload;
  const score = payload[0]?.value;

  return (
    <div className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-xl shadow-gray-900/10">
      <p className="mb-1 text-xs font-semibold text-gray-500">{label} 2025</p>
      <p className="text-sm font-bold text-teal-700">{score}% average risk score</p>
      <p className="mt-1 text-xs text-gray-500">{point?.evaluations ?? 0} evaluations</p>
    </div>
  );
}

export default function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState<readonly Metric[]>(INITIAL_METRICS);
  const [lastUpdated, setLastUpdated] = useState('Just now');

  const refreshTelemetry = () => {
    setMetrics((currentMetrics) =>
      currentMetrics.map((metric, index) =>
        index === 2
          ? { ...metric, value: `${42 + Math.floor(Math.random() * 8)}ms`, detail: 'Updated moments ago' }
          : metric
      )
    );
    setLastUpdated('Just now');
  };

  return (
    <div className="relative min-h-full overflow-hidden bg-gradient-to-br from-gray-50 via-white to-teal-50/30 p-4 sm:p-6 lg:p-8">
      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-teal-100/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-blue-100/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl space-y-6">
        <header className="animate-page-enter flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
              <span className="h-2 w-2 animate-pulse rounded-full bg-teal-500" />
              Intelligence center
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Healthcare Intelligence Analytics
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500">
              Monitor machine learning telemetry and discover meaningful patient risk insights.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-2 text-xs font-semibold text-emerald-700 shadow-sm backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              FastAPI Backend: Online
            </span>
            <DownloadPdfButton variant="compact" label="Download PDF Report" />
            <button
              type="button"
              onClick={refreshTelemetry}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 shadow-sm transition hover:border-teal-200 hover:text-teal-700"
            >
              Refresh
            </button>
          </div>

        </header>

        <section aria-label="Model telemetry metrics" className="grid gap-4 md:grid-cols-3">
          {metrics.map((metric, index) => {
            const tone = TONE_STYLES[metric.tone];

            return (
              <article
                key={metric.label}
                className="animate-page-enter group rounded-2xl border border-gray-200/80 bg-white/80 p-5 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-lg hover:shadow-gray-900/5"
                style={{ animationDelay: `${100 + index * 100}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{metric.label}</p>
                    <p className={`mt-3 text-3xl font-bold tracking-tight ${tone.value}`}>{metric.value}</p>
                  </div>
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ring-1 ${tone.iconBg}`}>
                    {tone.icon}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3 text-xs">
                  <span className="text-gray-500">{metric.detail}</span>
                  {metric.trend && (
                    <span className="rounded-full bg-emerald-50 px-2 py-1 font-bold text-emerald-700">
                      {metric.trend}
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </section>

        {/* PDF Export Banner Card */}
        <DownloadPdfButton variant="glass-card" />

        <section

          aria-labelledby="risk-trend-heading"
          className="animate-page-enter animate-delay-400 rounded-2xl border border-gray-200/80 bg-white/85 p-5 shadow-sm backdrop-blur sm:p-7"
        >
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <div className="flex items-center gap-2">
                <h2 id="risk-trend-heading" className="text-lg font-bold text-gray-900">
                  Patient Risk Progression Trend
                </h2>
                <span className="rounded-full bg-teal-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-teal-700">
                  Live
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500">Average model risk score across the last six months</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs text-gray-500">Last telemetry sync</p>
              <p className="mt-1 text-sm font-semibold text-gray-700">{lastUpdated}</p>
            </div>
          </div>

          <div className="h-[300px] w-full sm:h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={RISK_TREND} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0d9488" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#0d9488" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e5e7eb" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 11 }}
                  tickFormatter={(value: number) => `${value}%`}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#99f6e4', strokeWidth: 1 }} />
                <Area
                  type="monotone"
                  dataKey="riskScore"
                  stroke="#0f766e"
                  strokeWidth={3}
                  fill="url(#riskGradient)"
                  dot={{ fill: '#0f766e', r: 4, strokeWidth: 2, stroke: '#ffffff' }}
                  activeDot={{ r: 6, fill: '#0f766e', stroke: '#ccfbf1', strokeWidth: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}
