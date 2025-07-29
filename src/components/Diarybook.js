import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';

const DiariesUrl = 'http://localhost:3000/diary_entries/';
const moodsURL = 'http://localhost:3000/moods';
const UserMoodURL = 'http://localhost:3000/user_moods';
const activitiesURL = 'http://localhost:3000/activities';
const UserActivitiesURL = 'http://localhost:3000/user_activities';

export default function Diarybook(props) {
    const [diaries, setDiaries] = useState([]);
    const [currentUserId] = useState(props.currentUser.id);
    const [userMoods, setUserMoods] = useState([]);
    const [moodsList, setMoodsList] = useState([]);
    const [activitiesList, setActivitiesList] = useState([]);
    const [userActivities, setUserActivities] = useState([]);

    useEffect(() => {
        // Fetch diaries
        fetch(DiariesUrl)
          .then((response) => response.json())
          .then((diariesData) => setDiaries(diariesData))
          .catch(error => console.error('Error fetching diaries:', error));

        // Fetch user moods
        fetch(UserMoodURL)
          .then((response) => response.json())
          .then((moodsData) => setUserMoods(moodsData))
          .catch(error => console.error('Error fetching user moods:', error));

        // Fetch moods list
        fetch(moodsURL)
          .then((response) => response.json())
          .then((moodsListData) => setMoodsList(moodsListData))
          .catch(error => console.error('Error fetching moods list:', error));

        // Fetch activities list
        fetch(activitiesURL)
          .then((response) => response.json())
          .then((activitiesData) => setActivitiesList(activitiesData))
          .catch(error => console.error('Error fetching activities list:', error));

        // Fetch user activities
        fetch(UserActivitiesURL)
          .then((response) => response.json())
          .then((userActivitiesData) => setUserActivities(userActivitiesData))
          .catch(error => console.error('Error fetching user activities:', error));
    }, []);

    const handleDeleteDiary = (diary) => {
        fetch(`${DiariesUrl}${diary.id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                const entries = diaries.filter((entry) => entry.id !== diary.id);
                setDiaries(entries);
            }
        })
        .catch(error => console.error('Error deleting diary:', error));
    };

    // Helper function to sanitize content for display
    const sanitizeContent = (content) => {
        return DOMPurify.sanitize(content);
    };

    return (
        <div className="text">
            <div className="detail-header">
                <h4 className="booheaders">Journal</h4>
                {diaries.map((diary) => {
                    const date1 = new Date(diary.created_at);
                    const date2 = date1.getDate();
                    const month = date1.getMonth();
                    const year = date1.getFullYear();
                    const formatted = year + '-' + month + '-' + date2;
                    
                    return diary.user_id === currentUserId && formatted === props.selectedDate ? (
                        <div key={diary.id}>
                            <ul>
                                <li style={{fontWeight: 'bold', color: 'DarkSlateGrey'}}>
                                    {sanitizeContent(diary.title)}
                                </li>
                                <li id="diary-content">
                                    {sanitizeContent(diary.content)}
                                </li>
                                <button 
                                    style={{width: '30px', height: '30px', marginTop: '10px'}} 
                                    className="btn-floating btn-small waves-effect waves-light grey lighten-5" 
                                    onClick={() => handleDeleteDiary(diary)}>
                                    <i className="material-icons" style={{color: 'LightSteelBlue'}}>clear</i>
                                </button>
                            </ul>
                        </div>
                    ) : null;
                })}
            </div>
            <br/>
            <div className="detail-header">
                <h4 className="booheaders">Moods</h4>
                {userMoods.map((userMood) => 
                    moodsList.map((mood) => {
                        const date1 = new Date(userMood.created_at);
                        const date2 = date1.getDate();
                        const month = date1.getMonth();
                        const year = date1.getFullYear();
                        const formatted = year + '-' + month + '-' + date2;
                        
                        return userMood.mood_id === mood.id && userMood.user_id === currentUserId && formatted === props.selectedDate ? (
                            <ul key={mood.id}>
                                <li>
                                    <img style={{width: '30px', height: 'auto'}} src={mood.mood_url} alt={mood.mood_name}/> 
                                    {sanitizeContent(mood.mood_name)}
                                </li>
                            </ul>
                        ) : null;
                    })
                )}
            </div>
            <br/>
            <div className="detail-header">
                <h4 className="booheaders">Activities</h4>
                {userActivities.map((userActivity) =>
                    activitiesList.map((activity) => {
                        const date1 = new Date(userActivity.created_at);
                        const date2 = date1.getDate();
                        const month = date1.getMonth();
                        const year = date1.getFullYear();
                        const formatted = year + '-' + month + '-' + date2;
                        
                        return userActivity.activity_id === activity.id && userActivity.user_id === currentUserId && formatted === props.selectedDate ? (
                            <ul key={activity.id}>
                                <li>
                                    <img style={{width: '30px', height: 'auto'}} src={activity.activity_url} alt={activity.activity_name}/> 
                                    {sanitizeContent(activity.activity_name)}
                                </li>
                            </ul>
                        ) : null;
                    })
                )}
            </div>
        </div>
    );
}