import '../App.css';
import React, { Component } from 'react';
import { Route, Switch, Redirect } from "react-router-dom";
import api from "../services/api";
import Navbar from './Navbar';
import Signup from './Signup';
import Login from './Login';
import About from './About';

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

  handleSignup = () => {
    console.log("signup")
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


  render () {
    return (
      <div className="App">
        <h1>Hello Homepage</h1>
        <Navbar 
          title="Diary Book"
          currentUser={this.state.auth.currentUser}
          handleLogout={this.handleLogout}
        />
        <div>
          <Switch>
            <Route
              path="/signup"
              render={(routerProps) => {
                return ( <Signup {...routerProps} handleLogin={this.handleSignup} /> );
            }}
            />
            <Route
              path="/login"
              render={(routerProps) => {
                return ( <Login {...routerProps} handleLogin={this.handleLogin} /> );
              }}
            />
            <Route path="/" component={About} />
            <Route
              path="/"
              render={() => {
                const loggedIn = !!this.state.auth.currentUser.id;
                return ( loggedIn ? <About /> : <Redirect to="/login" /> );
              }}
            />
          </Switch>
        </div>
      </div>
    )
  }
}

