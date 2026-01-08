# Supabase Setup Guide

## Step 1: Create a Supabase Account

1. You should see the Supabase homepage now in your browser
2. Click on "Start your project" or "Sign in" 
3. Sign up with your email or GitHub account
4. Verify your email if required

## Step 2: Create a New Project

1. Once logged in, click "New Project"
2. Fill in the project details:
   - **Name**: `sistem-terintegrasi` (or any name you prefer)
   - **Database Password**: Create a strong password (SAVE THIS!)
   - **Region**: Choose the closest region to you (for Indonesia, try Singapore)
   - **Pricing Plan**: Free tier is fine for development

3. Click "Create new project" and wait for it to initialize (takes 1-2 minutes)

## Step 3: Get Your Connection String

1. Once your project is ready, go to **Settings** (gear icon in sidebar)
2. Navigate to **Database** section
3. Scroll down to "Connection string" section
4. Copy the **URI** connection string (starts with `postgresql://`)
5. Replace `[YOUR-PASSWORD]` in the connection string with the database password you created

## Step 4: Update Your .env File

Create a `.env` file in your project root with:

```env
DATABASE_URL=your-connection-string-here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-min-32-characters
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important:**
- For `NEXTAUTH_SECRET`, you can generate one by running:
  ```bash
  openssl rand -base64 32
  ```
  Or use any random 32+ character string

## Step 5: Install Dependencies & Run Database Migrations

```bash
npm install
npm run db:push
```

This will:
1. Install all required packages
2. Create all database tables in your Supabase PostgreSQL database

## You're Ready!

Once the steps above are complete, you can start the development server:

```bash
npm run dev
```

Then open http://localhost:3000 in your browser!

---

**Note:** I'll continue building the application while you set up Supabase. Once you have your connection string, just update the `.env` file and run the commands above.
