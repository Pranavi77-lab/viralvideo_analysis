import { useEffect, useRef, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const SYSTEM_CONTEXT = `You are an AI assistant for an Instagram Virality Analysis project built by 4th semester students.
Project details:
- Dataset: 29,999 Instagram posts, 23 features, 0 missing values, balanced (7500 each: viral/high/medium/low)
- Tools: pandas, numpy, matplotlib, seaborn, scipy, sklearn, textblob
- Cell 4 Preprocessing: drop_duplicates, LabelEncoder (account_type, media_type, content_category, traffic_source, day_of_week), MinMaxScaler on likes/comments/shares/saves/reach/impressions/follower_count
- Cell 5 Feature Engineering: time_of_day (Morning/Afternoon/Evening/Night from post_hour), caption_group (Short/Medium/Long), is_viral binary
- Cell 6 Descriptive Stats: mean likes=287, avg engagement=0.04, follower_count 3083-31095
- Cell 7 Correlation: engagement_rate\u2194is_viral=0.62 (strongest), reach\u2194impressions=0.99, hashtags\u2194viral=0.00
- Cell 8 Hypothesis Tests (ALL not significant, p>0.05): T-test CTA p=0.2225, ANOVA category p=0.3091, ANOVA media p=0.3323, ANOVA time_of_day p=0.8141
- Cell 9 Linear Regression: R\u00b2=0.2623, MSE=0.000968, likes coefficient=0.4603 (highest)
- Cell 10 Logistic Regression: ~74% accuracy, max_iter=1000
- Cell 12 Random Forest: 73.9% accuracy, 100 trees, confusion matrix: 4083 correct not-viral, 421 viral missed
- Cell 13 Feature Importance: likes(0.25)>saves(0.18)>caption_length(0.17)>shares(0.15)>comments(0.13)>hashtags(0.10)>CTA(0.04)
- Cell 14 Sentiment: TextBlob on content_category, all Neutral (0.0421) since category names are neutral words
- Key findings: Engagement rate is #1 predictor. Saves>Shares. Hashtags don't matter. Time of day doesn't matter.
Answer clearly and helpfully about any aspect of this project.`;

const QUICK_QS: { q: string; a: string }[] = [
  {
    q: "What is the strongest predictor?",
    a: "Engagement rate is the strongest predictor with 0.62 correlation with virality. Viral posts average 0.068 engagement rate vs 0.017 for low posts \u2014 nearly 4\u00d7 higher. Likes is the top feature in Random Forest with 0.25 importance.",
  },
  {
    q: "Why did all hypothesis tests fail?",
    a: "All ANOVA tests had p-values well above 0.05: CTA p=0.2225, Category p=0.3091, Media p=0.3323, Time p=0.8141. This means any difference between groups could easily be random chance. p > 0.05 means we cannot reject the null hypothesis \u2014 no statistically significant effect.",
  },
  {
    q: "Why Random Forest over Logistic?",
    a: "Random Forest builds 100 decision trees and takes majority vote \u2014 ensemble learning. It captures complex non-linear patterns that a single logistic regression decision boundary cannot. RF scored 73.9% vs Logistic's 74.1% \u2014 very close, but RF provides feature importances which is a key advantage.",
  },
  {
    q: "What is engagement rate formula?",
    a: "Engagement Rate = (Likes + Comments + Shares + Saves) / Reach. It measures what percentage of people who saw the post actually interacted with it. Our dataset's mean engagement rate is 0.0421 (4.21%). Viral posts average 0.068.",
  },
  {
    q: "What does MinMaxScaler do?",
    a: "MinMaxScaler rescales values to the 0\u20131 range using the formula: (value \u2212 min) / (max \u2212 min). This prevents large-scale features like reach (50,000+) from dominating small ones like comments (5\u201330) in the ML models. All 7 numeric features were normalized before training.",
  },
  {
    q: "What is LabelEncoder?",
    a: "LabelEncoder converts text categories to numbers because ML models only understand numbers. Examples: brand\u21920, creator\u21921; carousel\u21920, image\u21921, reel\u21922; Monday\u21920, Tuesday\u21921, etc. Five columns were label-encoded: account_type, media_type, content_category, traffic_source, day_of_week.",
  },
  {
    q: "Why all Neutral sentiment?",
    a: "Category names like Fashion, Beauty, Food, Dance are factual neutral words. TextBlob.sentiment.polarity returns 0.0 for them because they carry no emotional weight. Real caption text like 'This is amazing!' would return positive polarity (0.8). For deeper NLP, actual caption text would be needed.",
  },
  {
    q: "What does p < 0.05 mean?",
    a: "p < 0.05 means only 5% chance the result is random luck \u2192 statistically significant (real finding). p > 0.05 means more than 5% chance it's random \u2192 not significant. All our tests had p > 0.05, meaning none of the tested factors (CTA, category, media type, time of day) alone significantly drive engagement rate.",
  },
];

// ── Shared style helpers ──────────────────────────────────────────────────────
const INPUT_STYLE: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "10px",
  color: "#f7fafc",
  padding: "0.55rem 0.85rem",
  fontSize: "0.88rem",
  outline: "none",
  fontFamily: "Inter, sans-serif",
  boxSizing: "border-box",
};

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AIChatPage() {
  const [apiKey, setApiKey] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll-to-bottom on chat updates intentionally uses chat as dep
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const nextChat: ChatMessage[] = [
      ...chat,
      {
        id: `msg-${Date.now()}-${Math.random()}`,
        role: "user",
        content: trimmed,
      },
    ];
    setChat(nextChat);
    setInputText("");
    setLoading(true);

    let reply = "";
    if (apiKey.trim()) {
      try {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "x-api-key": apiKey.trim(),
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 600,
            system: SYSTEM_CONTEXT,
            messages: nextChat.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });
        if (res.ok) {
          const data = await res.json();
          reply =
            (data.content?.[0]?.text as string) ?? "No response from API.";
        } else {
          reply = `API error ${res.status}: ${res.statusText}`;
        }
      } catch (e) {
        reply = `Network error: ${e instanceof Error ? e.message : String(e)}`;
      }
    } else {
      // Default answer: check if matches a quick question
      const matched = QUICK_QS.find(
        (q) => q.q.toLowerCase() === trimmed.toLowerCase(),
      );
      reply = matched
        ? matched.a
        : "Please enter your Anthropic API key at the top to get real AI answers! The quick question buttons work without a key.";
    }

    setChat((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}-${Math.random()}`,
        role: "assistant",
        content: reply,
      },
    ]);
    setLoading(false);
  }

  function handleQuickQ(q: string, a: string) {
    const ts = Date.now();
    const next: ChatMessage[] = [
      ...chat,
      { id: `msg-${ts}-u`, role: "user", content: q },
      { id: `msg-${ts}-a`, role: "assistant", content: a },
    ];
    setChat(next);
  }

  return (
    <div
      data-ocid="aichat.page"
      style={{
        background: "#04060f",
        minHeight: "100vh",
        padding: "2rem",
        fontFamily: "Inter, sans-serif",
        color: "#e2e8f0",
      }}
    >
      {/* Header */}
      <h1
        style={{
          fontSize: "1.6rem",
          fontWeight: 800,
          color: "#f7fafc",
          margin: 0,
        }}
      >
        AI Analysis Assistant
      </h1>
      <p
        style={{
          fontSize: "0.8rem",
          color: "#4a5568",
          marginTop: 4,
          marginBottom: "1.5rem",
        }}
      >
        Ask anything about your Instagram Virality project — powered by Claude
        AI (Anthropic)
      </p>
      <hr
        style={{
          borderColor: "rgba(255,255,255,0.06)",
          marginBottom: "1.5rem",
        }}
      />

      {/* API Key */}
      <div
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 14,
          padding: "1.25rem",
          marginBottom: "1.5rem",
        }}
      >
        <label
          htmlFor="apikey"
          style={{
            display: "block",
            fontSize: "0.78rem",
            color: "#718096",
            marginBottom: 6,
          }}
        >
          Anthropic API Key (optional — quick questions work without it)
        </label>
        <input
          id="apikey"
          data-ocid="aichat.apikey_input"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="sk-ant-api03-..."
          style={INPUT_STYLE}
        />
        {!apiKey && (
          <p style={{ fontSize: "0.73rem", color: "#1f2937", marginTop: 6 }}>
            Without a key, the 8 quick questions use hardcoded answers. Get your
            key from console.anthropic.com
          </p>
        )}
      </div>

      {/* Quick Questions */}
      <div
        style={{
          fontSize: "0.95rem",
          fontWeight: 600,
          color: "#f7fafc",
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: "1rem",
          paddingBottom: 8,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        Quick questions — click any
      </div>
      <div
        data-ocid="aichat.quick_questions"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 8,
          marginBottom: "1.5rem",
        }}
      >
        {QUICK_QS.map((item, i) => (
          <button
            key={item.q}
            type="button"
            data-ocid={`aichat.quick_q.${i + 1}`}
            onClick={() => handleQuickQ(item.q, item.a)}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 10,
              color: "#718096",
              padding: "0.55rem 0.75rem",
              fontSize: "0.77rem",
              fontFamily: "Inter, sans-serif",
              cursor: "pointer",
              textAlign: "left",
              lineHeight: 1.4,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(74,222,128,0.08)";
              e.currentTarget.style.borderColor = "rgba(74,222,128,0.3)";
              e.currentTarget.style.color = "#4ade80";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.03)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
              e.currentTarget.style.color = "#718096";
            }}
          >
            {item.q}
          </button>
        ))}
      </div>

      {/* Chat title */}
      <div
        style={{
          fontSize: "0.95rem",
          fontWeight: 600,
          color: "#f7fafc",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          marginBottom: "1rem",
          paddingBottom: 8,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <span>Chat history</span>
        {chat.length > 0 && (
          <button
            type="button"
            data-ocid="aichat.clear_button"
            onClick={() => setChat([])}
            style={{
              background: "rgba(248,113,113,0.08)",
              border: "1px solid rgba(248,113,113,0.2)",
              color: "#f87171",
              borderRadius: 8,
              padding: "0.3rem 0.8rem",
              fontSize: "0.75rem",
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Clear chat
          </button>
        )}
      </div>

      {/* Messages */}
      <div
        data-ocid="aichat.messages"
        style={{
          minHeight: 200,
          maxHeight: 460,
          overflowY: "auto",
          marginBottom: "1.25rem",
          paddingRight: 4,
        }}
      >
        {chat.length === 0 ? (
          <div
            data-ocid="aichat.empty_state"
            style={{
              background: "rgba(96,165,250,0.07)",
              border: "1px solid rgba(96,165,250,0.18)",
              color: "#93c5fd",
              borderRadius: 10,
              padding: "0.9rem 1.1rem",
              fontSize: "0.83rem",
              lineHeight: 1.65,
            }}
          >
            Click any quick question above or type your own below to start!
          </div>
        ) : (
          chat.map((msg, i) =>
            msg.role === "user" ? (
              <div
                key={msg.id}
                data-ocid={`aichat.user_message.${i + 1}`}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "14px 14px 4px 14px",
                  padding: "12px 16px",
                  marginBottom: 10,
                  fontSize: "0.85rem",
                  color: "#e2e8f0",
                  lineHeight: 1.65,
                  textAlign: "right",
                  marginLeft: "15%",
                }}
              >
                {msg.content}
              </div>
            ) : (
              <div
                key={msg.id}
                data-ocid={`aichat.ai_message.${i + 1}`}
                style={{
                  background: "rgba(96,165,250,0.07)",
                  border: "1px solid rgba(96,165,250,0.18)",
                  borderRadius: "14px 14px 14px 4px",
                  padding: "12px 16px",
                  marginBottom: 10,
                  fontSize: "0.85rem",
                  color: "#93c5fd",
                  lineHeight: 1.65,
                  marginRight: "15%",
                }}
              >
                {msg.content}
              </div>
            ),
          )
        )}
        {loading && (
          <div
            data-ocid="aichat.loading_state"
            style={{
              background: "rgba(96,165,250,0.07)",
              border: "1px solid rgba(96,165,250,0.18)",
              borderRadius: "14px 14px 14px 4px",
              padding: "12px 16px",
              marginBottom: 10,
              fontSize: "0.85rem",
              color: "#93c5fd",
              lineHeight: 1.65,
              marginRight: "15%",
            }}
          >
            <span style={{ opacity: 0.6 }}>Thinking...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input row */}
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <input
          data-ocid="aichat.message_input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage(inputText);
            }
          }}
          placeholder="Ask your own question about the project…"
          style={{ ...INPUT_STYLE, flex: 1 }}
          disabled={loading}
        />
        <button
          type="button"
          data-ocid="aichat.send_button"
          onClick={() => sendMessage(inputText)}
          disabled={loading || !inputText.trim()}
          style={{
            background:
              inputText.trim() && !loading
                ? "linear-gradient(135deg,#4ade80,#22c55e)"
                : "rgba(255,255,255,0.06)",
            color: inputText.trim() && !loading ? "#04060f" : "#4a5568",
            border: "none",
            borderRadius: 10,
            padding: "0.55rem 1.25rem",
            fontWeight: 700,
            fontSize: "0.88rem",
            cursor: inputText.trim() && !loading ? "pointer" : "not-allowed",
            transition: "all 0.2s",
            whiteSpace: "nowrap",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Send →
        </button>
      </div>
    </div>
  );
}
