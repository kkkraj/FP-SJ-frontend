import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Button } from 'react-bootstrap';

const AffirmationCard = () => {
    const [affirmation, setAffirmation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAffirmation = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.affirmations.getRandom();
            // Public API returns: { "affirmation": "text" }
            setAffirmation(data.affirmation);
        } catch (err) {
            console.error('Error fetching affirmation:', err);
            setError('Failed to load affirmation. Please try again.');
            // Fallback affirmation if API fails
            setAffirmation("You are doing great! Keep going with your positive journey.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAffirmation();
    }, []);

    return (
        <div className="dashboard-affirmation-content">
            {loading ? (
                <p className="reminder-text loading-dots">
                </p>
            ) : error ? (
                <div style={{ color: '#dc3545' }}>
                    <p>{error}</p>
                    <Button 
                        variant="outline-light" 
                        size="sm" 
                        onClick={fetchAffirmation}
                        style={{ 
                            borderColor: 'white', 
                            color: 'white' 
                        }}
                    >
                        Try Again
                    </Button>
                </div>
            ) : (
                <p className="reminder-text">
                    "{affirmation}"
                </p>
            )}
        </div>
    );
};

export default AffirmationCard;
