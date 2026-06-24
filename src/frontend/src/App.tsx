import AIChatPage from "@/pages/AIChatPage";
import EDAPage from "@/pages/EDAPage";
import ModelsPage from "@/pages/ModelsPage";
import OverviewPage from "@/pages/OverviewPage";
import PredictorPage from "@/pages/PredictorPage";
import PreprocessingPage from "@/pages/PreprocessingPage";
import SentimentPage from "@/pages/SentimentPage";
import StatisticsPage from "@/pages/StatisticsPage";
import { useState } from "react";

type PageId =
  | "overview"
  | "eda"
  | "stats"
  | "preprocessing"
  | "models"
  | "predictor"
  | "sentiment"
  | "ai";

const NAV_ITEMS: { id: PageId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "eda", label: "EDA" },
  { id: "stats", label: "Statistics" },
  { id: "preprocessing", label: "Preprocessing" },
  { id: "models", label: "ML Models" },
  { id: "predictor", label: "Predictor" },
  { id: "sentiment", label: "Sentiment" },
  { id: "ai", label: "AI Chat" },
];

export default function App() {
  const [page, setPage] = useState<PageId>("overview");

  return (
    <div
      style={{
        background: "#04060f",
        minHeight: "100vh",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Top Navbar */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 999,
          background: "rgba(4,6,15,0.96)",
          backdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          padding: "0 1.5rem",
          height: 58,
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        {/* Brand */}
        <div
          style={{
            fontSize: "1.05rem",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "#fff",
            marginRight: "1rem",
            whiteSpace: "nowrap",
          }}
        >
          Virality<span style={{ color: "#4ade80" }}>AI</span>
          <span
            style={{
              fontSize: "0.7rem",
              color: "#2d3748",
              fontWeight: 400,
              marginLeft: 8,
            }}
          >
            Instagram Analysis
          </span>
        </div>

        {/* Nav buttons */}
        <div style={{ display: "flex", gap: 4, flex: 1, overflowX: "auto" }}>
          {NAV_ITEMS.map((item) => {
            const active = page === item.id;
            return (
              <button
                key={item.id}
                type="button"
                data-ocid={`nav.${item.id}.link`}
                onClick={() => setPage(item.id)}
                style={{
                  background: active ? "rgba(74,222,128,0.1)" : "transparent",
                  border: active
                    ? "1px solid rgba(74,222,128,0.3)"
                    : "1px solid rgba(255,255,255,0.08)",
                  color: active ? "#4ade80" : "#718096",
                  borderRadius: 10,
                  padding: "0.4rem 0.85rem",
                  fontSize: "0.8rem",
                  fontWeight: active ? 600 : 400,
                  fontFamily: "Inter, sans-serif",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "rgba(74,222,128,0.06)";
                    e.currentTarget.style.color = "#a0c4a0";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#718096";
                  }
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Live indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: "0.72rem",
            color: "#4a5568",
            whiteSpace: "nowrap",
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#4ade80",
              display: "inline-block",
              animation: "blink 2s infinite",
            }}
          />
          29,999 posts
        </div>
      </nav>

      {/* Page content */}
      <main>
        {page === "overview" && <OverviewPage />}
        {page === "eda" && <EDAPage />}
        {page === "stats" && <StatisticsPage />}
        {page === "preprocessing" && <PreprocessingPage />}
        {page === "models" && <ModelsPage />}
        {page === "predictor" && <PredictorPage />}
        {page === "sentiment" && <SentimentPage />}
        {page === "ai" && <AIChatPage />}
      </main>
    </div>
  );
}
