import React from 'react';
import Signup from './Signup';
import Login from './Login';
import StarterNav from './StarterNav';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

export default function Intro(props) {
    const location = useLocation();
    
    if (props.loading) {
        return (
            <div className="progress">
                <div className="indeterminate"></div>
            </div>
        );
    }

    return (
        <div id="intro">
            <p id="welcome">Welcome To</p>
            <p className="logo">SPACE JOURNAL</p>
            <StarterNav />
            <Routes>
                <Route 
                    path="/signup" 
                    element={
                        <Signup 
                            user={props.user} 
                            handleChange={props.handleChange} 
                            handleSubmit={props.handleSubmit}
                            error={props.error}
                        />
                    } 
                />
                <Route 
                    path="/login" 
                    element={
                        <Login handleLogin={props.handleLogin} />
                    } 
                />
                <Route 
                    path="/" 
                    element={
                        props.signup ? null : <Navigate to="/signup" replace />
                    } 
                />
            </Routes>
        </div>
    );
}