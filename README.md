# Employee Passport

Day-one onboarding passport built with Vite + React, deployed on Netlify, with the Attendance tab wired to a Lark Base.

## Quick start

```bash
npm install
npm run dev          # Vite only (Attendance form will fail to submit without functions)
npm run dev:netlify  # Vite + Netlify Functions (full Attendance flow)
```

Open http://localhost:5173 (or the URL Netlify CLI prints).

## Environment variables

Copy `.env.example` → `.env` and fill in:

| Var | Where to get it |
| --- | --- |
| `LARK_APP_ID` / `LARK_APP_SECRET` | Lark Open Platform → your custom app → Credentials |
| `LARK_BASE_APP_TOKEN` | Open the Base in browser; URL is `https://.../base/<APP_TOKEN>?table=<TABLE_ID>` |
| `LARK_TABLE_ID` | Same URL as above |
| `LARK_FIELD_*` | Match the column names in your Lark Base attendance table exactly |
| `LARK_API_BASE` | Default `https://open.larksuite.com`. Use `https://open.feishu.cn` for China tenants. |

The Lark app needs the **bitable:app** scope (read+write) and must be added as a collaborator on the target Base.

## Branches

- `main` — default branch; integration / development trunk
- `dev` — Netlify branch deploy (preview URL)
- `prod` — Netlify production deploy (custom domain)

Typical flow: feature branch → PR → `main` → merge into `dev` to stage → merge into `prod` to release.

## Netlify setup checklist

1. Connect this repo to a new Netlify site.
2. **Production branch** = `prod`.
3. Enable **branch deploys** for `dev` (and optionally `main`).
4. Build settings auto-detect from `netlify.toml`.
5. Add the env vars above under **Site settings → Environment variables** for both Production and Branch deploy contexts.
6. First deploy: push to `dev` → preview URL; once happy, fast-forward `prod` → production.

## Configuring branches (the `<select>` options)

Edit `BRANCH_OPTIONS` in [src/config.js](src/config.js). Values must match the option labels of the **Branch** single-select field in the Lark Base table.

## Project structure

```
src/
  App.jsx
  main.jsx
  index.css
  config.js                # BRANCH_OPTIONS
  components/
    EmployeePassport.jsx   # passport UI (3 tabs)
    AttendanceForm.jsx     # check-in form
  lib/
    api.js                 # fetch wrapper for /api/lark-attendance
netlify/
  functions/
    lark-attendance.js     # POST → Lark Base
```
