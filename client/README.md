# The Muscle Lab client

React frontend for The Muscle Lab. See the [project README](../README.md) for configuration, database setup, features, and architecture, and [testing instructions](../docs/TESTING.md) for isolated API and browser checks.

From the repository root:

```bash
npm ci --prefix client
npm run dev --prefix client
npm test --prefix client
npm run lint --prefix client
npm run build --prefix client
```

The backend must be running for application workflows. Configure its origin with `VITE_API_URL` in `client/.env` (without `/api`).
