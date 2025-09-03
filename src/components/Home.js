import React from 'react';
import Intro from './Intro';

export default function Home(props) {
    return (
        <Intro 
            loading={props.loading}
            signup={props.signup}
            user={props.user} 
            handleChange={props.handleChange}
            handleSubmit={props.handleSubmit}
            handleLogin={props.handleLogin}
            error={props.error}
        />
    );
}