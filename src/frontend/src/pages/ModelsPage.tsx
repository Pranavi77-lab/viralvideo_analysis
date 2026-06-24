import React, { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  LabelList,
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ── Shared style helpers ────────────────────────────────────────────────────
const DARK_BG = "#04060f";
const GRID_COLOR = "rgba(255,255,255,0.05)";
const TEXT_MUTED = "#718096";
const TEXT_LIGHT = "#e2e8f0";

const COLORS = {
  viral: "#4ade80",
  high: "#60a5fa",
  medium: "#fbbf24",
  low: "#f87171",
};

// ── Sub-components ──────────────────────────────────────────────────────────

function InsightBox({
  color,
  children,
}: {
  color: "blue" | "green" | "orange" | "red" | "purple";
  children: React.ReactNode;
}) {
  const _map: Record<string, string> = {
    blue: "rgba(96,165,250,0.07) border border-blue-400/20 text-blue-300",
    green: "rgba(74,222,128,0.07) border border-green-400/20 text-green-300",
    orange: "rgba(251,191,36,0.07) border border-yellow-400/20 text-yellow-200",
    red: "rgba(248,113,113,0.07) border border-red-400/20 text-red-300",
    purple:
      "rgba(167,139,250,0.07) border border-purple-400/20 text-purple-300",
  };
  const styles: Record<string, React.CSSProperties> = {
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
        ...styles[color],
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

function MetricCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  accent: string;
}) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 14,
        padding: "1.25rem 1.5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: accent,
          borderRadius: "14px 14px 0 0",
        }}
      />
      <div
        style={{
          fontSize: "0.7rem",
          color: TEXT_MUTED,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: 5,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "1.9rem",
          fontWeight: 800,
          color: "#f7fafc",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: "0.72rem", marginTop: 5, color: accent }}>
        {sub}
      </div>
    </div>
  );
}

// ── TAB 1: Radar Chart ───────────────────────────────────────────────────────

const radarData = [
  { metric: "Accuracy", LR: 51, Logistic: 74.1, RF: 73.9 },
  { metric: "Precision", LR: 49, Logistic: 73, RF: 74 },
  { metric: "Recall", LR: 51, Logistic: 70, RF: 72 },
  { metric: "F1-Score", LR: 50, Logistic: 71, RF: 73 },
  { metric: "Interpretability", LR: 90, Logistic: 80, RF: 50 },
];

