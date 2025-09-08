import React from 'react';
import { Nav } from 'react-bootstrap';

const DiarySidebar = ({ activeSection, onSectionChange }) => {
    const sidebarItems = [
        {
            id: 'new-entry',
            icon: 'add',
            label: 'New Entry',
            description: 'Create new journal entry',
            customIcon: <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
        },
        {
            id: 'mood-checkin',
            icon: 'mood',
            label: 'Mood Check-in',
            description: 'Log your current mood',
            customIcon: <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-800q134 0 227 93t93 227q0 134-93 227t-227 93q-134 0-227-93t-93-227q0-134 93-227t227-93Zm0 560q100 0 170-70t70-170q0-100-70-170t-170-70q-100 0-170 70t-70 170q0 100 70 170t170 70Zm0-100q48 0 86-27.5t54-72.5H340q16 45 54 72.5t86 27.5ZM340-560q0 17 11.5 28.5T380-520q17 0 28.5-11.5T420-560q0-17-11.5-28.5T380-600q-17 0-28.5 11.5T340-560Zm200 0q0 17 11.5 28.5T580-520q17 0 28.5-11.5T620-560q0-17-11.5-28.5T580-600q-17 0-28.5 11.5T540-560ZM40-720v-120q0-33 23.5-56.5T120-920h120v80H120v120H40ZM240-40H120q-33 0-56.5-23.5T40-120v-120h80v120h120v80Zm480 0v-80h120v-120h80v120q0 33-23.5 56.5T840-40H720Zm120-680v-120H720v-80h120q33 0 56.5 23.5T920-840v120h-80ZM480-480Z"/></svg>
        },
        {
            id: 'activity-checkin',
            icon: 'fitness_center',
            label: 'Activity Check-in',
            description: 'Log your activities',
            customIcon: <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="m280-40 123-622q6-29 27-43.5t44-14.5q23 0 42.5 10t31.5 30l40 64q18 29 46.5 52.5T700-529v-71h60v560h-60v-406q-48-11-89-35t-71-59l-24 120 84 80v300h-80v-240l-84-80-72 320h-84Zm17-395-85-16q-16-3-25-16.5t-6-30.5l30-157q6-32 34-50.5t60-12.5l46 9-54 274Zm243-305q-33 0-56.5-23.5T460-820q0-33 23.5-56.5T540-900q33 0 56.5 23.5T620-820q0 33-23.5 56.5T540-740Z"/></svg>
        },
        {
            id: 'set-intention',
            icon: 'flag',
            label: 'Set Today Intention',
            description: 'Set your daily goals',
            customIcon: <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-390Zm-132-53 55 37 77-39 77 39 53-35-40-79H386l-38 77ZM209-160h541L646-369l-83 55-83-41-83 41-85-56-103 210ZM80-80l234-475q10-20 29.5-32.5T386-600h54v-280h280l-40 80 40 80H520v120h50q23 0 42 12t30 32L880-80H80Z"/></svg>
        },
        {
            id: 'note-gratitude',
            icon: 'favorite',
            label: 'Note Your Gratitude',
            description: 'What are you grateful for?',
            customIcon: <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M620-320v-109l-45-81q-7 5-11 13t-4 17v229L663-80h-93l-90-148v-252q0-31 15-57t41-43l-56-99q-20-38-17.5-80.5T495-832l68-68 276 324 41 496h-80l-39-464-203-238-6 6q-10 10-11.5 23t4.5 25l155 278v130h-80Zm-360 0v-130l155-278q6-12 4.5-25T408-776l-6-6-203 238-39 464H80l41-496 276-324 68 68q30 30 32.5 72.5T480-679l-56 99q26 17 41 43t15 57v252L390-80h-93l103-171v-229q0-9-4-17t-11-13l-45 81v109h-80Z"/></svg>
        },
        {
            id: 'upload-memory',
            icon: 'photo_camera',
            label: 'Upload Memory',
            description: 'Upload photos'
        }
    ];

    return (
        <div className="diary-sidebar">
            <Nav className="flex-column sidebar-nav">
                {sidebarItems.map((item) => (
                    <Nav.Item key={item.id} className="sidebar-nav-item">
                        <button
                            id={`sidebar-nav-${item.id}`}
                            onClick={() => onSectionChange(item.id)}
                            className={`sidebar-nav-link ${activeSection === item.id ? 'active' : ''}`}
                        >
                            <div className="nav-icon">
                                {item.customIcon || <i className="material-icons">{item.icon}</i>}
                            </div>
                            <div className="nav-content">
                                <div className="nav-label">{item.label}</div>
                                <div className="nav-description">{item.description}</div>
                            </div>
                        </button>
                    </Nav.Item>
                ))}
            </Nav>
        </div>
    );
};

export default DiarySidebar;
