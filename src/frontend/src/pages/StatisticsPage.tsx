import { Badge } from "@/components/ui/badge";

interface GaugeProps {
  pValue: number;
  label: string;
  factor: string;
  testType: string;
}

function SemiGauge({ pValue, factor, testType }: GaugeProps) {
  const isSignificant = pValue < 0.05;
  const arcColor = isSignificant ? "#4ade80" : "#f87171";
  const trackColor = "rgba(255,255,255,0.06)";

  // SVG semicircle: center (80,80), radius 60, 180° arc
  const cx = 80;
  const cy = 80;
  const r = 60;
  const strokeWidth = 10;

  // Full semicircle from 180° to 0° (left to right along bottom half as top arc)
  // Start: leftmost point (-r, 0) = (cx - r, cy)
  // End: rightmost point (r, 0) = (cx + r, cy)
  // Arc fill fraction = pValue / 1.0
  const fraction = Math.min(pValue, 1.0);

  // Angle in radians: start at π (left), sweep clockwise by fraction * π
  const startAngle = Math.PI; // 180°
  const sweepAngle = fraction * Math.PI;
  const endAngle = startAngle - sweepAngle; // going counter-clockwise from left

  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle);
  const y2 = cy + r * Math.sin(endAngle);

  const largeArc = sweepAngle > Math.PI ? 1 : 0;

  // Track: full semicircle
  const trackX1 = cx - r;
  const trackY1 = cy;
  const trackX2 = cx + r;
  const trackY2 = cy;

  // Value arc path
  const arcPath =
    fraction === 0
      ? ""
      : `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 0 ${x2} ${y2}`;

  // Track path (full 180°)
  const trackPath = `M ${trackX1} ${trackY1} A ${r} ${r} 0 1 1 ${trackX2} ${trackY2}`;

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        style={{
          background: "rgba(255,255,255,0.025)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 16,
          padding: "1.25rem 1rem 0.75rem",
        }}
        className="flex flex-col items-center w-44"
      >
        {/* SVG gauge */}
        <svg
          width={160}
          height={90}
          viewBox="0 0 160 90"
          style={{ overflow: "visible" }}
          role="img"
          aria-label={`Gauge chart for ${factor} ${testType}`}
        >
          {/* Track arc */}
          <path
            d={trackPath}
            fill="none"
            stroke={trackColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Value arc */}
          {fraction > 0 && (
            <path
              d={arcPath}
              fill="none"
              stroke={arcColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              style={{
                filter: isSignificant
                  ? "drop-shadow(0 0 6px #4ade8060)"
                  : "drop-shadow(0 0 6px #f8717160)",
              }}
            />
          )}
          {/* Center p-value text */}
          <text
            x={cx}
            y={cy - 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#f7fafc"
            fontSize="14"
            fontWeight="800"
            fontFamily="Inter, sans-serif"
          >
            {pValue.toFixed(4)}
          </text>
          {/* "p =" label */}
          <text
            x={cx}
            y={cy + 14}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#4a5568"
            fontSize="9"
            fontFamily="Inter, sans-serif"
          >
            p-value
          </text>
          {/* Scale endpoints */}
          <text
            x={trackX1 - 4}
            y={trackY1 + 14}
            textAnchor="middle"
            fill="#2d3748"
            fontSize="8"
            fontFamily="Inter, sans-serif"
          >
            0
          </text>
          <text
            x={trackX2 + 4}
            y={trackY2 + 14}
            textAnchor="middle"
            fill="#2d3748"
            fontSize="8"
            fontFamily="Inter, sans-serif"
          >
            1.0
          </text>
        </svg>

        {/* NOT SIGNIFICANT badge */}
        <div
          style={{
            background: isSignificant
              ? "rgba(74,222,128,0.1)"
              : "rgba(248,113,113,0.1)",
            border: `1px solid ${isSignificant ? "rgba(74,222,128,0.3)" : "rgba(248,113,113,0.3)"}`,
            color: isSignificant ? "#4ade80" : "#f87171",
            borderRadius: 20,
            padding: "2px 10px",
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginTop: 4,
          }}
        >
          {isSignificant ? "SIGNIFICANT" : "NOT SIGNIFICANT"}
        </div>

        {/* Test name */}
        <div
          style={{
            marginTop: 8,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "0.72rem",
              color: "#a78bfa",
              fontWeight: 600,
              marginBottom: 2,
            }}
          >
            {testType}
          </div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "#e2e8f0",
              fontWeight: 500,
              lineHeight: 1.3,
            }}
          >
            {factor}
          </div>
        </div>
      </div>
    </div>
  );
}

const HYPOTHESIS_TESTS = [
  {
    testType: "T-test",
    label: "CTA T-test",
    factor: "Call-to-Action",
    groups: "2 groups",
    stat: "−1.218",
    pValue: 0.2225,
  },
  {
    testType: "ANOVA",
    label: "Category ANOVA",
    factor: "Content Category",
    groups: "8 groups",
    stat: "1.156",
    pValue: 0.3091,
  },
  {
    testType: "ANOVA",
    label: "Media Type ANOVA",
    factor: "Media Type",
    groups: "3 groups",
    stat: "1.101",
    pValue: 0.3323,
  },
  {
    testType: "ANOVA",
    label: "Time of Day ANOVA",
    factor: "Time of Day",
    groups: "4 groups",
    stat: "0.306",
    pValue: 0.8141,
  },
];

