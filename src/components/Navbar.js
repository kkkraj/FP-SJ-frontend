import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

function Navbar(props) {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/login');
        props.handleLogout();
    };

    return (
        <div id="nav">
            <div className="nav-wrapper">
                <NavLink style={{ marginRight: '80px' }} to="/about">
                    Home
                </NavLink>

                <NavLink style={{ marginRight: '80px' }} to="/diary">
                    New Entry
                </NavLink>

                <NavLink style={{ marginRight: '80px' }} to="/entries">
                    All Entries
                </NavLink>

                <NavLink style={{ marginRight: '80px' }} to="/charts">
                    Chart
                </NavLink>

                <NavLink style={{ marginRight: '80px' }} to="/profile">
                    Account
                </NavLink>

                <NavLink style={{ marginRight: '80px' }} to="/how-it-works">
                    How it works
                </NavLink>

                <a id="logout" onClick={handleLogout}>Log Out</a>
            </div>
        </div>
    );
}

export default Navbar;