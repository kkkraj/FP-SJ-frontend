import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Moods(props) {
    const [moods, setMoods] = useState([]);
    const [selectedMoods, setSelectedMoods] = useState(new Set());
    const [userMoodIds, setUserMoodIds] = useState(new Map()); // Map mood_id to user_mood_id
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to map mood names for display
    const getDisplayName = (moodName) => {
        const nameMap = {
            'Good': 'Content',
            'good': 'Content',
            'Cool': 'Neutral',
            'cool': 'Neutral',
            'Angry': 'Frustrated',
            'angry': 'Frustrated'
        };
        return nameMap[moodName] || moodName;
    };

    useEffect(() => {
        const fetchMoods = async () => {
            try {
                const moodsData = await api.moods.getAll();
                setMoods(moodsData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching moods:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchMoods();
    }, []);

    // Fetch user's moods for today to show current selections
    useEffect(() => {
        const fetchUserMoods = async () => {
            try {
                const userMoodsData = await api.moods.getUserMoods(props.currentUserId);
                console.log('Fetched user moods:', userMoodsData);
                
                // Create a set of mood IDs that the user has already selected today
                const todayMoodIds = new Set(userMoodsData.map(userMood => userMood.mood_id));
                console.log('Today mood IDs:', Array.from(todayMoodIds));
                setSelectedMoods(todayMoodIds);
                
                // Create a map of mood_id to user_mood_id for deletion
                const moodIdMap = new Map();
                userMoodsData.forEach(userMood => {
                    moodIdMap.set(userMood.mood_id, userMood.id);
                });
                console.log('Mood ID mapping:', Object.fromEntries(moodIdMap));
                setUserMoodIds(moodIdMap);
            } catch (error) {
                console.error('Error fetching user moods:', error);
            }
        };

        if (props.currentUserId) {
            fetchUserMoods();
        }
    }, [props.currentUserId]);

    const handleMoodClick = async (mood) => {
        const isCurrentlySelected = selectedMoods.has(mood.id);

        if (isCurrentlySelected) {
            // Deselect the mood
            try {
                console.log(`Deselecting ${mood.mood_name}`);
                const userMoodId = userMoodIds.get(mood.id);
                if (userMoodId) {
                    await api.moods.deleteUserMood(userMoodId);
                    console.log(`${mood.mood_name} deselected from database`);
                }
                
                // Update local state
                setSelectedMoods(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(mood.id);
                    return newSet;
                });
                
                setUserMoodIds(prev => {
                    const newMap = new Map(prev);
                    newMap.delete(mood.id);
                    return newMap;
                });
            } catch (error) {
                console.error('Error deselecting mood:', error);
            }
        } else {
            // Select the mood
            try {
                console.log(`${mood.mood_name} clicked`);
                const response = await api.moods.createUserMood({
                    user_id: props.currentUserId,
                    mood_id: mood.id
                });
                console.log('User mood created successfully');
                
                // Add to selected moods and store the user mood ID
                setSelectedMoods(prev => new Set([...prev, mood.id]));
                setUserMoodIds(prev => new Map(prev).set(mood.id, response.id));
            } catch (error) {
                console.error('Error creating user mood:', error);
            }
        }
    };

    if (loading) {
        return <div>Loading moods...</div>;
    }

    if (error) {
        return <div>Error loading moods: {error}</div>;
    }

    return ( 
        <div style={{textAlign: 'center'}}>
            <div className="moodsdiv" style={{textAlign: 'center', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)'}}>
                {moods.map((mood) => {
                    const isSelected = selectedMoods.has(mood.id);
                    return (
                        <div 
                            className={`moods mood-item ${isSelected ? 'selected' : ''}`}
                            key={mood.id}
                            style={{
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            onClick={() => handleMoodClick(mood)}
                        >
                            <img 
                                style={{
                                    width: '70px', 
                                    height: 'auto', 
                                    borderRadius: '100px',
                                    transition: 'all 0.3s ease'
                                }} 
                                src={mood.mood_url} 
                                alt={mood.mood_name}
                            />
                            <p className="text" style={{
                                fontSize: '12px', 
                                marginBottom: '0',
                                marginTop: '5px',
                                fontWeight: isSelected ? 'bold' : 'normal',
                                color: isSelected ? 'rgb(87, 177, 172)' : 'inherit'
                            }}>
                                {getDisplayName(mood.mood_name)}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}