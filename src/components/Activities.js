import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Activities(props) {
    const [activities, setActivities] = useState([]);
    const [selectedActivities, setSelectedActivities] = useState(new Set());
    const [userActivityIds, setUserActivityIds] = useState(new Map()); // Map activity_id to user_activity_id
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const activitiesData = await api.activities.getAll();
                setActivities(activitiesData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching activities:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchActivities();
    }, []);

    // Fetch user's activities for today to show current selections
    useEffect(() => {
        const fetchUserActivities = async () => {
            try {
                const userActivitiesData = await api.activities.getUserActivities(props.currentUserId);
                console.log('Fetched user activities:', userActivitiesData);
                
                // Create a set of activity IDs that the user has already selected today
                const todayActivityIds = new Set(userActivitiesData.map(userActivity => userActivity.activity_id));
                console.log('Today activity IDs:', Array.from(todayActivityIds));
                setSelectedActivities(todayActivityIds);
                
                // Create a map of activity_id to user_activity_id for deletion
                const activityIdMap = new Map();
                userActivitiesData.forEach(userActivity => {
                    activityIdMap.set(userActivity.activity_id, userActivity.id);
                });
                console.log('Activity ID mapping:', Object.fromEntries(activityIdMap));
                setUserActivityIds(activityIdMap);
            } catch (error) {
                console.error('Error fetching user activities:', error);
            }
        };

        if (props.currentUserId) {
            fetchUserActivities();
        }
    }, [props.currentUserId]);

    const handleActivityClick = async (activity) => {
        const isCurrentlySelected = selectedActivities.has(activity.id);

        if (isCurrentlySelected) {
            // Deselect the activity
            try {
                console.log(`Deselecting ${activity.activity_name}`);
                const userActivityId = userActivityIds.get(activity.id);
                if (userActivityId) {
                    await api.activities.deleteUserActivity(userActivityId);
                    console.log(`${activity.activity_name} deselected from database`);
                }
                
                // Update local state
                setSelectedActivities(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(activity.id);
                    return newSet;
                });
                
                setUserActivityIds(prev => {
                    const newMap = new Map(prev);
                    newMap.delete(activity.id);
                    return newMap;
                });
            } catch (error) {
                console.error('Error deselecting activity:', error);
            }
        } else {
            // Select the activity
            try {
                const response = await api.activities.createUserActivity({
                    user_id: props.currentUserId,
                    activity_id: activity.id
                });
                console.log('User activity created successfully');
                
                // Add to selected activities and store the user activity ID
                setSelectedActivities(prev => new Set([...prev, activity.id]));
                setUserActivityIds(prev => new Map(prev).set(activity.id, response.id));
            } catch (error) {
                console.error('Error creating user activity:', error);
            }
        }
    };

    if (loading) {
        return <div>Loading activities...</div>;
    }

    if (error) {
        return <div>Error loading activities: {error}</div>;
    }

    return (
        <div style={{textAlign: 'center'}}>
            <div className="actvdiv" style={{textAlign: 'center', display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)'}}>
                {activities.map((activity) => {
                    const isSelected = selectedActivities.has(activity.id);
                    return (
                        <div 
                            className="actvs" 
                            key={activity.id} 
                            style={{
                                paddingTop: '7.5px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            onClick={() => handleActivityClick(activity)}
                        >
                            <img 
                                style={{
                                    width: '50px', 
                                    height: 'auto', 
                                    border: '2px solid black', 
                                    borderRadius: '100px',
                                    transition: 'all 0.3s ease',
                                    boxShadow: isSelected ? '0 4px 12px rgba(255, 127, 80, 0.4)' : 'none'
                                }} 
                                src={activity.activity_url} 
                                alt={activity.activity_name}
                            />
                            <p className="text" style={{
                                fontSize: '12px', 
                                paddingTop: '11px', 
                                marginBottom: '0',
                                fontWeight: isSelected ? 'bold' : 'normal',
                                color: isSelected ? 'coral' : 'inherit'
                            }}>
                                {activity.activity_name}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}