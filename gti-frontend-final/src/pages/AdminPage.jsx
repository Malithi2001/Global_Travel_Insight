
import React, { useEffect, useState } from "react";
import { getAdminOverview } from "../services/countryService.js";

function AdminPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getAdminOverview()
      .then(setStats)
      .catch(() => setError("Failed to load admin data"));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!stats) return <p>Loading admin overview...</p>;

  return (
    <section>
      <h1 className="history-page-title">Admin Overview</h1>
      <div className="history-list">
        <article className="history-item">
          <div>
            <div className="history-country">Total Users</div>
            <div className="history-meta">{stats.totalUsers}</div>
          </div>
        </article>
        <article className="history-item">
          <div>
            <div className="history-country">Total Searches</div>
            <div className="history-meta">{stats.totalSearches}</div>
          </div>
        </article>
      </div>
    </section>
  );
}

export default AdminPage;
