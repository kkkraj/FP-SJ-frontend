import React, { Component } from 'react';
import api from '../services/api';

export default class Login extends Component {
    state = {
        error: false,
        fields: {
            username: "",
            password: "",
      },
    }

    handleChange = (event) => {
        const newFields = { ...this.state.fields, [event.target.name]: event.target.value };
        this.setState({ fields: newFields });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        api.auth.login(this.state.fields.username, this.state.fields.password)
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
        const { fields } = this.state;

        return (
            <div>
                {this.state.error ? <h2>Please Try Again</h2> : null}
                <div>
                    <form onSubmit={this.handleSubmit}>
                        <div>
                            {/* <label>Username</label> */}
                            <input 
                                name="username" 
                                placeholder="username"
                                value={fields.username}
                                onChange={this.handleChange}
                            />
                        </div>
                        <div>
                            {/* <label>Password</label> */}
                            <input 
                                name="password" 
                                placeholder="password"
                                value={fields.password}
                                onChange={this.handleChange}
                            />
                        </div>
                        <button type="submit">Login</button>
                    </form>
                </div>
            </div>
        )
    }
}