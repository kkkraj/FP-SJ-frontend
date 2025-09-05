// Google OAuth Configuration
// Replace with your actual Google Client ID from Google Cloud Console
export const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'your-google-client-id-here';

// Check if we're using the placeholder
const isUsingPlaceholder = !process.env.REACT_APP_GOOGLE_CLIENT_ID || 
                          process.env.REACT_APP_GOOGLE_CLIENT_ID === 'your-google-client-id-here';

// Debug function to check if Client ID is properly set
export const checkGoogleConfig = () => {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  console.log('Google Client ID:', clientId);
  console.log('Is using placeholder:', clientId === 'your-google-client-id-here' || !clientId);
  
  if (!clientId || clientId === 'your-google-client-id-here') {
    console.error('❌ Google Client ID not configured!');
    console.log('Please follow these steps:');
    console.log('1. Go to https://console.developers.google.com/');
    console.log('2. Create a new project or select existing one');
    console.log('3. Enable Google+ API');
    console.log('4. Go to Credentials → Create OAuth 2.0 Client ID');
    console.log('5. Set application type to "Web application"');
    console.log('6. Add http://localhost:3001 to "Authorized JavaScript origins"');
    console.log('7. Copy the Client ID and create a .env file with:');
    console.log('   REACT_APP_GOOGLE_CLIENT_ID=your-actual-client-id-here');
    return false;
  }
  
  console.log('✅ Google Client ID is configured');
  return true;
};

// Instructions for setting up Google OAuth:
// 1. Go to https://console.developers.google.com/
// 2. Create a new project or select existing one
// 3. Enable Google+ API
// 4. Go to Credentials and create OAuth 2.0 Client ID
// 5. Set application type to "Web application"
// 6. Add your domain to "Authorized JavaScript origins"
// 7. Copy the Client ID and set it as REACT_APP_GOOGLE_CLIENT_ID in your .env file
