import '../App.css';
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, NavLink } from "react-router-dom";
import api from "../services/api";
import Navbar from './Navbar';
import Signup from './Signup';
import Login from './Login';
import About from './About';
import Profile from './Profile';
import Diary from './Diary';

export default class App extends Component {
  state = { 
    auth: { 
      currentUser: {} 
    }
  };

  componentDidMount() {
    const token = localStorage.getItem("token");

    if (token) {
      api.auth.getCurrentUser().then((user) => {
        const currentUser = { currentUser: user };
        this.setState({ auth: currentUser });
      });
    }
  }

  handleLogin = (user) => {
    const currentUser = { currentUser: user };
    localStorage.setItem("token", user.token);
    this.setState({ auth: currentUser });
  }

  handleLogout = () => {
    localStorage.removeItem("token");
    this.setState({ auth: { currentUser: {} } });
  };

  // handleUpdateUser = (user) => {
  //   fetch(`http://localhost:3000/api/v1/users/${user.id}`, {
  //     method: "PATCH",
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(user)
  //   })
  // }

  handleDeleteUser = (user) => {
    api.auth.deleteUser(user);
    this.handleLogout();
    alert("Your Account has been Deleted");
  }

  render () {
    return (
      <Router>
        <h1>Dear Diary</h1>
        <div>
          <Navbar currentUser={this.state.auth.currentUser} handleLogout={this.handleLogout} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/login" render={(routerProps) => <Login {...routerProps} handleLogin={this.handleLogin} /> } />
          <Route exact path="/" render={() => {
              const loggedIn = !!this.state.auth.currentUser.id;
              return ( loggedIn ? (<div>{`Hello ${this.state.auth.currentUser.name}`}</div>) : <Redirect to="/login" /> );
          }}/>
          <Route exact path="/about" component={About} />
          <Route exact path="/profile" render={() => <Profile currentUser={this.state.auth.currentUser} handleDeleteUser={this.handleDeleteUser} />} />
          <Route exact path="/diary" component={Diary} />
        </div>
      </Router>
    )
  }
}

