import React, { useState, useEffect } from 'react';
import DiarySidebar from './DiarySidebar';
import DiaryContent from './DiaryContent';

export default function Diary(props) {
    const [activeSection, setActiveSection] = useState('new-entry');

    useEffect(() => {
        // Check for hash in URL to set initial active section
        const hash = window.location.hash.substring(1); // Remove the # symbol
        if (hash && ['new-entry', 'mood-checkin', 'activity-checkin', 'set-intention', 'note-gratitude', 'upload-memory'].includes(hash)) {
            setActiveSection(hash);
        }
    }, []);

    const handleSectionChange = (section) => {
        setActiveSection(section);
    };

    return (
        <div id="diary">
            <DiarySidebar 
                activeSection={activeSection} 
                onSectionChange={handleSectionChange} 
            />
            <div className="diary-main-content">
                <DiaryContent 
                    activeSection={activeSection} 
                    currentUser={props.currentUser} 
                />
                                </div>
        </div>
    );
}
