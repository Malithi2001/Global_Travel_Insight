# API Documentation – Global Travel Insight

Base URL (development):

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`

All protected endpoints require a valid **JWT** in the `Authorization` header:

```http
Authorization: Bearer <token>
```

## Auth

### `POST /auth/signup`
Create a new user account.

**Body**
```json
{
  "email": "user@example.com",
  "password": "StrongPassword123!"
}
```

### `POST /auth/login`
Authenticate user and (optionally) trigger 2FA.

### `POST /auth/verify-2fa`
Verify the 2FA code and return a final JWT.

### `POST /auth/request-password-reset`
Send password reset link to email.

### `POST /auth/reset-password`
Reset password using reset token.

### `GET /auth/me`
Return currently authenticated user.

---

## Travel Search

### `GET /api/search?q={countryName}`

Aggregates data from **REST Countries**, **OpenWeather**, and the **Travel Advisory** API.

**Query params**

- `q` – country name (e.g. `Sri Lanka`, `France`).

**Response (example)**

```json
{
  "country": "Sri Lanka",
  "capital": "Sri Jayawardenepura Kotte",
  "region": "Asia",
  "population": 21803000,
  "flagUrl": "https://flagcdn.com/w320/lk.png",
  "languages": ["Sinhala", "Tamil"],
  "currency": "Sri Lankan rupee (LKR)",
  "weather": {
    "temperature": 29.4,
    "description": "overcast clouds",
    "humidity": 82
  },
  "advisory": {
    "risk": "Low Risk",
    "message": "Exercise normal safety precautions."
  }
}
```

---

## Search History

### `GET /api/records`

Returns search history for the authenticated user with filtering support (date / risk level etc.).

---

## Admin

### `GET /admin/stats`

Protected with `role: "ADMIN"`.

Returns aggregated metrics used in the admin dashboard:
- total users
- verified vs unverified
- total searches
- top searched countries
- daily searches over time
