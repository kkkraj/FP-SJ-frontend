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
                    api.userMoods.getAll(currentUserId),
                    api.moods.getAll(),
                    api.activities.getAll(),
                    api.userActivities.getAll(currentUserId)
                ]);

                console.log('=== DEBUGGING DATA FETCH ===');
                console.log('Current User ID:', currentUserId);
                console.log('Selected Date:', props.selectedDate);
                console.log('All Diaries:', diariesData);
                console.log('All User Moods:', userMoodsData);
                console.log('All Moods List:', moodsListData);
                console.log('All Activities:', activitiesData);
                console.log('All User Activities:', userActivitiesData);

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

    // Helper function to format date for comparison
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Add 1 because getMonth() returns 0-11
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Get unique moods for the selected date
    const getUniqueMoodsForDate = () => {
        console.log('Selected date:', props.selectedDate);
        console.log('All user moods:', userMoods);
        
        const dateMoods = userMoods.filter(userMood => {
            const formatted = formatDate(userMood.created_at);
            console.log('User mood date:', userMood.created_at, 'Formatted:', formatted, 'Selected:', props.selectedDate);
            return userMood.user_id === currentUserId && formatted === props.selectedDate;
        });

        console.log('Filtered date moods:', dateMoods);

        // Get unique mood IDs to avoid duplicates
        const uniqueMoodIds = [...new Set(dateMoods.map(userMood => userMood.mood_id))];
        console.log('Unique mood IDs:', uniqueMoodIds);
        
        return uniqueMoodIds.map(moodId => {
            const mood = moodsList.find(m => m.id === moodId);
            return mood;
        }).filter(Boolean); // Remove any undefined moods
    };

    // Get unique activities for the selected date
    const getUniqueActivitiesForDate = () => {
        console.log('Selected date:', props.selectedDate);
        console.log('All user activities:', userActivities);
        
        const dateActivities = userActivities.filter(userActivity => {
            const formatted = formatDate(userActivity.created_at);
            console.log('User activity date:', userActivity.created_at, 'Formatted:', formatted, 'Selected:', props.selectedDate);
            return userActivity.user_id === currentUserId && formatted === props.selectedDate;
        });

        console.log('Filtered date activities:', dateActivities);

        // Get unique activity IDs to avoid duplicates
        const uniqueActivityIds = [...new Set(dateActivities.map(userActivity => userActivity.activity_id))];
        console.log('Unique activity IDs:', uniqueActivityIds);
        
        return uniqueActivityIds.map(activityId => {
            const activity = activitiesList.find(a => a.id === activityId);
            return activity;
        }).filter(Boolean); // Remove any undefined activities
    };

    if (loading) {
        return <div>Loading diary entries...</div>;
    }

    if (error) {
        return <div>Error loading diary entries: {error}</div>;
    }

    const uniqueMoods = getUniqueMoodsForDate();
    const uniqueActivities = getUniqueActivitiesForDate();

    return (
        <div className="text">
            <div className="detail-header">
                <h4 className="booheaders">Journal</h4>
                {diaries.filter(diary => {
                    const formatted = formatDate(diary.created_at);
                    return diary.user_id === currentUserId && formatted === props.selectedDate;
                }).length > 0 ? (
                    diaries.map((diary) => {
                        const formatted = formatDate(diary.created_at);
                        
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
                                            style={{
                                                width: '32px', 
                                                height: '32px', 
                                                marginTop: '10px',
                                                border: 'none',
                                                borderRadius: '50%',
                                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                boxShadow: '0 2px 8px rgba(187, 187, 187, 0.3)',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.backgroundColor = 'rgba(255, 99, 71, 0.1)';
                                                e.target.style.boxShadow = '0 4px 12px rgba(255, 99, 71, 0.3)';
                                                e.target.style.transform = 'scale(1.1)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                                                e.target.style.boxShadow = '0 2px 8px rgba(187, 187, 187, 0.3)';
                                                e.target.style.transform = 'scale(1)';
                                            }}
                                            onClick={() => handleDeleteClick(diary)}>
                                            <i 
                                                className="material-icons" 
                                                style={{
                                                    color: 'rgb(98, 104, 110)',
                                                    fontSize: '18px',
                                                    transition: 'color 0.3s ease'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.color = 'tomato';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.color = 'rgb(98, 104, 110)';
                                                }}>
                                                delete
                                            </i>
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
                {uniqueMoods.length > 0 ? (
                    <ul style={{listStyle: 'none', padding: 0}}>
                        {uniqueMoods.map((mood) => (
                            <li key={mood.id}>
                                <img style={{width: '30px', height: 'auto'}} src={mood.mood_url} alt={mood.mood_name}/> 
                                {sanitizeContent(mood.mood_name)}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p style={{color: 'gray', fontStyle: 'italic'}}>No entry for this day.</p>
                )}
            </div>
            <br/>
            <div className="detail-header">
                <h4 className="booheaders">Activities</h4>
                {uniqueActivities.length > 0 ? (
                    <ul style={{listStyle: 'none', padding: 0}}>
                        {uniqueActivities.map((activity) => (
                            <li key={activity.id}>
                                <img style={{width: '30px', height: 'auto'}} src={activity.activity_url} alt={activity.activity_name}/> 
                                {sanitizeContent(activity.activity_name)}
                            </li>
                        ))}
                    </ul>
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