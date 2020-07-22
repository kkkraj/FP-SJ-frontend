import React, {Component} from 'react';
import UpdateAccount from './UpdateAccount';

export default class Profile extends Component {
    state = {
        updateClick: false,
    }

    handleUpdate = () => {
        console.log("update clicked")
        this.setState({ updateClick: true })
    }

    render () {
        return (
            <div>
                <h2>Profile Page</h2>
                <p>Name: {this.props.currentUser.name}</p>
                <p>Email: {this.props.currentUser.email}</p>
                <p>Username: {this.props.currentUser.username}</p>
                <button onClick={this.handleUpdate}>Update Account</button>
                <button onClick={() => {this.props.handleDeleteUser(this.props.currentUser)}}>Delete Account</button>
                {this.state.updateClick === true ? <UpdateAccount currentUser={this.props.currentUser} handleUpdate={this.handleUpdate} /> : null}
            </div>
        )
    }
}