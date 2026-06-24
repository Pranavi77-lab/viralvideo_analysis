import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ─── Colours ─────────────────────────────────────────────────────────────────
const C = {
  green: "#4ade80",
  blue: "#60a5fa",
  yellow: "#fbbf24",
  red: "#f87171",
  purple: "#a78bfa",
  purpleDark: "#7c3aed",
  purpleDeep: "#4c1d95",
  muted: "#4a5568",
  text: "#f7fafc",
  subtext: "#718096",
  grid: "rgba(255,255,255,0.05)",
  bg: "rgba(0,0,0,0)",
};

// shared recharts style overrides
const AXIS_STYLE = { fill: C.subtext, fontSize: 11 };
const tooltipStyle = {
  contentStyle: {
    background: "#0d1117",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10,
    color: C.text,
    fontSize: 12,
  },
  cursor: { fill: "rgba(255,255,255,0.04)" },
};

// ─── Tab 1 data: perfectly balanced performance buckets ──────────────────────
const bucketData = [
  { bucket: "low", count: 7500 },
  { bucket: "medium", count: 7500 },
  { bucket: "high", count: 7500 },
  { bucket: "viral", count: 7500 },
];

// ─── Tab 2 data: 20-bin simulated distributions ──────────────────────────────
function genComposedData() {
  // right-skewed raw (likes ~ log-normal)
  const rawFreqs = [
    420, 680, 890, 1050, 980, 820, 680, 540, 420, 340, 260, 200, 150, 110, 85,
    60, 45, 30, 18, 12,
  ];
  // normalized → roughly uniform across 0-1
  const normFreqs = [
    310, 295, 305, 300, 298, 303, 297, 308, 295, 302, 298, 305, 295, 300, 302,
    296, 301, 299, 297, 293,
  ];
  return rawFreqs.map((raw, i) => ({
    bin: `${(i * 0.05).toFixed(2)}`,
    raw,
    normalized: normFreqs[i],
  }));
}
const composedData = genComposedData();

// ─── Tab 3 data ───────────────────────────────────────────────────────────────
const timeData = [
  { name: "Distribution", Morning: 26, Afternoon: 25, Evening: 25, Night: 24 },
];
const captionData = [{ name: "Distribution", Short: 28, Medium: 44, Long: 28 }];
const viralData = [{ name: "Distribution", "Not Viral": 75, Viral: 25 }];

// ─── Shared section title ────────────────────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex items-center gap-2 text-sm font-semibold mt-6 mb-4 pb-2"
      style={{
        color: C.text,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {children}
    </div>
  );
}

// ─── Insight pill ────────────────────────────────────────────────────────────
type InsightVariant = "blue" | "green" | "orange" | "red" | "purple";
const insightMap: Record<
  InsightVariant,
  { bg: string; border: string; color: string }
> = {
  blue: {
    bg: "rgba(96,165,250,0.07)",
    border: "rgba(96,165,250,0.18)",
    color: "#93c5fd",
  },
  green: {
    bg: "rgba(74,222,128,0.07)",
    border: "rgba(74,222,128,0.18)",
    color: "#86efac",
  },
  orange: {
    bg: "rgba(251,191,36,0.07)",
    border: "rgba(251,191,36,0.18)",
    color: "#fde68a",
  },
  red: {
    bg: "rgba(248,113,113,0.07)",
    border: "rgba(248,113,113,0.18)",
    color: "#fca5a5",
  },
  purple: {
    bg: "rgba(167,139,250,0.07)",
    border: "rgba(167,139,250,0.18)",
    color: "#c4b5fd",
  },
};
function Insight({
  variant,
  children,
}: { variant: InsightVariant; children: React.ReactNode }) {
  const s = insightMap[variant];
  return (
    <div
      className="rounded-xl px-4 py-3 text-sm leading-relaxed mb-3"
      style={{
        background: s.bg,
        border: `1px solid ${s.border}`,
        color: s.color,
      }}
    >
      {children}
    </div>
  );
}

