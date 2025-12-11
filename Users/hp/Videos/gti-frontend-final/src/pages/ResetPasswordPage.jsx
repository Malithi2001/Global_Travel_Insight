import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/authService.js";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function ResetPasswordPage() {
  const query = useQuery();
  const token = query.get("token") || "";
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      const data = await resetPassword(token, password);
      setMessage(data.message);
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return <p className="auth-error">Reset token is missing.</p>;
  }

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <div className="auth-logo-badge">🔒</div>
        <h1 className="auth-title">Set a New Password</h1>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-label">
            New Password
            <input
              className="auth-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}
          {message && <p className="auth-success">{message}</p>}

          <button className="auth-btn-primary" disabled={loading}>
            {loading ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default ResetPasswordPage;