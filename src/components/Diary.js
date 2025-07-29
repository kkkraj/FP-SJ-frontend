import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import Moods from './Moods';
import Activities from './Activities';
import {Container, Row, Col} from 'react-bootstrap';

export default function Diary(props) {
    const [diaryEntry, setDiaryEntry] = useState({
        title: "",
        content: "",
        user_id: props.currentUser.id
    });

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

    const createNewDiaryEntry = (diaryEntryData) => {
        fetch("http://localhost:3000/diary_entries", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(diaryEntryData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Diary entry created:', data);
            setDiaryEntry({ ...diaryEntry, title: "", content: "" });
        })
        .catch(error => {
            console.error('Error creating diary entry:', error);
        });
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
                            <input 
                                className="dtitle" 
                                placeholder="title"
                                value={diaryEntry.title} 
                                name="title" 
                                onChange={handleChange} 
                                style={{width: '60%', borderBottom: 'dotted 2px salmon'}}
                            /><br/><br/>
                            <textarea 
                               className="text" 
                               placeholder="Begin Today Journal Here!" 
                               value={diaryEntry.content} 
                               name="content" 
                               onChange={handleChange} 
                               style={{height: 180, width: 600, border: 'none' ,borderBottom: 'dotted 2px salmon'}}
                            ></textarea>
                            <input 
                                className="waves-effect waves-light btn-small" 
                                type="submit" 
                                value="Submit Journal" 
                                style={{backgroundColor: 'LightSalmon', marginTop: '10px'}} 
                            />
                        </form>  
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
