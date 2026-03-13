# Migration Plan: Lovable / Supabase to AWS

The provided `.sql` file (`welile_export_2026-03-12.sql`) is a **"data-only"** dump. It explicitly contains thousands of `INSERT INTO public.<table_name>` rows without any Supabase-specific configuration (`auth` schemas, storage, etc.) or `CREATE TABLE` commands. 

This is the perfect scenario for migrating to an independent AWS database.

## User Review Required
> [!IMPORTANT]  
> Please review this migration strategy. Once you give the go-ahead, I will guide you through running the migration commands locally or I can execute them for you if your AWS database is already running.

## Proposed Migration Steps

### 1. Database Schema Generation (via Prisma)
Because the dump file only contains `INSERT` statements, the tables must exist *before* we run the file. We will use your existing `schema.prisma` to build the empty tables in AWS.
1. You will provide the AWS database connection string.
2. We update the `.env` in the `backend` folder: `DATABASE_URL="postgresql://user:pass@aws-rds-endpoint.com:5432/welile"`
3. Run `npx prisma db push` command to generate the schema structure in the AWS database.

### 2. Data Insertion (via PSQL)
Once the tables are created, we inject the 5,000+ users and millions of rows using the `.sql` file via PostgreSQL's command-line tool `psql`.
1. Run: `psql "$DATABASE_URL" -f welile_export_2026-03-12.sql`
2. This will insert all rows cleanly because Prisma has already built the tables.

### 3. Application Re-start
Ensure all backend services are using the new `DATABASE_URL` and restart the Express server. Because you recently moved to your own OTP authentication, users will simply request an OTP and be seamlessly logged back into their profiles (since all profile UUIDs are preserved).

## Verification Plan

### Automated Tests
- Run `psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM public.profiles;"` to verify all ~5306 profiles are intact.
- Run `npx prisma validate` to ensure the AWS database is perfectly aligned with Prisma.

### Manual Verification
- Start the Express backend and the Vite frontend natively (`npm run start:dev` and `npm run dev`).
- Log in using an OTP on the frontend.
- Verify wallet balances, rent requests, and agent leaderboards show up perfectly.
