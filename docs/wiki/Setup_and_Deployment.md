# Setup & Deployment

## Local Development
1. Install Node.js (>= 18).
2. Set up MongoDB (local or Atlas).
3. Configure `.env` files for backend and frontend.
4. Run:
   - `npm run dev` in `backend/`
   - `npm run dev` in `frontend/`

## Production (example)
- Use a process manager (PM2) or containerize with Docker.
- Serve the built frontend from Nginx or a static hosting provider.
- Use environment variables for secrets and API keys.
- Enable HTTPS via a reverse proxy.
