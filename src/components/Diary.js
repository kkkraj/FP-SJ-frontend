import React, { useState, useRef } from 'react';
import DOMPurify from 'dompurify';
import Moods from './Moods';
import Activities from './Activities';
import {Container, Row, Col} from 'react-bootstrap';
import api from '../services/api';

export default function Diary(props) {
    const [diaryEntry, setDiaryEntry] = useState({
        content: "",
        user_id: props.currentUser.id
    });
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const fileInputRef = useRef(null);



    const handleChange = (event) => {
        const { name, value } = event.target;
        // Sanitize user input to prevent XSS
        const sanitizedValue = DOMPurify.sanitize(value);
        setDiaryEntry(prevEntry => ({ ...prevEntry, [name]: sanitizedValue }));
    };

    const handlePhotoSelect = (event) => {
        const file = event.target.files[0];
        processSelectedFile(file);
    };

    const processSelectedFile = (file) => {
        if (!file) return;
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Please select an image smaller than 5MB');
            return;
        }

        setSelectedPhoto(file);
        
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setPhotoPreview(e.target.result);
        };
        reader.readAsDataURL(file);
    };



    const handlePhotoUpload = async () => {
        if (!selectedPhoto) {
            alert('Please select a photo first');
            return;
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('photo', selectedPhoto);
            formData.append('user_id', diaryEntry.user_id);

            const data = await api.diary.uploadPhoto(formData);
            console.log('Photo uploaded:', data);
            
            // Clear the photo selection after successful upload
            setSelectedPhoto(null);
            setPhotoPreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            
            // Show confirmation message
            setShowConfirmation(true);
            setTimeout(() => {
                setShowConfirmation(false);
            }, 3000);
        } catch (error) {
            console.error('Error uploading photo:', error);
            alert('Failed to upload photo. Please try again.');
        } finally {
            setIsUploading(false);
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
            
            // Show confirmation message
            setShowConfirmation(true);
            setTimeout(() => {
                setShowConfirmation(false);
            }, 3000); // Hide after 3 seconds
        } catch (error) {
            console.error('Error creating diary entry:', error);
        }
    };

    return (
        <div id="diary">
            <Container>
                <Row>
                    <Col xs={12} md={4}>
                        <h4 className="diaryheader">Today Moods</h4>
                    </Col>
                    <Col xs={12} md={1}></Col>
                    <Col xs={12} md={7}>
                        <h4 className="diaryheader">Today Activities</h4>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} md={4}>
                        <Moods currentUserId={diaryEntry.user_id} />
                    </Col>
                    <Col xs={12} md={1}></Col>
                    <Col xs={12} md={7}>
                        <Activities currentUserId={diaryEntry.user_id} />
                    </Col>
                </Row>
            </Container>
            <br/>
            <Container>
                <Row>
                    <Col xs={12} md={4}>
                        <h4 className="diaryheader">Photo</h4>
                    </Col>
                    <Col xs={12} md={1}></Col>
                    <Col xs={12} md={7}>
                        <h4 className="diaryheader">Today Journal</h4>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} md={4}>
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                            {/* Photo Upload Area */}
                            <div 
                                style={{
                                    padding: '20px',
                                    marginBottom: '15px',
                                    minHeight: '150px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '2px dashed #ccc',
                                    borderRadius: '10px',
                                    backgroundColor: '#f9f9f9',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {photoPreview ? (
                                    <div>
                                        <img 
                                            src={photoPreview} 
                                            alt="Preview" 
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '200px',
                                                borderRadius: '8px',
                                                marginBottom: '10px'
                                            }}
                                        />
                                        <div style={{ marginBottom: '10px' }}>
                                            <button
                                                className="waves-effect waves-light btn-small"
                                                onClick={handlePhotoUpload}
                                                disabled={isUploading}
                                                style={{
                                                    backgroundColor: 'LightSalmon',
                                                    marginRight: '10px'
                                                }}
                                            >
                                                {isUploading ? 'Uploading...' : 'Upload Photo'}
                                            </button>
                                            <button
                                                className="waves-effect waves-light btn-small"
                                                onClick={() => {
                                                    setSelectedPhoto(null);
                                                    setPhotoPreview(null);
                                                    if (fileInputRef.current) {
                                                        fileInputRef.current.value = '';
                                                    }
                                                }}
                                                style={{ backgroundColor: '#ccc' }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <i className="material-icons" style={{ fontSize: '48px', color: '#ccc', marginBottom: '10px' }}>
                                            image
                                        </i>
                                        <p style={{ color: '#666', marginBottom: '15px', fontSize: '14px' }}>
                                            Click to select a photo
                                        </p>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoSelect}
                                            style={{ display: 'none' }}
                                        />
                                        <button
                                            className="waves-effect waves-light btn-small"
                                            onClick={() => fileInputRef.current?.click()}
                                            style={{ backgroundColor: 'LightSalmon' }}
                                        >
                                            Select Photo
                                        </button>
                                    </div>
                                )}
                            </div>
                            
                            {/* Upload Confirmation */}
                            {showConfirmation && (
                                <div style={{
                                    color: 'rgb(87, 177, 172)',
                                    fontSize: '14px',
                                    fontFamily: 'Raleway, sans-serif',
                                    fontWeight: 'bold'
                                }}>
                                    ✓ Photo uploaded successfully!
                                </div>
                            )}
                        </div>
                    </Col>
                    <Col xs={12} md={1}></Col>
                    <Col xs={12} md={7}>
                        <form id="entry" onSubmit={handleSubmit}>
                            <textarea 
                               className="text" 
                               placeholder="Begin Today Journal Here!" 
                               value={diaryEntry.content} 
                               name="content" 
                               onChange={handleChange} 
                               style={{
                                   height: '250px', 
                                   width: '100%', 
                                   border: 'none',
                                   resize: 'none',
                                   padding: '15px',
                                   fontSize: '14px',
                                   fontFamily: 'Raleway, sans-serif',
                                   lineHeight: '1.6'
                               }}
                            ></textarea>
                            <input 
                                className="waves-effect waves-light btn-small" 
                                type="submit" 
                                value="Submit Journal" 
                                style={{backgroundColor: 'LightSalmon', marginTop: '10px'}} 
                            />
                            {showConfirmation && (
                                <div style={{
                                    color: 'rgb(87, 177, 172)',
                                    fontSize: '14px',
                                    marginTop: '10px',
                                    fontFamily: 'Raleway, sans-serif',
                                    fontWeight: 'bold'
                                }}>
                                    ✓ Journal entry saved successfully!
                                </div>
                            )}
                        </form>  
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
