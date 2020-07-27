import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import 'materialize-css/dist/css/materialize.min.css';

class Navbar extends Component {
    render () {
        return (
            <div id="nav">
                    <div className="nav-wrapper">
                        <NavLink to="/about">
                            Home
                        </NavLink>

                        <NavLink to="/diary">
                            New Diary
                        </NavLink>

                        <NavLink to="/diarybook">
                            Diary Book
                        </NavLink>

                        <NavLink to="/profile">
                            Account
                        </NavLink>

                        <a onClick={() => {
                            this.props.history.push('/login')
                            this.props.handleLogout()
                        }}>Log Out</a>
                    </div>
            </div>
        )
    }
}

export default withRouter(Navbar);