import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from './ConfirmationModal';
import api from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Profile(props) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [updateFormData, setUpdateFormData] = useState({
        name: '',
        email: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwordFormData, setPasswordFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false
    });
    const [passwordError, setPasswordError] = useState('');
    const [updateError, setUpdateError] = useState('');
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    
    
    
    
    


    const handleAccountInfo = () => {
        setShowUpdateForm(false);
        setShowPasswordForm(false);
        setUpdateFormData({
            name: '',
            email: ''
        });
        setPasswordFormData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
    };

    const handleUpdateAccountInfo = () => {
        setShowUpdateForm(true);
        setShowPasswordForm(false);
        setUpdateFormData({
            name: props.currentUser.name || '',
            email: props.currentUser.email || ''
        });
        setPasswordFormData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
    };

    const handleFormInputChange = (e) => {
        const { name, value } = e.target;
        setUpdateFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (updateError) {
            setUpdateError('');
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        // Clear any previous errors
        setUpdateError('');
        
        // Prevent multiple submissions
        if (isSubmitting) {
            return;
        }
        
        // Client-side validation
        const trimmedName = updateFormData.name.trim();
        const trimmedEmail = updateFormData.email.trim();
        
        // Check if at least one field is provided
        if (!trimmedName && !trimmedEmail) {
            setUpdateError('Please provide at least one field to update');
            return;
        }
        
        // Validate name if provided
        if (trimmedName) {
            if (trimmedName.length < 2) {
                setUpdateError('Name must be at least 2 characters long');
                return;
            }
            if (trimmedName.length > 50) {
                setUpdateError('Name must be less than 50 characters');
                return;
            }
        }
        
        // Validate email if provided
        if (trimmedEmail) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(trimmedEmail)) {
                setUpdateError('Please enter a valid email address');
                return;
            }
        }
        
        // Check if there are any changes
        const hasNameChange = trimmedName && trimmedName !== props.currentUser.name;
        const hasEmailChange = trimmedEmail && trimmedEmail !== props.currentUser.email;
        
        if (!hasNameChange && !hasEmailChange) {
            setUpdateError('No changes detected. Please modify at least one field.');
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            const updateData = {};
            
            // Only include fields that have changed
            if (hasNameChange) {
                updateData.name = trimmedName;
            }
            if (hasEmailChange) {
                updateData.email = trimmedEmail;
            }
            
            const updatedUser = await api.auth.updateUser({
                id: props.currentUser.id,
                ...updateData
            });
            
            // Update the user data in parent component if we have user data
            if (props.onAccountUpdate && (updatedUser.user || updatedUser.name || updatedUser.email)) {
                props.onAccountUpdate(updatedUser);
            }
            
            setShowUpdateForm(false);
            setUpdateError('');
            
            // Show success message
            setSuccessMessage('Account updated successfully!');
            
            // Hide success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
            
        } catch (error) {
            console.error('Error updating account:', error);
            
            // Handle specific backend validation errors
            const errorMessage = error.message || 'Please try again.';
            let userFriendlyMessage = errorMessage;
            
            // Map backend error codes to user-friendly messages
            if (errorMessage.includes('no_fields_provided')) {
                userFriendlyMessage = 'Please provide at least one field to update';
            } else if (errorMessage.includes('name_required')) {
                userFriendlyMessage = 'Name field is required';
            } else if (errorMessage.includes('name_too_short')) {
                userFriendlyMessage = 'Name must be at least 2 characters long';
            } else if (errorMessage.includes('name_too_long')) {
                userFriendlyMessage = 'Name must be less than 50 characters';
            } else if (errorMessage.includes('name_unchanged')) {
                userFriendlyMessage = 'New name is the same as current name';
            } else if (errorMessage.includes('email_required')) {
                userFriendlyMessage = 'Email field is required';
            } else if (errorMessage.includes('invalid_email_format')) {
                userFriendlyMessage = 'Please enter a valid email address';
            } else if (errorMessage.includes('email_unchanged')) {
                userFriendlyMessage = 'New email is the same as current email';
            } else if (errorMessage.includes('email_taken')) {
                userFriendlyMessage = 'This email is already used by another user';
            }
            
            setUpdateError(userFriendlyMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancelUpdate = () => {
        setShowUpdateForm(false);
        setUpdateFormData({ name: '', email: '' });
        setUpdateError('');
    };

    const handleChangePassword = () => {
        setShowPasswordForm(true);
        setShowUpdateForm(false);
        setPasswordFormData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setUpdateFormData({
            name: '',
            email: ''
        });
    };

    const handlePasswordFormInputChange = (e) => {
        const { name, value } = e.target;
        setPasswordFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (passwordError) {
            setPasswordError('');
        }
    };

    const togglePasswordVisibility = (fieldName) => {
        setShowPasswords(prev => ({
            ...prev,
            [fieldName]: !prev[fieldName]
        }));
    };

    const handlePasswordFormSubmit = async (e) => {
        e.preventDefault();
        
        // Clear any previous errors
        setPasswordError('');
        
        // Prevent multiple submissions
        if (isSubmitting) {
            return;
        }
        
        // Validate required fields
        if (!passwordFormData.currentPassword.trim()) {
            setPasswordError('Current password is required');
            return;
        }
        
        if (!passwordFormData.newPassword.trim()) {
            setPasswordError('New password is required');
            return;
        }
        
        if (!passwordFormData.confirmPassword.trim()) {
            setPasswordError('Password confirmation is required');
            return;
        }
        
        // Validate passwords
        if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
            setPasswordError('New password and confirmation do not match');
            return;
        }
        
        if (passwordFormData.newPassword.length < 6) {
            setPasswordError('New password must be at least 6 characters long');
            return;
        }
        
        if (passwordFormData.newPassword.length > 128) {
            setPasswordError('New password must be less than 128 characters');
            return;
        }
        
        if (passwordFormData.currentPassword === passwordFormData.newPassword) {
            setPasswordError('New password must be different from current password');
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            const response = await api.auth.updatePassword({
                current_password: passwordFormData.currentPassword,
                new_password: passwordFormData.newPassword,
                password_confirmation: passwordFormData.confirmPassword
            });
            
            console.log('Password update successful:', response);
            
            setShowPasswordForm(false);
            setPasswordFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setPasswordError('');
            
            // Show success message
            setSuccessMessage('Password updated successfully!');
            
            // Hide success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
            
        } catch (error) {
            console.error('Error updating password:', error);
            
            // Handle specific backend validation errors
            const errorMessage = error.message || 'Please try again.';
            let userFriendlyMessage = errorMessage;
            
            // Map backend error codes to user-friendly messages
            if (errorMessage.includes('invalid_current_password')) {
                userFriendlyMessage = 'Current password is incorrect. Please try again.';
            } else if (errorMessage.includes('current_password_required')) {
                userFriendlyMessage = 'Current password is required.';
            } else if (errorMessage.includes('new_password_required')) {
                userFriendlyMessage = 'New password is required.';
            } else if (errorMessage.includes('password_confirmation_required')) {
                userFriendlyMessage = 'Password confirmation is required.';
            } else if (errorMessage.includes('new_password_too_short')) {
                userFriendlyMessage = 'New password must be at least 6 characters long.';
            } else if (errorMessage.includes('new_password_too_long')) {
                userFriendlyMessage = 'New password must be less than 128 characters.';
            } else if (errorMessage.includes('passwords_dont_match')) {
                userFriendlyMessage = 'New password and confirmation do not match.';
            } else if (errorMessage.includes('same_password')) {
                userFriendlyMessage = 'New password must be different from current password.';
            } else if (errorMessage.includes('password_update_failed')) {
                userFriendlyMessage = 'Failed to update password. Please try again.';
            }
            
            setPasswordError(userFriendlyMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancelPasswordUpdate = () => {
        setShowPasswordForm(false);
        setPasswordFormData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setPasswordError('');
    };

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        props.handleDeleteUser(props.currentUser);
        setShowDeleteModal(false);
        // Redirect to home page after successful account deletion
        navigate('/home');
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
    };


    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file.');
                return;
            }
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB.');
                return;
            }
            
            setSelectedFile(file);
            
            // Create preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewUrl(e.target.result);
            };
            reader.readAsDataURL(file);
            
            // Upload the file immediately
            handlePhotoUpload(file);
        }
    };

    const handlePhotoUpload = async (file) => {
        try {
            const formData = new FormData();
            formData.append('photo', file);
            formData.append('user_id', props.currentUser.id);
            
            const data = await api.auth.uploadProfilePicture(formData);
            console.log('Photo upload successful:', data);
            console.log('Upload response structure:', JSON.stringify(data, null, 2));
            
            // Create the updated user data with the new photo URL
            const photoUrl = data.photo_url || data.photo;
            const updatedUserData = {
                ...props.currentUser,
                photo: photoUrl
            };
            
            console.log('Updated user data with photo:', updatedUserData);
            
            // Store photo URL in localStorage for persistence across sessions
            if (photoUrl) {
                localStorage.setItem('user_photo', photoUrl);
                console.log('Photo URL stored in localStorage:', photoUrl);
            }
            
            // Notify parent component about the successful update
            if (props.onAccountUpdate) {
                console.log('Profile: Calling onAccountUpdate from photo upload');
                props.onAccountUpdate(updatedUserData);
            }
            
            // Clear the selected file and preview
            setSelectedFile(null);
            setPreviewUrl(null);
            
        } catch (error) {
            console.error('Photo upload failed:', error);
            alert('Failed to upload profile picture. Please try again.');
        }
    };

    const handleCameraClick = () => {
        fileInputRef.current.click();
    };

    const handleDeletePhoto = async () => {
        if (window.confirm('Are you sure you want to delete your profile picture?')) {
            try {
                const response = await api.auth.deleteProfilePicture();
                console.log('Photo delete successful:', response);
                
                // Create the updated user data without the photo
                const updatedUserData = {
                    ...props.currentUser,
                    photo: null
                };
                
                console.log('Updated user data without photo:', updatedUserData);
                
                // Clear photo URL from localStorage
                localStorage.removeItem('user_photo');
                console.log('Photo URL removed from localStorage');
                
                // Notify parent component about the successful update
        if (props.onAccountUpdate) {
                    console.log('Profile: Calling onAccountUpdate from photo delete');
            props.onAccountUpdate(updatedUserData);
                }
                
            } catch (error) {
                console.error('Photo delete failed:', error);
                alert('Failed to delete profile picture. Please try again.');
            }
        }
    };

    return (
        <>
            <div className="account-settings-container">
                <div className="account-sidebar-left">
                </div>
                
                <div className="account-sidebar">
                    <h1 className="account-title">Account settings</h1>
                    
                    <div className="sidebar-nav">
                        <div className={`nav-item ${!showUpdateForm && !showPasswordForm ? 'active' : ''}`} onClick={handleAccountInfo}>
                            <i className="material-icons">info</i>
                            <span>Account Info</span>
                        </div>
                        <div className={`nav-item ${showUpdateForm ? 'active' : ''}`} onClick={handleUpdateAccountInfo}>
                            <i className="material-icons">person</i>
                            <span>Update account info</span>
                        </div>
                        <div className={`nav-item ${showPasswordForm ? 'active' : ''}`} onClick={handleChangePassword}>
                            <i className="material-icons">lock</i>
                            <span>Change password</span>
                        </div>
                        <div className="nav-item" onClick={handleDeleteClick}>
                            <i className="material-icons">delete</i>
                            <span>Delete account</span>
                        </div>
                    </div>
                </div>
                
                <div className="account-content">
                    {!showUpdateForm && !showPasswordForm ? (
                        <>
                            <div className="profile-picture-container">
                                {props.currentUser && props.currentUser.photo ? (
                                    <img 
                                        src={props.currentUser.photo} 
                                        alt="Profile" 
                                        className="profile-picture"
                                    />
                                ) : (
                                    <div className="profile-picture-placeholder">
                                        {props.currentUser && props.currentUser.name ? 
                                            props.currentUser.name.charAt(0).toUpperCase() : 
                                            (props.currentUser && props.currentUser.email ? 
                                                props.currentUser.email.charAt(0).toUpperCase() : 
                                                'U'
                                            )
                                        }
                                    </div>
                                )}
                            </div>
                            
                            {/* Action Buttons Below Profile Picture */}
                            <div className="profile-actions">
                                <div className="camera-icon" onClick={handleCameraClick}>
                                    <i className="material-icons">camera_alt</i>
                                </div>
                                
                                {/* Delete Icon - only show if user has a photo */}
                                {props.currentUser && props.currentUser.photo && (
                                    <div className="delete-icon" onClick={handleDeletePhoto}>
                                        <i className="material-icons">delete</i>
                                    </div>
                                )}
                            </div>
                            
                            {/* Hidden File Input */}
                            <input 
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                                style={{display: 'none'}}
                            />
                            
                            <div className="user-info">
                                <div className="info-item">
                                    <div className="info-label">Name</div>
                                    <div className="info-value">{props.currentUser.name}</div>
                                </div>
                                <div className="info-divider"></div>
                                <div className="info-item">
                                    <div className="info-label">Email</div>
                                    <div className="info-value">{props.currentUser.email}</div>
                                </div>
                            </div>
                        </>
                    ) : showUpdateForm ? (
                        <div className="update-form-container">
                            {updateError && (
                                <div className="error-message">
                                    {updateError}
                                </div>
                            )}
                            <form className="update-form" onSubmit={handleFormSubmit} noValidate>
                                <div className="form-group">
                                    <label htmlFor="name" className="form-label">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={updateFormData.name}
                                        onChange={handleFormInputChange}
                                        className="form-input"
                                        placeholder={props.currentUser.name}
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={updateFormData.email}
                                        onChange={handleFormInputChange}
                                        className="form-input"
                                        placeholder={props.currentUser.email}
                                    />
                                </div>
                                
                                <div className="form-actions">
                                    <button type="button" className="cancel-button" onClick={handleCancelUpdate}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="update-button" disabled={isSubmitting}>
                                        {isSubmitting ? 'Updating...' : 'Update Account'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : showPasswordForm ? (
                        <div className="update-form-container">
                            {passwordError && (
                                <div className="error-message">
                                    {passwordError}
                                </div>
                            )}
                            <form className="update-form" onSubmit={handlePasswordFormSubmit} noValidate>
                                <div className="form-group">
                                    <label htmlFor="currentPassword" className="form-label">Current Password</label>
                                    <div className="password-input-wrapper">
                                        <input
                                            type={showPasswords.currentPassword ? "text" : "password"}
                                            id="currentPassword"
                                            name="currentPassword"
                                            value={passwordFormData.currentPassword}
                                            onChange={handlePasswordFormInputChange}
                                            className="form-input"
                                            placeholder="Enter your current password"
                                        />
                    <button 
                                            type="button"
                                            className="password-toggle"
                                            onClick={() => togglePasswordVisibility('currentPassword')}
                                        >
                                            {showPasswords.currentPassword ? (
                                                <i className="material-icons">visibility_off</i>
                                            ) : (
                                                <i className="material-icons">visibility</i>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="newPassword" className="form-label">New Password</label>
                                    <div className="password-input-wrapper">
                                        <input
                                            type={showPasswords.newPassword ? "text" : "password"}
                                            id="newPassword"
                                            name="newPassword"
                                            value={passwordFormData.newPassword}
                                            onChange={handlePasswordFormInputChange}
                                            className="form-input"
                                            placeholder="Enter your new password"
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={() => togglePasswordVisibility('newPassword')}
                                        >
                                            {showPasswords.newPassword ? (
                                                <i className="material-icons">visibility_off</i>
                                            ) : (
                                                <i className="material-icons">visibility</i>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                                    <div className="password-input-wrapper">
                                        <input
                                            type={showPasswords.confirmPassword ? "text" : "password"}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={passwordFormData.confirmPassword}
                                            onChange={handlePasswordFormInputChange}
                                            className="form-input"
                                            placeholder="Confirm your new password"
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={() => togglePasswordVisibility('confirmPassword')}
                                        >
                                            {showPasswords.confirmPassword ? (
                                                <i className="material-icons">visibility_off</i>
                                            ) : (
                                                <i className="material-icons">visibility</i>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="form-actions">
                                    <button type="button" className="cancel-button" onClick={handleCancelPasswordUpdate}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="update-button" disabled={isSubmitting}>
                                        {isSubmitting ? 'Updating...' : 'Update Password'}
                    </button>
                                </div>
                            </form>
                        </div>
                    ) : null}

                    {successMessage && (
                        <div className="success-message">
                            {successMessage}
                        </div>
                    )}
                </div>
                
                <div className="account-sidebar-right">
                </div>
            </div>
            
            <ConfirmationModal
                isOpen={showDeleteModal}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                title="Delete Account"
                message="Are you sure you want to delete your account? This will permanently remove all your data, including journal entries, moods, and activities."
            />
            </>
    );
}