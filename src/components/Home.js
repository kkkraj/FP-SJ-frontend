import React, {Component} from 'react';
import bg from '../images/bg.png';
import Intro from './Intro'
import 'materialize-css/dist/css/materialize.min.css';

export default class Home extends Component {
    render () {
        return (
            <div>
                <div id="intro-m">
                    <Intro 
                        loading={this.props.loading}
                        signup={this.props.signup}
                        user={this.props.user} 
                        handleChange={this.props.handleChange}
                        handleSubmit={this.props.handleSubmit}
                        handleLogin={this.props.handleLogin}
                    />
                </div>
                <div>
                    <img id='auswhale' src={bg} alt="astronaut riding a whale"/>
                </div>
            </div>
        )
    }
}