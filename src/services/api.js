const token = () => localStorage.getItem('token');
const headers = () => ({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${token()}`
});

const API_ROOT = `http://localhost:3000/api/v1`;

const signup = (userInfo) => {
    console.log('API: Attempting signup with data:', userInfo);
    console.log('API: Using endpoint:', `${API_ROOT}/users/`);
    
    // Try different data formats that Rails APIs commonly expect
    const dataFormats = [
        userInfo, // Original format
        { user: userInfo }, // Wrapped in 'user' key
                    {
                user: {
                    name: userInfo.name,
                    email: userInfo.email,
                password: userInfo.password,
                password_confirmation: userInfo.password_confirmation
                }
            }
    ];
    
    // Try each format until one works
    const trySignup = async (format, formatIndex) => {
        console.log(`API: Trying data format ${formatIndex + 1}:`, format);
        
        try {
            const response = await fetch(`${API_ROOT}/users/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(format)
            });
            
            console.log(`API: Format ${formatIndex + 1} response status:`, response.status);
            console.log(`API: Format ${formatIndex + 1} response headers:`, response.headers);
            
            if (!response.ok) {
                const text = await response.text();
                console.log(`API: Format ${formatIndex + 1} error response body:`, text);
                
                // Try to parse error response as JSON
                try {
                    const errorData = JSON.parse(text);
                    
                    // If it's a validation error (422), return the error data instead of throwing
                    if (response.status === 422 && errorData.error) {
                        return errorData; // Return the error response so it can be handled in .then()
                    }
                } catch (parseError) {
                    // Could not parse error response as JSON
                }
                
                if (formatIndex < dataFormats.length - 1) {
                    console.log(`API: Format ${formatIndex + 1} failed, trying next format...`);
                    return trySignup(dataFormats[formatIndex + 1], formatIndex + 1);
                } else {
                    throw new Error(`All signup formats failed. Last error: ${response.status} ${response.statusText} - ${text}`);
                }
            }
            
            const data = await response.json();
            console.log(`API: Format ${formatIndex + 1} success:`, data);
            return data;
            
        } catch (error) {
            console.log(`API: Format ${formatIndex + 1} error:`, error);
            if (formatIndex < dataFormats.length - 1) {
                console.log(`API: Format ${formatIndex + 1} failed, trying next format...`);
                return trySignup(dataFormats[formatIndex + 1], formatIndex + 1);
            } else {
                throw error;
            }
        }
    };
    
    return trySignup(dataFormats[0], 0);
};

// Alternative signup endpoint - some backends use /signup instead of /users
const signupAlternative = (userInfo) => {
    console.log('API: Trying alternative signup endpoint with data:', userInfo);
    
    return fetch(`${API_ROOT}/signup/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify(userInfo)
    }).then((response) => {
        console.log('API: Alternative endpoint response status:', response.status);
        
        if (!response.ok) {
            return response.text().then(text => {
                console.log('API: Alternative endpoint error response:', text);
                throw new Error(`Alternative signup failed: ${response.status} ${response.statusText} - ${text}`);
            });
        }
        return response.json();
    });
};

const login = (userInfo) => {
    console.log('API: Attempting login with data:', userInfo);
    return fetch(`${API_ROOT}/login/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify(userInfo),
    }).then((response) => {
        console.log('API: Login response status:', response.status);
        if (!response.ok) {
            return response.text().then(text => {
                console.log('API: Login error response body:', text);
                let errorMessage = `Login failed: ${response.status} ${response.statusText}`;
                try {
                    const errorData = JSON.parse(text);
                    if (errorData.error) {
                        errorMessage = errorData.error;
                    }
                } catch (e) {
                    // If response is not JSON, use the text as is
                    if (text) {
                        errorMessage = text;
                    }
                }
                const error = new Error(errorMessage);
                error.status = response.status;
                error.responseBody = text;
                throw error;
            });
        }
        return response.json();
    }).then((data) => {
        console.log('API: Login response data:', data);
        return data;
    });
};

const getCurrentUser = () => {
    return fetch(`${API_ROOT}/current_user/`, {
        headers: headers(),
    }).then((response) => {
        if (!response.ok) {
            throw new Error(`Failed to get current user: ${response.status} ${response.statusText}`);
        }
        return response.json();
    });
};

const deleteUser = (user) => {
    return fetch(`${API_ROOT}/users/${user.id}`, {
        method: 'DELETE',
        headers: headers(),
    }).then((response) => {
        if (!response.ok) {
            throw new Error(`Failed to delete user: ${response.status} ${response.statusText}`);
        }
        return response.json();
    });
};

const updateUser = (user) => {
    console.log('API: Attempting to update user with data:', user);
    
    // Try different data formats that Rails APIs commonly expect
    const dataFormats = [
        user, // Original format
        { user: user }, // Wrapped in 'user' key
        {
            user: {
                name: user.name,
                email: user.email
            }
        }
    ];
    
    // Try each format until one works
    const tryUpdate = async (format, formatIndex) => {
        console.log(`API: Trying update data format ${formatIndex + 1}:`, format);
        
        try {
            const response = await fetch(`${API_ROOT}/users/${user.id}`, {
        method: "PATCH",
        headers: headers(),
                body: JSON.stringify(format)
            });
            
            console.log(`API: Update format ${formatIndex + 1} response status:`, response.status);
            
            if (!response.ok) {
                const text = await response.text();
                console.log(`API: Update format ${formatIndex + 1} error response body:`, text);
                console.log(`API: Update format ${formatIndex + 1} response status:`, response.status);
                console.log(`API: Update format ${formatIndex + 1} response statusText:`, response.statusText);
                
                // Try to parse error response as JSON
                try {
                    const errorData = JSON.parse(text);
                    console.log(`API: Parsed error data:`, errorData);
                    
                    // If it's a validation error (422), return the error data instead of throwing
                    if (response.status === 422 && errorData.error) {
                        throw new Error(errorData.error);
                    }
                } catch (parseError) {
                    console.log(`API: Could not parse error response as JSON:`, parseError);
                }
                
                if (formatIndex < dataFormats.length - 1) {
                    console.log(`API: Update format ${formatIndex + 1} failed, trying next format...`);
                    return tryUpdate(dataFormats[formatIndex + 1], formatIndex + 1);
                } else {
                    const error = new Error(`All update formats failed. Last error: ${response.status} ${response.statusText} - ${text}`);
                    error.status = response.status;
                    error.responseBody = text;
                    throw error;
                }
            }
            
            const data = await response.json();
            console.log(`API: Update format ${formatIndex + 1} success:`, data);
            return data;
            
        } catch (error) {
            console.log(`API: Update format ${formatIndex + 1} error:`, error);
            if (formatIndex < dataFormats.length - 1) {
                console.log(`API: Update format ${formatIndex + 1} failed, trying next format...`);
                return tryUpdate(dataFormats[formatIndex + 1], formatIndex + 1);
            } else {
                throw error;
            }
        }
    };
    
    return tryUpdate(dataFormats[0], 0);
};

const uploadProfilePicture = (formData) => {
    return fetch(`${API_ROOT}/users/upload_photo`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token()}`
        },
        body: formData
    }).then((response) => {
        if (!response.ok) {
            throw new Error(`Failed to upload profile picture: ${response.status} ${response.statusText}`);
        }
        return response.json();
    });
};

const deleteProfilePicture = () => {
    return fetch(`${API_ROOT}/users/delete_photo`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token()}`
        }
    }).then((response) => {
        if (!response.ok) {
            throw new Error(`Failed to delete profile picture: ${response.status} ${response.statusText}`);
        }
        return response.json();
    });
};

const updatePassword = (passwordData) => {
    console.log('API: Attempting to update password');
    
    return fetch(`${API_ROOT}/update_password`, {
        method: 'PATCH',
        headers: headers(),
        body: JSON.stringify(passwordData)
    }).then((response) => {
        console.log('API: Update password response status:', response.status);
        
        return response.json().then(data => {
            if (!response.ok) {
                console.log('API: Update password error response body:', data);
                throw new Error(data.error || data.message || `Failed to update password: ${response.status}`);
            }
            
            console.log('API: Update password success:', data);
            return data;
        });
    }).catch(error => {
        console.error('API: Update password error:', error);
        throw error;
    });
};

const api = {
    auth: {
        signup: signup,
        signupAlternative: signupAlternative,
        login: login,
        getCurrentUser: getCurrentUser,
        deleteUser: deleteUser,
        updateUser: updateUser,
        updatePassword: updatePassword,
        uploadProfilePicture: uploadProfilePicture,
        deleteProfilePicture: deleteProfilePicture,
        forgotPassword: (email) => {
            console.log('API: Attempting forgot password for email:', email);
            
            return fetch(`${API_ROOT}/forgot_password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ email: email })
            }).then((response) => {
                console.log('API: Forgot password response status:', response.status);
                
                return response.json().then(data => {
                    if (!response.ok) {
                        // Backend returns 404 for "user not found" - this is business logic, not a technical error
                        throw new Error(data.error || data.message || `Failed to send reset email: ${response.status}`);
                    }
                    return data;
                });
            }).catch((error) => {
                console.error('API: Forgot password error:', error);
                throw error;
            });
        }
    },
    moods: {
        getAll: () => {
            return fetch(`http://localhost:3000/moods/`, {
                headers: headers(),
            }).then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch moods: ${response.status} ${response.statusText}`);
                }
                return response.json();
            });
        },
        createUserMood: (userMoodData) => {
            return fetch(`http://localhost:3000/user_moods/`, {
                method: 'POST',
                headers: headers(),
                body: JSON.stringify(userMoodData)
            }).then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to create user mood: ${response.status} ${response.statusText}`);
                }
                return response.json();
            });
        },
        getUserMoods: (userId) => {
            const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
            return fetch(`http://localhost:3000/user_moods/?user_id=${userId}&date=${today}`, {
                headers: headers(),
            }).then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch user moods: ${response.status} ${response.statusText}`);
                }
                return response.json();
            });
        },
        getUserMoodsForMonth: (userId, month = null) => {
            let startDate, endDate;
            
            if (month) {
                // Parse month parameter (YYYY-MM format)
                const [year, monthNum] = month.split('-');
                startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1).toISOString().split('T')[0];
                endDate = new Date(parseInt(year), parseInt(monthNum), 0).toISOString().split('T')[0];
            } else {
                // Default to past 30 days if no month specified
                endDate = new Date().toISOString().split('T')[0];
                startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            }
            
            return fetch(`http://localhost:3000/user_moods/?user_id=${userId}&start_date=${startDate}&end_date=${endDate}`, {
                headers: headers(),
            }).then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch user moods for month: ${response.status} ${response.statusText}`);
                }
                return response.json();
            });
        },
        deleteUserMood: (userMoodId) => {
            return fetch(`http://localhost:3000/user_moods/${userMoodId}`, {
                method: 'DELETE',
                headers: headers(),
            }).then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to delete user mood: ${response.status} ${response.statusText}`);
                }
                return response.json();
            });
        }
    },
    activities: {
        getAll: () => {
            return fetch(`http://localhost:3000/activities/`, {
                headers: headers(),
            }).then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch activities: ${response.status} ${response.statusText}`);
                }
                return response.json();
            });
        },
        createUserActivity: (userActivityData) => {
            return fetch(`http://localhost:3000/user_activities/`, {
                method: 'POST',
                headers: headers(),
                body: JSON.stringify(userActivityData)
            }).then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to create user activity: ${response.status} ${response.statusText}`);
                }
                return response.json();
            });
        },
        getUserActivities: (userId) => {
            const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
            return fetch(`http://localhost:3000/user_activities/?user_id=${userId}&date=${today}`, {
                headers: headers(),
            }).then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch user activities: ${response.status} ${response.statusText}`);
                }
                return response.json();
            });
        },
        getUserActivitiesForMonth: (userId, month = null) => {
            let startDate, endDate;
            
            if (month) {
                // Parse month parameter (YYYY-MM format)
                const [year, monthNum] = month.split('-');
                startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1).toISOString().split('T')[0];
                endDate = new Date(parseInt(year), parseInt(monthNum), 0).toISOString().split('T')[0];
            } else {
                // Default to past 30 days if no month specified
                endDate = new Date().toISOString().split('T')[0];
                startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            }
            
            return fetch(`http://localhost:3000/user_activities/?user_id=${userId}&start_date=${startDate}&end_date=${endDate}`, {
                headers: headers(),
            }).then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch user activities for month: ${response.status} ${response.statusText}`);
                }
                return response.json();
            });
        },
        deleteUserActivity: (userActivityId) => {
            return fetch(`http://localhost:3000/user_activities/${userActivityId}`, {
                method: 'DELETE',
                headers: headers(),
            }).then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to delete user activity: ${response.status} ${response.statusText}`);
                }
                return response.json();
            });
        }
    },
    diary: {
        createEntry: (diaryEntryData) => {
            return fetch(`http://localhost:3000/diary_entries/`, {
                method: 'POST',
                headers: headers(),
                body: JSON.stringify(diaryEntryData)
            }).then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to create diary entry: ${response.status} ${response.statusText}`);
                }
                return response.json();
            });
        },
        uploadPhoto: (formData) => {
            return fetch(`http://localhost:3000/diary_photos/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token()}`
                },
                body: formData
            }).then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to upload photo: ${response.status} ${response.statusText}`);
                }
                return response.json();
            });
        },
        getPhotos: (userId) => {
            return fetch(`http://localhost:3000/diary_photos/?user_id=${userId}`, {
                headers: headers(),
            }).then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch diary photos: ${response.status} ${response.statusText}`);
                }
                return response.json();
            });
        },
        deletePhoto: (photoId) => {
            console.log('API: Sending DELETE request to:', `http://localhost:3000/diary_photos/${photoId}`);
            console.log('API: Headers:', headers());
            
            return fetch(`http://localhost:3000/diary_photos/${photoId}`, {
                method: 'DELETE',
                headers: headers(),
            }).then((response) => {
                console.log('API: Response status:', response.status);
                console.log('API: Response ok:', response.ok);
                
                if (!response.ok) {
                    console.error('API: Delete failed with status:', response.status);
                    throw new Error(`Failed to delete diary photo: ${response.status} ${response.statusText}`);
                }
                
                console.log('API: Delete successful');
                return response.json();
            }).catch((error) => {
                console.error('API: Delete request failed:', error);
                throw error;
            });
        },
        getAll: () => {
            return fetch(`http://localhost:3000/diary_entries/`, {
                headers: headers(),
            }).then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch diary entries: ${response.status} ${response.statusText}`);
                }
                return response.json();
            });
        },
        delete: (id) => {
            return fetch(`http://localhost:3000/diary_entries/${id}`, {
                method: 'DELETE',
                headers: headers(),
            }).then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to delete diary entry: ${response.status} ${response.statusText}`);
                }
                return response.json();
            });
        }
    },
    userMoods: {
        getAll: (userId) => {
            return fetch(`http://localhost:3000/user_moods/?user_id=${userId}`, {
                headers: headers(),
            }).then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch user moods: ${response.status} ${response.statusText}`);
                }
                return response.json();
            });
        }
    },
    userActivities: {
        getAll: (userId) => {
            return fetch(`http://localhost:3000/user_activities/?user_id=${userId}`, {
                headers: headers(),
            }).then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch user activities: ${response.status} ${response.statusText}`);
                }
                return response.json();
            });
        }
    },
    affirmations: {
        getRandom: () => {
            // Fallback affirmations array for when external APIs are not available
            const fallbackAffirmations = [
                "You are capable of amazing things.",
                "Every day is a fresh start.",
                "You have the power to create positive change.",
                "Believe in yourself and all that you are.",
                "Your potential is limitless.",
                "You are stronger than you know.",
                "Every challenge is an opportunity to grow.",
                "You deserve happiness and success.",
                "Your dreams are valid and achievable.",
                "You are worthy of love and respect.",
                "Today is full of possibilities.",
                "You have everything you need to succeed.",
                "Your positive energy attracts positive outcomes.",
                "You are exactly where you need to be right now.",
                "Every step forward is progress.",
                "You are braver than you believe and stronger than you seem.",
                "Your journey is unique and valuable.",
                "You have the courage to overcome any obstacle.",
                "Success is not final, failure is not fatal: it is the courage to continue that counts.",
                "You are the author of your own story."
            ];
            
            // Try external API first, fallback to local affirmations
            return fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent('https://www.affirmations.dev/')}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }).then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch affirmation: ${response.status} ${response.statusText}`);
                }
                return response.json();
            }).catch((error) => {
                console.log('External API failed, using fallback affirmations:', error);
                // Return a random affirmation from our fallback array
                const randomIndex = Math.floor(Math.random() * fallbackAffirmations.length);
                return { affirmation: fallbackAffirmations[randomIndex] };
            });
        },
        // Note: Public API only provides random affirmations
        // These methods are kept for future use when you deploy your own API
        getAll: () => {
            return Promise.resolve({ message: 'Public API only provides random affirmations' });
        },
        getByCategory: (category) => {
            return Promise.resolve({ message: 'Public API only provides random affirmations' });
        },
        getCategories: () => {
            return Promise.resolve({ message: 'Public API only provides random affirmations' });
        }
    },
    goals: {
        getAll: () => {
            return fetch(`http://localhost:3000/goals/`, {
                headers: headers(),
            }).then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch goals: ${response.status} ${response.statusText}`);
                }
                return response.json();
            });
        },
        createUserGoal: (userGoalData) => {
            return fetch(`http://localhost:3000/user_goals/`, {
                method: 'POST',
                headers: headers(),
                body: JSON.stringify({ user_goal: userGoalData })
            }).then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to create user goal: ${response.status} ${response.statusText}`);
                }
                return response.json();
            });
        },
        getUserGoals: (userId) => {
            const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
            return fetch(`http://localhost:3000/user_goals/?user_id=${userId}&date=${today}`, {
                headers: headers(),
            }).then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch user goals: ${response.status} ${response.statusText}`);
                }
                return response.json();
            });
        },
        updateUserGoal: (userGoalId, userGoalData) => {
            return fetch(`http://localhost:3000/user_goals/${userGoalId}`, {
                method: 'PATCH',
                headers: headers(),
                body: JSON.stringify({ user_goal: userGoalData })
            }).then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to update user goal: ${response.status} ${response.statusText}`);
                }
                return response.json();
            });
        },
        deleteUserGoal: (userGoalId) => {
            return fetch(`http://localhost:3000/user_goals/${userGoalId}`, {
                method: 'DELETE',
                headers: headers(),
            }).then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to delete user goal: ${response.status} ${response.statusText}`);
                }
                return response.json();
            });
        }
    },
    gratitudes: {
        getAll: () => {
            return fetch(`http://localhost:3000/gratitudes/`, {
                headers: headers(),
            }).then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch gratitudes: ${response.status} ${response.statusText}`);
                }
                return response.json();
            });
        },
        createUserGratitude: (userGratitudeData, userId) => {
            return fetch(`http://localhost:3000/user_gratitudes/?user_id=${userId}`, {
                method: 'POST',
                headers: headers(),
                body: JSON.stringify({ user_gratitude: userGratitudeData })
            }).then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to create user gratitude: ${response.status} ${response.statusText}`);
                }
                return response.json();
            });
        },
        getUserGratitudes: (userId) => {
            const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
            return fetch(`http://localhost:3000/user_gratitudes/?user_id=${userId}&date=${today}`, {
                headers: headers(),
            }).then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch user gratitudes: ${response.status} ${response.statusText}`);
                }
                return response.json();
            });
        },
        updateUserGratitude: (userGratitudeId, userGratitudeData) => {
            return fetch(`http://localhost:3000/user_gratitudes/${userGratitudeId}`, {
                method: 'PATCH',
                headers: headers(),
                body: JSON.stringify({ user_gratitude: userGratitudeData })
            }).then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to update user gratitude: ${response.status} ${response.statusText}`);
                }
                return response.json();
            });
        },
        deleteUserGratitude: (userGratitudeId) => {
            return fetch(`http://localhost:3000/user_gratitudes/${userGratitudeId}`, {
                method: 'DELETE',
                headers: headers(),
            }).then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to delete user gratitude: ${response.status} ${response.statusText}`);
                }
                return response.json();
            });
        }
    },
    getHeaders: headers
};

export default api;