// ─── Step-Area chart (Tab 1) ──────────────────────────────────────────────────
function BucketStepChart() {
  return (
    <>
      <SectionTitle>Performance bucket distribution — step area</SectionTitle>
      <Insight variant="green">
        Dataset is <strong>perfectly balanced</strong>: exactly 7,500 posts per
        bucket (viral / high / medium / low). The flat step area confirms equal
        representation — no class imbalance.
      </Insight>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart
          data={bucketData}
          margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="stepGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={C.green} stopOpacity={0.35} />
              <stop offset="95%" stopColor={C.green} stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={C.grid} />
          <XAxis
            dataKey="bucket"
            tick={AXIS_STYLE}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 9000]}
            tick={AXIS_STYLE}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            {...tooltipStyle}
            formatter={(value: number) => [value.toLocaleString(), "Posts"]}
          />
          <Area
            type="stepAfter"
            dataKey="count"
            stroke={C.green}
            strokeWidth={2.5}
            fill="url(#stepGrad)"
            dot={{ fill: C.green, r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: C.green }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </>
  );
}

// ─── Composed overlay chart (Tab 2) ──────────────────────────────────────────
function ComposedDistributionChart() {
  return (
    <>
      <SectionTitle>
        Before vs after MinMaxScaler — overlaid distributions
      </SectionTitle>
      <Insight variant="orange">
        <strong>Red area</strong> = raw likes (right-skewed — most posts have
        few likes, a few have many). &nbsp;<strong>Green area</strong> =
        normalized 0-1 (uniform — all values equally spread after MinMaxScaler).
      </Insight>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart
          data={composedData}
          margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
        >
          <defs>
            <linearGradient id="rawGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={C.red} stopOpacity={0.5} />
              <stop offset="95%" stopColor={C.red} stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="normGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={C.green} stopOpacity={0.5} />
              <stop offset="95%" stopColor={C.green} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={C.grid} />
          <XAxis
            dataKey="bin"
            tick={AXIS_STYLE}
            axisLine={false}
            tickLine={false}
            label={{
              value: "Value bins",
              position: "insideBottom",
              offset: -10,
              fill: C.subtext,
              fontSize: 11,
            }}
            interval={3}
          />
          <YAxis
            tick={AXIS_STYLE}
            axisLine={false}
            tickLine={false}
            label={{
              value: "Frequency",
              angle: -90,
              position: "insideLeft",
              fill: C.subtext,
              fontSize: 11,
            }}
          />
          <Tooltip
            {...tooltipStyle}
            formatter={(value: number, name: string) => [
              value.toLocaleString(),
              name === "raw" ? "Raw likes" : "Normalized",
            ]}
          />
          <Legend
            formatter={(value: string) => (
              <span style={{ color: C.subtext, fontSize: 12 }}>
                {value === "raw"
                  ? "Raw likes (before)"
                  : "Normalized 0-1 (after)"}
              </span>
            )}
          />
          <Area
            type="monotone"
            dataKey="raw"
            stroke={C.red}
            strokeWidth={2}
            fill="url(#rawGrad)"
            fillOpacity={1}
          />
          <Area
            type="monotone"
            dataKey="normalized"
            stroke={C.green}
            strokeWidth={2}
            fill="url(#normGrad)"
            fillOpacity={1}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </>
  );
}

