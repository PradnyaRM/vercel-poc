# Vercel Login Guide

This document covers all the ways to authenticate with Vercel — via the dashboard, CLI, and tokens — so you can deploy and manage this project.

---

## 1. Login via Vercel Dashboard

### Supported Login Methods

| Method | Steps |
|--------|-------|
| **GitHub** | Click "Continue with GitHub" → Authorise Vercel |
| **GitLab** | Click "Continue with GitLab" → Authorise Vercel |
| **Bitbucket** | Click "Continue with Bitbucket" → Authorise Vercel |
| **Email (Magic Link)** | Enter your email → Click the link sent to your inbox |
| **SAML SSO** | Enter your team slug → Authenticate via your identity provider |

### Steps

1. Go to [vercel.com/login](https://vercel.com/login).
2. Choose your preferred login method.
3. Complete authentication — you will be redirected to your Vercel dashboard.

---

## 2. Login via Vercel CLI

The CLI is used to deploy and manage projects from your terminal.

### Install the CLI

```bash
npm install -g vercel
```

### Login

```bash
vercel login
```

You will be prompted to choose a login method:

```
? Log in to Vercel
  Continue with GitHub
  Continue with GitLab
  Continue with Bitbucket
  Continue with Email
  Continue with SAML Single Sign-On
```

Select one and follow the browser prompt to complete authentication. Once done, the terminal confirms:

```
Congratulations! You are now logged in.
```

### Verify Login

```bash
vercel whoami
```

Output:

```
your-username
```

### Logout

```bash
vercel logout
```

---

## 3. Login with a Token (CI/CD & Automation)

For non-interactive environments like Bitbucket Pipelines, GitHub Actions, or scripts, use a **Vercel API token** instead of browser-based login.

### Generate a Token

1. Go to [vercel.com/account/tokens](https://vercel.com/account/tokens).
2. Click **"Create Token"**.
3. Give it a descriptive name (e.g., `bitbucket-pipelines`).
4. Select the **scope** (full account or a specific team).
5. Set an **expiration** (recommended: 90 days or less).
6. Click **Create** and copy the token — it is shown only once.

### Use the Token in CLI Commands

Pass the token via the `--token` flag:

```bash
vercel pull --yes --environment=production --token=$VERCEL_TOKEN
vercel build --prod --token=$VERCEL_TOKEN
vercel deploy --prebuilt --prod --token=$VERCEL_TOKEN
```

### Use the Token as an Environment Variable

Set it once so you don't need to pass `--token` every time:

```bash
export VERCEL_TOKEN=your_token_here
vercel whoami   # uses the token automatically
```

For Bitbucket Pipelines, add `VERCEL_TOKEN` as a **secured repository variable** (see [`BITBUCKET_INTEGRATION.md`](./BITBUCKET_INTEGRATION.md)).

---

## 4. SAML Single Sign-On (SSO)

SAML SSO is available on **Vercel Pro and Enterprise** plans. It lets your team authenticate through an Identity Provider (IdP) such as Okta, Azure AD, or Google Workspace.

### Setup (Team Admin only)

1. Go to **Team Settings → Security → SAML SSO**.
2. Download the Vercel SP metadata or copy the ACS URL.
3. Create a SAML application in your IdP and paste the metadata.
4. Copy the IdP metadata URL back into Vercel and click **Save**.
5. Enable **"Require SAML SSO"** to enforce it for all team members.

### Login with SAML SSO

```bash
vercel login --sso
```

Or on the dashboard, enter your **team slug** at [vercel.com/login](https://vercel.com/login) and you will be redirected to your IdP.

---

## 5. Switching Between Accounts / Teams

### List available teams

```bash
vercel teams list
```

### Switch to a team

```bash
vercel teams switch <team-slug>
```

### Switch to personal account

```bash
vercel teams switch
# Select "My Account" from the prompt
```

---

## 6. Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| `Error: Not authenticated` | Not logged in or token expired | Run `vercel login` or refresh your token |
| Browser does not open | Headless / SSH environment | Copy the URL printed in terminal and open it manually |
| `Invalid token` | Token was deleted or expired | Generate a new token at vercel.com/account/tokens |
| SAML redirect loop | IdP misconfigured | Check ACS URL and entity ID in your IdP settings |
| `You are not a member of this team` | Wrong account or team scope | Run `vercel teams switch` to select the correct team |

---

## 7. Useful Commands Summary

```bash
vercel login              # Interactive login via browser
vercel login --sso        # Login via SAML SSO
vercel logout             # Log out of the CLI
vercel whoami             # Show currently authenticated user
vercel teams list         # List all teams you belong to
vercel teams switch       # Switch active team or personal account
```

---

## Useful References

| Resource | Link |
|----------|------|
| Vercel Login page | https://vercel.com/login |
| CLI Authentication docs | https://vercel.com/docs/cli/login |
| API Tokens | https://vercel.com/account/tokens |
| SAML SSO docs | https://vercel.com/docs/security/saml |
