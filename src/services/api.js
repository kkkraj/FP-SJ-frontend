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
                username: userInfo.username,
                password: userInfo.password
                // Removed password_confirmation to see if that's the issue
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
    return fetch(`${API_ROOT}/users/${user.id}`, {
        method: "PATCH",
        headers: headers(),
        body: JSON.stringify(user)
    }).then((response) => {
        if (!response.ok) {
            throw new Error(`Failed to update user: ${response.status} ${response.statusText}`);
        }
        return response.json();
    });
};

const api = {
    auth: {
        signup: signup,
        signupAlternative: signupAlternative,
        login: login,
        getCurrentUser: getCurrentUser,
        deleteUser: deleteUser,
        updateUser: updateUser
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
        getUserMoodsForMonth: (userId) => {
            // Get data for the past 30 days
            const endDate = new Date().toISOString().split('T')[0];
            const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
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
        getUserActivitiesForMonth: (userId) => {
            // Get data for the past 30 days
            const endDate = new Date().toISOString().split('T')[0];
            const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
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
    getHeaders: headers
};

export default api;