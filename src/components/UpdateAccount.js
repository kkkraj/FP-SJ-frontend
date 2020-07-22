import React, {Component} from 'react';
import api from "../services/api";

export default class UpdateAccount extends Component {
    state = {
        user: {
            id: this.props.currentUser.id,
            name: this.props.currentUser.name,
            email: this.props.currentUser.email,
            username: this.props.currentUser.username
        }
    }
    
    handleChange = (event) => {
        const updatedInfo = { ...this.state.user, [event.target.name]: event.target.value };
        this.setState({ user: updatedInfo })
    }
    
    handleSubmit = (event) => {
        event.preventDefault();
        const user = {...this.state}
        this.handleUpdateUser(user.user)
    }
    
    handleUpdateUser = (user) => {
        api.auth.updateUser(user)
          .then((data) => console.log(data))
    }

    render () {
        return (
            <div>
                <h2>Update My Account</h2>
                <form onChange={this.handleChange} onSubmit={this.handleSubmit}>
                        <div>
                            <label>Name</label>
                            <input 
                              name="name" 
                              placeholder="name"
                            />
                        </div>
                        <div>
                            <label>Email</label>
                            <input 
                              name="email" 
                              placeholder="email"
                            />
                        </div>
                        <div>
                            <label>Username</label>
                            <input 
                              name="username" 
                              placeholder="username"
                            />
                        </div>
                        <button type="submit">Submit</button>
                    </form>
            </div>
        )
    }
}