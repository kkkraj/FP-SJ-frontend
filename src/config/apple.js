// Apple Sign-In Configuration
// Replace with your actual Apple Client ID from Apple Developer Account
export const APPLE_CLIENT_ID = process.env.REACT_APP_APPLE_CLIENT_ID || 'your-apple-client-id-here';
export const APPLE_REDIRECT_URI = process.env.REACT_APP_APPLE_REDIRECT_URI || 'http://localhost:3001';

// Debug function to check if Apple configuration is properly set
export const checkAppleConfig = () => {
  const clientId = process.env.REACT_APP_APPLE_CLIENT_ID;
  console.log('Apple Client ID:', clientId);
  console.log('Is using placeholder:', clientId === 'your-apple-client-id-here' || !clientId);
  
  if (!clientId || clientId === 'your-apple-client-id-here') {
    console.error('❌ Apple Client ID not configured!');
    console.log('Please follow these steps:');
    console.log('1. Go to https://developer.apple.com/account/');
    console.log('2. Sign in with your Apple Developer account');
    console.log('3. Go to "Certificates, Identifiers & Profiles"');
    console.log('4. Click "Identifiers" → "+" to create new identifier');
    console.log('5. Choose "Services IDs" and create one');
    console.log('6. Configure Sign In with Apple capability');
    console.log('7. Add your domain to "Domains and Subdomains"');
    console.log('8. Copy the Identifier and create a .env file with:');
    console.log('   REACT_APP_APPLE_CLIENT_ID=your-actual-apple-client-id-here');
    console.log('   REACT_APP_APPLE_REDIRECT_URI=http://localhost:3001');
    return false;
  }
  
  console.log('✅ Apple Client ID is configured');
  return true;
};

// Instructions for setting up Apple Sign-In:
// 1. Go to https://developer.apple.com/account/
// 2. Sign in with your Apple Developer account
// 3. Go to "Certificates, Identifiers & Profiles"
// 4. Click "Identifiers" → "+" to create new identifier
// 5. Choose "Services IDs" and create one
// 6. Configure Sign In with Apple capability
// 7. Add your domain to "Domains and Subdomains"
// 8. Copy the Identifier and set it as REACT_APP_APPLE_CLIENT_ID in your .env file
