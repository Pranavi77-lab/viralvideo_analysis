import { useState } from "react";
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  ErrorBar,
  Legend,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  Treemap,
  XAxis,
  YAxis,
} from "recharts";

// ── Shared constants ─────────────────────────────────────────────────────────
const DARK_BG = "#04060f";
const TEXT_MUTED = "#718096";
const TEXT_LIGHT = "#e2e8f0";
const GRID_COLOR = "rgba(255,255,255,0.05)";

const COLORS = {
  viral: "#4ade80",
  high: "#60a5fa",
  medium: "#fbbf24",
  low: "#f87171",
};

const TOOLTIP_STYLE = {
  background: "#0d1117",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "10px",
  color: "#f7fafc",
  fontSize: "0.82rem",
};

const TABS = [
  { id: "heatmap", label: "Correlation Heatmap" },
  { id: "media", label: "Media & Category" },
  { id: "time", label: "Time of Day" },
  { id: "hashtags", label: "Hashtags" },
];

// ── InsightBox ────────────────────────────────────────────────────────────────
function InsightBox({
  color,
  children,
}: { color: string; children: React.ReactNode }) {
  const s: Record<string, React.CSSProperties> = {
    blue: {
      background: "rgba(96,165,250,0.07)",
      border: "1px solid rgba(96,165,250,0.18)",
      color: "#93c5fd",
    },
    green: {
      background: "rgba(74,222,128,0.07)",
      border: "1px solid rgba(74,222,128,0.18)",
      color: "#86efac",
    },
    orange: {
      background: "rgba(251,191,36,0.07)",
      border: "1px solid rgba(251,191,36,0.18)",
      color: "#fde68a",
    },
    red: {
      background: "rgba(248,113,113,0.07)",
      border: "1px solid rgba(248,113,113,0.18)",
      color: "#fca5a5",
    },
    purple: {
      background: "rgba(167,139,250,0.07)",
      border: "1px solid rgba(167,139,250,0.18)",
      color: "#c4b5fd",
    },
  };
  return (
    <div
      style={{
        ...s[color],
        borderRadius: 10,
        padding: "0.9rem 1.1rem",
        fontSize: "0.83rem",
        lineHeight: 1.65,
        marginBottom: 10,
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: "0.95rem",
        fontWeight: 600,
        color: TEXT_LIGHT,
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: "1rem",
        paddingBottom: 8,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {children}
    </div>
  );
}

// ── TAB 1 — CORRELATION HEATMAP ───────────────────────────────────────────────
const CORR_LABELS = [
  "likes",
  "comments",
  "shares",
  "saves",
  "reach",
  "impressions",
  "eng_rate",
  "hashtags",
  "caption",
  "is_viral",
];
const CORR = [
  [1.0, 0.35, 0.28, 0.22, 0.41, 0.4, 0.52, 0.01, 0.02, 0.41],
  [0.35, 1.0, 0.29, 0.24, 0.38, 0.37, 0.48, 0.0, 0.01, 0.38],
  [0.28, 0.29, 1.0, 0.31, 0.33, 0.32, 0.44, 0.01, 0.01, 0.35],
  [0.22, 0.24, 0.31, 1.0, 0.29, 0.28, 0.4, 0.0, 0.02, 0.32],
  [0.41, 0.38, 0.33, 0.29, 1.0, 0.99, 0.38, 0.01, 0.01, 0.29],
  [0.4, 0.37, 0.32, 0.28, 0.99, 1.0, 0.37, 0.01, 0.01, 0.28],
  [0.52, 0.48, 0.44, 0.4, 0.38, 0.37, 1.0, 0.0, 0.03, 0.62],
  [0.01, 0.0, 0.01, 0.0, 0.01, 0.01, 0.0, 1.0, 0.05, 0.0],
  [0.02, 0.01, 0.01, 0.02, 0.01, 0.01, 0.03, 0.05, 1.0, 0.02],
  [0.41, 0.38, 0.35, 0.32, 0.29, 0.28, 0.62, 0.0, 0.02, 1.0],
];

function corrColor(v: number): string {
  // negative → red, zero → dark, positive → blue
  if (v < 0) {
    const t = Math.abs(v);
    return `rgba(239,68,68,${0.08 + t * 0.75})`;
  }
  if (v === 0) return "rgba(255,255,255,0.06)";
  return `rgba(59,130,246,${0.08 + v * 0.75})`;
}

const CELL = 44;
const LABEL_W = 72;
const LABEL_H = 44;
const HEATMAP_W = LABEL_W + CORR_LABELS.length * CELL;
const HEATMAP_H = LABEL_H + CORR_LABELS.length * CELL;

function CorrelationHeatmap() {
  return (
    <div>
      <SectionTitle>
        Correlation heatmap — factors influencing virality
      </SectionTitle>
      <div style={{ overflowX: "auto", width: "100%" }}>
        <svg
          width={HEATMAP_W}
          height={HEATMAP_H}
          role="img"
          aria-label="Correlation heatmap"
          style={{
            display: "block",
            margin: "0 auto",
            fontFamily: "Inter, sans-serif",
          }}
        >
          {/* Column labels */}
          {CORR_LABELS.map((lbl, ci) => (
            <text
              key={lbl}
              x={LABEL_W + ci * CELL + CELL / 2}
              y={LABEL_H - 8}
              textAnchor="end"
              transform={`rotate(-45, ${LABEL_W + ci * CELL + CELL / 2}, ${LABEL_H - 8})`}
              fill={TEXT_MUTED}
              fontSize={9}
            >
              {lbl}
            </text>
          ))}
          {CORR.map((row, ri) => (
            <g key={CORR_LABELS[ri]}>
              {/* Row label */}
              <text
                x={LABEL_W - 6}
                y={LABEL_H + ri * CELL + CELL / 2 + 4}
                textAnchor="end"
                fill={TEXT_MUTED}
                fontSize={9}
              >
                {CORR_LABELS[ri]}
              </text>
              {row.map((val, ci) => (
                <g key={CORR_LABELS[ci]}>
                  <rect
                    x={LABEL_W + ci * CELL}
                    y={LABEL_H + ri * CELL}
                    width={CELL}
                    height={CELL}
                    fill={corrColor(val)}
                    rx={2}
                    stroke="rgba(4,6,15,0.6)"
                    strokeWidth={1}
                  />
                  <text
                    x={LABEL_W + ci * CELL + CELL / 2}
                    y={LABEL_H + ri * CELL + CELL / 2 + 3}
                    textAnchor="middle"
                    fill="#f7fafc"
                    fontSize={9}
                    fontWeight={val >= 0.5 || val <= -0.5 ? 700 : 400}
                  >
                    {val.toFixed(2)}
                  </text>
                </g>
              ))}
            </g>
          ))}
        </svg>
      </div>
      {/* Color scale legend */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.5rem",
          marginTop: "0.75rem",
          marginBottom: "1.25rem",
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: "0.75rem",
            color: "#f87171",
          }}
        >
          <span
            style={{
              width: 18,
              height: 12,
              background: "rgba(239,68,68,0.8)",
              borderRadius: 2,
              display: "inline-block",
            }}
          />
          Negative (−1)
        </span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: "0.75rem",
            color: TEXT_MUTED,
          }}
        >
          <span
            style={{
              width: 18,
              height: 12,
              background: "rgba(255,255,255,0.06)",
              borderRadius: 2,
              display: "inline-block",
            }}
          />
          Zero (0)
        </span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: "0.75rem",
            color: "#60a5fa",
          }}
        >
          <span
            style={{
              width: 18,
              height: 12,
              background: "rgba(59,130,246,0.8)",
              borderRadius: 2,
              display: "inline-block",
            }}
          />
          Positive (+1)
        </span>
      </div>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}
      >
        <InsightBox color="blue">
          <strong>Strongest:</strong> engagement_rate ↔ is_viral ={" "}
          <strong>+0.62</strong>
        </InsightBox>
        <InsightBox color="green">
          <strong>Near identical:</strong> reach ↔ impressions ={" "}
          <strong>+0.99</strong>
        </InsightBox>
        <InsightBox color="orange">
          <strong>Zero impact:</strong> hashtags ↔ viral = <strong>0.00</strong>
        </InsightBox>
      </div>
    </div>
  );
}

