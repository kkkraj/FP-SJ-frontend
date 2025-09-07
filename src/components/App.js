import '../App.css';
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import api from "../services/api";
import Home from './Home';
import Welcome from './Welcome';
import Signup from './Signup';
import Login from './Login';
import TermsOfService from './TermsOfService';
import PrivacyPolicy from './PrivacyPolicy';
import HowItWorks from './HowItWorks';
import SignupSuccess from './SignupSuccess';

function App() {
  // const navigate = useNavigate(); // Unused for now
  const [auth, setAuth] = useState({ currentUser: {} });
  const [loading, setLoading] = useState(true);
  const [signup, setSignup] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: ""
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.auth.getCurrentUser().then((data) => {
        console.log('getCurrentUser response:', data);
        console.log('User data from getCurrentUser:', data.user);
        
        // Check for stored photo URL in localStorage
        const storedPhoto = localStorage.getItem('user_photo');
        if (storedPhoto && !data.user.photo) {
          console.log('Found stored photo URL:', storedPhoto);
          data.user.photo = storedPhoto;
        }
        
        setAuth({ currentUser: data.user });
        setLoading(false);
      }).catch((error) => {
        console.error('getCurrentUser error:', error);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (user) => {
    console.log('handleLogin called with user:', user);
    console.log('Login response structure:', JSON.stringify(user, null, 2));
    // Extract the actual user data from the nested response
    const userData = user.user || user;
    
    // Check for stored photo URL in localStorage
    const storedPhoto = localStorage.getItem('user_photo');
    if (storedPhoto && !userData.photo) {
      console.log('Found stored photo URL during login:', storedPhoto);
      userData.photo = storedPhoto;
    }
    
    const currentUser = { currentUser: userData };
    localStorage.setItem("token", user.token || user.jwt);
    setAuth(currentUser);
    console.log('Auth state updated, currentUser:', userData);
    console.log('User photo in login response:', userData.photo);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuth({ currentUser: {} });
  };

  const handleDeleteUser = (user) => {
    api.auth.deleteUser(user);
    handleLogout();
    alert("Your Account has been Deleted");
  };

  const handleAccountUpdate = (updatedUserData) => {
    // Extract user data from response
    const userData = updatedUserData.user || updatedUserData;
    
    // Check if we have valid user data
    if (!userData || (!userData.name && !userData.email)) {
      return;
    }
    
    // Merge the updated data with existing user data to preserve all fields
    const mergedUserData = {
      ...auth.currentUser,  // Keep existing data
      ...userData           // Override with updated data
    };
    
    // Ensure we have the user ID to maintain login state
    if (!mergedUserData.id && auth.currentUser.id) {
        mergedUserData.id = auth.currentUser.id;
    }
    
    const currentUser = { currentUser: mergedUserData };
    setAuth(currentUser);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser(prevUser => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = (event) => {
    console.log('Form submit triggered!');
    event.preventDefault();
    console.log('Current user state:', user);
    setSignup(true);
    createNewUser({ user });
  };

  const createNewUser = (userData) => {
    // Try different data structures that the backend might expect
    const userInfo = userData.user;
    
    // First try: Send user data directly
    api.auth.signup(userInfo)
      .then((response) => {
        console.log('Signup response:', response);
        if (response.error) {
          setError(response.error);
        } else {
          console.log('Signup successful:', response);
          
          // Clear the form
          setUser({
                          name: '',
              email: '',
            password: '',
            password_confirmation: ''
          });
          
          // Navigate to success page
          window.location.href = '/signup-success';
        }
      })
      .catch((error) => {
        console.error('Signup error:', error);
        
        // If first attempt fails, try alternative endpoint
        console.log('Trying alternative signup endpoint...');
        api.auth.signupAlternative(userInfo)
          .then((response) => {
            console.log('Alternative signup response:', response);
            if (response.error) {
              setError(response.error);
            } else {
              console.log('Alternative signup successful:', response);
              
              // Clear the form
              setUser({
                              name: '',
              email: '',
                password: '',
                password_confirmation: ''
              });
              
              // Navigate to success page
              window.location.href = '/signup-success';
            }
          })
          .catch((altError) => {
            console.error('Alternative signup also failed:', altError);
            setError('general');
          });
      });
  };

  const loggedIn = !!auth.currentUser.id;
  console.log(`logged-in? ${loggedIn}`);
  console.log(`current user id: ${auth.currentUser.id}`);
  console.log(`full auth state:`, auth);
  console.log(`currentUser object:`, auth.currentUser);
  console.log(`currentUser name:`, auth.currentUser.name);
  console.log(`currentUser email:`, auth.currentUser.email);

  return (
    <div id="app">
      {loggedIn ? (
        <Routes>
          <Route path="/how-it-works" element={
            <HowItWorks currentUser={auth.currentUser} handleLogout={handleLogout} />
          } />
          <Route path="/terms" element={
            <TermsOfService currentUser={auth.currentUser} handleLogout={handleLogout} />
          } />
          <Route path="/privacy" element={
            <PrivacyPolicy currentUser={auth.currentUser} handleLogout={handleLogout} />
          } />
          <Route path="/*" element={
            <Welcome 
              loading={loading} 
              currentUser={auth.currentUser}
              handleLogout={handleLogout}
              handleDeleteUser={handleDeleteUser}
              onAccountUpdate={handleAccountUpdate}
            />
          } />
        </Routes>
      ) : (
                            <Routes>
                      <Route path="/" element={
                        <Home 
                          error={error}
                          loading={loading}
                          signup={signup}
                          user={user} 
                          handleChange={handleChange} 
                          handleSubmit={handleSubmit}
                          handleLogin={handleLogin}
                        />
                      } />
                      <Route path="/home" element={
                        <Home 
                          error={error}
                          loading={loading}
                          signup={signup}
                          user={user} 
                          handleChange={handleChange} 
                          handleSubmit={handleSubmit}
                          handleLogin={handleLogin}
                        />
                      } />
                      <Route path="/signup" element={
                        <Signup 
                          user={user} 
                          handleChange={handleChange} 
                          handleSubmit={handleSubmit}
                          error={error}
                          setError={setError}
                        />
                      } />
                      <Route path="/login" element={
                        <Login handleLogin={handleLogin} />
                      } />
                      <Route path="/terms" element={
                        <TermsOfService currentUser={auth.currentUser} handleLogout={handleLogout} />
                      } />
                      <Route path="/privacy" element={
                        <PrivacyPolicy currentUser={auth.currentUser} handleLogout={handleLogout} />
                      } />
                      <Route path="/how-it-works" element={
                        <HowItWorks currentUser={auth.currentUser} handleLogout={handleLogout} />
                      } />
                      <Route path="/signup-success" element={
                        <SignupSuccess />
                      } />
                    </Routes>
      )}
    </div>
  );
}

export default App;
