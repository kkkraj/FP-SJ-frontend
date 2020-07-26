import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import 'materialize-css/dist/css/materialize.min.css';

class Navbar extends Component {
    render () {
        return (
            <div id="nav">
                    <div className="nav-wrapper">
                        <NavLink style={{ marginRight: '30px' }} to="/about">
                            SPACE JOURNAL
                        </NavLink>

                        <NavLink style={{ marginRight: '30px' }} to="/diary">
                            New Diary
                        </NavLink>

                        <NavLink style={{ marginRight: '30px' }} to="/diarybook">
                            Diary Book
                        </NavLink>

                        <NavLink style={{ marginRight: '30px' }} to="/profile">
                            Profile
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