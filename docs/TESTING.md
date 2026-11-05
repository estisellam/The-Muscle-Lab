# Testing The Muscle Lab

Run commands from the repository root with dependencies installed. Use only a local disposable database and synthetic accounts. No test automatically drops a database.

## Unit and service checks

```bash
npm test --prefix server
npm test --prefix client
npm run lint --prefix client
npm run build --prefix client
```

The server command runs ten security/hardening tests; the HTTP integration suite is skipped unless explicitly enabled. Seven client tests cover session storage, malformed stored data, authentication errors, image URLs, and local coaching.

## HTTP integration tests

Keep connection settings in `server/.env` pointing at your local test MySQL instance. Choose a **new** database with the required `muscle_lab_test_` prefix:

```bash
DB_NAME=muscle_lab_test_local npm run db:setup --prefix server
RUN_DB_TESTS=1 DB_NAME=muscle_lab_test_local JWT_SECRET=integration-test-only-key npm test --prefix server
```

The setup command refuses an existing database. If `muscle_lab_test_local` already exists, choose another new name. The suite can run again against the initialized test database: fixture accounts have unique emails. It starts its own HTTP listener on a random loopback port and closes the listener and pool afterward. It leaves test records and test-upload files in place, so do not point it at user data.

The 19 integration tests cover public plans, registration/login failures, authentication and roles, profile edits and uploads, password changes, membership lifecycle/expiry, calendar queries, registration/cancellation, capacity and membership concurrency, class validation, dashboard queries, and Admin CRUD. Together with ten security/hardening tests, this is **29 backend tests**.

## Browser workflows

Configure and start both apps against an isolated development database as described in the README. Create a new synthetic Admin with `npm run dev:admin --prefix server`; use those same credentials below.

Install a browser once:

```bash
cd client
npx playwright install chromium
cd ..
```

Run the suite using the actual local URLs printed by your servers:

```bash
E2E_BASE_URL=http://localhost:5173 \
E2E_API_URL=http://localhost:3000/api \
E2E_ADMIN_EMAIL=admin@example.invalid \
E2E_ADMIN_PASSWORD='<your-local-admin-password>' \
npm run test:e2e --prefix client
```

The suite skips if the two URLs are missing. The Admin scenario additionally skips if its credentials are missing. It creates synthetic users, enrollments, trainer profiles, and classes. Use a disposable instance; it does not purge all fixtures afterward. An installed Chrome executable can be selected with `PLAYWRIGHT_CHROME_PATH` instead of downloading Chromium.

Four scenarios check:

1. Protected redirects, invalid login feedback, public pages, and mobile navigation.
2. Member registration/login, shared profile, local Coach, membership enrollment/cancellation, class registration/cancellation, calendar navigation, profile editing, mobile width, and logout.
3. Admin login, dashboard and list views, trainer/class create-edit-delete forms using named selectors, immutable linked-user editing, role redirects, and logout.
4. Admin lookup failures, retry recovery, and an empty trainer-list state.

API tests additionally verify image uploads, password changes, concurrent requests, plan mutations, and participant lookup. Those operations are not all exercised through the browser. The optional remote coach service, password-reset email, and production deployment are not tested.

## Screenshots

Add `CAPTURE_SCREENSHOTS=1` to the browser command to produce four **diagnostic captures**: `docs/screenshots/login.png`, `member-dashboard.png`, `admin-panel.png`, and `calendar.png`. These paths are ignored and are not the approved README gallery. Capture only synthetic accounts and development seed data; review any new image for personal information before considering it for publication.

The README gallery uses these five separately reviewed, privacy-cropped images:

- `docs/screenshots/admin-dashboard.png`
- `docs/screenshots/member-class-registration.png`
- `docs/screenshots/member-membership.png`
- `docs/screenshots/member-calendar.png`
- `docs/screenshots/trainer-management.png`

Diagnostic capture does not overwrite these five gallery files. Keep unreviewed originals in the ignored `screenshots-to-review/` directory, outside the public inventory.

## Verified results — 4 November 2026

| Check | Result |
| --- | --- |
| Backend tests with isolated MySQL | 29 passed, 0 failed, 0 skipped |
| Client service tests | 7 passed, 0 failed |
| Browser scenarios against the production preview in headless Chrome | 4 passed, 0 failed |
| Frontend production build | Passed in working tree and clean source copy |
| Oxlint | 0 errors; 2 Context/Fast Refresh warnings |
| Clean-copy setup | Both `npm ci` commands, new database setup, Admin creation, both dev servers, backend `start`, and browser workflows passed |

The clean-copy check copied current source into `/tmp` without `.git`, `node_modules`, local environment files, or existing user uploads. It then supplied independent test configuration and databases. This simulates the pending changes after a future commit; it is not a claim that an uncommitted branch can already be cloned remotely.

During the original audit, initial browser attempts timed out while waiting for the full page `load` event. The tests now wait for DOM readiness and assert visible application state, and the final scenarios passed. Initial sandbox port/registry restrictions required approved local execution/network access. A sandboxed MySQL initialization crashed; initialization outside that restriction succeeded in an entirely separate data directory.

## Final local verification — 5 November 2026

- Node 20.20.2 / npm 10.8.2 / MySQL 9.6.0; headless installed Chrome.
- Backend: **29 passed, 0 failed, 0 skipped**, including the opt-in MySQL suite.
- Frontend: **7 passed, 0 failed**; browser workflows: **4 passed, 0 failed, 0 skipped** against the production build and a production-mode API with explicit CORS origins.
- Production build passed; lint reported **0 errors and 1 existing Fast Refresh warning**.
- A clean source copy excluded Git metadata, node_modules, environment files, uploads, and build output. Both lockfile installs, safe new-database setup, both development commands (HTTP 200), and a separate production build passed. An initial offline install lacked a cached package; normal registry-backed installs succeeded.
- The five approved README gallery images rendered in desktop and mobile browser checks. The diagnostic capture files are separate from this gallery.
- Test accounts and records were restricted to newly created databases with the `muscle_lab_test_` prefix. Existing user data was not modified. This verifies the pending working source, not a future remote commit or every supported browser.
