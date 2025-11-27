# 📱 Mobile Troubleshooting Guide for Vercel Production

## Quick Diagnostic Checklist

### 1. ✅ Check Environment Variables in Vercel

**Most Common Issue!** The API key might not be configured in Vercel production.

#### How to Fix:
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: Your OpenAI API key (starts with `sk-`)
   - **Environments**: Check ✅ Production, Preview, Development
5. Click **Save**
6. **IMPORTANT**: Go to **Deployments** and click **Redeploy** (environment variables require redeployment)

#### How to Verify:
- Visit: `https://your-domain.vercel.app/api/health`
- Should see: `{"status":"success","message":"OpenAI API key is working correctly"}`
- If error: Check the error message and follow instructions

---

### 2. 🧪 Test API on Mobile

#### A. Test Health Endpoint
Open Safari/Chrome on mobile and visit:
```
https://your-production-url.vercel.app/api/health
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "OpenAI API key is working correctly",
  "model": "gpt-4o-mini",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**If you see an error:**
- ❌ "OpenAI API key is not configured" → Add to Vercel environment variables
- ❌ "OpenAI API key format is invalid" → Check key starts with `sk-`
- ❌ "OpenAI API key is invalid" → Key is wrong, get new one from OpenAI
- ❌ "OpenAI API quota exceeded" → Check billing at platform.openai.com

#### B. Test Letter Generation API
Use browser console on mobile:

```javascript
fetch('/api/generate-letter', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    childName: 'Test',
    goodThings: 'Being kind',
    badThings: '',
    isOnGoodList: true,
    additionalNotes: '',
    gifts: 'A toy'
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

---

### 3. 📡 Network Issues

#### Symptoms:
- Request hangs/times out
- "Network error" or "Connection Error" messages
- Works on desktop but not mobile

#### Possible Causes:
1. **Mobile Network Too Slow**: AI generation takes 5-15 seconds
2. **Timeout Issues**: Mobile browsers have shorter timeouts
3. **HTTPS Required**: Some mobile browsers block HTTP

#### Solutions:
1. Ensure you're using HTTPS (Vercel provides this automatically)
2. Test on WiFi vs cellular data
3. Check if VPN/firewall is blocking requests
4. Try different mobile browser (Safari vs Chrome)

---

### 4. 🎨 Mobile UI/UX Issues

#### Viewport Issues
Current configuration restricts zoom:
```typescript
viewport: {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // ⚠️ Prevents zooming
}
```

**If users report they can't zoom on mobile**, this might need to be removed.

#### Form Submission Issues
- Double-tap protection is enabled (good!)
- Button requires `childName` to be filled
- Check if keyboard is blocking the submit button

---

### 5. 🐛 Debug Mode

#### Enable Console Logging on Mobile

**For Safari iOS:**
1. Settings → Safari → Advanced → Web Inspector (ON)
2. Connect iPhone to Mac
3. Open Safari on Mac → Develop → [Your iPhone] → [Your Site]

**For Chrome Android:**
1. Settings → Developer Options → USB Debugging (ON)
2. Connect to computer
3. Open Chrome on desktop: `chrome://inspect`
4. Click "Inspect" on your device

#### What to Look For:
- Console errors (red messages)
- Network tab → Failed requests
- Check request/response payloads
- Look for CORS errors

---

### 6. 🚀 Common Fixes

#### Fix 1: Force Redeploy in Vercel
Sometimes Vercel needs a fresh deployment:
1. Go to Vercel Dashboard → Deployments
2. Click "..." menu on latest deployment
3. Click "Redeploy"
4. Select "Use existing Build Cache" = OFF
5. Click "Redeploy"

#### Fix 2: Clear Browser Cache on Mobile
- **iOS Safari**: Settings → Safari → Clear History and Website Data
- **Android Chrome**: Settings → Privacy → Clear Browsing Data

#### Fix 3: Check Vercel Function Logs
1. Go to Vercel Dashboard → Your Project
2. Click on the deployment
3. Go to "Functions" tab
4. Look for `/api/generate-letter` logs
5. Check for errors in the logs

---

### 7. 📊 Test Different Scenarios

| Scenario | Expected Behavior |
|----------|-------------------|
| API key not set | Error: "OpenAI API key is not configured" |
| Invalid API key | Error: "OpenAI API key is invalid" |
| Quota exceeded | Error: "API Quota Exceeded" |
| Slow network | Loading spinner, eventual success |
| Empty form | Button disabled, can't submit |
| Valid form | Letter generated in 5-15 seconds |

---

## 🆘 Still Not Working?

### Collect This Information:

1. **URL**: Your Vercel production URL
2. **Device**: iPhone/Android model and OS version
3. **Browser**: Safari/Chrome version
4. **Error Message**: Exact error text shown to user
5. **Network**: WiFi or cellular data?
6. **Console Errors**: From developer tools
7. **Health Check Result**: Response from `/api/health`

### Quick Test Commands

Run these in mobile browser console:

```javascript
// Test 1: Check if API is reachable
fetch('/api/health').then(r => r.json()).then(console.log);

// Test 2: Check environment
console.log('User Agent:', navigator.userAgent);
console.log('Online:', navigator.onLine);
console.log('Connection:', navigator.connection);

// Test 3: Test basic fetch
fetch('/api/generate-letter', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    childName: 'Mobile Test',
    goodThings: 'Testing',
    badThings: '',
    isOnGoodList: true,
    additionalNotes: '',
  })
}).then(r => r.json()).then(console.log).catch(console.error);
```

---

## 📞 Additional Resources

- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [OpenAI API Keys](https://platform.openai.com/api-keys)
- [OpenAI API Status](https://status.openai.com/)
- [Vercel Support](https://vercel.com/support)

---

## ✅ Verification Steps

After making changes:

1. ✅ Visit `/api/health` on mobile → Should return success
2. ✅ Fill form on mobile → Submit button should be enabled
3. ✅ Click submit → Should see loading spinner
4. ✅ Wait 5-15 seconds → Letter should appear
5. ✅ Check letter formatting → Should be readable
6. ✅ Test print button → Should open print dialog
7. ✅ Test "Generate Another" → Should show form again

---

**Most Important: 90% of mobile issues in production are due to missing environment variables in Vercel!**

