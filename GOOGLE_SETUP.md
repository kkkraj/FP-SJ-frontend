# Google Sign-In Setup Guide

## The 400 Error Fix

The 400 error you're seeing is because the Google Client ID isn't configured yet. Follow these steps:

### Step 1: Get Your Google Client ID

1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API** (or **Google Identity**)
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Choose **Web application** as the application type
6. Add these to **Authorized JavaScript origins**:
   - `http://localhost:3001`
   - `http://localhost:3000` (for your backend)
7. Copy the **Client ID** (it looks like: `123456789-abcdefg.apps.googleusercontent.com`)

### Step 2: Create Environment File

Create a `.env` file in your project root (same level as package.json):

```bash
# .env file
REACT_APP_GOOGLE_CLIENT_ID=your-actual-client-id-here
```

Replace `your-actual-client-id-here` with the Client ID you copied.

### Step 3: Restart Your Development Server

```bash
npm start
```

### Step 4: Test

1. Open your browser console (F12)
2. Go to the login page
3. You should see debug messages about the Google configuration
4. Try clicking the Google sign-in button

### Common Issues:

- **400 Error**: Client ID not configured or invalid
- **403 Error**: OAuth consent screen not configured
- **Popup blocked**: Browser blocking popups (allow popups for localhost)

### Debug Information

The app will now show debug information in the console to help you troubleshoot any issues.

## Next Steps

Once Google sign-in is working, you'll need to implement the backend endpoint:
- `POST /api/v1/auth/google` - to verify the Google token and create/login the user
