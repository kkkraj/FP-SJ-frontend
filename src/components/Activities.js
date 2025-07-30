import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Activities(props) {
    const [activities, setActivities] = useState([]);
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

    const handleActivityClick = async (activity) => {
        try {
            await api.activities.createUserActivity({
                user_id: props.currentUserId,
                activity_id: activity.id
            });
            console.log('User activity created successfully');
        } catch (error) {
            console.error('Error creating user activity:', error);
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
                {activities.map((activity) => 
                    <div className="actvs" key={activity.id} style={{paddingTop: '7.5px'}}>
                        <img 
                            style={{width: '50px', height: 'auto', border: '2px solid black', borderRadius: '100px'}} 
                            src={activity.activity_url} 
                            onClick={() => handleActivityClick(activity)}
                            alt={activity.activity_name}
                        />
                        <p className="text" style={{fontSize: '12px', paddingTop: '11px', marginBottom: '0'}}>{activity.activity_name}</p>
                    </div>
                )}
            </div>
        </div>
    );
}