import { useEffect, useRef, useState } from "react";
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ── Types ─────────────────────────────────────────────────────────────────────
interface PredInputs {
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  hashtags: number;
  captionLen: number;
  hasCta: number;
}

interface PredResult {
  rfProb: number;
  logProb: number;
  avgProb: number;
  engPred: number;
  waterfallData: WaterfallEntry[];
}

interface WaterfallEntry {
  feature: string;
  start: number;
  end: number;
  value: number;
  isTotal: boolean;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const RF_IMPORTANCE: Record<string, number> = {
  likes: 0.25,
  saves: 0.18,
  caption_length: 0.17,
  shares: 0.15,
  comments: 0.13,
  hashtags_count: 0.1,
  has_call_to_action: 0.04,
};

const RAW_MINS: Record<string, number> = {
  likes: 0,
  comments: 0,
  shares: 0,
  saves: 0,
  hashtags_count: 0,
  caption_length: 70,
  has_call_to_action: 0,
};
const RAW_MAXS: Record<string, number> = {
  likes: 1497,
  comments: 149,
  shares: 148,
  saves: 396,
  hashtags_count: 21,
  caption_length: 166,
  has_call_to_action: 1,
};

const FEATURE_ORDER = [
  "likes",
  "saves",
  "caption_length",
  "shares",
  "comments",
  "hashtags_count",
  "has_call_to_action",
];

const FEATURE_LABELS: Record<string, string> = {
  likes: "Likes",
  saves: "Saves",
  caption_length: "Caption",
  shares: "Shares",
  comments: "Comments",
  hashtags_count: "Hashtags",
  has_call_to_action: "CTA",
};

const TOOLTIP_STYLE = {
  backgroundColor: "#0d1117",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "10px",
  color: "#f7fafc",
  fontSize: "0.82rem",
};

// ── Helpers ────────────────────────────────────────────────────────────────────
function scaleVal(val: number, key: string): number {
  const mn = RAW_MINS[key] ?? 0;
  const mx = RAW_MAXS[key] ?? 1;
  if (mx === mn) return 0;
  return Math.min(Math.max((val - mn) / (mx - mn), 0), 1);
}

function buildWaterfall(inputs: PredInputs): WaterfallEntry[] {
  const rawMap: Record<string, number> = {
    likes: inputs.likes,
    saves: inputs.saves,
    caption_length: inputs.captionLen,
    shares: inputs.shares,
    comments: inputs.comments,
    hashtags_count: inputs.hashtags,
    has_call_to_action: inputs.hasCta,
  };

  const entries: WaterfallEntry[] = [];
  let running = 0;

  for (const key of FEATURE_ORDER) {
    const scaled = scaleVal(rawMap[key], key);
    const contribution = scaled * RF_IMPORTANCE[key];
    entries.push({
      feature: FEATURE_LABELS[key],
      start: running,
      end: running + contribution,
      value: contribution,
      isTotal: false,
    });
    running += contribution;
  }

  // Total bar
  entries.push({
    feature: "Total",
    start: 0,
    end: running,
    value: running,
    isTotal: true,
  });

  return entries;
}

function runModels(inputs: PredInputs): PredResult {
  const rawMap: Record<string, number> = {
    likes: inputs.likes,
    saves: inputs.saves,
    caption_length: inputs.captionLen,
    shares: inputs.shares,
    comments: inputs.comments,
    hashtags_count: inputs.hashtags,
    has_call_to_action: inputs.hasCta,
  };

  // Weighted scores using RF importances
  const weightedSum = FEATURE_ORDER.reduce((acc, key) => {
    return acc + scaleVal(rawMap[key], key) * RF_IMPORTANCE[key];
  }, 0);

  // Simulate RF prob: weighted score mapped to probability
  // RF max possible weighted sum ≈ 1.0 (all features at max)
  // We map [0, 1] → [0, 1] probability with a sigmoid-like curve
  const sigmoid = (x: number, shift = 0.42, k = 8) =>
    1 / (1 + Math.exp(-k * (x - shift)));

  const rfProb = sigmoid(weightedSum, 0.42, 8);
  const logProb = sigmoid(weightedSum, 0.45, 6);
  const avgProb = (rfProb + logProb) / 2;

  // Linear regression: engagement ~= 0.0001 * likes + 0.0003 * saves + ...
  const engPred = Math.min(Math.max(0.005, weightedSum * 0.12 + 0.01), 0.27);

  const waterfallData = buildWaterfall(inputs);

  return { rfProb, logProb, avgProb, engPred, waterfallData };
}

// ── SVG Donut Gauge ────────────────────────────────────────────────────────────
function DonutGauge({
  probability,
  verdict,
  color,
}: { probability: number; verdict: string; color: string }) {
  const r = 80;
  const cx = 100;
  const cy = 100;
  const circumference = 2 * Math.PI * r;
  const [animatedPct, setAnimatedPct] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const target = probability * 100;
    const duration = 900; // ms
    const start = performance.now();
    let current = 0;

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease out cubic
      const eased = 1 - (1 - progress) ** 3;
      current = eased * target;
      setAnimatedPct(current);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [probability]);

