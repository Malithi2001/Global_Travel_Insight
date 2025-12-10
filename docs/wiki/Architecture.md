# System Architecture

## Frontend
- React + Vite SPA
- React Router for navigation
- Reusable components for cards, layouts, and forms
- Service layer for HTTP calls

## Backend
- Node.js + Express
- Mongoose + MongoDB
- Layered structure: routes → controllers/services → models
- Central config and middleware (auth, API key, error handling)

## External Services
- REST Countries API – static country data
- OpenWeather API – live weather data
- Travel Advisory API – safety / risk level

## Security
- JWT auth with HttpOnly cookies/local storage (depending on implementation)
- Optional 2FA (time-limited verification code)
- Role-based access control (Admin/User)
- Password reset via token + email
