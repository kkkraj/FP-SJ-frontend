import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';

class StarterNav extends Component {
    render () {
        return (
            <div>
                <p id="signupmessage">Have an Account? <NavLink to="/login"> Log In</NavLink> or <NavLink to="/signup"> Sign Up </NavLink>to Create Your Space Today</p>
            </div>
        )
    }
}

export default withRouter(StarterNav);