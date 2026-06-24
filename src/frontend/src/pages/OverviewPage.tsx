import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = {
  viral: "#4ade80",
  high: "#60a5fa",
  medium: "#fbbf24",
  low: "#f87171",
};

const TOOLTIP_STYLE = {
  backgroundColor: "#0d1117",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "10px",
  color: "#f7fafc",
  fontSize: "0.82rem",
};

const bucketData = [
  { name: "Viral", value: 7500, fill: COLORS.viral },
  { name: "High", value: 7500, fill: COLORS.high },
  { name: "Medium", value: 7500, fill: COLORS.medium },
  { name: "Low", value: 7500, fill: COLORS.low },
];

const engagementData = [
  { performance: "Low", rate: 0.017 },
  { performance: "Medium", rate: 0.034 },
  { performance: "High", rate: 0.051 },
  { performance: "Viral", rate: 0.068 },
];

const metricCards = [
  {
    icon: "",
    label: "Total Posts",
    value: "29,999",
    sub: "23 features · 0 nulls",
    gradient: "linear-gradient(90deg,#60a5fa,#3b82f6)",
    subColor: "#60a5fa",
  },
  {
    icon: "",
    label: "Viral Posts",
    value: "7,500",
    sub: "25% of dataset",
    gradient: "linear-gradient(90deg,#4ade80,#22c55e)",
    subColor: "#4ade80",
  },
  {
    icon: "",
    label: "Features Used",
    value: "7",
    sub: "For ML models",
    gradient: "linear-gradient(90deg,#a78bfa,#8b5cf6)",
    subColor: "#a78bfa",
  },
  {
    icon: "",
    label: "RF Accuracy",
    value: "73.9%",
    sub: "Random Forest",
    gradient: "linear-gradient(90deg,#fbbf24,#f59e0b)",
    subColor: "#fbbf24",
  },
  {
    icon: "",
    label: "Top Correlation",
    value: "0.62",
    sub: "Engagement↔Viral",
    gradient: "linear-gradient(90deg,#f87171,#ef4444)",
    subColor: "#f87171",
  },
];

const insights = [
  {
    color: "blue",
    text: "<b>Engagement rate</b> has the strongest correlation with virality at <b>0.62</b>. Viral posts average <b>0.068</b> — nearly 4× higher than low posts (0.017).",
  },
  {
    color: "green",
    text: "<b>Saves beat shares!</b> Saves ranked 2nd (0.18) above shares (0.15) in Random Forest feature importance. Bookmarking signals stronger interest.",
  },
  {
    color: "orange",
    text: "<b>Hashtags don't matter.</b> 0.00 correlation with virality. All 4 hypothesis tests (T-test + ANOVA) returned p > 0.05 — none significant.",
  },
];

const describeStats = [
  {
    stat: "count",
    likes: 29999,
    comments: 29999,
    shares: 29999,
    saves: 29999,
    engagement: 29999,
    hashtags: 29999,
    caption: 29999,
    followers: 29999,
  },
  {
    stat: "mean",
    likes: 287.3,
    comments: 28.5,
    shares: 19.8,
    saves: 52.4,
    engagement: 0.04,
    hashtags: 10.5,
    caption: 118.2,
    followers: 15842,
  },
  {
    stat: "std",
    likes: 286.1,
    comments: 29.1,
    shares: 20.1,
    saves: 53.2,
    engagement: 0.028,
    hashtags: 6.1,
    caption: 28.4,
    followers: 8185,
  },
  {
    stat: "min",
    likes: 0,
    comments: 0,
    shares: 0,
    saves: 0,
    engagement: 0.001,
    hashtags: 0,
    caption: 70,
    followers: 3083,
  },
  {
    stat: "25%",
    likes: 63,
    comments: 5,
    shares: 3,
    saves: 10,
    engagement: 0.017,
    hashtags: 6,
    caption: 95,
    followers: 8734,
  },
  {
    stat: "50%",
    likes: 201,
    comments: 19,
    shares: 13,
    saves: 35,
    engagement: 0.034,
    hashtags: 11,
    caption: 118,
    followers: 15857,
  },
  {
    stat: "75%",
    likes: 435,
    comments: 44,
    shares: 30,
    saves: 78,
    engagement: 0.058,
    hashtags: 15,
    caption: 141,
    followers: 23027,
  },
  {
    stat: "max",
    likes: 1497,
    comments: 149,
    shares: 148,
    saves: 396,
    engagement: 0.27,
    hashtags: 21,
    caption: 166,
    followers: 31095,
  },
];

