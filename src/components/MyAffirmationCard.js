import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

const MyAffirmationCard = () => {
    const [affirmation, setAffirmation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAffirmation = async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch all affirmations from your API and select one randomly
            const cacheBuster = `?t=${Date.now()}`;
            const baseUrl = `https://daily-affirmation-api.netlify.app/affirmations.json${cacheBuster}`;
            
            // Try multiple CORS proxies for better reliability
            const proxies = [
                `https://api.allorigins.win/raw?url=${encodeURIComponent(baseUrl)}`,
                `https://cors-anywhere.herokuapp.com/${baseUrl}`,
                `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(baseUrl)}`
            ];

            let success = false;
            for (const proxyUrl of proxies) {
                try {
                    const response = await fetch(proxyUrl);
                    if (response.ok) {
                        const data = await response.json();
                        console.log('MyAffirmationCard - Fetched affirmations:', data.length, 'total');
                        
                        // Select a random affirmation from the full list
                        const randomIndex = Math.floor(Math.random() * data.length);
                        const selectedAffirmation = data[randomIndex];
                        console.log('MyAffirmationCard - Selected affirmation:', selectedAffirmation);
                        
                        setAffirmation(selectedAffirmation.text);
                        success = true;
                        break;
                    }
                } catch (proxyError) {
                    console.log(`Proxy failed: ${proxyUrl}`, proxyError);
                    continue;
                }
            }

            if (!success) {
                throw new Error('All CORS proxies failed');
            }
        } catch (err) {
            console.error('Error fetching affirmation:', err);
            setError('Failed to load affirmation. Please try again.');
            // Fallback affirmation if API fails
            setAffirmation("You are capable of amazing things!");
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
                <p className="affirmation-text loading-dots">
                </p>
            ) : error ? (
                <div style={{ color: '#dc3545' }}>
                    <p>{error}</p>
                    <Button 
                        variant="outline-primary" 
                        size="sm" 
                        onClick={fetchAffirmation}
                        style={{ 
                            borderColor: 'rgb(88, 153, 150)', 
                            color: 'rgb(88, 153, 150)' 
                        }}
                    >
                        Try Again
                    </Button>
                </div>
            ) : (
                <p className="affirmation-text">
                    "{affirmation}"
                </p>
            )}
        </div>
    );
};

export default MyAffirmationCard;
