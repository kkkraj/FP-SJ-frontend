import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';

class Navbar extends Component {
    render () {
        const loggedIn = !!this.props.currentUser.id;

        return (
            <div style={{ borderBottom: '2px solid black', paddingBottom: '15px', marginBottom: '15px' }}>
                {loggedIn ? (
                    <div>
                        <NavLink style={{ marginRight: '10px' }} to="/about">
                            About
                        </NavLink>

                        <NavLink style={{ marginRight: '10px' }} to="/diary">
                            New Diary
                        </NavLink>

                        <NavLink style={{ marginRight: '10px' }} to="/diarybook">
                            Diary Book
                        </NavLink>

                        <NavLink style={{ marginRight: '10px' }} to="/profile">
                            Profile
                        </NavLink>

                        <a onClick={() => {
                            this.props.history.push('/login')
                            this.props.handleLogout()
                        }}>Log Out</a>
                    </div>
                ) : (
                    <div>
                        <NavLink style={{ marginRight: '10px' }}  to="/signup">
                          Sign Up
                        </NavLink>

                        <NavLink to="/login">
                          Log In
                        </NavLink>
                    </div>
                )}
            </div>
        )
    }
}

export default withRouter(Navbar);