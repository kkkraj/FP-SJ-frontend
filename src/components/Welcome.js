import React from 'react';
import { Routes, Route } from "react-router-dom";
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
            <Navbar handleLogout={props.handleLogout} />
            <br/>
            <Routes>
                <Route path="/about" element={<About currentUser={props.currentUser} />} />
                <Route path="/diary" element={<Diary currentUser={props.currentUser} />} />
                <Route path="/entries" element={<Entries currentUser={props.currentUser} />} />
                <Route path="/charts" element={<Charts currentUser={props.currentUser} />} />
                <Route path="/profile" element={<Profile currentUser={props.currentUser} handleDeleteUser={props.handleDeleteUser} />} />
            </Routes>
        </div>
    );
}