# Vysion web application

This Next.js app is the `web` npm workspace. Run the following commands from the
repository root. Use Node >=22.18.0 and npm >=10; this checkpoint was tested
with Node 24.14.0 and npm 11.9.0. Firebase Admin 14 requires Node >=22 and the
dependency contract tests use native TypeScript support enabled in Node 22.18.

## Install and run

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm run dev --workspace=web
```

Open [http://localhost:3000](http://localhost:3000). App Router source lives in
`apps/web/src/app`.

The root `package-lock.json` is the only lockfile for all npm workspaces. Do not
create a separate lockfile in `apps/web` or install with a different package
manager. For dependency updates, use npm from the repository root and review the
root lockfile diff. Lifecycle scripts are disabled in the install command above;
any additional setup, such as Prisma client generation, is a separate explicit
step under the [repository governance rules](../../AGENTS.md).

## Validate

```sh
npm run lint --workspace=web
npm run build --workspace=web
```

These commands cover the web app. The root build and type-check commands cover
other workspaces and do not validate this app. There is no dedicated web test or
type-check script. Existing source errors can still block lint and production
builds; dependency updates do not establish runtime or deployment readiness.
