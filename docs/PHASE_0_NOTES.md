Phase 0 Notes

1. Architecture

- Monolith
- Modular Monolith
- Microservices
- We chose Modular Monolith because it is simpler but still keeps modules separated.

2. Git and GitHub

- Git tracks project changes.
- Commit saves a change.
- Push sends commits to GitHub.
- Clone downloads a repository.

3. Project Structure

- client → React frontend
- server → Node.js + Express backend
- ai-service → Python FastAPI
- infrastructure → Docker/Nginx later
- tests → testing
- .github → GitHub workflows

4. Environment Variables

- .env stores real configuration and secrets.
- .env.example shows required variables without real secrets.
- Secrets should never be hardcoded.

5. .gitignore

- Prevents Git from tracking files like .env and node_modules.
- Helps keep the repository clean and secure.

6. API Architecture
   Request flow:
   Client → Route → Middleware → Controller → Service → Model → Database

- Route handles the endpoint.
- Middleware handles things like authentication and validation.
- Controller handles HTTP request/response.
- Service contains business logic.
- Model communicates with the database.

7. Coding Standards

- Use clear names.
- Keep functions focused.
- Handle errors properly.
- Keep controllers thin.
- Never hardcode secrets.
- Comments should explain why when necessary.

8. Important Security

- Never commit .env.
- Never hardcode API keys or passwords.
- JWT secrets should be stored securely.
- Production should use proper secret management.

9. Development Environment

- Node.js
- npm
- MongoDB
- Python
- pip
- Redis will be added later with Docker.

10. Production

- Environment variables are injected at runtime.
- MongoDB should be secured.
- Redis can run using Docker or a managed service.
- Nginx can be used as a reverse proxy.
