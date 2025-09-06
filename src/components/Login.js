import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppleLogin from 'react-apple-login';
import { checkGoogleConfig, GOOGLE_CLIENT_ID } from '../config/google';
import { checkAppleConfig, APPLE_CLIENT_ID, APPLE_REDIRECT_URI } from '../config/apple';
import api from '../services/api';
import loginImg from '../images/login-img.png';

export default function Login(props) {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
    const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
    const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
    const [forgotPasswordError, setForgotPasswordError] = useState(null);
    const [userInfo, setUserInfo] = useState({
        email: "",
        password: ""
    });
    const [fieldErrors, setFieldErrors] = useState({
        email: false,
        password: false
    });

    // Debug OAuth configuration on component mount
    useEffect(() => {
        checkGoogleConfig();
        checkAppleConfig();
        loadGoogleAPI();
    }, []);

    const loadGoogleAPI = () => {
        // Load Google API script if not already loaded
        if (!window.google) {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
            
            script.onload = () => {
                initializeGoogleAPI();
            };
        } else {
            initializeGoogleAPI();
        }
    };

    const initializeGoogleAPI = () => {
        if (window.google && GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== 'your-google-client-id-here') {
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleGoogleSuccess
            });
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUserInfo(prevInfo => ({ ...prevInfo, [name]: value }));
        // Clear error when user starts typing
        if (error) setError(null);
        // Clear field error when user starts typing
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({
                ...prev,
                [name]: false
            }));
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        
        // Reset field errors
        setFieldErrors({ email: false, password: false });
        
        // Check if email is empty
        if (!userInfo.email) {
            setError('Please enter your email address');
            setFieldErrors(prev => ({ ...prev, email: true }));
            return;
        }
        
        // Check if password is empty
        if (!userInfo.password) {
            setError('Please enter your password');
            setFieldErrors(prev => ({ ...prev, password: true }));
            return;
        }
        
        // If validation passes, proceed with login
        loginUser(userInfo);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleForgotPassword = () => {
        setShowForgotPassword(true);
        setForgotPasswordSuccess(false);
        setForgotPasswordError(null);
        setForgotPasswordEmail("");
    };

    const closeForgotPassword = () => {
        setShowForgotPassword(false);
        setForgotPasswordSuccess(false);
        setForgotPasswordError(null);
        setForgotPasswordEmail("");
    };

    const handleForgotPasswordEmailChange = (event) => {
        setForgotPasswordEmail(event.target.value);
        if (forgotPasswordError) setForgotPasswordError(null);
    };

    const handleForgotPasswordSubmit = async (event) => {
        event.preventDefault();
        if (!forgotPasswordEmail.trim()) {
            setForgotPasswordError("Please enter your email address");
            return;
        }

        setForgotPasswordLoading(true);
        setForgotPasswordError(null);

        try {
            // Call the forgot password API
            await api.auth.forgotPassword(forgotPasswordEmail);
            setForgotPasswordSuccess(true);
        } catch (error) {
            console.error('Forgot password error:', error);
            setForgotPasswordError(error.message || "Failed to send reset email. Please try again.");
        } finally {
            setForgotPasswordLoading(false);
        }
    };

    const handleGoogleSuccess = async (response) => {
        console.log('Google Sign-In Success:', response);
        
        try {
            // Send the credential to your backend for verification and authentication
            const backendResponse = await fetch('http://localhost:3000/api/v1/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential: response.credential }),
            });
            
            const data = await backendResponse.json();
            
            if (backendResponse.ok) {
                console.log('Google login successful:', data);
                // Handle successful login
                props.handleLogin(data);
                navigate('/home');
            } else {
                console.error('Google login failed:', data);
                setError(data.message || 'Google sign-in failed. Please try again.');
            }
        } catch (error) {
            console.error('Google login error:', error);
            setError('Google sign-in failed. Please try again.');
        }
    };

    const handleGoogleClick = () => {
        if (window.google && window.google.accounts) {
            window.google.accounts.id.prompt();
        } else {
            setError('❌ Google sign-in not available. Please check your configuration.');
        }
    };

    const handleAppleSuccess = async (response) => {
        console.log('Apple Sign-In Success:', response);
        
        try {
            // Send the authorization code to your backend for verification and authentication
            const backendResponse = await fetch('http://localhost:3000/api/v1/auth/apple', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    code: response.authorization.code,
                    user: response.user 
                }),
            });
            
            const data = await backendResponse.json();
            
            if (backendResponse.ok) {
                console.log('Apple login successful:', data);
                // Handle successful login
                props.handleLogin(data);
                navigate('/home');
            } else {
                console.error('Apple login failed:', data);
                setError(data.message || 'Apple sign-in failed. Please try again.');
            }
        } catch (error) {
            console.error('Apple login error:', error);
            setError('Apple sign-in failed. Please try again.');
        }
    };

    const handleAppleError = (error) => {
        console.error('Apple Sign-In failed:', error);
        
        // Check if it's a configuration error
        if (error.error === 'popup_closed_by_user') {
            setError('Apple sign-in was cancelled. Please try again.');
        } else if (error.error === 'access_denied') {
            setError('Apple sign-in was denied. Please try again.');
        } else if (error.error === 'invalid_client') {
            setError('❌ Apple Client ID not configured! Please check the console for setup instructions.');
        } else {
            setError('Apple sign-in failed. Please check your configuration and try again.');
        }
    };

    const loginUser = (userInfo) => {
        // Send email directly to backend
        const loginData = {
            email: userInfo.email,
            password: userInfo.password
        };
        
        api.auth.login(loginData)
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
            console.log('Error status:', error.status);
            console.log('Error message:', error.message);
            
            // Check if error message contains "User not found" or status is 404
            if ((error.message && error.message.includes('User not found')) || error.status === 404) {
              setError('user_not_found');
            } else {
              setError('general');
            }
          });
    };

    const getErrorMessage = () => {
        if (error === 'user_not_found') {
            return "We couldn't find an account with this email";
        } else if (error === 'general') {
            return "Incorrect email or password, please try again";
        } else if (typeof error === 'string') {
            // Handle validation errors (like "Please enter your email address")
            return error;
        }
        return null;
    };

    return (
        <div className="login-container">
            {/* Left Column - Login Form */}
            <div className="login-left">
                <div className="login-content">
                    <h1 className="login-title">Welcome back!</h1>
                    <p className="login-instruction">Sign in to access your journal</p>
                    
                    {error && !error.includes('Please enter') && <div className="error-message">{getErrorMessage()}</div>}
                    
                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <div className="input-wrapper">
                                <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
                                    <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/>
                                </svg>
                                <input 
                                    type="text" 
                                    id="email"
                                    name="email" 
                                    value={userInfo.email} 
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    className={`form-input ${fieldErrors.email ? 'error' : ''}`}
                                />
                            </div>
                        </div>
                        
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-wrapper">
                                <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
                                    <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z"/>
                                </svg>
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password" 
                                    value={userInfo.password} 
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    className={`form-input ${fieldErrors.password ? 'error' : ''}`}
                                />
                                <button 
                                    type="button"
                                    className="password-toggle"
                                    onClick={togglePasswordVisibility}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
                                        {showPassword ? (
                                            <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/>
                                        ) : (
                                            <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/>
                                        )}
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        <div className="forgot-password">
                            <button 
                                type="button" 
                                className="forgot-link" 
                                onClick={handleForgotPassword}
                            >
                                Forgot password?
                            </button>
                        </div>
                        
                        <button type="submit" className="signin-button">
                            <span>Sign in</span>
                            <svg className="button-arrow" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
                                <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z"/>
                            </svg>
                        </button>
                    </form>
                    
                    <div className="divider">
                        <span className="divider-text">OR CONTINUE WITH</span>
                    </div>
                    
                    <div className="social-login">
                        <button 
                            className="google-button"
                            onClick={handleGoogleClick}
                        >
                            <svg className="social-icon" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="currentColor">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Google
                        </button>
                        <AppleLogin
                            clientId={APPLE_CLIENT_ID}
                            redirectURI={APPLE_REDIRECT_URI}
                            scope="email name"
                            responseType="code"
                            responseMode="query"
                            usePopup={true}
                            onSuccess={handleAppleSuccess}
                            onError={handleAppleError}
                            render={(renderProps) => (
                                <button 
                                    className="apple-button"
                                    onClick={renderProps.onClick}
                                    disabled={renderProps.disabled}
                                >
                                    <svg className="social-icon" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="currentColor">
                                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.79 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                                    </svg>
                                    Apple
                                </button>
                            )}
                        />
                    </div>
                </div>
            </div>
            
            {/* Right Column - Illustration Area */}
            <div className="login-right">
                <div className="illustration-area">
                    {/* Astronaut on whale illustration */}
                    <div className="illustration-container">
                        <img 
                            src={loginImg} 
                            alt="Astronaut riding a whale through space" 
                            className="astronaut-illustration"
                        />
                    </div>
                    
                    <div className="right-content">
                        <h3 className="new-user-text">Are you new to Space Journal?</h3>
                        <div className="right-buttons">
                            <button className="right-button primary" onClick={() => navigate('/signup')}>
                                Create an account
                            </button>
                            <button className="right-button secondary" onClick={() => navigate('/how-it-works')}>
                                see how it works
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="legal-links">
                    <a href="/terms" className="legal-link">Terms of Service</a>
                    <span className="divider">|</span>
                    <a href="/privacy" className="legal-link">Privacy Policy</a>
                </div>
            </div>

            {/* Forgot Password Modal */}
            {showForgotPassword && (
                <div className="modal-overlay" onClick={closeForgotPassword}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Reset Password</h3>
                            <button className="modal-close" onClick={closeForgotPassword}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                                    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                                </svg>
                            </button>
                        </div>
                        
                        {!forgotPasswordSuccess ? (
                            <>
                                <div className="modal-body">
                                    <p>Enter your email address and we'll send you a link to reset your password.</p>
                                    
                                    {forgotPasswordError && (
                                        <div className="error-message">
                                            {forgotPasswordError}
                                        </div>
                                    )}
                                    
                                    <form onSubmit={handleForgotPasswordSubmit} className="forgot-password-form">
                                        <div className="input-group">
                                            <label htmlFor="forgot-email">Email Address</label>
                                            <div className="input-wrapper">
                                                <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
                                                    <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/>
                                                </svg>
                                                <input 
                                                    type="text" 
                                                    id="forgot-email"
                                                    name="forgot-email" 
                                                    value={forgotPasswordEmail} 
                                                    onChange={handleForgotPasswordEmailChange}
                                                    placeholder="Enter your email address"
                                                    className="form-input"
                                                    disabled={forgotPasswordLoading}
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="modal-footer">
                                            <button 
                                                type="button" 
                                                className="btn-secondary" 
                                                onClick={closeForgotPassword}
                                                disabled={forgotPasswordLoading}
                                            >
                                                Cancel
                                            </button>
                                            <button 
                                                type="submit" 
                                                className="btn-primary"
                                                disabled={forgotPasswordLoading}
                                            >
                                                {forgotPasswordLoading ? (
                                                    <>
                                                        <svg className="loading-spinner" xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="currentColor">
                                                            <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Z"/>
                                                        </svg>
                                                        Sending...
                                                    </>
                                                ) : (
                                                    'Send Link'
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <div className="modal-body">
                                <div className="success-message">
                                    <svg className="success-icon" xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="rgb(104, 187, 183)">
                                        <path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
                                    </svg>
                                    <h4>Check Your Email</h4>
                                    <p>We've sent a password reset link to <strong>{forgotPasswordEmail}</strong></p>
                                </div>
                                
                                <div className="modal-footer single-button">
                                    <button className="btn-primary" onClick={closeForgotPassword}>
                                        Got it!
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}