// ── TAB 2 — MEDIA & CATEGORY ──────────────────────────────────────────────────
const lollipopData = [
  { media: "Reel", count: 4200, color: COLORS.viral },
  { media: "Image", count: 2100, color: COLORS.high },
  { media: "Carousel", count: 1200, color: COLORS.medium },
];

const treemapData = [
  { name: "Dance", size: 621 },
  { name: "Comedy", size: 589 },
  { name: "Fashion", size: 554 },
  { name: "Beauty", size: 521 },
  { name: "Food", size: 498 },
  { name: "Travel", size: 467 },
  { name: "Fitness", size: 445 },
  { name: "Education", size: 412 },
];

const TREEMAP_COLORS = [
  "#4ade80",
  "#60a5fa",
  "#fbbf24",
  "#a78bfa",
  "#f97316",
  "#f87171",
  "#22d3ee",
  "#818cf8",
];

interface TreemapPayload {
  x: number;
  y: number;
  width: number;
  height: number;
  index: number;
  name: string;
  size: number;
}

function CustomTreemapContent(props: Partial<TreemapPayload>) {
  const {
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    index = 0,
    name = "",
    size = 0,
  } = props;
  const color = TREEMAP_COLORS[index % TREEMAP_COLORS.length];
  if (width < 30 || height < 20) return null;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color}
        fillOpacity={0.25}
        stroke="rgba(4,6,15,0.8)"
        strokeWidth={2}
        rx={4}
      />
      {width > 50 && height > 30 && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - 6}
            textAnchor="middle"
            fill="#f7fafc"
            fontSize={11}
            fontWeight={600}
            fontFamily="Inter,sans-serif"
          >
            {name}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 10}
            textAnchor="middle"
            fill={color}
            fontSize={10}
            fontFamily="Inter,sans-serif"
          >
            {size}
          </text>
        </>
      )}
    </g>
  );
}