function ModelRadarChart() {
  return (
    <div>
      <div
        style={{
          fontSize: "0.95rem",
          fontWeight: 600,
          color: "#f7fafc",
          marginBottom: "1rem",
          paddingBottom: 8,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        Model capability comparison — Radar chart
      </div>
      <ResponsiveContainer width="100%" height={380}>
        <RadarChart data={radarData} cx="50%" cy="50%" outerRadius={130}>
          <PolarGrid stroke={GRID_COLOR} />
          <PolarAngleAxis
            dataKey="metric"
            tick={{ fill: TEXT_MUTED, fontSize: 12, fontFamily: "Inter" }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: TEXT_MUTED, fontSize: 10 }}
            axisLine={false}
          />
          <Radar
            name="Linear Regression"
            dataKey="LR"
            stroke={COLORS.medium}
            fill={COLORS.medium}
            fillOpacity={0.1}
            strokeWidth={2}
          />
          <Radar
            name="Logistic Regression"
            dataKey="Logistic"
            stroke={COLORS.high}
            fill={COLORS.high}
            fillOpacity={0.1}
            strokeWidth={2}
          />
          <Radar
            name="Random Forest"
            dataKey="RF"
            stroke={COLORS.viral}
            fill={COLORS.viral}
            fillOpacity={0.1}
            strokeWidth={2}
          />
          <Legend
            iconType="circle"
            wrapperStyle={{
              fontSize: 12,
              color: TEXT_MUTED,
              paddingTop: 12,
              fontFamily: "Inter",
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 12,
          marginTop: 8,
        }}
      >
        <InsightBox color="orange">
          <strong>Linear Regression</strong> — R²=0.2623. Low predictive power
          for virality classification. Very high interpretability from
          coefficients.
        </InsightBox>
        <InsightBox color="blue">
          <strong>Logistic Regression</strong> — 74.1% accuracy. Balanced
          precision/recall. Good baseline classifier with interpretable
          probability outputs.
        </InsightBox>
        <InsightBox color="green">
          <strong>Random Forest</strong> — 73.9% accuracy. Ensemble of 100
          trees. Lower interpretability but captures non-linear patterns better.
        </InsightBox>
      </div>
    </div>
  );
}

// ── TAB 2: Waffle Chart + Confusion Matrix ───────────────────────────────────

const FEATURE_COLORS: Record<string, string> = {
  likes: "#4ade80",
  saves: "#60a5fa",
  caption_length: "#a78bfa",
  shares: "#fbbf24",
  comments: "#f97316",
  hashtags: "#94a3b8",
  has_cta: "#f87171",
};

// Raw importances (sum=102), normalize to 100 squares
const RAW_FI = [
  { key: "likes", label: "Likes", raw: 25 },
  { key: "saves", label: "Saves", raw: 18 },
  { key: "caption_length", label: "Caption Length", raw: 17 },
  { key: "shares", label: "Shares", raw: 15 },
  { key: "comments", label: "Comments", raw: 13 },
  { key: "hashtags", label: "Hashtags", raw: 10 },
  { key: "has_cta", label: "Has CTA", raw: 4 },
];

const TOTAL_RAW = RAW_FI.reduce((s, f) => s + f.raw, 0);
const WAFFLE_FEATURES = RAW_FI.map((f) => ({
  ...f,
  squares: Math.round((f.raw / TOTAL_RAW) * 100),
}));
// Ensure exactly 100
const squareSum = WAFFLE_FEATURES.reduce((s, f) => s + f.squares, 0);
if (squareSum !== 100) WAFFLE_FEATURES[0].squares += 100 - squareSum;

// Build flat array of 100 colored squares
const waffleSquares: { color: string; idx: number }[] = [];
for (const f of WAFFLE_FEATURES) {
  for (let i = 0; i < f.squares; i++)
    waffleSquares.push({
      color: FEATURE_COLORS[f.key],
      idx: waffleSquares.length,
    });
}

const confusionMatrix = [
  [4083, 1366],
  [421, 1130],
];

const cmMax = Math.max(...confusionMatrix.flat());

function WaffleAndConfusion() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      {/* Waffle Chart */}
      <div>
        <div
          style={{
            fontSize: "0.95rem",
            fontWeight: 600,
            color: "#f7fafc",
            marginBottom: "1rem",
            paddingBottom: 8,
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          Feature Importance — Waffle Chart (100 squares = 100%)
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(10, 19px)",
            gridTemplateRows: "repeat(10, 19px)",
            gap: 2,
            marginBottom: 20,
          }}
          aria-label="Feature importance waffle chart"
        >
          {waffleSquares.map((sq) => (
            <div
              key={`sq-${sq.idx}`}
              style={{
                width: 19,
                height: 19,
                background: sq.color,
                borderRadius: 3,
                opacity: 0.88,
              }}
            />
          ))}
        </div>
        {/* Legend */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px" }}>
          {WAFFLE_FEATURES.map((f) => (
            <div
              key={f.key}
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  background: FEATURE_COLORS[f.key],
                  borderRadius: 2,
                }}
              />
              <span style={{ fontSize: "0.75rem", color: TEXT_MUTED }}>
                {f.label}{" "}
                <span style={{ color: FEATURE_COLORS[f.key], fontWeight: 600 }}>
                  {f.squares}%
                </span>
              </span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16 }}>
          <InsightBox color="green">
            <strong>Saves beat Shares!</strong> Saves rank 2nd (18%) above
            Shares (15%) in feature importance. Bookmarking signals stronger
            content interest than re-sharing.
          </InsightBox>
          <InsightBox color="orange">
            <strong>Hashtags at 10%</strong> — despite 0.00 correlation, the RF
            model found minor non-linear importance. Has CTA is the weakest
            feature at just 4%.
          </InsightBox>
        </div>
      </div>
      {/* Confusion Matrix */}
      <div>
        <div
          style={{
            fontSize: "0.95rem",
            fontWeight: 600,
            color: "#f7fafc",
            marginBottom: "1rem",
            paddingBottom: 8,
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          Confusion Matrix — Random Forest
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr 1fr",
            gap: 4,
          }}
        >
          <div />
          <div
            style={{
              textAlign: "center",
              fontSize: "0.72rem",
              color: TEXT_MUTED,
              paddingBottom: 6,
            }}
          >
            Predicted: Not Viral
          </div>
          <div
            style={{
              textAlign: "center",
              fontSize: "0.72rem",
              color: TEXT_MUTED,
              paddingBottom: 6,
            }}
          >
            Predicted: Viral
          </div>
          {confusionMatrix.map((row, ri) => (
            <React.Fragment key={ri === 0 ? "cm-actual-neg" : "cm-actual-pos"}>
              <div
                style={{
                  fontSize: "0.72rem",
                  color: TEXT_MUTED,
                  display: "flex",
                  alignItems: "center",
                  paddingRight: 8,
                  writingMode: "horizontal-tb",
                }}
              >
                Actual: {ri === 0 ? "Not Viral" : "Viral"}
              </div>
              {row.map((val, ci) => {
                const intensity = val / cmMax;
                const isCorrect = ri === ci;
                return (
                  <div
                    key={`cm-${ri === 0 ? "neg" : "pos"}-${ci === 0 ? "neg" : "pos"}`}
                    style={{
                      background: isCorrect
                        ? `rgba(74,222,128,${0.05 + intensity * 0.4})`
                        : `rgba(248,113,113,${0.05 + intensity * 0.3})`,
                      border: isCorrect
                        ? "1px solid rgba(74,222,128,0.3)"
                        : "1px solid rgba(248,113,113,0.2)",
                      borderRadius: 8,
                      padding: "2rem 1rem",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "1.8rem",
                        fontWeight: 800,
                        color: isCorrect ? "#4ade80" : "#f87171",
                        lineHeight: 1,
                      }}
                    >
                      {val.toLocaleString()}
                    </div>
                    <div
                      style={{
                        fontSize: "0.65rem",
                        color: TEXT_MUTED,
                        marginTop: 4,
                      }}
                    >
                      {isCorrect ? "Correct" : "Error"}
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
        <div
          style={{
            marginTop: 16,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
          }}
        >
          <InsightBox color="green">
            <strong>4,083</strong> not-viral posts correctly identified — strong
            majority class detection.
          </InsightBox>
          <InsightBox color="blue">
            <strong>1,130</strong> viral posts correctly caught out of 1,551
            total viral test posts.
          </InsightBox>
        </div>
      </div>
    </div>
  );
}

// ── TAB 3: Diverging Dot Plot (Lollipop) ─────────────────────────────────────

const lollipopData = [
  { feature: "Likes", coef: 0.4603 },
  { feature: "Shares", coef: 0.2891 },
  { feature: "Saves", coef: 0.2234 },
  { feature: "Comments", coef: 0.1876 },
  { feature: "CTA", coef: 0.0321 },
  { feature: "Hashtags", coef: -0.0187 },
  { feature: "Caption Len", coef: -0.0432 },
].sort((a, b) => a.coef - b.coef);

const CustomLollipopBar = (props: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  value?: number;
}) => {
  const { x = 0, y = 0, height = 0, value = 0 } = props;
  const color = value >= 0 ? "#4ade80" : "#f87171";
  const cx = x + (props.width ?? 0) / 2;
  const cy = value >= 0 ? y : y + height;
  return (
    <g>
      <line
        x1={cx}
        y1={cy}
        x2={cx}
        y2={cy - (value >= 0 ? height : -height)}
        stroke={color}
        strokeWidth={3}
        strokeOpacity={0.6}
      />
      <circle
        cx={cx}
        cy={y + (value >= 0 ? 0 : height)}
        r={7}
        fill={color}
        stroke={color}
        strokeWidth={2}
      />
    </g>
  );
};

function LollipopChart() {
  return (
    <div>
      <div
        style={{
          fontSize: "0.95rem",
          fontWeight: 600,
          color: "#f7fafc",
          marginBottom: "1rem",
          paddingBottom: 8,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        Feature Coefficients — Diverging Dot Plot
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div>
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart
              data={lollipopData}
              margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid stroke={GRID_COLOR} vertical={false} />
              <XAxis
                dataKey="feature"
                tick={{ fill: TEXT_MUTED, fontSize: 11, fontFamily: "Inter" }}
                axisLine={{ stroke: GRID_COLOR }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: TEXT_MUTED, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => v.toFixed(2)}
              />
              <Tooltip
                contentStyle={{
                  background: "#0d1117",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  color: TEXT_LIGHT,
                  fontSize: 12,
                }}
                formatter={(val: number) => [val.toFixed(4), "Coefficient"]}
              />
              <ReferenceLine
                y={0}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth={1.5}
              />
              <Bar
                dataKey="coef"
                shape={<CustomLollipopBar />}
                isAnimationActive={true}
              >
                {lollipopData.map((entry) => (
                  <Cell
                    key={`cell-${entry.feature}`}
                    fill={entry.coef >= 0 ? "#4ade80" : "#f87171"}
                  />
                ))}
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div>
          <InsightBox color="green">
            <strong>Likes coefficient: +0.4603</strong> — the dominant positive
            driver. Each unit increase in likes contributes the most to
            predicted engagement rate.
          </InsightBox>
          <InsightBox color="blue">
            <strong>Shares (+0.2891) and Saves (+0.2234)</strong> — both
            positive contributors. Sharing behavior shows strong correlation
            with engagement rate outcomes.
          </InsightBox>
          <InsightBox color="red">
            <strong>Caption Length (-0.0432) and Hashtags (-0.0187)</strong> —
            slight negative coefficients. Longer captions and more hashtags
            marginally reduce predicted engagement rate in this linear model.
          </InsightBox>
          <InsightBox color="orange">
            <strong>R² = 0.2623</strong> — the model explains 26% of variance in
            engagement rate. Low R² means engagement depends on complex
            non-linear patterns that linear regression can't fully capture.
          </InsightBox>
        </div>
      </div>
    </div>
  );
}

// ── TAB 4: Logistic Regression ────────────────────────────────────────────────

const classMetrics = [
  { class: "Class 0\n(Not Viral)", precision: 0.76, recall: 0.78, f1: 0.77 },
  { class: "Class 1\n(Viral)", precision: 0.7, recall: 0.67, f1: 0.68 },
];

const reportData = [
  {
    Class: "Not Viral (0)",
    Precision: "0.76",
    Recall: "0.78",
    "F1-score": "0.77",
    Support: "5449",
  },
  {
    Class: "Viral (1)",
    Precision: "0.70",
    Recall: "0.67",
    "F1-score": "0.68",
    Support: "1551",
  },
  {
    Class: "Accuracy",
    Precision: "",
    Recall: "",
    "F1-score": "74.1%",
    Support: "6000",
  },
  {
    Class: "Macro avg",
    Precision: "0.73",
    Recall: "0.72",
    "F1-score": "0.73",
    Support: "6000",
  },
  {
    Class: "Weighted avg",
    Precision: "0.74",
    Recall: "0.74",
    "F1-score": "0.74",
    Support: "6000",
  },
];

const tableHeaders = ["Class", "Precision", "Recall", "F1-score", "Support"];

function LogisticTab() {
  return (
    <div>
      <div
        style={{
          fontSize: "0.95rem",
          fontWeight: 600,
          color: "#f7fafc",
          marginBottom: "1rem",
          paddingBottom: 8,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        Logistic Regression — Classification Report
      </div>
      {/* Table */}
      <div style={{ overflowX: "auto", marginBottom: 24 }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: 0,
            fontSize: "0.85rem",
          }}
        >
          <thead>
            <tr>
              {tableHeaders.map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: h === "Class" ? "left" : "center",
                    padding: "10px 14px",
                    fontSize: "0.72rem",
                    color: TEXT_MUTED,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    background: "rgba(255,255,255,0.02)",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reportData.map((row) => (
              <tr
                key={row.Class}
                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
              >
                {tableHeaders.map((h) => {
                  const key = h as keyof typeof row;
                  const val = row[key];
                  const isAccuracyRow = row.Class === "Accuracy";
                  return (
                    <td
                      key={h}
                      style={{
                        padding: "10px 14px",
                        textAlign: h === "Class" ? "left" : "center",
                        color:
                          h === "Class"
                            ? isAccuracyRow
                              ? "#4ade80"
                              : TEXT_LIGHT
                            : h === "Precision"
                              ? "#60a5fa"
                              : h === "Recall"
                                ? "#fbbf24"
                                : h === "F1-score"
                                  ? "#a78bfa"
                                  : TEXT_MUTED,
                        fontWeight: h === "F1-score" ? 600 : 400,
                        background: isAccuracyRow
                          ? "rgba(74,222,128,0.04)"
                          : "transparent",
                      }}
                    >
                      {val}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Grouped Bar Chart */}
      <div
        style={{
          fontSize: "0.95rem",
          fontWeight: 600,
          color: "#f7fafc",
          marginBottom: "1rem",
          paddingBottom: 8,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        Precision vs Recall vs F1-Score by Class
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={classMetrics}
          margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
          barGap={4}
          barCategoryGap="30%"
        >
          <CartesianGrid stroke={GRID_COLOR} vertical={false} />
          <XAxis
            dataKey="class"
            tick={{ fill: TEXT_MUTED, fontSize: 11, fontFamily: "Inter" }}
            axisLine={{ stroke: GRID_COLOR }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 1]}
            tick={{ fill: TEXT_MUTED, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => v.toFixed(1)}
          />
          <Tooltip
            contentStyle={{
              background: "#0d1117",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              color: TEXT_LIGHT,
              fontSize: 12,
            }}
            formatter={(val: number) => [val.toFixed(2)]}
          />
          <Legend
            wrapperStyle={{
              fontSize: 12,
              color: TEXT_MUTED,
              fontFamily: "Inter",
            }}
            iconType="circle"
          />
          <Bar
            dataKey="precision"
            name="Precision"
            fill="#60a5fa"
            radius={[4, 4, 0, 0]}
          >
            <LabelList
              dataKey="precision"
              position="top"
              style={{ fill: "#60a5fa", fontSize: 10 }}
              formatter={(v: number) => v.toFixed(2)}
            />
          </Bar>
          <Bar
            dataKey="recall"
            name="Recall"
            fill="#fbbf24"
            radius={[4, 4, 0, 0]}
          >
            <LabelList
              dataKey="recall"
              position="top"
              style={{ fill: "#fbbf24", fontSize: 10 }}
              formatter={(v: number) => v.toFixed(2)}
            />
          </Bar>
          <Bar
            dataKey="f1"
            name="F1-Score"
            fill="#a78bfa"
            radius={[4, 4, 0, 0]}
          >
            <LabelList
              dataKey="f1"
              position="top"
              style={{ fill: "#a78bfa", fontSize: 10 }}
              formatter={(v: number) => v.toFixed(2)}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div style={{ marginTop: 16 }}>
        <InsightBox color="blue">
          <strong>Logistic Regression accuracy: 74.1%</strong> — correctly
          predicts virality 74.1% of the time. Uses a sigmoid function to output
          a probability between 0 and 1.
        </InsightBox>
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────

const TABS = [
  { id: "comparison", label: "Comparison" },
  { id: "random_forest", label: "Random Forest" },
  { id: "linear_reg", label: "Linear Regression" },
  { id: "logistic_reg", label: "Logistic Regression" },
];

export default function ModelsPage() {
  const [activeTab, setActiveTab] = useState("comparison");

  return (
    <div
      data-ocid="models.page"
      style={{
        background: DARK_BG,
        minHeight: "100vh",
        padding: "2rem",
        fontFamily: "Inter, sans-serif",
        color: TEXT_LIGHT,
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1
          style={{
            fontSize: "1.6rem",
            fontWeight: 800,
            color: "#f7fafc",
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          Machine Learning Models
        </h1>
        <p style={{ fontSize: "0.8rem", color: TEXT_MUTED, marginTop: 4 }}>
          Cell 9 — Linear Regression · Cell 10 — Logistic Regression · Cell 12 —
          Random Forest · Cell 13 — Feature Importance
        </p>
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            marginTop: 12,
          }}
        />
      </div>

      {/* Metric cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 14,
          marginBottom: 24,
        }}
      >
        <MetricCard
          label="Linear Regression R²"
          value="0.2623"
          sub="26% variance explained"
          accent="linear-gradient(135deg,#fbbf24,#f59e0b)"
        />
        <MetricCard
          label="Logistic Regression"
          value="74.1%"
          sub="Classification accuracy"
          accent="linear-gradient(135deg,#60a5fa,#3b82f6)"
        />
        <MetricCard
          label="Random Forest"
          value="73.9%"
          sub="Best model · 100 trees"
          accent="linear-gradient(135deg,#4ade80,#22c55e)"
        />
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 6,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 12,
          padding: 4,
          marginBottom: 24,
        }}
        role="tablist"
        data-ocid="models.tab"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            data-ocid={`models.${tab.id}.tab`}
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

      {/* Tab panels */}
      <div
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 16,
          padding: "1.5rem",
        }}
      >
        {activeTab === "comparison" && <ModelRadarChart />}
        {activeTab === "random_forest" && <WaffleAndConfusion />}
        {activeTab === "linear_reg" && <LollipopChart />}
        {activeTab === "logistic_reg" && <LogisticTab />}
      </div>
    </div>
  );
}
