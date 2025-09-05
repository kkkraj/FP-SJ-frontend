import React from 'react';
import bg from '../images/bg.png';
import logo from '../images/logo.png';

export default function Intro(props) {
    if (props.loading) {
        return (
            <div className="progress">
                <div className="indeterminate"></div>
            </div>
        );
    }

    return (
        <div className="intro-container">
                                    {/* Left side - Text content */}
                        <div className="intro-left">
                            <div className="intro-content">
                                {/* Logo */}
                                <div className="intro-logo">
                                    <img src={logo} alt="Space Journal Logo" className="logo-image" />
                                </div>
                                
                                {/* Tagline */}
                                <div className="tagline">
                        <svg className="tagline-icon" xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="currentColor">
                            <path d="M480-600q-58 0-99-41t-41-99q0-58 41-99t99-41q58 0 99 41t41 99q0 58-41 99t-99 41Zm0-80q25 0 42.5-17.5T540-740q0-25-17.5-42.5T480-800q-25 0-42.5 17.5T420-740q0 25 17.5 42.5T480-680Zm0 600L240-320q-20-20-30-45t-10-55q0-59 40.5-99.5T340-560q29 0 53.5 11t44.5 31l42 42 42-42q20-20 44.5-31t53.5-11q59 0 99.5 40.5T760-420q0 30-10 55t-30 45L480-80Zm0-114 182-182q9-9 13.5-20.5T680-420q0-24-17-42t-43-18q-12 0-21.5 3.5T580-464L480-364 380-464q-6-6-15.5-11t-24.5-5q-26 0-43 18t-17 42q0 12 5 22.5t13 19.5l182 184Zm0-546Zm0 403Z"/>
                        </svg>
                        <span>Transform your thoughts into clarity</span>
                    </div>
                    
                                                    {/* Main heading */}
                                <h1 className="main-heading">Your personal space<br />for mindful journaling</h1>
                    
                    {/* Description */}
                    <p className="description">
                        Find balance through mindful journaling. Record your days, tag your feelings, and discover patterns that guide you toward clarity and growth. Supported by daily affirmations and tools designed for your well-being.
                    </p>
                    
                    {/* Call to action buttons */}
                                                    <div className="button-group">
                                    <button className="btn-primary" onClick={() => window.location.href = '/login'}>
                                        Start Your Journey
                                        <svg className="arrow" xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor">
                                            <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z"/>
                                        </svg>
                                    </button>
                                    <button className="btn-secondary" onClick={() => window.location.href = '/how-it-works'}>
                                        See How It Works
                                    </button>
                                </div>
                </div>
            </div>
            
            {/* Right side - Image */}
            <div className="intro-right">
                <img id='auswhale' src={bg} alt="astronaut riding a whale"/>
            </div>
        </div>
    );
}