const LOLLIPOP_MAX = 5000;
const LOLLIPOP_W = 320;
const LOLLIPOP_H = 260;
const LOLLIPOP_PAD = { top: 20, bottom: 40, left: 50, right: 20 };

function LollipopChart() {
  const innerW = LOLLIPOP_W - LOLLIPOP_PAD.left - LOLLIPOP_PAD.right;
  const innerH = LOLLIPOP_H - LOLLIPOP_PAD.top - LOLLIPOP_PAD.bottom;
  const barW = innerW / lollipopData.length;
  const toY = (v: number) => innerH - (v / LOLLIPOP_MAX) * innerH;

  return (
    <svg
      width={LOLLIPOP_W}
      height={LOLLIPOP_H}
      role="img"
      aria-label="Lollipop chart for viral posts by media type"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Grid lines */}
      {[0, 1000, 2000, 3000, 4000, 5000].map((v) => (
        <g key={v}>
          <line
            x1={LOLLIPOP_PAD.left}
            y1={LOLLIPOP_PAD.top + toY(v)}
            x2={LOLLIPOP_W - LOLLIPOP_PAD.right}
            y2={LOLLIPOP_PAD.top + toY(v)}
            stroke={GRID_COLOR}
            strokeWidth={1}
          />
          <text
            x={LOLLIPOP_PAD.left - 6}
            y={LOLLIPOP_PAD.top + toY(v) + 4}
            textAnchor="end"
            fill={TEXT_MUTED}
            fontSize={9}
          >
            {v === 0 ? "0" : `${v / 1000}k`}
          </text>
        </g>
      ))}
      {/* Lollipops */}
      {lollipopData.map((d, i) => {
        const cx = LOLLIPOP_PAD.left + i * barW + barW / 2;
        const cy = LOLLIPOP_PAD.top + toY(d.count);
        const baseY = LOLLIPOP_PAD.top + innerH;
        return (
          <g key={d.media}>
            <line
              x1={cx}
              y1={baseY}
              x2={cx}
              y2={cy + 9}
              stroke={d.color}
              strokeWidth={2.5}
              strokeOpacity={0.7}
            />
            <circle
              cx={cx}
              cy={cy}
              r={9}
              fill={d.color}
              style={{ filter: `drop-shadow(0 0 6px ${d.color}80)` }}
            />
            <text
              x={cx}
              y={baseY + 16}
              textAnchor="middle"
              fill={TEXT_MUTED}
              fontSize={10}
            >
              {d.media}
            </text>
            <text
              x={cx}
              y={cy - 16}
              textAnchor="middle"
              fill={d.color}
              fontSize={10}
              fontWeight={700}
            >
              {d.count.toLocaleString()}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function MediaCategoryTab() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      <div>
        <SectionTitle>Viral Posts by Media Type</SectionTitle>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <LollipopChart />
        </div>
        <InsightBox color="green">
          <strong>Reels dominate virality</strong> with 4,200 viral posts — 2×
          more than images and 3.5× more than carousels. Short-form video is
          king.
        </InsightBox>
      </div>
      <div>
        <SectionTitle>Avg Engagement by Category</SectionTitle>
        <ResponsiveContainer width="100%" height={280}>
          <Treemap
            data={treemapData}
            dataKey="size"
            aspectRatio={4 / 3}
            content={<CustomTreemapContent />}
          />
        </ResponsiveContainer>
        <InsightBox color="blue">
          <strong>Dance (621)</strong> leads engagement, followed by Comedy and
          Fashion. Entertainment categories consistently outperform educational
          content.
        </InsightBox>
      </div>
    </div>
  );
}

// ── TAB 3 — TIME OF DAY ──────────────────────────────────────────────────────
const radarTimeData = [
  { subject: "Morning", value: 39.8 },
  { subject: "Afternoon", value: 41.2 },
  { subject: "Evening", value: 42.5 },
  { subject: "Night", value: 38.9 },
];

const composedTimeData = [
  { time: "Morning", mean: 0.0398, spread: 0.015, fill: COLORS.high },
  { time: "Afternoon", mean: 0.0412, spread: 0.016, fill: COLORS.viral },
  { time: "Evening", mean: 0.0425, spread: 0.017, fill: COLORS.medium },
  { time: "Night", mean: 0.0389, spread: 0.014, fill: COLORS.low },
];

function TimeOfDayTab() {
  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          marginBottom: 16,
        }}
      >
        {/* Radar chart */}
        <div>
          <SectionTitle>Avg Engagement by Time of Day — Radar</SectionTitle>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart
              data={radarTimeData}
              cx="50%"
              cy="50%"
              outerRadius={100}
            >
              <PolarGrid stroke={GRID_COLOR} />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: TEXT_MUTED, fontSize: 12, fontFamily: "Inter" }}
              />
              <Radar
                name="Engagement"
                dataKey="value"
                stroke={COLORS.viral}
                fill={COLORS.viral}
                fillOpacity={0.25}
                strokeWidth={2}
              />
              <Legend
                wrapperStyle={{ fontSize: 12, color: TEXT_MUTED }}
                iconType="circle"
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(v: number) => [
                  `${v.toFixed(1)}%`,
                  "Avg Engagement",
                ]}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        {/* Composed chart with error bars */}
        <div>
          <SectionTitle>Engagement Mean +/- Spread by Time Slot</SectionTitle>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart
              data={composedTimeData}
              margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={GRID_COLOR}
                vertical={false}
              />
              <XAxis
                dataKey="time"
                tick={{ fill: TEXT_MUTED, fontSize: 11 }}
                axisLine={{ stroke: GRID_COLOR }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: TEXT_MUTED, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => v.toFixed(3)}
                domain={[0, 0.07]}
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(v: number) => [v.toFixed(4), "Engagement"]}
              />
              <Bar dataKey="mean" radius={[4, 4, 0, 0]}>
                {composedTimeData.map((entry) => (
                  <Cell key={entry.time} fill={entry.fill} fillOpacity={0.8} />
                ))}
                <ErrorBar
                  dataKey="spread"
                  width={6}
                  strokeWidth={2}
                  stroke="rgba(255,255,255,0.5)"
                />
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
      <InsightBox color="red">
        <strong>ANOVA result:</strong> p-value = 0.8141 (&gt; 0.05) → Time of
        day does <strong>NOT</strong> significantly affect engagement rate. All
        four time slots look nearly identical — confirmed by both radar chart
        and ANOVA test.
      </InsightBox>
    </div>
  );
}

