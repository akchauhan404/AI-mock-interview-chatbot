# Deployment Guide for AI Interview Platform

This guide provides step-by-step instructions for deploying the AI Interview Platform to Vercel with a PostgreSQL database.

## Prerequisites

- A Vercel account
- A PostgreSQL database (recommended providers: Render, ElephantSQL, Supabase, or Neon)
- OpenAI API key (optional, for real AI functionality)

## Database Setup

### Option 1: Using Render PostgreSQL (Recommended)

1. Go to [Render](https://render.com) and create an account
2. Click "New" → "PostgreSQL"
3. Choose a name for your database
4. Select the free tier or appropriate plan
5. Click "Create Database"
6. Once created, copy the "External Database URL" from the database dashboard

### Option 2: Using Supabase

1. Go to [Supabase](https://supabase.com) and create an account
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string under "Connection string" → "URI"

### Option 3: Using ElephantSQL

1. Go to [ElephantSQL](https://www.elephantsql.com) and create an account
2. Create a new instance (Tiny Turtle is free)
3. Copy the URL from the instance details

## Vercel Deployment

### Step 1: Connect Repository

1. Go to [Vercel](https://vercel.com) and sign in
2. Click "New Project"
3. Import your Git repository containing the AI Interview Platform code
4. Select the repository and click "Import"

### Step 2: Configure Environment Variables

In the Vercel project settings, add the following environment variables:

```env
# Database (replace with your actual database URL)
DATABASE_URL=postgresql://username:password@host:port/database

# NextAuth.js (generate secure random strings)
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-secure-random-string-here

# OpenAI API (optional - leave empty for mock functionality)
OPENAI_API_KEY=your-openai-api-key-here

# File Upload
MAX_FILE_SIZE=10485760

# JWT (generate a secure random string)
JWT_SECRET=your-jwt-secret-here
```

**Important**: 
- Replace `DATABASE_URL` with your actual PostgreSQL connection string
- Generate secure random strings for `NEXTAUTH_SECRET` and `JWT_SECRET`
- Update `NEXTAUTH_URL` to match your Vercel deployment URL

### Step 3: Deploy

1. Click "Deploy" in Vercel
2. Wait for the deployment to complete
3. The first deployment might fail due to database migrations - this is normal

### Step 4: Run Database Migrations

After the initial deployment, you need to run database migrations:

1. Go to your Vercel project dashboard
2. Click on "Functions" tab
3. Find any API function and click on it
4. In the function logs, you should see Prisma attempting to connect
5. If there are migration errors, you can run migrations manually:

**Option A: Using Vercel CLI**
```bash
npx vercel env pull .env.local
npx prisma migrate deploy
```

**Option B: Using a temporary deployment**
Create a temporary API route to run migrations:

1. Add this file temporarily: `src/app/api/migrate/route.ts`
```typescript
import { NextResponse } from 'next/server'
import { exec } from 'child_process'

export async function GET() {
  return new Promise((resolve) => {
    exec('npx prisma migrate deploy', (error, stdout, stderr) => {
      if (error) {
        resolve(NextResponse.json({ error: error.message }, { status: 500 }))
      } else {
        resolve(NextResponse.json({ success: true, output: stdout }))
      }
    })
  })
}
```

2. Deploy the changes
3. Visit `https://your-app.vercel.app/api/migrate`
4. Remove the migration route after successful migration

## Post-Deployment Verification

1. Visit your deployed application
2. Test user registration and login
3. Try uploading a resume for analysis
4. Start a text-based interview
5. Check that all pages load correctly

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js | Yes |
| `NEXTAUTH_URL` | Your app's URL | Yes |
| `JWT_SECRET` | Secret for JWT tokens | Yes |
| `OPENAI_API_KEY` | OpenAI API key for real AI functionality | No |
| `MAX_FILE_SIZE` | Maximum file upload size in bytes | No |

## Troubleshooting

### Database Connection Issues

- Ensure `DATABASE_URL` is correctly formatted
- Check that your database allows external connections
- Verify the database is running and accessible

### Build Failures

- Check Vercel build logs for specific errors
- Ensure all environment variables are set
- Verify that `postinstall` script runs successfully

### Migration Issues

- Run `npx prisma migrate deploy` manually
- Check database permissions
- Ensure the database schema is up to date

### API Route Timeouts

- API routes have a 30-second timeout limit (configured in `vercel.json`)
- For longer operations, consider using background jobs or streaming responses

## Security Considerations

1. **Environment Variables**: Never commit `.env` files to version control
2. **Database Security**: Use strong passwords and enable SSL connections
3. **API Keys**: Rotate API keys regularly
4. **CORS**: Configure CORS policies if needed for external integrations

## Monitoring and Maintenance

- Monitor Vercel function logs for errors
- Set up database monitoring and backups
- Regularly update dependencies
- Monitor API usage and costs (especially for OpenAI API)

## Scaling Considerations

- Vercel automatically scales based on traffic
- Consider database connection pooling for high traffic
- Monitor database performance and upgrade plan if needed
- Implement caching strategies for frequently accessed data

For additional support, refer to:
- [Vercel Documentation](https://vercel.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
