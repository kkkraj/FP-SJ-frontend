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
                <br/><br/>
                <h2 className="text" style={{fontWeight: 'bold', color: 'LightSeaGreen'}}>Update Account</h2>
                <br/><br/>
                <form onChange={this.handleChange} onSubmit={this.handleSubmit}>
                        <div>
                            <input 
                              name="name" 
                              placeholder="name"
                            />
                        </div>
                        <div>
                            <input 
                              name="email" 
                              placeholder="email"
                            />
                        </div>
                        <div>
                            <input 
                              name="username" 
                              placeholder="username"
                            />
                        </div>
                        <br/>
                        <button style={{backgroundColor: 'LightSalmon'}} className="waves-effect waves-light btn-small" type="submit">Update</button>
                    </form>
            </div>
        )
    }
}