import React, {Component} from 'react'
import api from '../services/api';

export default class Signup extends Component {
    state = {
        error: false,
        user: {
            name: "",
            username: "",
            password: ""
        }
    }

    handleChange = (event) => {
        const newUser = { ...this.state.user, [event.target.name]: event.target.value };
        this.setState({ user: newUser })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const user = {...this.state}
        this.createNewUser(user)
    }

    createNewUser = (user) => {
        api.auth.signup(user)
          .then((response) => {
              if (response.error) {
                this.setState({ error: true });
              } else {
                (response.json()).then((userData) => console.log(userData))
              }
          });
    }

    render () {
        return (
            <div>
                {/* {this.state.error ? <p>Unable to create an account, please try again</p> : null} */}
                <div>
                    <form onChange={this.handleChange} onSubmit={this.handleSubmit}>
                        <div>
                            <label>Name</label>
                            <input 
                              name="name" 
                              placeholder="name"
                            />
                        </div>
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
                        <button type="submit">Signup</button>
                    </form>
                </div>
            </div>
        )
    }
}