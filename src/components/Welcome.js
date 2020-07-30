import React, {Component} from 'react';
import {Route} from "react-router-dom";
import Navbar from './Navbar';
import About from './About';
import Profile from './Profile';
import Diary from './Diary';
import Entries from './Entries';
import Charts from './Charts';

export default class Welcome extends Component {
    render () {
        return (
            this.props.loading ? (<div className="progress"><div className="indeterminate"></div></div>) : (
                <div>
                    <Navbar handleLogout={this.props.handleLogout} />
                    <br/>
                    <Route exact path="/about" render={() => <About currentUser={this.props.currentUser} />} />
                    <Route exact path="/diary" render={() => <Diary currentUser={this.props.currentUser} />} />
                    <Route exact path="/entries" render={() => <Entries currentUser={this.props.currentUser} />} />
                    <Route exact path="/charts" render={() => <Charts currentUser={this.props.currentUser} />} />
                    <Route exact path="/profile" render={() => <Profile currentUser={this.props.currentUser} handleDeleteUser={this.props.handleDeleteUser} />} />
                </div>
            )
        )
    }
}