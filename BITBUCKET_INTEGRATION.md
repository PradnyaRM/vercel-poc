# Integrating the Project with Bitbucket

This guide walks you through connecting this Next.js Vercel PoC to **Bitbucket Cloud** for automated deployments.

---

## Prerequisites

- [Vercel account](https://vercel.com/signup) (free tier is sufficient)
- [Bitbucket Cloud](https://bitbucket.org) account
- Node.js 18+ and npm 9+ installed locally
- Vercel CLI: `npm install -g vercel`

---

## Step 1 — Push the Project to Bitbucket

If you haven't already pushed this project to Bitbucket, follow these steps:

```bash
# 1. Initialize git
git init

# 2. Stage all files
git add .

# 3. Initial commit
git commit -m "Initial commit"

# 4. Add your Bitbucket remote (replace <workspace> and <repo-slug>)
git remote add origin https://bitbucket.org/<workspace>/<repo-slug>.git

# 5. Push to main branch
git push -u origin main
```

> **Note:** Bitbucket Server / Data Center is **not** supported by Vercel's native Git integration. You must use **Bitbucket Cloud**.

---

## Step 2 — Connect Bitbucket to Vercel

1. Log in to [vercel.com](https://vercel.com).
2. Click **Add New → Project** from the dashboard.
3. Click **"Continue with Bitbucket"** and complete the OAuth authorisation.
4. Select the correct **workspace** and the **vercel-poc** repository.
5. Vercel auto-detects **Next.js** — no framework changes needed.
6. (Optional) Add environment variables before the first deploy (see Step 4).
7. Click **Deploy**.

Your app will be live within ~30 seconds.

---

## Step 3 — Automatic Deployments

Once connected, deployments happen automatically on every push:

| Event | Deployment Type | URL |
|-------|----------------|-----|
| Push to `main` | Production | Your configured production domain |
| Push to any other branch | Preview | `https://vercel-poc-git-<branch>-<team>.vercel.app` |
| Open / update a Pull Request | Preview | Posted as a comment on the PR |

### Test it

```bash
# Make any change
echo "// trigger deploy" >> pages/index.js
git add pages/index.js
git commit -m "test: trigger Vercel deployment"
git push
```

Check the Vercel dashboard — a new deployment will appear within seconds.

---

## Step 4 — Environment Variables

### On Vercel Dashboard

1. Go to your project → **Settings → Environment Variables**.
2. Add each variable, select the target environments (Production / Preview / Development), and save.

### Via Vercel CLI

```bash
vercel env add APP_NAME
vercel env add NEXT_PUBLIC_APP_VERSION
```

> Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. All others are server-side only.

---

## Step 5 — Bitbucket Pipelines CI/CD (Optional)

Use **Bitbucket Pipelines** to run lint and build checks before Vercel deploys.

The pipeline configuration is already included in the project at [`bitbucket-pipelines.yml`](./bitbucket-pipelines.yml).

### What the pipeline does

| Pipeline | Trigger | Steps |
|----------|---------|-------|
| `default` | Push to any unmatched branch | Install → Lint → Build |
| `branches: main` | Push to `main` | Install → Lint → Build → Deploy to Production |
| `pull-requests: **` | Any PR open/update | Install → Lint → Build → Deploy Preview |

### Required Repository Variables

Set these in Bitbucket under **Repository settings → Repository variables**. Mark each as **Secured** so values are masked in logs.

| Variable | Where to find it |
|----------|-----------------|
| `VERCEL_TOKEN` | [vercel.com/account/tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | Vercel → **Settings → General → Team ID** |
| `VERCEL_PROJECT_ID` | Vercel → **Project → Settings → General → Project ID** |

---

## Step 6 — Pull Request Preview Deployments

When a PR is opened or updated, Vercel automatically posts a comment:

```
Vercel deployment for this pull request:
  Preview: https://vercel-poc-git-feature-branch-<team>.vercel.app
  Status:  Ready
```

Reviewers can click the URL to test changes live before merging — no staging server needed.

---

## Step 7 — View Logs

Stream live serverless function logs using the Vercel CLI:

```bash
vercel logs https://<your-deployment-url>
```

Or view them in the Vercel dashboard under **Deployments → [deployment] → Functions**.

---

## Disconnecting Bitbucket

To remove the Bitbucket integration without deleting the project:

1. Open your project in Vercel → **Settings → Git**.
2. Click **"Disconnect"** next to the connected repository.

The project remains deployed on Vercel; only the automatic deployment trigger is removed.

---

## Useful References

| Resource | Link |
|----------|------|
| Vercel + Bitbucket docs | https://vercel.com/docs/deployments/git/bitbucket |
| Bitbucket Pipelines docs | https://support.atlassian.com/bitbucket-cloud/docs/bitbucket-pipelines-configuration-reference |
| Vercel CLI reference | https://vercel.com/docs/cli |
| Vercel environment variables | https://vercel.com/docs/projects/environment-variables |
