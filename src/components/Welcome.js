import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Redirect} from "react-router-dom";
import Navbar from './Navbar';
import Signup from './Signup';
import Login from './Login';
import About from './About';
import Profile from './Profile';
import Diary from './Diary';
import Diarybook from './Diarybook';
import Home from './Home';

export default class Welcome extends Component {
    render () {
        return (
        <Router>
            { this.props.loading ? (<div className="progress"><div className="indeterminate"></div></div>) : (
                <div>
                    <Navbar handleLogout={this.props.handleLogout} />
                    <Route exact path="/about" render={() => <About currentUser={this.props.currentUser} />} />
                    <Route exact path="/diary" render={() => <Diary currentUser={this.props.currentUser} />} />
                    <Route exact path="/diarybook" render={() => <Diarybook currentUser={this.props.currentUser} />} />
                    <Route exact path="/profile" render={() => <Profile currentUser={this.props.currentUser} handleDeleteUser={this.props.handleDeleteUser} />} />
                </div>
            )}
        </Router>
        )
    }
}