export default function OverviewPage() {
  return (
    <div style={{ padding: "2rem 2rem 3rem" }}>
      {/* Title */}
      <h1
        style={{
          fontSize: "1.6rem",
          fontWeight: 800,
          color: "#f7fafc",
          marginBottom: "0.25rem",
        }}
      >
        Instagram Virality Analysis Dashboard
      </h1>
      <p
        style={{ fontSize: "0.8rem", color: "#4a5568", marginBottom: "1.5rem" }}
      >
        4th Semester Mini Project · Team: Pranavi · Pravarshitha · Madhulikaa
      </p>
      <hr
        style={{
          borderColor: "rgba(255,255,255,0.06)",
          marginBottom: "1.5rem",
        }}
      />

      {/* Metric Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5,1fr)",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        {metricCards.map((c) => (
          <div
            key={c.label}
            data-ocid="overview.metric_card"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "14px",
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
                height: "2px",
                background: c.gradient,
                borderRadius: "14px 14px 0 0",
              }}
            />
            <div style={{ fontSize: "1.4rem", marginBottom: "10px" }}>
              {c.icon}
            </div>
            <div
              style={{
                fontSize: "0.7rem",
                color: "#4a5568",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "5px",
              }}
            >
              {c.label}
            </div>
            <div
              style={{
                fontSize: "1.9rem",
                fontWeight: 800,
                color: "#f7fafc",
                lineHeight: 1,
              }}
            >
              {c.value}
            </div>
            <div
              style={{
                fontSize: "0.72rem",
                marginTop: "5px",
                color: c.subColor,
              }}
            >
              {c.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        {/* Chart 1 — Radial Bar Chart */}
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
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "1rem",
              paddingBottom: "8px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            Performance Bucket Distribution
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="20%"
              outerRadius="90%"
              barSize={22}
              data={bucketData}
              startAngle={180}
              endAngle={-180}
            >
              <RadialBar
                label={{
                  position: "insideStart",
                  fill: "#f7fafc",
                  fontSize: 11,
                  fontWeight: 600,
                }}
                background={{ fill: "rgba(255,255,255,0.03)" }}
                dataKey="value"
              />
              <Legend
                iconSize={10}
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                formatter={(value: string) => (
                  <span style={{ color: "#718096", fontSize: "0.78rem" }}>
                    {value}
                  </span>
                )}
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(value: number) => [value.toLocaleString(), "Posts"]}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 2 — Area Chart */}
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
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "1rem",
              paddingBottom: "8px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            Avg Engagement Rate by Performance Level
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart
              data={engagementData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="gradViral" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ade80" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#4ade80" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
                vertical={false}
              />
              <XAxis
                dataKey="performance"
                stroke="#4a5568"
                tick={{ fill: "#718096", fontSize: 12 }}
                axisLine={{ stroke: "rgba(255,255,255,0.05)" }}
                tickLine={false}
              />
              <YAxis
                stroke="#4a5568"
                tick={{ fill: "#718096", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => v.toFixed(3)}
                domain={[0, 0.08]}
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(value: number) => [
                  value.toFixed(4),
                  "Avg Engagement Rate",
                ]}
              />
              <Area
                type="monotone"
                dataKey="rate"
                stroke="#4ade80"
                strokeWidth={2.5}
                fill="url(#gradViral)"
                dot={{ fill: "#4ade80", r: 5, strokeWidth: 0 }}
                activeDot={{
                  r: 7,
                  fill: "#4ade80",
                  stroke: "#04060f",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insight boxes */}
      <div
        style={{
          fontSize: "0.95rem",
          fontWeight: 600,
          color: "#f7fafc",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "1rem",
          paddingBottom: "8px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        Key Project Findings
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        {insights.map((ins) => {
          const styleMap: Record<string, React.CSSProperties> = {
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
          };
          return (
            <div
              key={ins.color}
              data-ocid={`overview.insight.${insights.indexOf(ins) + 1}`}
              style={{
                ...styleMap[ins.color],
                borderRadius: "10px",
                padding: "0.9rem 1.1rem",
                fontSize: "0.83rem",
                lineHeight: 1.65,
              }}
              // biome-ignore lint/security/noDangerouslySetInnerHtml: static trusted content
              dangerouslySetInnerHTML={{ __html: ins.text }}
            />
          );
        })}
      </div>

      {/* Dataset stats table */}
      <div
        style={{
          fontSize: "0.95rem",
          fontWeight: 600,
          color: "#f7fafc",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "1rem",
          paddingBottom: "8px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        Dataset Quick Stats (Cell 6 — Descriptive Statistics)
      </div>
      <div
        data-ocid="overview.stats_table"
        style={{
          overflowX: "auto",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "12px",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.82rem",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              {[
                "stat",
                "likes",
                "comments",
                "shares",
                "saves",
                "engagement",
                "hashtags",
                "caption",
                "followers",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "0.75rem 1rem",
                    textAlign: h === "stat" ? "left" : "right",
                    color: "#4a5568",
                    fontWeight: 600,
                    fontSize: "0.72rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    background: "rgba(255,255,255,0.02)",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {describeStats.map((row, i) => (
              <tr
                key={row.stat}
                style={{
                  borderBottom:
                    i < describeStats.length - 1
                      ? "1px solid rgba(255,255,255,0.04)"
                      : "none",
                  background:
                    i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                }}
              >
                <td
                  style={{
                    padding: "0.6rem 1rem",
                    color: "#a78bfa",
                    fontWeight: 600,
                  }}
                >
                  {row.stat}
                </td>
                <td
                  style={{
                    padding: "0.6rem 1rem",
                    textAlign: "right",
                    color: "#e2e8f0",
                  }}
                >
                  {row.likes}
                </td>
                <td
                  style={{
                    padding: "0.6rem 1rem",
                    textAlign: "right",
                    color: "#e2e8f0",
                  }}
                >
                  {row.comments}
                </td>
                <td
                  style={{
                    padding: "0.6rem 1rem",
                    textAlign: "right",
                    color: "#e2e8f0",
                  }}
                >
                  {row.shares}
                </td>
                <td
                  style={{
                    padding: "0.6rem 1rem",
                    textAlign: "right",
                    color: "#e2e8f0",
                  }}
                >
                  {row.saves}
                </td>
                <td
                  style={{
                    padding: "0.6rem 1rem",
                    textAlign: "right",
                    color: "#e2e8f0",
                  }}
                >
                  {row.engagement}
                </td>
                <td
                  style={{
                    padding: "0.6rem 1rem",
                    textAlign: "right",
                    color: "#e2e8f0",
                  }}
                >
                  {row.hashtags}
                </td>
                <td
                  style={{
                    padding: "0.6rem 1rem",
                    textAlign: "right",
                    color: "#e2e8f0",
                  }}
                >
                  {row.caption}
                </td>
                <td
                  style={{
                    padding: "0.6rem 1rem",
                    textAlign: "right",
                    color: "#e2e8f0",
                  }}
                >
                  {row.followers}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
