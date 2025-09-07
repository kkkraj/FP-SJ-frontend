import React, { useState, useRef } from 'react';
import api from '../services/api';

export default function UpdateAccount(props) {
    const [user, setUser] = useState({
        id: props.currentUser.id,
        name: '',
        email: '',
        username: ''
    });
    const [activeField, setActiveField] = useState(null); // 'name', 'email', 'username', 'photo', or null
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);
    
    const handleChange = (event) => {
        const { name, value } = event.target;
        setUser(prevUser => ({ ...prevUser, [name]: value }));
        // Clear messages when user starts typing
        if (successMessage) setSuccessMessage('');
        if (errorMessage) setErrorMessage('');
    }
    
    const handleFieldButtonClick = (fieldName) => {
        setActiveField(fieldName);
        setSuccessMessage('');
        setErrorMessage('');
        setSelectedFile(null);
        setPreviewUrl(null);
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setErrorMessage('Please select an image file.');
                return;
            }
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setErrorMessage('File size must be less than 5MB.');
                return;
            }
            
            setSelectedFile(file);
            setErrorMessage('');
            
            // Create preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewUrl(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    }
    
    const handleSubmit = (event) => {
        event.preventDefault();
        if (activeField === 'photo' && selectedFile) {
            handlePhotoUpload();
        } else if (activeField && user[activeField]) {
            // Only send the updated field and user ID to the backend
            const updateData = {
                id: props.currentUser.id,
                [activeField]: user[activeField]
            };
            handleUpdateUser(updateData);
        }
    }

    const handlePhotoUpload = async () => {
        try {
            const formData = new FormData();
            formData.append('photo', selectedFile);
            formData.append('user_id', props.currentUser.id);
            
            const data = await api.auth.uploadProfilePicture(formData);
            console.log('Photo upload successful:', data);
            
            // Show success message
            setSuccessMessage('Profile picture uploaded successfully!');
            setErrorMessage('');
            
            // Create the updated user data with the new photo URL
            const updatedUserData = {
                ...props.currentUser,
                photo: data.photo_url || data.photo
            };
            
            console.log('Updated user data with photo:', updatedUserData);
            
            // Notify parent component about the successful update
            if (props.onAccountUpdate) {
                console.log('Calling onAccountUpdate with photo:', updatedUserData);
                props.onAccountUpdate(updatedUserData);
            }
            
            // Clear the form and reset active field after a short delay
            setTimeout(() => {
                setSelectedFile(null);
                setPreviewUrl(null);
                setActiveField(null);
            }, 2000);
            
        } catch (error) {
            console.error('Photo upload failed:', error);
            setErrorMessage('Failed to upload profile picture. Please try again.');
            setSuccessMessage('');
        }
    }

    const handleUpdateUser = async (userData) => {
        try {
            const data = await api.auth.updateUser(userData);
            console.log('Update successful:', data);
            console.log('Update data structure:', typeof data, data);
            console.log('Current user data:', props.currentUser);
            console.log('User data being sent:', userData);
            
            // Show success message first
            setSuccessMessage('Your account has been successfully updated!');
            setErrorMessage('');
            
            // Create the updated user data by merging with existing data
            // We need to ensure we preserve all existing fields and only update the changed one
            const updatedUserData = {
                ...props.currentUser,  // Keep all existing data
                ...userData           // Override only the updated field
            };
            
            // Ensure we have the user ID
            if (!updatedUserData.id && props.currentUser.id) {
                updatedUserData.id = props.currentUser.id;
            }
            
            console.log('Merged user data:', updatedUserData);
            
            // Notify parent component about the successful update
            if (props.onAccountUpdate) {
                console.log('Calling onAccountUpdate with:', updatedUserData);
                props.onAccountUpdate(updatedUserData);
            }
            
            // Clear the form and reset active field after a short delay
            setTimeout(() => {
                setUser({
                    id: props.currentUser.id,
                    name: '',
                    email: '',
                    username: ''
                });
                setActiveField(null);
            }, 2000); // Keep success message visible for 2 seconds
            
        } catch (error) {
            console.error('Update failed:', error);
            setErrorMessage('Failed to update account. Please try again.');
            setSuccessMessage('');
        }
    }

    return (
        <div>
            <br/><br/>
            <h3 className="text" style={{fontWeight: 'bold', color: 'LightSeaGreen'}}>Update Account</h3>
            <br/><br/>
            
            {/* Update Buttons */}
            <div style={{marginBottom: '20px'}}>
                <button 
                    style={{
                        backgroundColor: activeField === 'name' ? '#28a745' : 'LightSalmon',
                        marginRight: '10px',
                        marginBottom: '10px'
                    }} 
                    className="waves-effect waves-light btn-small"
                    onClick={() => handleFieldButtonClick('name')}
                >
                    Update Name
                </button>
                
                <button 
                    style={{
                        backgroundColor: activeField === 'email' ? '#28a745' : 'LightSalmon',
                        marginRight: '10px',
                        marginBottom: '10px'
                    }} 
                    className="waves-effect waves-light btn-small"
                    onClick={() => handleFieldButtonClick('email')}
                >
                    Update Email
                </button>
                
                <button 
                    style={{
                        backgroundColor: activeField === 'username' ? '#28a745' : 'LightSalmon',
                        marginRight: '10px',
                        marginBottom: '10px'
                    }} 
                    className="waves-effect waves-light btn-small"
                    onClick={() => handleFieldButtonClick('username')}
                >
                    Update Username
                </button>
                
                <button 
                    style={{
                        backgroundColor: activeField === 'photo' ? '#28a745' : 'LightSalmon',
                        marginRight: '10px',
                        marginBottom: '10px'
                    }} 
                    className="waves-effect waves-light btn-small"
                    onClick={() => handleFieldButtonClick('photo')}
                >
                    Update Photo
                </button>
            </div>
            
            {/* Dynamic Form Field */}
            {activeField && (
                <form onSubmit={handleSubmit}>
                    {activeField === 'photo' ? (
                        <div>
                            <div style={{marginBottom: '15px'}}>
                                <input 
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    ref={fileInputRef}
                                    style={{display: 'none'}}
                                />
                                <button 
                                    type="button"
                                    style={{backgroundColor: '#17a2b8', marginRight: '10px'}} 
                                    className="waves-effect waves-light btn-small"
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    Choose Photo
                                </button>
                                {selectedFile && (
                                    <span style={{color: '#28a745', fontWeight: 'bold'}}>
                                        {selectedFile.name}
                                    </span>
                                )}
                            </div>
                            
                            {previewUrl && (
                                <div style={{marginBottom: '15px'}}>
                                    <img 
                                        src={previewUrl} 
                                        alt="Preview" 
                                        style={{
                                            width: '100px', 
                                            height: '100px', 
                                            objectFit: 'cover', 
                                            borderRadius: '50%',
                                            border: '2px solid #ddd'
                                        }}
                                    />
                                </div>
                            )}
                            
                            <button 
                                style={{backgroundColor: 'LightSalmon'}} 
                                className="waves-effect waves-light btn-small" 
                                type="submit"
                                disabled={!selectedFile}
                            >
                                Upload Photo
                            </button>
                        </div>
                    ) : (
                        <div>
                            <input 
                                name={activeField}
                                value={user[activeField]}
                                onChange={handleChange}
                                placeholder={`Enter new ${activeField}`}
                            />
                            <label className="active" style={{float: 'left'}}>
                                {activeField.charAt(0).toUpperCase() + activeField.slice(1)}
                            </label>
                            <br/>
                            <button 
                                style={{backgroundColor: 'LightSalmon'}} 
                                className="waves-effect waves-light btn-small" 
                                type="submit"
                                disabled={!user[activeField]}
                            >
                                Update {activeField.charAt(0).toUpperCase() + activeField.slice(1)}
                            </button>
                        </div>
                    )}
                    
                    {successMessage && (
                        <p style={{color: 'green', marginTop: '10px', fontWeight: 'bold'}}>
                            {successMessage}
                        </p>
                    )}
                    
                    {errorMessage && (
                        <p style={{color: 'red', marginTop: '10px', fontWeight: 'bold'}}>
                            {errorMessage}
                        </p>
                    )}
                </form>
            )}
        </div>
    );
}