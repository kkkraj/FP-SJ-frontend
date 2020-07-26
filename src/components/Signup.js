import React, {Component} from 'react';
// import api from '../services/api';
import 'materialize-css/dist/css/materialize.min.css';

export default class Signup extends Component {
    // state = {
    //     user: {
    //         name: "",
    //         email: "",
    //         username: "",
    //         password: "",
    //         password_confirmation: ""
    //     }
    // }

    // handleChange = (event) => {
    //     const newUser = { ...this.state.user, [event.target.name]: event.target.value };
    //     this.setState({ user: newUser })
    // }

    // handleSubmit = (event) => {
    //     event.preventDefault();
    //     const user = {...this.state}
    //     this.createNewUser(user)
    // }

    // createNewUser = (user) => {
    //     api.auth.signup(user)
    //       .then((response) => response.json())
    //       .then((userData) => console.log(userData))
    // }

    render () {
        return (
            <div>
                <form onChange={this.props.handleChange} onSubmit={this.props.handleSubmit}>
                    <div className="row">
                        <div className="input-field col s3">
                            <div>
                                <input type="text" name="name" />
                                <label className="active">Name</label>
                            </div>
                            <div>
                                <input type="email" name="email" />
                                <label className="active">Email</label>
                            </div>
                            <div>
                                <input type="text" name="username" />
                                <label className="active">Username</label>
                            </div>
                            <div>
                                <input type="password" name="password"/>
                                <label className="active">Password</label>
                            </div>
                            <div>
                                <input type="password" name="password_confirmation"/>
                                <label className="active">Confirm Password</label>
                            </div>
                            <br/>
                            <div>
                                <button className="waves-effect waves-light btn" type="submit">Signup</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}