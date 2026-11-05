# Security and deployment notes

This portfolio project has verified local workflows and regression tests. It is not a production-security certification.

The SQL seed contains fictional development accounts at reserved `example.com` addresses, with no phone numbers or birth dates. Their shared public demo password is documented in the README and must never be reused for deployment. These fixtures are for new, disposable local databases; editing the seed does not update existing accounts.

## Protections implemented

- bcrypt password hashing, expiring JWTs, and server-side Admin role checks.
- Strict Bearer authentication-header parsing; the Express signature header is disabled.
- Separate per-IP authentication limits: **15 failed logins per 15 minutes**, and **15 registration requests per hour**. Successful logins do not consume the failed-login allowance. Limited requests receive JSON HTTP 429 and Retry-After.
- Parameterized SQL and transactional class/membership enrollment.
- Upload size/MIME limits, generated image extensions, and nosniff headers.
- Explicit CORS policy. If CORS_ORIGINS is blank in development, only localhost/loopback browser origins are accepted. Non-browser clients without an Origin header remain supported and still require authentication for protected APIs.

## Production CORS configuration

Set NODE_ENV=production and CORS_ORIGINS to your exact frontend origins, separated by commas, for example:

```dotenv
CORS_ORIGINS=https://gym.example,https://admin.gym.example
```

Use origins without paths or trailing slashes. Production startup refuses an empty allowlist; invalid origin entries also fail configuration. Disallowed browser-origin requests receive HTTP 403. CORS is a browser access policy, not a replacement for authentication.

## Decisions required before an Internet-facing deployment

| Concern | Current limitation | Required decision / work |
| --- | --- | --- |
| Reverse proxy and distributed throttling | In-memory limits are per process and reset on restart. No proxy is automatically trusted. | Review the actual proxy topology and trusted hops/IP ranges; configure a shared limiter store if running multiple instances. Do not blindly enable trust proxy. |
| Session revocation | Tokens live for up to seven days; logout clears browser state. Password changes/account deletion do not revoke issued tokens. | Choose a revocation/refresh/session strategy; this needs authentication design work. |
| Image validation and privacy | Claimed MIME is checked, not decoded image content. Uploads are public, and replaced images remain stored. | Decide on content decoding/re-encoding, private/public access, storage, and retention. Existing user photos were not deleted. |
| Input and error policies | Some plan/trainer fields and capacity edits need stronger validation; several controllers return low-level messages. | Agree on validation/domain errors and deletion rules. No cascading deletes or schema changes were introduced. |
| Historical development examples | Old README examples and the removed DB-password fallback remain in history. The project owner confirms these values were never used outside local development. External service configurations were not independently audited. | Treat these values as public examples and use independent secrets for any future deployment. Existing Git history is preserved. |
| Dependencies | The last full server audit reports two moderate findings in nodemon/minimatch, a development chain. | Monitor a compatible upstream fix. Production dependencies were separately checked; avoid blind forced downgrades. |
| Deployment configuration | HTTPS termination, least-privilege DB grants, database backups, and startup/readiness checks depend on deployment. | Configure them for the selected environment; do not reuse seed accounts or test fixtures. |

JWT storage redesign, schema/deletion migrations, historical-data removal, credential rotation, and image-storage policy remain deployment decisions.

## Sources for configuration details

- [express-rate-limit configuration](https://github.com/express-rate-limit/express-rate-limit#configuration)

See [testing instructions](TESTING.md) for local verification commands.
