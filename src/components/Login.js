import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Login(props) {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [userInfo, setUserInfo] = useState({
        username: "",
        password: ""
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUserInfo(prevInfo => ({ ...prevInfo, [name]: value }));
        // Clear error when user starts typing
        if (error) setError(null);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        loginUser(userInfo);
    };

    const loginUser = (userInfo) => {
        api.auth.login(userInfo)
          .then((response) => {
            if (response.error) {
              setError('general');
            } else {
              props.handleLogin(response);
              // Navigate to welcome page after successful login
              navigate('/');
            }
          })
          .catch((error) => {
            console.error('Login error:', error);
            console.log('Error message:', error.message);
            console.log('Error status:', error.status);
            console.log('Error response body:', error.responseBody);
            console.log('Full error object:', error);
            
            // Now we can use the HTTP status codes to distinguish between errors
            if (error.status === 404) {
              // User not found
              setError('user_not_found');
            } else {
              // Wrong password (401) or other errors
              setError('general');
            }
          });
    };

    const getErrorMessage = () => {
        if (error === 'user_not_found') {
            return "That username isn't in our system. Want to try again?";
        } else if (error === 'general') {
            return "Incorrect username or password, please try again";
        }
        return null;
    };

    return (
        <div>
            {error && <p style={{color: "Chocolate"}}>{getErrorMessage()}</p>}
            <div>
                <form onSubmit={handleSubmit}>
                    <div className="sign-form">
                        <div>
                            <input 
                                type="text" 
                                name="username" 
                                value={userInfo.username} 
                                onChange={handleChange}
                            />
                            <label className="active">Username</label>
                        </div>
                        <div>
                            <input 
                                type="password" 
                                name="password" 
                                value={userInfo.password} 
                                onChange={handleChange}
                            />
                            <label className="active">Password</label>
                        </div>
                        <br/>
                        <div>
                            <button className="waves-effect waves-light btn" type="submit">Login</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}