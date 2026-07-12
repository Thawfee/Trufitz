Deployment checklist — Free hosting (Vercel) + Free Postgres (Supabase)

Overview
- This guide helps you deploy the Next.js app using Vercel (free) and Supabase (free Postgres), and set environment variables for Prisma & NextAuth.

1) Create Supabase project
- Go to https://supabase.com and sign up.
- Create a new project (free tier). Note the project `Database URL` (connection string) and DB credentials.

2) Update Prisma provider locally (optional)
- The repo currently uses SQLite for local dev. To use Supabase Postgres in production, ensure `prisma/schema.prisma` datasource `provider` is `postgresql` and `url` uses env var:

  datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
  }

- If you prefer, keep SQLite for local dev and set `DATABASE_URL` in Vercel to your Supabase URL.

3) Push Prisma schema to Supabase
- Locally, set `DATABASE_URL` to the Supabase connection string (in a local `.env` only):

```bash
# replace with your real URL
export DATABASE_URL="postgresql://..."
npx prisma db push
```

4) Seed data (optional)
- If you need initial data, run your seed script. Example (if present):

```bash
npm run db:seed
```

5) Prepare Vercel
- Sign in to https://vercel.com and import your GitHub repo.
- In Project Settings → Environment Variables, set the following:
  - `DATABASE_URL` = (Supabase connection string)
  - `NEXTAUTH_URL` = `https://your-app.vercel.app`
  - `NEXTAUTH_SECRET` = (generate a secret locally: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
  - Any other env vars from your local `.env` that production needs

6) Deploy
- Push your branch to GitHub and Vercel will build & deploy.
- If build errors mention `DATABASE_URL`, ensure Vercel env vars are set for the correct environment (Production vs Preview).

Notes & Troubleshooting
- Do NOT commit `.env` to the repo. Add `.env` to `.gitignore` (already present).
- For temporary builds without a production DB, the repository includes a safe fallback that avoids build-time crashes when `DATABASE_URL` is not set. This is a convenience for preview builds and local builds without a DB; it does not replace a real production DB.
- If you prefer PlanetScale/Neon, the steps are similar; consult provider docs for connection string details.

If you want, I can:
- Update `prisma/schema.prisma` to `postgresql` now and prepare a push (you'll need to paste the `DATABASE_URL`).
- Provide exact env values to set in Vercel and a checklist to verify a successful deployment.
