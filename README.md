# Vercel PoC — Next.js + Serverless API

A minimal Proof of Concept demonstrating how to deploy a **Next.js** application
(frontend + serverless API) on **Vercel** in minutes.

---

## Project Structure

```
vercel-poc/
├── pages/
│   ├── index.js          # Homepage UI
│   ├── _app.js           # Next.js app wrapper
│   └── api/
│       └── hello.js      # Serverless API endpoint → /api/hello
├── styles/
│   ├── globals.css
│   └── Home.module.css
├── .env.example          # Environment variable template
├── .gitignore
├── next.config.js
├── vercel.json           # Vercel deployment config
└── package.json
```

---

## Setup (Local Development)

### Prerequisites
- Node.js 18+
- npm 9+
- Vercel CLI (`npm i -g vercel`)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
# Edit .env.local if needed (defaults work out of the box)
```

### 3. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## API Endpoint

### `GET /api/hello`

Returns a JSON payload with message, timestamp, and runtime metadata.

**Example response:**
```json
{
  "message": "Hello from Vercel PoC!",
  "timestamp": "2026-04-09T10:30:00.000Z",
  "environment": "production",
  "region": "iad1"
}
```

**Logging:** every request is logged to stdout:
```
[2026-04-09T10:30:00.000Z] GET /api/hello — user-agent: Mozilla/5.0 ...
```

---

## Deployment on Vercel

### Option A — Vercel CLI (recommended for PoC)

```bash
# 1. Install Vercel CLI globally (once)
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy to a preview URL (great for testing)
vercel

# 4. Promote to production
vercel --prod
```

Vercel auto-detects Next.js and configures everything automatically.

### Option B — Git Integration (recommended for teams)

1. Push this repo to GitHub / GitLab / Bitbucket
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo
3. Every `git push` triggers a **preview deployment**
4. Merging to `main` triggers a **production deployment**

---

## Bitbucket Integration

### Overview

Vercel supports direct integration with **Bitbucket Cloud** repositories. Once connected, every push to any branch automatically triggers a Vercel deployment — no manual steps required.

| Trigger | Result |
|---------|--------|
| Push to `main` | Production deployment |
| Push to any other branch | Unique preview URL |
| Open / update a Pull Request | Preview URL posted as a PR comment |

---

### Prerequisites

- A [Vercel account](https://vercel.com/signup) (free tier is sufficient for PoC)
- A **Bitbucket Cloud** account (Bitbucket Server / Data Center is not supported by the native integration)
- This repository pushed to a Bitbucket Cloud repo

---

### Step 1 — Push the repo to Bitbucket

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit"

# Add your Bitbucket remote (replace placeholders)
git remote add origin https://bitbucket.org/<workspace>/<repo-slug>.git

# Push
git push -u origin main
```

---

### Step 2 — Connect Bitbucket to Vercel

1. Log in to [vercel.com](https://vercel.com) and go to **Overview → Add New → Project**.
2. Click **"Continue with Bitbucket"** and authorise Vercel to access your Bitbucket account.
3. Select the **workspace** and **repository** (`vercel-poc`).
4. Vercel auto-detects Next.js — leave the framework preset as **Next.js**.
5. (Optional) Configure environment variables under **Environment Variables** before clicking Deploy.
6. Click **Deploy**. Vercel builds and publishes the app within ~30 seconds.

> **Tip:** If you belong to multiple Bitbucket workspaces, make sure to grant access to the correct workspace during the OAuth flow.

---

### Step 3 — Verify automatic deployments

After the initial setup every push triggers a deployment automatically:

```bash
# Make a change
echo "// test" >> pages/index.js
git add pages/index.js
git commit -m "test: trigger Vercel deployment"
git push
```

Within seconds a new deployment appears in the Vercel dashboard with a unique preview URL.

---

### Step 4 — Pull Request preview deployments

When you open or update a Pull Request on Bitbucket, Vercel posts a comment with the preview URL:

```
Vercel deployment for this pull request:
  Preview: https://vercel-poc-git-<branch>-<team>.vercel.app
  Status:  Ready
```

This lets reviewers test changes live before merging — no staging server needed.

---

### Step 5 — (Optional) Bitbucket Pipelines CI/CD

You can combine Bitbucket Pipelines with the Vercel CLI for more control (e.g., running tests before deployment).

Create `bitbucket-pipelines.yml` in the project root:

```yaml
image: node:18

pipelines:
  default:
    - step:
        name: Install & Test
        caches:
          - node
        script:
          - npm ci
          - npm run lint
          - npm run build

  branches:
    main:
      - step:
          name: Install & Test
          caches:
            - node
          script:
            - npm ci
            - npm run lint
            - npm run build
      - step:
          name: Deploy to Vercel (Production)
          script:
            - npm install -g vercel
            - vercel pull --yes --environment=production --token=$VERCEL_TOKEN
            - vercel build --prod --token=$VERCEL_TOKEN
            - vercel deploy --prebuilt --prod --token=$VERCEL_TOKEN
```

**Required Bitbucket repository variables** (set under *Repository settings → Repository variables*):

| Variable | Description |
|----------|-------------|
| `VERCEL_TOKEN` | Vercel API token — create at *vercel.com/account/tokens* |
| `VERCEL_ORG_ID` | Found in *vercel.com → Settings → General → Team ID* |
| `VERCEL_PROJECT_ID` | Found in *Project → Settings → General → Project ID* |

> Set these as **secured** (masked) variables so they are never exposed in logs.

---

### Disconnecting Bitbucket

To remove the Bitbucket integration without deleting the project:

1. Open the project in Vercel → **Settings → Git**.
2. Click **"Disconnect"** next to the connected repository.
3. The project remains on Vercel; only the automatic deployment trigger is removed.

---

## Environment Variables on Vercel

Add variables in **Project → Settings → Environment Variables** on the Vercel
dashboard, or via the CLI:

```bash
vercel env add APP_NAME
vercel env add NEXT_PUBLIC_APP_VERSION
```

Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser bundle.
All others are server-side only (safe for secrets).

---

## Preview Deployments

Every `git push` to a non-main branch automatically gets its own unique URL:

```
https://vercel-poc-git-feature-branch-<team>.vercel.app
```

This lets you share and test changes before merging — no staging server needed.

---

## Expected Output

| Step | What you see |
|------|-------------|
| `npm run dev` | App at `localhost:3000`, hot-reload enabled |
| Click "Call /api/hello" | JSON response rendered in the UI |
| `vercel` | Unique preview URL in ~30 seconds |
| `vercel --prod` | Production URL updated instantly |

---

## Observations

| Dimension | Experience |
|-----------|-----------|
| **Speed** | Cold start < 300 ms for simple handlers; build + deploy ~30 s |
| **Ease of use** | Zero config needed — Vercel detects Next.js automatically |
| **Serverless** | Each `pages/api/*.js` file becomes an isolated function |
| **Env vars** | Dashboard UI or CLI; no manual server config |
| **Preview URLs** | Instant per-branch URLs eliminate the need for a staging env |
| **Logs** | `vercel logs <url>` streams function stdout in real time |

---

## Useful Commands

```bash
npm run dev          # Local dev server with hot reload
npm run build        # Production build
npm run start        # Serve the production build locally
vercel               # Deploy → preview URL
vercel --prod        # Deploy → production URL
vercel logs <url>    # Stream live function logs
vercel env ls        # List environment variables
```
