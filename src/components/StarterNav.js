import React from 'react';
import { NavLink } from 'react-router-dom';

function StarterNav() {
    return (
        <div>
            <p id="signupmessage">
                Have an Account? <NavLink to="/login"> Log In</NavLink> or <NavLink to="/signup"> Sign Up </NavLink>to Create Your Space Today
            </p>
        </div>
    );
}

export default StarterNav;