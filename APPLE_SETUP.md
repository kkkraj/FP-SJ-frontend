# Apple Sign-In Setup Guide

## Overview
Apple Sign-In requires an Apple Developer Account and specific configuration. This guide will walk you through the setup process.

## Prerequisites
- Apple Developer Account ($99/year)
- Your app must be served over HTTPS in production
- For development, localhost works fine

## Step-by-Step Setup

### 1. Apple Developer Account Setup
1. Go to [Apple Developer Portal](https://developer.apple.com/account/)
2. Sign in with your Apple ID
3. If you don't have a developer account, enroll in the Apple Developer Program

### 2. Create App ID
1. Go to "Certificates, Identifiers & Profiles"
2. Click "Identifiers" → "+" to create new identifier
3. Choose "App IDs" and create one
4. Give it a name like "Space Journal App"
5. Note the Bundle ID (e.g., `com.yourcompany.spacejournal`)

### 3. Create Services ID (for Sign In with Apple)
1. Go to "Identifiers" → "+" to create new identifier
2. Choose "Services IDs" and create one
3. Give it a name like "Space Journal Web"
4. Check "Sign In with Apple" capability
5. Configure the capability:
   - Primary App ID: Select the App ID you created
   - Domains and Subdomains: Add your domain (e.g., `localhost:3001` for development)
   - Return URLs: Add `http://localhost:3001` for development
6. Save and note the Identifier (this is your Apple Client ID)

### 4. Create Private Key
1. Go to "Keys" → "+" to create new key
2. Give it a name like "Space Journal Sign In Key"
3. Check "Sign In with Apple"
4. Configure: Select the App ID you created
5. Download the key file (.p8 file) - **SAVE THIS SECURELY**
6. Note the Key ID

### 5. Update Your .env File
Add these to your `.env` file:
```bash
REACT_APP_APPLE_CLIENT_ID=your-services-id-here
REACT_APP_APPLE_REDIRECT_URI=http://localhost:3001
```

### 6. Backend Configuration
You'll need to implement the backend endpoint:
- `POST /api/v1/auth/apple` - to verify the Apple authorization code

## Important Notes

### Development vs Production
- **Development**: Use `http://localhost:3001` in domains and return URLs
- **Production**: Use your actual domain with HTTPS

### Security
- Keep your private key (.p8 file) secure
- Never commit it to version control
- Store it securely on your backend server

### Testing
- Apple Sign-In works best on Safari
- Chrome and Firefox may have limited support
- Test on actual iOS devices for best results

## Common Issues

### "Invalid Client" Error
- Check that your Services ID is correct
- Verify the domain is added to the Services ID configuration
- Make sure you're using the Services ID, not the App ID

### "Invalid Redirect URI" Error
- Check that your redirect URI matches exactly what's configured in Apple Developer Portal
- For development: `http://localhost:3001`
- For production: `https://yourdomain.com`

### "Sign In with Apple Not Available"
- Make sure you're testing on a device that supports Sign In with Apple
- Check that the capability is properly configured
- Verify you're using the correct App ID

## Backend Implementation
Your backend needs to:
1. Receive the authorization code from Apple
2. Exchange it for an access token
3. Use the access token to get user information
4. Create or authenticate the user in your system
5. Return your app's JWT token

## Next Steps
1. Complete the Apple Developer setup
2. Update your .env file with the real Apple Client ID
3. Implement the backend endpoint
4. Test the integration

## Resources
- [Apple Sign In Documentation](https://developer.apple.com/sign-in-with-apple/)
- [Apple Sign In REST API](https://developer.apple.com/documentation/sign_in_with_apple/sign_in_with_apple_rest_api)
