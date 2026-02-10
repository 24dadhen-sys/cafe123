# Supabase Migration Guide - Sippins Cafe

## 🎯 Why Migrate to Supabase?

SQLite (`dev.db`) is file-based and **won't work on Vercel** because serverless functions don't have persistent file storage. Supabase provides a free PostgreSQL database that works perfectly with Vercel deployments.

## 📋 Migration Steps

### Step 1: Create Supabase Account

1. Visit [supabase.com](https://supabase.com)
2. Sign up for a free account
3. Click **"New Project"**
4. Fill in:
   - **Name**: `sippins-cafe`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free
5. Click **"Create new project"** (takes ~2 minutes)

### Step 2: Get Database Connection String

1. In your Supabase project dashboard, go to **Settings** (gear icon)
2. Click **Database** in the sidebar
3. Scroll to **Connection string** section
4. Select **Connection pooling** tab
5. Choose **"URI"** format
6. Copy the connection string - it looks like:
   ```
   postgres://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```
7. **Important**: Replace `[YOUR-PASSWORD]` with the password you created in Step 1

### Step 3: Update Environment Variables

#### For Local Development:

1. Open `.env` in your project root
2. Replace the current DATABASE_URL:

```bash
# OLD (SQLite)
DATABASE_URL="file:./dev.db"

# NEW (PostgreSQL)
DATABASE_URL="postgres://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

#### For Vercel Deployment:

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name**: `DATABASE_URL`
   - **Value**: Your Supabase connection string
   - **Environments**: Production, Preview, Development
4. Click **Save**

### Step 4: Update Prisma Schema

✅ **Already done!** The schema has been updated to use PostgreSQL.

Verify `prisma/schema.prisma` shows:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Step 5: Run Migrations

**Stop any running dev server first!** (Ctrl+C)

```bash
# Generate Prisma Client for PostgreSQL
npx prisma generate

# Create and run migrations
npx prisma migrate dev --name init_postgres

# Seed the database with menu data
npx tsx prisma/seed.ts
```

If you see the EPERM error:
1. Close VS Code completely
2. Reopen and try again

### Step 6: Test Locally

```bash
npm run dev
```

Visit `http://localhost:3000` and verify:
- Tables 1-20 appear on homepage
- Menu items load from database
- You can place an order
- Admin panel shows menu items

### Step 7: Deploy to Vercel

```bash
# Push your changes to GitHub
git add .
git commit -m "Migrate to PostgreSQL/Supabase"
git push

# Or deploy directly
vercel --prod
```

Vercel will automatically:
- Read `DATABASE_URL` from environment variables
- Build with PostgreSQL
- Deploy your app

### Step 8: Seed Production Database

After first deployment:

```bash
# Run migrations on production
vercel env pull .env.production
npx prisma migrate deploy

# Seed production data
npx tsx prisma/seed.ts
```

## ✅ Verification Checklist

- [ ] Supabase project created
- [ ] Connection string copied and password replaced
- [ ] `.env` updated locally
- [ ] Migrations run successfully
- [ ] Database seeded with menu items
- [ ] App runs locally with PostgreSQL
- [ ] Vercel environment variables set
- [ ] Deployed to Vercel
- [ ] Production database seeded

## 🔧 Troubleshooting

### "EPERM: operation not permitted"
- **Cause**: Prisma engine file is locked by running process
- **Fix**: Stop `npm run dev`, close VS Code, reopen, try again

### "Database 'postgres' does not exist"
- **Cause**: Wrong connection string or database not ready
- **Fix**: Wait 2-3 minutes after creating Supabase project

### "SSL connection required"
- **Cause**: PostgreSQL requires SSL
- **Fix**: Add `?sslmode=require` to end of DATABASE_URL

### Migration fails
- **Cause**: Old SQLite migrations conflict
- **Fix**: Delete `prisma/migrations` folder and run `npx prisma migrate dev --name init` again

## 📊 Checking Your Data

### Via Supabase Dashboard:
1. Go to **Table Editor** in Supabase
2. Select `Category`, `MenuItem`, `Order` tables
3. View your data directly

### Via Prisma Studio:
```bash
npx prisma studio
```
Opens browser at `http://localhost:5555` to browse/edit data

## 🚀 Benefits of This Setup

- ✅ **Persistent Data**: Orders saved permanently
- ✅ **Scalable**: Free up to 500MB, upgradable
- ✅ **Fast**: Connection pooling optimized
- ✅ **Secure**: SSL encrypted connections
- ✅ **Free**: Perfect for production use

---

**Need Help?** Check Supabase docs: https://supabase.com/docs/guides/database
