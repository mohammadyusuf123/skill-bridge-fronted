# Deployment Guide

This guide covers deploying the Skill Bridge frontend to Vercel and configuring it to work with your backend.

## Prerequisites

- Backend deployed and accessible via HTTPS
- Vercel account
- Repository connected to Vercel

## Environment Variables

### Required Variables for Vercel

You need to set the following environment variables in your Vercel project settings:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.com
NEXT_PUBLIC_APP_URL=https://your-vercel-app.vercel.app

# Better Auth Configuration
BETTER_AUTH_SECRET=<same-secret-as-your-backend>
BETTER_AUTH_URL=https://your-backend-url.com
APP_URL=https://your-vercel-app.vercel.app
```

### Optional Variables (if using OAuth or Email)

```bash
# Email Configuration
GMAIL_APP_PASSWORD=your-gmail-app-password
GMAIL_USER=your-email@gmail.com

# OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Backend Configuration

Your backend must be configured to:

1. **Allow CORS from your Vercel domain**:
   ```javascript
   // In your backend CORS configuration
   cors({
     origin: ['https://your-vercel-app.vercel.app'],
     credentials: true
   })
   ```

2. **Set proper cookie options for production**:
   ```javascript
   // In your Better Auth configuration
   session: {
     cookieCache: {
       enabled: true,
       maxAge: 5 * 60 // 5 minutes
     }
   },
   advanced: {
     cookieOptions: {
       sameSite: 'none', // Required for cross-origin
       secure: true,     // Required for HTTPS
       httpOnly: true
     }
   }
   ```

## Deployment Steps

1. **Push your code to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Fix auth configuration for Vercel deployment"
   git push origin main
   ```

2. **Configure environment variables in Vercel** (as described above)

3. **Redeploy your application**
   - Vercel will automatically redeploy when you push to your repository
   - Or manually trigger a redeploy from the Vercel dashboard

4. **Test the deployment**
   - Visit your Vercel URL
   - Try logging in with test credentials
   - Verify you're redirected to the dashboard and stay logged in
   - Refresh the page to ensure session persists

## Troubleshooting

### Login redirects back to login page

**Cause**: Auth client can't reach the backend or cookies aren't being set.

**Solution**:
- Verify `NEXT_PUBLIC_API_BASE_URL` is set correctly in Vercel
- Check browser DevTools → Network tab for failed API requests
- Check browser DevTools → Application → Cookies to see if session cookie is set

### CORS errors in browser console

**Cause**: Backend not configured to allow requests from Vercel domain.

**Solution**:
- Update backend CORS configuration to include your Vercel domain
- Ensure `credentials: true` is set in CORS config

### Session not persisting across page refreshes

**Cause**: Cookie settings not compatible with cross-origin requests.

**Solution**:
- Ensure backend sets cookies with `sameSite: 'none'` and `secure: true`
- Verify backend is using HTTPS (not HTTP)

### Environment variables not updating

**Cause**: Vercel caches environment variables.

**Solution**:
- After changing environment variables, trigger a new deployment
- Or use the "Redeploy" button in Vercel dashboard

## Local Development

For local development, use the `.env` file with localhost URLs:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Run the development server:
```bash
npm run dev
```

## Production Checklist

- [ ] Backend deployed and accessible via HTTPS
- [ ] Environment variables set in Vercel
- [ ] Backend CORS configured for Vercel domain
- [ ] Backend cookie settings configured for cross-origin
- [ ] Code pushed to repository
- [ ] Vercel deployment successful
- [ ] Login tested on production URL
- [ ] Session persistence verified
