import { useState } from "react";

const CARD: React.CSSProperties = {
  background: "rgba(255,255,255,0.02)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "16px",
  padding: "1.5rem",
};

const SECTION_TITLE: React.CSSProperties = {
  fontSize: "0.95rem",
  fontWeight: 600,
  color: "#f7fafc",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginBottom: "1rem",
  paddingBottom: "8px",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
};

const INSIGHT: Record<string, React.CSSProperties> = {
  orange: {
    background: "rgba(251,191,36,0.07)",
    border: "1px solid rgba(251,191,36,0.18)",
    color: "#fde68a",
  },
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
  purple: {
    background: "rgba(167,139,250,0.07)",
    border: "1px solid rgba(167,139,250,0.18)",
    color: "#c4b5fd",
  },
};

function insightStyle(color: string): React.CSSProperties {
  return {
    ...INSIGHT[color],
    borderRadius: "10px",
    padding: "0.9rem 1.1rem",
    fontSize: "0.83rem",
    lineHeight: 1.65,
    marginBottom: "10px",
  };
}

// Donut Ring SVG
function DonutRing() {
  const cx = 90;
  const cy = 90;
  const r = 65;
  const circumference = 2 * Math.PI * r;

  const segments = [
    { color: "#718096", label: "Neutral", pct: "100%" },
    { color: "#4ade80", label: "Positive", pct: "0%" },
    { color: "#f87171", label: "Negative", pct: "0%" },
  ];

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <svg
        width={180}
        height={180}
        viewBox="0 0 180 180"
        role="img"
        aria-label="Donut chart showing 100% neutral sentiment distribution"
      >
        {/* track */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={18}
        />
        {/* neutral — full ring */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#718096"
          strokeWidth={18}
          strokeDasharray={`${circumference} 0`}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
        />
        <text
          x={cx}
          y={cy - 8}
          textAnchor="middle"
          fill="#f7fafc"
          fontSize={22}
          fontWeight={800}
          fontFamily="Inter,sans-serif"
        >
          100%
        </text>
        <text
          x={cx}
          y={cy + 14}
          textAnchor="middle"
          fill="#718096"
          fontSize={12}
          fontFamily="Inter,sans-serif"
        >
          Neutral
        </text>
      </svg>
      <div style={{ display: "flex", gap: "1.2rem", marginTop: "0.5rem" }}>
        {segments.map((s) => (
          <div
            key={s.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "0.75rem",
              color: "#718096",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: s.color,
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            {s.label} ({s.pct})
          </div>
        ))}
      </div>
    </div>
  );
}

// Polarity Spectrum SVG
function PolaritySpectrum({ value = 0.0 }: { value?: number }) {
  const W = 340;
  const H = 80;
  const pad = 30;
  const lineY = 44;
  const lineW = W - pad * 2;
  const toX = (v: number) => pad + ((v + 1) / 2) * lineW;
  const dotX = toX(value);
  const ticks = [-1, -0.5, 0, 0.5, 1];

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{ overflow: "visible" }}
      role="img"
      aria-label="Polarity spectrum showing sentiment score position"
    >
      <defs>
        <linearGradient id="polarityGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="50%" stopColor="#718096" />
          <stop offset="100%" stopColor="#4ade80" />
        </linearGradient>
      </defs>
      <line
        x1={pad}
        y1={lineY}
        x2={W - pad}
        y2={lineY}
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={6}
        strokeLinecap="round"
      />
      <line
        x1={pad}
        y1={lineY}
        x2={W - pad}
        y2={lineY}
        stroke="url(#polarityGrad)"
        strokeWidth={6}
        strokeLinecap="round"
      />
      {ticks.map((t) => {
        const tx = toX(t);
        return (
          <g key={t}>
            <line
              x1={tx}
              y1={lineY - 8}
              x2={tx}
              y2={lineY + 8}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth={1.5}
            />
            <text
              x={tx}
              y={lineY + 22}
              textAnchor="middle"
              fill="#4a5568"
              fontSize={10}
              fontFamily="Inter,sans-serif"
            >
              {t}
            </text>
          </g>
        );
      })}
      <circle
        cx={dotX}
        cy={lineY}
        r={9}
        fill="#04060f"
        stroke="#f7fafc"
        strokeWidth={2.5}
      />
      <circle cx={dotX} cy={lineY} r={4} fill="#718096" />
      <text
        x={dotX}
        y={lineY - 16}
        textAnchor="middle"
        fill="#f7fafc"
        fontSize={11}
        fontWeight={700}
        fontFamily="Inter,sans-serif"
      >
        {value.toFixed(1)}
      </text>
    </svg>
  );
}

