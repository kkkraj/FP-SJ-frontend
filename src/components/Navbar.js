import React from 'react';
import { NavLink } from 'react-router-dom';

function Navbar(props) {

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

                        <NavLink to="/profile" className="user-photo-link">
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
                        </NavLink>
                    </div>
                </div>
                <div className="main-nav-divider"></div>
            </div>
        </div>
    );
}

export default Navbar;