const DESCRIPTIVE_STATS = [
  {
    metric: "likes",
    mean: 287.4,
    std: 164.2,
    min: 0,
    "25%": 144,
    "50%": 284,
    "75%": 430,
    max: 749,
  },
  {
    metric: "comments",
    mean: 19.8,
    std: 11.5,
    min: 0,
    "25%": 10,
    "50%": 20,
    "75%": 30,
    max: 49,
  },
  {
    metric: "shares",
    mean: 29.8,
    std: 17.3,
    min: 0,
    "25%": 15,
    "50%": 30,
    "75%": 45,
    max: 74,
  },
  {
    metric: "saves",
    mean: 79.8,
    std: 46.1,
    min: 0,
    "25%": 40,
    "50%": 80,
    "75%": 120,
    max: 199,
  },
  {
    metric: "engagement_rate",
    mean: 0.0421,
    std: 0.0243,
    min: 0.0,
    "25%": 0.022,
    "50%": 0.042,
    "75%": 0.062,
    max: 0.149,
  },
  {
    metric: "hashtags_count",
    mean: 10.5,
    std: 6.1,
    min: 0,
    "25%": 5,
    "50%": 10,
    "75%": 16,
    max: 21,
  },
  {
    metric: "caption_length",
    mean: 118.2,
    std: 27.9,
    min: 70,
    "25%": 94,
    "50%": 118,
    "75%": 143,
    max: 166,
  },
  {
    metric: "follower_count",
    mean: 17089,
    std: 8224,
    min: 3083,
    "25%": 10121,
    "50%": 17056,
    "75%": 24108,
    max: 31095,
  },
];