// Engagement Stat + Progress Bar
function EngagementStat() {
  const value = 0.0421;
  const max = 0.1;
  const fillPct = (value / max) * 100;

  return (
    <div
      style={{
        background: "rgba(74,222,128,0.03)",
        border: "1px solid rgba(74,222,128,0.15)",
        borderRadius: "14px",
        padding: "1.75rem 2rem",
        textAlign: "center",
        width: "100%",
      }}
    >
      <div
        style={{
          fontSize: "0.7rem",
          color: "#4a5568",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: "0.5rem",
        }}
      >
        Avg Engagement Rate
      </div>
      <div
        style={{
          fontSize: "3.2rem",
          fontWeight: 900,
          color: "#4ade80",
          lineHeight: 1,
          marginBottom: "0.4rem",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: "0.75rem",
          color: "#4a5568",
          marginBottom: "1.25rem",
        }}
      >
        Overall sentiment engagement rate
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <span style={{ fontSize: "0.7rem", color: "#4a5568", minWidth: 20 }}>
          0
        </span>
        <div
          style={{
            flex: 1,
            height: 8,
            background: "rgba(255,255,255,0.06)",
            borderRadius: 99,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${fillPct}%`,
              height: "100%",
              background: "linear-gradient(90deg, #22c55e, #4ade80)",
              borderRadius: 99,
            }}
          />
        </div>
        <span
          style={{
            fontSize: "0.7rem",
            color: "#4a5568",
            minWidth: 32,
            textAlign: "right",
          }}
        >
          0.10
        </span>
      </div>
      <div
        style={{ fontSize: "0.7rem", color: "#718096", marginTop: "0.5rem" }}
      >
        {fillPct.toFixed(1)}% of max (0.10)
      </div>
    </div>
  );
}

// Sentiment word-based detector (client-side)
const POSITIVE_WORDS = [
  "amazing",
  "great",
  "love",
  "excellent",
  "fantastic",
  "awesome",
  "wonderful",
  "best",
  "perfect",
  "brilliant",
  "happy",
  "beautiful",
  "good",
  "nice",
  "superb",
  "incredible",
];
const NEGATIVE_WORDS = [
  "terrible",
  "bad",
  "hate",
  "awful",
  "horrible",
  "worst",
  "ugly",
  "poor",
  "sad",
  "disgusting",
  "dreadful",
  "boring",
  "useless",
  "trash",
  "awful",
  "dull",
];

function detectSentiment(text: string): {
  score: number;
  label: string;
  color: string;
} {
  const lower = text.toLowerCase();
  let score = 0;
  for (const w of POSITIVE_WORDS) {
    if (lower.includes(w)) score += 0.5;
  }
  for (const w of NEGATIVE_WORDS) {
    if (lower.includes(w)) score -= 0.5;
  }
  score = Math.max(-1, Math.min(1, score));
  if (score > 0) return { score, label: "Positive", color: "#4ade80" };
  if (score < 0) return { score, label: "Negative", color: "#f87171" };
  return { score: 0, label: "Neutral", color: "#718096" };
}

function SentimentTester() {
  const [text, setText] = useState("");
  const result = text.trim() ? detectSentiment(text) : null;
  const insColor = result
    ? result.label.includes("Positive")
      ? "green"
      : result.label.includes("Negative")
        ? "orange"
        : "blue"
    : "blue";

  return (
    <div style={CARD}>
      <div style={SECTION_TITLE}>Live Sentiment Tester</div>
      <input
        data-ocid="sentiment.test_input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type any text — e.g. This product is amazing!"
        style={{
          width: "100%",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "10px",
          color: "#f7fafc",
          padding: "0.6rem 1rem",
          fontSize: "0.85rem",
          outline: "none",
          boxSizing: "border-box",
          marginBottom: "0.75rem",
        }}
      />
      {result ? (
        <div data-ocid="sentiment.test_result" style={insightStyle(insColor)}>
          <strong>Sentiment:</strong>{" "}
          <span style={{ color: result.color, fontWeight: 700 }}>
            {result.label}
          </span>
          <br />
          <strong>Polarity:</strong> {result.score.toFixed(4)} (range: −1 to +1)
        </div>
      ) : (
        <div style={{ fontSize: "0.8rem", color: "#4a5568" }}>
          Start typing to see real-time sentiment detection
        </div>
      )}
    </div>
  );
}

export default function SentimentPage() {
  return (
    <div style={{ padding: "2rem 2rem 3rem" }}>
      <h1
        style={{
          fontSize: "1.6rem",
          fontWeight: 800,
          color: "#f7fafc",
          marginBottom: "0.25rem",
        }}
      >
        Sentiment Analysis
      </h1>
      <p
        style={{ fontSize: "0.8rem", color: "#4a5568", marginBottom: "1.5rem" }}
      >
        Cell 14 — TextBlob NLP sentiment analysis on content categories
      </p>
      <hr
        style={{
          borderColor: "rgba(255,255,255,0.06)",
          marginBottom: "1.5rem",
        }}
      />

      {/* Row 1: Donut + Engagement Stat */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        {/* Donut Ring */}
        <div style={CARD}>
          <div style={SECTION_TITLE}>Sentiment Distribution</div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 220,
            }}
          >
            <DonutRing />
          </div>
          <div style={{ ...insightStyle("orange"), marginBottom: 0 }}>
            All content categories returned <strong>Neutral</strong> sentiment.
            Category names like "Fashion", "Beauty", "Food" are factual words —
            TextBlob gives them polarity = 0.
          </div>
        </div>

        {/* Engagement stat */}
        <div style={CARD}>
          <div style={SECTION_TITLE}>Avg Engagement Rate by Sentiment</div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 160,
              marginBottom: "1rem",
            }}
          >
            <EngagementStat />
          </div>
          <div style={{ ...insightStyle("green"), marginBottom: 0 }}>
            <strong>Report conclusion:</strong> Sentiment analysis returned
            predominantly neutral sentiment (0.0421), indicating that category
            names alone are insufficient. Actual caption text would be needed
            for deeper NLP analysis.
          </div>
        </div>
      </div>

      {/* Polarity Spectrum */}
      <div style={{ ...CARD, marginBottom: "1.5rem" }}>
        <div style={SECTION_TITLE}>
          Polarity Spectrum — Where Does 0.0421 Land?
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "1rem 0 0.5rem",
          }}
        >
          <PolaritySpectrum value={0.0} />
          <div
            style={{
              fontSize: "0.78rem",
              color: "#4a5568",
              marginTop: "0.75rem",
            }}
          >
            Marker at <strong style={{ color: "#718096" }}>0.0</strong> —
            perfectly neutral &middot; Range: Negative (−1) \u2192 Neutral (0)
            \u2192 Positive (+1)
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
            marginTop: "1rem",
          }}
        >
          <div style={insightStyle("blue")}>
            <strong>What polarity means:</strong>
            <br />
            polarity &gt; 0 = Positive (happy, good words)
            <br />
            polarity &lt; 0 = Negative (bad, sad words)
            <br />
            polarity = 0 = Neutral (factual, no emotion)
          </div>
          <div style={insightStyle("purple")}>
            <strong>TextBlob(text).sentiment.polarity</strong> gives a score
            from −1 to +1:
            <br />
            TextBlob("Fashion").polarity \u2192 0.0 (Neutral)
            <br />
            TextBlob("Amazing!").polarity \u2192 0.8 (Positive)
            <br />
            TextBlob("Terrible").polarity \u2192 −1.0 (Negative)
          </div>
        </div>
      </div>

      {/* Live Tester */}
      <SentimentTester />
    </div>
  );
}
