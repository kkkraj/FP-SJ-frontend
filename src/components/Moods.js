import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Moods(props) {
    const [moods, setMoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    const handleMoodClick = async (mood) => {
        try {
            console.log(`${mood.mood_name} clicked`);
            await api.moods.createUserMood({
                user_id: props.currentUserId,
                mood_id: mood.id
            });
            console.log('User mood created successfully');
        } catch (error) {
            console.error('Error creating user mood:', error);
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
                {moods.map((mood) => 
                    <div className="moods" key={mood.id}>
                        <img 
                            style={{width: '70px', height: 'auto', borderRadius: '100px'}} 
                            src={mood.mood_url} 
                            onClick={() => handleMoodClick(mood)}
                            alt={mood.mood_name}
                        />
                        <p className="text" style={{fontSize: '12px', marginBottom: '0'}}>{mood.mood_name}</p>
                    </div>
                )}
            </div>
        </div>
    );
}