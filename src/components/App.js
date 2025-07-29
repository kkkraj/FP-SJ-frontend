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
    const currentUser = { currentUser: user };
    localStorage.setItem("token", user.jwt);
    setAuth(currentUser);
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
    api.auth.signup(userData)
      .then((response) => response.json())
      .then((userData) => {
        if (userData.error) {
          setError(true);
        } else {
          console.log(userData);
        }
      })
      .catch((error) => {
        console.error('Signup error:', error);
        setError(true);
      });

    setUser({
      name: '',
      username: '',
      email: '',
      password: '',
      password_confirmation: ''
    });
  };

  const loggedIn = !!auth.currentUser.id;
  console.log(`logged-in? ${loggedIn}`);
  console.log(`current user id: ${auth.currentUser.id}`);

  return (
    <div id="app">
      {loggedIn ? (
        <Welcome 
          loading={loading} 
          currentUser={auth.currentUser}
          handleLogout={handleLogout}
          handleDeleteUser={handleDeleteUser}
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
