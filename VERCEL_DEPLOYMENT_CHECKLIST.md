# Vercel Deployment Checklist ✅

## Pre-Deployment Checklist

### ✅ Security & Authentication
- [x] **JWT_SECRET**: Removed fallback secret, added production validation
- [x] **Cookie Security**: Secure flag set in production, proper domain handling
- [x] **Email Validation**: Added email format validation in send-otp route
- [x] **Environment Variables**: Added validation and .env.example file

### ✅ Database Configuration
- [x] **DATABASE_URL**: Added validation for production
- [x] **Prisma Client**: Added postinstall script for automatic generation
- [x] **Connection Handling**: Improved error handling for missing database URL

### ✅ Build Configuration
- [x] **Build Script**: Updated to include `prisma generate`
- [x] **Postinstall**: Added automatic Prisma client generation
- [x] **Next.js Config**: Optimized for Vercel deployment

### ✅ Email Service
- [x] **Resend Configuration**: Made email domain configurable via RESEND_FROM_EMAIL
- [x] **Fallback**: Graceful fallback to console logging in development

### ✅ Application URLs
- [x] **Logout Redirect**: Improved URL detection for Vercel deployments
- [x] **Auto-detection**: Uses VERCEL_URL when available

## Required Environment Variables for Vercel

Set these in your Vercel project settings (Settings → Environment Variables):

### Required:
1. **DATABASE_URL** - Your PostgreSQL connection string
   - If using Vercel Postgres: Automatically provided
   - Otherwise: Format: `postgresql://user:password@host:port/database?schema=public`

2. **JWT_SECRET** - A strong random secret for JWT signing
   - Generate with: `openssl rand -base64 32`
   - **CRITICAL**: Never use the default/fallback in production

### Optional but Recommended:
3. **RESEND_API_KEY** - Your Resend API key for sending emails
   - Get from: https://resend.com/api-keys
   - Without this, OTP codes will only be logged to console

4. **RESEND_FROM_EMAIL** - Verified email address in Resend
   - Format: `noreply@yourdomain.com` or `linkink <noreply@yourdomain.com>`
   - Defaults to `noreply@yourdomain.com` if not set

5. **NEXT_PUBLIC_APP_URL** - Your production domain
   - Auto-detected from VERCEL_URL if not set
   - Only needed if you want to override the auto-detection

## Vercel Deployment Steps

1. **Connect Repository**
   - Push your code to GitHub/GitLab/Bitbucket
   - Import project in Vercel dashboard

2. **Configure Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all required variables listed above
   - Make sure to set them for Production, Preview, and Development environments

3. **Set Up Database**
   - If using Vercel Postgres:
     - Add Vercel Postgres integration in Vercel dashboard
     - DATABASE_URL will be automatically set
   - If using external database:
     - Add DATABASE_URL manually
     - Ensure database is accessible from Vercel's IP ranges

4. **Run Database Migrations**
   - Vercel will run `postinstall` automatically (which includes `prisma generate`)
   - For initial setup, you may need to run migrations manually:
     ```bash
     npx prisma migrate deploy
     ```
   - Or use Vercel's CLI: `vercel env pull` then `npx prisma migrate deploy`

5. **Deploy**
   - Vercel will automatically build and deploy
   - Check build logs for any issues
   - Test authentication flow after deployment

## Post-Deployment Verification

- [ ] Test login flow (send OTP, verify OTP)
- [ ] Verify cookies are set correctly (check browser DevTools)
- [ ] Test protected routes (should redirect to login if not authenticated)
- [ ] Verify email sending works (check Resend dashboard)
- [ ] Test database operations (create shelf, add item, etc.)
- [ ] Check error logs in Vercel dashboard

## Common Issues & Solutions

### Issue: "JWT_SECRET must be set"
**Solution**: Add JWT_SECRET environment variable in Vercel settings

### Issue: "DATABASE_URL must be set"
**Solution**: Add DATABASE_URL or connect Vercel Postgres integration

### Issue: Emails not sending
**Solution**: 
- Verify RESEND_API_KEY is set correctly
- Verify RESEND_FROM_EMAIL matches a verified domain in Resend
- Check Resend dashboard for delivery status

### Issue: Prisma Client not found
**Solution**: 
- Ensure `postinstall` script runs (should happen automatically)
- Check build logs for Prisma generation errors

### Issue: Cookies not persisting
**Solution**: 
- Verify secure flag is set (automatic in production)
- Check domain settings match your Vercel deployment
- Ensure HTTPS is enabled (automatic on Vercel)

## Security Best Practices

✅ **Implemented:**
- JWT_SECRET validation in production
- Secure cookies in production
- HttpOnly cookies to prevent XSS
- Email validation
- Environment variable validation

⚠️ **Additional Recommendations:**
- Use Vercel's built-in environment variable encryption
- Enable Vercel's DDoS protection
- Set up rate limiting for auth endpoints (consider Vercel Edge Config)
- Monitor authentication failures in logs
- Regularly rotate JWT_SECRET (requires re-authentication of all users)

## Support

If you encounter issues:
1. Check Vercel build logs
2. Check Vercel function logs
3. Verify all environment variables are set
4. Test locally with same environment variables

