import React from 'react';
import Weather from './Weather';
import AffirmationCard from './AffirmationCard';
import MyAffirmationCard from './MyAffirmationCard';
import moment from 'moment';
import 'bootstrap/dist/css/bootstrap.min.css';

const day = moment().format('dddd');
const date = moment().format('D');
const month = moment().format('MMMM');
const year = moment().format('YYYY');
const time = moment().format('LT');

export default function About(props) {
    console.log('About component rendered with currentUser:', props.currentUser);

        return (
        <div id="about" className="dashboard-container">
            {/* Header */}
            <div className="dashboard-header">
                <h1 className="dashboard-greeting">
                    Hello, {props.currentUser.name}!
                </h1>
                <p className="dashboard-subtitle">Ready to make today amazing?</p>
            </div>

            {/* Main Cards Grid */}
            <div className="dashboard-grid dashboard-grid-3">
                {/* Today's Date Card */}
                <div className="dashboard-card">
                    <div className="dashboard-card-header">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
                            <path d="M360-300q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z"/>
                        </svg>
                        <h3>Today</h3>
                    </div>
                    <div className="dashboard-datetime-content">
                        <p className="dashboard-date-text">
                            {day}, {month} {date}, {year}
                        </p>
                        <div className="dashboard-time-display">
                            {time}
                        </div>
                    </div>
                </div>

                {/* Weather Card */}
                <div className="dashboard-card">
                    <div className="dashboard-card-header">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
                            <path d="M440-760v-160h80v160h-80Zm266 110-55-55 112-115 56 57-113 113Zm54 210v-80h160v80H760ZM440-40v-160h80v160h-80ZM254-652 140-763l57-56 113 113-56 54Zm508 512L651-255l54-54 114 110-57 59ZM40-440v-80h160v80H40Zm157 300-56-57 112-112 29 27 29 28-114 114Zm283-100q-100 0-170-70t-70-170q0-100 70-170t170-70q100 0 170 70t70 170q0 100-70 170t-170 70Zm0-80q66 0 113-47t47-113q0-66-47-113t-113-47q-66 0-113 47t-47 113q0 66 47 113t113 47Zm0-160Z"/>
                        </svg>
                        <h3>Weather</h3>
                            </div>
                            <Weather />
                </div>

                {/* Daily Affirmation Card */}
                <div className="dashboard-affirmation-card">
                    <div className="dashboard-card-header">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
                            <path d="M852-212 732-332l56-56 120 120-56 56ZM708-692l-56-56 120-120 56 56-120 120Zm-456 0L132-812l56-56 120 120-56 56ZM108-212l-56-56 120-120 56 56-120 120Zm246-75 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-361Z"/>
                        </svg>
                        <h3>Daily Reminder</h3>
                    </div>
                    <AffirmationCard />
                </div>
            </div>

            {/* Additional Suggestions Row */}
            <div className="dashboard-grid dashboard-grid-4">
                {/* Mood Tracker */}
                <div className="dashboard-small-card" onClick={() => window.location.href = '/diary#mood-checkin'}>
                    <div className="dashboard-icon-container mood-icon-bg">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
                            <path d="M260-280q-26 0-43-17t-17-43q0-25 17-42.5t43-17.5q25 0 42.5 17.5T320-340q0 26-17.5 43T260-280Zm0-280q-26 0-43-17t-17-43q0-25 17-42.5t43-17.5q25 0 42.5 17.5T320-620q0 26-17.5 43T260-560Zm140 120v-80h160v80H400Zm288 200-66-44q28-43 43-92.5T680-480q0-66-21.5-124T598-709l61-51q48 57 74.5 128.5T760-480q0 67-19 127.5T688-240Z"/>
                        </svg>
                    </div>
                    <h4>Mood Check</h4>
                    <p>How are you feeling?</p>
                </div>

                {/* Activity Log */}
                <div className="dashboard-small-card" onClick={() => window.location.href = '/diary#activity-checkin'}>
                    <div className="dashboard-icon-container entry-icon-bg">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
                            <path d="m280-40 123-622q6-29 27-43.5t44-14.5q23 0 42.5 10t31.5 30l40 64q18 29 46.5 52.5T700-529v-71h60v560h-60v-406q-48-11-89-35t-71-59l-24 120 84 80v300h-80v-240l-84-80-72 320h-84Zm17-395-85-16q-16-3-25-16.5t-6-30.5l30-157q6-32 34-50.5t60-12.5l46 9-54 274Zm243-305q-33 0-56.5-23.5T460-820q0-33 23.5-56.5T540-900q33 0 56.5 23.5T620-820q0 33-23.5 56.5T540-740Z"/>
                        </svg>
                    </div>
                    <h4>Activity Log</h4>
                    <p>Track your activities</p>
                </div>

                {/* Quick Goals */}
                <div className="dashboard-small-card" onClick={() => window.location.href = '/diary#set-intention'}>
                    <div className="dashboard-icon-container goals-icon-bg">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
                            <path d="M480-390Zm-132-53 55 37 77-39 77 39 53-35-40-79H386l-38 77ZM209-160h541L646-369l-83 55-83-41-83 41-85-56-103 210ZM80-80l234-475q10-20 29.5-32.5T386-600h54v-280h280l-40 80 40 80H520v120h50q23 0 42 12t30 32L880-80H80Z"/>
                        </svg>
                    </div>
                    <h4>Today's Goals</h4>
                    <p>Set 3 intentions</p>
                </div>

                {/* Gratitude */}
                <div className="dashboard-small-card" onClick={() => window.location.href = '/diary#note-gratitude'}>
                    <div className="dashboard-icon-container gratitude-icon-bg">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
                            <path d="M620-320v-109l-45-81q-7 5-11 13t-4 17v229L663-80h-93l-90-148v-252q0-31 15-57t41-43l-56-99q-20-38-17.5-80.5T495-832l68-68 276 324 41 496h-80l-39-464-203-238-6 6q-10 10-11.5 23t4.5 25l155 278v130h-80Zm-360 0v-130l155-278q6-12 4.5-25T408-776l-6-6-203 238-39 464H80l41-496 276-324 68 68q30 30 32.5 72.5T480-679l-56 99q26 17 41 43t15 57v252L390-80h-93l103-171v-229q0-9-4-17t-11-13l-45 81v109h-80Z"/>
                        </svg>
                    </div>
                    <h4>Gratitude</h4>
                    <p>3 things you're grateful for</p>
                </div>
            </div>

            {/* Your Personal Affirmation */}
            <div className="dashboard-personal-affirmation">
                <div className="dashboard-card">
                    <div className="dashboard-card-header">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
                            <path d="M480-340q63 0 112-39t63-101h-83q-12 27-37 43.5T480-420q-30 0-55-16.5T388-480h-83q14 62 63 101t112 39ZM370-540q21 0 35.5-14.5T420-590q0-21-14.5-35.5T370-640q-21 0-35.5 14.5T320-590q0 21 14.5 35.5T370-540Zm220 0q21 0 35.5-14.5T640-590q0-21-14.5-35.5T590-640q-21 0-35.5 14.5T540-590q0 21 14.5 35.5T590-540ZM480-120l-58-50q-101-88-167-152T150-437q-39-51-54.5-94T80-620q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 89T810-437q-39 51-105 115T538-170l-58 50Zm0-108q96-83 158-141t98-102.5q36-44.5 50-79t14-69.5q0-60-40-100t-100-40q-47 0-87 26.5T518-666h-76q-15-41-55-67.5T300-760q-60 0-100 40t-40 100q0 35 14 69.5t50 79Q260-427 322-369t158 141Zm0-266Z"/>
                        </svg>
                        <h3>Your Daily Affirmation</h3>
                    </div>
                    <MyAffirmationCard />
                </div>
            </div>

            {/* Call to Action */}
            <div className="dashboard-cta-section">
                <button 
                    className="dashboard-cta-button"
                    onClick={() => window.location.href = '/diary#new-entry'}
                >
                    Start Your Journal →
                </button>
            </div>
        </div>
    );
}