// ─── Stacked horizontal progress bar (Tab 3) ─────────────────────────────────
interface SegmentedBarProps {
  title: string;
  data: Record<string, number | string>[];
  segments: { key: string; color: string; label: string }[];
  dataKey?: string;
}
function SegmentedBar({ title, data, segments }: SegmentedBarProps) {
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold mb-2" style={{ color: C.text }}>
        {title}
      </p>
      <ResponsiveContainer width="100%" height={64}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis type="category" dataKey="name" hide />
          <Tooltip
            {...tooltipStyle}
            formatter={(value: number, name: string) => [`${value}%`, name]}
          />
          {segments.map((s) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              stackId="a"
              fill={s.color}
              isAnimationActive={true}
              radius={[0, 0, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
      {/* legend */}
      <div className="flex flex-wrap gap-3 mt-1">
        {segments.map((s) => (
          <span
            key={s.key}
            className="flex items-center gap-1.5 text-xs"
            style={{ color: C.subtext }}
          >
            <span
              className="inline-block w-2.5 h-2.5 rounded-sm"
              style={{ background: s.color }}
            />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function SegmentedBarsSection() {
  return (
    <>
      <SectionTitle>Feature engineering — distribution breakdown</SectionTitle>
      <div className="grid grid-cols-1 gap-2">
        <div
          className="rounded-2xl p-5"
          style={{
            background: "rgba(96,165,250,0.03)",
            border: "1px solid rgba(96,165,250,0.15)",
          }}
        >
          <p
            className="text-xs uppercase tracking-widest mb-1"
            style={{ color: C.blue }}
          >
            time_of_day
          </p>
          <p className="text-xs mb-3" style={{ color: C.subtext }}>
            Created from post_hour — 4 time slots
          </p>
          <SegmentedBar
            title=""
            data={timeData}
            segments={[
              { key: "Morning", color: C.blue, label: "Morning 26%" },
              { key: "Afternoon", color: C.green, label: "Afternoon 25%" },
              { key: "Evening", color: C.yellow, label: "Evening 25%" },
              { key: "Night", color: C.red, label: "Night 24%" },
            ]}
          />
        </div>

        <div
          className="rounded-2xl p-5"
          style={{
            background: "rgba(167,139,250,0.03)",
            border: "1px solid rgba(167,139,250,0.15)",
          }}
        >
          <p
            className="text-xs uppercase tracking-widest mb-1"
            style={{ color: C.purple }}
          >
            caption_group
          </p>
          <p className="text-xs mb-3" style={{ color: C.subtext }}>
            Created via pd.cut() on caption_length
          </p>
          <SegmentedBar
            title=""
            data={captionData}
            segments={[
              { key: "Short", color: C.purple, label: "Short ≤50 chars (28%)" },
              {
                key: "Medium",
                color: C.purpleDark,
                label: "Medium 50-150 (44%)",
              },
              { key: "Long", color: C.purpleDeep, label: "Long >150 (28%)" },
            ]}
          />
        </div>

        <div
          className="rounded-2xl p-5"
          style={{
            background: "rgba(74,222,128,0.03)",
            border: "1px solid rgba(74,222,128,0.15)",
          }}
        >
          <p
            className="text-xs uppercase tracking-widest mb-1"
            style={{ color: C.green }}
          >
            is_viral
          </p>
          <p className="text-xs mb-3" style={{ color: C.subtext }}>
            Binary target — viral=1 (25%), not viral=0 (75%)
          </p>
          <SegmentedBar
            title=""
            data={viralData}
            segments={[
              { key: "Not Viral", color: C.red, label: "Not Viral (75%)" },
              { key: "Viral", color: C.green, label: "Viral (25%)" },
            ]}
          />
        </div>
      </div>
    </>
  );
}

// ─── Preprocessing steps list (Tab 2 static content) ─────────────────────────
const PREPROC_STEPS = [
  {
    num: "1",
    action: "drop_duplicates()",
    why: "Removed duplicate rows to ensure clean data",
    variant: "green" as InsightVariant,
  },
  {
    num: "2",
    action: "pd.to_datetime()",
    why: "Converted post_datetime and post_date to proper datetime format",
    variant: "blue" as InsightVariant,
  },
  {
    num: "3",
    action: "LabelEncoder — account_type",
    why: "brand→0, creator→1 (ML needs numbers, not text)",
    variant: "purple" as InsightVariant,
  },
  {
    num: "4",
    action: "LabelEncoder — media_type",
    why: "carousel→0, image→1, reel→2",
    variant: "purple" as InsightVariant,
  },
  {
    num: "5",
    action: "LabelEncoder — content_category",
    why: "Beauty, Fashion, Food… → 0,1,2,3…",
    variant: "purple" as InsightVariant,
  },
  {
    num: "6",
    action: "LabelEncoder — traffic_source",
    why: "External, Home Feed, Hashtags… → encoded",
    variant: "purple" as InsightVariant,
  },
  {
    num: "7",
    action: "LabelEncoder — day_of_week",
    why: "Monday, Tuesday… → 0,1,2…",
    variant: "purple" as InsightVariant,
  },
  {
    num: "8",
    action: "MinMaxScaler",
    why: "Normalized likes, comments, shares, saves, reach, impressions, follower_count to 0-1 range",
    variant: "orange" as InsightVariant,
  },
];

// ─── Dataset column info (Tab 1 static content) ───────────────────────────────
const COLUMNS = [
  { col: "post_id", type: "object", nonNull: 29999 },
  { col: "post_datetime", type: "datetime64", nonNull: 29999 },
  { col: "post_date", type: "datetime64", nonNull: 29999 },
  { col: "post_hour", type: "int64", nonNull: 29999 },
  { col: "day_of_week", type: "object", nonNull: 29999 },
  { col: "media_type", type: "object", nonNull: 29999 },
  { col: "likes", type: "int64", nonNull: 29999 },
  { col: "comments", type: "int64", nonNull: 29999 },
  { col: "shares", type: "int64", nonNull: 29999 },
  { col: "saves", type: "int64", nonNull: 29999 },
  { col: "reach", type: "int64", nonNull: 29999 },
  { col: "impressions", type: "int64", nonNull: 29999 },
  { col: "engagement_rate", type: "float64", nonNull: 29999 },
  { col: "follower_count", type: "int64", nonNull: 29999 },
  { col: "hashtags_count", type: "int64", nonNull: 29999 },
  { col: "caption_length", type: "int64", nonNull: 29999 },
  { col: "has_call_to_action", type: "int64", nonNull: 29999 },
  { col: "content_category", type: "object", nonNull: 29999 },
  { col: "account_type", type: "object", nonNull: 29999 },
  { col: "traffic_source", type: "object", nonNull: 29999 },
  { col: "performance_score", type: "float64", nonNull: 29999 },
  { col: "performance_bucket", type: "int64", nonNull: 29999 },
  { col: "performance_bucket_label", type: "object", nonNull: 29999 },
];

// ─── MetricCard mini ─────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  color,
}: { label: string; value: string; color: string }) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${color}33`,
      }}
    >
      <p
        className="text-xs uppercase tracking-wider mb-1"
        style={{ color: C.muted }}
      >
        {label}
      </p>
      <p className="text-2xl font-black" style={{ color }}>
        {value}
      </p>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function PreprocessingPage() {
  return (
    <div className="min-h-screen p-6 pb-12" style={{ background: "#04060f" }}>
      <h1 className="text-2xl font-black mb-1" style={{ color: C.text }}>
        Data Preprocessing &amp; Feature Engineering
      </h1>
      <p className="text-sm mb-6" style={{ color: C.subtext }}>
        Cell 3 — Explore · Cell 4 — Clean &amp; Encode · Cell 5 — Feature
        Engineering
      </p>

      <Tabs defaultValue="explore">
        <TabsList
          className="mb-6"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 12,
            padding: 4,
            gap: 4,
          }}
        >
          <TabsTrigger value="explore">Cell 3 — Data Exploration</TabsTrigger>
          <TabsTrigger value="preprocess">Cell 4 — Preprocessing</TabsTrigger>
          <TabsTrigger value="engineer">
            Cell 5 — Feature Engineering
          </TabsTrigger>
        </TabsList>

        {/* TAB 1 ── Data Exploration */}
        <TabsContent value="explore">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <StatCard label="Total rows" value="29,999" color={C.blue} />
            <StatCard label="Total columns" value="23" color={C.green} />
            <StatCard label="Missing values" value="0" color={C.purple} />
          </div>

          <SectionTitle>Column data types</SectionTitle>
          <div
            className="rounded-2xl overflow-hidden mb-6"
            style={{ border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <table
              className="w-full text-xs"
              style={{ borderCollapse: "collapse" }}
            >
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.04)" }}>
                  {["Column", "Type", "Non-null"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-2 text-left font-semibold"
                      style={{
                        color: C.muted,
                        borderBottom: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COLUMNS.map((r, i) => (
                  <tr
                    key={r.col}
                    style={{
                      background:
                        i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)",
                    }}
                  >
                    <td className="px-4 py-1.5" style={{ color: C.green }}>
                      {r.col}
                    </td>
                    <td className="px-4 py-1.5" style={{ color: C.blue }}>
                      {r.type}
                    </td>
                    <td className="px-4 py-1.5" style={{ color: C.subtext }}>
                      {r.nonNull.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Step-area chart */}
          <BucketStepChart />
        </TabsContent>

        {/* TAB 2 ── Preprocessing */}
        <TabsContent value="preprocess">
          <SectionTitle>Cell 4 — What we did step by step</SectionTitle>
          {PREPROC_STEPS.map((s) => (
            <Insight key={s.num} variant={s.variant}>
              <strong>
                Step {s.num} — {s.action}:
              </strong>{" "}
              {s.why}
            </Insight>
          ))}

          {/* Composed overlay chart */}
          <ComposedDistributionChart />
        </TabsContent>

        {/* TAB 3 ── Feature Engineering */}
        <TabsContent value="engineer">
          <SegmentedBarsSection />

          <Insight variant="blue">
            All three engineered features provide cleaner signals for the ML
            models: time_of_day groups 24 raw hours into 4 interpretable slots;
            caption_group simplifies continuous length into Short/Medium/Long;
            is_viral collapses 4 buckets into a single 0/1 classification
            target.
          </Insight>
        </TabsContent>
      </Tabs>
    </div>
  );
}
