import '../App.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../services/api";
import Home from './Home';
import Welcome from './Welcome';

function App() {
  const navigate = useNavigate();
  const [auth, setAuth] = useState({ currentUser: {} });
  const [loading, setLoading] = useState(true);
  const [signup, setSignup] = useState(false);
  const [error, setError] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    password_confirmation: ""
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.auth.getCurrentUser().then((data) => {
        setAuth({ currentUser: data.user });
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (user) => {
    console.log('handleLogin called with user:', user);
    // Extract the actual user data from the nested response
    const userData = user.user || user;
    const currentUser = { currentUser: userData };
    localStorage.setItem("token", user.token || user.jwt);
    setAuth(currentUser);
    console.log('Auth state updated, currentUser:', userData);
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
    // Update the auth state with the new user data
    // The backend might return only the updated field, so merge with existing data
    const userData = updatedUserData.user || updatedUserData;
    
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
    console.log('Account updated, new user data:', mergedUserData);
    console.log('Auth state after update:', currentUser);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser(prevUser => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSignup(true);
    createNewUser({ user });
  };

  const createNewUser = (userData) => {
    console.log('Sending signup data:', userData.user);
    console.log('Full userData object:', userData);
    
    // Try different data structures that the backend might expect
    const userInfo = userData.user;
    
    // First try: Send user data directly
    api.auth.signup(userInfo)
      .then((response) => {
        console.log('Signup response:', response);
        if (response.error) {
          setError(true);
        } else {
          console.log('Signup successful:', response);
          
          // Clear the form
          setUser({
            name: '',
            username: '',
            email: '',
            password: '',
            password_confirmation: ''
          });
          
          // Show success message and redirect to login
          alert('Signup successful! Please log in with your new account.');
          
          // Reset signup state to show login form
          setSignup(false);
          setError(false);
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
              setError(true);
            } else {
              console.log('Alternative signup successful:', response);
              
              // Clear the form
              setUser({
                name: '',
                username: '',
                email: '',
                password: '',
                password_confirmation: ''
              });
              
              // Show success message and redirect to login
              alert('Signup successful! Please log in with your new account.');
              
              // Reset signup state to show login form
              setSignup(false);
              setError(false);
            }
          })
          .catch((altError) => {
            console.error('Alternative signup also failed:', altError);
            setError(true);
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
  console.log(`currentUser username:`, auth.currentUser.username);

  return (
    <div id="app">
      {loggedIn ? (
        <Welcome 
          loading={loading} 
          currentUser={auth.currentUser}
          handleLogout={handleLogout}
          handleDeleteUser={handleDeleteUser}
          onAccountUpdate={handleAccountUpdate}
        />
      ) : (
        <Home 
          error={error}
          loading={loading}
          signup={signup}
          user={user} 
          handleChange={handleChange} 
          handleSubmit={handleSubmit}
          handleLogin={handleLogin}
        />
      )}
    </div>
  );
}

export default App;
