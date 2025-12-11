# Global Travel Insight

A full‑stack travel intelligence platform providing real-time country data, weather updates, safety advisories, authentication, analytics, and more — built with **React**, **Node.js**, **Express**, and **MongoDB**.

## Features
- Country search with integrated APIs (REST Countries, OpenWeather, Travel Advisory)
- Weather, population, languages, advisory level, and more
- JWT authentication + 2FA + email verification
- Role-based access (Admin/User)
- Search history + filtering + caching
- Admin dashboard analytics

## Structure
```
Global_Travel_Insight/
 ├── backend/          
 ├── frontend/         
 ├── docs/
 │   ├── API.md
 │   └── wiki/
 │       ├── Overview.md
 │       ├── Architecture.md
 │       ├── Security.md
 │       └── Setup_and_Deployment.md
 ├── diagrams/
 ├── tests/
 ├── .github/
 │   ├── ISSUE_TEMPLATE/
 │   ├── workflows/ci.yml
 │   └── pull_request_template.md
 ├── LICENSE
 ├── CONTRIBUTING.md
 └── README.md
```

## Setup
Backend:
```
cd backend
npm install
npm run dev
```
Frontend:
```
cd frontend
npm install
npm run dev
```

## Team Roles
- Member 1: Frontend UI/UX
- Member 2: API integration
- Member 3: Backend + DB + caching
- Member 4: Security + docs + deployment
