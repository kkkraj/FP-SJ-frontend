import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup(props) {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({
        name: false,
        email: false,
        password: false,
        password_confirmation: false
    });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleChange = (event) => {
        props.handleChange(event);
        // Clear error when user starts typing
        if (error) {
            setError(null);
            // Also clear error in parent component
            if (props.setError) {
                props.setError(null);
            }
        }
        // Clear field error when user starts typing
        const { name } = event.target;
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({
                ...prev,
                [name]: false
            }));
        }
    };

    // Function to determine which fields should show error state
    const getFieldErrors = (errorCode) => {
        const errors = { name: false, email: false, password: false, password_confirmation: false };
        
        switch (errorCode) {
            case 'name_required':
            case 'name_too_short':
            case 'name_too_long':
                errors.name = true;
                break;
            case 'email_required':
            case 'invalid_email_format':
            case 'user_exists':
                errors.email = true;
                break;
            case 'password_required':
            case 'password_too_short':
            case 'password_too_long':
                errors.password = true;
                break;
            case 'passwords_dont_match':
                errors.password = true;
                errors.password_confirmation = true;
                break;
            default:
                break;
        }
        
        return errors;
    };

    // Update field errors when error prop changes
    useEffect(() => {
        if (props.error) {
            console.log('Signup error received:', props.error);
            setError(props.error);
            const fieldErrors = getFieldErrors(props.error);
            console.log('Field errors set:', fieldErrors);
            setFieldErrors(fieldErrors);
        } else {
            setError(null);
            setFieldErrors({ name: false, email: false, password: false, password_confirmation: false });
        }
    }, [props.error]);

    const getErrorMessage = () => {
        const currentError = props.error || error;
        if (currentError === 'name_required') {
            return "Name is required";
        } else if (currentError === 'email_required') {
            return "Email is required";
        } else if (currentError === 'password_required') {
            return "Password is required";
        } else if (currentError === 'invalid_email_format') {
            return "Please enter a valid email address";
        } else if (currentError === 'name_too_short') {
            return "Name must be at least 2 characters long";
        } else if (currentError === 'name_too_long') {
            return "Name must be less than 50 characters";
        } else if (currentError === 'passwords_dont_match') {
            return "Password and password confirmation do not match";
        } else if (currentError === 'password_too_short') {
            return "Password must be at least 6 characters long";
        } else if (currentError === 'password_too_long') {
            return "Password must be less than 128 characters";
        } else if (currentError === 'user_exists') {
            return "A user with this email already exists, please log in";
        } else if (currentError === 'validation_failed') {
            return "Failed to create user. Please check your information and try again.";
        } else if (currentError === 'general') {
            return "Unable to create account. Please try again.";
        }
        return currentError;
    };

    return (
        <div className="signup-container">
            <div className="signup-wrapper">
                {/* Left Column - Logo, Divider, Description (40%) */}
                <div className="signup-left">
                    <div className="signup-left-content">
                           <div className="signup-logo">
                               <img src={require('../images/logo.png')} alt="Space Journal Logo" className="logo" />
                           </div>
                           <div className="tagline">
                               <svg className="tagline-icon" xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="currentColor">
                                   <path d="M480-600q-58 0-99-41t-41-99q0-58 41-99t99-41q58 0 99 41t41 99q0 58-41 99t-99 41Zm0-80q25 0 42.5-17.5T540-740q0-25-17.5-42.5T480-800q-25 0-42.5 17.5T420-740q0 25 17.5 42.5T480-680Zm0 600L240-320q-20-20-30-45t-10-55q0-59 40.5-99.5T340-560q29 0 53.5 11t44.5 31l42 42 42-42q20-20 44.5-31t53.5-11q59 0 99.5 40.5T760-420q0 30-10 55t-30 45L480-80Zm0-114 182-182q9-9 13.5-20.5T680-420q0-24-17-42t-43-18q-12 0-21.5 3.5T580-464L480-364 380-464q-6-6-15.5-11t-24.5-5q-26 0-43 18t-17 42q0 12 5 22.5t13 19.5l182 184Zm0-546Zm0 403Z"></path>
                               </svg>
                               <span>Transform your thoughts into clarity</span>
                           </div>
                        <p className="login-instruction">Start your journey into mindful journaling to unlock balance, clarity, and growth.</p>
                        <button className="btn-secondary">see how it works</button>
                    </div>
                </div>

                {/* Right Column - Title and Signup Form (60%) */}
                <div className="signup-right">
                    <div className="signup-form-content">
                        <h1 className="login-title">Create Account</h1>
                        
                        {(props.error || error) && <div className="error-message">{getErrorMessage()}</div>}

                        <form onSubmit={(e) => {
                            console.log('Signup form onSubmit triggered');
                            props.handleSubmit(e);
                        }} className="login-form">
                            <div className="form-group">
                                <div className="input-wrapper">
                                    <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
                                        <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/>
                                    </svg>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        value={props.user.name} 
                                        onChange={handleChange}
                                        className={`form-input ${fieldErrors.name ? 'error' : ''}`}
                                        placeholder="Name"
                                    />
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <div className="input-wrapper">
                                    <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
                                        <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/>
                                    </svg>
                                    <input 
                                        type="text" 
                                        name="email" 
                                        value={props.user.email} 
                                        onChange={handleChange}
                                        className={`form-input ${fieldErrors.email ? 'error' : ''}`}
                                        placeholder="Email Address"
                                    />
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <div className="input-wrapper">
                                    <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
                                        <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z"/>
                                    </svg>
                                    <input 
                                        type={showPassword ? "text" : "password"}
                                        name="password" 
                                        value={props.user.password} 
                                        onChange={handleChange}
                                        className={`form-input ${fieldErrors.password ? 'error' : ''}`}
                                        placeholder="Password"
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
                            
                            <div className="form-group">
                                <div className="input-wrapper">
                                    <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
                                        <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z"/>
                                    </svg>
                                    <input 
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="password_confirmation" 
                                        value={props.user.password_confirmation} 
                                        onChange={handleChange}
                                        className={`form-input ${fieldErrors.password_confirmation ? 'error' : ''}`}
                                        placeholder="Confirm Password"
                                    />
                                    <button 
                                        type="button"
                                        className="password-toggle"
                                        onClick={toggleConfirmPasswordVisibility}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
                                            {showConfirmPassword ? (
                                                <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/>
                                            ) : (
                                                <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/>
                                            )}
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            
                            <div className="terms-agreement">
                                <p>By signing up, you agree to our <button 
                                    type="button"
                                    className="link-button" 
                                    onClick={() => navigate('/terms')}
                                >
                                    terms of service
                                </button></p>
                            </div>
                            
                            <button className="signin-button" type="submit">
                                <span>Create Account</span>
                            </button>
                        </form>

                        <div className="divider">
                            <span className="divider-text">OR</span>
                        </div>

                        <div className="social-login">
                            <button className="google-button" onClick={() => console.log('Google signup clicked')}>
                                <svg className="social-icon" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                <span>Sign up with Google</span>
                            </button>
                            
                            <button className="apple-button" onClick={() => console.log('Apple signup clicked')}>
                                <svg className="social-icon" viewBox="0 0 24 24">
                                    <path fill="#000000" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.96-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.03-3.11z"/>
                                </svg>
                                <span>Sign up with Apple</span>
                            </button>
                        </div>

                        <div className="login-footer">
                            <p>Already have an account? 
                                <button 
                                    className="link-button" 
                                    onClick={() => navigate('/login')}
                                >
                                    Sign in
                                </button>
                            </p>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
}