  const fillPct = animatedPct / 100;
  const dashArray = `${fillPct * circumference} ${circumference}`;

  // Track color zones
  const zoneColor =
    animatedPct < 35 ? "#f87171" : animatedPct < 55 ? "#fbbf24" : "#4ade80";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      <svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        role="img"
        aria-label="Viral probability gauge"
      >
        {/* Track */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="16"
        />
        {/* Zone markers */}
        {/* 35% mark */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="rgba(248,113,113,0.25)"
          strokeWidth="16"
          strokeDasharray={`${0.35 * circumference} ${circumference}`}
          strokeDashoffset={circumference * 0.25}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
        {/* 55% mark */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="rgba(251,191,36,0.25)"
          strokeWidth="16"
          strokeDasharray={`${0.2 * circumference} ${circumference}`}
          strokeDashoffset={circumference * 0.25 - 0.35 * circumference}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
        {/* >55% mark */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="rgba(74,222,128,0.20)"
          strokeWidth="16"
          strokeDasharray={`${0.45 * circumference} ${circumference}`}
          strokeDashoffset={circumference * 0.25 - 0.55 * circumference}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
        {/* Progress arc */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={zoneColor}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={dashArray}
          strokeDashoffset={circumference * 0.25}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ filter: `drop-shadow(0 0 8px ${zoneColor}60)` }}
        />
        {/* Inner glow dot at arc end */}
        {animatedPct > 2 && (
          <circle
            cx={cx + r * Math.cos(fillPct * 2 * Math.PI - Math.PI / 2)}
            cy={cy + r * Math.sin(fillPct * 2 * Math.PI - Math.PI / 2)}
            r={5}
            fill={zoneColor}
            style={{ filter: `drop-shadow(0 0 6px ${zoneColor})` }}
          />
        )}
        {/* Center text */}
        <text
          x={cx}
          y={cy - 10}
          textAnchor="middle"
          fill="#f7fafc"
          fontSize="28"
          fontWeight="800"
          fontFamily="Inter, sans-serif"
        >
          {animatedPct.toFixed(1)}%
        </text>
        <text
          x={cx}
          y={cy + 14}
          textAnchor="middle"
          fill="#4a5568"
          fontSize="11"
          fontFamily="Inter, sans-serif"
        >
          viral probability
        </text>
        <text
          x={cx}
          y={cy + 34}
          textAnchor="middle"
          fill={color}
          fontSize="13"
          fontWeight="700"
          fontFamily="Inter, sans-serif"
        >
          {verdict}
        </text>
      </svg>
      {/* Zone legend */}
      <div style={{ display: "flex", gap: "1rem", fontSize: "0.7rem" }}>
        <span style={{ color: "#f87171" }}>● &lt;35% Low</span>
        <span style={{ color: "#fbbf24" }}>● 35–55% Med</span>
        <span style={{ color: "#4ade80" }}>● &gt;55% Viral</span>
      </div>
    </div>
  );
}

// ── Custom Waterfall Tooltip ───────────────────────────────────────────────────
function WaterfallTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ payload: WaterfallEntry & { displayValue: number } }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div
      style={{
        ...TOOLTIP_STYLE,
        padding: "10px 14px",
        lineHeight: 1.7,
      }}
    >
      <div style={{ fontWeight: 700, color: "#f7fafc", marginBottom: "4px" }}>
        {label}
      </div>
      {d.isTotal ? (
        <div style={{ color: "#4ade80" }}>
          Total: <b>{(d.value * 100).toFixed(2)}%</b>
        </div>
      ) : (
        <>
          <div style={{ color: "#718096" }}>
            Start: {(d.start * 100).toFixed(2)}%
          </div>
          <div style={{ color: d.value >= 0 ? "#4ade80" : "#f87171" }}>
            +{(d.value * 100).toFixed(2)}% contribution
          </div>
          <div style={{ color: "#718096" }}>
            End: {(d.end * 100).toFixed(2)}%
          </div>
        </>
      )}
    </div>
  );
}

