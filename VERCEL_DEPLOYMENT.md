# 🚀 Vercel Deployment Checklist

## Pre-Deployment Checklist

### 1. ✅ Environment Variables
- [ ] OpenAI API key is ready
- [ ] API key starts with `sk-`
- [ ] API key is active (test at platform.openai.com)
- [ ] You have sufficient OpenAI credits

### 2. ✅ Code Configuration
- [ ] `runtime = 'nodejs'` in API route ✅ (Already configured)
- [ ] `dynamic = 'force-dynamic'` ✅ (Already configured)
- [ ] `maxDuration = 30` ✅ (Already configured)
- [ ] Non-streaming for mobile compatibility ✅ (Already configured)

### 3. ✅ Build Test
```bash
npm run build
```
Should complete without errors.

---

## Deployment Steps

### Option 1: Deploy via Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# During deployment, you'll be asked:
# Add OPENAI_API_KEY? → Yes → Paste your API key
```

### Option 2: Deploy via GitHub Integration

1. **Connect GitHub Repo to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Click "Deploy"

2. **Add Environment Variables**
   - While deployment is building, go to Settings
   - Navigate to Environment Variables
   - Add `OPENAI_API_KEY` with your key
   - Enable for: Production, Preview, Development

3. **Redeploy**
   - After adding env variables, go to Deployments
   - Click "..." → Redeploy
   - Wait for new deployment to complete

---

## Post-Deployment Verification

### Step 1: Test Health Endpoint
Visit in browser:
```
https://your-project.vercel.app/api/health
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "OpenAI API key is working correctly",
  "model": "gpt-4o-mini",
  "timestamp": "..."
}
```

### Step 2: Test on Desktop
1. Open your production URL
2. Fill out the form with test data
3. Click "Generate Santa's Letter"
4. Wait for letter to appear (5-15 seconds)
5. Verify letter content looks good
6. Test print functionality

### Step 3: Test on Mobile (CRITICAL!)
1. Open production URL on actual mobile device
2. Test on mobile Safari (iOS)
3. Test on Chrome (Android)
4. Fill form and generate letter
5. Verify UI is responsive
6. Test print on mobile

### Step 4: Test Different Scenarios
- [ ] Good list letter
- [ ] Naughty list letter
- [ ] With gifts specified
- [ ] With additional notes
- [ ] With all optional fields filled
- [ ] With minimal fields (just name)

---

## Troubleshooting Deployment

### Issue: Environment Variable Not Working

**Symptoms:**
- `/api/health` returns "OpenAI API key is not configured"
- Form submission fails with API key error

**Solution:**
1. Verify environment variable is set in Vercel dashboard
2. Check spelling: Must be exactly `OPENAI_API_KEY`
3. Ensure it's enabled for Production environment
4. **REDEPLOY** after adding/changing env variables

### Issue: Build Fails

**Common Causes:**
- TypeScript errors
- Missing dependencies
- Syntax errors

**Solution:**
```bash
# Test build locally first
npm run build

# Check for linting errors
npm run lint

# Fix any errors shown
```

### Issue: Function Timeout

**Symptoms:**
- Request takes too long and fails
- "Function timeout" error

**Solution:**
Already configured with `maxDuration = 30`, but if still timing out:
1. Check OpenAI API status: https://status.openai.com/
2. Try reducing `max_tokens` in API call (currently 400)
3. Check Vercel function limits for your plan

### Issue: Works Locally, Not in Production

**Common Causes:**
1. Environment variables not set in Vercel
2. Different Node.js version
3. Case-sensitive file paths (Vercel is case-sensitive!)

**Solution:**
1. Add environment variables to Vercel
2. Check file import paths match exact casing
3. Ensure all dependencies are in `package.json`

---

## Vercel Configuration

Your project uses these Vercel-specific configs:

### API Routes (`src/app/api/generate-letter/route.ts`)
```typescript
export const runtime = 'nodejs';        // Use Node.js runtime
export const dynamic = 'force-dynamic';  // Disable caching
export const maxDuration = 30;          // 30 second timeout
```

### Why These Settings?
- `nodejs`: Required for OpenAI SDK (full Node.js environment)
- `force-dynamic`: Ensures fresh AI responses every time
- `maxDuration: 30`: AI generation can take 5-15 seconds

---

## Performance Monitoring

### After Deployment, Monitor:

1. **Function Logs**
   - Vercel Dashboard → Your Project → Functions
   - Check for errors in `/api/generate-letter`

2. **Analytics**
   - Vercel Dashboard → Analytics
   - Monitor page load times
   - Check mobile vs desktop performance

3. **OpenAI Usage**
   - https://platform.openai.com/usage
   - Monitor token usage and costs
   - Set up usage alerts

---

## Environment Variables Summary

| Variable | Required | Example | Where |
|----------|----------|---------|-------|
| `OPENAI_API_KEY` | Yes | `sk-proj-...` | Vercel Dashboard |

### How to Add in Vercel:
1. Dashboard → Project → Settings
2. Environment Variables
3. Add `OPENAI_API_KEY`
4. Value: Your OpenAI API key
5. Select: Production ✅ Preview ✅ Development ✅
6. Save → Redeploy

---

## Cost Considerations

### OpenAI API Costs (gpt-4o-mini)
- ~$0.15 per 1M input tokens
- ~$0.60 per 1M output tokens
- Each letter: ~200 input + 400 output tokens
- **Estimated: $0.0003 - $0.0005 per letter**

### Vercel Costs
- Hobby plan: Free (sufficient for most use cases)
- Pro plan: $20/month (if you need more)
- Function execution: Usually covered in free tier

---

## Deployment Checklist

Before marking as complete:

- [ ] Environment variable `OPENAI_API_KEY` added to Vercel
- [ ] Production deployment successful
- [ ] `/api/health` returns success
- [ ] Test letter generation works on desktop
- [ ] Test letter generation works on mobile Safari
- [ ] Test letter generation works on mobile Chrome
- [ ] Print functionality works
- [ ] "Generate Another Letter" button works
- [ ] Form validation works (can't submit empty name)
- [ ] Error messages display correctly
- [ ] Loading states work (spinner shows during generation)

---

## Quick Commands Reference

```bash
# Local development
npm run dev

# Test build locally
npm run build

# Start production build locally
npm run start

# Deploy to Vercel production
vercel --prod

# Check Vercel deployment status
vercel ls

# View deployment logs
vercel logs
```

---

## Support Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **OpenAI API Documentation**: https://platform.openai.com/docs
- **Project README**: See `README.md` for project-specific info

---

## 🎯 Success Criteria

Your deployment is successful when:

✅ Health endpoint returns success  
✅ Desktop users can generate letters  
✅ Mobile users can generate letters  
✅ Letters display correctly  
✅ Print functionality works  
✅ No console errors  
✅ Response time < 15 seconds  
✅ All form validations work  

---

**Remember: Most mobile issues in production are caused by missing environment variables! Always check this first!**

