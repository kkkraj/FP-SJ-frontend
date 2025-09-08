import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Gratitude(props) {
    const [gratitudes, setGratitudes] = useState([]);
    const [userGratitudes, setUserGratitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newGratitudeText, setNewGratitudeText] = useState('');
    const [editingGratitude, setEditingGratitude] = useState(null);
    const [editingText, setEditingText] = useState('');

    useEffect(() => {
        const fetchGratitudes = async () => {
            try {
                const gratitudesData = await api.gratitudes.getAll();
                setGratitudes(gratitudesData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching gratitudes:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchGratitudes();
    }, []);

    // Fetch user's gratitudes for today
    useEffect(() => {
        const fetchUserGratitudes = async () => {
            try {
                const userGratitudesData = await api.gratitudes.getUserGratitudes(props.currentUserId);
                setUserGratitudes(userGratitudesData);
            } catch (error) {
                console.error('Error fetching user gratitudes:', error);
            }
        };

        if (props.currentUserId) {
            fetchUserGratitudes();
        }
    }, [props.currentUserId]);

    const handleCreateGratitude = async (e) => {
        e.preventDefault();
        if (!newGratitudeText.trim()) return;

        try {
            const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
            const response = await api.gratitudes.createUserGratitude({
                gratitude_text: newGratitudeText.trim(),
                date: today
            }, props.currentUserId);
            
            // Add the new gratitude to the list
            setUserGratitudes(prev => [...prev, response]);
            setNewGratitudeText('');
        } catch (error) {
            console.error('Error creating gratitude:', error);
            setError('Failed to create gratitude. Please try again.');
        }
    };

    const handleEditGratitude = (gratitude) => {
        setEditingGratitude(gratitude.id);
        setEditingText(gratitude.gratitude_text || '');
    };

    const handleUpdateGratitude = async (e) => {
        e.preventDefault();
        if (!editingText.trim()) return;

        try {
            await api.gratitudes.updateUserGratitude(editingGratitude, {
                gratitude_text: editingText.trim()
            });
            
            // Update the gratitude in the list
            setUserGratitudes(prev => 
                prev.map(gratitude => 
                    gratitude.id === editingGratitude 
                        ? { ...gratitude, gratitude_text: editingText.trim() }
                        : gratitude
                )
            );
            
            setEditingGratitude(null);
            setEditingText('');
        } catch (error) {
            console.error('Error updating gratitude:', error);
            setError('Failed to update gratitude. Please try again.');
        }
    };

    const handleDeleteGratitude = async (gratitudeId) => {
        try {
            await api.gratitudes.deleteUserGratitude(gratitudeId);
            
            // Remove the gratitude from the list
            setUserGratitudes(prev => prev.filter(gratitude => gratitude.id !== gratitudeId));
        } catch (error) {
            console.error('Error deleting gratitude:', error);
            setError('Failed to delete gratitude. Please try again.');
        }
    };

    const cancelEdit = () => {
        setEditingGratitude(null);
        setEditingText('');
    };

    if (loading) {
        return <div>Loading gratitudes...</div>;
    }

    if (error) {
        return (
            <div className="gratitude-error">
                <i className="material-icons">error</i>
                <p>{error}</p>
                <button onClick={() => setError(null)} className="gratitude-retry-button">
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="gratitude-container">
            {/* Create new gratitude form */}
            <form onSubmit={handleCreateGratitude} className="gratitude-create-form">
                <div className="gratitude-input-group">
                    <input
                        type="text"
                        value={newGratitudeText}
                        onChange={(e) => setNewGratitudeText(e.target.value)}
                        placeholder="Take a moment to reflect on the positive things in your life."
                        className="gratitude-input"
                        maxLength={200}
                    />
                    <button type="submit" className="gratitude-add-button">
                        <i className="material-icons">add</i>
                    </button>
                </div>
            </form>

            {/* Gratitudes list */}
            <div className="gratitude-list">
                {userGratitudes.length === 0 ? (
                    <div className="gratitude-empty">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f" className="gratitude-empty-icon">
                            <path d="M620-320v-109l-45-81q-7 5-11 13t-4 17v229L663-80h-93l-90-148v-252q0-31 15-57t41-43l-56-99q-20-38-17.5-80.5T495-832l68-68 276 324 41 496h-80l-39-464-203-238-6 6q-10 10-11.5 23t4.5 25l155 278v130h-80Zm-360 0v-130l155-278q6-12 4.5-25T408-776l-6-6-203 238-39 464H80l41-496 276-324 68 68q30 30 32.5 72.5T480-679l-56 99q26 17 41 43t15 57v252L390-80h-93l103-171v-229q0-9-4-17t-11-13l-45 81v109h-80Z"/>
                        </svg>
                        <p>No gratitudes recorded for today. Add one above!</p>
                    </div>
                ) : (
                    userGratitudes.map((gratitude) => (
                        <div key={gratitude.id} className="gratitude-item">
                            {editingGratitude === gratitude.id ? (
                                <form onSubmit={handleUpdateGratitude} className="gratitude-edit-form">
                                    <input
                                        type="text"
                                        value={editingText}
                                        onChange={(e) => setEditingText(e.target.value)}
                                        className="gratitude-edit-input"
                                        autoFocus
                                        maxLength={200}
                                    />
                                    <div className="gratitude-edit-actions">
                                        <button type="submit" className="gratitude-save-button">
                                            <i className="material-icons">check</i>
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={cancelEdit}
                                            className="gratitude-cancel-button"
                                        >
                                            <i className="material-icons">close</i>
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="gratitude-item-content">
                                    <p className="gratitude-item-text">
                                        {gratitude.gratitude_text || 'No text found'}
                                    </p>
                                    <button 
                                        onClick={() => handleDeleteGratitude(gratitude.id)}
                                        className="gratitude-delete-x"
                                        title="Delete gratitude"
                                    >
                                        ×
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
