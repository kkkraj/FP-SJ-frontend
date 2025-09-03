import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthLanding() {
    const navigate = useNavigate();

    return (
        <div className="auth-landing-simple">
            <div className="auth-content">
                <div className="welcome-text">
                    <p className="welcome-subtitle">Welcome To</p>
                    <h1 className="app-title">SPACE JOURNAL</h1>
                </div>
                
                <div className="account-prompt">
                    <p>Have an Account? <span className="link-text" onClick={() => navigate('/login')}>Log In</span> or <span className="link-text" onClick={() => navigate('/signup')}>Sign Up</span> to Create Your Space Today</p>
                </div>
                
                <div className="auth-button-group">
                    <button className="btn-primary" onClick={() => navigate('/signup')}>Signup</button>
                    <button className="btn-secondary" onClick={() => navigate('/login')}>Login</button>
                </div>
            </div>
        </div>
    );
}
