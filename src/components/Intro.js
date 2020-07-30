import React, {Component} from 'react';
import Signup from './Signup';
import Login from './Login';
import StarterNav from './StarterNav';
import {Route, Redirect} from 'react-router-dom'
import 'materialize-css/dist/css/materialize.min.css';

export default class Intro extends Component {
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
                                />
                            }
                        />
                        <Route exact path="/login" 
                            render={(routerProps) => 
                                <Login {...routerProps} handleLogin={this.props.handleLogin} />
                            } 
                        />
                        <Route exact path="/" 
                            render={() => 
                                this.props.signup ? null : <Redirect to="/signup" />
                            }
                        />
                    </div>
            )
        )
    }
}