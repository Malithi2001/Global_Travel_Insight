# Contributing to Global Travel Insight

Thank you for taking the time to contribute! 🚀

## Branching Model
- `main` – stable, deployable code.
- `dev` – integration branch for upcoming changes.
- Feature branches: `feature/<short-name>`.
- Bugfix branches: `fix/<short-name>`.

## Workflow
1. Fork the repo (or create a feature branch if you have write access).
2. Create a descriptive branch name.
3. Implement your change with clear, small commits.
4. Add or update tests where appropriate.
5. Run all tests and linters locally.
6. Update documentation (README / docs / API.md) if behavior changes.
7. Open a Pull Request to `dev` with a clear description and screenshots if UI changes.

## Code Style
- Use consistent formatting (Prettier / ESLint for frontend, ESLint / Node style for backend).
- Prefer small, reusable components and functions.
- Avoid duplicating logic—extract helpers or services.

## Commit Messages
- Use clear, descriptive messages:
  - `feat: add 2FA verification step`
  - `fix: handle travel advisory API errors`
  - `docs: update API usage section`
  - `refactor: extract weather mapper`

## Pull Request Checklist
- [ ] Code compiles and passes tests
- [ ] New/updated tests added if needed
- [ ] Documentation updated (README/docs/API)
- [ ] No sensitive credentials committed

## Reporting Issues
Use the **Bug report** or **Feature request** templates and include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots / logs where relevant
