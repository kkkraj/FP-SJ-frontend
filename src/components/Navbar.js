import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

function Navbar(props) {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleUserPhotoClick = (e) => {
        e.preventDefault();
        setShowDropdown(!showDropdown);
    };

    const handleAccountSettings = () => {
        setShowDropdown(false);
        navigate('/profile');
    };

    const handleLogout = () => {
        setShowDropdown(false);
        props.handleLogout();
        navigate('/login');
    };

    return (
        <div id="nav">
            <div className="nav-wrapper">
                <div className="main-nav-content">
                    <div className="main-nav-left">
                        <NavLink to="/about">
                            <img src="/static/media/logo.705deee9d18de9d5b667.png" alt="Space Journal Logo" className="main-nav-logo" />
                        </NavLink>
                    </div>
                    <div className="main-nav-right">
                        <NavLink to="/diary">
                            New Entry
                        </NavLink>

                        <NavLink to="/entries">
                            My Entries
                        </NavLink>

                        <NavLink to="/charts">
                            Overview
                        </NavLink>

                        <NavLink to="/how-it-works">
                            How It Works
                        </NavLink>

                        <div className="user-photo-container" ref={dropdownRef}>
                            <div className="user-photo-link" onClick={handleUserPhotoClick}>
                                {props.currentUser && props.currentUser.photo ? (
                                    <img 
                                        src={props.currentUser.photo} 
                                        alt="User Photo" 
                                        className="user-photo"
                                    />
                                ) : (
                                    <div className="user-photo-placeholder">
                                        {props.currentUser && props.currentUser.name ? 
                                            props.currentUser.name.charAt(0).toUpperCase() : 
                                            (props.currentUser && props.currentUser.email ? 
                                                props.currentUser.email.charAt(0).toUpperCase() : 
                                                'U'
                                            )
                                        }
                                    </div>
                                )}
                            </div>
                            
                            {/* Dropdown Menu */}
                            {showDropdown && (
                                <div className="user-dropdown">
                                    <div className="dropdown-item" onClick={handleAccountSettings}>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
                                            <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/>
                                        </svg>
                                        <p>Account Settings</p>
                                    </div>
                                    <div className="dropdown-item" onClick={handleLogout}>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
                                            <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/>
                                        </svg>
                                        <p>Log Out</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="main-nav-divider"></div>
            </div>
        </div>
    );
}

export default Navbar;