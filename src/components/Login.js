import React, { Component } from 'react';
import api from '../services/api';

export default class Login extends Component {
    state = {
        error: false,
        userInfo: {
            username: "",
            password: ""
      },
    }

    handleChange = (event) => {
        const loginInfo = { ...this.state.userInfo, [event.target.name]: event.target.value };
        this.setState({ userInfo: loginInfo });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const userInfo = {...this.state.userInfo}
        this.loginUser(userInfo)
    }

    loginUser = (userInfo) => {
        api.auth.login(userInfo)
          .then((response) => {
            if (response.error) {
              this.setState({ error: true });
            } else {
              this.props.handleLogin(response);
              this.props.history.push('/');
            }
          });
    }

    render () {
        return (
            <div>
                {this.state.error ? <p>Incorrect username or password, please Try Again</p> : null}
                <div>
                    <form onChange={this.handleChange} onSubmit={this.handleSubmit}>
                        <div>
                            <label>Username</label>
                            <input 
                                name="username" 
                                placeholder="username"
                            />
                        </div>
                        <div>
                            <label>Password</label>
                            <input 
                                name="password" 
                                placeholder="password"
                            />
                        </div>
                        <button type="submit">Login</button>
                    </form>
                </div>
            </div>
        )
    }
}