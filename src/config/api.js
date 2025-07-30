// API Configuration
const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  API_VERSION: process.env.REACT_APP_API_VERSION || 'v1',
  ENDPOINTS: {
    USERS: '/api/v1/users',
    LOGIN: '/api/v1/login',
    CURRENT_USER: '/api/v1/current_user',
    DIARY_ENTRIES: '/diary_entries',
    MOODS: '/moods',
    USER_MOODS: '/user_moods',
    ACTIVITIES: '/activities',
    USER_ACTIVITIES: '/user_activities'
  }
};

export default API_CONFIG; 