// ── TAB 4 — HASHTAGS SCATTER ─────────────────────────────────────────────────
const viralPoints = [
  { h: 5, e: 0.072 },
  { h: 7, e: 0.081 },
  { h: 9, e: 0.068 },
  { h: 11, e: 0.075 },
  { h: 6, e: 0.083 },
  { h: 12, e: 0.077 },
  { h: 8, e: 0.058 },
  { h: 14, e: 0.062 },
  { h: 10, e: 0.079 },
  { h: 13, e: 0.071 },
  { h: 15, e: 0.064 },
  { h: 7, e: 0.085 },
];
const highPoints = [
  { h: 3, e: 0.055 },
  { h: 8, e: 0.062 },
  { h: 12, e: 0.048 },
  { h: 16, e: 0.059 },
  { h: 5, e: 0.042 },
  { h: 18, e: 0.051 },
  { h: 9, e: 0.06 },
  { h: 6, e: 0.064 },
  { h: 14, e: 0.045 },
  { h: 11, e: 0.057 },
  { h: 7, e: 0.04 },
  { h: 13, e: 0.053 },
];
const mediumPoints = [
  { h: 2, e: 0.035 },
  { h: 10, e: 0.041 },
  { h: 17, e: 0.028 },
  { h: 6, e: 0.044 },
  { h: 14, e: 0.032 },
  { h: 19, e: 0.038 },
  { h: 4, e: 0.025 },
  { h: 8, e: 0.043 },
  { h: 11, e: 0.03 },
  { h: 20, e: 0.036 },
];
const lowPoints = [
  { h: 1, e: 0.018 },
  { h: 12, e: 0.022 },
  { h: 5, e: 0.014 },
  { h: 18, e: 0.027 },
  { h: 3, e: 0.011 },
  { h: 21, e: 0.019 },
  { h: 9, e: 0.024 },
  { h: 15, e: 0.016 },
  { h: 7, e: 0.012 },
  { h: 20, e: 0.029 },
];

