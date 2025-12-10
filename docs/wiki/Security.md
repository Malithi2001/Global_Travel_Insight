# Security Design

- Passwords hashed with bcrypt.
- JWT signed with strong secret key stored in environment variables.
- 2FA codes are random, time-limited, and stored temporarily.
- Protected routes use middleware to validate JWT and enforce roles.
- API key middleware restricts untrusted access to the backend from unknown frontends.
- Environment variables managed in `.env` and never committed to the repository.
