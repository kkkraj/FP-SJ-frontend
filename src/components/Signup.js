import React, {Component} from 'react'
import api from '../services/api';

export default class Signup extends Component {
    state = {
        error: false,
        user: {
            name: "",
            email: "",
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
                              type="text" 
                              name="name" 
                              placeholder="name"
                            />
                        </div>
                        <div>
                            <label>Email</label>
                            <input 
                              type="email" 
                              name="email" 
                              placeholder="email"
                            />
                        </div>
                        <div>
                            <label>Username</label>
                            <input 
                              type="text" 
                              name="username" 
                              placeholder="username"
                            />
                        </div>
                        <div>
                            <label>Password</label>
                            <input 
                              type="password" 
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