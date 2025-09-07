import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from './Navbar';
import About from './About';
import Profile from './Profile';
import Diary from './Diary';
import Entries from './Entries';
import Charts from './Charts';

export default function Welcome(props) {
    if (props.loading) {
        return (
            <div className="progress">
                <div className="indeterminate"></div>
            </div>
        );
    }

    return (
        <div>
            <Navbar currentUser={props.currentUser} handleLogout={props.handleLogout} />
            <br/>
            <Routes>
                <Route path="/about" element={<About key={`about-${props.currentUser.id}-${props.currentUser.name || 'unknown'}`} currentUser={props.currentUser} />} />
                <Route path="/diary" element={<Diary currentUser={props.currentUser} />} />
                <Route path="/entries" element={<Entries currentUser={props.currentUser} />} />
                <Route path="/charts" element={<Charts currentUserId={props.currentUser.id} />} />
                <Route path="/profile" element={<Profile currentUser={props.currentUser} handleDeleteUser={props.handleDeleteUser} onAccountUpdate={props.onAccountUpdate} handleLogout={props.handleLogout} />} />
                <Route path="/" element={<Navigate to="/about" replace />} />
            </Routes>
        </div>
    );
}