# 🚨 Quick Fix for Google 400 Error

## The Problem
The 400 error means your Google Client ID is not configured or invalid.

## Step-by-Step Fix (5 minutes)

### 1. Go to Google Cloud Console
- Open: https://console.developers.google.com/
- Sign in with your Google account

### 2. Create or Select Project
- Click "Select a project" dropdown at the top
- Click "New Project" or select existing project
- Give it a name like "Space Journal App"

### 3. Enable Google+ API
- Go to "APIs & Services" → "Library"
- Search for "Google+ API" or "Google Identity"
- Click on it and press "Enable"

### 4. Create OAuth Credentials
- Go to "APIs & Services" → "Credentials"
- Click "Create Credentials" → "OAuth 2.0 Client ID"
- Choose "Web application"
- Give it a name like "Space Journal Web Client"

### 5. Configure Authorized Origins
In the "Authorized JavaScript origins" section, add:
- `http://localhost:3001`
- `http://localhost:3000`

### 6. Copy the Client ID
- After creating, you'll see a popup with your Client ID
- It looks like: `123456789-abcdefg.apps.googleusercontent.com`
- Copy this entire string

### 7. Update Your .env File
Open the `.env` file in your project root and replace the placeholder:

```bash
REACT_APP_GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
```

### 8. Restart Your Server
```bash
npm start
```

### 9. Test
- Go to your login page
- Check browser console (F12) for debug messages
- Try clicking Google sign-in button

## If You Still Get 400 Error

1. **Check the console** - look for debug messages
2. **Verify the Client ID** - make sure it's exactly as copied
3. **Check the .env file** - make sure there are no extra spaces
4. **Restart the server** - after changing .env file

## Common Mistakes
- ❌ Using the wrong Client ID (using Client Secret instead)
- ❌ Not adding localhost to authorized origins
- ❌ Not restarting the server after changing .env
- ❌ Extra spaces in the .env file

## Need Help?
Check the browser console (F12) for detailed debug information!
