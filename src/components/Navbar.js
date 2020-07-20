import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

class Navbar extends Component {
    render () {
        const loggedIn = !!this.props.currentUser.id;

        return (
            <div>
                <Link to="/">
                    <div className="logo">{this.props.title}</div>
                </Link>
                <Link to="signup">
                    <div>Signup</div>
                </Link>
                {loggedIn ? <div>{`Hello ${this.props.currentUser.username}`}</div> : null}
                {loggedIn ? (
                    <a onClick={() => {
                      this.props.history.push('/login')
                      this.props.handleLogout()
                    }}> 
                      <div>Log Out</div>
                    </a>
                ) : (
                    <Link to="/login">
                      <div>Log In</div>
                    </Link>
                )}
            </div>
        )
    }
}

export default withRouter(Navbar);