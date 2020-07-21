import React, {Component} from 'react';

export default class Profile extends Component {
    render () {
        return (
            <div>
                <h2>Profile Page</h2>
                <p>Name: {this.props.currentUser.name}</p>
                <p>Username: {this.props.currentUser.username}</p>
                <button onClick={() => {this.props.handleDeleteUser(this.props.currentUser)}}>Delete Account</button>
            </div>
        )
    }
}