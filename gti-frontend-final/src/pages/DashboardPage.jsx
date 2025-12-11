// frontend/src/pages/DashboardPage.jsx
import React, { useState } from "react";
import Loader from "../components/Loader.jsx";
import { searchCountry } from "../services/countryService.js";

function formatPopulation(pop) {
  if (!pop && pop !== 0) return "N/A";
  if (pop >= 1_000_000_000) return (pop / 1_000_000_000).toFixed(1) + "B";
  if (pop >= 1_000_000) return (pop / 1_000_000).toFixed(1) + "M";
  if (pop >= 1_000) return (pop / 1_000).toFixed(1) + "K";
  return pop.toString();
}

const POPULAR = ["Japan", "France", "Australia", "Brazil", "Iceland"];

function DashboardPage() {
  const [country, setCountry] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (name) => {
    const query = name ?? country;
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await searchCountry(query);
      setResult(data);
    } catch (err) {
      setError(
        err?.response?.data?.error || "Failed to fetch data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const handlePopularClick = (name) => {
    setCountry(name);
    handleSearch(name);
  };

  // Wikipedia URL for current result
  let wikiUrl = "";
  if (result?.name) {
    wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(
      result.name
    )}`;
  }

  return (
    <div>
      {/* HERO SECTION */}
      <section
        style={{
          background:
            "radial-gradient(circle at center, #0f172a 0%, #0b1120 40%, #020617 100%)",
          color: "white",
          padding: "3.5rem 1.5rem 4rem",
          borderRadius: "0 0 40px 40px",
          boxShadow: "0 35px 80px rgba(15,23,42,0.6)",
        }}
      >
        <div
          style={{
            maxWidth: "960px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <button
            style={{
              borderRadius: "999px",
              border: "none",
              padding: "0.45rem 1.2rem",
              marginBottom: "1.2rem",
              background: "rgba(15,23,42,0.9)",
              color: "#e5e7eb",
              fontSize: "0.8rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              boxShadow: "0 10px 30px rgba(15,23,42,0.6)",
            }}
          >
            ✈️ <span>Explore 195+ Countries Worldwide</span>
          </button>

          <h1
            style={{
              fontSize: "3rem",
              fontWeight: 800,
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            Discover Your Next
            <br />
            <span style={{ color: "#fb7185" }}>Adventure</span>
          </h1>

          <p
            style={{
              marginTop: "0.9rem",
              marginBottom: "1.8rem",
              color: "#e5e7eb",
              fontSize: "0.98rem",
              maxWidth: "640px",
              marginInline: "auto",
            }}
          >
            Get real-time weather, safety advisories, and essential travel info
            for any destination in seconds.
          </p>

          {/* Search bar */}
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              background: "#ffffff",
              borderRadius: "999px",
              padding: "0.3rem",
              boxShadow: "0 22px 55px rgba(15,23,42,0.6)",
              maxWidth: "640px",
              width: "100%",
              margin: "0 auto",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                paddingLeft: "1rem",
                gap: "0.4rem",
                color: "#9ca3af",
              }}
            >
              <span>📍</span>
            </div>
            <input
              type="text"
              placeholder="Enter a country name..."
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                padding: "0.75rem 0.75rem",
                fontSize: "0.95rem",
              }}
            />
            <button
              type="submit"
              style={{
                border: "none",
                borderRadius: "999px",
                padding: "0.75rem 1.6rem",
                background:
                  "linear-gradient(135deg, #fb923c 0%, #f97316 40%, #ec4899 100%)",
                color: "#fff",
                fontWeight: 600,
                fontSize: "0.95rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              🔍 Search
            </button>
          </form>

          {/* Popular destinations */}
          <div
            style={{
              marginTop: "0.7rem",
              display: "flex",
              justifyContent: "center",
              gap: "0.5rem",
              flexWrap: "wrap",
              fontSize: "0.85rem",
            }}
          >
            <span style={{ color: "#cbd5f5" }}>Popular destinations:</span>
            {POPULAR.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => handlePopularClick(name)}
                style={{
                  borderRadius: "999px",
                  border: "none",
                  padding: "0.35rem 0.9rem",
                  background: "rgba(15,23,42,0.7)",
                  color: "#e5e7eb",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                }}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES STRIP */}
      <section
        style={{
          maxWidth: "1024px",
          margin: "2rem auto 1rem",
          padding: "0 1.5rem",
        }}
      >
        <h2
          style={{
            fontSize: "1.6rem",
            textAlign: "center",
            marginBottom: "0.8rem",
          }}
        >
          Everything You Need to Travel Smart
        </h2>
        <p
          style={{
            textAlign: "center",
            marginBottom: "1.6rem",
            color: "#6b7280",
            fontSize: "0.95rem",
          }}
        >
          Access comprehensive travel data from multiple sources, all in one
          place.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: "1.1rem",
          }}
        >
          {[
            {
              icon: "🔍",
              title: "Instant Search",
              text: "Find travel information for any country in seconds.",
            },
            {
              icon: "🌦",
              title: "Real-time Weather",
              text: "Live temperature, humidity and conditions.",
            },
            {
              icon: "🛡",
              title: "Safety First",
              text: "See official advisory and risk level.",
            },
            {
              icon: "🕒",
              title: "Search History",
              text: "Quickly revisit your recent destinations.",
            },
          ].map((card) => (
            <article
              key={card.title}
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                padding: "1.2rem 1.3rem",
                boxShadow: "0 18px 45px rgba(15,23,42,0.08)",
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "14px",
                  background: "#0f172a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  marginBottom: "0.7rem",
                  fontSize: "1.1rem",
                }}
              >
                {card.icon}
              </div>
              <h3 style={{ margin: 0, marginBottom: "0.25rem", fontSize: "1rem" }}>
                {card.title}
              </h3>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#6b7280" }}>
                {card.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* RESULT CARD */}
      <section
        style={{ maxWidth: "960px", margin: "1.5rem auto 2rem", padding: "0 1.5rem" }}
      >
        {loading && <Loader />}
        {error && <p className="error">{error}</p>}

        {result && !loading && !error && (
          <div className="result-card glass-card">
            {/* FLAG + WIKIPEDIA */}
            <div className="flag-wrapper">
              <a
                href={wikiUrl}
                target="_blank"
                rel="noreferrer"
                title="Open on Wikipedia"
              >
                {result.flagImage ? (
                  <img
                    src={result.flagImage}
                    alt={`${result.name} flag`}
                    className="flag-img-animated"
                  />
                ) : (
                  <span className="flag-emoji-big">
                    {result.flagEmoji || result.flag || "🌍"}
                  </span>
                )}
              </a>
              <span className="flag-caption">
                Click the flag to open the Wikipedia page for {result.name}.
              </span>
            </div>

            {/* SMALL FACT CHIPS */}
            <div className="fact-grid">
              <div className="fact-chip">
                <span className="fact-label">Region</span>
                <span>{result.region || "Unknown"}</span>
              </div>
              <div className="fact-chip">
                <span className="fact-label">Capital</span>
                <span>{result.capital || "N/A"}</span>
              </div>
              <div className="fact-chip">
                <span className="fact-label">Risk</span>
                <span>{result.advisory?.risk || "Unknown"}</span>
              </div>
            </div>

            {/* HEADER */}
            <header
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.8rem",
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: "1.5rem" }}>{result.name}</h3>
                <p
                  style={{
                    margin: "0.25rem 0 0",
                    fontSize: "0.9rem",
                    color: "#6b7280",
                  }}
                >
                  📍 {result.capital} · 🌍 {result.region}
                </p>
              </div>
            </header>

            {/* METRIC CARDS */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: "0.8rem",
                marginBottom: "1rem",
              }}
            >
              <div className="metric-card">
                <div className="metric-label">Population</div>
                <div className="metric-value">
                  {formatPopulation(result.population)}
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Temperature</div>
                <div className="metric-value">
                  {result.weather?.temperature ?? "N/A"}°C
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Weather</div>
                <div className="metric-value">
                  {result.weather?.description || "Unknown"}
                </div>
              </div>
            </div>

            {/* DETAILS */}
            <div className="detail-list">
              <div className="detail-row">
                <span className="detail-label">Currency</span>
                <span>{result.currency || "N/A"}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Languages</span>
                <span>
                  {result.languages?.length
                    ? result.languages.join(", ")
                    : "N/A"}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Humidity</span>
                <span>{result.weather?.humidity ?? "N/A"}%</span>
              </div>
            </div>

            {/* ADVISORY */}
            <div
              style={{
                marginTop: "1rem",
                borderRadius: "18px",
                padding: "0.85rem 1rem",
                background:
                  result.advisory?.risk === "High Risk"
                    ? "#fee2e2"
                    : result.advisory?.risk === "Medium Risk"
                    ? "#fef9c3"
                    : "#dcfce7",
                border: "1px solid rgba(22,163,74,0.3)",
                fontSize: "0.9rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontWeight: 600,
                  marginBottom: "0.2rem",
                  color:
                    result.advisory?.risk === "High Risk"
                      ? "#b91c1c"
                      : result.advisory?.risk === "Medium Risk"
                      ? "#a16207"
                      : "#15803d",
                }}
              >
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "999px",
                    border: "1px solid rgba(74,222,128,0.7)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.9rem",
                  }}
                >
                  🛡
                </span>
                <span>
                  Travel Advisory:{" "}
                  {result.advisory?.risk || "Unknown Risk Level"}
                </span>
              </div>
              <div>{result.advisory?.message}</div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default DashboardPage;