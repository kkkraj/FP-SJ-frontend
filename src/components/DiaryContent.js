import React, { useState, useRef } from 'react';
import DOMPurify from 'dompurify';
import Moods from './Moods';
import Activities from './Activities';
import Goals from './Goals';
import Gratitude from './Gratitude';
import { Card } from 'react-bootstrap';
import api from '../services/api';

const DiaryContent = ({ activeSection, currentUser }) => {
    const [diaryEntry, setDiaryEntry] = useState({
        content: "",
        user_id: currentUser.id
    });
    const [selectedPhotos, setSelectedPhotos] = useState([]);
    const [photoPreviews, setPhotoPreviews] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [newEntryMode, setNewEntryMode] = useState(null); // null, 'writing-ideas', or 'blank-page'
    const [selectedPrompt, setSelectedPrompt] = useState('');
    const fileInputRef = useRef(null);

    const handleChange = (event) => {
        const { name, value } = event.target;
        const sanitizedValue = DOMPurify.sanitize(value);
        setDiaryEntry(prevEntry => ({ ...prevEntry, [name]: sanitizedValue }));
    };

    const handlePromptSelect = (prompt) => {
        setSelectedPrompt(prompt);
        setNewEntryMode('blank-page');
    };

    const handlePhotoSelect = (event) => {
        const files = Array.from(event.target.files);
        processSelectedFiles(files);
    };

    const processSelectedFiles = (files) => {
        if (!files || files.length === 0) return;
        
        if (selectedPhotos.length + files.length > 9) {
            alert(`You can only upload a maximum of 9 photos. You currently have ${selectedPhotos.length} selected and trying to add ${files.length} more.`);
            return;
        }

        const validFiles = [];
        const newPreviews = [];

        files.forEach((file, index) => {
            if (!file.type.startsWith('image/')) {
                alert(`File "${file.name}" is not an image file`);
                return;
            }
            
            if (file.size > 5 * 1024 * 1024) {
                alert(`File "${file.name}" is too large. Please select images smaller than 5MB`);
                return;
            }

            validFiles.push(file);
            
            const reader = new FileReader();
            reader.onload = (e) => {
                newPreviews.push(e.target.result);
                if (newPreviews.length === validFiles.length) {
                    setPhotoPreviews(prev => [...prev, ...newPreviews]);
                }
            };
            reader.readAsDataURL(file);
        });

        setSelectedPhotos(prev => [...prev, ...validFiles]);
    };

    const handlePhotoUpload = async () => {
        if (selectedPhotos.length === 0) {
            alert('Please select at least one photo first');
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);
        
        try {
            let uploadedCount = 0;
            const totalPhotos = selectedPhotos.length;

            for (let i = 0; i < selectedPhotos.length; i++) {
                const photo = selectedPhotos[i];
                const formData = new FormData();
                formData.append('photo', photo);
                formData.append('user_id', diaryEntry.user_id);

                await api.diary.uploadPhoto(formData);
                uploadedCount++;
                setUploadProgress((uploadedCount / totalPhotos) * 100);
            }

            console.log(`Successfully uploaded ${uploadedCount} photos`);
            
            setSelectedPhotos([]);
            setPhotoPreviews([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            
            setShowConfirmation(true);
            setTimeout(() => {
                setShowConfirmation(false);
            }, 3000);
        } catch (error) {
            console.error('Error uploading photos:', error);
            alert('Failed to upload some photos. Please try again.');
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        createNewDiaryEntry({ diary_entry: diaryEntry });
    };

    const createNewDiaryEntry = async (diaryEntryData) => {
        try {
            const data = await api.diary.createEntry(diaryEntryData);
            console.log('Diary entry created:', data);
            setDiaryEntry({ ...diaryEntry, content: "" });
            
            setShowConfirmation(true);
            setTimeout(() => {
                setShowConfirmation(false);
            }, 3000);
        } catch (error) {
            console.error('Error creating diary entry:', error);
        }
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'new-entry':
                // Show choice interface if no mode is selected
                if (newEntryMode === null) {
                    return (
                        <Card className="diary-card">
                            <Card.Header>
                                <h4 className="diaryheader">How would you like to start?</h4>
                            </Card.Header>
                            <Card.Body>
                                <div>
                                    <div className="diary-choice-grid">
                                        <div className="diary-choice-card" onClick={() => setNewEntryMode('writing-ideas')}>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#212529" className="diary-choice-icon-small">
                                                <path d="M480-80q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-200v-80h320v80H320Zm10-120q-69-41-109.5-110T180-580q0-125 87.5-212.5T480-880q125 0 212.5 87.5T780-580q0 81-40.5 150T630-320H330Zm24-80h252q45-32 69.5-79T700-580q0-92-64-156t-156-64q-92 0-156 64t-64 156q0 54 24.5 101t69.5 79Zm126 0Z"/>
                                            </svg>
                                            <h6 className="diary-choice-card-title">
                                                Journal Prompt
                                            </h6>
                                            <p className="diary-choice-card-description">
                                                Get inspired with guided prompts that help you reflect and write.
                                            </p>
                                        </div>

                                        <div className="diary-choice-card" onClick={() => setNewEntryMode('blank-page')}>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#212529" className="diary-choice-icon-small">
                                                <path d="M560-80v-123l221-220q9-9 20-13t22-4q12 0 23 4.5t20 13.5l37 37q8 9 12.5 20t4.5 22q0 11-4 22.5T903-300L683-80H560Zm300-263-37-37 37 37ZM620-140h38l121-122-18-19-19-18-122 121v38ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v120h-80v-80H520v-200H240v640h240v80H240Zm280-400Zm241 199-19-18 37 37-18-19Z"/>
                                            </svg>
                                            <h6 className="diary-choice-card-title">
                                                Blank Page
                                            </h6>
                                            <p className="diary-choice-card-description">
                                                Begin with a blank page and freely write about your day.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    );
                }

                // Show writing ideas mode
                if (newEntryMode === 'writing-ideas') {
                    return (
                        <Card className="diary-card">
                            <Card.Header>
                                <div className="diary-header-with-button">
                                    <button 
                                        className="diary-back-button"
                                        onClick={() => setNewEntryMode(null)}
                                    >
                                        ← Back to options
                                    </button>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <div className="diary-writing-ideas-content">
                                    <div className="diary-choice-header">
                                        <p className="diary-choice-description">
                                            Choose a prompt below to inspire your journaling.
                                        </p>
                                    </div>
                                    
                                    <div className="diary-prompts-grid">
                                        <div className="diary-prompt-card" onClick={() => handlePromptSelect('What went well today?')}>
                                            <h6 className="diary-prompt-title">
                                                What went well today?
                                            </h6>
                                        </div>

                                        <div className="diary-prompt-card" onClick={() => handlePromptSelect('What challenged you today?')}>
                                            <h6 className="diary-prompt-title">
                                                What challenged you today?
                                            </h6>
                                        </div>

                                        <div className="diary-prompt-card" onClick={() => handlePromptSelect('What are you grateful for right now?')}>
                                            <h6 className="diary-prompt-title">
                                                What are you grateful for right now?
                                            </h6>
                                        </div>

                                        <div className="diary-prompt-card" onClick={() => handlePromptSelect('How do you feel at this moment?')}>
                                            <h6 className="diary-prompt-title">
                                                How do you feel at this moment?
                                            </h6>
                                        </div>

                                        <div className="diary-prompt-card" onClick={() => handlePromptSelect('What\'s one small step you can take tomorrow to make it a good day?')}>
                                            <h6 className="diary-prompt-title">
                                                What's one small step you can take tomorrow to make it a good day?
                                            </h6>
                                        </div>

                                        <div className="diary-prompt-card" onClick={() => handlePromptSelect('Write about a favorite moment from today. Why was it meaningful to you?')}>
                                            <h6 className="diary-prompt-title">
                                                Write about a favorite moment from today. Why was it meaningful to you?
                                            </h6>
                                        </div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    );
                }

                // Show blank page mode
                if (newEntryMode === 'blank-page') {
                    return (
                        <Card className="diary-card">
                            <Card.Header>
                                <div className="diary-header-with-button">
                                    <button 
                                        className="diary-back-button"
                                        onClick={() => {
                                            setNewEntryMode(null);
                                            setSelectedPrompt('');
                                        }}
                                    >
                                        ← Back to options
                                    </button>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                {selectedPrompt && (
                                    <div className="diary-selected-prompt">
                                        <h6 className="diary-selected-prompt-title">
                                            {selectedPrompt}
                                        </h6>
                                    </div>
                                )}
                                <form id="entry" onSubmit={handleSubmit}>
                                    <textarea 
                                        className="text diary-journal-textarea" 
                                        placeholder={selectedPrompt ? `Write about: ${selectedPrompt}` : "Begin Your Journal Here!"} 
                                        value={diaryEntry.content} 
                                        name="content" 
                                        onChange={handleChange} 
                                    />
                                    <button 
                                        className="waves-effect waves-light btn-small diary-submit-button" 
                                        type="submit" 
                                    >
                                        Submit Journal
                                    </button>
                                    {showConfirmation && (
                                        <div className="diary-success-message">
                                            Journal entry saved!
                                        </div>
                                    )}
                                </form>
                            </Card.Body>
                        </Card>
                    );
                }

            case 'mood-checkin':
                return (
                    <Card className="diary-card">
                        <Card.Header>
                            <h4 className="diaryheader">How are you feeling?</h4>
                            <p style={{ 
                                margin: '10px 0 0 0', 
                                fontSize: '14px', 
                                color: '#666',
                                fontStyle: 'italic'
                            }}>
                                Simply select or unselect your mood as it changes.
                            </p>
                        </Card.Header>
                        <Card.Body>
                            <Moods currentUserId={diaryEntry.user_id} />
                        </Card.Body>
                    </Card>
                );

            case 'activity-checkin':
                return (
                    <Card className="diary-card">
                        <Card.Header>
                            <h4 className="diaryheader">Which healthy habits did you practice today?</h4>
                            <p style={{ 
                                margin: '10px 0 0 0', 
                                fontSize: '14px', 
                                color: '#666',
                                fontStyle: 'italic'
                            }}>
                                Simply select or unselect activities as you complete them.
                            </p>
                        </Card.Header>
                        <Card.Body>
                            <Activities currentUserId={diaryEntry.user_id} />
                        </Card.Body>
                    </Card>
                );

            case 'set-intention':
                return (
                    <Card className="diary-card">
                        <Card.Header>
                            <h4 className="diaryheader">What's your intention today?</h4>
                        </Card.Header>
                        <Card.Body>
                            <Goals currentUserId={diaryEntry.user_id} />
                        </Card.Body>
                    </Card>
                );

            case 'note-gratitude':
                return (
                    <Card className="diary-card">
                        <Card.Header>
                            <h4 className="diaryheader">What are you grateful for today?</h4>
                        </Card.Header>
                        <Card.Body>
                            <Gratitude currentUserId={diaryEntry.user_id} />
                        </Card.Body>
                    </Card>
                );


            case 'upload-memory':
                return (
                    <Card className="diary-card">
                        <Card.Header>
                            <h4 className="diaryheader">Save your favorite moments from today with photos.</h4>
                        </Card.Header>
                        <Card.Body>
                            <div className="diary-upload-container">
                                <div className="diary-upload-dropzone">
                                    {photoPreviews.length > 0 ? (
                                        <div>
                                            <div className="diary-upload-preview-grid">
                                                {photoPreviews.map((preview, index) => (
                                                    <div key={index} style={{ 
                                                        position: 'relative',
                                                        width: '100%',
                                                        height: '100px',
                                                        overflow: 'hidden',
                                                        borderRadius: '8px'
                                                    }}>
                                                        <img 
                                                            src={preview} 
                                                            alt={`Preview ${index + 1}`} 
                                                            style={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'cover',
                                                                borderRadius: '8px',
                                                                border: '2px solid #eee',
                                                                boxSizing: 'border-box'
                                                            }}
                                                        />
                                                        <button
                                                            style={{
                                                                position: 'absolute',
                                                                top: '-5px',
                                                                right: '-5px',
                                                                width: '24px',
                                                                height: '24px',
                                                                borderRadius: '50%',
                                                                border: 'none',
                                                                backgroundColor: 'red',
                                                                color: 'white',
                                                                fontSize: '12px',
                                                                cursor: 'pointer',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                zIndex: 10,
                                                                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                                                            }}
                                                            onClick={() => {
                                                                setSelectedPhotos(prev => prev.filter((_, i) => i !== index));
                                                                setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
                                                            }}
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <div style={{ marginBottom: '10px' }}>
                                                <button
                                                    className="diary-upload-button"
                                                    onClick={handlePhotoUpload}
                                                    disabled={isUploading}
                                                >
                                                    {isUploading ? `Uploading... ${Math.round(uploadProgress)}%` : `Upload ${selectedPhotos.length} Photo${selectedPhotos.length !== 1 ? 's' : ''}`}
                                                </button>
                                                <button
                                                    className="diary-upload-cancel-button"
                                                    onClick={() => {
                                                        setSelectedPhotos([]);
                                                        setPhotoPreviews([]);
                                                        if (fileInputRef.current) {
                                                            fileInputRef.current.value = '';
                                                        }
                                                    }}
                                                >
                                                    Cancel All
                                                </button>
                                            </div>
                                            {uploadProgress > 0 && uploadProgress < 100 && (
                                                <div style={{
                                                    width: '100%',
                                                    height: '4px',
                                                    backgroundColor: '#eee',
                                                    borderRadius: '2px',
                                                    marginTop: '10px'
                                                }}>
                                                    <div style={{
                                                        width: `${uploadProgress}%`,
                                                        height: '100%',
                                                        backgroundColor: 'LightSalmon',
                                                        borderRadius: '2px',
                                                        transition: 'width 0.3s ease'
                                                    }}></div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div>
                                            <i className="material-icons" style={{ fontSize: '48px', color: '#ccc', marginBottom: '10px' }}>
                                                image
                                            </i>
                                            <p style={{ color: '#666', marginBottom: '25px', fontSize: '14px' }}>
                                                Click to select photos (max 9)
                                            </p>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handlePhotoSelect}
                                                style={{ display: 'none' }}
                                            />
                                            <button
                                                className="diary-upload-select-button"
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                Select Photos
                                            </button>
                                        </div>
                                    )}
                                </div>
                                
                                {showConfirmation && (
                                    <div style={{
                                        color: 'rgb(87, 177, 172)',
                                        fontSize: '14px',
                                        fontFamily: 'Raleway, sans-serif'
                                    }}>
                                        Photo uploaded successfully!
                                    </div>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                );

            default:
                return (
                    <Card className="diary-card">
                        <Card.Header>
                            <h4 className="diaryheader">Welcome to Your Diary</h4>
                        </Card.Header>
                        <Card.Body>
                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                <i className="material-icons" style={{ fontSize: '64px', color: '#57b1ac', marginBottom: '20px' }}>
                                    book
                                </i>
                                <h5>Choose an option from the sidebar to get started</h5>
                                <p style={{ color: '#666' }}>
                                    Track your mood, activities, goals, and more to build a comprehensive daily journal.
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                );
        }
    };

    return (
        <div className="diary-content-wrapper">
            {renderContent()}
        </div>
    );
};

export default DiaryContent;