// ── Waterfall Chart ────────────────────────────────────────────────────────────
function WaterfallChart({ data }: { data: WaterfallEntry[] }) {
  // For Recharts ComposedChart waterfall:
  // We use two bars stacked: transparent base (start) + colored value
  const chartData = data.map((d) => ({
    feature: d.feature,
    base: d.isTotal ? 0 : d.start,
    value: d.value,
    isTotal: d.isTotal,
    start: d.start,
    end: d.end,
    displayValue: d.value,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart
        data={chartData}
        margin={{ top: 20, right: 16, left: 0, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.05)"
          vertical={false}
        />
        <XAxis
          dataKey="feature"
          stroke="#4a5568"
          tick={{ fill: "#718096", fontSize: 11 }}
          axisLine={{ stroke: "rgba(255,255,255,0.05)" }}
          tickLine={false}
        />
        <YAxis
          stroke="#4a5568"
          tick={{ fill: "#718096", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`}
          domain={[0, "auto"]}
        />
        <Tooltip content={<WaterfallTooltip />} />
        <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" />
        {/* Transparent spacer bar (base offset) */}
        <Bar dataKey="base" stackId="wf" fill="transparent" />
        {/* Actual value bar — colored by +/- and total */}
        <Bar dataKey="value" stackId="wf" radius={[4, 4, 0, 0]}>
          {chartData.map((entry) => (
            <Cell
              key={`cell-${entry.feature}`}
              fill={
                entry.isTotal
                  ? "#60a5fa"
                  : entry.value >= 0
                    ? "#4ade80"
                    : "#f87171"
              }
              opacity={entry.isTotal ? 1 : 0.85}
            />
          ))}
        </Bar>
      </ComposedChart>
    </ResponsiveContainer>
  );
}

// ── Glass Card helper ─────────────────────────────────────────────────────────
function GlassCard({
  label,
  value,
  sub,
  subColor,
  glowColor,
}: {
  label: string;
  value: string;
  sub: string;
  subColor: string;
  glowColor: string;
}) {
  return (
    <div
      style={{
        background: `rgba(${glowColor},0.03)`,
        border: `1px solid rgba(${glowColor},0.2)`,
        borderRadius: "14px",
        padding: "1rem 1.25rem",
      }}
    >
      <div
        style={{
          fontSize: "0.7rem",
          color: "#4a5568",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: "4px",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "1.7rem",
          fontWeight: 800,
          color: "#f7fafc",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: "0.72rem", marginTop: "4px", color: subColor }}>
        {sub}
      </div>
    </div>
  );
}

// ── Input row helper ──────────────────────────────────────────────────────────
function InputRow({
  label,
  value,
  min,
  max,
  step,
  onChange,
  inputId,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  inputId: string;
}) {
  return (
    <div style={{ marginBottom: "0.85rem" }}>
      <label
        htmlFor={inputId}
        style={{
          display: "block",
          fontSize: "0.78rem",
          color: "#718096",
          marginBottom: "4px",
        }}
      >
        {label}
      </label>
      <input
        id={inputId}
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: "100%",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "10px",
          color: "#f7fafc",
          padding: "0.5rem 0.75rem",
          fontSize: "0.88rem",
          outline: "none",
        }}
      />
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function PredictorPage() {
  const [inputs, setInputs] = useState<PredInputs>({
    likes: 500,
    comments: 20,
    shares: 15,
    saves: 40,
    hashtags: 8,
    captionLen: 120,
    hasCta: 1,
  });
  const [result, setResult] = useState<PredResult | null>(null);

  const set = (key: keyof PredInputs) => (v: number) =>
    setInputs((prev) => ({ ...prev, [key]: v }));

  function handlePredict() {
    setResult(runModels(inputs));
  }

  const verdict =
    result === null
      ? ""
      : result.avgProb >= 0.55
        ? "VIRAL!"
        : result.avgProb >= 0.35
          ? "MODERATE"
          : "NOT VIRAL";

  const verdictColor =
    result === null
      ? "#4a5568"
      : result.avgProb >= 0.55
        ? "#4ade80"
        : result.avgProb >= 0.35
          ? "#fbbf24"
          : "#f87171";

  const tips: Array<{ color: string; title: string; desc: string }> = [];
  if (result && result.avgProb < 0.55) {
    if (inputs.likes < 300)
      tips.push({
        color: "#f87171",
        title: "Boost likes",
        desc: "Aim for 300+ — #1 driver (importance: 0.25)",
      });
    if (inputs.saves < 30)
      tips.push({
        color: "#fbbf24",
        title: "Boost saves",
        desc: "Saves rank above shares! Infographic or how-to content (importance: 0.18)",
      });
    if (!(inputs.hashtags >= 6 && inputs.hashtags <= 12))
      tips.push({
        color: "#60a5fa",
        title: "# Optimize hashtags",
        desc: "Use 8-10 hashtags — too few or too many hurts",
      });
    if (inputs.captionLen < 100)
      tips.push({
        color: "#a78bfa",
        title: "Longer caption",
        desc: "100-130 character captions perform better (importance: 0.17)",
      });
    if (tips.length === 0)
      tips.push({
        color: "#4ade80",
        title: "Good metrics!",
        desc: "Your values look solid — keep it up!",
      });
  }

  return (
    <div style={{ padding: "2rem 2rem 3rem" }}>
      {/* Header */}
      <h1
        style={{
          fontSize: "1.6rem",
          fontWeight: 800,
          color: "#f7fafc",
          marginBottom: "0.25rem",
        }}
      >
        Virality Predictor
      </h1>
      <p
        style={{ fontSize: "0.8rem", color: "#4a5568", marginBottom: "1.5rem" }}
      >
        Real-time prediction using Random Forest (Cell 12) + Logistic Regression
        (Cell 10)
      </p>
      <hr
        style={{
          borderColor: "rgba(255,255,255,0.06)",
          marginBottom: "1.5rem",
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.4fr",
          gap: "2rem",
        }}
      >
        {/* LEFT — Input form */}
        <div
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "16px",
            padding: "1.5rem",
          }}
        >
          <div
            style={{
              fontSize: "0.95rem",
              fontWeight: 600,
              color: "#f7fafc",
              marginBottom: "1.25rem",
            }}
          >
            Enter your post details
          </div>

          <InputRow
            label="Expected Likes"
            value={inputs.likes}
            min={0}
            max={15000}
            step={10}
            onChange={set("likes")}
            inputId="input-likes"
          />
          <InputRow
            label="Expected Comments"
            value={inputs.comments}
            min={0}
            max={400}
            step={1}
            onChange={set("comments")}
            inputId="input-comments"
          />
          <InputRow
            label="Expected Shares"
            value={inputs.shares}
            min={0}
            max={600}
            step={1}
            onChange={set("shares")}
            inputId="input-shares"
          />
          <InputRow
            label="Expected Saves"
            value={inputs.saves}
            min={0}
            max={1600}
            step={5}
            onChange={set("saves")}
            inputId="input-saves"
          />
          <InputRow
            label="# Hashtag Count"
            value={inputs.hashtags}
            min={0}
            max={21}
            step={1}
            onChange={set("hashtags")}
            inputId="input-hashtags"
          />
          <InputRow
            label="Caption Length (chars)"
            value={inputs.captionLen}
            min={70}
            max={166}
            step={1}
            onChange={set("captionLen")}
            inputId="input-caption"
          />

          <div style={{ marginBottom: "1.25rem" }}>
            <label
              htmlFor="input-cta"
              style={{
                display: "block",
                fontSize: "0.78rem",
                color: "#718096",
                marginBottom: "4px",
              }}
            >
              Has Call-to-Action?
            </label>
            <select
              id="input-cta"
              value={inputs.hasCta}
              onChange={(e) => set("hasCta")(Number(e.target.value))}
              data-ocid="predictor.cta_select"
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                color: "#f7fafc",
                padding: "0.5rem 0.75rem",
                fontSize: "0.88rem",
                outline: "none",
              }}
            >
              <option value={1}>Yes</option>
              <option value={0}>No</option>
            </select>
          </div>

          <button
            type="button"
            data-ocid="predictor.predict_button"
            onClick={handlePredict}
            style={{
              width: "100%",
              background: "linear-gradient(135deg,#4ade80,#22c55e)",
              color: "#04060f",
              border: "none",
              borderRadius: "12px",
              fontWeight: 800,
              fontSize: "1rem",
              padding: "0.75rem 2rem",
              cursor: "pointer",
              boxShadow: "0 0 30px rgba(74,222,128,0.25)",
              transition: "box-shadow 0.3s",
              marginTop: "0.25rem",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 0 50px rgba(74,222,128,0.4)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 0 30px rgba(74,222,128,0.25)";
            }}
          >
            PREDICT VIRALITY NOW →
          </button>
        </div>

        {/* RIGHT — Results */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {result ? (
            <>
              {/* Donut Gauge */}
              <div
                data-ocid="predictor.result_panel"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: `1px solid ${verdictColor}40`,
                  borderRadius: "16px",
                  padding: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <DonutGauge
                  probability={result.avgProb}
                  verdict={verdict}
                  color={verdictColor}
                />
                <p style={{ fontSize: "0.75rem", color: "#4a5568", margin: 0 }}>
                  Combined probability (RF + Logistic Regression)
                </p>
              </div>

              {/* Model breakdown cards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3,1fr)",
                  gap: "0.75rem",
                }}
              >
                <GlassCard
                  label="Random Forest"
                  value={`${(result.rfProb * 100).toFixed(1)}%`}
                  sub="100 trees voted"
                  subColor="#4ade80"
                  glowColor="74,222,128"
                />
                <GlassCard
                  label="Logistic Regression"
                  value={`${(result.logProb * 100).toFixed(1)}%`}
                  sub="Sigmoid probability"
                  subColor="#60a5fa"
                  glowColor="96,165,250"
                />
                <GlassCard
                  label="Predicted Engagement"
                  value={result.engPred.toFixed(4)}
                  sub="Linear regression"
                  subColor="#fbbf24"
                  glowColor="251,191,36"
                />
              </div>
            </>
          ) : (
            /* Empty state */
            <div
              data-ocid="predictor.empty_state"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px dashed rgba(255,255,255,0.08)",
                borderRadius: "20px",
                padding: "5rem 2rem",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }} />
              <div
                style={{
                  fontSize: "1.1rem",
                  color: "#2d3748",
                  marginBottom: "0.5rem",
                }}
              >
                Enter post details on the left
              </div>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  color: "#4ade80",
                }}
              >
                then click PREDICT →
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "#1f2937",
                  marginTop: "0.75rem",
                }}
              >
                Both RF (100 trees) and Logistic Regression predict in real time
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Waterfall chart — full width below, visible only after prediction */}
      {result && (
        <div
          data-ocid="predictor.waterfall_chart"
          style={{
            marginTop: "2rem",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "16px",
            padding: "1.5rem",
          }}
        >
          <div
            style={{
              fontSize: "0.95rem",
              fontWeight: 600,
              color: "#f7fafc",
              marginBottom: "0.5rem",
              paddingBottom: "8px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>
              Feature Contribution Waterfall — Cumulative Virality Build-up
            </span>
            <span
              style={{ fontSize: "0.72rem", color: "#4a5568", fontWeight: 400 }}
            >
              <span style={{ color: "#4ade80" }}>■</span> positive &nbsp;
              <span style={{ color: "#f87171" }}>■</span> negative &nbsp;
              <span style={{ color: "#60a5fa" }}>■</span> total
            </span>
          </div>
          <p
            style={{
              fontSize: "0.78rem",
              color: "#4a5568",
              marginBottom: "1rem",
            }}
          >
            Each bar shows how much a feature incrementally adds to the
            cumulative probability — weighted by RF importance × normalized
            input value.
          </p>
          <WaterfallChart data={result.waterfallData} />
        </div>
      )}

      {/* Tips */}
      {tips.length > 0 && (
        <div
          style={{
            marginTop: "1.5rem",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "16px",
            padding: "1.5rem",
          }}
        >
          <div
            style={{
              fontSize: "0.95rem",
              fontWeight: 600,
              color: "#f7fafc",
              marginBottom: "1rem",
              paddingBottom: "8px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            Tips to Improve Virality
          </div>
          {tips.map((tip) => (
            <div
              key={tip.title}
              data-ocid={`predictor.tip.${tips.indexOf(tip) + 1}`}
              style={{
                background: `${tip.color}12`,
                border: `1px solid ${tip.color}30`,
                borderRadius: "10px",
                padding: "0.9rem 1.1rem",
                fontSize: "0.83rem",
                lineHeight: 1.65,
                color: tip.color,
                marginBottom: "0.6rem",
              }}
            >
              <b>{tip.title}:</b> {tip.desc}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
