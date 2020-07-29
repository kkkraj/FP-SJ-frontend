import React, {Component} from 'react';
import Signup from './Signup';
import Login from './Login';
import StarterNav from './StarterNav';
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom'
import 'materialize-css/dist/css/materialize.min.css';
import api from '../services/api';
import Welcome from './Welcome';

export default class Intro extends Component {
    // state = {
    //     ///////////////////////////////App
    //     auth: { 
    //         currentUser: {} 
    //     },
    //     loading: true,
    //     ///////////////////////////////
    //     signup: false,
    //     ///////////////////////////////
    //     loggedIn: false,
    //     ///////////////////////////////Signup
    //     user: {
    //         name: "",
    //         email: "",
    //         username: "",
    //         password: "",
    //         password_confirmation: ""
    //     }
    // }
    ///////////////////////////////////////////////////////////////////App
    // componentDidMount() {
    //     const token = localStorage.getItem("token");
    //     if (token) {
    //       api.auth.getCurrentUser().then((data) => {
    //         const currentUser = { currentUser: data.user};
    //         this.setState({ auth: currentUser, loading: false });
    //       });
    //     } else {
    //       this.setState({ loading: false });
    //     }
    // }

    // handleLogout = () => {
    //     localStorage.removeItem("token");
    //     this.setState({ auth: { currentUser: {} } });
    // };
    
    // handleDeleteUser = (user) => {
    //     api.auth.deleteUser(user);
    //     this.handleLogout();
    //     alert("Your Account has been Deleted");
    // }
    ////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////Signup
    // handleChange = (event) => {
    //     const newUser = { ...this.state.user, [event.target.name]: event.target.value };
    //     this.setState({ user: newUser })
    // }

    // handleSubmit = (event) => {
    //     event.preventDefault();
    //     this.setState({ signup: true })
    //     const user = {...this.state}
    //     this.createNewUser(user)
    // }

    // createNewUser = (user) => {
    //     api.auth.signup(user)
    //       .then((response) => response.json())
    //       .then((userData) => console.log(userData))
    // }
    /////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////Login
    // handleLogin = (user) => {
    //     const currentUser = { currentUser: user };
    //     localStorage.setItem("token", user.jwt);
    //     this.setState({ 
    //         loggedIn: true,
    //         auth: currentUser 
    //     });
    // }
    /////////////////////////////////////////////////////////////////////

    render () {
        return (
            this.props.loading ? (<div className="progress"><div className="indeterminate"></div></div>) : (
                    <div id="intro">
                        <p id="welcome">Welcome To</p>
                        <p className="logo">SPACE JOURNAL</p>
                        <StarterNav />
                        <Route exact path="/signup"
                            render={() => 
                                <Signup 
                                    user={this.props.user} 
                                    handleChange={this.props.handleChange} 
                                    handleSubmit={this.props.handleSubmit}
                                    createNewUser={this.props.createNewUser}
                                    handleSignup={this.props.handleSignup}
                                />
                            }
                        />
                        <Route exact path="/login" render={(routerProps) => <Login {...routerProps} handleLogin={this.props.handleLogin} /> } />
                        <Route exact path="/" render={() => this.props.signup ? null : <Redirect to="/signup" />} />
                    </div>
            )
        )
    }
}