import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import 'materialize-css/dist/css/materialize.min.css';

class Navbar extends Component {
    render () {
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

                        <a id="logout" onClick={() => {
                            this.props.history.push('/login')
                            this.props.handleLogout()
                        }}>Log Out</a>
                    </div>
            </div>
        )
    }
}

export default withRouter(Navbar);