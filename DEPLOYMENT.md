# Deploying Slekco (Railway + Vercel)

The app is split across two hosts:

- **Backend** (Laravel API + MySQL) -> **Railway**
- **Frontend** (React SPA) -> **Vercel**

Both deploy from the same GitHub monorepo (`Slecko-Modern-Multipurpose-Store`) using a "root directory" setting so each platform builds only its own folder.

---

## Part 1 - Push latest code to GitHub

From the project root:

```bash
git add .
git commit -m "Configure Railway + Vercel deployment"
git push origin main
```

---

## Part 2 - Deploy the backend on Railway

### 2.1 Create the project + database

1. Go to https://railway.app and sign in with GitHub.
2. Click **New Project** -> **Deploy from GitHub repo** -> select your repo.
3. When the service is created, open **Settings** -> **Root Directory** and set it to `backend`.
4. Click **New** (in the project canvas) -> **Database** -> **Add MySQL**.

### 2.2 Set environment variables

Open the **backend service** -> **Variables** tab and add the values from
`backend/.env.railway.example`. The important ones:

| Variable | Value |
|----------|-------|
| `APP_NAME` | `Slekco` |
| `APP_ENV` | `production` |
| `APP_DEBUG` | `false` |
| `APP_KEY` | leave blank (auto-generated on first boot) |
| `DB_CONNECTION` | `mysql` |
| `DB_HOST` | `${{MySQL.MYSQLHOST}}` |
| `DB_PORT` | `${{MySQL.MYSQLPORT}}` |
| `DB_DATABASE` | `${{MySQL.MYSQLDATABASE}}` |
| `DB_USERNAME` | `${{MySQL.MYSQLUSER}}` |
| `DB_PASSWORD` | `${{MySQL.MYSQLPASSWORD}}` |
| `CORS_ALLOWED_ORIGINS` | your Vercel URL (set after Part 3) |
| `SESSION_DRIVER` | `file` |
| `CACHE_STORE` | `file` |
| `QUEUE_CONNECTION` | `sync` |
| `LOG_CHANNEL` | `stderr` |

> The `${{MySQL.*}}` syntax references the MySQL service Railway created.
> If the reference syntax gives trouble, copy the raw values from the
> MySQL service's own **Variables** tab instead.

### 2.3 Generate a public domain

1. In the backend service, open **Settings** -> **Networking** -> **Generate Domain**.
2. Copy the URL (e.g. `https://slekco-production.up.railway.app`).
3. Set `APP_URL` to this URL in the Variables tab.

### 2.4 Deploy

Railway auto-deploys on push. The `nixpacks.toml` installs PHP + Composer deps,
and `railway-start.sh` runs on boot to:
- generate `APP_KEY` if missing,
- cache config/routes,
- run `php artisan migrate --force`,
- run `php artisan db:seed --force` (seeder skips if data already exists),
- start `php artisan serve` on Railway's `$PORT`.

### 2.5 Verify

Visit `https://<your-railway-domain>/api/products/featured` - you should see JSON
with 8 featured products.

---

## Part 3 - Deploy the frontend on Vercel

### 3.1 Import the project

1. Go to https://vercel.com and sign in with GitHub.
2. Click **Add New** -> **Project** -> import your repo.
3. In the configuration screen:
   - **Root Directory:** click **Edit** and select `frontend`.
   - **Framework Preset:** Vite (auto-detected).
   - Build command and output dir are already defined in `frontend/vercel.json`.

### 3.2 Set the API URL environment variable

Under **Environment Variables**, add:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://<your-railway-domain>/api` |

(Use the Railway domain from Part 2.3, with `/api` appended and no trailing slash.)

### 3.3 Deploy

Click **Deploy**. Vercel runs `npm run build` and serves the static SPA.
The `vercel.json` rewrites all routes to `index.html`, so deep links like
`/products/smart-watch-pro-x` work on refresh.

---

## Part 4 - Connect the two (CORS)

1. Copy your live Vercel URL (e.g. `https://slekco.vercel.app`).
2. Back in **Railway** -> backend service -> **Variables**, set:
   ```
   CORS_ALLOWED_ORIGINS=https://slekco.vercel.app
   ```
   (No trailing slash. For multiple origins, separate with commas.)
3. Railway redeploys automatically. The API now accepts requests from your frontend.

---

## Part 5 - Final test

Open your Vercel URL and confirm:
- Homepage loads featured products and categories
- Search and category/brand filters work
- Product detail pages open
- Add to cart / update quantity / remove works
- Checkout form validates and submits an order

---

## Redeploying after code changes

Just push to GitHub:

```bash
git add .
git commit -m "your change"
git push origin main
```

Both Railway and Vercel watch the repo and redeploy automatically.

---

## Troubleshooting

| Symptom | Likely cause / fix |
|---------|--------------------|
| Frontend loads but no products, console shows CORS error | `CORS_ALLOWED_ORIGINS` on Railway doesn't match the Vercel URL exactly (check https/trailing slash) |
| Frontend shows network error to `localhost:8000` | `VITE_API_URL` not set in Vercel; add it and redeploy |
| Railway build fails on composer | Confirm PHP 8.2 in `nixpacks.toml`; check build logs |
| 500 on API, `APP_DEBUG=true` shows DB error | Database variables wrong; verify the `${{MySQL.*}}` refs or paste raw values |
| Migrations didn't run | Check Railway deploy logs for the `railway-start.sh` output |
| Refresh on `/products` 404s | `vercel.json` rewrites missing - confirm it's committed in `frontend/` |
