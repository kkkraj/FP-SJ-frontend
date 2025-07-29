import React from 'react';
import bg from '../images/bg.png';
import Intro from './Intro';

export default function Home(props) {
    return (
        <div>
            <div id="intro-m">
                <Intro 
                    loading={props.loading}
                    signup={props.signup}
                    user={props.user} 
                    handleChange={props.handleChange}
                    handleSubmit={props.handleSubmit}
                    handleLogin={props.handleLogin}
                    error={props.error}
                />
            </div>
            <div>
                <img id='auswhale' src={bg} alt="astronaut riding a whale"/>
            </div>
        </div>
    );
}