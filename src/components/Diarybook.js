import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import api from '../services/api';
import ConfirmationModal from './ConfirmationModal';

export default function Diarybook(props) {
    const [diaries, setDiaries] = useState([]);
    const [currentUserId] = useState(props.currentUser.id);
    const [userMoods, setUserMoods] = useState([]);
    const [moodsList, setMoodsList] = useState([]);
    const [activitiesList, setActivitiesList] = useState([]);
    const [userActivities, setUserActivities] = useState([]);
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [diaryToDelete, setDiaryToDelete] = useState(null);
    const [showPhotoDeleteModal, setShowPhotoDeleteModal] = useState(false);
    const [photoToDelete, setPhotoToDelete] = useState(null);
    const [photosUpdateTrigger, setPhotosUpdateTrigger] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all data in parallel
                const [diariesData, userMoodsData, moodsListData, activitiesData, userActivitiesData, photosData] = await Promise.all([
                    api.diary.getAll(),
                    api.userMoods.getAll(currentUserId),
                    api.moods.getAll(),
                    api.activities.getAll(),
                    api.userActivities.getAll(currentUserId),
                    api.diary.getPhotos(currentUserId)
                ]);

                console.log('=== DEBUGGING DATA FETCH ===');
                console.log('Current User ID:', currentUserId);
                console.log('Selected Date:', props.selectedDate);
                console.log('All Diaries:', diariesData);
                console.log('All User Moods:', userMoodsData);
                console.log('All Moods List:', moodsListData);
                console.log('All Activities:', activitiesData);
                console.log('All User Activities:', userActivitiesData);
                console.log('All Photos:', photosData);

                setDiaries(diariesData);
                setUserMoods(userMoodsData);
                setMoodsList(moodsListData);
                setActivitiesList(activitiesData);
                setUserActivities(userActivitiesData);
                setPhotos(photosData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, [currentUserId]);

    // Force re-render when photos change
    useEffect(() => {
        console.log('Photos state changed, triggering re-render');
    }, [photos]);

    const handleDeleteClick = (diary) => {
        setDiaryToDelete(diary);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!diaryToDelete) return;
        
        try {
            await api.diary.delete(diaryToDelete.id);
            const entries = diaries.filter((entry) => entry.id !== diaryToDelete.id);
            setDiaries(entries);
        } catch (error) {
            console.error('Error deleting diary:', error);
        } finally {
            setShowDeleteModal(false);
            setDiaryToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setDiaryToDelete(null);
    };

    const handlePhotoDeleteClick = (photo) => {
        console.log('Delete button clicked for photo:', photo);
        setPhotoToDelete(photo);
        setShowPhotoDeleteModal(true);
    };

    const handleConfirmPhotoDelete = async () => {
        if (!photoToDelete) return;
        
        console.log('Attempting to delete photo:', photoToDelete);
        console.log('Photo ID to delete:', photoToDelete.id);
        
        try {
            console.log('Sending delete request to backend...');
            const response = await api.diary.deletePhoto(photoToDelete.id);
            console.log('Backend delete response:', response);
            
            // Force a complete re-fetch of photos from the backend
            console.log('Re-fetching photos from backend...');
            const freshPhotos = await api.diary.getPhotos(currentUserId);
            console.log('Fresh photos from backend:', freshPhotos);
            
            setPhotos(freshPhotos);
            setPhotosUpdateTrigger(prev => prev + 1);
            console.log('Updated photos state with fresh data');
        } catch (error) {
            console.error('Error deleting photo:', error);
            console.error('Error details:', error.message);
        } finally {
            setShowPhotoDeleteModal(false);
            setPhotoToDelete(null);
        }
    };

    const handleCancelPhotoDelete = () => {
        setShowPhotoDeleteModal(false);
        setPhotoToDelete(null);
    };

    // Helper function to sanitize content for display
    const sanitizeContent = (content) => {
        return DOMPurify.sanitize(content);
    };

    // Helper function to format date for comparison
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Add 1 because getMonth() returns 0-11
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Get unique moods for the selected date
    const getUniqueMoodsForDate = () => {
        console.log('Selected date:', props.selectedDate);
        console.log('All user moods:', userMoods);
        
        const dateMoods = userMoods.filter(userMood => {
            const formatted = formatDate(userMood.created_at);
            console.log('User mood date:', userMood.created_at, 'Formatted:', formatted, 'Selected:', props.selectedDate);
            return userMood.user_id === currentUserId && formatted === props.selectedDate;
        });

        console.log('Filtered date moods:', dateMoods);

        // Get unique mood IDs to avoid duplicates
        const uniqueMoodIds = [...new Set(dateMoods.map(userMood => userMood.mood_id))];
        console.log('Unique mood IDs:', uniqueMoodIds);
        
        return uniqueMoodIds.map(moodId => {
            const mood = moodsList.find(m => m.id === moodId);
            return mood;
        }).filter(Boolean); // Remove any undefined moods
    };

    // Get unique activities for the selected date
    const getUniqueActivitiesForDate = () => {
        console.log('Selected date:', props.selectedDate);
        console.log('All user activities:', userActivities);
        
        const dateActivities = userActivities.filter(userActivity => {
            const formatted = formatDate(userActivity.created_at);
            console.log('User activity date:', userActivity.created_at, 'Formatted:', formatted, 'Selected:', props.selectedDate);
            return userActivity.user_id === currentUserId && formatted === props.selectedDate;
        });

        console.log('Filtered date activities:', dateActivities);

        // Get unique activity IDs to avoid duplicates
        const uniqueActivityIds = [...new Set(dateActivities.map(userActivity => userActivity.activity_id))];
        console.log('Unique activity IDs:', uniqueActivityIds);
        
        return uniqueActivityIds.map(activityId => {
            const activity = activitiesList.find(a => a.id === activityId);
            return activity;
        }).filter(Boolean); // Remove any undefined activities
    };

    // Get photos for the selected date
    const getPhotosForDate = () => {
        console.log('Selected date:', props.selectedDate);
        console.log('All photos:', photos);
        
        const datePhotos = photos.filter(photo => {
            const formatted = formatDate(photo.created_at);
            console.log('Photo date:', photo.created_at, 'Formatted:', formatted, 'Selected:', props.selectedDate);
            console.log('Photo user_id:', photo.user_id, 'Current user ID:', currentUserId);
            const matchesDate = formatted === props.selectedDate;
            const matchesUser = photo.user_id === currentUserId;
            console.log('Date match:', matchesDate, 'User match:', matchesUser);
            return matchesUser && matchesDate;
        });

        console.log('Filtered date photos:', datePhotos);
        console.log('Total photos in state:', photos.length);
        console.log('Photos for selected date:', datePhotos.length);
        
        // Debug each photo object structure
        datePhotos.forEach((photo, index) => {
            console.log(`Photo ${index + 1} structure:`, photo);
            console.log(`Photo ${index + 1} keys:`, Object.keys(photo));
        });
        
        // Remove duplicates
        const uniquePhotos = removeDuplicatePhotos(datePhotos);
        console.log('Photos after removing duplicates:', uniquePhotos);
        console.log('Returning photos for display:', uniquePhotos.length);
        
        return uniquePhotos;
    };

    // Function to remove duplicate photos
    const removeDuplicatePhotos = (photoList) => {
        if (!photoList || photoList.length === 0) return photoList;

        const seen = new Set();
        const uniquePhotos = [];

        photoList.forEach(photo => {
            // Try multiple strategies to identify duplicates
            const photoIdentifier = getPhotoIdentifier(photo);
            
            if (!seen.has(photoIdentifier)) {
                seen.add(photoIdentifier);
                uniquePhotos.push(photo);
            } else {
                console.log('Duplicate photo detected and removed:', photo);
            }
        });

        return uniquePhotos;
    };

    // Function to generate a unique identifier for a photo
    const getPhotoIdentifier = (photo) => {
        // Strategy 1: Use filename if available
        if (photo.filename) {
            return `filename:${photo.filename}`;
        }
        
        // Strategy 2: Use original_filename if available
        if (photo.original_filename) {
            return `original_filename:${photo.original_filename}`;
        }
        
        // Strategy 3: Use file size and creation time (if available)
        if (photo.file_size && photo.created_at) {
            return `size_time:${photo.file_size}_${photo.created_at}`;
        }
        
        // Strategy 4: Use URL path (extract filename from URL)
        const photoUrl = photo.photo_url || photo.url || photo.image_url || photo.file_url || photo.attachment_url;
        if (photoUrl) {
            const urlParts = photoUrl.split('/');
            const filename = urlParts[urlParts.length - 1];
            if (filename && filename.includes('.')) {
                return `url_filename:${filename}`;
            }
        }
        
        // Strategy 5: Use the full URL as fallback
        if (photoUrl) {
            return `full_url:${photoUrl}`;
        }
        
        // Strategy 6: Use ID as last resort
        return `id:${photo.id}`;
    };

    if (loading) {
        return <div>Loading diary entries...</div>;
    }

    if (error) {
        return <div>Error loading diary entries: {error}</div>;
    }

    const uniqueMoods = getUniqueMoodsForDate();
    const uniqueActivities = getUniqueActivitiesForDate();
    const datePhotos = getPhotosForDate();
    
    console.log('=== COMPONENT RENDER ===');
    console.log('Current photos state:', photos);
    console.log('Date photos for display:', datePhotos);
    console.log('Date photos count:', datePhotos.length);

    return (
        <div className="text">
            <div className="detail-header">
                <h4 className="booheaders">Photos</h4>
                {datePhotos.length > 0 ? (
                    <>
                        <div 
                            key={`photos-grid-${photos.length}-${photosUpdateTrigger}`}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                                gap: '15px',
                                marginTop: '10px',
                                marginBottom: '20px',
                                paddingBottom: '15px'
                            }}>
                            {datePhotos.map((photo) => (
                                <div key={photo.id} 
                                    className="photo-container"
                                    style={{
                                        position: 'relative',
                                        borderRadius: '10px',
                                        overflow: 'hidden',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                                    }}
>
                                    {/* Delete Button */}
                                    <button 
                                        style={{
                                            position: 'absolute',
                                            top: '8px',
                                            right: '8px',
                                            width: '28px', 
                                            height: '28px', 
                                            border: 'none',
                                            borderRadius: '50%',
                                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                            boxShadow: '0 2px 8px rgba(187, 187, 187, 0.3)',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            zIndex: 10
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.backgroundColor = 'rgba(255, 99, 71, 0.1)';
                                            e.target.style.boxShadow = '0 4px 12px rgba(255, 99, 71, 0.3)';
                                            e.target.style.transform = 'scale(1.1)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                                            e.target.style.boxShadow = '0 2px 8px rgba(187, 187, 187, 0.3)';
                                            e.target.style.transform = 'scale(1)';
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handlePhotoDeleteClick(photo);
                                        }}>
                                        <i 
                                            className="material-icons" 
                                            style={{
                                                color: 'rgb(98, 104, 110)',
                                                fontSize: '16px',
                                                transition: 'color 0.3s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.color = 'tomato';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.color = 'rgb(98, 104, 110)';
                                            }}>
                                            delete
                                        </i>
                                    </button>
                                    <img 
                                        src={photo.photo_url || photo.url || photo.image_url || photo.file_url || photo.attachment_url} 
                                        alt={`Photo from ${props.selectedDate}`}
                                        style={{
                                            width: '100%',
                                            height: '150px',
                                            objectFit: 'cover',
                                            display: 'block'
                                        }}
                                        onError={(e) => {
                                            console.error('Image failed to load:', photo.photo_url);
                                            console.error('Photo object:', photo);
                                            e.target.style.display = 'none';
                                            // Show photo data as fallback
                                            const container = e.target.parentElement;
                                            container.innerHTML = `
                                                <div style="
                                                    width: 100%; 
                                                    height: 150px; 
                                                    background: #f5f5f5; 
                                                    display: flex; 
                                                    align-items: center; 
                                                    justify-content: center; 
                                                    color: #666; 
                                                    font-size: 12px; 
                                                    text-align: center;
                                                    padding: 10px;
                                                ">
                                                    <div>
                                                        <div>⚠️ Image not found</div>
                                                        <div style="font-size: 10px; margin-top: 5px;">
                                                            Available fields: ${Object.keys(photo).join(', ')}
                                                        </div>
                                                    </div>
                                                </div>
                                            `;
                                        }}
                                        onLoad={() => {
                                            console.log('Image loaded successfully:', photo.photo_url);
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <p style={{color: 'gray', fontStyle: 'italic'}}>No photos for this day.</p>
                )}
            </div>
            <br/>
            <div className="detail-header">
                <h4 className="booheaders">Journal</h4>
                {diaries.filter(diary => {
                    const formatted = formatDate(diary.created_at);
                    return diary.user_id === currentUserId && formatted === props.selectedDate;
                }).length > 0 ? (
                    diaries.map((diary) => {
                        const formatted = formatDate(diary.created_at);
                        
                        return diary.user_id === currentUserId && formatted === props.selectedDate ? (
                            <div key={diary.id}>
                                <ul style={{listStyle: 'none', padding: 0}}>
                                    <li id="diary-content">
                                        {sanitizeContent(diary.content)}
                                    </li>
                                    <li>
                                        <button 
                                            style={{
                                                width: '32px', 
                                                height: '32px', 
                                                marginTop: '10px',
                                                border: 'none',
                                                borderRadius: '50%',
                                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                boxShadow: '0 2px 8px rgba(187, 187, 187, 0.3)',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.backgroundColor = 'rgba(255, 99, 71, 0.1)';
                                                e.target.style.boxShadow = '0 4px 12px rgba(255, 99, 71, 0.3)';
                                                e.target.style.transform = 'scale(1.1)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                                                e.target.style.boxShadow = '0 2px 8px rgba(187, 187, 187, 0.3)';
                                                e.target.style.transform = 'scale(1)';
                                            }}
                                            onClick={() => handleDeleteClick(diary)}>
                                            <i 
                                                className="material-icons" 
                                                style={{
                                                    color: 'rgb(98, 104, 110)',
                                                    fontSize: '18px',
                                                    transition: 'color 0.3s ease'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.color = 'tomato';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.color = 'rgb(98, 104, 110)';
                                                }}>
                                                delete
                                            </i>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        ) : null;
                    })
                ) : (
                    <p style={{color: 'gray', fontStyle: 'italic'}}>No entry for this day.</p>
                )}
            </div>
            <br/>
            <div className="detail-header">
                <h4 className="booheaders">Moods</h4>
                {uniqueMoods.length > 0 ? (
                    <ul style={{listStyle: 'none', padding: 0}}>
                        {uniqueMoods.map((mood) => (
                            <li key={mood.id}>
                                <img style={{width: '30px', height: 'auto'}} src={mood.mood_url} alt={mood.mood_name}/> 
                                {sanitizeContent(mood.mood_name)}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p style={{color: 'gray', fontStyle: 'italic'}}>No entry for this day.</p>
                )}
            </div>
            <br/>
            <div className="detail-header">
                <h4 className="booheaders">Activities</h4>
                {uniqueActivities.length > 0 ? (
                    <ul style={{listStyle: 'none', padding: 0}}>
                        {uniqueActivities.map((activity) => (
                            <li key={activity.id}>
                                <img style={{width: '30px', height: 'auto'}} src={activity.activity_url} alt={activity.activity_name}/> 
                                {sanitizeContent(activity.activity_name)}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p style={{color: 'gray', fontStyle: 'italic'}}>No entry for this day.</p>
                )}
            </div>
            <ConfirmationModal
                isOpen={showDeleteModal}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                title="Delete Diary Entry"
                message="Are you sure you want to delete this diary entry? This action cannot be undone."
            />
            <ConfirmationModal
                isOpen={showPhotoDeleteModal}
                onConfirm={() => {
                    console.log('Photo delete confirmed, calling handleConfirmPhotoDelete');
                    handleConfirmPhotoDelete();
                }}
                onCancel={handleCancelPhotoDelete}
                title="Delete Photo"
                message="Are you sure you want to delete this photo? This action cannot be undone."
            />
        </div>
    );
}