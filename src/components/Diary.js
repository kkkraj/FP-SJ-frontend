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
    const [selectedPhotos, setSelectedPhotos] = useState([]);
    const [photoPreviews, setPhotoPreviews] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef(null);



    const handleChange = (event) => {
        const { name, value } = event.target;
        // Sanitize user input to prevent XSS
        const sanitizedValue = DOMPurify.sanitize(value);
        setDiaryEntry(prevEntry => ({ ...prevEntry, [name]: sanitizedValue }));
    };

    const handlePhotoSelect = (event) => {
        const files = Array.from(event.target.files);
        processSelectedFiles(files);
    };

    const processSelectedFiles = (files) => {
        if (!files || files.length === 0) return;
        
        // Check if adding these files would exceed the 9 photo limit
        if (selectedPhotos.length + files.length > 9) {
            alert(`You can only upload a maximum of 9 photos. You currently have ${selectedPhotos.length} selected and trying to add ${files.length} more.`);
            return;
        }

        const validFiles = [];
        const newPreviews = [];

        files.forEach((file, index) => {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert(`File "${file.name}" is not an image file`);
                return;
            }
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert(`File "${file.name}" is too large. Please select images smaller than 5MB`);
                return;
            }

            validFiles.push(file);
            
            // Create preview
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
            
            // Clear the photo selection after successful upload
            setSelectedPhotos([]);
            setPhotoPreviews([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            
            // Show confirmation message
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
                                {photoPreviews.length > 0 ? (
                                    <div>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))',
                                            gap: '6px',
                                            marginBottom: '15px',
                                            maxHeight: '180px',
                                            overflowY: 'auto',
                                            padding: '5px',
                                            width: '100%',
                                            boxSizing: 'border-box'
                                        }}>
                                            {photoPreviews.map((preview, index) => (
                                                <div key={index} style={{ 
                                                    position: 'relative',
                                                    width: '100%',
                                                    height: '70px',
                                                    overflow: 'hidden',
                                                    borderRadius: '6px'
                                                }}>
                                                    <img 
                                                        src={preview} 
                                                        alt={`Preview ${index + 1}`} 
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover',
                                                            borderRadius: '6px',
                                                            border: '2px solid #eee',
                                                            boxSizing: 'border-box'
                                                        }}
                                                    />
                                                    <button
                                                        style={{
                                                            position: 'absolute',
                                                            top: '-3px',
                                                            right: '-3px',
                                                            width: '18px',
                                                            height: '18px',
                                                            borderRadius: '50%',
                                                            border: 'none',
                                                            backgroundColor: 'red',
                                                            color: 'white',
                                                            fontSize: '10px',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            zIndex: 10,
                                                            boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
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
                                                className="waves-effect waves-light btn-small"
                                                onClick={handlePhotoUpload}
                                                disabled={isUploading}
                                                style={{
                                                    backgroundColor: 'LightSalmon',
                                                    marginRight: '10px'
                                                }}
                                            >
                                                {isUploading ? `Uploading... ${Math.round(uploadProgress)}%` : `Upload ${selectedPhotos.length} Photo${selectedPhotos.length !== 1 ? 's' : ''}`}
                                            </button>
                                            <button
                                                className="waves-effect waves-light btn-small"
                                                onClick={() => {
                                                    setSelectedPhotos([]);
                                                    setPhotoPreviews([]);
                                                    if (fileInputRef.current) {
                                                        fileInputRef.current.value = '';
                                                    }
                                                }}
                                                style={{ backgroundColor: '#ccc' }}
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
                                        <p style={{ color: '#666', marginBottom: '15px', fontSize: '14px' }}>
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
                                            className="waves-effect waves-light btn-small"
                                            onClick={() => fileInputRef.current?.click()}
                                            style={{ backgroundColor: 'LightSalmon' }}
                                        >
                                            Select Photos
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
