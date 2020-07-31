import React, { Component } from 'react';
import api from '../services/api';
import 'materialize-css/dist/css/materialize.min.css';

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
              this.props.history.push('/about');
            }
          });
    }

    render () {
        return (
            <div>
                {this.state.error ? <p style={{color: "Chocolate"}}>Incorrect username or password, please Try Again</p> : null}
                <div>
                    <form onChange={this.handleChange} onSubmit={this.handleSubmit}>
                        <div className="sign-form">
                            <div>
                                <input type="text" name="username" />
                                <label className="active">Username</label>
                            </div>
                            <div>
                                <input type="password" name="password" />
                                <label className="active">Password</label>
                            </div>
                            <br/>
                            <div>
                                <button className="waves-effect waves-light btn" type="submit">Login</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}