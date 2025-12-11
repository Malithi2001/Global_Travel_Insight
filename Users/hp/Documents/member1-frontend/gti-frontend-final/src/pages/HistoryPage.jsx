
import React, { useEffect, useMemo, useState } from "react";
import Loader from "../components/Loader.jsx";
import { getHistory } from "../services/countryService.js";

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString();
}

function HistoryPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("ALL");
  const [timeRange, setTimeRange] = useState("ALL");

  useEffect(() => {
    getHistory()
      .then(setRecords)
      .catch(() => setError("Failed to load history"))
      .finally(() => setLoading(false));
  }, []);

  const filteredRecords = useMemo(() => {
    let list = [...records];

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      list = list.filter((r) => {
        const c = r.country?.toLowerCase() || "";
        const cap = r.capital?.toLowerCase() || "";
        return c.includes(term) || cap.includes(term);
      });
    }

    if (riskFilter !== "ALL") {
      list = list.filter((r) => (r.risk || "Unknown") === riskFilter);
    }

    if (timeRange !== "ALL") {
      const days = Number(timeRange);
      const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
      list = list.filter((r) => {
        const t = new Date(r.searchedAt).getTime();
        return !Number.isNaN(t) && t >= cutoff;
      });
    }

    return list;
  }, [records, searchTerm, riskFilter, timeRange]);

  return (
    <section>
      <h1 className="history-page-title">Search History</h1>
      <p className="history-subtitle">
        View and filter your previous searches by destination, risk level and
        time period.
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.6rem",
          marginBottom: "1.1rem",
        }}
      >
        <input
          className="auth-input"
          style={{ flex: "1 1 220px" }}
          placeholder="Filter by country or capital..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="auth-input"
          style={{ width: 160 }}
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
        >
          <option value="ALL">All risks</option>
          <option value="Low Risk">Low Risk</option>
          <option value="Medium Risk">Medium Risk</option>
          <option value="High Risk">High Risk</option>
          <option value="Unknown">Unknown</option>
        </select>

        <select
          className="auth-input"
          style={{ width: 160 }}
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="ALL">All time</option>
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
        </select>
      </div>

      {loading && <Loader />}
      {error && <p className="error">{error}</p>}
      {!loading && filteredRecords.length === 0 && !error && (
        <p>No records match your filters.</p>
      )}

      <div className="history-list">
        {filteredRecords.map((r) => (
          <article key={r._id} className="history-item">
            <div style={{ display: "flex", gap: "0.7rem", alignItems: "center" }}>
              <div className="flag-pill">{r.country ? r.country[0] : "?"}</div>
              <div>
                <div className="history-country">{r.country}</div>
                <div className="history-meta">
                  {r.summary} · {r.risk}
                </div>
              </div>
            </div>
            <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
              🕒 {formatDate(r.searchedAt)}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default HistoryPage;
