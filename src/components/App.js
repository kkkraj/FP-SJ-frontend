import '../App.css';
import React, { Component } from 'react';
import api from "../services/api";
import Home from './Home';
import Welcome from './Welcome';

export default class App extends Component {
  state = { 
    auth: { 
      currentUser: {} 
    },
    loading: true,
    signup: false,
    user: {
        name: "",
        email: "",
        username: "",
        password: "",
        password_confirmation: ""
    }
  };

  componentDidMount() {
    const token = localStorage.getItem("token");
    if (token) {
      api.auth.getCurrentUser().then((data) => {
        const currentUser = { currentUser: data.user};
        this.setState({ auth: currentUser, loading: false });
      });
    } else {
      this.setState({ loading: false });
    }
  }

  handleLogin = (user) => {
    const currentUser = { currentUser: user };
    localStorage.setItem("token", user.jwt);
    this.setState({ auth: currentUser });
  }

  handleLogout = () => {
    localStorage.removeItem("token");
    this.setState({ 
      auth: { currentUser: {} } 
    });
  };

  handleDeleteUser = (user) => {
    api.auth.deleteUser(user);
    this.handleLogout();
    alert("Your Account has been Deleted");
  }

  handleChange = (event) => {
    const newUser = { ...this.state.user, [event.target.name]: event.target.value };
    this.setState({ user: newUser })
  }

  handleSubmit = (event) => {
      event.preventDefault();
      this.setState({ signup: true })
      const user = {...this.state}
      this.createNewUser(user)
  }

  createNewUser = (user) => {
      api.auth.signup(user)
        .then((response) => response.json())
        .then((userData) => console.log(userData))

      // this.setState({
      //   user: {
      //     ...this.state.user,
      //     name: '',
      //     username: '',
      //     email: '',
      //     password: '',
      //     password_confirmation: ''
      //   }
      // })
  }

  render () {
    const loggedIn = !!this.state.auth.currentUser.id;
    console.log(`logged-in? ${loggedIn}`)
    console.log(`current user id: ${this.state.auth.currentUser.id}`)
    return (
      <div id="app">
        { loggedIn ? 
          <Welcome 
              loading={this.state.loading} 
              currentUser={this.state.auth.currentUser}
              handleLogout={this.handleLogout}
              handleDeleteUser={this.handleDeleteUser}
          />
        :
          <Home 
              loading={this.state.loading}
              signup={this.state.signup}
              user={this.state.user} 
              handleChange={this.handleChange} 
              handleSubmit={this.handleSubmit}
              handleLogin={this.handleLogin}
          />
        }
      </div>
    )
  }
}

