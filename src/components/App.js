import '../App.css';
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect} from "react-router-dom";
import api from "../services/api";
import Navbar from './Navbar';
import Signup from './Signup';
import Login from './Login';
import About from './About';
import Profile from './Profile';
import Diary from './Diary';
import Diarybook from './Diarybook'

export default class App extends Component {
  state = { 
    auth: { 
      currentUser: {} 
    },
    loading: true
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
    this.setState({ auth: { currentUser: {} } });
  };

  handleDeleteUser = (user) => {
    api.auth.deleteUser(user);
    this.handleLogout();
    alert("Your Account has been Deleted");
  }

  render () {
    return (
      <Router>
        <h1>My Journal</h1>
        { this.state.loading ? (<div>loading</div>) : (
            <div>
            <Navbar currentUser={this.state.auth.currentUser} handleLogout={this.handleLogout} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/login" render={(routerProps) => <Login {...routerProps} handleLogin={this.handleLogin} /> } />
            <Route exact path="/" render={() => {
                const loggedIn = !!this.state.auth.currentUser.id;
                return ( loggedIn ? (<div>{`Hello ${this.state.auth.currentUser.name}`}</div>) : <Redirect to="/login" /> );
            }}/>
            <Route exact path="/about" component={About} />
            <Route exact path="/profile" render={() => <Profile currentUser={this.state.auth.currentUser} handleDeleteUser={this.handleDeleteUser} handleUpdateUser={this.handleUpdateUser}/>} />
            <Route exact path="/diary" render={() => <Diary currentUser={this.state.auth.currentUser} />} />
            <Route exact path="/diarybook" render={() => <Diarybook currentUser={this.state.auth.currentUser} />} />
            </div>
          )
        }
      </Router>
    )
  }
}

