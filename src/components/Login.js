import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Login(props) {
    const navigate = useNavigate();
    const [error, setError] = useState(false);
    const [userInfo, setUserInfo] = useState({
        username: "",
        password: ""
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUserInfo(prevInfo => ({ ...prevInfo, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        loginUser(userInfo);
    };

    const loginUser = (userInfo) => {
        api.auth.login(userInfo)
          .then((response) => {
            if (response.error) {
              setError(true);
            } else {
              props.handleLogin(response);
              navigate('/about');
            }
          })
          .catch((error) => {
            console.error('Login error:', error);
            setError(true);
          });
    };

    return (
        <div>
            {error && <p style={{color: "Chocolate"}}>Incorrect username or password, please Try Again</p>}
            <div>
                <form onChange={handleChange} onSubmit={handleSubmit}>
                    <div className="sign-form">
                        <div>
                            <input type="text" name="username" value={userInfo.username} />
                            <label className="active">Username</label>
                        </div>
                        <div>
                            <input type="password" name="password" value={userInfo.password} />
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