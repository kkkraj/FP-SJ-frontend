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
                <h3 className="text" style={{fontWeight: 'bold', color: 'LightSeaGreen'}}>Update Account</h3>
                <br/><br/>
                <form onChange={this.handleChange} onSubmit={this.handleSubmit}>
                    <div>
                        <input 
                            name="name" 
                            placeholder={this.state.user.name}
                            // value={this.state.user.name}
                        />
                        <label className="active" style={{float: 'left'}}>Name</label>
                    </div>
                    <div>
                        <input 
                            name="email" 
                            placeholder={this.state.user.email}
                            // value={this.state.user.email}
                        />
                        <label className="active" style={{float: 'left'}}>Email</label>
                    </div>
                    <div>
                        <input 
                            name="username" 
                            placeholder={this.state.user.username}
                            // value={this.state.user.username}
                        />
                        <label className="active" style={{float: 'left'}}>Username</label>
                    </div>
                    <br/>
                    <button style={{backgroundColor: 'LightSalmon'}} className="waves-effect waves-light btn-small" type="submit">Update</button>
                </form>
            </div>
        )
    }
}