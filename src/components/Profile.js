import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UpdateAccount from './UpdateAccount';
import ConfirmationModal from './ConfirmationModal';
import float from '../images/float.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Row, Col, Image} from 'react-bootstrap';

export default function Profile(props) {
    const [updateClick, setUpdateClick] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const navigate = useNavigate();

    // Add debugging to see when props change
    console.log('Profile component rendered with currentUser:', props.currentUser);

    const handleUpdate = () => {
        setUpdateClick(true);
    };

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        props.handleDeleteUser(props.currentUser);
        setShowDeleteModal(false);
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
    };

    const handleAccountUpdate = (updatedUserData) => {
        // This function will be called when account is successfully updated
        console.log('Profile: handleAccountUpdate called with:', updatedUserData);
        
        // Don't close the update form immediately - let the success message show
        // The form will be closed by the UpdateAccount component after the timeout
        
        // The parent component (App.js) should handle refreshing the user data
        if (props.onAccountUpdate) {
            props.onAccountUpdate(updatedUserData);
        }
    };

    return (
        <Container className="profile">
            <Row>
                <Col xs={12} md={1}></Col>
                <Col id="one" xs={12} md={5}>
                    <Image id="float" src={float} alt="floating Astronauts" fluid />
                    <br/><br/>
                    <h4 className="text" style={{letterSpacing: '3px', fontWeight: 'bold', color: 'DimGrey'}}>{props.currentUser.name}</h4>
                    <br/>
                    <table style={{tableLayout: 'auto', width: 'auto', float: 'center', marginLeft: 'auto', marginRight: 'auto'}}>
                        <tbody>
                            <tr>
                                <td className="text" style={{fontSize: '16px', fontWeight: 'bold'}}>Name</td>
                                <td className="text" style={{fontSize: '16px'}}>{props.currentUser.name}</td>
                            </tr>
                            <tr>
                                <td className="text" style={{fontSize: '16px', fontWeight: 'bold'}}>Email</td>
                                <td className="text" style={{fontSize: '16px'}}>{props.currentUser.email}</td>
                            </tr>
                            <tr>
                                <td className="text" style={{fontSize: '16px', fontWeight: 'bold'}}>Username</td>
                                <td className="text" style={{fontSize: '16px'}}>{props.currentUser.username}</td>
                            </tr>
                        </tbody>
                    </table>
                    <br/><br/>
                    <button 
                        style={{backgroundColor: 'LightSalmon', marginRight: '10px'}} 
                        className="waves-effect waves-light btn-small" 
                        onClick={handleDeleteClick}
                    >
                        Delete Account
                    </button>
                    <button 
                        style={{backgroundColor: '#2c3e50'}} 
                        className="waves-effect waves-light btn-small" 
                        onClick={() => {
                            props.handleLogout();
                            navigate('/login');
                        }}
                    >
                        Log Out
                    </button>
                </Col>
                <Col xs={12} md={1}></Col>
                <Col xs={12} md={4}>
                    <a 
                        className="btn-floating btn-large waves-effect waves-light deep-orange lighten-3" 
                        onClick={handleUpdate}>
                        <i className="material-icons">settings</i>
                    </a>
                    {updateClick === true ? 
                        <UpdateAccount 
                            currentUser={props.currentUser} 
                            handleUpdate={handleUpdate}
                            onAccountUpdate={handleAccountUpdate}
                        /> : null
                    }
                </Col>
                <Col xs={12} md={1}></Col>
            </Row>
            
            <ConfirmationModal
                isOpen={showDeleteModal}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                title="Delete Account"
                message="Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data including diary entries, moods, and activities."
            />
        </Container>
    );
}