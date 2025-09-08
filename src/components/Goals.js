import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Goals(props) {
    const [goals, setGoals] = useState([]);
    const [userGoals, setUserGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newGoalText, setNewGoalText] = useState('');
    const [editingGoal, setEditingGoal] = useState(null);
    const [editingText, setEditingText] = useState('');

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const goalsData = await api.goals.getAll();
                setGoals(goalsData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching goals:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchGoals();
    }, []);

    // Fetch user's goals for today
    useEffect(() => {
        const fetchUserGoals = async () => {
            try {
                const userGoalsData = await api.goals.getUserGoals(props.currentUserId);
                setUserGoals(userGoalsData);
            } catch (error) {
                console.error('Error fetching user goals:', error);
            }
        };

        if (props.currentUserId) {
            fetchUserGoals();
        }
    }, [props.currentUserId]);

    const handleCreateGoal = async (e) => {
        e.preventDefault();
        if (!newGoalText.trim()) return;

        try {
            const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
            const response = await api.goals.createUserGoal({
                user_id: props.currentUserId,
                goal_text: newGoalText.trim(),
                date: today
            });
            
            // Add the new goal to the list
            setUserGoals(prev => [...prev, response]);
            setNewGoalText('');
        } catch (error) {
            console.error('Error creating goal:', error);
            setError('Failed to create goal. Please try again.');
        }
    };

    const handleEditGoal = (goal) => {
        setEditingGoal(goal.id);
        setEditingText(goal.goal_text);
    };

    const handleUpdateGoal = async (e) => {
        e.preventDefault();
        if (!editingText.trim()) return;

        try {
            await api.goals.updateUserGoal(editingGoal, {
                goal_text: editingText.trim()
            });
            
            // Update the goal in the list
            setUserGoals(prev => 
                prev.map(goal => 
                    goal.id === editingGoal 
                        ? { ...goal, goal_text: editingText.trim() }
                        : goal
                )
            );
            
            setEditingGoal(null);
            setEditingText('');
        } catch (error) {
            console.error('Error updating goal:', error);
            setError('Failed to update goal. Please try again.');
        }
    };

    const handleDeleteGoal = async (goalId) => {
        try {
            await api.goals.deleteUserGoal(goalId);
            
            // Remove the goal from the list
            setUserGoals(prev => prev.filter(goal => goal.id !== goalId));
        } catch (error) {
            console.error('Error deleting goal:', error);
            setError('Failed to delete goal. Please try again.');
        }
    };

    const cancelEdit = () => {
        setEditingGoal(null);
        setEditingText('');
    };

    if (loading) {
        return <div>Loading goals...</div>;
    }

    if (error) {
        return (
            <div className="goals-error">
                <i className="material-icons">error</i>
                <p>{error}</p>
                <button onClick={() => setError(null)} className="goals-retry-button">
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="goals-container">
            {/* Create new goal form */}
            <form onSubmit={handleCreateGoal} className="goals-create-form">
                <div className="goals-input-group">
                    <input
                        type="text"
                        value={newGoalText}
                        onChange={(e) => setNewGoalText(e.target.value)}
                        placeholder="What's your intention for today?"
                        className="goals-input"
                        maxLength={200}
                    />
                    <button type="submit" className="goals-add-button">
                        <i className="material-icons">add</i>
                    </button>
                </div>
            </form>

            {/* Goals list */}
            <div className="goals-list">
                {userGoals.length === 0 ? (
                    <div className="goals-empty">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#666" className="goals-empty-icon">
                            <path d="M480-390Zm-132-53 55 37 77-39 77 39 53-35-40-79H386l-38 77ZM209-160h541L646-369l-83 55-83-41-83 41-85-56-103 210ZM80-80l234-475q10-20 29.5-32.5T386-600h54v-280h280l-40 80 40 80H520v120h50q23 0 42 12t30 32L880-80H80Z"/>
                        </svg>
                        <p>No intentions set for today. Add one above!</p>
                    </div>
                ) : (
                    userGoals.map((goal) => (
                        <div key={goal.id} className="goals-item">
                            {editingGoal === goal.id ? (
                                <form onSubmit={handleUpdateGoal} className="goals-edit-form">
                                    <input
                                        type="text"
                                        value={editingText}
                                        onChange={(e) => setEditingText(e.target.value)}
                                        className="goals-edit-input"
                                        autoFocus
                                        maxLength={200}
                                    />
                                    <div className="goals-edit-actions">
                                        <button type="submit" className="goals-save-button">
                                            <i className="material-icons">check</i>
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={cancelEdit}
                                            className="goals-cancel-button"
                                        >
                                            <i className="material-icons">close</i>
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="goals-item-content">
                                    <div className="goals-item-left">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f" className="goals-item-icon">
                                            <path d="M480-390Zm-132-53 55 37 77-39 77 39 53-35-40-79H386l-38 77ZM209-160h541L646-369l-83 55-83-41-83 41-85-56-103 210ZM80-80l234-475q10-20 29.5-32.5T386-600h54v-280h280l-40 80 40 80H520v120h50q23 0 42 12t30 32L880-80H80Z"/>
                                        </svg>
                                        <p className="goals-item-text">{goal.goal_text}</p>
                                    </div>
                                    <div className="goals-item-actions">
                                        <button 
                                            onClick={() => handleEditGoal(goal)}
                                            className="goals-edit-button"
                                            title="Edit intention"
                                        >
                                            <i className="material-icons">edit</i>
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteGoal(goal.id)}
                                            className="goals-delete-button"
                                            title="Delete intention"
                                        >
                                            <i className="material-icons">delete</i>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
