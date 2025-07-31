import React, { useState } from 'react';
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
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        // Sanitize user input to prevent XSS
        const sanitizedValue = DOMPurify.sanitize(value);
        setDiaryEntry(prevEntry => ({ ...prevEntry, [name]: sanitizedValue }));
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
                        <br/>
                        <a className="btn-floating btn-medium waves-effect waves-light deep-orange lighten-3">
                            <i className="material-icons">image</i>
                        </a>
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
