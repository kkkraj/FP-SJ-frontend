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
import Diarybook from './Diarybook';
import Home from './Home';
import Welcome from './Welcome';

export default class App extends Component {
  state = { 
    auth: { 
      currentUser: {} 
    },
    loading: true,
    signup: false,
    loggedIn: false,
    loggedOut: false,
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
    // this.setState({ 
    //   loggedIn: true,
    //   auth: currentUser 
    // });
    this.setState({ auth: currentUser });
  }

  handleLogout = () => {
    localStorage.removeItem("token");
    this.setState({ 
      loggedOut: true,
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
              loggedOut={this.state.loggedOut}
              currentUser={this.state.auth.currentUser}
              handleLogout={this.handleLogout}
              handleDeleteUser={this.handleDeleteUser}
          />
        :
          <Home 
              loading={this.state.loading}
              loggedIn={this.state.loggedIn}
              signup={this.state.signup}
              user={this.state.user} 
              currentUser={this.state.auth.currentUser}
              handleChange={this.handleChange} 
              handleSubmit={this.handleSubmit}
              createNewUser={this.createNewUser}
              handleSignup={this.handleSignup}
              handleLogin={this.handleLogin}
          />
        }
      </div>


      
      // <Router>
      //   <h1>Space Journal</h1>
      //   { this.state.loading ? (<div>loading</div>) : (
      //     <div>
      //         <Navbar currentUser={this.state.auth.currentUser} handleLogout={this.handleLogout} />
      //         <Route exact path="/signup" component={Signup} />
      //         <Route exact path="/login" render={(routerProps) => <Login {...routerProps} handleLogin={this.handleLogin} /> } />
      //             <Route exact path="/" render={() => {
      //                 const loggedIn = !!this.state.auth.currentUser.id;
      //                 return ( loggedIn ? (<div>{`Hello ${this.state.auth.currentUser.name}`}</div>) : <Redirect to="/login" /> );
      //             }}/>
      //         <Route exact path="/about" component={About} />
      //         <Route exact path="/profile" render={() => <Profile currentUser={this.state.auth.currentUser} handleDeleteUser={this.handleDeleteUser} handleUpdateUser={this.handleUpdateUser}/>} />
      //         <Route exact path="/diary" render={() => <Diary currentUser={this.state.auth.currentUser} />} />
      //         <Route exact path="/diarybook" render={() => <Diarybook currentUser={this.state.auth.currentUser} />} />
      //       </div>
      //     )
      //   }
      // </Router>
    )
  }
}