function HashtagsTab() {
  return (
    <div>
      <SectionTitle>
        Cell 11 — Hashtags Count vs Engagement Rate (scatter)
      </SectionTitle>
      <ResponsiveContainer width="100%" height={380}>
        <ScatterChart margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
          <XAxis
            type="number"
            dataKey="h"
            name="Hashtags"
            domain={[0, 21]}
            tick={{ fill: TEXT_MUTED, fontSize: 11 }}
            axisLine={{ stroke: GRID_COLOR }}
            tickLine={false}
            label={{
              value: "Hashtags Count",
              position: "insideBottom",
              offset: -10,
              fill: TEXT_MUTED,
              fontSize: 11,
            }}
          />
          <YAxis
            type="number"
            dataKey="e"
            name="Engagement"
            domain={[0, 0.1]}
            tick={{ fill: TEXT_MUTED, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => v.toFixed(2)}
            label={{
              value: "Engagement Rate",
              angle: -90,
              position: "insideLeft",
              fill: TEXT_MUTED,
              fontSize: 11,
            }}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            cursor={{ strokeDasharray: "3 3", stroke: "rgba(255,255,255,0.1)" }}
            formatter={(v: number, name: string) => [
              name === "Hashtags" ? v : v.toFixed(4),
              name,
            ]}
          />
          <Legend
            wrapperStyle={{ fontSize: 12, color: TEXT_MUTED, paddingTop: 12 }}
            iconType="circle"
          />
          <Scatter
            name="Viral"
            data={viralPoints}
            fill={COLORS.viral}
            fillOpacity={0.65}
          />
          <Scatter
            name="High"
            data={highPoints}
            fill={COLORS.high}
            fillOpacity={0.65}
          />
          <Scatter
            name="Medium"
            data={mediumPoints}
            fill={COLORS.medium}
            fillOpacity={0.65}
          />
          <Scatter
            name="Low"
            data={lowPoints}
            fill={COLORS.low}
            fillOpacity={0.65}
          />
        </ScatterChart>
      </ResponsiveContainer>
      <InsightBox color="orange">
        Completely random scatter — confirms hashtag count has{" "}
        <strong>zero relationship</strong> with virality. Matches the
        correlation of 0.00 from the heatmap. Adding more hashtags does not make
        a post go viral.
      </InsightBox>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function EDAPage() {
  const [activeTab, setActiveTab] = useState("heatmap");

  return (
    <div
      data-ocid="eda.page"
      style={{
        background: DARK_BG,
        minHeight: "100vh",
        padding: "2rem",
        fontFamily: "Inter, sans-serif",
        color: TEXT_LIGHT,
      }}
    >
      {/* Header */}
      <h1
        style={{
          fontSize: "1.6rem",
          fontWeight: 800,
          color: "#f7fafc",
          margin: 0,
          lineHeight: 1.2,
        }}
      >
        Exploratory Data Analysis
      </h1>
      <p
        style={{
          fontSize: "0.8rem",
          color: TEXT_MUTED,
          marginTop: 4,
          marginBottom: 16,
        }}
      >
        Cell 7 — Correlation Heatmap · Cell 11 — 4 Key Visualizations
      </p>
      <hr
        style={{
          borderColor: "rgba(255,255,255,0.06)",
          marginBottom: "1.5rem",
        }}
      />

      {/* Tabs */}
      <div
        role="tablist"
        data-ocid="eda.tab"
        style={{
          display: "flex",
          gap: 6,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 12,
          padding: 4,
          marginBottom: 24,
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            data-ocid={`eda.${tab.id}.tab`}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: "0.45rem 0.75rem",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontSize: "0.82rem",
              fontWeight: activeTab === tab.id ? 600 : 400,
              fontFamily: "Inter, sans-serif",
              background:
                activeTab === tab.id ? "rgba(74,222,128,0.15)" : "transparent",
              color: activeTab === tab.id ? "#4ade80" : TEXT_MUTED,
              transition: "all 0.2s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Panel */}
      <div
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 16,
          padding: "1.5rem",
        }}
      >
        {activeTab === "heatmap" && <CorrelationHeatmap />}
        {activeTab === "media" && <MediaCategoryTab />}
        {activeTab === "time" && <TimeOfDayTab />}
        {activeTab === "hashtags" && <HashtagsTab />}
      </div>
    </div>
  );
}
