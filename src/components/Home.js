import React, {Component} from 'react';
import bg from '../images/bg.png';
import Intro from './Intro'
import 'materialize-css/dist/css/materialize.min.css';

export default class Home extends Component {
    render () {
        return (
            <div id="home">
                <div className="col s6" id="homeimg">
                    <img src={bg} alt="astronaut riding a whale"/>
                </div>
                <div className="col s6">
                    <Intro 
                        loading={this.props.loading}
                        loggedIn={this.props.loggedIn}
                        signup={this.props.signup}
                        user={this.props.user} 
                        currentUser={this.props.currentUser}
                        handleChange={this.props.handleChange} 
                        handleSubmit={this.props.handleSubmit}
                        createNewUser={this.props.createNewUser}
                        handleSignup={this.props.handleSignup}
                        handleLogin={this.props.handleLogin}
                    />
                </div>
            </div>
        )
    }
}