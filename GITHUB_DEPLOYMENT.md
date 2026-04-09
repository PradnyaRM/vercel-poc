# GitHub → Vercel Deployment Guide

This project deploys to Vercel automatically via GitHub Actions.

---

## How it works

| Event | Action |
|---|---|
| Push to `main` | Lint → Build → Deploy to **production** |
| Open / update a PR | Lint → Build → Deploy **preview**, posts URL as PR comment |

---

## One-time setup (do this before first deploy)

### Step 1 — Fix the lock file

The `package-lock.json` must be in sync before CI can run `npm ci`:

```bash
npm install
git add package-lock.json
git commit -m "fix: sync package-lock.json"
git push
```

### Step 2 — Link the project to Vercel

```bash
npm install -g vercel
vercel login        # skip if already logged in
vercel link         # select your existing Vercel project when prompted
```

This creates `.vercel/project.json`. Note the `orgId` and `projectId` values — you need them in the next step.

```bash
cat .vercel/project.json
# { "orgId": "xxx", "projectId": "yyy" }
```

> `.vercel/` is in `.gitignore` — do not commit it.

### Step 3 — Create a Vercel API token

1. Go to **vercel.com/account/tokens**
2. Click **Create Token**
3. Name it `github-actions`, set expiry to 90 days
4. Copy the token (shown only once)

### Step 4 — Add secrets to GitHub

Go to your repo → **Settings → Secrets and variables → Actions → New repository secret**

| Secret name | Value |
|---|---|
| `VERCEL_TOKEN` | Token from Step 3 |
| `VERCEL_ORG_ID` | `orgId` from `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | `projectId` from `.vercel/project.json` |

### Step 5 — Push and verify

```bash
git push origin main
```

Go to **GitHub → Actions tab** to watch the workflow run. On success, your app will be live on Vercel.

---

## Workflow file

Located at `.github/workflows/vercel.yml`.

```
lint-and-build
├── npm ci
├── npm run lint
└── npm run build
      │
      ├── (main branch) deploy-production
      │     └── vercel deploy --prod
      │
      └── (pull request) deploy-preview
            ├── vercel deploy (preview)
            └── posts preview URL as PR comment
```

---

## Troubleshooting

### `npm ci` fails — lock file out of sync

```
npm error Missing: es-abstract@1.24.2 from lock file
```

**Fix:** Run `npm install` locally, commit and push the updated `package-lock.json`.

### `vercel pull` fails — missing secrets

```
Error: VERCEL_ORG_ID and VERCEL_PROJECT_ID are required
```

**Fix:** Make sure all 3 secrets (`VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`) are added in GitHub repo settings.

### Workflow not triggered

- For production: only triggers on push to `main`, not on PRs merged via squash if branch name differs.
- For previews: only triggers on `pull_request` events, not on direct branch pushes.

### Build passes locally but fails in CI

```bash
npm ci          # CI uses this — must match lock file
npm run lint
npm run build
```

Run these same commands locally to reproduce the CI environment.

---

## Local development

```bash
npm install
npm run dev     # starts at http://localhost:3000
```

To test a production build locally:

```bash
npm run build
npm run start
```
