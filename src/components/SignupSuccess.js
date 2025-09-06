import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignupSuccess() {
    const navigate = useNavigate();

    return (
        <div className="signup-success-container">
            <div className="signup-success-content">
                <div className="success-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" height="100px" viewBox="0 -960 960 960" width="100px" fill="rgb(104, 187, 183)">
                        {/* Animated checkmark path */}
                        <path 
                            d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" 
                            fill="rgb(104, 187, 183)"
                        />
                    </svg>
                </div>
                
                <h1 className="success-title">Account created successfully!</h1>
                
                <div className="success-buttons">
                    <button 
                        className="btn-primary success-btn"
                        onClick={() => navigate('/login')}
                    >
                        Sign in to start journaling
                    </button>
                </div>
            </div>
        </div>
    );
}