function InsightBox({
  color,
  children,
}: { color: string; children: React.ReactNode }) {
  const styles: Record<string, { bg: string; border: string; text: string }> = {
    blue: {
      bg: "rgba(96,165,250,0.07)",
      border: "rgba(96,165,250,0.18)",
      text: "#93c5fd",
    },
    green: {
      bg: "rgba(74,222,128,0.07)",
      border: "rgba(74,222,128,0.18)",
      text: "#86efac",
    },
    orange: {
      bg: "rgba(251,191,36,0.07)",
      border: "rgba(251,191,36,0.18)",
      text: "#fde68a",
    },
    red: {
      bg: "rgba(248,113,113,0.07)",
      border: "rgba(248,113,113,0.18)",
      text: "#fca5a5",
    },
    purple: {
      bg: "rgba(167,139,250,0.07)",
      border: "rgba(167,139,250,0.18)",
      text: "#c4b5fd",
    },
  };
  const s = styles[color] ?? styles.blue;
  return (
    <div
      style={{
        background: s.bg,
        border: `1px solid ${s.border}`,
        color: s.text,
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

export default function StatisticsPage() {
  return (
    <div
      data-ocid="statistics.page"
      style={{
        background: "#04060f",
        minHeight: "100vh",
        padding: "2rem",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Page header */}
      <div style={{ marginBottom: "0.25rem" }}>
        <h1
          style={{
            fontSize: "1.6rem",
            fontWeight: 800,
            color: "#f7fafc",
            margin: 0,
          }}
        >
          Statistical Analysis
        </h1>
      </div>
      <p
        style={{
          color: "#4a5568",
          fontSize: "0.83rem",
          marginBottom: "1.5rem",
        }}
      >
        Cell 6 — Descriptive Statistics · Cell 8 — Hypothesis Testing (T-test +
        ANOVA)
      </p>

      <hr
        style={{
          borderColor: "rgba(255,255,255,0.06)",
          marginBottom: "1.5rem",
        }}
      />

      {/* Descriptive stats table */}
      <div
        style={{
          fontSize: "0.75rem",
          color: "#f7fafc",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: "0.75rem",
          paddingBottom: 8,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        Cell 6 — Descriptive Statistics
      </div>

      <div
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 12,
          overflow: "auto",
          marginBottom: "2rem",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.8rem",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              {["Metric", "Mean", "Std", "Min", "25%", "50%", "75%", "Max"].map(
                (h) => (
                  <th
                    key={h}
                    style={{
                      padding: "0.6rem 1rem",
                      textAlign: h === "Metric" ? "left" : "right",
                      color: "#4a5568",
                      fontWeight: 600,
                      fontSize: "0.7rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {DESCRIPTIVE_STATS.map((row, i) => (
              <tr
                key={row.metric}
                style={{
                  borderBottom:
                    i < DESCRIPTIVE_STATS.length - 1
                      ? "1px solid rgba(255,255,255,0.04)"
                      : "none",
                }}
              >
                <td
                  style={{
                    padding: "0.55rem 1rem",
                    color: "#a78bfa",
                    fontWeight: 500,
                  }}
                >
                  {row.metric}
                </td>
                {(
                  ["mean", "std", "min", "25%", "50%", "75%", "max"] as const
                ).map((k) => (
                  <td
                    key={k}
                    style={{
                      padding: "0.55rem 1rem",
                      textAlign: "right",
                      color: "#e2e8f0",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {typeof row[k] === "number" && row[k] < 1 && row[k] > 0
                      ? (row[k] as number).toFixed(4)
                      : typeof row[k] === "number" && (row[k] as number) >= 1000
                        ? (row[k] as number).toLocaleString()
                        : row[k]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Hypothesis Testing */}
      <div
        style={{
          fontSize: "0.75rem",
          color: "#f7fafc",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: "0.75rem",
          paddingBottom: 8,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        Cell 8 — Hypothesis Testing Results
      </div>

      {/* Table */}
      <div
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 12,
          overflow: "auto",
          marginBottom: "2rem",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.8rem",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              {[
                "Test",
                "Factor",
                "Groups",
                "Statistic",
                "P-value",
                "Result",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "0.6rem 1rem",
                    textAlign: "left",
                    color: "#4a5568",
                    fontWeight: 600,
                    fontSize: "0.7rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HYPOTHESIS_TESTS.map((t, i) => (
              <tr
                key={t.label}
                style={{
                  borderBottom:
                    i < HYPOTHESIS_TESTS.length - 1
                      ? "1px solid rgba(255,255,255,0.04)"
                      : "none",
                }}
              >
                <td
                  style={{
                    padding: "0.6rem 1rem",
                    color: "#a78bfa",
                    fontWeight: 500,
                    fontSize: "0.85rem",
                  }}
                >
                  {t.testType}
                </td>
                <td
                  style={{
                    padding: "0.6rem 1rem",
                    color: "#e2e8f0",
                    fontSize: "0.85rem",
                  }}
                >
                  {t.factor}
                </td>
                <td
                  style={{
                    padding: "0.6rem 1rem",
                    color: "#718096",
                    fontSize: "0.85rem",
                  }}
                >
                  {t.groups}
                </td>
                <td
                  style={{
                    padding: "0.6rem 1rem",
                    color: "#60a5fa",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                  }}
                >
                  {t.stat}
                </td>
                <td
                  style={{
                    padding: "0.6rem 1rem",
                    color: "#f87171",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                  }}
                >
                  {t.pValue.toFixed(4)}
                </td>
                <td style={{ padding: "0.6rem 1rem" }}>
                  <span
                    style={{
                      background:
                        t.pValue < 0.05
                          ? "rgba(74,222,128,0.15)"
                          : "rgba(248,113,113,0.15)",
                      color: t.pValue < 0.05 ? "#4ade80" : "#f87171",
                      padding: "3px 10px",
                      borderRadius: 20,
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}
                  >
                    {t.pValue < 0.05 ? "Significant" : "Not significant"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* P-value gauges + insights */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2rem",
          alignItems: "start",
        }}
      >
        {/* Gauges */}
        <div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "#f7fafc",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: "1rem",
              paddingBottom: 8,
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            P-value Gauges — All tests above 0.05 threshold
          </div>

          {/* 2×2 gauge grid */}
          <div
            data-ocid="statistics.gauges.panel"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              justifyItems: "center",
            }}
          >
            {HYPOTHESIS_TESTS.map((t) => (
              <SemiGauge
                key={t.label}
                pValue={t.pValue}
                label={t.label}
                factor={t.factor}
                testType={t.testType}
              />
            ))}
          </div>

          {/* p=0.05 legend */}
          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: "0.75rem",
              color: "#4a5568",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 24,
                height: 2,
                background: "#4ade80",
                borderRadius: 2,
              }}
            />
            <span>p &lt; 0.05 = significant</span>
            <span
              style={{
                display: "inline-block",
                width: 24,
                height: 2,
                background: "#f87171",
                borderRadius: 2,
                marginLeft: 8,
              }}
            />
            <span>p &gt; 0.05 = not significant</span>
          </div>
        </div>

        {/* Insights */}
        <div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "#f7fafc",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: "1rem",
              paddingBottom: 8,
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            What it means
          </div>
          <InsightBox color="blue">
            <strong>T-test</strong> compares exactly 2 groups. Used here to
            compare CTA=yes vs CTA=no. p=0.2225 → not significant.
          </InsightBox>
          <InsightBox color="purple">
            <strong>ANOVA</strong> compares 3+ groups simultaneously. Used for
            category (8 groups), media type (3), time of day (4). All p &gt;
            0.05 → none significant.
          </InsightBox>
          <InsightBox color="green">
            <strong>Conclusion:</strong> None of these factors alone
            significantly drive engagement rate. Virality depends on the overall
            combination of engagement metrics, not any single factor.
          </InsightBox>
          <InsightBox color="orange">
            <strong>p-value rule:</strong> p &lt; 0.05 = significant (only 5%
            chance it's luck). p &gt; 0.05 = not significant (could easily be
            random).
          </InsightBox>
        </div>
      </div>
    </div>
  );
}
