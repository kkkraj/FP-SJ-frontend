import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import api from '../services/api';
import ConfirmationModal from './ConfirmationModal';

export default function Diarybook(props) {
    const [diaries, setDiaries] = useState([]);
    const [currentUserId] = useState(props.currentUser.id);
    const [userMoods, setUserMoods] = useState([]);
    const [moodsList, setMoodsList] = useState([]);
    const [activitiesList, setActivitiesList] = useState([]);
    const [userActivities, setUserActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [diaryToDelete, setDiaryToDelete] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all data in parallel
                const [diariesData, userMoodsData, moodsListData, activitiesData, userActivitiesData] = await Promise.all([
                    api.diary.getAll(),
                    api.userMoods.getAll(),
                    api.moods.getAll(),
                    api.activities.getAll(),
                    api.userActivities.getAll()
                ]);

                setDiaries(diariesData);
                setUserMoods(userMoodsData);
                setMoodsList(moodsListData);
                setActivitiesList(activitiesData);
                setUserActivities(userActivitiesData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDeleteClick = (diary) => {
        setDiaryToDelete(diary);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!diaryToDelete) return;
        
        try {
            await api.diary.delete(diaryToDelete.id);
            const entries = diaries.filter((entry) => entry.id !== diaryToDelete.id);
            setDiaries(entries);
        } catch (error) {
            console.error('Error deleting diary:', error);
        } finally {
            setShowDeleteModal(false);
            setDiaryToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setDiaryToDelete(null);
    };

    // Helper function to sanitize content for display
    const sanitizeContent = (content) => {
        return DOMPurify.sanitize(content);
    };

    if (loading) {
        return <div>Loading diary entries...</div>;
    }

    if (error) {
        return <div>Error loading diary entries: {error}</div>;
    }

    return (
        <div className="text">
            <div className="detail-header">
                <h4 className="booheaders">Journal</h4>
                {diaries.filter(diary => {
                    const date1 = new Date(diary.created_at);
                    const date2 = date1.getDate();
                    const month = date1.getMonth();
                    const year = date1.getFullYear();
                    const formatted = year + '-' + month + '-' + date2;
                    return diary.user_id === currentUserId && formatted === props.selectedDate;
                }).length > 0 ? (
                    diaries.map((diary) => {
                        const date1 = new Date(diary.created_at);
                        const date2 = date1.getDate();
                        const month = date1.getMonth();
                        const year = date1.getFullYear();
                        const formatted = year + '-' + month + '-' + date2;
                        
                        return diary.user_id === currentUserId && formatted === props.selectedDate ? (
                            <div key={diary.id}>
                                <ul style={{listStyle: 'none', padding: 0}}>
                                    <li style={{fontWeight: 'bold', color: 'DarkSlateGrey'}}>
                                        {sanitizeContent(diary.title)}
                                    </li>
                                    <li id="diary-content">
                                        {sanitizeContent(diary.content)}
                                    </li>
                                    <li>
                                        <button 
                                            style={{width: '30px', height: '30px', marginTop: '10px'}} 
                                            className="btn-floating btn-small waves-effect waves-light grey lighten-5" 
                                            onClick={() => handleDeleteClick(diary)}>
                                            <i className="material-icons" style={{color: 'LightSteelBlue'}}>clear</i>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        ) : null;
                    })
                ) : (
                    <p style={{color: 'gray', fontStyle: 'italic'}}>No entry for this day.</p>
                )}
            </div>
            <br/>
            <div className="detail-header">
                <h4 className="booheaders">Moods</h4>
                {userMoods.filter(userMood => {
                    const date1 = new Date(userMood.created_at);
                    const date2 = date1.getDate();
                    const month = date1.getMonth();
                    const year = date1.getFullYear();
                    const formatted = year + '-' + month + '-' + date2;
                    return userMood.user_id === currentUserId && formatted === props.selectedDate;
                }).length > 0 ? (
                    userMoods.map((userMood) => 
                        moodsList.map((mood) => {
                            const date1 = new Date(userMood.created_at);
                            const date2 = date1.getDate();
                            const month = date1.getMonth();
                            const year = date1.getFullYear();
                            const formatted = year + '-' + month + '-' + date2;
                            
                            return userMood.mood_id === mood.id && userMood.user_id === currentUserId && formatted === props.selectedDate ? (
                                <ul key={mood.id} style={{listStyle: 'none', padding: 0}}>
                                    <li>
                                        <img style={{width: '30px', height: 'auto'}} src={mood.mood_url} alt={mood.mood_name}/> 
                                        {sanitizeContent(mood.mood_name)}
                                    </li>
                                </ul>
                            ) : null;
                        })
                    )
                ) : (
                    <p style={{color: 'gray', fontStyle: 'italic'}}>No entry for this day.</p>
                )}
            </div>
            <br/>
            <div className="detail-header">
                <h4 className="booheaders">Activities</h4>
                {userActivities.filter(userActivity => {
                    const date1 = new Date(userActivity.created_at);
                    const date2 = date1.getDate();
                    const month = date1.getMonth();
                    const year = date1.getFullYear();
                    const formatted = year + '-' + month + '-' + date2;
                    return userActivity.user_id === currentUserId && formatted === props.selectedDate;
                }).length > 0 ? (
                    userActivities.map((userActivity) =>
                        activitiesList.map((activity) => {
                            const date1 = new Date(userActivity.created_at);
                            const date2 = date1.getDate();
                            const month = date1.getMonth();
                            const year = date1.getFullYear();
                            const formatted = year + '-' + month + '-' + date2;
                            
                            return userActivity.activity_id === activity.id && userActivity.user_id === currentUserId && formatted === props.selectedDate ? (
                                <ul key={activity.id} style={{listStyle: 'none', padding: 0}}>
                                    <li>
                                        <img style={{width: '30px', height: 'auto'}} src={activity.activity_url} alt={activity.activity_name}/> 
                                        {sanitizeContent(activity.activity_name)}
                                    </li>
                                </ul>
                            ) : null;
                        })
                    )
                ) : (
                    <p style={{color: 'gray', fontStyle: 'italic'}}>No entry for this day.</p>
                )}
            </div>
            <ConfirmationModal
                isOpen={showDeleteModal}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                title="Delete Diary Entry"
                message="Are you sure you want to delete this diary entry? This action cannot be undone."
            />
        </div>
    );
}